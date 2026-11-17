const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const roomAsset = sequelize.define('room_asset', {
    curtain_plywoord_required:{
        type : DataTypes.ENUM("Yes", "No"),
        allowNull: true
    },
    height :{
        type : DataTypes.FLOAT,
    },
    width :{
        type : DataTypes.FLOAT,
    },
    sheer_window_height :{
        type : DataTypes.FLOAT,
        allowNull: true
    },
    sheer_window_width :{
        type : DataTypes.FLOAT,
        allowNull: true
    },
    sheer_window_same_as:{
        type : DataTypes.ENUM("Yes", "No"),
        allowNull: true
    },
    widhtOfCove : {
        type : DataTypes.FLOAT,
    },
    ladderHeight :{
      type : DataTypes.FLOAT,  
    },
    number_of_panel_fabric1: {
        type: DataTypes.STRING
    },
    total_fabric1_required: {
        type: DataTypes.TEXT
    },
    number_of_panel_fabric2: {
        type: DataTypes.STRING
    },
    total_fabric2_required: {
        type: DataTypes.TEXT
    },
    number_of_panel_lining_fabric: {
        type: DataTypes.STRING
    },
    total_lining_fabric_required: {
        type: DataTypes.TEXT
    },
    total_primary_border_fabric_required: {
        type: DataTypes.TEXT
    },
    total_secondary_border_fabric_required: {
        type: DataTypes.TEXT
    },
    total_belt_fabric_required:{
        type: DataTypes.TEXT
    },
    total_belt_piping_fabric_required: {
        type: DataTypes.TEXT
    },
    total_belt_border_fabric_required: {
        type: DataTypes.TEXT
    },
    number_of_panel_mock_fabric: {
        type: DataTypes.STRING
    },
    total_mock_fabric_required: {
        type: DataTypes.TEXT
    },
    number_of_panel_pelmet_fabric: {
        type: DataTypes.STRING
    },
    total_pelmet_fabric_required: {
        type: DataTypes.TEXT
    },
    number_of_panel_sheer_fabric: {
        type: DataTypes.TEXT
    },
    total_sheer_fabric_required: {
        type: DataTypes.TEXT
    },
    total_blind_fabric_required: {
        type: DataTypes.TEXT
    },
    number_of_panel_blind_fabric: {
        type: DataTypes.TEXT
    },
    number_of_panel_blind_curtain_border_fabric:{
        type: DataTypes.STRING
    },
    total_blind_border_curtain_fabric_required:{
        type: DataTypes.TEXT
    },
    number_of_panel_blind_border_fabric: {
        type: DataTypes.STRING
    },
    total_blind_border_fabric_required: {
        type: DataTypes.TEXT
    },
    number_of_panel_blind_lining_fabric: {
        type: DataTypes.STRING
    },
    total_blind_lining_fabric_required: {
        type: DataTypes.TEXT
    },
    blind_drilling_msg : {
        type: DataTypes.TEXT
    },
    mount_type  : {
        type : DataTypes.ENUM("wall" , "ceiling")
    },
    accept_driling_from_FF_side:{
     type: DataTypes.BOOLEAN
    },
    accept_driling_from_client_side:{
     type: DataTypes.BOOLEAN
    },
    pelmet : DataTypes.TEXT,
    primary_track_length : DataTypes.DOUBLE,
    secondary_track_length : DataTypes.DOUBLE,
    mock_track_length : DataTypes.DOUBLE,
    primary_rod_length : DataTypes.DOUBLE,
    secondary_rod_length : DataTypes.DOUBLE,
    pelmet_track_length: {
        type: DataTypes.STRING,
    },
})

module.exports = roomAsset