const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const User = sequelize.define('user', {
    userId : {
       type : DataTypes.STRING,
       allowNull : true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        // unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true
    },
    image : {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accessToken: {
        type: DataTypes.TEXT,
    },
    type: {
        type: DataTypes.ENUM('super-admin', 'outlet-manager', "outlet", 'sales-person', 'dispatch-team', 'stitching-store-manager', 'measurer', 'tailor', 'qc', 'installer')
    },
    fcmToken :{
        type: DataTypes.TEXT
    },
    deviceToken : {
        type: DataTypes.TEXT,
        defaultValue : "0"
    },
    isFirstLogin :{
        type : DataTypes.BOOLEAN,
        defaultValue : true
    },
    isblocked:{
        type : DataTypes.BOOLEAN
    },
    login_time : {
        type : DataTypes.DATE,
        allowNull : true,
    },
    logout_time : {
        type : DataTypes.DATE,
        allowNull : true,
    },
    activity:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    work_assigned_count: {
        type: DataTypes.INTEGER
    }
})

module.exports = User