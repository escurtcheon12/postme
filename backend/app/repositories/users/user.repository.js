const { sequelize } = require("../../../config/sequelize_db");
const usersModel = require("../../models/sequelize/user.model")(sequelize);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async (search = "", sort) => {
    const rows = await usersModel.findAll({
      where: {
        [Op.or]: {
          username: { [Op.like]: `%${search}%` },
          email: { [Op.like]: `%${search}%` },
        },
        [Op.and]: {
          deletedAt: null,
          username: { [Op.not]: "admin" },
        },
      },
      order: [["createdAt", sort ? sort : "ASC"]],
    });

    return rows;
  },
  getById: async (id) => {
    const user = await usersModel.findOne({
      where: {
        id,
      },
    });

    return user;
  },
  create: async (data) => {
    return usersModel.create(data);
  },
  update: async (data, id) => {
    return await usersModel.update(data, {
      where: {
        id,
      },
    });
  },
  delete: async (id) => {
    return await usersModel.destroy(id);
  },
  getByUsername: async (username) => {
    const rows = await usersModel.findOne({
      where: {
        // username: {
        //   [Op.like]: `%${username}%`,
        // },
        username,
        [Op.and]: {
          deletedAt: null,
        },
      },
      type: QueryTypes.SELECT,
    });
    return rows ? rows : 0;
  },
  getByEmail: async (email) => {
    const rows = await usersModel.findOne({
      where: {
        // email: {
        //   [Op.like]: `%${email}%`,
        // },
        email,
        [Op.and]: {
          deletedAt: null,
        },
      },
      type: QueryTypes.SELECT,
    });
    return rows ? rows : 0;
  },
  getByForgotToken: async (token) => {
    const [user] = await usersModel.findAll({
      where: {
        forgot_token: {
          [Op.like]: `%${token}%`,
        },
        [Op.and]: {
          deletedAt: null,
        },
      },
      type: QueryTypes.SELECT,
    });

    return user ? user.dataValues : null;
  },
};

module.exports = repository;
