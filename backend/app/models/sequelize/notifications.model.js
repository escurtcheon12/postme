const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notifications = sequelize.define("notifications", {
    user_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    title: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    message: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    is_read: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    is_read_admin: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
  });

  return Notifications;
};
