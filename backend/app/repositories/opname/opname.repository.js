const { sequelize } = require("../../../config/sequelize_db");
const opnameModels = require("../../models/sequelize/opname.model")(sequelize);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", sort) => {
    let query =
      "SELECT o.id, o.status, CASE WHEN o.status = '1' THEN 'Proses Selesai' ELSE 'Sedang Proses' END as result_status, u.username, o.createdAt FROM opnames as o INNER JOIN users as u ON u.id = o.user_id WHERE (o.status like ? OR u.username like ?) AND o.deletedAt IS NULL";

    if(sort === "DESC") {
      query += " ORDER BY o.createdAt DESC";
    } else {
      query += " ORDER BY o.createdAt ASC";
    }
    
    const rows = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [`%${search}%`, `%${search}%`],
    });

    return rows;
  },
  getById: async (id) => {
    const rows = await opnameModels.findOne({
      where: {
        id,
      },
      [Op.and]: {
        deletedAt: null,
      },
    });

    return rows;
  },
  listByOpnameId: async (opname_id) => {
    const rows = await opnameModels.findAll({
      where: {
        opname_id,
      },
      [Op.and]: {
        deletedAt: null,
      },
    });

    return rows;
  },
  create: async (data) => {
    return opnameModels.create(data);
  },
  update: async (data, id) => {
    return opnameModels.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return opnameModels.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async () => {
    return opnameModels.count();
  },
};

module.exports = repository;
