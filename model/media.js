const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const media = sequelize.define('media', {
    file  : {
        type : DataTypes.STRING,
    },
    mediaType  : {
        type : DataTypes.ENUM("room-asset" , "banner"),
    },
    field :{
        type :DataTypes.STRING
    }
    
    
})

module.exports = media