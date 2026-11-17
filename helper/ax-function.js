const axios = require("axios");
const { bc_fetchCustomerId, bc_customerOutstandingAmount, bc_createPayment, bc_enquiryOutstandingAmount, bc_enquirySalesQuotationAmount, bc_createAmount } = require("../helper/bc-function");

const url = process.env.AX_INTEGRATION_URL;

exports.fetchCustomerId = async (newEnquiryId) => {
    console.log(newEnquiryId)
    try {
        // const response = await axios.post(`${url}api/CreateCustomer`, {
        //   username: 'axdev',
        //   password: 'Asd@123',
        //   url: `http://203.115.102.6:6696/api/v1/sales/get-address/${newEnquiryId}`,
        // });

        const response = await bc_fetchCustomerId(newEnquiryId);
        // Process the response here
        console.log('Response data:', response);
        return response

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios  Error:-', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

exports.customerOutstandingAmount = async (customerId) => {

    const response = await bc_customerOutstandingAmount(customerId);
    return response;
    // const defaultObj = {
    //     openSoAmount: 0,
    //     ledgerAmount: 0
    // };

    // try {
    //     const [openSoAmountResponse, ledgerAmountResponse] = await Promise.allSettled([
    //         // axios.get(`${url}api/Payment/getBalance?custAccount=${customerId}`),
    //         // axios.get(`${url}api/Payment/customerOutstanding?custAccount=${customerId}`)
    //         callingBC("customerBalances", customerId),
    //         callingBC("customerOutstandings", customerId)
    //     ]);

    //     if (openSoAmountResponse.status == 'rejected' || ledgerAmountResponse.status == 'rejected') {
    //         console.log(openSoAmountResponse.status, ledgerAmountResponse.status, customerId)
    //     }

    //     const openSoAmount = openSoAmountResponse.status === "fulfilled" ? openSoAmountResponse.value.data : defaultObj.openSoAmount;
    //     const ledgerAmount = ledgerAmountResponse.status === "fulfilled" ? ledgerAmountResponse.value.data : defaultObj.ledgerAmount;

    //     return { openSoAmount, ledgerAmount };
    // } catch (error) {
    //     // console.error("Unexpected error:", error);
    //     console.error("Bissunes Central Outstanding Error Occured : ", error.message)
    //     return defaultObj;
    // }
};

exports.enquiryOutstandingAmount = async (customerId, enquiryId) => {
    try {
        // const enquiryAmount = await axios.get(`${url}api/Payment/customerEnquiryOutstanding?custAccount=${customerId}&enquiryId=${enquiryId}`);

        // const data = enquiryAmount.data || 0
        // return data

        const amount = await bc_enquiryOutstandingAmount(customerId, enquiryId);

        return amount;


    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Enquiry Outstanding Amount Error:-', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

// exports.enquirySalesQuotationAmount = async (enquiryId) => {
//     try {
//         const enquiryAmount = await axios.get(`${url}api/Payment/salesQuotation?enquiryId=${enquiryId}`);

//         const data = enquiryAmount.data || 0
//         return data

//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             console.error('Axios Sales Quotation Amount Error:-', error.message);
//         } else {
//             console.error('Unexpected error:', error);
//         }
//     }
// }

exports.enquirySalesQuotationAmount = async (enquiryId) => {
    try {
        const amount = await bc_enquirySalesQuotationAmount(enquiryId);
        return amount;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Sales Quotation Amount Error:-', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}


exports.createAmount = async (payload) => {

    const result = await bc_createAmount(payload);
    return result;
    // try {
    //     const enquiryAmount = await axios.post(`${url}api/Payment/create`, payload);
    //     return enquiryAmount;

    // } catch (error) {
    //     if (axios.isAxiosError(error)) {
    //         console.error('Axios Create Amount In AX Error:-', error.message);
    //     } else {
    //         console.error('Unexpected error:', error);
    //     }
    // }
}

