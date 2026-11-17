const {DataTypes} = require('sequelize');

const sequelize = require('../utils/database');

const UserQualityDetail = sequelize.define('user_quality_detail', {
    isChecked: {
        type: DataTypes.BOOLEAN,
        allowNull: true    
    }
});

module.exports = UserQualityDetail;