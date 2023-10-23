"use strict";

const { stocksController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/stocks", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", stocksController.list);
    router.get("/list-detail-logs", stocksController.listWithDetailLogs);
    router.post("/update-logs", stocksController.updateWithLogs);
    router.post("/create-logs", stocksController.createWithLogs);
    router.post("/create", stocksController.create);
    router.post("/update/:id", stocksController.update);
    router.post("/updateByProductId/:id", stocksController.updateByProductId);
    router.post("/delete", stocksController.delete);
  });
};
