const {DataTypes} = require('sequelize');

const sequelize = require('../utils/database');

const QualityCheckType = sequelize.define('quality_type', {
    quality_check_type :{
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = QualityCheckType;