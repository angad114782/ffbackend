const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const otp = sequelize.define('otp', {
    otp:{
        type: DataTypes.INTEGER
    },
    otp_verified:{
        type: DataTypes.BOOLEAN
    },
    country_code:{
        type: DataTypes.STRING,
        defaultValue: "+91",
        allowNull: true,
    },
    phone:{
        type: DataTypes.STRING
    }
})

module.exports = otp