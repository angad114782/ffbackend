const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const blind_style = sequelize.define('blindStyle', {
    style : {
        type : DataTypes.STRING
    },
    image : {
        type : DataTypes.STRING
    },
    note:{
     type : DataTypes.STRING
    }
})

module.exports = blind_style