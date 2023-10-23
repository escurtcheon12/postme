"use strict";

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
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

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = library;
