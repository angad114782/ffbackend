const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const warehouse_order = sequelize.define('warehouse_order', {
    otp: {
        type: DataTypes.STRING,
    },
    status  :{
        type : DataTypes.ENUM("pending" , "verified"),
        defaultValue : "pending"
    }
})

module.exports = warehouse_order