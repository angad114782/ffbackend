const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const curtainOperation = sequelize.define('curtain_operation', {
operationType : {
    type : DataTypes.STRING
}
})

module.exports = curtainOperation