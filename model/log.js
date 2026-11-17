const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Log = sequelize.define('logs', {
    level: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    meta: {
        type: DataTypes.JSON,
        allowNull: true
    },
    stack: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

module.exports = Log;
