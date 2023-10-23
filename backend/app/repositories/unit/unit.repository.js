const { sequelize } = require("../../../config/sequelize_db");
const unitModels = require("../../models/sequelize/unit.model")(sequelize);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", sort) => {
    const rows = await unitModels.findAll({
      where: {
        [Op.or]: {
          name: { [Op.like]: `%${search}%` },
        },
        [Op.and]: {
          deletedAt: null,
        },
      },
      order: [["createdAt", sort ? sort : "ASC"]],
    });

    return rows;
  },
  listUnitUsage: async (productName, firstStatusConversion = 0) => {
    let query =
      "SELECT uc.id, uc.name, u.id as unit_id, p.id as product_id, u.name, uc.conversion, u.deletedAt, u.createdAt FROM products as p INNER JOIN unit_conversions as uc ON uc.product_id = p.id INNER JOIN units as u ON u.id = p.unit_id WHERE uc.name = ? AND uc.deletedAt IS NULL";

    if (firstStatusConversion) {
      query += " AND uc.conversion = 1";
    }

    const rows = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [productName, firstStatusConversion],
    });

    return rows;
  },
  getById: async (id) => {
    const rows = await unitModels.findOne({
      where: {
        id,
      },
      [Op.and]: {
        deletedAt: null,
      },
    });

    return rows;
  },
  listExistingUnitUsage: async (productName) => {
    let query =
      "SELECT u.id as unit_id, p.id as product_id, p.name, u.name, u.deletedAt, u.createdAt FROM products as p INNER JOIN units as u ON p.unit_id = u.id WHERE p.deletedAt IS NULL AND p.name = ?";

    const rows = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [productName],
    });

    return rows;
  },
  getById: async (id) => {
    const rows = await unitModels.findOne({
      where: {
        id,
      },
      [Op.and]: {
        deletedAt: null,
      },
    });

    return rows;
  },
  getByName: async (name) => {
    const rows = await unitModels.findOne({
      where: {
        name,
      },
    });

    return rows;
  },
  create: async (data) => {
    return unitModels.create(data);
  },
  update: async (data, id) => {
    return unitModels.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return unitModels.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async () => {
    return unitModels.count();
  },
};

module.exports = repository;
