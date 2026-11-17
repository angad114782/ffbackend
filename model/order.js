const{DataTypes} = require('sequelize');

const sequelize = require('../utils/database');

const Order = sequelize.define('order', {

    orderId : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    orderDate : {
        type : DataTypes.DATE,
        allowNull : false,
    },
    orderStatus : {
        type : DataTypes.ENUM('pending', 'completed', 'accepted', 'rejected'),
        allowNull : false,
    },
    vendor_assign_date:{
        type: DataTypes.STRING
    },
    remark : {
        type  : DataTypes.STRING
    },
    QC1:{
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    QC2:{
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    QC3:{
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    is_partial_material:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    QC_Start:{
        type : DataTypes.DATE,
        allowNull : true,
        comment: "qc1 completed"
    },
    QC2_Completed: {
        type: DataTypes.DATE
    },
    QC_Complete:{
        type : DataTypes.DATE,
        allowNull : true,
        comment: "qc3 completed"
        
    },
    sta_received_date:{
        type: DataTypes.DATE
    }
},
{
    paranoid: true,
}
)

module.exports = Order;