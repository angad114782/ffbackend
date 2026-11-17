const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const SelectedSofa = sequelize.define('selectedsofa', {
    sofa_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    seating_capacity: {
        type: DataTypes.INTEGER,
    },
    primary_sofa_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    secondary_sofa_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    piping_sofa_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    total_sofa_primary_fabric: DataTypes.DOUBLE,
    total_sofa_primary_fabric_cost: DataTypes.DOUBLE, 
    sofa_primary_fabric_discount: DataTypes.DOUBLE, 
    total_sofa_secondary_fabric: DataTypes.DOUBLE,
    total_sofa_secondary_fabric_cost: DataTypes.DOUBLE,
    sofa_secondary_fabric_discount: DataTypes.DOUBLE,
    total_sofa_piping_fabric: DataTypes.DOUBLE,
    total_sofa_piping_fabric_cost: DataTypes.DOUBLE,
    sofa_piping_fabric_discount: DataTypes.DOUBLE,
    cost_per_seat: DataTypes.INTEGER,
    sofa_total_cost : DataTypes.DOUBLE,
    sofa_total_cost_with_tax: DataTypes.DOUBLE,
    sofa_main_type : DataTypes.STRING,
        
    sofa_length: DataTypes.DOUBLE,
    sofa_breadth: DataTypes.DOUBLE,
    sofa_height: DataTypes.DOUBLE,
//******************************************************************
    wallpanel_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    primary_wallpanel_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    secondary_wallpanel_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    wallpanel_primary_fabric_quantity : DataTypes.DOUBLE,
    wallpanel_primary_fabric_discount : DataTypes.DOUBLE,
    total_primary_wallpanel_fabric_cost : DataTypes.DOUBLE,
    wallpanel_secondary_fabric_quantity : DataTypes.DOUBLE,
    wallpanel_secondary_fabric_discount : DataTypes.DOUBLE,
    total_secondary_wallpanel_fabric_cost : DataTypes.DOUBLE,
    wallpanel_area : DataTypes.DOUBLE,
    making_cost_wallpanel : DataTypes.DOUBLE,
    total_wallpanel_cost : DataTypes.DOUBLE,

//******************************************************************
    bedback_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    primary_bedback_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    secondary_bedback_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    bedback_primary_fabric_quantity : DataTypes.DOUBLE,
    total_primary_bedback_fabric_cost : DataTypes.DOUBLE,
    primary_bedback_fabric_discount : DataTypes.DOUBLE,
    bedback_secondary_fabric_quantity : DataTypes.DOUBLE,
    total_secondary_bedback_fabric_cost : DataTypes.DOUBLE,
    secondary_bedback_fabric_discount : DataTypes.DOUBLE,
    bedback_area : DataTypes.DOUBLE,
    making_cost_bedback : DataTypes.DOUBLE,
    total_bedback_cost : DataTypes.DOUBLE,
    
//******************************************************************
    pouffee_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    primary_pouffee_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    secondary_pouffee_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    piping_pouffee_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    total_pouffee_primary_fabric: DataTypes.DOUBLE,
    total_pouffee_primary_fabric_cost: DataTypes.DOUBLE,
    pouffee_primary_fabric_discount: DataTypes.DOUBLE,
    total_pouffee_secondary_fabric: DataTypes.DOUBLE,
    total_pouffee_secondary_fabric_cost: DataTypes.DOUBLE,
    pouffee_secondary_fabric_discount: DataTypes.DOUBLE,
    total_pouffee_piping_fabric: DataTypes.DOUBLE,
    total_pouffee_piping_fabric_cost: DataTypes.DOUBLE,
    pouffee_piping_fabric_discount: DataTypes.DOUBLE,
    total_cost_pouffee : DataTypes.DOUBLE,
    pouffe_making_cost : DataTypes.DOUBLE,
    
    is_quillted: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    type: DataTypes.STRING,
    quillt_price: DataTypes.DOUBLE,

    pouffee_length: DataTypes.DOUBLE,
    pouffee_breadth: DataTypes.DOUBLE,
    pouffee_height: DataTypes.DOUBLE,
    number_of_pouffee : DataTypes.INTEGER,
    cost_per_pouffee : DataTypes.DOUBLE,
    
    cushion_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    
    cushion_primary_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    cushion_secondary_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    cushion_piping_fabric_required: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },
    cushion_length: DataTypes.DOUBLE,
    cushion_breadth: DataTypes.DOUBLE,
    number_of_cushion : DataTypes.INTEGER,
    cost_per_cushion : DataTypes.DOUBLE,
    cost_per_meter : DataTypes.DOUBLE,
    
    cushion_total_cost: DataTypes.DOUBLE,
    cushion_piping_fabric_total_cost: DataTypes.DOUBLE,
    cushion_primary_fabric_total_cost: DataTypes.DOUBLE,
    cushion_secondary_fabric_total_cost: DataTypes.DOUBLE,
    
    total_cushion_primary_fabric_required : DataTypes.DOUBLE,
    total_cushion_secondary_fabric_required : DataTypes.DOUBLE,
    total_cushion_piping_fabric_required : DataTypes.DOUBLE,
    
    cushion_primary_fabric_discount : DataTypes.DOUBLE,
    cushion_secondary_fabric_discount : DataTypes.DOUBLE,
    cushion_piping_fabric_discount : DataTypes.DOUBLE,
    
    cushion_concel_zip_required : {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No"
    },

    pouffe_remark : DataTypes.STRING,
    wallPanel_remark : DataTypes.STRING,
    bedBack_remark : DataTypes.STRING,
    sofa_remark : DataTypes.STRING,
    cushion_remark : DataTypes.STRING,
    stiching_type : DataTypes.STRING,
    
    
})

module.exports = SelectedSofa