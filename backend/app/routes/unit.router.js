"use strict";

const { unitController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/unit", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", unitController.list);
    router.get("/listConversionUnitUsage", unitController.listConversionUnitUsage);
    router.post("/create", unitController.create);
    router.post("/update", unitController.update);
    router.post("/delete", unitController.delete);
  });
};
