const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const SelectedCurtain = sequelize.define('selectedcurtain', {
    main_fabric_required :{
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'No'
    },
    weight_required: {
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'No'
    },
    hand_hammering_required: {
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'No'
    },
    mock_fabric_required: {
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'No'
    },
    mock_hand_hammering_required: {
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'No'
    },
    customization_fabric_required : {
        type : DataTypes.ENUM("Yes","No"),
        defaultValue  :"No"
    },
    lining_required: {
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'No'
    },
    lining_width: {
        type: DataTypes.STRING
    },
    belt_required: {
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'No'
    },
    beltLength: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    border_required: {
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'No'
    },
    primary_border_length : {
        type : DataTypes.DOUBLE
    },
    primary_border_price : {
        type : DataTypes.DOUBLE
    },
    secondary_border_length : {
        type : DataTypes.DOUBLE
    },
    secondary_border_price: {
        type : DataTypes.DOUBLE
    },
    pelmet_required: {
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'No'
    },
    pelmet_style: {
        type: DataTypes.ENUM('Hard', 'Soft'),
    },
    pelmet_width: {
        type: DataTypes.STRING
    },
    pelmet_drop: {
        type: DataTypes.STRING
    },
    pelmet_turning: {
        type: DataTypes.STRING
    },
    pelmet_LBracket_required: {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    pelmet_LBracket_quantity: {
        type: DataTypes.STRING,
    },
    pelmet_track_required: {
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'No'
    },
    mock_fabric_discount: {
        type: DataTypes.DOUBLE
    },
    primary_fabric_discount: {
        type: DataTypes.DOUBLE
    },
    secondary_fabric_discount: {
        type: DataTypes.DOUBLE
    },
    lining_discount: {
        type: DataTypes.DOUBLE
    },
    belt_discount: {
        type: DataTypes.DOUBLE
    },
    belt_border_discount: {
        type: DataTypes.DOUBLE
    },
    belt_piping_discount: {
        type: DataTypes.DOUBLE
    },
    primary_border_discount: {
        type: DataTypes.DOUBLE
    },
    secondary_border_discount: {
        type: DataTypes.DOUBLE
    },
    pelmet_discount: {
        type: DataTypes.DOUBLE
    },
    fabric1_ring_color: {
        type: DataTypes.STRING
    },
    mock_ring_color: {
        type: DataTypes.STRING
    },
})


module.exports = SelectedCurtain