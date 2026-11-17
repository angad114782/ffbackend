const {DataTypes} = require('sequelize');

const sequelize = require('../utils/database');

const LBracket = sequelize.define('l_bracket', {
    size :{
        type: DataTypes.STRING,
    }
})

module.exports = LBracket;