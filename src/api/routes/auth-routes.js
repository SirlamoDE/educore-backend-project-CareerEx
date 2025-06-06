const router = require('express').Router();
const { register, verifyEmailHandler,loginHandler, forgotPassword, resetPasswordHandler } = require('../controllers/auth-controller');

// Register route
router.post('/register', register);
// Email verification route
router.get('/verify-email/:token', verifyEmailHandler);

// Login route
router.post('/login', loginHandler);
// Forgot password route
router.post('/forgot-password', forgotPassword);
// Reset password route
router.post('/reset-password/:token', resetPasswordHandler);

module.exports = router;