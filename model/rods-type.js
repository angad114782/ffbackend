const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const rod_type = sequelize.define('rodtype', {
    type : {
        type : DataTypes.STRING
    },
    image : {
        type:DataTypes.STRING
    }
})

module.exports = rod_type