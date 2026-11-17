const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Order_Bill = sequelize.define('order_bill', {
    remark: DataTypes.STRING,
    image: DataTypes.STRING
})

module.exports = Order_Bill;