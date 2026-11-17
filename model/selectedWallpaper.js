const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

const SelectedWallpaper = sequelize.define('selectedwallpaper', {
    type: DataTypes.ENUM("wallpaper", "mural", "jumbo","mtr"),
    wallpaper_required: DataTypes.ENUM("Yes", "No"),
    number_of_wall: DataTypes.INTEGER,
    additional_remark: DataTypes.STRING,
    additional_charges: DataTypes.DOUBLE,
    installation_charges: DataTypes.DOUBLE,
})

module.exports = SelectedWallpaper