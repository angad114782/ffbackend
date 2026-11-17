const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const materialImage = sequelize.define('material_image', {
    image : {
        type : DataTypes.STRING
    },
    field : {
        type : DataTypes.STRING
    }
})

module.exports = materialImage