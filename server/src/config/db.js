const mongoose = require("mongoose");
const config = require("./index");

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;