const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const curtainStyle = sequelize.define('curtainstyle', {
    curtainStyle : {
        type : DataTypes.STRING
    },
    image : {
        type : DataTypes.TEXT
    },
    note :{
        type : DataTypes.STRING
    }
})

module.exports = curtainStyle