"use strict";

const express = require("express");
const app = express();
const Router = require("express-group-router");
let router = new Router();
const middleware = require("../libraries/middleware.library");

module.exports = () => {
  router.group("/api", (auth_router) => {
    require("./auth.router")(auth_router);

    router.group("/web", middleware.auth, (core_router) => {
      require("./user.router")(core_router);
      require("./categories.router")(core_router);
      require("./customers.router")(core_router);
      require("./suppliers.router")(core_router);
      require("./stocks.router")(core_router);
      require("./stock-logs.router")(core_router);
      require("./orders.router")(core_router);
      require("./products.router")(core_router);
      require("./unit.router")(core_router);
      require("./unit_conversion.router")(core_router);
      require("./stock-opname.router")(core_router);
      require("./opname.router")(core_router);
      require("./notification.router")(core_router);
    });
  });

  let listRoutes = router.init();
  app.use(listRoutes);
  return app;
};
