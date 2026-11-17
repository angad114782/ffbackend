const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const order_proof = sequelize.define('order_proof', {
    type: DataTypes.STRING,
    image: DataTypes.STRING
})

module.exports = order_proof