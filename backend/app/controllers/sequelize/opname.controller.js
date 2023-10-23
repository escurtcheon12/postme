"use strict";

const { helpers } = require("../../helpers");
const message = require("../../helpers/message");
const repository = require("../../repositories/index");
const Logger = require("../../libraries/logger.library");
const {
  NotFoundException,
  BadRequestException,
} = require("../../helpers/errors");
const { sequelize } = require("../../../config/sequelize_db");

let controller = {
  list: async (req, res) => {
    try {
      const { search, sort } = req.query;

      const data = await repository.opnameRepository.list(search, sort);

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
      let { status, stock_physique, description, stock_id } = req.body;

      const data = await repository.opnameRepository.create({
        status,
      });

      await repository.stockOpnameRepository.create({
        stock_physique,
        description,
        stock_id,
        opname_id: data.id,
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
    const transaction = await sequelize.transaction();

    try {
      const user_id = req.user_id;
      let { id, status } = req.body;

      if (!id) throw new BadRequestException("Id item tidak di isi");

      const data_stock_opnames =
        await repository.stockOpnameRepository.listByOpnamesId("", "", id);

      for (const item_stock_opnames of data_stock_opnames) {
        let data_conversion =
          await repository.unitConversionRepository.listByProductName(
            item_stock_opnames.product_name
          );

        const main_data_conversion =
          data_conversion.length > 0
            ? data_conversion.find(
                (item) => item.product_id == item_stock_opnames.product_id
              )
            : {};

        data_conversion =
          data_conversion.length > 0
            ? data_conversion.filter(
                (item) => item.product_id != item_stock_opnames.product_id
              )
            : [];

        if (Object.keys(main_data_conversion).length > 0) {
          data_conversion = [main_data_conversion, ...data_conversion];
        }

        let total_stock_result_conversion = 0;
        let main_conversion = 0;
        if (data_conversion.length > 0) {
          for (const item_conversion of data_conversion) {
            const data_stock_item_conversion =
              await repository.stocksRepository.getByProductId(
                item_conversion.product_id
              );

            if (item_stock_opnames.stock_id == data_stock_item_conversion.id) {
              main_conversion = item_conversion.conversion;
              total_stock_result_conversion = item_stock_opnames.stock_physique;
            } else {
              total_stock_result_conversion =
                (item_stock_opnames.stock_physique * main_conversion) /
                item_conversion.conversion;
            }

            await repository.stockOpnameRepository.update(
              {
                stock_system: item_stock_opnames.stock_now,
              },
              item_stock_opnames.id
            );

            await repository.stocksRepository.update(
              {
                stock_now: total_stock_result_conversion,
              },
              data_stock_item_conversion.id
            );

            await repository.stockLogsRepository.create({
              stock_id: data_stock_item_conversion.id,
              description: "Stok barang berubah karena adanya opname",
              stock_before: data_stock_item_conversion.stock_now,
              stock_after: total_stock_result_conversion,
              action:
                data_stock_item_conversion.stock_now >
                total_stock_result_conversion
                  ? "0"
                  : "1",
            });
          }
        } else {
          await repository.stockOpnameRepository.update(
            {
              stock_system: item_stock_opnames.stock_now,
            },
            item_stock_opnames.id
          );

          await repository.stocksRepository.update(
            {
              stock_now: item_stock_opnames.stock_physique,
            },
            item_stock_opnames.stock_id
          );

          await repository.stockLogsRepository.create({
            stock_id: item_stock_opnames.stock_id,
            description: "Stok barang berubah karena adanya opname",
            stock_before: item_stock_opnames.stock_now,
            stock_after: item_stock_opnames.stock_physique,
            action: Math.sign(item_stock_opnames.deviation) === -1 ? "0" : "1",
          });
        }

        await repository.notificationsRepository.create(
          {
            user_id,
            title: "Stok",
            message: `Anda berhasil melakukan opname stok dengan stok sistem sebesar ${item_stock_opnames.stock_now} quantity lalu untuk stok fisik sebesar ${item_stock_opnames.stock_physique} quantity mempunyai selisih ${item_stock_opnames.deviation} quantity untuk produk ${item_stock_opnames.product_name} dengan unit ${item_stock_opnames.unit_name}`,
          },
          transaction
        );
      }

      const data = await repository.opnameRepository.update({ status }, id);

      await transaction.commit();
      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      await transaction.rollback();
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

      const data_opname = await repository.opnameRepository.getById(id);

      if (data_opname.status == "1") {
        const data_stock_opnames =
          await repository.stockOpnameRepository.listByOpnamesId("", "", id);

        for (const item_stock_opnames of data_stock_opnames) {
          let data_conversion =
            await repository.unitConversionRepository.listByProductName(
              item_stock_opnames.product_name
            );

          const main_data_conversion =
            data_conversion.length > 0
              ? data_conversion.find(
                  (item) => item.product_id == item_stock_opnames.product_id
                )
              : {};

          data_conversion =
            data_conversion.length > 0
              ? data_conversion.filter(
                  (item) => item.product_id != item_stock_opnames.product_id
                )
              : [];

          if (Object.keys(main_data_conversion).length > 0) {
            data_conversion = [main_data_conversion, ...data_conversion];
          }

          let total_stock_result_conversion = 0;
          let main_conversion = 0;
          let stock_deviation =
            item_stock_opnames.status == "1"
              ? item_stock_opnames.stock_physique -
                item_stock_opnames.stock_system
              : item_stock_opnames.deviation;

          if (data_conversion.length > 0) {
            for (const item_conversion of data_conversion) {
              const data_stock_item_conversion =
                await repository.stocksRepository.getByProductId(
                  item_conversion.product_id
                );

              if (
                item_stock_opnames.stock_id == data_stock_item_conversion.id
              ) {
                main_conversion = item_conversion.conversion;

                if (Math.abs(stock_deviation) == -1) {
                  total_stock_result_conversion =
                    data_stock_item_conversion.stock_now +
                    Math.abs(stock_deviation);
                } else {
                  total_stock_result_conversion =
                    data_stock_item_conversion.stock_now -
                    Math.abs(stock_deviation);
                }
              } else {
                if (Math.abs(stock_deviation) == -1) {
                  let total_stock_operation =
                    data_stock_item_conversion.stock_now +
                    Math.abs(stock_deviation);
                  total_stock_result_conversion =
                    (Math.abs(total_stock_operation) * main_conversion) /
                    item_conversion.conversion;
                } else {
                  let total_stock_operation =
                    data_stock_item_conversion.stock_now -
                    Math.abs(stock_deviation);
                  total_stock_result_conversion =
                    (Math.abs(total_stock_operation) * main_conversion) /
                    item_conversion.conversion;
                }
              }

              await repository.stocksRepository.update(
                {
                  // stock_now: Math.abs(total_stock_result_conversion),
                  stock_now:
                    Math.sign(total_stock_result_conversion) == -1
                      ? 0
                      : total_stock_result_conversion,
                },
                data_stock_item_conversion.id
              );

              await repository.stockLogsRepository.create({
                stock_id: data_stock_item_conversion.id,
                description:
                  "Stok barang berubah kembali semula karena opname yang ada telah di batalkan",
                stock_before: Math.abs(data_stock_item_conversion.stock_now),
                // stock_after: Math.abs(total_stock_result_conversion),
                stock_after:
                  Math.sign(total_stock_result_conversion) == -1
                    ? 0
                    : total_stock_result_conversion,
                action: Math.sign(stock_deviation) == -1 ? "1" : "0",
              });
            }
          } else {
            const data_stock_item_conversion =
              await repository.stocksRepository.getByProductId(
                item_stock_opnames.product_id
              );

            if (Math.abs(stock_deviation) == -1) {
              total_stock_result_conversion =
                data_stock_item_conversion.stock_now +
                Math.abs(stock_deviation);
            } else {
              total_stock_result_conversion =
                data_stock_item_conversion.stock_now -
                Math.abs(stock_deviation);
            }

            await repository.stocksRepository.update(
              {
                // stock_now: Math.abs(total_stock_result_conversion),
                stock_now:
                  Math.sign(total_stock_result_conversion) == -1
                    ? 0
                    : total_stock_result_conversion,
              },
              item_stock_opnames.stock_id
            );

            await repository.stockLogsRepository.create({
              stock_id: item_stock_opnames.stock_id,
              description:
                "Stok barang berubah kembali semula karena opname yang di batalkan",
              stock_before: Math.abs(item_stock_opnames.stock_now),
              // stock_after: Math.abs(total_stock_result_conversion),
              stock_after:
                Math.sign(total_stock_result_conversion) == -1
                  ? 0
                  : total_stock_result_conversion,
              action: Math.sign(stock_deviation) == -1 ? "1" : "0",
            });
          }

          await repository.stockOpnameRepository.update(
            { deletedAt: date },
            item_stock_opnames.id
          );
        }
      }

      const data = await repository.opnameRepository.update(
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
