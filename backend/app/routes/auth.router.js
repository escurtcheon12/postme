"use strict";

const { authController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/auth", (router) => {
    router.post("/login", authController.login);
    router.post("/register", authController.register);
    router.post("/update-forgot-token", authController.updateForgotToken);
    router.post("/update-token", authController.updateToken);
    router.post("/update-interval", authController.updateInterval);
    router.post("/nonactive-account", authController.changeStatusAccount);
    router.post("/change_password/:id", authController.changePassword);
    router.post("/forgot-password", authController.forgotToken);
    router.post("/verify", authController.verifyToken);
    router.get(
      "/jwt-protected",
      libraryMiddleware.auth,
      authController.protected
    );
  });
};
