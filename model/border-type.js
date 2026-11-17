const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const border_type = sequelize.define('border_type', {
    type : {
        type : DataTypes.STRING
    },
    image : {
        type : DataTypes.STRING
    }
})

module.exports = border_type