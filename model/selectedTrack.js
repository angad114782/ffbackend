const {DataTypes} = require('sequelize');

const sequelize = require('../utils/database');

const SelectedTrack = sequelize.define('selectedTrack', {
    track_required  :{
        type: DataTypes.ENUM('Yes', 'No'),
    },
    primary_track_required  :{
        type: DataTypes.ENUM('Yes', 'No'),
        defaulValue : "No"
    },
    secondary_track_required  :{
        type: DataTypes.ENUM('Yes', 'No'),
        defaulValue : "No"
    },
    mock_track_required  :{
        type: DataTypes.ENUM('Yes', 'No'),
        defaulValue : "No"
    },
    track_selection :{
        type: DataTypes.ENUM("single" , "double"),
    },
    primary_track_length :{
        type : DataTypes.STRING
    },
    no_of_primary_track_remote:{
      type : DataTypes.STRING
    },
    no_of_primary_track_motor:{
        type: DataTypes.STRING
    },
    primary_extra_track_bracket_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    primary_extra_track_bracket_quantity : {
        type: DataTypes.STRING,
    },
    primary_overlappper_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    primary_number_of_overlappper_pair : {
        type: DataTypes.STRING,
    },
    screw_size_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    screw_quantity : {
        type : DataTypes.STRING
    },
    l_bracket_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    l_bracket_quantity : {
        type: DataTypes.STRING,
    },
    primary_track_curatin_stick_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    primary_track_curatin_stick_pair : {
        type: DataTypes.STRING,
    },
    primary_tie_knobs_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    primary_tie_knobs_pair : {
        type: DataTypes.STRING,
    },
    primary_track_tie_knobs_image : {
        type : DataTypes.STRING
    },
    primary_track_image:{
        type: DataTypes.STRING,
    },
    secondary_track_length:{
        type: DataTypes.STRING,
    },
    no_of_secondary_track_remote:{
      type : DataTypes.STRING
    },
    no_of_secondary_track_motor:{
        type : DataTypes.STRING
    },
    secondary_track_image:{
        type: DataTypes.STRING,
    },
    secondary_extra_track_bracket_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    secondary_extra_track_bracket_quantity : {
        type: DataTypes.STRING,
    },
    secondary_overlappper_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    secondary_number_of_overlappper_pair : {
        type: DataTypes.STRING,
    },
    secondary_track_curatin_stick_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    secondary_track_curatin_stick_pair : {
        type: DataTypes.STRING,
    },
    secondary_tie_knobs_required : {
        type: DataTypes.ENUM('Yes', 'No'),
    },
    secondary_tie_knobs_pair : {
        type: DataTypes.STRING,
    },
    secondary_track_tie_knobs_image : {
        type : DataTypes.STRING
    },
    mock_track_required : {
     type: DataTypes.ENUM('Yes', 'No'),
    },
    mock_track_length:{
      type : DataTypes.STRING
    },
    no_of_mock_track_remote:{
      type : DataTypes.STRING
    },
    no_of_mock_track_motor:{
      type : DataTypes.STRING
    },
    mock_extra_track_bracket_required:{
      type: DataTypes.ENUM('Yes', 'No'),
    },
    mock_extra_track_bracket_quantity:{
      type : DataTypes.STRING
    },
    mock_overlappper_required:{
     type: DataTypes.ENUM('Yes', 'No'),
    },
    mock_number_of_overlappper_pair:{
      type : DataTypes.STRING
    },
    mock_track_curatin_stick_required:{
      type: DataTypes.ENUM('Yes', 'No'),
    },
    mock_track_curatin_stick_pair:{
      type : DataTypes.STRING
    },
    mock_tie_knobs_required:{
      type : DataTypes.STRING
    },
    mock_track_image:{
      type : DataTypes.STRING
    },
    mock_tie_knobs_pair : {
        type: DataTypes.STRING,
    },
    primary_track_discount: {
        type: DataTypes.DOUBLE
    },
    primary_track_remote_discount: {
        type: DataTypes.DOUBLE
    },
    primary_track_motor_discount: {
        type: DataTypes.DOUBLE
    },
    primary_extra_track_bracket_discount: {
        type: DataTypes.DOUBLE
    },
    primary_overlapper_discount: {
        type: DataTypes.DOUBLE
    },
    lbracket_discount: {
        type: DataTypes.DOUBLE
    },
    primary_track_curatin_stick_discount: {
        type: DataTypes.DOUBLE
    },
    primary_tieknob_discount: {
        type: DataTypes.DOUBLE
    },
    secondary_track_discount: {
        type: DataTypes.DOUBLE
    },
    secondary_track_remote_discount: {
        type: DataTypes.DOUBLE
    },
    secondary_track_motor_discount: {
        type: DataTypes.DOUBLE
    },
    secondary_extra_track_bracket_discount: {
        type: DataTypes.DOUBLE
    },
    secondary_overlappper_discount: {
        type: DataTypes.DOUBLE
    },
    secondary_track_curatin_stick_discount: {
        type: DataTypes.DOUBLE
    },
    secondary_tieknobs_discount: {
        type: DataTypes.DOUBLE
    },
    mock_track_discount: {
        type: DataTypes.DOUBLE
    },
    mock_track_remote_discount: {
        type: DataTypes.DOUBLE
    },
    mock_track_motor_discount: {
        type: DataTypes.DOUBLE
    },
    mock_extra_track_bracket_discount: {
        type: DataTypes.DOUBLE
    },
    mock_overlappper_discount: {
        type: DataTypes.DOUBLE
    },
    mock_track_curatin_stick_discount: {
        type: DataTypes.DOUBLE
    },
    mock_tie_knobs_discount: {
        type: DataTypes.DOUBLE
    },
})

module.exports = SelectedTrack