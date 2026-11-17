const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const flooring = sequelize.define('flooring', {
    type: DataTypes.ENUM("flooring", 'carpet'),
    item_id: DataTypes.STRING,
    item_name: DataTypes.STRING,
    brand: DataTypes.STRING,
    images: DataTypes.JSON,
})

module.exports = flooring