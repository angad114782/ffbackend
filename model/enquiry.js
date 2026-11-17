const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Enquiry = sequelize.define('enquiry', {
    enquiryId: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM("inprogess", "completed", "fresh", "measurement-complete","estimate-created","estimate-postpone", "order-confirmed", "qc-complete", "installer-assigned", "installation-started","installation-done", "cancelled", "measurer-assigned"),
        defaultValue: "fresh"
    },
    estimate_created: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    estimate_createdAt: DataTypes.DATE,
    estimate_postpone_date:{
        type: DataTypes.DATE
    },
    estimate_postpone_reason:{
        type: DataTypes.STRING
    },
    estimate_postpone_count:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    estimate_creation: DataTypes.DATE,
    cartage: DataTypes.DOUBLE,
    cartage_amount_with_tex: DataTypes.DOUBLE,
    service_amount: DataTypes.DOUBLE,
    service_remark: DataTypes.TEXT,
    contactPerson: {
        type: DataTypes.STRING,
    },
    countryCode:{
        type: DataTypes.STRING,
        defaultValue: "+91",
        allowNull: true,
    },
    contactNumber: {
        type: DataTypes.BIGINT,
    },
    landmark:{
        type: DataTypes.STRING
    },
    street: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING,
    },
    pincode: {
        type: DataTypes.STRING,
    },
    business_value: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    expected_delivery_date: DataTypes.STRING,
    expected_installation_date: DataTypes.STRING,
    remark: DataTypes.TEXT,
    customer_ref: DataTypes.STRING,
    customer_ref_name: DataTypes.STRING,
    admin_remark: DataTypes.STRING,
    mode_of_deliveries: DataTypes.STRING,
    payment_terms: DataTypes.STRING,
    tailor_vendors: DataTypes.STRING,
    transports: DataTypes.STRING,
    comment: DataTypes.STRING,
    tailor_vendors_id: DataTypes.STRING,
    warehouse_id: DataTypes.STRING,
    estimate_amount: DataTypes.INTEGER,
    warehouse_name: DataTypes.STRING,
    outstanding_amount: DataTypes.FLOAT,
    enquiry_type:{
        type: DataTypes.ENUM('pret', 'studio'),
        allowNull : true
    }
})

module.exports = Enquiry