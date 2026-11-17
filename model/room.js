const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Room = sequelize.define('room', {
    roomName : {
        type : DataTypes.STRING
    },
    roomDescription : {
        type : DataTypes.TEXT
    },
    numberOfWindow : {
        type : DataTypes.INTEGER
    },
    floor :{
        type : DataTypes.INTEGER
    },
    extra_hardware_required : {
        type : DataTypes.ENUM("Yes","No"),
    },
    noOfExtraHardware  : {
        type :DataTypes.INTEGER
    },
    tie_back_required :{
        type : DataTypes.ENUM("Yes","No"),
    },
    tie_back_quantity :{
         type : DataTypes.STRING,
    },
    l_bracket_required:{
        type : DataTypes.ENUM("Yes","No"),
    },
    l_bracket_quantity:{
        type: DataTypes.STRING
    }
})

module.exports = Room