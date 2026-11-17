const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Feedback = sequelize.define('feedback', {
    description: {
        type: DataTypes.TEXT
    }
})

module.exports = Feedback