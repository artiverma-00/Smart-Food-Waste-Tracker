const express = require("express");
const analyticsController = require("../controllers/analytics.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/overview", analyticsController.getOverview);
router.get("/categories", analyticsController.getCategoryBreakdown);
router.get("/monthly-trend", analyticsController.getMonthlyTrend);

module.exports = router;