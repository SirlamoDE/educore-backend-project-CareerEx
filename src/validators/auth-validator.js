const Joi = require('joi');

// Registration validation schema
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required()
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required()
});


module.exports = {
  registerSchema,
  loginSchema
};
