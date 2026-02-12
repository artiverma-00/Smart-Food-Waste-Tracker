const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(64).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
}).min(1);

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};