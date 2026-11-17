const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const pelmet_type = sequelize.define('pelmet_type', {
    type : {
     type : DataTypes.STRING,
    },
    image : {
     type : DataTypes.STRING
    }
})

module.exports = pelmet_type