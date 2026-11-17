const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const outletAddress = sequelize.define('outlet-address', {
    street : {
        type : DataTypes.STRING,
        allowNull : false
    },
    city : {
        type : DataTypes.STRING,
        allowNull : false
    },
    state : {
        type : DataTypes.STRING,
        allowNull : false
    },
    pincode : {
        type : DataTypes.STRING,
        allowNull : false
    },
    latitude : {
        type : DataTypes.STRING
    },
    longitude : {
        type : DataTypes.STRING
    },
    
})

module.exports = outletAddress