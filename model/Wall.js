const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

const Wall = sequelize.define('wall', {
    wall_name: DataTypes.STRING,
    premier_required: DataTypes.STRING,
    type: DataTypes.ENUM("wallpaper", "mural", "jumbo","mtr"),
    wallpaper_discount : DataTypes.DOUBLE,
    totalMeasurement : DataTypes.TEXT,
    rollWidth : DataTypes.DOUBLE,
    rollLength : DataTypes.DOUBLE,
    rate_type : DataTypes.ENUM("normal_rate" , "ceiling_rate"),
    wallLength: DataTypes.DOUBLE,
    wallWidth: DataTypes.DOUBLE,
    wallpaper_wastage: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    wallpaper_already_installed: DataTypes.ENUM("Yes", "No")
})

module.exports = Wall