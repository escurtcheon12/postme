const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Opname = sequelize.define("opnames", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["0", "1"],
      defaultValue: "0",
      comments: "process status = 0, process finish = 1",
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  });

  return Opname;
};
