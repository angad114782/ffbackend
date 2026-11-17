const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const tieKnob = sequelize.define('tieknob', {
   type : {
    type : DataTypes.STRING
   }
})

module.exports = tieKnob