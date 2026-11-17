const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const ComplaintTask = sequelize.define('complaint_task', {
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'active')
    },
    date: {
        type: DataTypes.STRING
    },
    complaint_info: {
        type: DataTypes.TEXT,
    },
    images: {
        type: DataTypes.JSON
    },
    remark: {
        type: DataTypes.TEXT
    },
    warehouseId:{
        type: DataTypes.STRING
    }
})

module.exports = ComplaintTask