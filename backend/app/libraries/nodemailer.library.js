"use strict";

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const logger = require("./logger.library");
dotenv.config();

let library = {
  transporter: async (emal_target, subject, message) => {
    try {
      let transporter = nodemailer.createTransport({
        port: 587,
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      let info = await transporter.sendMail({
        from: '"Postme forgot password" <no-reply@gmail.com>', // sender address
        to: emal_target,
        subject: subject,
        text: message,
      });

      logger.info("Message sent: %s", info.messageId);
      logger.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
      logger.error(err);
    }
  },
};

module.exports = library;
