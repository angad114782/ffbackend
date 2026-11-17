const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Brand = sequelize.define('brand', {
    brand : {
        type : DataTypes.STRING
    },
    
})

module.exports = Brand