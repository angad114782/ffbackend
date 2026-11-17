const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const App_Version = sequelize.define('app_version', {
    app_name: {
        type: DataTypes.STRING,
    },
    app_version: {
        type: DataTypes.STRING,
    },
    type:{
        type: DataTypes.STRING
    }
})

module.exports = App_Version