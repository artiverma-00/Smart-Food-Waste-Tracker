const Joi = require("joi");

const createFoodSchema = Joi.object({
  name: Joi.string().trim().max(120).required(),
  category: Joi.string().trim().max(80).required(),
  quantity: Joi.number().integer().min(1).required(),
  expiryDate: Joi.date().iso().required(),
  notes: Joi.string().trim().allow("").max(500).optional(),
});

const updateFoodSchema = Joi.object({
  name: Joi.string().trim().max(120).optional(),
  category: Joi.string().trim().max(80).optional(),
  quantity: Joi.number().integer().min(1).optional(),
  expiryDate: Joi.date().iso().optional(),
  notes: Joi.string().trim().allow("").max(500).optional(),
}).min(1);

const markStatusSchema = Joi.object({
  status: Joi.string().valid("consumed", "wasted").required(),
});

module.exports = {
  createFoodSchema,
  updateFoodSchema,
  markStatusSchema,
};