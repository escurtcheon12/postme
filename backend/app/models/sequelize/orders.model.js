const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Orders = sequelize.define("orders", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    discount: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    method: {
      type: DataTypes.STRING(50),
      defaultValue: "Cash",
    },
    paid_nominal: {
      type: DataTypes.INTEGER(100),
      defaultValue: null,
    },
    less_nominal: {
      type: DataTypes.INTEGER(100),
      defaultValue: null,
    },
  });

  return Orders;
};
