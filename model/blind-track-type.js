const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const blind_track_type = sequelize.define('blindTrack_type', {
    type : {
        type : DataTypes.STRING
    },
    note:{
     type : DataTypes.STRING
    },
    image:{
     type : DataTypes.STRING,
    }
})

module.exports = blind_track_type