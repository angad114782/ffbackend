const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const ParkingSpace = sequelize.define('parking_space', {
    space : {
        type : DataTypes.STRING
    }
})

module.exports = ParkingSpace