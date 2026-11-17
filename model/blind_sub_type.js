const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database')

const Blind_Sub_Type = sequelize.define('blind_subtype', {
    type : {
    type : DataTypes.STRING
},
        
    note: {
    type : DataTypes.STRING
},
    
    image : {
    type : DataTypes.STRING
}
})

module.exports = Blind_Sub_Type