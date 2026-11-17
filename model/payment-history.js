const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const PaymentHistory = sequelize.define('payment_history', {
    data: {
        type: DataTypes.JSON,
    },
    payment_type: {
        type: DataTypes.ENUM('enquiry_advance', 'order_advance', 'order_complete', 'final_payment')   
    },
    amount: {
        type: DataTypes.FLOAT
    },
    status:{
        type: DataTypes.STRING,
        defaultValue: "created"
    },
    enquiryId:{
        type: DataTypes.STRING
    },
    customerId:{
        type: DataTypes.STRING
    },
    paymentId:{
        type: DataTypes.STRING
    }
})

module.exports = PaymentHistory;