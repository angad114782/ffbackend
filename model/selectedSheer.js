const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const SelectedSheer = sequelize.define('selectedsheer', {
    sheer_required:{
       type: DataTypes.ENUM('Yes', 'No')
    },
    handHammering: {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    leadChain: {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    bracket: {
        type: DataTypes.ENUM("single", "double")
    },
    sheerFabricImage: {
        type: DataTypes.STRING
    },
    sheer_discount : DataTypes.DOUBLE,
    ring_color : DataTypes.STRING,
})

module.exports = SelectedSheer