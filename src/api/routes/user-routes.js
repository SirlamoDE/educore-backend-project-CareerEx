const express = require('express');
const userController = require('../controllers/user-controller');
const { isAuthenticated,isAdmin } = require('../middlewares/auth-middleware')
const router = express.Router();


// Get all users
router.get('/', isAuthenticated,isAdmin,userController.getAllUsers);


module.exports = router;