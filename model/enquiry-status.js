const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const EnquiryStatus = sequelize.define('enquirystatus', {
    status:{
        type : DataTypes.STRING,
        defaultValue : "pending"
    },
     remark:{
        type : DataTypes.STRING,
    },
    details:{
        type: DataTypes.JSON
    }
})

module.exports = EnquiryStatus