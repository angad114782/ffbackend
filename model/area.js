const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

const area = sequelize.define('area', {
    door_cut_required: DataTypes.ENUM('Yes', 'No'),
    flooring_polythene_required: DataTypes.ENUM('Yes', 'No'),
    flooring_foam_required: DataTypes.ENUM('Yes', 'No'),
    binding_required: DataTypes.ENUM('Yes', 'No'),
    binding_discount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    binding_unit: DataTypes.STRING,
    binding_quantity: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    skirting_required: DataTypes.ENUM('Yes', 'No'),
    skirting_discount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    skirting_unit: DataTypes.STRING,
    skirting_quantity: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    reducer_required: DataTypes.ENUM('Yes', 'No'),
    reducer_discount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    reducer_unit: DataTypes.STRING,
    reducer_quantity: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    t_profile_required: DataTypes.ENUM('Yes', 'No'),
    t_profile_discount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    t_profile_unit: DataTypes.STRING,
    t_profile_quantity: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    beeding_required: DataTypes.ENUM('Yes', 'No'),
    beeding_discount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    beeding_unit: DataTypes.STRING,
    beeding_quantity: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    margin_required: DataTypes.ENUM('Yes', 'No'),
    margin_discount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    margin_unit: DataTypes.STRING,
    margin_quantity: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    flooring_length: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    flooring_breadth: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    type: DataTypes.ENUM("carpet", "flooring"),
    remove_area: DataTypes.JSON
}, {
    modelName: 'areas',
    tableName: 'areas',
    collate: "utf8mb4_bin"
});

module.exports = area;
