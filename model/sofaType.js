const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const sofa_type = sequelize.define('sofa_type', {
    type: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    isSubType: DataTypes.BOOLEAN,
    price: DataTypes.DOUBLE,
})

module.exports = sofa_type