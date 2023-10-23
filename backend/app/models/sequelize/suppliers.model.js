const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Suppliers = sequelize.define("suppliers", {
    name: {
      type: DataTypes.STRING(30),
      defaultValue: null,
    },
    description: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  return Suppliers;
};
