const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const finial = sequelize.define('finial', {
   type : {
    type : DataTypes.STRING
   }
})

module.exports = finial