const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const blind_lining_fabric = sequelize.define('blind_lining_fabric', {
    fabric : {
        type : DataTypes.STRING
    },
    width :{
        type  :DataTypes.STRING
    }
    
})

module.exports = blind_lining_fabric