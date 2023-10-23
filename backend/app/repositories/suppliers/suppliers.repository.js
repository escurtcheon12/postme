const config = require("../../../config/sequelize_db");
const sequelize = require("../../models/sequelize/suppliers.model")(
  config.sequelize
);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", user_id, sort) => {
    const rows = await sequelize.findAll({
      where: {
        [Op.or]: {
          name: { [Op.like]: `%${search}%` },
          description: { [Op.like]: `%${search}%` },
        },
        [Op.and]: {
          // user_id,
          deletedAt: null,
        },
      },
      order: [["createdAt", sort ? sort : "ASC"]],
    });

    return rows;
  },
  getById: async (id) => {
    const rows = await sequelize.findOne({
      where: {
        id,
      },
    });

    return rows;
  },
  getByName: async (name) => {
    const rows = await sequelize.findOne({
      where: {
        name,
      },
    });

    return rows;
  },
  create: async (data) => {
    return sequelize.create(data);
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
