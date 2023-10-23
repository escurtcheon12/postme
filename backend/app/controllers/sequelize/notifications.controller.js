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
      const user_id = req.user_id;
      const { status_admin, sort } = req.query;
      const data = await repository.notificationsRepository.list(
        user_id,
        status_admin,
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
  count: async (req, res) => {
    try {
      const { status, status_admin } = req.query;
      const user_id = req.user_id;
      const data = await repository.notificationsRepository.count(
        status,
        user_id,
        status_admin
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
    const transaction = await sequelize.transaction();

    try {
      const user_id = req.user_id;
      const { title, message } = req.body;
      if (!title || !message)
        throw new BadRequestException("Title dan message harus di isi");

      const data = await repository.notificationsRepository.create(
        {
          user_id,
          title,
          message,
        },
        transaction
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
  updateReadAllByAdmin: async (req, res) => {
    try {
      const data =
        await repository.notificationsRepository.updateReadAllByAdmin();

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
  updateReadAllByUserId: async (req, res) => {
    try {
      const user_id = req.user_id;

      const data =
        await repository.notificationsRepository.updateReadAllByUserId(user_id);

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
      if (!id || !name)
        throw new BadRequestException("Id or name should be required");

      const data_categories = await repository.notificationsRepository.update(
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

      const data_categories = await repository.notificationsRepository.update(
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
