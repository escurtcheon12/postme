"use strict";

const { suppliersController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/suppliers", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", suppliersController.list);
    router.post("/create", suppliersController.create);
    router.post("/update", suppliersController.update);
    router.post("/delete", suppliersController.delete);
  });
};
