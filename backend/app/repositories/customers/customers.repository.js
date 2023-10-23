const { sequelize } = require("../../../config/sequelize_db");
const customersModel = require("../../models/sequelize/customers.model")(
  sequelize
);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", user_id, sort) => {
    const rows = await customersModel.findAll({
      where: {
        [Op.or]: {
          name: { [Op.like]: `%${search}%` },
          phone_number: { [Op.like]: `%${search}%` },
          address: { [Op.like]: `%${search}%` },
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
    const rows = await customersModel.findOne({
      where: {
        id,
      },
    });

    return rows;
  },
  getByPhoneNumber: async (phone_number) => {
    const rows = await customersModel.findOne({
      where: {
        phone_number,
      },
    });

    return rows;
  },
  getByName: async (name) => {
    const rows = await customersModel.findOne({
      where: {
        name,
      },
    });

    return rows;
  },
  totalCustomers: async (user_id, status) => {
    let query =
      "SELECT COUNT(*) as total_customers, createdAt, DATE(createdAt) as date, DAY(DATE(createdAt)) as day, MONTH(DATE(createdAt)) as month, YEAR(DATE(createdAt)) as year FROM customers WHERE deletedAt IS NULL";

    switch (status) {
      case "Month":
        query +=
          " AND (createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 12 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 12 MONTH)) GROUP BY MONTH(DATE(createdAt))";
        break;
      case "Year":
        query +=
          " AND (createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 YEAR) AND DATE_ADD(CURDATE(), INTERVAL 5 YEAR)) GROUP BY YEAR(DATE(createdAt))";
        break;
      default:
        query +=
          " AND (createdAt BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)) GROUP BY DAY(DATE(createdAt))";
        break;
    }

    const rows = await sequelize.query(query, {
      // replacements: [user_id],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  create: async (data) => {
    return customersModel.create(data);
  },
  update: async (data, id) => {
    return customersModel.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return customersModel.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async () => {
    return customersModel.count();
  },
};

module.exports = repository;
