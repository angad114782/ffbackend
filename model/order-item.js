const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

const OrderItem = sequelize.define('order_item', {
    productId: {
        type: DataTypes.STRING,
    },
    product_name:{
        type: DataTypes.STRING,
    },
    size : {
        type: DataTypes.STRING,
    },
    quantity: {
        type: DataTypes.INTEGER,
    },
    type : DataTypes.STRING,
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    status : {
        type : DataTypes.ENUM('accepted', 'rejected','completed', 'pending'),
        defaultValue : "pending"
    },
    fabric_status:{
        type: DataTypes.ENUM('pending', 'fabric-in-stock', 'fabric-out-of-stock'),
        defaultValue: "pending"
    },
    sta_id:{
        type: DataTypes.STRING,
        allowNull: true
    },
    sta_status:{
        type: DataTypes.STRING,
        allowNull: true
    },
    sta_po_no:{
        type: DataTypes.STRING
    },
    sta_po_date:{
        type: DataTypes.DATE  
    },
    delivery_date: {
        type: DataTypes.STRING
    }
})
module.exports = OrderItem;