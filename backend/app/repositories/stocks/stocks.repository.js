const { sequelize } = require("../../../config/sequelize_db");
const stockModel = require("../../models/sequelize/stock.model")(sequelize);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", sort) => {
    const rows = await stockModel.findAll({
      where: {
        [Op.or]: {
          stock_before: { [Op.like]: `%${search}%` },
          stock_now: { [Op.like]: `%${search}%` },
        },
        [Op.and]: {
          deletedAt: null,
        },
      },
      order: [["createdAt", sort ? sort : "ASC"]],
    });

    return rows;
  },

  listWithDetailLogs: async (search = "", sort, user_id, status_stock_logs) => {
    // let query =
    //   "SELECT p.id, s.id as stock_id, p.name as product_name, c.name as category_name, sp.name as suppliers_name, sl.stock_before, sl.stock_added, s.stock_now, u.name as unit, sl.description, sl.createdAt from products as p inner join categories as c on p.category_id = c.id inner join stocks as s on p.id = s.product_id inner join stock_logs as sl on s.id = sl.stock_id left join suppliers as sp ON sl.suppliers_id = sp.id left join units as u on u.id = p.unit_id WHERE (p.name like ? OR sp.name like ? OR c.name like ? OR sl.stock_before like ? OR s.stock_now like ? OR u.name like ? OR sl.description like ? OR sl.action like ? OR sl.createdAt like ? ) AND p.deletedAt IS NULL AND sl.action = ? ORDER BY sl.createdAt";

      let query =
      "SELECT p.id, s.id as stock_id, p.name as product_name, c.name as category_name, sp.name as suppliers_name, sl.stock_before, sl.stock_after, s.stock_now, u.name as unit, sl.description, sl.createdAt from products as p inner join categories as c on p.category_id = c.id inner join stocks as s on p.id = s.product_id inner join stock_logs as sl on s.id = sl.stock_id left join suppliers as sp ON sl.suppliers_id = sp.id left join units as u on u.id = p.unit_id WHERE (p.name like ? OR sp.name like ? OR c.name like ? OR sl.stock_before like ? OR s.stock_now like ? OR u.name like ? OR sl.description like ? OR sl.action like ? OR sl.createdAt like ? ) AND p.deletedAt IS NULL AND sl.action = ? ORDER BY sl.createdAt";

    if (sort == "DESC") {
      query += " DESC";
    } else {
      query += " ASC";
    }

    const rows = await sequelize.query(query, {
      replacements: [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        // user_id,
        status_stock_logs == "1" ? status_stock_logs : "0",
      ],
      type: QueryTypes.SELECT,
    });

    return rows;
  },

  getByProductId: async (id) => {
    const rows = await stockModel.findOne({
      where: {
        product_id: id,
      },
    });

    return rows;
  },

  getById: async (id) => {
    const rows = await stockModel.findOne({
      where: {
        id,
      },
    });

    return rows;
  },

  create: async (data) => {
    return stockModel.create(data);
  },
  update: async (data, id, sequelizeTransaction) => {
    const rows = await stockModel.update(data, {
      where: {
        id,
      },
      transaction: sequelizeTransaction,
    });

    return rows;
  },
  updateByProductId: async (data, product_id) => {
    return stockModel.update(data, {
      where: {
        product_id,
      },
    });
  },
  destroy: async (data, id) => {
    return stockModel.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async () => {
    return stockModel.count();
  },
};

module.exports = repository;
