const { sequelize } = require("../../../config/sequelize_db");
const stockOpnameModels = require("../../models/sequelize/stock-opname.model")(
  sequelize
);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", sort) => {
    const rows = await stockOpnameModels.findAll({
      where: {
        [Op.or]: {
          stock_physique: { [Op.like]: `%${search}%` },
          description: { [Op.like]: `%${search}%` },
        },
        [Op.and]: {
          deletedAt: null,
        },
      },
      order: [["createdAt", sort ? sort : "ASC"]],
    });

    return rows;
  },
  listByOpnamesId: async (search, sort, opname_id) => {
    let query =
      "SELECT so.id, s.id as stock_id, p.id as product_id, p.name as product_name, u.name as unit_name, s.stock_now, so.stock_physique, so.stock_system, (so.stock_physique - s.stock_now) as deviation, o.status, so.description, so.createdAt FROM stock_opnames as so INNER JOIN opnames as o ON o.id = so.opname_id INNER JOIN stocks as s ON s.id = so.stock_id INNER JOIN products as p ON p.id = s.product_id INNER JOIN units as u ON u.id = p.unit_id WHERE (p.name like ? OR u.name like ? OR s.stock_now like ? OR so.stock_physique like ? OR so.description like ?) AND so.opname_id = ? AND so.deletedAt IS NULL";

    if (sort === "DESC") {
      query += " ORDER BY so.createdAt DESC";
    } else {
      query += " ORDER BY so.createdAt ASC";
    }

    const rows = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        opname_id,
      ],
    });

    return rows;
  },
  getByProductNameAndOpnameId: async (product_name, opname_id) => {
    const query =
      "SELECT so.*, p.name as product_name  FROM stock_opnames as so INNER JOIN stocks as s ON s.id = so.stock_id INNER JOIN products as p ON p.id = s.product_id WHERE p.name = ? AND so.opname_id = ? AND so.deletedAt IS NULL";

    const rows = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [product_name, opname_id],
    });

    return rows;
  },
  getByStockId: async (stock_id) => {
    const rows = await stockOpnameModels.findAll({
      where: {
        stock_id,
      },
      [Op.and]: {
        deletedAt: null,
      },
    });

    return rows;
  },
  getById: async (id) => {
    const rows = await stockOpnameModels.findOne({
      where: {
        id,
      },
    });

    return rows;
  },
  create: async (data) => {
    return stockOpnameModels.create(data);
  },
  update: async (data, id) => {
    return stockOpnameModels.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return stockOpnameModels.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async () => {
    return stockOpnameModels.count();
  },
};

module.exports = repository;
