const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const EnquirySchedule = sequelize.define('enquiryschedule', {
    status : {
        type : DataTypes.ENUM('pending','completed','cancelled','postponed','accepted','slot_booked')
    },
    date : {
        type : DataTypes.DATEONLY,
        allowNull : false
    },
    remark:{
        type : DataTypes.STRING,
    },
    postpone_date: {
        type: DataTypes.STRING
    },
    postpone_count: {
        type: DataTypes.INTEGER ,
        defaultValue: 0
    },
    re_measurement_required: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    re_measurement_reason:{
        type: DataTypes.STRING  
    },
    measurement_start: {
        type: DataTypes.DATE
    },
    measurement_done: {
        type: DataTypes.DATE
    },
    re_measurement_date: {
        type: DataTypes.DATE  
    },
    tat:{
        type: DataTypes.STRING
    }
})

module.exports = EnquirySchedule