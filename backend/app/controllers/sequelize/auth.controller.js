"use strict";

const bcrypt = require('bcryptjs')
const { helpers } = require("../../helpers");
const message = require("../../helpers/message");
const nodemailer = require("../../libraries/nodemailer.library");
const jwt = require("jsonwebtoken");
const repository = require("../../repositories/index");
const Logger = require("../../libraries/logger.library");
const {
  NotFoundException,
  BadRequestException,
} = require("../../helpers/errors");
const utils = require("../../helpers/utils");

let controller = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        throw new BadRequestException("Username dan password harus di isi");

      const customer_check_name = await repository.userRepository.getByUsername(
        username
      );

      const compare_password = await bcrypt.compare(
        password,
        customer_check_name ? customer_check_name.password : ""
      );

      if (
        (username != customer_check_name.username &&
          password != customer_check_name.password) ||
        !compare_password
      ) {
        throw new BadRequestException("Username dan password salah");
      }

      if (customer_check_name.interval == 4) {
        throw new BadRequestException(
          "Akun anda di nonaktifkan silahkan hubungi admin"
        );
      }

      const token = jwt.sign(
        { user_id: customer_check_name.id || "" },
        "user_id"
      );
      return res.json({
        status: "success",
        token: token,
        data: customer_check_name,
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  updateToken: async (req, res) => {
    try {
      const { id, token } = req.body;
      if (!id || !token)
        throw new BadRequestException("Id dan token harus di isi");

      if (token.length < 3)
        throw new BadRequestException("Token minimal 3 character");

      await repository.userRepository.update({ token }, id);
      return res.json({
        status: "success",
        message: helpers.message.save_success,
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  updateForgotToken: async (req, res) => {
    try {
      const { id, forgot_token } = req.body;
      if (!id)
        throw new BadRequestException("Id dan forgot token harus di isi");

      if (forgot_token.length < 3)
        throw new BadRequestException("Forgot token minimal 3 character");
      if (forgot_token.length > 5)
        throw new BadRequestException("Forgot token maximal 5 character");

      await repository.userRepository.update({ forgot_token }, id);
      return res.json({
        status: "success",
        message: helpers.message.save_success,
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  forgotToken: async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) throw new BadRequestException("Username harus di isi");

      if (username.length < 3)
        throw new BadRequestException("Username minimal 3 character");

      const data = await repository.userRepository.getByUsername(username);
      if (!data) throw new NotFoundException("Username tidak di temukan");
      /* generate 5 random number  */
      const randomNumber = Math.floor(Math.random() * 90000) + 10000;
      /* email sender */

      await nodemailer.transporter(
        data.email,
        "Get verification number",
        randomNumber.toString()
      );
      await repository.userRepository.update(
        { forgot_token: randomNumber },
        data.id
      );

      return res.json({
        status: "success",
        data,
        message: "Otp number has been sended",
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  verifyToken: async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) throw new BadRequestException("Token harus disi");

      const data = await repository.userRepository.getByForgotToken(token);
      if (!data) throw new NotFoundException("Data tidak ditemukan");

      await repository.userRepository.update({ interval: 1 }, data.id);

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
  updateInterval: async (req, res) => {
    try {
      const { id, interval } = req.body;
      if (!id && !interval)
        throw new BadRequestException("Id dan interval harus di isi");

      await repository.userRepository.update(
        { interval, status: interval > 3 ? 0 : 1 },
        id
      );

      return res.json({
        status: "success",
        message: "Update interval has succesfully",
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  register: async (req, res) => {
    try {
      let { username, email, password, re_password } = req.body;

      if (!username || !email || !password || !re_password)
        throw new BadRequestException(
          "Username, email, dan password harus di isi"
        );

      if (username.length < 3 && email.length < 3 && password.length < 3)
        throw new BadRequestException(
          "Username,email, dan password minimal 3 character"
        );

      const check_email = utils.validateEmail(email);
      if (!check_email)
        throw new BadRequestException("Email harus mengandung @");

      username = username.trim();
      email = email.trim();
      password = password.trim();
      re_password = re_password.trim();

      if (password != re_password)
        throw new BadRequestException(
          "Password harus sama dengan password yang di ulang"
        );

      const check_existing_username =
        repository.userRepository.getByUsername(username);
      const check_existing_email = repository.userRepository.getByEmail(email);

      const data = await Promise.all([
        check_existing_username,
        check_existing_email,
      ]);

      let message = [];
      data.forEach((result, index) => {
        if (result)
          if (index == 0) message.push("Username yang di isi sudah terpakai");
          else message.push("Email yang di isi sudah terpakai");
      });

      if (message.length > 0) {
        throw new BadRequestException(
          message.length == 1 ? message : message.join(" dan ")
        );
      }

      const hash_password = await bcrypt.hash(password, 10);
      await repository.userRepository.create({
        username,
        email,
        password: hash_password,
      });

      return res.json({
        status: "success",
        message: message.save_success,
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  changeStatusAccount: async () => {
    try {
      const { id } = req.body;
      if (!id) throw new BadRequestException("id harus di isi");

      await repository.userRepository.update({ status: 0 }, id);

      return res.json({
        status: "success",
        message: "Change account status has succesfully",
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { re_password, password } = req.body;
      if (password.length < 3)
        throw new BadRequestException("Password minimal 3 character");

      if (!re_password || !password) {
        throw new BadRequestException(
          "Password lama dan password baru harus di isi"
        );
      }

      if (password != re_password)
        throw new BadRequestException(
          "Password baru harus beda dengan password yang lama"
        );

      const hash_password = await bcrypt.hash(password, 10);

      await repository.userRepository.update(
        { password: hash_password },
        req.params.id
      );

      return res.json({
        status: "success",
        message: "Password has been changes",
      });
    } catch (err) {
      Logger.error(err);
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  protected: (req, res) => {
    jwt.verify(req.token, "user_id", (err, data) => {
      if (err) {
        return res.status(403);
      } else {
        return res.json({
          message: "this protected",
          data: data,
        });
      }
    });
  },
};

module.exports = controller;
