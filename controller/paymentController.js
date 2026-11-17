const { PaymentHistory, Enquiry, Customer, User, Order, OutletUser, Message, Payment } = require("../model");
const axios = require("axios");
const { sendPaymentLink, checkPendingPayments } = require("../helper/payment");
const crypto = require('crypto');
const cron = require('node-cron');
const { createAmount } = require("../helper/ax-function");
const { customerOutstandingAmount, enquirySalesQuotationAmount } = require("../helper/ax-function")
const { Op, Sequelize } = require("sequelize");
const { dataNotFound, dataFound, encrypt } = require("../helper/functions");
const { book_installation_time_slot, IC_payment_confirmation, estimate_create_reminder, advance_payment_message, estimate_create_message, Qc1_message_with_payment, Qc3_message_with_payemnt } = require('../helper/messages');
const { whatsappMessage } = require('../helper/mailer');

exports.sendPaymentLink = async (req, res, next) => {
    try {
        const { amount, enquiryId, payment_type } = req.body;
        const enquiry = await Enquiry.findByPk(enquiryId);

        if (amount && payment_type && enquiry) {

            const customer = await Customer.findOne({ where: { id: enquiry.customerId } });

            const paymentHistory = await PaymentHistory.findOne({ where: { enquiry_Id: enquiryId, payment_type } });
            if (!paymentHistory) {

                const data = await sendPaymentLink(enquiryId, amount, payment_type);
                const paymentLink = data.short_url;

                if (payment_type === "enquiry_advance") {

                    await Message.create({
                        message: "advance_payment_message",
                        enquiryId: enquiry.id
                    })
                    const message = advance_payment_message(customer.firstName + ' ' + customer.lastName, paymentLink, amount)
                    whatsappMessage(message, customer.primary_phone);

                } else if (payment_type === "order_advance") {

                    await Message.create({
                        message: "estimate_create_message",
                        enquiryId: enquiry.id
                    })

                    const user = await OutletUser.findOne({ where: { salesPersonId: enquiry.salesId }, include: { model: User, as: "outlet", attributes: ['phone'] } });
                    const storeNumber = user?.outlet?.phone || ''
                    const message = estimate_create_message(customer.firstName + ' ' + customer.lastName, storeNumber, paymentLink, amount)
                    whatsappMessage(message, customer.primary_phone);

                } else if (payment_type === "order_complete") {

                    await Message.create({
                        message: "Qc1_message_with_payment",
                        enquiryId: enquiry.id
                    })
                    const message = Qc1_message_with_payment(customer.firstName + ' ' + customer.lastName, enquiry.enquiryId, paymentLink, amount)
                    whatsappMessage(message, customer.primary_phone)

                } else if (payment_type === "final_payment") {
                    await Message.create({
                        message: "Qc3_message_with_payemnt",
                        enquiryId: enquiry.id
                    })

                    const message = Qc3_message_with_payemnt(customer.firstName + ' ' + customer.lastName, paymentLink, amount)
                    whatsappMessage(message, customer.primary_phone)
                }

                return res.status(200).json({
                    message: 'Payment Link Send Successfully',
                    data: data,
                    status: true
                });

            } else {
                throw new Error("Payment Link already sent")
            }
        } else {
            throw new Error("Amount, payment_type and enquiryId is required")
        }


    } catch (e) {
        next(e)
    }
};


exports.getSentPaymentLinks = async (req, res, next) => {
    try {
        const enquiry = await Enquiry.findOne({ where: { id: req.query.enquiryId } });
        const customer = await Customer.findOne({ where: { id: enquiry.customerId } });

        //const paymentLinks = await PaymentHistory.findAll({ where: { enquiry_Id: req.query.enquiryId }, attributes: ['payment_type'], order: [['createdAt', 'ASC']], group: ['payment_type'] });

        const paymentLinks = await PaymentHistory.findAll({
                            where: { enquiry_Id: req.query.enquiryId },
                            attributes: [
                              'payment_type',
                              [Sequelize.fn('MIN', Sequelize.col('createdAt')), 'createdAt']
                            ],
                            group: ['payment_type'],
                            order: [[Sequelize.fn('MIN', Sequelize.col('createdAt')), 'ASC']]
                    });

        const data = await customerOutstandingAmount(customer.ACCOUNTNUM)
        const customerOutstanding = data.openSoAmount + data.ledgerAmount;

        const enquirySalesQuotation = await enquirySalesQuotationAmount(enquiry.enquiryId)

        return res.status(200).json({
            message: 'Payment Links',
            data: { paymentLinks, customerOutstanding, enquirySalesQuotation },
            status: true
        });
    } catch (e) {
        next(e)
    }
}


