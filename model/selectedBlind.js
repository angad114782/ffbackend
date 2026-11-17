const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const selectedBlind = sequelize.define('selectedBlind', {
    blind_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    tdbu_is_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_lining_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_lining_width: {
        type: DataTypes.STRING
    },
    blind_fabric_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_border_fabric_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_border_curtain_fabric_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_hardware_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_border_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_screw_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_extra_bracket_support_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_extra_bracket_support_quantity: {
        type: DataTypes.STRING
    },
    no_of_blinds: {
        type: DataTypes.STRING
    },
    blind_default_width: {
        type: DataTypes.STRING
    },
    blind_default_drop: {
        type: DataTypes.INTEGER
    },
    no_of_blind_motor_remote: {
        type: DataTypes.STRING
    },
    blind_pelmet_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_pelmet_width: {
        type: DataTypes.STRING
    },
    blind_pelmet_drop: {
        type: DataTypes.STRING
    },
    blindTypeSearchRemoteQuantity : {
        type: DataTypes.INTEGER
    },
    border_length : {
        type : DataTypes.DOUBLE
    },
    border_price : {
        type : DataTypes.DOUBLE
    },
    blind_fabric_discount: {
        type: DataTypes.DOUBLE
    },
    blind_border_fabric_required: {
        type: DataTypes.ENUM("Yes", "No")
    },
    blind_track_motor_discount: {
        type: DataTypes.DOUBLE
    },
    blind_track_remote_discount: {
        type: DataTypes.DOUBLE
    },
    blind_extra_bracket_discount: {
        type: DataTypes.DOUBLE
    },
    blind_track_discount: {
        type: DataTypes.DOUBLE
    },
    blind_shades_discount: {
        type: DataTypes.DOUBLE
    },
    blind_type_search_remote_discount: {
        type: DataTypes.DOUBLE
    },
    blind_type_search_motor_discount: {
        type: DataTypes.DOUBLE
    },
    blind_type_search_discount: {
        type: DataTypes.DOUBLE
    },
    blind_lining_discount: {
        type: DataTypes.DOUBLE
    },
    blind_border_discount: {
        type: DataTypes.DOUBLE
    },
    blind_border_curtain_fabric_discount: {
        type: DataTypes.DOUBLE
    },
    border_curtain_length: {
        type: DataTypes.DOUBLE
    },
    border_curtain_price: {
        type: DataTypes.DOUBLE
    },
    blind_custom_title : {
        type : DataTypes.TEXT
    }
})

module.exports = selectedBlind