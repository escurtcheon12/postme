const { sequelize } = require("../../../config/sequelize_db");
const categoriesModels = require("../../models/sequelize/categories.model")(
  sequelize
);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", sort) => {
    const rows = await categoriesModels.findAll({
      where: {
        [Op.or]: {
          name: { [Op.like]: `%${search}%` },
          description: { [Op.like]: `%${search}%` },
          createdAt: { [Op.like]: `%${search}%` },
        },
        [Op.and]: {
          deletedAt: null,
        },
      },
      order: [["createdAt", sort ? sort : "ASC"]],
    });

    return rows;
  },
  create: async (data) => {
    return categoriesModels.create(data);
  },
  update: async (data, id) => {
    return categoriesModels.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return categoriesModels.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async () => {
    return categoriesModels.count();
  },
};

module.exports = repository;
