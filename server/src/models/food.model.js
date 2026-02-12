const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "consumed", "wasted"],
      default: "active",
      index: true,
    },
    consumedAt: {
      type: Date,
      default: null,
    },
    wastedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;