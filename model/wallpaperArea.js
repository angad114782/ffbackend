const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

const WallpaperArea = sequelize.define('wallpaperarea', {
    length: DataTypes.DOUBLE,
    breadth: DataTypes.DOUBLE,
    windowLength: {
        type : DataTypes.DOUBLE,
        defaultValue : 0.0
    },
    windowBreadth: {
        type : DataTypes.DOUBLE,
        defaultValue : 0.0
    },
    windowData:{
        type: DataTypes.JSON
    }
})

module.exports = WallpaperArea