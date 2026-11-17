const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Client_Signature = sequelize.define('client_signature', {
    image: DataTypes.STRING
})

module.exports = Client_Signature