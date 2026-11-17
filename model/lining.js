const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const lining = sequelize.define('lining', {
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

module.exports = lining