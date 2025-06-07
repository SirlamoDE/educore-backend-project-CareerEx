const router = require('express').Router();
const { register, verifyEmailHandler,loginHandler, forgotPassword, resetPasswordHandler } = require('../controllers/auth-controller');
const { resetPasswordSchema, validateResetPassword } = require('../../validators/reset-validator');

// Register route
router.post('/register', register);
// Email verification route
router.get('/verify-email/:token', verifyEmailHandler);

// Login route
router.post('/login', loginHandler);
// Forgot password route
router.post('/forgot-password', forgotPassword);
// Reset password route
router.post(
  '/reset-password/:token',
  resetPasswordSchema,         // validation rules
  validateResetPassword,       // validation result handler
  resetPasswordHandler         // the reset controller
);

module.exports = router;