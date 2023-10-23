"use strict";

const { opnameController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/opnames", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", opnameController.list);
    router.post("/create", opnameController.create);
    router.post("/update", opnameController.update);
    router.post("/delete", opnameController.delete);
  });
};
