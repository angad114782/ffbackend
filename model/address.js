const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Address = sequelize.define('address', {
    contactPerson: {
        type: DataTypes.STRING,
    },
    country_code:{
        type: DataTypes.STRING,
        defaultValue: "+91",
        allowNull: true,
    },
    contactNumber: {
        type: DataTypes.BIGINT,
    },
    landmark:{
        type: DataTypes.STRING
    },
    street: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING,
    },
    pincode: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.ENUM('billing', 'delivery'),
        defaultValue: 'billing'
    },
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
})

module.exports = Address