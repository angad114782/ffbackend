const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const CurtainFabric = sequelize.define('curtainfabric', {
    fabric: {
        type: DataTypes.STRING
    },
    width: {
        type: DataTypes.STRING
    },
    repeat_horizontal: {
        type: DataTypes.STRING
    },
    repeat_vertical: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    item_id: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING
    },
    item_group:{
        type: DataTypes.STRING
    },
    book_name: {
        type: DataTypes.TEXT
    },
    is_blocked: {
        type: DataTypes.BOOLEAN
    },
    brand_name: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.FLOAT
    },
    calculation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    tax: DataTypes.STRING,
    sales_price: DataTypes.FLOAT,

})


module.exports = CurtainFabric