exports.paymentHistory = async (req, res, next) => {
    try {

        if (req.query.enquiryId) {
            const history = await PaymentHistory.findAll({
                where: { enquiry_Id: req.query.enquiryId },
                attributes: { exclude: ['data'] },
                include: [
                    {
                        model: Payment,
                        attributes: { exclude: ['data'] }
                    }
                ],
                order: [['id', 'ASC']]
            });
            return res.status(200).json({
                message: 'Fatched payment history',
                data: history,
                status: true
            });
        }

        const page = parseInt(req.query.pageNo) || 1;
        const perPage = parseInt(req.query.pageSize) || 20;
        const date = req.query.date || '';
        const offset = (page - 1) * perPage;
        let filter = {};

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999)

            filter.createdAt = {
                [Sequelize.Op.between]: [startOfDay, endOfDay],
            };
        }

        const enquiry_where = {}
        if (req.query.enquiry) {
            enquiry_where.enquiry_Id = req.query.enquiry
        }

        if (req.query.ax_status) {
            filter.ax_status = req.query.ax_status
        }

        const history = await Payment.findAndCountAll({
            where: filter,
            attributes: { exclude: ['data'] },
            include: [
                {
                    model: PaymentHistory,
                    where: enquiry_where,
                    attributes: { exclude: ['data'] }
                }
            ],
            limit: perPage,
            offset: offset,
            order: [['id', 'DESC']]
        });

        return res.status(200).json({
            message: "Fatched payment history",
            data: history.rows,
            status: true,
            pageInfo: {
                count: history.count,
                currentPage: page,
                totalPage: Math.ceil(history.count / perPage)
            }
        });
    } catch (e) {
        next(e)
    }
}

exports.razorpayWabhook = async (req, res, next) => {
    try {
        const payload = JSON.stringify(req.body);
        const receivedSignature = req.headers['x-razorpay-signature'];

        // Verify the webhook signature
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(payload).digest('hex');

        if (receivedSignature === expectedSignature) {
            const event = req.body.event;

            if (event === 'payment_link.paid' || event === 'payment_link.partially_paid') {
                const paymentLink = req.body.payload.payment_link.entity;
                
                //for testing
                // const existingPayment = await Payment.findOne({
                //     where: { payment_id: req.body.payload.payment.entity.id }
                // });

                // if (existingPayment) {
                //     return res.status(200).send('Already processed');
                // }

                const payment = await PaymentHistory.findOne({ where: { paymentId: paymentLink.id } });

                if (payment) {
                    await payment.update({
                        status: paymentLink.status,
                    });

                    const newPayment = await Payment.create({
                        data: req.body.payload.payment,
                        payment_id: req.body.payload.payment.entity.id,
                        paid_amount: req.body.payload.payment.entity.amount / 100,
                        method: req.body.payload.payment.entity.method,
                        created_at: req.body.payload.payment.entity.created_at,
                        status: req.body.payload.payment.entity.status,
                        paymentId: payment.id,
                    });

                    // SEND PAYMENT DATA TO AX SYSTEM
                    //commet for testing, pending to discuss with BC team
                    if (newPayment.ax_status === false) {
                        const paymentPayload = {
                            "data": [
                                {
                                    "enquiryId": payment.dataValues.enquiryId,
                                    "customerId": payment.dataValues.customerId,
                                    "amount": newPayment.dataValues.paid_amount,
                                    "createdAt": newPayment.dataValues.createdAt,
                                    "paymentId": newPayment.dataValues.payment_id,
                                },
                            ],
                        };

                        console.log(paymentPayload, '=====');
                        const postResponse = await createAmount(paymentPayload);

                        // if (postResponse && postResponse.data === 1 ) {
                        //     await newPayment.update({ ax_status: true });
                        // }

                        if (postResponse && postResponse.data && postResponse.data.entryNo) {
                                await newPayment.update({ ax_status: true });
                        }
                    }


                    const enquiry = await Enquiry.findOne({ where: { enquiryId: payment.enquiryId } });
                    const salesPerson = await User.findOne({ where: { id: enquiry.salesId } });
                    const customer = await Customer.findOne({ where: { id: enquiry.customerId } });

                    await Message.create({
                        message: "IC_payment_confirmation",
                        enquiryId: enquiry.id
                    })

                    const amount = req.body.payload.payment.entity.amount / 100
                    const message = IC_payment_confirmation(salesPerson.firstName + ' ' + salesPerson.lastName, enquiry.enquiryId, customer.ACCOUNTNUM, amount)
                    whatsappMessage(message, salesPerson.phone);

                    // Additional logic for full payment (payment_link.paid)
                    if (event === 'payment_link.paid' && payment.enquiryId && payment.payment_type === 'final_payment') {
                        const enquiry = await Enquiry.findOne({ where: { enquiryId: payment.enquiryId } });

                        if (enquiry) {
                            const customer = await Customer.findOne({ where: { id: enquiry.customerId } });
                            const order = await Order.findOne({ where: { enquiryId: enquiry.id } });

                            if (order) {
                                const message_data = await Message.findOne({
                                    where: { enquiryId: enquiry.id, message: 'book_installation_time_slot' },
                                });

                                if (!message_data) {
                                    await Message.create({
                                        message: 'book_installation_time_slot',
                                        enquiryId: order.enquiryId,
                                    });

                                    const message = book_installation_time_slot(
                                        `${customer.firstName} ${customer.lastName}`,
                                        order.orderId,
                                        enquiry.id
                                    );
                                    whatsappMessage(message, customer.primary_phone);
                                }
                            }
                        }
                    }
                }
            }
            else if (event === 'payment.failed') {
                console.log("payment failed", req.body.payload.payment.entity.id)
            }

            res.status(200).send('Webhook handled successfully');
        } else {
            res.status(400).send('Invalid webhook signature');
        }
    } catch (e) {
        next(e)
    }
};


