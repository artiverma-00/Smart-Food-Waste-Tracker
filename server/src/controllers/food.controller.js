const Food = require("../models/food.model");
const { getExpiryState } = require("../utils/wasteCalculator");

function mapFood(foodDoc) {
  return {
    id: foodDoc._id,
    userId: foodDoc.userId,
    name: foodDoc.name,
    category: foodDoc.category,
    quantity: foodDoc.quantity,
    expiryDate: foodDoc.expiryDate,
    status: foodDoc.status,
    expiryStatus: getExpiryState(foodDoc.expiryDate, foodDoc.status),
    notes: foodDoc.notes,
    createdAt: foodDoc.createdAt,
    updatedAt: foodDoc.updatedAt,
  };
}

async function addFood(req, res, next) {
  try {
    const food = await Food.create({
      ...req.body,
      userId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Food item added successfully",
      data: {
        item: mapFood(food),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getFoods(req, res, next) {
  try {
    const foods = await Food.find({ userId: req.user.userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Food items fetched successfully",
      data: {
        items: foods.map(mapFood),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateFood(req, res, next) {
  try {
    const food = await Food.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      data: {
        item: mapFood(food),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteFood(req, res, next) {
  try {
    const food = await Food.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
      data: {},
    });
  } catch (error) {
    return next(error);
  }
}

async function markFoodStatus(req, res, next) {
  try {
    const { status } = req.body;

    const update = {
      status,
      ...(status === "consumed" ? { consumedAt: new Date(), wastedAt: null } : {}),
      ...(status === "wasted" ? { wastedAt: new Date(), consumedAt: null } : {}),
    };

    const food = await Food.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: `Food marked as ${status}`,
      data: {
        item: mapFood(food),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addFood,
  getFoods,
  updateFood,
  deleteFood,
  markFoodStatus,
};