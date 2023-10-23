"use strict";

const { stockOpnameController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/stock-opnames", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", stockOpnameController.list);
    router.post("/list-by-opname-detail", stockOpnameController.listByOpnamesId);
    router.post("/create", stockOpnameController.create);
    router.post("/update", stockOpnameController.update);
    router.post("/delete", stockOpnameController.delete);
  });
};