exports.syncPaymentInAX = async (req, res, next) => {
    try {

        // const paidPayments = await Payment.findAll({ where: { ax_status: false }, include:[ PaymentHistory ]})
        const paidPayments = await Payment.findAll({ where: { paymentId: req.query.paymentId } })

        if (paidPayments && paidPayments.length > 0) {
            for (var i = 0; i < paidPayments.length; i++) {

                const payment = paidPayments[i]
                // console.log(payment)
                const payment_history = await PaymentHistory.findOne({ where: { id: payment.paymentId } });

                const paymentPayload = {
                    "data": [
                        {
                            "enquiryId": payment_history.dataValues.enquiryId,
                            "customerId": payment_history.dataValues.customerId,
                            "amount": payment.dataValues.paid_amount,
                            "createdAt": payment.dataValues.createdAt,
                            "paymentId": payment.dataValues.payment_id,
                        },
                    ],
                }

                const postResponse = await createAmount(paymentPayload);
                console.log((postResponse && postResponse.data), "--------------------")
                if (postResponse && postResponse.data == 1) {
                    await payment.update({ ax_status: true })
                }
                console.log(paymentPayload)

            }

            res.status(200).json({
                message: "Payment sync successfully",
                status: true
            });
        } else {
            res.status(400).json({
                message: "No payment to sync",
                status: true
            });
        }


    } catch (e) {
        next(e)
    }

};


exports.orderAdvanceReminder = async (req, res, next) => {
    try {
        const pendingData = await PaymentHistory.findAll({ where: { payment_type: 'order_advance', status: 'created' } });

        if (pendingData && pendingData.length > 0) {

            for (var i = 0; i < pendingData.length; i++) {

                const item = pendingData[i]

                const createdTime = new Date(item.createdAt);
                const currentTime = new Date();
                const timeDifferenceInHours = (currentTime - createdTime) / (1000 * 60 * 60);

                if (timeDifferenceInHours <= 4) {
                    console.log("The item was created within the last 4 hours.", item.enquiry_Id);

                } else {
                    const enquiry = await Enquiry.findOne({ where: { id: item.enquiry_Id }, include: Order });

                    if (enquiry && (enquiry.orders && enquiry.orders.length == 0)) {
                        const message_data = await Message.findOne({ where: { enquiryId: enquiry.id, message: 'estimate_create_reminder' } });

                        if (!message_data) {
                            const customer = await Customer.findOne({ where: { id: enquiry.customerId } });
                            await Message.create({
                                message: "estimate_create_reminder",
                                enquiryId: enquiry.id
                            });

                            let quotationAmount = enquiry.estimate_amount;
                            const advance = enquiry.amount || 0;

                            const message = estimate_create_reminder(customer.firstName + ' ' + customer.lastName, item.data.short_url, item.amount, advance, quotationAmount)
                            whatsappMessage(message, customer.primary_phone)
                        }
                    }
                }

            }

            return res.status(200).json({
                message: "Sent reminders",
                status: true
            });
        }
        else {
            return res.status(200).json({
                message: "No Data for reminder",
                status: true
            });
        }


    } catch (e) {
        next(e)
    }
}



exports.getCompletedOrder = async (req, res, next) => {
    try {
        const messages = await Message.findAll({ where: { message: "book_installation_time_slot" } });

        const enquiryIds = [];

        messages.map((data) => { enquiryIds.push(data.enquiryId) })

        const orders = await Order.findAll({
            where: { orderStatus: "completed", enquiryId: { [Op.notIn]: enquiryIds } },
            include: [{
                model: Enquiry, where: { status: { [Op.notIn]: ["completed", "cancelled"] } }
            }]
        });

        if (orders && orders.length > 0) {
            for (var i = 0; i < orders.length; i++) {
                const order = orders[i];

                if (order.enquiry) {
                    const customer = await Customer.findOne({ where: { id: order.enquiry.customerId } });

                    const data = await customerOutstandingAmount(customer.ACCOUNTNUM)
                    const customerOutstanding = data.openSoAmount + data.ledgerAmount;
                    console.log("customerOutstanding, --->>>", customerOutstanding)
                    if (order && data.openSoAmount && data.ledgerAmount && customerOutstanding <= 0) {

                        await Message.create({
                            message: 'book_installation_time_slot',
                            enquiryId: order.enquiryId,
                        });

                        const message = book_installation_time_slot(`${customer.firstName} ${customer.lastName}`, order.orderId, order.enquiry.id);
                        whatsappMessage(message, customer.primary_phone);

                        console.log("0-----------0", order.enquiryId)
                    }
                }
            }
        }

        return res.status(200).json({
            length: orders.length
        });

    } catch (e) {
        next(e)
    }
}




