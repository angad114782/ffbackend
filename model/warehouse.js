const { DataTypes } = require("sequelize");

const sequelize = require('../utils/database');

const Warehouse = sequelize.define("warehouse", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    warehouseId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: false
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: false
    },
})
module.exports = Warehouse