const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Users = sequelize.define("users", {
    username: {
      type: DataTypes.STRING(30),
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    password: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    status: {
      type: DataTypes.INTEGER(2),
      defaultValue: 1,
    },
    interval: {
      type: DataTypes.INTEGER(2),
      defaultValue: 1,
    },
    token: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    forgot_token: {
      type: DataTypes.STRING(5),
      defaultValue: null,
    },
    role: {
      type: DataTypes.STRING(20),
      defaultValue: "user",
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  return Users;
};
