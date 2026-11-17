const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const trackType = sequelize.define('track', {
    type:{
     type : DataTypes.STRING,
    },
    image : {
     type : DataTypes.STRING
    },
    notes :{
     type : DataTypes.TEXT
    }
})

module.exports = trackType