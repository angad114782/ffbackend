const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Wcr_Report = sequelize.define('wcr_report', {
    report: {
        type: DataTypes.TEXT
    }
})

module.exports = Wcr_Report