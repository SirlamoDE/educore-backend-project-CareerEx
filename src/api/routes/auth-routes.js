const router = require('express').Router();
const { register, verifyEmailHandler, forgotPassword, resetPasswordHandler } = require('../controllers/auth-controller');

// Register route
router.post('/register', register);
// Email verification route
router.get('/verify-email/:token', verifyEmailHandler);
// Forgot password route
router.post('/forgot-password', forgotPassword);
// Reset password route
router.post('/reset-password/:token', resetPasswordHandler);

module.exports = router;