const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const blind_motor_track_type = sequelize.define('blindMotor_track_type', {
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

module.exports = blind_motor_track_type