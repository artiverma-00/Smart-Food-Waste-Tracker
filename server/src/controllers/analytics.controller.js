const analyticsService = require("../services/analytics.service");

async function getOverview(req, res, next) {
  try {
    const overview = await analyticsService.getOverview(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Analytics overview fetched successfully",
      data: overview,
    });
  } catch (error) {
    return next(error);
  }
}

async function getCategoryBreakdown(req, res, next) {
  try {
    const categories = await analyticsService.getCategoryBreakdown(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Category analytics fetched successfully",
      data: categories,
    });
  } catch (error) {
    return next(error);
  }
}

async function getMonthlyTrend(req, res, next) {
  try {
    const trend = await analyticsService.getMonthlyWasteTrend(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Monthly trend fetched successfully",
      data: trend,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOverview,
  getCategoryBreakdown,
  getMonthlyTrend,
};