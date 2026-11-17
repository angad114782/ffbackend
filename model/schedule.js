const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const schedule = sequelize.define('schedule', {
    start_time :{
        type: DataTypes.TIME,
    },
    end_time :{
        type: DataTypes.TIME,
    },
    type: {
        type: DataTypes.ENUM('installer','measurer')
    }
})

module.exports = schedule