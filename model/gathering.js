const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const gathering = sequelize.define('gathering', {
   type : {
    type : DataTypes.STRING
   },
   gathering : {
       type:  DataTypes.INTEGER
   }
})

module.exports = gathering