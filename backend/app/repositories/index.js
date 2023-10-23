const userRepository = require("./users/user.repository");
const categoriesRepository = require("./categories/categories.repository");
const customersRepository = require("./customers/customers.repository");
const suppliersRepository = require("./suppliers/suppliers.repository");
const ordersRepository = require("./orders/orders.repository");
const orderDetailRepository = require("./order-detail/order-detail.repository");
const productsRepository = require("./products/products.repository");
const notificationsRepository = require("./notifications/notifications.repository");
const stockLogsRepository = require("./stock-logs/stock-logs.repository");
const stocksRepository = require("./stocks/stocks.repository");
const unitRepository = require("./unit/unit.repository");
const unitConversionRepository = require("./unit_conversion/unit_conversion.repository");
const stockOpnameRepository = require("./stock-opname/stock-opname.repository");
const opnameRepository = require("./opname/opname.repository");

module.exports = {
  userRepository,
  categoriesRepository,
  customersRepository,
  suppliersRepository,
  ordersRepository,
  orderDetailRepository,
  productsRepository,
  notificationsRepository,
  stockLogsRepository,
  stocksRepository,
  unitRepository,
  unitConversionRepository,
  stockOpnameRepository,
  opnameRepository
};
