const { DataTypes } = require("sequelize");

const sequelize = require("../utils/database");

const Identification = sequelize.define("identification", {
  clientName: { type: DataTypes.STRING },
  email: {type: DataTypes.STRING},
  mobileNo: { type: DataTypes.STRING },
  adress:{type:DataTypes.STRING},
  pin_code: { type: DataTypes.INTEGER },
  query_register: {type: DataTypes.STRING},
  customerType:{type:DataTypes.STRING},
  customerGroup:{type:DataTypes.STRING},
  category:{type:DataTypes.TEXT},
  followUp:{type:DataTypes.STRING},
  date:{type:DataTypes.DATE},
  updates:{type:DataTypes.STRING},
  customerStatus: {type: DataTypes.STRING},
  remarks:{type:DataTypes.TEXT},
  business: {type: DataTypes.STRING}
});

module.exports = Identification;
