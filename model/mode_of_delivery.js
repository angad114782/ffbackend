const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const ModeOfDelivery = sequelize.define('mode_of_delivery', {
    mode_of_delivery: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
})

module.exports = ModeOfDelivery