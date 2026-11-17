const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database')

const Message = sequelize.define('message', {
    message: {
        type: DataTypes.TEXT
    }
})

module.exports = Message