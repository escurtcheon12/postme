const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Users = sequelize.define("units", {
    name: {
      type: DataTypes.STRING(30),
      defaultValue: null,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  return Users;
};
