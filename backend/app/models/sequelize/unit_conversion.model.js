const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UnitConversion = sequelize.define("unit_conversion", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    product_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    conversion: {
      type: DataTypes.DOUBLE(10, 9),
    },
    status: {
      type: DataTypes.ENUM,
      values: ["0", "1"],
      defaultValue: 1,
      comment:
        "This column is have function to able determine main conversion = 1 and not = 0",
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  return UnitConversion;
};
