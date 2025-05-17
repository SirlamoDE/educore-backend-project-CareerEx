const router = require('express').Router();
const { register } = require('../controllers/auth-controller');

// Register route
router.post('/register', register);

module.exports = router;