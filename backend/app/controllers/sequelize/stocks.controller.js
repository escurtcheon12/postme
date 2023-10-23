"use strict";

const { helpers } = require("../../helpers");
const repository = require("../../repositories/index");
const Logger = require("../../libraries/logger.library");
const { BadRequestException } = require("../../helpers/errors");
const { stat } = require("fs");
const { sequelize } = require("../../../config/sequelize_db");

let controller = {
  list: async (req, res) => {
    try {
      const { search, sort } = req.query;
      const data = await repository.stocksRepository.list(search, sort);

      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  listWithDetailLogs: async (req, res) => {
    try {
      const { search, sort, status_stock_logs } = req.query;
      const user_id = req.user_id;
      const data = await repository.stocksRepository.listWithDetailLogs(
        search,
        sort,
        user_id,
        status_stock_logs
      );

      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  createWithLogs: async (req, res) => {
    try {
      const transaction = await sequelize.transaction();

      let { product_id, stock_now, suppliers_id, unit, description } = req.body;

      if (!product_id || stock_now == 0 || !suppliers_id)
        throw new BadRequestException(
          "Produk, stock, dan supplier harus di isi"
        );

      if (description && description.length < 3)
        throw new BadRequestException("Deskripsi minimal 3 character");

      const productById = repository.productsRepository.getById(product_id);
      const getSuppliersById =
        repository.suppliersRepository.getById(suppliers_id);
      const stockById = repository.stocksRepository.getById(id);

      let message_error = [];
      let stock_before = 0;
      let stock_after = 0;

      const data = await Promise.all([
        productById,
        getSuppliersById,
        stockById,
      ]);

      data.forEach(async (item, index) => {
        if (index == 0) {
          if (!item) message_error.push("Product tidak di temukan");

          product_id = item.id;
        }

        if (index == 1) {
          if (!item) message_error.push("Suppliers tidak di temukan");

          suppliers_id = item.id;
        }

        if (index == 2) {
          if (!item) message_error.push("Stock tidak di temukan");

          if (stock_now > 0) {
            stock_after = item.stock_now + stock_now;
          }

          if (stock_now < 0) {
            stock_after = item.stock_now - Math.abs(stock_now);

            if (stock_after < 0)
              message_error.push("Stock harus mempunyai sisa");
          }

          stock_before = item.stock_now;

          await repository.stockLogsRepository.create(
            {
              stock_id: item.id,
              description,
              stock_before: item.stock_now,
              action: stock_now > 0 ? "1" : "0",
            },
            transaction
          );
        }
      });

      if (message_error.length > 0) {
        throw new BadRequestException(message_error);
      }

      const result = await repository.stocksRepository.update(
        {
          product_id,
          suppliers_id,
          stock_before,
          stock_now: Math.abs(stock_after),
        },
        transaction
      );

      await transaction.commit();

      return res.json({
        status: result ? "success" : "failed",
      });
    } catch (err) {
      await transaction.rollback();
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  updateWithLogs: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      let { id, product_id, stock_now, suppliers_id, description } = req.body;
      const user_id = req.user_id;

      if (!id) throw new BadRequestException("Id item tidak di temukan");
      if (product_id == 0 && !stock_now)
        throw new BadRequestException("Produk, dan stock harus di isi");

      if (description && description.length < 3)
        throw new BadRequestException("Deskripsi minimal 3 character");

      const productById = repository.productsRepository.getById(product_id);
      const getSuppliersById =
        repository.suppliersRepository.getById(suppliers_id);
      const stockById = repository.stocksRepository.getById(id);

      let message_error = [];
      let stock_id = 0;
      let unit_id = 0;
      let current_stock = 0;
      let stock_after = 0;
      let product_name;

      const data = await Promise.all([
        productById,
        getSuppliersById,
        stockById,
      ]);

      data.forEach(async (item, index) => {
        if (index == 0) {
          if (!item) message_error.push("Product tidak di temukan");

          product_name = item.name;
          product_id = item.id;
          unit_id = item.unit_id;
        }

        if (index == 1) {
          //   if (!item) message_error.push("Suppliers tidak di temukan");
        }

        if (index == 2) {
          if (!item) message_error.push("Stock tidak di temukan");

          if (stock_now > 0) {
            stock_after = item.stock_now + Number(stock_now);
          }

          if (stock_now < 0) {
            stock_after = item.stock_now - Math.abs(Number(stock_now));

            if (stock_after < 0)
              message_error.push("Stock harus mempunyai sisa");
          }

          current_stock = item.stock_now;
          stock_id = item.id;
        }
      });

      if (message_error.length > 0) {
        throw new BadRequestException(message_error);
      }

      const dataUnitById = await repository.unitRepository.getById(unit_id);

      let data_unit_conversion =
        await repository.unitConversionRepository.listByProductName(
          product_name
        );

      const findDataUnitConversion = data_unit_conversion.find(
        (item) => item.product_id == product_id
      );

      let result;
      let mainConversion = [];
      if (findDataUnitConversion) {
        data_unit_conversion = [
          ...[findDataUnitConversion],
          ...data_unit_conversion.filter(
            (item) => item.product_id != findDataUnitConversion.product_id
          ),
        ];

        for (const item of data_unit_conversion) {
          const getStockByProductId =
            await repository.productsRepository.getProductDetailWithStocks(
              item.product_id
            );

          /* FORMULA CONVERSION INPUT STOCK / KONVERSION */
          let total_stocks_conversion = 0;
          if (item.status == 1 && item.product_id == product_id) {
            total_stocks_conversion = stock_after;
            mainConversion.push(item.conversion);
          } else if (item.status != 1 && item.product_id == product_id) {
            total_stocks_conversion = stock_after;
            mainConversion.push(item.conversion);
          } else if (
            item.status == 1 &&
            item.product_id != product_id &&
            mainConversion.length > 0
          ) {
            total_stocks_conversion =
              mainConversion.length > 1
                ? (stock_after * mainConversion[1]) / item.conversion
                : (stock_after * mainConversion[0]) / item.conversion;
          } else {
            total_stocks_conversion =
              mainConversion.length > 1
                ? (stock_after * mainConversion[1]) / item.conversion
                : (stock_after * mainConversion[0]) / item.conversion;
          }

          await repository.stockLogsRepository.create(
            {
              stock_id: item.stock_id,
              suppliers_id,
              description,
              stock_before: getStockByProductId.stock_now,
              stock_after: total_stocks_conversion,
              action: stock_now > 0 ? "1" : "0",
            },
            transaction
          );

          await repository.stocksRepository.update(
            {
              product_id: item.product_id,
              stock_now: Math.abs(total_stocks_conversion),
            },
            getStockByProductId.stock_id,
            transaction
          );
        }
      } else {
        await repository.stockLogsRepository.create(
          {
            stock_id: stock_id,
            suppliers_id,
            description,
            stock_before: current_stock,
            stock_after: stock_after,
            action: stock_now > 0 ? "1" : "0",
          },
          transaction
        );

        result = await repository.stocksRepository.update(
          {
            product_id,
            stock_now: Math.abs(stock_after),
          },
          id,
          transaction
        );
      }

      await repository.notificationsRepository.create(
        {
          user_id,
          title: "Stok",
          message: `Anda berhasil melakukan ${
            Math.sign(stock_now) === -1 ? "pengurangan" : "penambahan"
          } stok sebesar ${Math.abs(
            Number(stock_now)
          )} quantity untuk produk ${product_name} dengan unit ${
            dataUnitById.name
          } dan total stok saat ini adalah ${stock_after}`,
        },
        transaction
      );

      await transaction.commit();

      return res.json({
        status: result ? "success" : "failed",
      });
    } catch (err) {
      await transaction.rollback();
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  create: async (req, res) => {
    try {
      const transaction = await sequelize.transaction();
      const { product_id, suppliers_id, stock_now /*, status */ } = req.body;
      if (!product_id) throw new BadRequestException("Id product harus di isi");

      const data = await repository.stocksRepository.create(
        {
          product_id,
          suppliers_id,
          stock_now,
          /* status,*/
        },
        transaction
      );

      await transaction.commit();

      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      await transaction.rollback();
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  update: async (req, res) => {
    try {
      const transaction = await sequelize.transaction();
      const { id } = req.params;
      const { product_id, suppliers_id, stock_now /*, status */ } = req.body;
      if (!id) throw new BadRequestException("Id harus di isi");

      const data = await repository.stocksRepository.update(
        { product_id, suppliers_id, stock_now /*, status */ },
        id,
        transaction
      );

      await transaction.commit();

      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      await transaction.rollback();
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  updateByProductId: async (req, res) => {
    try {
      const transaction = await sequelize.transaction();
      const { id } = req.params;
      const { suppliers_id, stock_now /*, status*/ } = req.body;

      if (!id) throw new BadRequestException("Product Id harus di isi");

      const data = await repository.stocksRepository.updateByProductId(
        { suppliers_id, stock_now /*, status  */ },
        id
      );

      await transaction.commit();

      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      await transaction.rollback();
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.body;
      const date = new Date();

      if (!id) throw new BadRequestException("Id harus di isi");

      const data = await repository.stocksRepository.update(
        { deletedAt: date },
        id
      );

      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
};

module.exports = controller;
