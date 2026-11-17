const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

const STA = sequelize.define('sta', {
    data: DataTypes.TEXT
})

module.exports = STA;