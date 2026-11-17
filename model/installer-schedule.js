const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const InstallerSchedule = sequelize.define('installer_schedule', {
    start_time: {
        type: DataTypes.TIME,
    },
    end_time: {
        type: DataTypes.TIME,
    },
})

module.exports = InstallerSchedule