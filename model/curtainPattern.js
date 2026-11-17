const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const curtainPattern = sequelize.define('curtainpattern', {
    pattern : {
        type : DataTypes.STRING
    },
    image : {
        type : DataTypes.STRING
    }
})

module.exports = curtainPattern