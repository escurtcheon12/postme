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

      const data = await repository.unitRepository.list(search, sort);

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
  listConversionUnitUsage: async (req, res) => {
    try {
      const { product_id } = req.query;

      const data_product = await repository.productsRepository.getById(
        product_id
      );
      const data_unit_conversion =
        await repository.unitRepository.listUnitUsage(data_product.name, 1);
      const data_unit = await repository.unitRepository.listExistingUnitUsage(
        data_product.name
      );

      let data;
      if (data_unit_conversion.length > 0) {
        data =
          data_unit.filter((item) => item.product_id == data_product.id) || [];
      } else if (data_unit_conversion.length == 0) {
        data =
          data_unit.filter((item) => item.product_id != data_product.id) || [];
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
  create: async (req, res) => {
    try {
      let { name, description } = req.body;

      if (!name) throw new BadRequestException("Nama unit harus di isi");

      name = name.replace(/\s+/g, "");

      if (name.length < 3)
        throw new BadRequestException("Nama unit minimal 3 character");

      const data_unit = await repository.unitRepository.getByName(name);
      if (data_unit && data_unit.name.replace(/\s+/g, "").toLowerCase() === name.replace(/\s+/g, "").toLowerCase()) {
        throw new BadRequestException("Nama unit sudah ada");
      }

      const data = await repository.unitRepository.create({
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
      let { id, name, description } = req.body;

      if (!id) throw new BadRequestException("Id item tidak di isi");
      if (!name) throw new BadRequestException("Nama unit harus di isi");

      name = name.replace(/\s+/g, "");

      if (name.length < 3)
        throw new BadRequestException("Nama unit minimal 3 character");

      const data_unit = await repository.unitRepository.getByName(name);
      if (data_unit && data_unit.name.toLowerCase() === name.toLowerCase()) {
        throw new BadRequestException("Nama unit sudah ada");
      }

      const data = await repository.unitRepository.update(
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

      const data_product = await repository.productsRepository.listByUnitId(id);

      if (data_product.length > 0) {
        throw new BadRequestException(
          "Data unit yang ada di data produk harus di hapus terlebih dahulu"
        );
      }

      const data = await repository.unitRepository.update(
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
