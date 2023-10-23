"use strict";

const { categoriesController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/categories", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", categoriesController.list);
    router.post("/create", categoriesController.create);
    router.post("/update", categoriesController.update);
    router.post("/delete", categoriesController.delete);
  });
};
