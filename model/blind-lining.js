const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const blind_lining = sequelize.define('blind_lining', {
    type : {
        type : DataTypes.STRING
    },
    image : {
        type : DataTypes.TEXT
    },
    note : {
         type :DataTypes.STRING
    }
    
})

module.exports = blind_lining