const { sequelize } = require("../../../config/sequelize_db");
const notificationModels =
  require("../../models/sequelize/notifications.model")(sequelize);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (user_id, status_admin, sort = "") => {
    if (status_admin == 1) {
      const rows = await notificationModels.findAll({
        order: [["createdAt", sort ? sort : "ASC"]],
      });

      return rows;
    } else {
      const rows = await notificationModels.findAll({
        where: {
          user_id,
        },
        order: [["createdAt", sort ? sort : "ASC"]],
      });

      return rows;
    }
  },
  create: async (data, sequelizeTransaction) => {
    return notificationModels.create(data, {
      transaction: sequelizeTransaction,
    });
  },
  updateReadAllByUserId: async (id) => {
    return notificationModels.update(
      { is_read: 1 },
      {
        where: {
          user_id: id,
        },
      }
    );
  },
  updateReadAllByAdmin: async () => {
    const query = "UPDATE notifications SET is_read_admin = 1";
    const rows = await sequelize.query(query);

    return rows ? rows : 0;
  },
  update: async (data, id) => {
    return notificationModels.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return notificationModels.destroy(data, {
      where: {
        id,
      },
    });
  },
  count: async (status, user_id, status_admin) => {
    let query = "SELECT COUNT(*) as total FROM notifications";
    if (status_admin == 1) {
      query += " WHERE is_read_admin = ?";
    } else {
      query += " WHERE is_read = ? AND user_id = ?";
    }

    const [rows] = await sequelize.query(query, {
      replacements: [status ? status : 0, user_id],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
};

module.exports = repository;
