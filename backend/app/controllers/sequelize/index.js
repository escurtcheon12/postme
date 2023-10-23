const userController = require("./user.controller");
const authController = require("./auth.controller");
const categoriesController = require("./categories.controller");
const customersController = require("./customers.controller");
const ordersController = require("./orders.controller");
const orderDetailController = require("./order-detail.controller");
const productsController = require("./products.controller");
const stocksController = require("./stocks.controller");
const stockLogsController = require("./stock-logs.controller");
const suppliersController = require("./suppliers.controller");
const notificationsController = require("./notifications.controller");
const unitController = require("./unit.controller");
const unitConversionController = require("./unit_conversion.controller");
const opnameController = require("./opname.controller");
const stockOpnameController = require("./stock-opname.controller");

module.exports = {
  userController,
  authController,
  categoriesController,
  customersController,
  ordersController,
  orderDetailController,
  productsController,
  stocksController,
  stockLogsController,
  suppliersController,
  notificationsController,
  unitController,
  unitConversionController,
  opnameController,
  stockOpnameController
};
