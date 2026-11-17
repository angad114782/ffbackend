const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Notification = sequelize.define('notification', {
    message : {
    type : DataTypes.TEXT
    }
})

module.exports = Notification