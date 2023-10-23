"use strict";

const { orderDetailController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/order-detail", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", orderDetailController.list);
    router.post("/create", orderDetailController.create);
    router.post("/update", orderDetailController.update);
    router.post("/delete", orderDetailController.delete);
  });
};
