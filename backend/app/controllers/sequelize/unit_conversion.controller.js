"use strict";

const { helpers } = require("../../helpers");
const repository = require("../../repositories/index");
const Logger = require("../../libraries/logger.library");
const {
  NotFoundException,
  BadRequestException,
} = require("../../helpers/errors");
const { sequelize } = require("../../../config/sequelize_db");

let controller = {
  list: async (req, res) => {
    try {
      const data = await repository.unitConversionRepository.list();

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
  listByProductName: async (req, res) => {
    try {
      const { productId } = req.query;

      const data_product = await repository.productsRepository.getById(
        productId
      );
      const data = await repository.unitConversionRepository.listByProductName(
        data_product.name
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
  create: async (req, res) => {
    try {
      let { product_id, stocks_id, conversion } = req.body;

      if (!product_id || !conversion)
        throw new BadRequestException(
          "Id produk, id unit, dan konversi harus di isi"
        );

      if (conversion < 0) {
        throw new BadRequestException("Konversi harus di atas 0");
      }

      const data_stocks = await repository.stocksRepository.getById(stocks_id);
      const data_product = await repository.productsRepository.getById(
        product_id
      );
      const data_main_unit_conversion =
        await repository.unitConversionRepository.listByProductName(
          data_product.name,
          1
        );

      const data_product_detail =
        await repository.unitConversionRepository.getByProductId(product_id);

      if (data_product_detail.length > 0) {
        throw new BadRequestException(
          "Data unit sudah di pakai di data konversi sebelumnya"
        );
      }

      // if (
      //   data_main_unit_conversion.length > 0 &&
      //   data_main_unit_conversion.conversion == conversion
      // ) {
      //   throw new BadRequestException(
      //     "Input conversion tidak bisa dengan angka 1 karena sudah di pakai di unit utama"
      //   );
      // }

      const data_unit_conversion =
        await repository.unitConversionRepository.listByProductName(
          data_product.name
        );

      let status_main_conversion;
      if (data_unit_conversion.length == 0) {
        conversion = 1;
        status_main_conversion = '1';
      } else {
        const data_main_products_stocks =
          await repository.productsRepository.getProductDetailWithStocks(
            data_main_unit_conversion[0].product_id
          );

        const total_stocks_conversion = conversion
          ? (data_main_products_stocks.stock_now *
              data_main_unit_conversion[0].conversion) /
            conversion
          : 0;

        await controller.setStocksValue(
          stocks_id,
          data_stocks.stock_now,
          total_stocks_conversion,
          "Penggambungan unit konversi ke unit utama"
        );
      }

      const data = await repository.unitConversionRepository.create({
        name: data_product.name,
        product_id,
        conversion,
        status: status_main_conversion,
      });

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
  update: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      let { id, product_id, unit_id, conversion } = req.body;

      if (!id) throw new NotFoundException("Id item tidak di temukan");
      if (!product_id || !conversion)
        throw new BadRequestException("Id produk, dan id unit harus di isi");

      const data_detail_conversion =
        await repository.unitConversionRepository.getByProductId(product_id);
      const data_main_conversion =
        await repository.unitConversionRepository.listByProductName(
          data_detail_conversion[0].name,
          1
        );
      const data_stock = await repository.stocksRepository.getByProductId(
        product_id
      );

      let stock_now = 0;
      if (data_main_conversion.length > 0) {
        stock_now =
          (data_stock.stock_now * data_detail_conversion[0].conversion) /
          conversion;
      }

      await controller.setStocksValue(
        data_stock.id,
        data_stock.stock_now,
        stock_now,
        "Edit conversion to new data"
      );

      const data = await repository.unitConversionRepository.update(
        { product_id, unit_id, conversion },
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
  updateMainConversion: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) throw new NotFoundException("Id item tidak di temukan");

      const data_detail_conversion =
        await repository.unitConversionRepository.getById(id);

      const data_all_conversion =
        await repository.unitConversionRepository.listByProductName(
          data_detail_conversion.name
        );

      let data;
      for (const item_conversion of data_all_conversion) {
        if (data_detail_conversion.id == item_conversion.id) {
          data = await repository.unitConversionRepository.update(
            { status: "1" },
            id
          );
        } else {
          data = await repository.unitConversionRepository.update(
            { status: "0" },
            item_conversion.id
          );
        }
      }

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
  delete: async (req, res) => {
    try {
      const { id, stocks_id } = req.body;
      const date = new Date();

      if (!id) throw new BadRequestException("Id harus di isi");

      const data_detail_unit_conversion =
        await repository.unitConversionRepository.getById(id);

      if (
        data_detail_unit_conversion &&
        // data_detail_unit_conversion.conversion != 1 &&
        data_detail_unit_conversion.status != 1
      ) {
        const data_stocks = await repository.stocksRepository.getById(
          stocks_id
        );

        await controller.setStocksValue(
          stocks_id,
          data_stocks.stock_now,
          0,
          "Melepas unit konversi dari unit utama"
        );
      }

      const data = await repository.unitConversionRepository.update(
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
  setStocksValue: async (id, stock_before, stock_after, description) => {
    await repository.stockLogsRepository.create({
      stock_id: id,
      description: description,
      stock_before,
      // stock_added: stock_after,
      stock_after: stock_after,
      action: stock_after >= stock_before ? "1" : "0",
    });

    await repository.stocksRepository.update(
      {
        stock_now: stock_after,
      },
      id
    );
  },
};

module.exports = controller;
