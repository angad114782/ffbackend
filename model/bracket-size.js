const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const bracket_size = sequelize.define('bracket_size', {
    size : {
        type : DataTypes.STRING
    }
})

module.exports = bracket_size