const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const belt_type = sequelize.define('belt_type', {
    type : {
        type : DataTypes.STRING
    },
    image : {
        type : DataTypes.STRING
    }
})

module.exports = belt_type