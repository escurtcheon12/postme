const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Customers = sequelize.define("customers", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      defaultValue: null,
    },
    address: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    }
  });

  return Customers;
};
