const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const BlindShades = sequelize.define('blind_shade', {
    name : {
        type  : DataTypes.STRING,
    },
    code : {
        type : DataTypes.STRING
    }
})

module.exports = BlindShades