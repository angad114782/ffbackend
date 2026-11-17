const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const BlindAsset = sequelize.define('blind_asset', {
    blind_width_top: {
        type: DataTypes.STRING,
    },
    blind_width_middle: {
        type: DataTypes.STRING,
    },
    blind_width_bottom: {
        type: DataTypes.STRING,
    },
    blind_drop_left: {
        type: DataTypes.STRING,
    },
    blind_drop_right: {
        type: DataTypes.STRING,
    },
    blind_drop_middle: {
        type: DataTypes.STRING,
    },
    blind_track_size: {
        type: DataTypes.STRING,
    },
    blind_chain_length: {
        type: DataTypes.STRING,
    },
    blind_mount_type: {
        type: DataTypes.ENUM("wall", "ceiling")
    },
    blind_remark: {
        type: DataTypes.STRING,
    },
    blind_plywood_required:{
        type : DataTypes.ENUM("Yes", "No"),
        allowNull: true
    },
    accept_blind_driling_from_FF_side: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    accept_blind_driling_from_client_side: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    blind_custom_dimentions: {
        type: DataTypes.TEXT
    },


})

module.exports = BlindAsset