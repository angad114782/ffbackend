const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const selectedFlooring = sequelize.define('selectedflooring', {
    flooring_required: DataTypes.ENUM("Yes", "No"),
    type: DataTypes.ENUM("flooring", "carpet"),
    flooring_type: DataTypes.ENUM("Normal flooring", "Engineer Wooden","Herringbone Flooring"),
    remarks: DataTypes.TEXT,
    additional_charges: DataTypes.DOUBLE,
    discount : DataTypes.DOUBLE,
    box_width : DataTypes.DOUBLE,
    room_total_sqm : DataTypes.DOUBLE,
    room_carpet_price : DataTypes.DOUBLE,
    room_flooring_price : DataTypes.DOUBLE,
    room_flooring_box_quantity : DataTypes.DOUBLE,
    total_foam_cost : DataTypes.DOUBLE,
    total_polythene_cost : DataTypes.DOUBLE,
    mrpPerSqmts : DataTypes.DOUBLE,
    wastage: DataTypes.INTEGER
})

module.exports = selectedFlooring