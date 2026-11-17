const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const moterized_track = sequelize.define('motorized_track', {
    moter : {
        type : DataTypes.STRING
    },
    notes :{
     type : DataTypes.TEXT
    }
})

module.exports = moterized_track