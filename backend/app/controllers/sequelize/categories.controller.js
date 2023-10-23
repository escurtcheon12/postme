"use strict";

const { helpers } = require("../../helpers");
const message = require("../../helpers/message");
const repository = require("../../repositories/index");
const Logger = require("../../libraries/logger.library");
const {
  NotFoundException,
  BadRequestException,
} = require("../../helpers/errors");

let controller = {
  list: async (req, res) => {
    try {
      const { search, sort } = req.query;
      const data = await repository.categoriesRepository.list(search, sort);

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
      const { name, description } = req.body;
      if (!name) throw new BadRequestException("Nama kategori harus di isi");

      if (name.length < 3)
        throw new BadRequestException("Nama suppliers minimal 3 character");

      if (description && description.length < 3) {
        throw new BadRequestException("Deskripsi minimal 3 character");
      }

      const data = await repository.categoriesRepository.create({
        name,
        description,
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
      const { id, name, description } = req.body;
      if (!id) throw new NotFoundException("Id item tidak di temukan");
      if (!name) throw new BadRequestException("Nama kategori harus di isi");

      if (name.length < 3)
        throw new BadRequestException("Nama suppliers minimal 3 character");

      if (description && description.length < 3) {
        throw new BadRequestException("Deskripsi minimal 3 character");
      }

      const data = await repository.categoriesRepository.update(
        { name, description },
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
  delete: async (req, res) => {
    try {
      const { id } = req.body;
      const date = new Date();

      if (!id) throw new BadRequestException("Id harus di isi");

      const data_product = await repository.productsRepository.listByCategoryId(
        id
      );

      if (data_product.length > 0) {
        throw new BadRequestException(
          "Data kategori yang ada di data produk harus di hapus terlebih dahulu"
        );
      }

      const data = await repository.categoriesRepository.update(
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
