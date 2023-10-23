"use strict";
const { validationResult } = require("express-validator");

let utils = {
  setValidateMessage: (messages) => {
    let message = [];
    for (let msg of messages) {
      message.push(msg.msg);
    }
    return message;
  },
  errorHandler: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = utils.setValidateMessage(errors.array());
      return res.status(400).json({ status: "failed", message: messages });
    }
  },
  validateEmail: (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  },
  formatRupiah: (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  },
  getDataObjDifferences: (arr1, arr2, key1, key2) => {
    return arr1.filter((object1) => {
      return !arr2.some((object2) => {
        key1 = object1.unit_id;
        key2 = object2.unit_id;

        if (!key1 || !key2) {
          return;
        }

        key1 = typeof key1 === "number" ? key1 : key1.toLowerCase();
        key2 = typeof key2 === "number" ? key2 : key2.toLowerCase();

        return key1 === key2;
      });
    });
  },
  getKeyByValue(obj, value) {
    return Object.keys(obj).find((key) => obj[key] === value);
  },
  duplicateValueArray(arr) {
    const result = [];

    for (let i = 0; i < arr.length; i++) {
      if (!result.includes(arr[i])) {
        result.push(arr[i]);
      }
    }

    return result;
  },
};

module.exports = utils;
