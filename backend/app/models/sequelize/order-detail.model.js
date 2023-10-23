const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderDetail = sequelize.define(
    "order_detail",
    {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
      },
      orders_id: {
        type: DataTypes.INTEGER(11),
        defaultValue: null,
      },
      product_id: {
        type: DataTypes.INTEGER(11),
        defaultValue: null,
      },
      quantity: {
        type: DataTypes.INTEGER(11),
        defaultValue: null,
      },
      price: {
        type: DataTypes.STRING(500),
        defaultValue: null,
      },
    }
  );

  return OrderDetail;
};
