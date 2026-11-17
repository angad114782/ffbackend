const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Complaint = sequelize.define('complaint', {
    type: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    tat: {
        type: DataTypes.STRING
    },
    purchase_complaint:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = Complaint