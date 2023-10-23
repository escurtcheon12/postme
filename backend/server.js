const express = require("express");
const path = require("path");
const logger = require("morgan");
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
app.use(logger(config.isProd ? "combined" : "dev"));
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

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {path
  // set locals, only providing error in development
  res.locals.message = err.message; // eslint-disable-line no-param-reassign
  res.locals.error = config.isDev ? err : {}; // eslint-disable-line no-param-reassign
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// start server
async function startServer() {
  app.listen(config.server.port, (err) => {
    if (err) {
      process.exit(1);
    }
    Logger.info("Port opened at " + config.server.port);
  });
}

startServer();
