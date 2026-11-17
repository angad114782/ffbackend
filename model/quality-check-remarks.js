const {DataTypes} = require('sequelize');

const sequelize = require('../utils/database');

const QualityCheckRemark = sequelize.define('quality_check_remarks', {
    remark: {
        type: DataTypes.TEXT,
    },
    qcDone : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    status: {
        type: DataTypes.ENUM('pending', 'rejected', 'completed'),
        defaultValue: 'pending'
    }
});

module.exports = QualityCheckRemark;