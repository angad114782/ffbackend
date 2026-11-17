const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const MotorOperation = sequelize.define('motor_opertation', {
    type : {
     type : DataTypes.STRING,
    }
})

module.exports = MotorOperation