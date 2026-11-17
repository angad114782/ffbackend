const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Customer = sequelize.define('customer', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_code:{
        type: DataTypes.STRING,
        defaultValue: "+91",
        allowNull: true,
    },
    primary_phone: {
        type: DataTypes.STRING,
    },
    secondary_contact_person :{
        type : DataTypes.STRING
    },
    country_code2:{
        type: DataTypes.STRING,
        defaultValue: "+91",
        allowNull: true,
    },
    secondary_phone: {
        type: DataTypes.STRING,
    },
    primary_email: {
        type: DataTypes.STRING,
    },
    secondary_email: {
        type: DataTypes.STRING,
    },
    companyName: {
        type: DataTypes.STRING,
    },
    GST: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.ENUM('individual', 'company')
    },
    accessToken: {
        type: DataTypes.TEXT,
    },
    fcmToken: {
        type: DataTypes.TEXT
    },
    isFirstLogin: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    ACCOUNTNUM : {
        type : DataTypes.STRING
    },
    outstanding_amount:{
        type: DataTypes.FLOAT
    }
})

module.exports = Customer