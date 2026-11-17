const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const screw_size = sequelize.define('screw_size', {
    size : {
        type : DataTypes.STRING
    }
})

module.exports = screw_size