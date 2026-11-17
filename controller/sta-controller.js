const { dataNotFound, dataFound } = require("../helper/functions");
const { send_notification, whatsappMessage } = require("../helper/mailer");
const { payment_quotation_request, estimate_create_message } = require("../helper/messages");
const { STA ,Order,Enquiry,EnquiryStatus,Room,Message, OrderItem,OutletUser, Customer, User, UserQualityDetail, Quality_Check, Quality_Check_Remarks} = require("../model");
const { sendPaymentLink, checkPendingPayments } = require("../helper/payment");
const { enquirySalesQuotationAmount } = require("../helper/ax-function");

function getStringAfterNumber(input) {
  let parts = input.split('_');
  return parts.slice(2).join('_');
}

exports.getSta = async (req, res, next) => {
    try {
        const body = req.body.products;

        const data = await STA.create({
            data: JSON.stringify(req.body)
        })

        const enquiry = await Enquiry.findOne({ where: { enquiryId: req.body.enquiryId } });
        if (enquiry) {
            if (body[0].status == "Quotation created" && enquiry.estimate_created == false) {
                
                await enquiry.update({ status: "estimate-created", estimate_createdAt: new Date(), estimate_created: true });
                await EnquiryStatus.create({
                    remark: "Estimate created",
                    status: "completed",
                    enquiryId: enquiry.id,
                });

            }
            
            if (body[0].status == "Quotation sent"){
                const message_data = await Message.findOne({ where: { enquiryId: enquiry.id, message: 'payment_quotation_request' } });
                const customer = await Customer.findOne({ where: { id: enquiry.customerId } })
                if (!message_data) {
                    await Message.create({
                        message: "payment_quotation_request",
                        enquiryId: enquiry.id
                    });
                    
                    const advance = enquiry.amount || 0
                    let quotationAmount = await enquirySalesQuotationAmount(enquiry.enquiryId);
                    let amount = quotationAmount - advance
                    
                    if (amount){
                        await enquiry.update({ estimate_amount: quotationAmount });
                        
                        const data = await sendPaymentLink(enquiry.id, amount, "order_advance");
                        const paymentLink = data.short_url
                        
                        const user = await OutletUser.findOne({where: {salesPersonId: enquiry.salesId}, include: {model: User, as: "outlet", attributes: ['phone']}});
                        const storeNumber = user?.outlet?.phone || ''
                        
                        const message = estimate_create_message(customer.firstName + ' ' + customer.lastName, storeNumber, paymentLink, amount, advance, quotationAmount)
                        whatsappMessage(message, customer.primary_phone);
                        
                    } else {
                        
                        const message = payment_quotation_request(customer.firstName + ' ' + customer.lastName)
                        whatsappMessage(message, customer.primary_phone);
                    }
                    
                }
            }
            
            let updated_item = [];

            if (body.length > 0) {
                for (var i = 0; i < body.length; i++) {
                    const item = body[i]
    
                    const productId = item.id.split("_")[0]
                    const serviceName = getStringAfterNumber(item.id);
    
                    const order = await Order.findOne({ where: { enquiryId: enquiry.id } });
    
                    if (order) {
                        const order_item = await OrderItem.findAll({ where: { productId, orderId: order.id } });
                        if (order_item.length > 0) {
                            for (const iterator of order_item) {

                                if (iterator.productId === productId && iterator.sta_id === serviceName) {
                                    await iterator.update({ sta_status: item.status });
                                    //non stocking----Purchase order receipt
                                    //stocking ------Transfer order createds
                                    if (item.status.includes("Transfer order created")) {
                                        await iterator.update({ 
                                            fabric_status: "fabric-in-stock", 
                                            delivery_date: item.expected_date, 
                                            sta_po_date: new Date(),
                                            sta_po_no: ""
                                        })
                                       
                                    } else if (item.status.includes("Purchase order receipt")) {
                                        await iterator.update({ 
                                            fabric_status: "fabric-in-stock"
                                        })
                                    } else if (item.status.includes("Purchase order shipped")) {
                                        const parts = item.status.split(" PO-");
                                       
                                        if (parts.length > 1) {
                                            const poNumber = "PO-" + parts[1];
                                            await iterator.update({ 
                                                sta_po_no: poNumber
                                            })
                                        }
                                        await iterator.update({ 
                                            delivery_date: item.expected_date, 
                                            sta_po_date: new Date()
                                        })
                                    } else if(item.status.includes("Invoiced")){
                                        
                                        await iterator.update({ 
                                            fabric_status: "fabric-in-stock",
                                            delivery_date: item.expected_date
                                        })
                                    }
                                   
                                    updated_item.push({
                                        ...iterator.dataValues
                                    });
                                }
                            }
                        }
                    }
                }
            }
            
            return res.status(200).json({
                message: "Data fetched successfully",
                data: updated_item,
                status: true
            })
            
        }else{
            return res.status(200).json({
                message: "Enquiry not found",
                status: true
            })
        }

      
        // return res.status(200).json({
        //     message: "Data fetched successfully",
        //     data: updated_item,
        //     status: true
        // })
    } catch (e) {
        next(e)
    }
}


exports.getStaStatus = async(req, res, next)=>{
    try {
            const order = await Order.findOne({where: { enquiryId: req.params.enquiryId },                
            include: [
                    { model: Customer, include: { model: User, as: "sales" } }, User, {
                        model: Enquiry, include: [
                            EnquiryStatus]
            }]});
            dataNotFound(order, 404, "Order Not Found");
            
            const rooms = await Room.findAll({
                include: [
                    {
                        model: OrderItem,
                        where: { orderId: order.id }
                    },
                ]
            })
            
            const enquiry = await Enquiry.findOne({where: {id: order.enquiryId}, attributes: {exclude: ['password', 'activity']}});
            
            order.dataValues.enquiry = enquiry
            order.dataValues.rooms = rooms

            res.status(200).json({
                message: "Order items Found Successfully",
                data: order,
                status: true
            });
        } catch (e) {
        next(e)
    }
}





