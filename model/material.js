const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Material = sequelize.define('material', {
    name : {
        type : DataTypes.STRING
    },
    image :{
        type : DataTypes.STRING
    },
    related_fields:{
        type : DataTypes.TEXT,
        defaultValue : null
    }
    
})

module.exports = Material