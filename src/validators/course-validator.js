const Joi = require('joi');

const courseSchemaValidator = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().required(),
  slug: Joi.string().optional()
});


module.exports = {
    courseSchemaValidator
}