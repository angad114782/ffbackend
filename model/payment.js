const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Payment = sequelize.define('payment', {
    data:{
        type: DataTypes.JSON,
    },
    payment_id:{
        type: DataTypes.STRING
    },
    paid_amount:{
        type: DataTypes.INTEGER 
    },
    method:{
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.STRING
    },
    ax_status:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status:{
        type: DataTypes.STRING
    },
})

module.exports = Payment;