const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const blind_window_type = sequelize.define('blindWindow_type', {
    type : {
        type : DataTypes.STRING
    },
    note:{
     type : DataTypes.STRING
    },
    image : {
     type  :DataTypes.STRING
    }
})

module.exports = blind_window_type