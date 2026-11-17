const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const blind_fitting_type = sequelize.define('blindFitting_type', {
    type : {
        type : DataTypes.STRING
    },
    note:{
     type : DataTypes.STRING
    },
    image : {
     type  :DataTypes.STRING
    }
})

module.exports = blind_fitting_type