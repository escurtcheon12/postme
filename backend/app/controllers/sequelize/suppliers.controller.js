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
      const user_id = req.user_id;

      const data_categories = await repository.suppliersRepository.list(
        search,
        user_id,
        sort
      );

      return res.json({
        status: "success",
        data: data_categories,
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
      const user_id = req.user_id;

      if (!name) throw new BadRequestException("Nama supplier harus di isi");

      name = name.replace(/\s+/g, "");

      if (name.length < 3)
        throw new BadRequestException("Nama suppliers minimal 3 character");

      if (description && description.length < 3) {
        throw new BadRequestException("Deskripsi minimal 3 character");
      }

      const data_suppliers = await repository.suppliersRepository.getByName(
        name
      );
      if (
        data_suppliers &&
        data_suppliers.name.toLowerCase() === name.toLowerCase()
      ) {
        throw new BadRequestException("Nama suppliers sudah ada");
      }

      const data = await repository.suppliersRepository.create({
        user_id,
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
      if (!name) throw new BadRequestException("Nama supplier harus di isi");

      name = name.replace(/\s+/g, "");

      if (name.length < 3)
        throw new BadRequestException("Nama suppliers minimal 3 character");

      if (description && description.length < 3) {
        throw new BadRequestException("Deskripsi minimal 3 character");
      }
      const data_suppliers = await repository.suppliersRepository.getByName(
        name
      );
      if (
        data_suppliers &&
        data_suppliers.name.toLowerCase() === name.toLowerCase()
      ) {
        throw new BadRequestException("Nama suppliers sudah ada");
      }

      const data = await repository.suppliersRepository.update(
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

      const data_categories = await repository.suppliersRepository.update(
        { deletedAt: date },
        id
      );

      return res.json({
        status: "success",
        data: data_categories,
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
