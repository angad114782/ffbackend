const { PaymentHistory, Enquiry, Customer } = require("../model");
const Razorpay = require('razorpay');
const axios = require("axios");
const instance = new Razorpay({ key_id: process.env.PAYMENT_KEY_ID, key_secret: process.env.PAYMENT_SECRET })

exports.sendPaymentLink = async(newEnquiryId, enquiry_amount, payment_type)=>{
    try {
        const enquiry = await Enquiry.findOne({
          where: { id: newEnquiryId },
          include: [{ model: Customer }]
        });
       
        if (enquiry && (enquiry_amount && enquiry_amount > 0)) {
            
            const amount = enquiry_amount * 100;
            
            let minPartialAmount = 100;
            let accept_partial =  true;
            
            if(payment_type == "enquiry_advance"){
                accept_partial = false
            }
            if(payment_type == "order_advance"){
                minPartialAmount = Math.ceil(amount * 0.7)
            }
            
            console.log(accept_partial, minPartialAmount)
            
            const payload = {
                amount,
                currency: "INR",
                accept_partial,
                description: `Payment for your enquiry no ${enquiry.enquiryId}`,
                customer: {
                    name: `${enquiry.customer.firstName} ${enquiry.customer.lastName}`,
                    contact: `91${enquiry.customer.primary_phone}`,
                    email: `${enquiry.customer.primary_email}`
                },
                notify: {
                    sms: true,
                    email: true,
                    whatsapp: true
                },
                callback_url: "https://service.fandf.in/thank-you",
                callback_method: "get"
            };
            
            if (accept_partial) {
                payload.first_min_partial_amount = minPartialAmount;
            }
            
            const response = await instance.paymentLink.create(payload);
           
            if(response){
                await PaymentHistory.create({
                    data : response,
                    payment_type: payment_type,
                    amount : amount/100,
                    enquiryId : enquiry.enquiryId,
                    enquiry_Id: enquiry.id,
                    paymentId: response.id,
                    status: response.status,
                    customerId: enquiry.customer.ACCOUNTNUM
                })
            }
            
            return response;
        }else{
            throw new Error("Enquiry or Amount not found!")
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios Error:', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
    }
}


exports.checkPendingPayments = async () => {
    const pendingPayments = await PaymentHistory.findAll({ where: { status: 'created' } });
    
    for (const payment of pendingPayments) {
        try {
            const paymentLink = await instance.paymentLink.fetch(payment.paymentId);

            if (paymentLink.status === 'paid' || paymentLink.status === 'expired') {
                let paymentData = Array.isArray(payment.data) ? [...payment.data] : [];
                paymentData.unshift(paymentLink);

                await payment.update({
                    status: paymentLink.status,
                    data: paymentData
                });
            }
        } catch (error) {
            console.error(`Error fetching payment link for ID: ${payment.paymentId}`, error);
        }
    }
};
    