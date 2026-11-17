const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const blindFabric = sequelize.define('blind_fabric', {
   Item_number:{
    type: DataTypes.STRING
   },
   Width:{
    type: DataTypes.STRING
   },
   RepeatVertical:{
    type: DataTypes.STRING
   },
   Brand_Code:{
    type: DataTypes.STRING
   },
   RepeatHorizontal:{
    type: DataTypes.STRING
   },
   Product_name:{
    type: DataTypes.STRING
   },
   Closing_Balance:{
    type: DataTypes.STRING
   },
   Vendor:{
    type: DataTypes.STRING
   },
   Name:{
    type: DataTypes.STRING
   },
   Collection_Code:{
    type: DataTypes.STRING
   },
   Item_Family_Code:{
    type: DataTypes.STRING
   },
   External_Item_Id:{
    type: DataTypes.STRING
   },
   Item_group:{
    type: DataTypes.STRING
   },
   Maximum_Retail_Price:{
    type: DataTypes.STRING
   },
   Category_Code:{
    type: DataTypes.STRING
   },
   Unit:{
    type: DataTypes.STRING
   },    
})

module.exports = blindFabric