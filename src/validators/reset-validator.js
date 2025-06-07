//reset validator
const { body, validationResult } = require('express-validator');
const isValidPassword = (password) => {
  // Check if password is at least 8 characters long and contains at least one letter,one number and a special character
  if (!password || typeof password !== 'string') {
    return false;
  }
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
};

// Password reset validation schema
const resetPasswordSchema = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .custom((value) => {
      if (!isValidPassword(value)) {
        throw new Error('Password must be at least 8 characters long and contain at least one letter and one number');
      }
      return true;
    }),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

const validateResetPassword = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  resetPasswordSchema,
  validateResetPassword
};

