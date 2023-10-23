"use strict";

const { userController } = require("../controllers/sequelize");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/user", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", userController.list);
    router.post("/update", userController.update);
    router.post("/delete", userController.delete);
  });
};
