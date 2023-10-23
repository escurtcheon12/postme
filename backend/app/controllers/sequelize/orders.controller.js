"use strict";

const { helpers } = require("../../helpers");
const message = require("../../helpers/message");
const repository = require("../../repositories/index");
const Logger = require("../../libraries/logger.library");
const {
  NotFoundException,
  BadRequestException,
} = require("../../helpers/errors");
const { formatRupiah } = require("../../helpers/utils");
const { sequelize } = require("../../../config/sequelize_db");
const utils = require("../../helpers/utils");

let controller = {
  list: async (req, res) => {
    try {
      const { search, sort } = req.query;
      const data = await repository.ordersRepository.list(search, sort);

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
  listNewOrders: async (req, res) => {
    try {
      const { status } = req.query;
      const user_id = req.user_id;

      const data = await repository.ordersRepository.listNewOrder(
        user_id,
        status
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
  totalNominalOrders: async (req, res) => {
    try {
      const { status } = req.query;
      const user_id = req.user_id;
      const data = await repository.ordersRepository.totalNominalOrders(
        user_id,
        status
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
  totalOrders: async (req, res) => {
    try {
      const { status } = req.query;
      const user_id = req.user_id;
      const data = await repository.ordersRepository.totalOrders(
        user_id,
        status
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
  totalDebtOrders: async (req, res) => {
    try {
      const { status } = req.query;
      const user_id = req.user_id;
      const data = await repository.ordersRepository.totalDebtOrders(
        user_id,
        status
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
  listWithOrderDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const { sort } = req.query;

      const data = await repository.ordersRepository.listOrderDetailsById(
        id,
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
  listWithDetails: async (req, res) => {
    try {
      const { search, sort } = req.query;
      const user_id = req.user_id;

      const data = await repository.ordersRepository.listWithDetails(
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
      return res.status(err.status || 500).json({
        status: "failed",
        message: err.message || helpers.message.server_error,
      });
    }
  },
  create: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      let {
        customer_id,
        method,
        discount,
        paid_nominal,
        less_nominal,
        data_product_item,
      } = req.body;
      let user_id = req.user_id;

      if (!method || !paid_nominal || data_product_item.length == 0) {
        throw new BadRequestException(
          "Metode pembayaran, paid nominal, dan data product harus di isi"
        );
      }

      if (Math.sign(discount) === -1) {
        throw new BadRequestException(
          "Diskon harus mengandung positive number"
        );
      }

      let data = await repository.ordersRepository.create(
        {
          customer_id,
          user_id,
          discount,
          method,
          paid_nominal: Number(paid_nominal),
          less_nominal: Math.abs(less_nominal),
        },
        transaction
      );

      let error_message = [];
      let dataTotalRemainingUnitConversion = {};
      for (let [index, item] of data_product_item.entries()) {
        // if (item.stock_status) {
        const data_stocks_by_productId =
          await repository.stocksRepository.getByProductId(item.id);

        const data_unit_by_unitId = await repository.unitRepository.getById(
          item.unit_id
        );

        let stock_number_operation =
          data_stocks_by_productId.stock_now - item.qty;

        if (Math.sign(stock_number_operation) === -1) {
          error_message.push(
            "Stok yang diambil lebih banyak daripada jumlah stok yang ada"
          );
        }

        let data_unit_conversion =
          await repository.unitConversionRepository.listByProductName(
            item.name
          );

        let findDataUnitConversion = data_unit_conversion.find(
          (item_product) => item_product.product_id == item.id
        );

        if (findDataUnitConversion) {
          data_unit_conversion = [
            ...[findDataUnitConversion],
            ...data_unit_conversion.filter(
              (item_select) =>
                item_select.product_id != findDataUnitConversion.product_id
            ),
          ];

          let total_stocks_conversion = 0;
          let keyTargetObjectConversion = {};
          let main_unit_name = "";
          let mainConversion = [];
          for (let [
            index_data_unit,
            item_data_unit,
          ] of data_unit_conversion.entries()) {
            let getStockByProductId =
              await repository.productsRepository.getProductDetailWithStocks(
                item_data_unit.product_id
              );

            item_data_unit = {
              ...item_data_unit,
              stock_id: getStockByProductId.stock_id,
              product_id: item_data_unit.product_id,
              stock_before: getStockByProductId.stock_now,
            };

            /* FORMULA CONVERSION INPUT STOCK / KONVERSION */
            if (
              item_data_unit.status == 1 &&
              item_data_unit.product_id == item.id
            ) {
              keyTargetObjectConversion[`selectedProps${index_data_unit}`] =
                item.name;

              total_stocks_conversion =
                index == 0
                  ? stock_number_operation
                  : data_stocks_by_productId.stock_now;

              controller.validationDynamicConversion(
                dataTotalRemainingUnitConversion,
                item.name,
                total_stocks_conversion,
                item_data_unit
              );

              mainConversion.push(item_data_unit.conversion);
            } else if (
              item_data_unit.status != 1 &&
              item_data_unit.product_id == item.id
            ) {
              keyTargetObjectConversion[`selectedProps${index_data_unit}`] =
                item.name;

              total_stocks_conversion =
                index == 0
                  ? stock_number_operation
                  : data_stocks_by_productId.stock_now;

              //
              controller.validationDynamicConversion(
                dataTotalRemainingUnitConversion,
                item.name,
                total_stocks_conversion,
                item_data_unit
              );

              mainConversion.push(item_data_unit.conversion);
            } else if (
              item_data_unit.status == 1 &&
              item_data_unit.product_id != item.id &&
              mainConversion.length > 0
            ) {
              if (mainConversion.length > 0) {
                total_stocks_conversion =
                  (stock_number_operation * mainConversion[0]) /
                  item_data_unit.conversion;
              }

              //
              controller.validationDynamicConversion(
                dataTotalRemainingUnitConversion,
                item.name,
                total_stocks_conversion,
                item_data_unit
              );

              mainConversion.push(item_data_unit.conversion);
            } else {
              if (mainConversion.length > 0) {
                total_stocks_conversion =
                  (stock_number_operation * mainConversion[0]) /
                  item_data_unit.conversion;
              }

              //
              controller.validationDynamicConversion(
                dataTotalRemainingUnitConversion,
                item.name,
                total_stocks_conversion,
                item_data_unit
              );
            }

            if (item_data_unit.status == 1) {
              main_unit_name = item_data_unit.unit_name;
            }
          }

          /* VALIDATION FOR AFTER FIRST DATA PRODUCT VALIDATION EITHER SECOND OR CONTINIOUSLY */
          if (data_product_item.length > 0 && index != 0) {
            controller.formulaCalculateDataProductConversion(
              dataTotalRemainingUnitConversion,
              data_unit_by_unitId.name,
              main_unit_name,
              item.name,
              item.qty,
              mainConversion,
              error_message
            );
          }

          await repository.stocksRepository.update(
            {
              product_id: item.id,
              stock_now: Math.abs(total_stocks_conversion),
            },
            data_stocks_by_productId.id,
            transaction
          );
        } else {
          // update stock when data is not contain conversion
          await repository.stocksRepository.update(
            {
              product_id: item.id,
              stock_now: stock_number_operation,
            },
            data_stocks_by_productId.id,
            transaction
          );
          await repository.stockLogsRepository.create(
            {
              stock_id: data_stocks_by_productId.id,
              description: "Pengurangan data karena transaksi",
              stock_before: data_stocks_by_productId.stock_now,
              // stock_added: stock_number_operation,
              stock_after: stock_number_operation,
              action: "0",
            },
            transaction
          );
        }
        // }

        // create order detail with general data
        await repository.orderDetailRepository.create(
          {
            orders_id: data.id,
            product_id: item.id,
            quantity: item.qty,
            price: item.selling_price,
            unit: item.unit_id,
          },
          transaction
        );

        if (stock_number_operation < 10) {
          await repository.notificationsRepository.create(
            {
              user_id,
              title: "Stok",
              message: `Peringatan untuk produk ${item.name} dengan unit ${
                item.unit_name
              } ${
                stock_number_operation == 0
                  ? "tidak bisa dijual lagi"
                  : `tersisa ${stock_number_operation}`
              } harap untuk menambahkan kembali agar produk ${
                item.name ? "masih" : null
              } bisa terjual oleh pelanggan`,
            },
            transaction
          );
        }
      }

      // update stock when data is contain conversion
      await controller.updateStocksProductConversion(
        dataTotalRemainingUnitConversion,
        transaction
      );

      if (error_message.length > 0) {
        error_message.forEach((item) => {
          throw new BadRequestException(item);
        });
      }

      const customer_name = await repository.customersRepository.getById(
        customer_id || 0
      );

      const total_product_price = data_product_item.reduce(
        (total, { selling_price }) => {
          return Number(total) + Number(selling_price);
        },
        0
      );

      await repository.notificationsRepository.create(
        {
          user_id,
          title: "Transaksi",
          message: `Anda berhasil melakukan transaksi dengan atas nama customer ${
            customer_name ? customer_name.name : "Unknown"
          } sebesar ${formatRupiah(total_product_price)}`,
        },
        transaction
      );

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
  update: async (req, res) => {
    try {
      const { customer_id, discount, method, paid_nominal, less_nominal } =
        req.body;
      const { id } = req.params;

      if (!id) throw new BadRequestException("Id item harus di isi");
      if (!paid_nominal) {
        throw new BadRequestException("Paid nominal harus di isi");
      }

      const data = await repository.ordersRepository.update(
        { customer_id, discount, method, paid_nominal, less_nominal },
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

      if (!id) throw new BadRequestException("Id should be required");

      const data_categories = await repository.ordersRepository.update(
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
  validationDynamicConversion: (
    dataObject,
    productName,
    resultStockNumberOperation,
    dataUnitItem
  ) => {
    if (dataObject.hasOwnProperty(productName)) {
      dataObject[productName] = dataObject[productName] || {};
      dataObject[productName][dataUnitItem.unit_name] =
        dataObject[productName][dataUnitItem.unit_name] || {};

      if (
        !dataObject[productName][dataUnitItem.unit_name].hasOwnProperty(
          "value"
        ) ||
        dataObject[productName][dataUnitItem.unit_name]["value"] === undefined
      ) {
        dataObject[productName][dataUnitItem.unit_name]["value"] =
          resultStockNumberOperation;
      }

      dataObject[productName][dataUnitItem.unit_name]["conversion"] =
        dataUnitItem.conversion;
      dataObject[productName][dataUnitItem.unit_name]["product_id"] =
        dataUnitItem.product_id;
      dataObject[productName][dataUnitItem.unit_name]["stock_id"] =
        dataUnitItem.stock_id;
      dataObject[productName][dataUnitItem.unit_name]["stock_before"] =
        dataUnitItem.stock_before;
      dataObject[productName][dataUnitItem.unit_name]["status"] =
        dataUnitItem.status;
    } else {
      dataObject[productName] = {};
      dataObject[productName] = {
        [dataUnitItem.unit_name]: {
          stock_id: dataUnitItem.stock_id,
          product_id: dataUnitItem.product_id,
          value: resultStockNumberOperation,
          conversion: dataUnitItem.conversion,
          stock_before: dataUnitItem.stock_before,
          status: dataUnitItem.status,
        },
      };
    }
  },
  formulaCalculateDataProductConversion: (
    dataTotalRemainingUnitConversion,
    dataProductUnitName,
    mainKeyUnitConversion,
    productName,
    quantity,
    mainConversion,
    error_message
  ) => {
    Object.keys(dataTotalRemainingUnitConversion).forEach((outerKey) => {
      const nestedObj = dataTotalRemainingUnitConversion[outerKey]; // Get the nested object

      // LOOP FOR SECOND / CHILD OBJECT KEYS
      let data_index_below_selected_dataProduct = [];
      let status_result_operation = false;
      Object.keys(nestedObj).forEach((nestedKey, indexNestedKey) => {
        const nestedValue = nestedObj[nestedKey]; // Get the nested value
        const indexNestedObj = Object.keys(nestedObj);
        const indexOfLastDataProduct =
          indexNestedObj.indexOf(dataProductUnitName);

        // VALIDATATION FOR SECOND DATA PRODUCT aAND NEXT DATA CONTINOUSLY
        if (
          indexNestedKey == indexOfLastDataProduct &&
          productName == outerKey
        ) {
          const product_unit_name = dataProductUnitName;

          dataTotalRemainingUnitConversion[outerKey][product_unit_name][
            "value"
          ] =
            ((nestedObj[product_unit_name]["value"] - quantity) *
              mainConversion[0]) /
            nestedValue["conversion"];

          if (
            Math.sign(
              dataTotalRemainingUnitConversion[outerKey][product_unit_name][
                "value"
              ]
            ) === -1
          ) {
            error_message.push(
              "Stok yang diambil lebih banyak daripada jumlah stok yang ada"
            );
          }

          status_result_operation = true;
        } else if (
          indexNestedKey < indexOfLastDataProduct &&
          productName == outerKey
        ) {
          data_index_below_selected_dataProduct.push(indexNestedKey);
        } else {
          dataTotalRemainingUnitConversion[outerKey][nestedKey]["value"] =
            (nestedObj[mainKeyUnitConversion]["value"] *
              mainConversion[mainConversion.length - 1]) /
            nestedValue["conversion"];
        }

        if (status_result_operation) {
          controller.setLogicPreviousSelectedIndexUnitConversion(
            data_index_below_selected_dataProduct,
            indexNestedObj,
            mainConversion,
            dataTotalRemainingUnitConversion,
            dataProductUnitName,
            mainKeyUnitConversion,
            nestedObj,
            outerKey
          );
        }
      });
    });
  },
  setLogicPreviousSelectedIndexUnitConversion: (
    dataIndexUnderSelectedDataProduct,
    indexNestedObj,
    mainConversion,
    dataTotalRemainingUnitConversion,
    dataProductUnitName,
    mainKeyUnitConversion,
    nestedObj,
    outerKey
  ) => {
    dataIndexUnderSelectedDataProduct.forEach((item_selected) => {
      const getKeyObjByIndex = indexNestedObj.filter(
        (item_obj, index_data_unit) => {
          return index_data_unit == item_selected;
        }
      );

      getKeyObjByIndex.forEach((item_new_key) => {
        const replaceNestedValuePosition =
          nestedObj[item_new_key]["conversion"];
        const statusNestedValue = nestedObj[item_new_key]["status"];

        if (statusNestedValue == 1 && mainConversion.length > 1) {
          dataTotalRemainingUnitConversion[outerKey][item_new_key]["value"] =
            (nestedObj[dataProductUnitName]["value"] * mainConversion[0]) /
            replaceNestedValuePosition;
        } else {
          dataTotalRemainingUnitConversion[outerKey][item_new_key]["value"] =
            (nestedObj[dataProductUnitName]["value"] * mainConversion[0]) /
            replaceNestedValuePosition;
        }
      });
    });
  },
  updateStocksProductConversion: async (
    dataTotalRemainingUnitConversion,
    transaction
  ) => {
    for (const outerKey in dataTotalRemainingUnitConversion) {
      const innerObject = dataTotalRemainingUnitConversion[outerKey];
      for (const innerKey in innerObject) {
        const nestedValue = innerObject[innerKey];

        await repository.stocksRepository.update(
          {
            product_id: nestedValue.product_id,
            stock_now: nestedValue.value,
          },
          nestedValue.stock_id,
          transaction
        );

        await repository.stockLogsRepository.create(
          {
            stock_id: nestedValue.stock_id,
            description: "Pengurangan data karena order",
            stock_before: nestedValue.stock_before,
            // stock_added: nestedValue.value,
            stock_after: nestedValue.value,
            action: "0",
          },
          transaction
        );
      }
    }
  },
};

module.exports = controller;
