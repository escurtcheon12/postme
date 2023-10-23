const { sequelize } = require("../../../config/sequelize_db");
const stockLogsModel = require("../../models/sequelize/stock-logs.model")(
  sequelize
);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", sort) => {
    const rows = await stockLogsModel.findAll({
      where: {
        [Op.or]: {
          unit: { [Op.like]: `%${search}%` },
          description: { [Op.like]: `%${search}%` },
          action: { [Op.like]: `%${search}%` },
        },
      },
      order: [["createdAt", sort ? sort : "ASC"]],
    });

    return rows;
  },
  listDescription: async () => {
    let query =
      "SELECT id, description, action, createdAt, updatedAt FROM stock_logs GROUP BY description";

    const rows = await sequelize.query(query, {
      // replacements: [`%${search}%`, `%${search}%`, `%${category}%`],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  getById: async (id) => {
    const rows = await stockLogsModel.findOne({
      where: {
        id,
      },
    });

    return rows;
  },
  create: async (data, sequelizeTransaction) => {
    return stockLogsModel.create(data, { transaction: sequelizeTransaction });
  },
  update: async (data, id) => {
    return stockLogsModel.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return stockLogsModel.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async () => {
    return stockLogsModel.count();
  },
};

module.exports = repository;
