const { sequelize } = require("../../../config/sequelize_db");
const ordersModel = require("../../models/sequelize/orders.model")(sequelize);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", sort = "") => {
    const rows = await ordersModel.findAll({
      where: {
        [Op.or]: {
          name: { [Op.like]: `%${search}%` },
          method: { [Op.like]: `%${search}%` },
          status: { [Op.like]: `%${search}%` },
          discount: { [Op.like]: `%${search}%` },
        },
      },
      order: [["createdAt", sort ? sort : "ASC"]],
    });

    return rows;
  },
  listNewOrder: async (user_id, status) => {
    let query =
      "SELECT o.id, c.name, o.discount, o.method, o.paid_nominal, o.less_nominal, o.createdAt FROM orders as o INNER JOIN order_details as od ON o.id = od.orders_id INNER JOIN products as p ON od.product_id = p.id LEFT JOIN customers as c ON c.id = o.customer_id WHERE p.deletedAt IS NULL";

    switch (status) {
      case "Month":
        query +=
          " AND (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 12 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 12 MONTH))";
        break;
      case "Year":
        query +=
          " AND (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 YEAR) AND DATE_ADD(CURDATE(), INTERVAL 5 YEAR))";
        break;
      default:
        query +=
          " AND (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE_ADD(CURDATE(), INTERVAL 7 DAY))";
        break;
    }

    query += " GROUP BY(o.id) ORDER BY o.createdAt DESC LIMIT 5";

    const rows = await sequelize.query(query, {
      // replacements: [user_id],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  totalNominalOrders: async (user_id, status) => {
    let query =
      "SELECT SUM(o.paid_nominal + o.less_nominal) as total_incomes, o.createdAt, DATE(o.createdAt) as date, DAY(DATE(o.createdAt)) as day, MONTH(DATE(o.createdAt)) as month, YEAR(DATE(o.createdAt)) as year FROM orders as o INNER JOIN order_details as od ON o.id = od.orders_id INNER JOIN products as p ON od.product_id = p.id WHERE";

    switch (status) {
      case "Month":
        query +=
          " (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 12 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 12 MONTH)) GROUP BY MONTH(DATE(o.createdAt))";
        break;
      case "Year":
        query +=
          " (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 YEAR) AND DATE_ADD(CURDATE(), INTERVAL 5 YEAR)) GROUP BY YEAR(DATE(o.createdAt))";
        break;
      default:
        query +=
          " (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)) GROUP BY DAY(DATE(o.createdAt))";
        break;
    }

    const rows = await sequelize.query(query, {
      // replacements: [user_id],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  totalOrders: async (user_id, status) => {
    let query =
      "SELECT COUNT(DISTINCT od.orders_id) as total_orders, o.createdAt, DATE(o.createdAt) as date, DAY(DATE(o.createdAt)) as day, MONTH(DATE(o.createdAt)) as month, YEAR(DATE(o.createdAt)) as year FROM orders as o INNER JOIN order_details as od ON o.id = od.orders_id INNER JOIN products as p ON p.id = od.product_id WHERE";

    switch (status) {
      case "Month":
        query +=
          " (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 12 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 12 MONTH)) GROUP BY MONTH(DATE(o.createdAt))";
        break;
      case "Year":
        query +=
          " (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 YEAR) AND DATE_ADD(CURDATE(), INTERVAL 5 YEAR)) GROUP BY YEAR(DATE(o.createdAt))";
        break;
      default:
        query +=
          " (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)) GROUP BY DAY(DATE(o.createdAt))";
        break;
    }

    const rows = await sequelize.query(query, {
      // replacements: [user_id],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  totalDebtOrders: async (user_id, status) => {
    let query =
      "SELECT COUNT(DISTINCT od.orders_id) as total_debts, o.createdAt, DATE(o.createdAt) as date, DAY(DATE(o.createdAt)) as day, MONTH(DATE(o.createdAt)) as month, YEAR(DATE(o.createdAt)) as year FROM orders as o INNER JOIN order_details as od ON o.id = od.orders_id INNER JOIN products as p ON p.id = od.product_id WHERE o.less_nominal != 0";
    switch (status) {
      case "Month":
        query +=
          " AND (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 12 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 12 MONTH)) GROUP BY MONTH(DATE(o.createdAt))";
        break;
      case "Year":
        query +=
          " AND (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 YEAR) AND DATE_ADD(CURDATE(), INTERVAL 5 YEAR)) GROUP BY YEAR(DATE(o.createdAt))";
        break;
      default:
        query +=
          " AND (o.createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)) GROUP BY DAY(DATE(o.createdAt))";
        break;
    }

    const rows = await sequelize.query(query, {
      // replacements: [user_id],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  listOrderDetailsById: async (id, sort = "") => {
    let query =
      "SELECT od.id, p.name as product_name, p.unit_id, u.name as unit_name, od.quantity, p.selling_price as product_price, p.selling_price * od.quantity as total_product_price, od.createdAt FROM orders as o INNER JOIN order_details as od ON o.id = od.orders_id INNER JOIN products as p ON p.id = od.product_id INNER JOIN units as u ON u.id = p.unit_id WHERE o.id = ? ORDER BY od.createdAt";

    if (sort == "DESC") {
      query += " DESC";
    } else {
      query += " ASC";
    }

    const rows = await sequelize.query(query, {
      replacements: [id],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  listWithDetails: async (search = "", user_id, sort) => {
    let query =
      "SELECT o.id, od.id as order_details_id, u.username, c.name, SUM(od.quantity) as quantity, SUM(od.price * od.quantity) as subtotal_nominal, o.discount, ROUND(SUM(od.price * od.quantity) - (o.discount / 100) * SUM(od.price * od.quantity)) as total_order_price, o.paid_nominal, o.less_nominal, o.method, o.createdAt FROM orders as o INNER JOIN order_details as od ON o.id = od.orders_id LEFT JOIN users as u ON u.id = o.user_id LEFT JOIN customers as c ON o.customer_id = c.id INNER JOIN products as p ON p.id = od.product_id WHERE (c.name like ? OR quantity like ? OR o.discount like ?) GROUP BY od.orders_id ORDER BY od.orders_id";

    if (sort == "DESC") {
      query += " DESC";
    } else {
      query += " ASC";
    }

    const rows = await sequelize.query(query, {
      replacements: [`%${search}%`, `%${search}%`, `%${search}%`],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  create: async (data, sequelizeTransaction) => {
    return ordersModel.create(data, { transaction: sequelizeTransaction });
  },
  update: async (data, id) => {
    return ordersModel.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return ordersModel.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async () => {
    return ordersModel.count();
  },
};

module.exports = repository;
