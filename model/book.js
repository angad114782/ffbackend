const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const book = sequelize.define('book', {
    book : {
        type : DataTypes.STRING
    },
    
})

module.exports = book