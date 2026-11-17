const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const estimate_data = sequelize.define('estimate_data', {
    stitchinPrice : {
        type : DataTypes.INTEGER
    },
    discount: {
        type : DataTypes.INTEGER
    },
    hardwareTax: {
        type : DataTypes.INTEGER
    },
    fabricTax: {
        type : DataTypes.INTEGER
    },
    three_pleat_price : {
        type : DataTypes.INTEGER
    },
    pencil_pleat: {
        type : DataTypes.INTEGER
    },
    ripple_fold: {
        type : DataTypes.INTEGER
    },
    eyelet: {
        type : DataTypes.INTEGER
    },
})

module.exports = estimate_data