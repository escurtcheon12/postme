"use strict";

const { stockLogsController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/stock-logs", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", stockLogsController.list);
    router.post("/create", stockLogsController.create);
    router.post("/update", stockLogsController.update);
    router.post("/delete", stockLogsController.delete);
    router.get("/list-description", stockLogsController.listDescription);
  });
};
