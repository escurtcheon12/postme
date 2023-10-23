"use strict";

const db_config = require("./index");
const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const db_sequelize = {};
const models = path.join(__dirname, "../models");

const sequelize = new Sequelize(db_config.db_mysql.DB, db_config.db_mysql.USER, db_config.db_mysql.PASSWORD, {
  host: db_config.db_mysql.HOST,
  dialect: db_config.db_mysql.dialect,
  operatorsAliases: 0,
  logging: false,
  pool: {
    max: db_config.db_mysql.pool.max,
    min: db_config.db_mysql.pool.min,
    acquire: db_config.db_mysql.pool.acquire,
    idle: db_config.db_mysql.pool.idle,
  },
});

db_sequelize.Sequelize = Sequelize;
db_sequelize.sequelize = sequelize;

module.exports = db_sequelize;