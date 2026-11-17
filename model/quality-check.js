const {DataTypes} = require('sequelize');

const sequelize = require('../utils/database');

const QualityCheck = sequelize.define('quality_check_details', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    checks: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status : {
        type : DataTypes.BOOLEAN,
        defaultValue : true,
    }
    
});

module.exports = QualityCheck;