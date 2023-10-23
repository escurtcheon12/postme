"use strict";

const { helpers } = require("../../helpers/index");
const message = require("../../helpers/message");
const repository = require("../../repositories");
const { BadRequestException } = require("../../helpers/errors");
const Logger = require("../../libraries/logger.library");

let controller = {
  list: async (req, res) => {
    try {
      const { search, sort } = req.query;
      const user_id = req.user_id;

      const data = await repository.customersRepository.list(
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
      return res
        .status(500)
        .json({ status: "failed", message: message.server_error });
    }
  },
  totalCustomers: async (req, res) => {
    try {
      const { status } = req.query;
      const user_id = req.user_id;
      const data = await repository.customersRepository.totalCustomers(
        user_id,
        status
      );

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
  create: async (req, res) => {
    try {
      let { name, phone_number, address } = req.body;

      if (!name) throw new BadRequestException("Nama pelanggan harus di isi");

      name = name.trim();

      const data_customers_by_name =
        await repository.customersRepository.getByName(name);

      if (name.length < 3) {
        throw new BadRequestException("Nama pelanggan minimal 3 character");
      }

      if (data_customers_by_name && data_customers_by_name.name) {
        throw new BadRequestException(
          "Nama pelanggan sudah di pakai di data sebelumnya"
        );
      }

      if (phone_number || address) {
        if (phone_number.length < 3 || phone_number.length > 13) {
          throw new BadRequestException(
            "Nomor telepon minimal 3 character dan maximal 13 character"
          );
        }

        if (Math.sign(phone_number) === -1) {
          throw new BadRequestException("Nomor telepon harus positive number");
        }

        if (address.length < 3) {
          throw new BadRequestException("Alamat minimal 3 character");
        }
      }

      if (phone_number) {
        if (phone_number.startsWith("62")) {
          phone_number = phone_number.replace("62", "08");
        }

        if (!phone_number.startsWith("08")) {
          throw new BadRequestException(
            "Nomor harus mempunyai angka depan 08 atau 62"
          );
        }

        const data_customers_by_phone_number =
          await repository.customersRepository.getByPhoneNumber(phone_number);

        if (data_customers_by_phone_number) {
          throw new BadRequestException(
            "Nomor yang di input sudah di pakai oleh yang pelanggan yang lain"
          );
        }
      }

      const data = await repository.customersRepository.create({
        name,
        phone_number,
        address,
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
      let { id, name, phone_number, address } = req.body;
      if (!id) throw new NotFoundException("Id item tidak di temukan");
      if (!name) throw new BadRequestException("Nama pelanggan harus di isi");

      name = name.trim();

      if (name.length < 3)
        throw new BadRequestException(
          "Nama pelanggan atau nomor telepon atau alamat minimal 3 character"
        );

      if (phone_number || address) {
        if (phone_number.length < 3 && phone_number.length > 13) {
          throw new BadRequestException(
            "Nomor telepon minimal 3 character dan maximal 13 character"
          );
        }

        if (Math.sign(phone_number) === -1) {
          throw new BadRequestException("Nomor telepon harus positive number");
        }

        if (address.length < 3) {
          throw new BadRequestException("Alamat minimal 3 character");
        }
      }

      const data = await repository.customersRepository.update(
        { name, phone_number, address },
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

      const data = await repository.customersRepository.update(
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
  count: async (req, res) => {
    try {
      const data = await repository.customersRepository.count();

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
