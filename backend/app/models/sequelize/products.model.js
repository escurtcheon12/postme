const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Products = sequelize.define("products", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    unit_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    // user_id: {
    //   type: DataTypes.INTEGER(11),
    //   defaultValue: null,
    // },
    name: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    image: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    capital_price: {
      type: DataTypes.STRING(100),
      defaultValue: 0,
    },
    selling_price: {
      type: DataTypes.STRING(100),
      defaultValue: 0,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  return Products;
};
