const express = require('express');
const userController = require('../controllers/user-controller');
const { isAuthenticated,isAdmin } = require('../middlewares/auth-middleware')
const router = express.Router();


// Get all users
router.get('/', isAuthenticated,isAdmin,userController.getAllUsers);


// Route only accessible to authenticated instructors
// router.post('/my-course-stuff', isAuthenticated, isInstructor, someController.handleCourseStuff);


// router.get('/profile', isAuthenticated, userController.getMyProfile);


module.exports = router;