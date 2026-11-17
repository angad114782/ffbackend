const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const InstallerTasks = sequelize.define('installer_tasks', {
    status: {
        type: DataTypes.ENUM("pending", "active", "completed", "canceled","postponed","slot_booked", "wcr_completed")
    },
    date: {
        type: DataTypes.STRING
    },
    remark : {
        type : DataTypes.TEXT
    },
    postponeDate : {
        type : DataTypes.STRING
    },
    postpone_count:{
        type: DataTypes.INTEGER,
        defauleValue: 0
    },
    installation_done: {
        type: DataTypes.DATE
    },
    tat:{
        type: DataTypes.STRING
    }
    
})

module.exports = InstallerTasks