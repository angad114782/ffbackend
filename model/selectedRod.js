const {DataTypes} = require('sequelize');

const sequelize = require('../utils/database');

const SelectedRod = sequelize.define('selectedRod', {
    rod_required  :{
        type: DataTypes.ENUM('Yes', 'No'),
    },
    primary_rod_required  :{
        type: DataTypes.ENUM('Yes', 'No'),
    },
    secondary_rod_required  :{
        type: DataTypes.ENUM('Yes', 'No'),
    },
    rod_selection :{
        type: DataTypes.ENUM('Single', 'Double'),
    },
    primary_rod_length : {
        type: DataTypes.STRING,
    },
    extra_bracket_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    extra_bracket_type : {
        type: DataTypes.ENUM('Small' , 'Long', 'Double'),
    },
    extra_bracket_quantity : {
        type: DataTypes.STRING,
    },
    extra_bracket_support_required:{
        type: DataTypes.ENUM('Yes', 'No'),
    },
    extra_bracket_support_quantity:{
        type: DataTypes.STRING,
    },
    extra_ring_required:{
        type: DataTypes.ENUM('Yes', 'No'),
    },
    extra_ring_quantity:{
        type: DataTypes.STRING,
    },
    rod_tie_knobs_required:{    
        type: DataTypes.ENUM('Yes', 'No'),
    }, 
    rod_tie_knobs_image:{
        type: DataTypes.STRING,
    },
    rod_number_of_tie_knobs_pair:{
        type: DataTypes.STRING,
    },
    finial_quantity:{
        type: DataTypes.STRING,
    },
    end_cap_required:{
        type: DataTypes.ENUM('Yes', 'No'),
    },
    end_cap_quantity:{
        type: DataTypes.STRING,
    },
    end_cap_wall_support_required:{
        type: DataTypes.ENUM('Yes', 'No'),
    },
    end_cap_wall_support_quantity:{
        type: DataTypes.STRING,
    },
    curatin_stick_required:{
        type: DataTypes.ENUM('Yes', 'No'),
    },
    number_of_curatin_stick_pair:{
        type: DataTypes.STRING,
    },
    primary_rod_image : {
        type: DataTypes.STRING,
    },
    secondary_rod_length : {
        type: DataTypes.STRING,
    },
    secondary_rod_image : {
        type: DataTypes.STRING,
    },
    primary_rod_discount: {
        type: DataTypes.DOUBLE
    },
    secondary_rod_discount: {
        type: DataTypes.DOUBLE
    },
    extra_bracket_discount: {
        type: DataTypes.DOUBLE
    },
    extra_bracket_support_discount: {
        type: DataTypes.DOUBLE
    },
    extra_ring_discount: {
        type: DataTypes.DOUBLE
    },
    rod_tieknob_discount: {
        type: DataTypes.DOUBLE
    },
    finial_discount: {
        type: DataTypes.DOUBLE
    },
    end_cap_discount: {
        type: DataTypes.DOUBLE
    },
    end_cap_wall_support_discount: {
        type: DataTypes.DOUBLE
    },
    curtain_stick_discount: {
        type: DataTypes.DOUBLE
    },
    finial_required:{
         type: DataTypes.ENUM('Yes', 'No')
    }
})

module.exports = SelectedRod