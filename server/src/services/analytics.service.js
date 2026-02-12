const mongoose = require("mongoose");
const Food = require("../models/food.model");
const { calculateWastePercentage } = require("../utils/wasteCalculator");

async function getOverview(userId) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const [totals] = await Food.aggregate([
    { $match: { userId: objectId } },
    {
      $group: {
        _id: null,
        totalAdded: { $sum: "$quantity" },
        totalConsumed: {
          $sum: {
            $cond: [{ $eq: ["$status", "consumed"] }, "$quantity", 0],
          },
        },
        totalWasted: {
          $sum: {
            $cond: [{ $eq: ["$status", "wasted"] }, "$quantity", 0],
          },
        },
      },
    },
  ]);

  const result = totals || {
    totalAdded: 0,
    totalConsumed: 0,
    totalWasted: 0,
  };

  return {
    ...result,
    wastePercentage: calculateWastePercentage(result.totalConsumed, result.totalWasted),
  };
}

async function getCategoryBreakdown(userId) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const rows = await Food.aggregate([
    { $match: { userId: objectId, status: "wasted" } },
    {
      $group: {
        _id: "$category",
        value: { $sum: "$quantity" },
      },
    },
    { $sort: { value: -1 } },
  ]);

  return rows.map((row) => ({
    name: row._id,
    value: row.value,
  }));
}

async function getMonthlyWasteTrend(userId) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const rows = await Food.aggregate([
    {
      $match: {
        userId: objectId,
        status: "wasted",
        wastedAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$wastedAt" },
          month: { $month: "$wastedAt" },
        },
        waste: { $sum: "$quantity" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return rows.map((row) => ({
    name: `${String(row._id.month).padStart(2, "0")}/${row._id.year}`,
    waste: row.waste,
  }));
}

module.exports = {
  getOverview,
  getCategoryBreakdown,
  getMonthlyWasteTrend,
};