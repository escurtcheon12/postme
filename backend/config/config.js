const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const config = {
  development: {
    server: {
      port: process.env.PORT || 5001,
      hostname: process.env.HOSTNAME || "admin",
    },
    database: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "kaneki123",
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || "db_final_project",
      // connectionLimit: process.env.DBLIMIT || 10,
    },
  },

  production: {
    server: {
      port: process.env.PORT || 5001,
      hostname: process.env.HOSTNAME || "admin",
    },
    database: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "kaneki123",
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || "db_final_project",
      // connectionLimit: process.env.DBLIMIT || 10,
    },
  },
};

config[env].isDev = env === "development";
config[env].isProd = env === "production";

module.exports = config[env];
