const config = require("./utils/config");
const path = require("path");
const express = require("express");
const database = require("./utils/database");
const cors = require("cors");
const { createStandaloneLogger } = require("@technoease/logger");
const { fetchCustomerId, customerOutstandingAmount, createAmount } = require("./helper/ax-function");
const Log = require("./model/log");
const { send_notification } = require("./helper/mailer");

const app = express();

const logger = createStandaloneLogger({
  level: config.get('LOG_LEVEL', 'info'),
  console: false, // Disable console logging by default
}, {
  model: Log,
  fallback: {
    path: config.get('LOG_PATH')
      ? (path.isAbsolute(config.get('LOG_PATH'))
        ? config.get('LOG_PATH')
        : path.join(__dirname, config.get('LOG_PATH')))
      : path.join(__dirname, 'logs'),
    filename: config.get('LOG_FILENAME', 'combined.log'),
    errorFilename: config.get('LOG_ERROR_FILENAME', 'error.log')
  }
});

require("./relation").relation();

const salesRoutes = require("./routes/sales-routes");
const authRoutes = require("./routes/auth-routes");
const superAdminRoutes = require("./routes/super-admin-routes");
const measurerRoutes = require("./routes/measurer-routes");
const qualityRoutes = require("./routes/quality-check-routes");
const orderRoutes = require("./routes/order-routes");
const installerRoutes = require("./routes/installer_routes");
const outletRoutes = require("./routes/outlet");
const customerRoutes = require("./routes/customer");
const staRoutes = require("./routes/sta-routes");
const paymentRoutes = require("./routes/payment-routes");
app.use(cors({
  origin: "*"
}));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  if (config.getBoolean('ENABLE_REQUEST_LOGGING')) {
    logger.log(`${req.method} ${req.url}`, {
      body: req.body,
      params: req.params,
      query: req.query,
    });
  }
  next();
});

app.get("/", (req, res, next) => {
  return res
    .status(200)
    .json({
      message: `Walcome in fandf-------------   ${config.get('LOCAL_URL')}`,
    });
});



app.use("/api/v1/sales", salesRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/superadmin", superAdminRoutes);
app.use("/api/v1/measurer", measurerRoutes);
app.use("/api/v1/quality", qualityRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/outlet", outletRoutes);
app.use("/api/v1/installer", installerRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/sta", staRoutes);
app.use("/api/v1/payment", paymentRoutes);

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return; // returns undefined to omit the property
      }
      seen.add(value);
    }
    return value;
  };
};

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  logger.error(message, {
    stack: error.stack,
    url: req.url,
    method: req.method,
    statusCode: statusCode,
    body: req.body,
    params: req.params,
    query: req.query
  });

  const jsonString = JSON.stringify(error, getCircularReplacer());

  return res
    .status(statusCode)
    .json({
      message: message,
      stack: error.stack,
      statusCode: statusCode,
      json: jsonString,
      status: false,
    });
});

app.listen(config.getNumber('PORT', 3000), () => {
  console.log(`Server is running on Port :- ${config.get('PORT')}`);
});
database
  .sync()
  .then((result) => {
    console.log("Database Synced Successfully");
  })
  .catch((err) => {
    console.log(err);
  });
