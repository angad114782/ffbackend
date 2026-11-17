const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const SheerFabric = sequelize.define('sheerfabric', {
    fabric : {
        type : DataTypes.STRING
    },
    width:{
        type : DataTypes.STRING
    },
    repeat_horizontal:{
        type : DataTypes.STRING
    },
    repeat_vertical:{
        type : DataTypes.STRING
    }
})

module.exports = SheerFabric