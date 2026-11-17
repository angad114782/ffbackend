const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const PaymentTerms = sequelize.define('payment_terms', {
    terms_of_payment: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
})

module.exports = PaymentTerms