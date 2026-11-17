const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const ceilingType = sequelize.define('ceiling_type', {
    type : {
        type : DataTypes.STRING
    },
    note : {
        type : DataTypes.STRING
    }
    
})

module.exports = ceilingType