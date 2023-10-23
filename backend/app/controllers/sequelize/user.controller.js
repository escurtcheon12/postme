"use strict";

const { helpers } = require("../../helpers/index");
const message = require("../../helpers/message");
const repository = require("../../repositories");
const { BadRequestException } = require("../../helpers/errors");
const utils = require("../../helpers/utils");
const Logger = require("../../libraries/logger.library");

let controller = {
  list: async (req, res) => {
    try {
      const { search, sort } = req.query;
      const data = await repository.userRepository.list(search, sort);

      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      Logger.error(err);
      return res
        .status(500)
        .json({ status: "failed", message: message.server_error });
    }
  },
  update: async (req, res) => {
    try {
      let { id, username, email, status } = req.body;

      if (!id) throw new BadRequestException("Id item tidak di isi");
      if (!username || !email)
        throw new BadRequestException("Username dan email harus di isi");

      if (username.length < 3 || email.length < 3)
        throw new BadRequestException("Username dan email minimal 3 character");

      const check_email = utils.validateEmail(email);
      if (!check_email)
        throw new BadRequestException("Email harus mengandung @");

      username = username.trim();
      email = email.trim();

      const check_existing_username =
        repository.userRepository.getByUsername(username);
      const check_existing_email = repository.userRepository.getByEmail(email);

      const data_users = await Promise.all([
        check_existing_username,
        check_existing_email,
      ]);

      let message = [];
      data_users.forEach((result, index) => {
        if (result.length > 1)
          if (index == 0) message.push("Username yang di isi sudah terpakai");
          else message.push("Email yang di isi sudah terpakai");
      });

      if (message.length > 0) {
        throw new BadRequestException(
          message.length == 1 ? message : message.join(" dan ")
        );
      }

      const dataUserById = await repository.userRepository.getById(id);

      const data = await repository.userRepository.update(
        {
          username,
          email,
          status: Number(status),
          interval: status == 1 ? 1 : dataUserById.interval,
          },
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

      const data = await repository.userRepository.update(
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
