const express = require('express');
const router = express.Router()
const { createCourses, getByInstructorNameController, getAllCoursesController, updateCourse, deleteCourse} = require('../controllers/course-controller');
const { isAuthenticated, isInstructor, isAdmin } = require('../middlewares/auth-middleware');


// Create a course route
router.post('/', isAuthenticated,isInstructor, createCourses);




router.get('/', getAllCoursesController);
router.get('/instructor/:name', getByInstructorNameController );

//export the route
module.exports = router;