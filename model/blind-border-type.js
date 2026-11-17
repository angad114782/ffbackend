const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const blind_border_type = sequelize.define('blindBorder_type', {
    type : {
        type : DataTypes.STRING
    },
    note:{
     type : DataTypes.STRING
    },
    image:{
     type :DataTypes.TEXT
    }
})

module.exports = blind_border_type