"use strict";

const { ordersController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/orders", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", ordersController.list);
    router.get("/list-new-orders", ordersController.listNewOrders);
    router.get("/total-nominal-orders", ordersController.totalNominalOrders);
    router.get("/total-orders", ordersController.totalOrders);
    router.get("/total-debt-orders", ordersController.totalDebtOrders);
    router.get(
      "/list-order-details/:id",
      ordersController.listWithOrderDetails
    );
    router.get("/list-details", ordersController.listWithDetails);
    router.post("/create", ordersController.create);
    router.post("/update/:id", ordersController.update);
    router.post("/delete", ordersController.delete);
  });
};
