const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./app/routes/index");
const cors = require("cors");
const Logger = require("./app/libraries/logger.library");

/* config */
const config = require("./config/config");
const db_sequelize = require("./config/sequelize_db");

db_sequelize.sequelize
  .sync()
  .then((res) => {
    Logger.info(res.models, "Synced db.");
  })
  .catch((err) => {
    Logger.error("Failed to sync db: " + err.message);
  });

app.use(cors());
// app.use(logger(config.isProd ? "combined" : "dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(routes());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// app.use((err, req, res, next) => {
//   path;
//   res.locals.message = err.message; 
//   res.locals.error = config.isDev ? err : {}; 
//   res.status(err.status || 500);
//   res.render("error");
// });

async function startServer() {
  app.listen(config.server.port, (err) => {
    if (err) {
      process.exit(1);
    }
    Logger.info("Port opened at " + config.server.port);
  });
}

startServer();
