const config = require("../../../config/sequelize_db");
const sequelize = require("../../models/sequelize/order-detail.model")(
  config.sequelize
);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", sort) => {
    const rows = await sequelize.findAll({
      where: {
        [Op.or]: {
          quantity: { [Op.like]: `%${search}%` },
          price: { [Op.like]: `%${search}%` },
          unit: { [Op.like]: `%${search}%` },
        },
      },
      order: [["createdAt", sort ? sort : "ASC"]],
    });

    return rows;
  },
  create: async (data, sequelizeTransaction) => {
    return sequelize.create(data, {
      transaction: sequelizeTransaction,
    });
  },
  update: async (data, id) => {
    return sequelize.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return sequelize.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async () => {
    return sequelize.count();
  },
};

module.exports = repository;
