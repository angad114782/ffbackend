const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const ladder = sequelize.define('ladder', {
    ladder : {
        type : DataTypes.STRING
    },
    note : {
        type :  DataTypes.STRING
    },
    image :{
        type :  DataTypes.STRING
    },
    height:{
        type: DataTypes.FLOAT
    }
})

module.exports = ladder