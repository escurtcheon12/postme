const { sequelize } = require("../../../config/sequelize_db");
const productModel = require("../../models/sequelize/products.model")(
  sequelize
);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", category = "", user_id, rating = "") => {
    // let query =
    //   "SELECT col_1.id, col_1.stocks_id, col_1.unit_id, col_1.category_id, col_1.product_name, col_1.category_name, col_1.unit_name, col_1.capital_price, col_1.selling_price, col_2.count_item_selling, col_1.image, col_1.stock_now, col_1.stock_status, col_1.createdAt FROM (SELECT p.id, s.id as stocks_id, u.id as unit_id, c.id as category_id, p.name as product_name, c.name as category_name, u.name as unit_name, p.capital_price, p.selling_price, p.image, s.stock_now, s.status as stock_status, p.createdAt FROM products as p INNER JOIN categories as c ON p.category_id = c.id LEFT JOIN units as u ON p.unit_id = u.id LEFT JOIN stocks as s ON s.product_id = p.id WHERE (p.name like ? OR p.capital_price like ?) AND c.id like ? AND p.deletedAt IS NULL) as col_1 LEFT JOIN (SELECT od.product_id, COUNT(od.product_id) as count_item_selling FROM order_details as od GROUP BY od.product_id) as col_2 ON col_1.id = col_2.product_id ORDER BY";

    let query =
      "SELECT col_1.id, col_1.stocks_id, col_1.unit_id, col_1.category_id, col_1.product_name, col_1.category_name, col_1.unit_name, col_1.capital_price, col_1.selling_price, col_2.count_item_selling, col_1.image, col_1.stock_now, col_1.createdAt FROM (SELECT p.id, s.id as stocks_id, u.id as unit_id, c.id as category_id, p.name as product_name, c.name as category_name, u.name as unit_name, p.capital_price, p.selling_price, p.image, s.stock_now, p.createdAt FROM products as p INNER JOIN categories as c ON p.category_id = c.id LEFT JOIN units as u ON p.unit_id = u.id LEFT JOIN stocks as s ON s.product_id = p.id WHERE (p.name like ? OR p.capital_price like ?) AND c.id like ? AND p.deletedAt IS NULL) as col_1 LEFT JOIN (SELECT od.product_id, COUNT(od.product_id) as count_item_selling FROM order_details as od GROUP BY od.product_id) as col_2 ON col_1.id = col_2.product_id ORDER BY";

    switch (rating) {
      case "bestseller":
        query += " Cast(col_2.count_item_selling as int) DESC";
        break;
      case "cheap":
        query += " Cast(col_1.selling_price as int) ASC";
        break;
      case "expensive":
        query += " Cast(col_1.selling_price as int) DESC";
        break;
      default:
        query += " col_1.createdAt ASC";
        break;
    }

    const rows = await sequelize.query(query, {
      replacements: [`%${search}%`, `%${search}%`, `%${category}%`],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  listOrder: async (search = "", category = "", user_id, rating = "") => {
    // let query =
    //   "SELECT col_1.id, col_1.unit_id, col_1.category_id, col_1.product_name, col_1.category_name, col_1.unit_name, col_1.capital_price, col_1.selling_price, col_2.count_item_selling, col_1.image, col_1.stock_now, col_1.stock_status, col_1.createdAt FROM (SELECT p.id, u.id as unit_id, c.id as category_id, p.name as product_name, c.name as category_name, u.name as unit_name, p.capital_price, p.selling_price, p.image, s.stock_now, s.status as stock_status, p.createdAt FROM products as p INNER JOIN categories as c ON p.category_id = c.id LEFT JOIN units as u ON p.unit_id = u.id LEFT JOIN stocks as s ON s.product_id = p.id WHERE (p.name like ? OR p.capital_price like ?) AND c.id like ? AND p.deletedAt IS NULL) as col_1 LEFT JOIN (SELECT od.product_id, COUNT(od.product_id) as count_item_selling FROM order_details as od GROUP BY od.product_id) as col_2 ON col_1.id = col_2.product_id ORDER BY";

    let query =
      "SELECT col_1.id, col_1.unit_id, col_1.category_id, col_1.product_name, col_1.category_name, col_1.unit_name, col_1.capital_price, col_1.selling_price, col_2.count_item_selling, col_1.image, col_1.stock_now, col_1.createdAt FROM (SELECT p.id, u.id as unit_id, c.id as category_id, p.name as product_name, c.name as category_name, u.name as unit_name, p.capital_price, p.selling_price, p.image, s.stock_now, p.createdAt FROM products as p INNER JOIN categories as c ON p.category_id = c.id LEFT JOIN units as u ON p.unit_id = u.id LEFT JOIN stocks as s ON s.product_id = p.id WHERE (p.name like ? OR p.capital_price like ?) AND c.id like ? AND p.deletedAt IS NULL) as col_1 LEFT JOIN (SELECT od.product_id, COUNT(od.product_id) as count_item_selling FROM order_details as od GROUP BY od.product_id) as col_2 ON col_1.id = col_2.product_id ORDER BY";

    switch (rating) {
      case "bestseller":
        query += " col_2.count_item_selling ASC";
        break;
      case "cheap":
        query += " col_1.selling_price ASC";
        break;
      case "expensive":
        query += " col_1.selling_price DESC";
        break;
      default:
        query += " col_1.createdAt ASC";
        break;
    }

    const rows = await sequelize.query(query, {
      replacements: [`%${search}%`, `%${search}%`, `%${category}%`],

      type: QueryTypes.SELECT,
    });

    return rows;
  },
  totalProducts: async (user_id, status) => {
    let query =
      "SELECT COUNT(*) as total_products, p.createdAt, DATE(p.createdAt) as date, DAY(DATE(p.createdAt)) as day, MONTH(DATE(p.createdAt)) as month, YEAR(DATE(p.createdAt)) as year FROM products as p WHERE p.deletedAt IS NULL";

    switch (status) {
      case "Month":
        query +=
          " AND (p.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 12 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 12 MONTH)) GROUP BY MONTH(DATE(p.createdAt))";
        break;
      case "Year":
        query +=
          " AND (p.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 YEAR) AND DATE_ADD(CURDATE(), INTERVAL 5 YEAR)) GROUP BY YEAR(DATE(p.createdAt))";
        break;
      default:
        query +=
          " AND (p.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)) GROUP BY DAY(DATE(p.createdAt))";
        break;
    }

    const rows = await sequelize.query(query, {
      // replacements: [user_id],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  listBestseller: async (user_id, status) => {
    let query =
      "SELECT col_1.id, col_1.name, col_1.capital_price, col_1.selling_price, col_2.count_item_selling, col_1.createdAt, col_2.createdAt as order_created_at FROM (SELECT p.id, p.name, p.capital_price, p.selling_price, p.createdAt FROM products as p WHERE p.deletedAt IS NULL) as col_1";

    query +=
      " INNER JOIN (SELECT od.product_id, COUNT(od.product_id) as count_item_selling, od.createdAt FROM order_details as od WHERE";

    switch (status) {
      case "Month":
        query +=
          " (od.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 12 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 12 MONTH)) ";
        break;
      case "Year":
        query +=
          " (od.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 YEAR) AND DATE_ADD(CURDATE(), INTERVAL 5 YEAR)) ";
        break;
      default:
        query +=
          " (od.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)) ";
        break;
    }

    query +=
      "GROUP BY od.product_id) as col_2 ON col_1.id = col_2.product_id ORDER BY col_2.count_item_selling DESC";

    // query +=
    // " INNER JOIN (SELECT od.product_id, COUNT(od.product_id) as count_item_selling FROM order_details as od GROUP BY od.product_id) as col_2 ON col_1.id = col_2.product_id ORDER BY Cast(col_2.count_item_selling as int) DESC";

    const rows = await sequelize.query(query, {
      // replacements: [user_id],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  listDetailStocks: async (/*user_id*/) => {
    // let query =
    //   "SELECT p.id, s.id as stock_id, p.name, u.name as unit_name, s.stock_now, p.createdAt FROM products as p INNER JOIN stocks as s ON p.id = s.product_id INNER JOIN units as u ON p.unit_id = u.id WHERE p.deletedAt IS NULL AND s.status = 1 ORDER BY p.createdAt";

    let query =
      "SELECT p.id, s.id as stock_id, p.name, u.name as unit_name, s.stock_now, p.createdAt FROM products as p INNER JOIN stocks as s ON p.id = s.product_id INNER JOIN units as u ON p.unit_id = u.id WHERE p.deletedAt IS NULL ORDER BY p.createdAt";

    /* parameter status existing product opname untuk check product name yang */

    const rows = await sequelize.query(query, {
      // replacements: [user_id],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  listWithLogs: async (search = "", user_id, sort) => {
    let query =
      "SELECT p.id, p.name as product_name, c.name as category_name, s.stock_now, p.capital_price, p.selling_price, p.image FROM products as p INNER JOIN categories as c ON p.category_id = c.id INNER JOIN stocks as s ON s.product_id = p.id WHERE p.name like ? OR c.name like ? OR s.stock_now like ? OR p.capital_price like ? OR p.selling_price like ? AND p.deletedAt IS NULL ORDER BY p.createdAt";

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
        // user_id,
      ],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  getProductDetailWithStocks: async (id) => {
    let query =
      "SELECT p.id, s.id as stock_id, p.name, s.stock_now, p.category_id, p.unit_id, p.capital_price, p.selling_price, p.image, p.createdAt FROM products as p INNER JOIN stocks as s ON s.product_id = p.id WHERE p.id = ? AND p.deletedAt IS NULL";

    const [rows] = await sequelize.query(query, {
      replacements: [id],
      type: QueryTypes.SELECT,
    });

    return rows ? rows : 0;
  },
  listByUnitId: async (id) => {
    const rows = await productModel.findAll({
      where: {
        unit_id: id,
      },
      [Op.and]: {
        deletedAt: null,
      },
    });

    return rows;
  },
  listByCategoryId: async (id) => {
    const rows = await productModel.findAll({
      where: {
        category_id: id,
      },
      [Op.and]: {
        deletedAt: null,
      },
    });

    return rows;
  },
  getByUnitId: async (id) => {
    const rows = await productModel.findOne({
      where: {
        unit_id: id,
      },
    });

    return rows;
  },
  getById: async (id) => {
    const rows = await productModel.findOne({
      where: {
        id,
      },
      [Op.and]: {
        deletedAt: null,
      },
    });

    return rows;
  },
  getByNameAndUnitId: async (name, unit_id, sort = "") => {
    const rows = await productModel.findAll({
      where: {
        name,
        [Op.and]: {
          unit_id,
          deletedAt: null,
        },
      },
      order: [["createdAt", sort ? sort : "ASC"]],
    });

    return rows;
  },
  create: async (data) => {
    return productModel.create(data);
  },
  update: async (data, id) => {
    return productModel.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return productModel.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async () => {
    return productModel.count();
  },
};

module.exports = repository;
