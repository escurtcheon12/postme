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

      const data = await repository.stockOpnameRepository.list(search, sort);

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
  listByOpnamesId: async (req, res) => {
    try {
      const { id } = req.body;
      const { search, sort } = req.query;

      const data = await repository.stockOpnameRepository.listByOpnamesId(
        search,
        sort,
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
  create: async (req, res) => {
    try {
      const user_id = req.user_id;
      let { stock_physique, description, stock_id, opname_id } = req.body;

      if (stock_physique == 0 || stock_id == 0) {
        throw new BadRequestException("Stok id dan stok fisik harus di isi");
      }

      if (description && description.length < 3) {
        throw new BadRequestException("Deskripsi minimal 3 character");
      }

      if (opname_id == 0) {
        const data_opname = await repository.opnameRepository.create({
          status: "0",
          user_id,
        });

        opname_id = data_opname.id;
      }

      const data = await repository.stockOpnameRepository.create({
        stock_physique,
        description,
        stock_id,
        opname_id,
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
      let { id, stock_physique, description, stock_id, opname_id } = req.body;

      if (!id) throw new BadRequestException("Id item tidak di isi");

      if (stock_physique == 0 || stock_id == 0) {
        throw new BadRequestException("Stok id dan stok fisik harus di isi");
      }

      if (description && description.length < 3) {
        throw new BadRequestException("Deskripsi minimal 3 character");
      }

      const data = await repository.stockOpnameRepository.update(
        { stock_physique, description, stock_id, opname_id },
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

      const data = await repository.stockOpnameRepository.update(
        { deletedAt: date },
        id
      );

      const data_stock_opname = await repository.stockOpnameRepository.getById(
        id
      );

      const data_all_stock_opname =
        await repository.stockOpnameRepository.listByOpnamesId(
          "",
          "",
          data_stock_opname.opname_id
        );

      if (data_all_stock_opname.length == 0) {
        await repository.opnameRepository.update(
          {
            deletedAt: date,
          },
          data_stock_opname.opname_id
        );
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
};

module.exports = controller;
