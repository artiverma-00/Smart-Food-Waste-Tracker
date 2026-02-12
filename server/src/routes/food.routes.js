const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createFoodSchema,
  updateFoodSchema,
  markStatusSchema,
} = require("../validators/food.validator");

const router = express.Router();

router.use(authMiddleware);

router.get("/", foodController.getFoods);
router.post("/", validate(createFoodSchema), foodController.addFood);
router.put("/:id", validate(updateFoodSchema), foodController.updateFood);
router.patch("/:id/status", validate(markStatusSchema), foodController.markFoodStatus);
router.delete("/:id", foodController.deleteFood);

module.exports = router;