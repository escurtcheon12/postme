"use strict";

const multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let library = {
  uploadImage: (req, res, next) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const upload = multer({
      storage: storage,
      fileFilter: function (req, file, cb) {
        if (
          file.mimetype == "image/png" ||
          file.mimetype == "image/jpg" ||
          file.mimetype == "image/jpeg"
        ) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error("Only .png .jpg and .jpeg format allowed"));
        }
      },
      limits: { fileSize: maxSize },
    }).single("image");

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error occurred (e.g., file size exceeds limit)
        return res.status(400).json({ error: "Ukuran foto maksimal 5 MB" });
      } else if (err) {
        // Other errors occurred
        return res.status(400).json({ error: err.message });
      }

      next();
    });
  },
};

module.exports = library;
