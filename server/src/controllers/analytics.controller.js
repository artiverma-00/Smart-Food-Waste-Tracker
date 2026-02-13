const analyticsService = require("../services/analytics.service");

async function getOverview(req, res, next) {
  try {
    const data = await analyticsService.getOverview(req.user.userId);
    return res.status(200).json({ success: true, message: "Analytics overview fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

async function getCategoryBreakdown(req, res, next) {
  try {
    const data = await analyticsService.getCategoryBreakdown(req.user.userId);
    return res.status(200).json({ success: true, message: "Category analytics fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

async function getMonthlyTrend(req, res, next) {
  try {
    const data = await analyticsService.getMonthlyWasteTrend(req.user.userId);
    return res.status(200).json({ success: true, message: "Monthly trend fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOverview,
  getCategoryBreakdown,
  getMonthlyTrend,
};