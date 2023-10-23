"use strict";

const { customersController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/customers", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", customersController.list);
    router.get("/total-customers", customersController.totalCustomers);
    router.post("/create", customersController.create);
    router.post("/update", customersController.update);
    router.post("/delete", customersController.delete);
    router.get("/count", customersController.count);
  });
};
