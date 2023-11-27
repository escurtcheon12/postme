"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedException } = require("../helpers/errors");

let library = {
  jwt_verify: (req, res, next) => {
    jwt.verify(req.token, "user_id", (err, data) => {
      if (err) {
        const err = new UnauthorizedException();
        next(err);
      } else req.user_id = data.user_id;
    });
    next();
  },
  auth: (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
    } else {
      // const err = new Error("Unauthorized");
      // err["status"] = 403;
      // res.status(403).json({
      //   message: "Unauthorized",
      // });
      const err = new UnauthorizedException();
      next(err);
    }
    next();
  },
};

module.exports = library;
