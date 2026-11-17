const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const wallType = sequelize.define('wall_type', {
    type : {
        type : DataTypes.STRING
    },
    note  :{
        type : DataTypes.STRING
    }
    
})

module.exports = wallType