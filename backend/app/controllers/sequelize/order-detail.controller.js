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
      const data_categories = await repository.orderDetailRepository.list(
        search,
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
    const transaction = await sequelize.transaction();

    try {
      const { name, description } = req.body;
      if (!name) throw new BadRequestException("Name should be required");

      const data = await repository.orderDetailRepository.create(
        {
          name,
          description,
        },
        transaction
      );

      transaction.commit();
      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      transaction.rollback();
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
      if (!id || !name)
        throw new BadRequestException("Id or name should be required");

      const data_categories = await repository.orderDetailRepository.update(
        { name, description },
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
  delete: async (req, res) => {
    try {
      const { id } = req.body;
      const date = new Date();

      if (!id) throw new BadRequestException("Id should be required");

      const data_categories = await repository.orderDetailRepository.update(
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
