const dotenv = require("dotenv");

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpService: process.env.SMTP_SERVICE,
  emailFrom: process.env.EMAIL_FROM || "no-reply@smartfoodwaste.local",
};

if (!config.mongoUri) {
  throw new Error("MONGO_URI is required in environment variables");
}

if (!config.jwtSecret) {
  throw new Error("JWT_SECRET is required in environment variables");
}

module.exports = config;