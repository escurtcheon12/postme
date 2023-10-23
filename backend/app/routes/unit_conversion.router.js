"use strict";

const { unitConversionController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/conversion", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", unitConversionController.list);
    router.get("/listByProductId", unitConversionController.listByProductName);
    router.post("/create", unitConversionController.create);
    router.post("/update", unitConversionController.update);
    router.post("/update-main-conversion", unitConversionController.updateMainConversion);
    router.post("/delete", unitConversionController.delete);
  });
};
