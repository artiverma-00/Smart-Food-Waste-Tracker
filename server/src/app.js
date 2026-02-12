const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const config = require("./config");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later.",
      data: {},
    },
  })
);

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;