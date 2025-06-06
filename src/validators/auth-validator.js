const Joi = require('joi');

// Registration validation schema
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().allow('').optional(),
  lastName: Joi.string().allow('').optional(),
  state: Joi.string().allow('').optional()
});

module.exports = {
  registerSchema
};
