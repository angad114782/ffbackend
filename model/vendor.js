const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Vendor = sequelize.define('vendor', {
    vendor : {
        type : DataTypes.STRING
    },
    
})

module.exports = Vendor