const {DataTypes} = require('sequelize');

const sequelize = require('../utils/database')

const LiningFabric = sequelize.define('lining_fabric' , {
    fabric : {
        type : DataTypes.STRING,
    },
    width :{
        type  :DataTypes.STRING
    }
})

module.exports = LiningFabric