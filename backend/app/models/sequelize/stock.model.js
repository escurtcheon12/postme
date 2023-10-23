const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Stock = sequelize.define("stocks", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    stock_now: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: null,
    },
    // status: {
    //   type: DataTypes.INTEGER(11),
    //   defaultValue: null,
    // },
  });

  return Stock;
};
