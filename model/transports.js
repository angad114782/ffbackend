const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Transport = sequelize.define('transport', {
    Transport: {
        type: DataTypes.STRING
    },
    Description: {
        type: DataTypes.STRING
    }
})

module.exports = Transport