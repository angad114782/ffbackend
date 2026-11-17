const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const blind_motor_type = sequelize.define('blindMotor_type', {
    type : {
        type : DataTypes.STRING
    },
    note:{
     type : DataTypes.STRING
    },
    image:{
     type : DataTypes.STRING,
    }
})

module.exports = blind_motor_type