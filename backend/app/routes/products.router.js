"use strict";

const { productsController } = require("../controllers/sequelize/index");
const libraryMiddleware = require("../libraries/middleware.library");
const multerLibrary = require("../libraries/multer.library");

module.exports = (router) => {
  router.group("/products", libraryMiddleware.jwt_verify, (router) => {
    router.get("/list", productsController.list);
    router.get("/total-products", productsController.totalProducts);
    router.get("/list-order", productsController.listOrder);
    router.get("/list-bestseller", productsController.listBestseller);
    router.get("/list-detail-stocks", productsController.listDetailStocks);
    router.get("/list-logs", productsController.listWithLogs);
    router.post(
      "/create",
      multerLibrary.uploadImage,
      productsController.create
    );
    router.post(
      "/update/:id",
      multerLibrary.uploadImage,
      productsController.update
    );
    router.post("/delete/:id", productsController.delete);
  });
};
