const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const TailorVendor = sequelize.define('tailor_vendor', {
    vendor_account: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    }
})

module.exports = TailorVendor