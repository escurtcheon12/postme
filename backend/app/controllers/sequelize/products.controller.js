"use strict";

const { helpers } = require("../../helpers");
const message = require("../../helpers/message");
const repository = require("../../repositories/index");
const Logger = require("../../libraries/logger.library");
const {
  NotFoundException,
  BadRequestException,
} = require("../../helpers/errors");
const { handleMulterError } = require("../../libraries/multer.library");

let controller = {
  list: async (req, res) => {
    try {
      const { search, category, rating } = req.query;
      const user_id = req.user_id;

      const data = await repository.productsRepository.list(
        search,
        category,
        user_id,
        rating
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
  totalProducts: async (req, res) => {
    try {
      const { status } = req.query;
      const user_id = req.user_id;

      const data = await repository.productsRepository.totalProducts(
        user_id,
        status
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
  listOrder: async (req, res) => {
    try {
      const { search, category, rating } = req.query;
      const user_id = req.user_id;
      const data = await repository.productsRepository.listOrder(
        search,
        category,
        user_id,
        rating
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
  listBestseller: async (req, res, status) => {
    try {
      const { status } = req.query;
      const user_id = req.user_id;
      const data = await repository.productsRepository.listBestseller(
        user_id,
        status
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
  listDetailStocks: async (req, res) => {
    try {
      const data = await repository.productsRepository.listDetailStocks(
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
  listWithLogs: async (req, res) => {
    try {
      const { search, sort } = req.query;
      const user_id = req.user_id;

      const data = await repository.productsRepository.listWithLogs(
        search,
        user_id,
        sort
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
  listById: async (req, res) => {
    try {
      const { id } = req.body;
      const data = await repository.productsRepository.getById(id);

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
      const user_id = req.user_id;
      const file = req.file ? req.file.filename : "";
      let { category_id, name, unit_id, capital_price, selling_price } =
        req.body;

      name = name.trim();

      if (
        !name ||
        category_id == 0 ||
        unit_id == 0 ||
        !capital_price ||
        !selling_price ||
        !file
      )
        throw new BadRequestException(
          "nama produk,kategori,image,harga pokok,harga jual, dan unit harus di isi"
        );

      if (name.length < 3)
        throw new BadRequestException("Nama produk minimal 3 character");

      if (capital_price || selling_price) {
        if (capital_price.length < 1 || selling_price.length < 1) {
          throw new BadRequestException(
            "Harga pokok dan harga jual minimal 1 number"
          );
        }


        if (
          Math.sign(capital_price) === -1 ||
          Math.sign(selling_price) === -1
        ) {
          throw new BadRequestException(
            "Harga pokok dan harga jual harus mengandung angka positive"
          );
        }
      }

      if (Number(capital_price) > Number(selling_price)) {
        throw new BadRequestException("Harga pokok harus di bawah harga jual");
      }

      const data_product =
        await repository.productsRepository.getByNameAndUnitId(name, unit_id);
      if ((data_product && data_product.unit_id) == unit_id)
        throw new BadRequestException(
          "Unit produk yang di pilih sudah ada sebelumnya"
        );

      const data = await repository.productsRepository.create({
        user_id,
        category_id,
        name,
        image: file,
        unit_id,
        capital_price,
        selling_price,
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
    try {
      const { id } = req.params;
      let { category_id, unit_id, name, capital_price, selling_price } =
        req.body;

      name = name.trim();

      if (!id) throw new BadRequestException("Id item harus di isi");
      if (
        category_id == 0 ||
        !name ||
        !capital_price ||
        !selling_price ||
        unit_id == 0
      )
        throw new BadRequestException(
          "Kategori, nama produk, harga pokok, harga jual, dan unit harus di isi"
        );

      if (name.length < 3)
        throw new BadRequestException("Nama produk minimal 3 character");

      if (capital_price || selling_price) {
        if (capital_price.length < 3 || selling_price.length < 3) {
          throw new BadRequestException(
            "Harga pokok dan harga jual minimal 3 character"
          );
        }

        if (
          Math.sign(capital_price) === -1 ||
          Math.sign(selling_price) === -1
        ) {
          throw new BadRequestException(
            "Harga pokok dan harga jual harus mengandung angka positive"
          );
        }
      }

      if (Number(capital_price) > Number(selling_price)) {
        throw new BadRequestException("Harga pokok harus di bawah harga jual");
      }

      const data_product = await repository.productsRepository.getById(id);
      const all_data_product_by_name =
        await repository.productsRepository.getByNameAndUnitId(name, unit_id);
      const filterByName =
        all_data_product_by_name.filter((item) => item.unit_id == unit_id) ||
        [];

      if (filterByName.length > 0 && unit_id != data_product.unit_id)
        throw new BadRequestException(
          "Unit produk yang di pilih sudah ada sebelumnya"
        );

      let obj_data = {
        category_id,
        name,
        capital_price,
        selling_price,
        unit_id
      };

      if (req.file && req.file.filename) {
        obj_data["image"] = req.file.filename;
      }

      const data = await repository.productsRepository.update(obj_data, id);

      return res.json({
        status: data ? "success" : "failed",
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
      const { id } = req.params;
      const date = new Date();

      if (!id) throw new BadRequestException("Id harus di isi");

      const data_product = await repository.productsRepository.getById(id);
      const data_conversion =
        await repository.unitConversionRepository.listByProductName(
          data_product.name
        );

      if (data_conversion.length > 0) {
        throw new BadRequestException(
          "Sebelum data produk di hapus data conversion yang sedang di ikat harus di hapus terlebih dahulu"
        );
      }

      const data = await repository.productsRepository.update(
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
