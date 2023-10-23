const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const StockOpname = sequelize.define("stock_opnames", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
    },
    stock_system: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: null,
    },
    stock_physique: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: null,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    stock_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    opname_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  return StockOpname;
};
