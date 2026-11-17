const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const customer_order = sequelize.define('customer_order', {
    otp: {
        type: DataTypes.STRING,
    },
    status  :{
        type : DataTypes.ENUM("pending" , "verified"),
        defaultValue : "pending"
    }
})

module.exports = customer_order