const Joi = require('joi');

// Registration validation schema
const registerSchema = Joi.object({
  // username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().allow('').optional(),
  lastName: Joi.string().allow('').optional(),
  state: Joi.string().allow('').optional()
});

//login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});



// Change-password validation schema
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(8).required()
        .pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]).{8,}$/)
        .messages({
            'string.min': 'New password should have a minimum length of {#limit}',
            'any.required': 'New password is required',
            'string.pattern.base': 'New password must be at least 8 characters long and contain at least one letter, one number, and one special character.'
        }),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).messages({
        'any.only': 'New passwords do not match',
        'any.required': 'Confirm new password is required'
    })
});


module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema

};
