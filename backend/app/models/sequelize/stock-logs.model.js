const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const StockLogs = sequelize.define("stock_logs", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
    },
    stock_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    stock_before: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: null,
    },
    stock_after: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: null,
    },
    action: {
      type: DataTypes.ENUM,
      values: ["0", "1"],
      defaultValue: 1,
    },
    suppliers_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
  });

  return StockLogs;
};
