"use strict";

const { notificationsController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/notifications", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", notificationsController.list);
    router.get("/count", notificationsController.count);
    router.post("/read-all", notificationsController.updateReadAllByUserId);
    router.post("/read-all-admin", notificationsController.updateReadAllByAdmin);
    router.post("/create", notificationsController.create);
    router.post("/update", notificationsController.update);
    router.post("/delete", notificationsController.delete);
  });
};
