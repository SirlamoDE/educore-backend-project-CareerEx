const express = require('express');
const router = express.Router()

const { createCourses, getByInstructorNameController, getAllCoursesController, getCourseDetailsHandler,} = require('../controllers/course-controller');
const { isAuthenticated, isInstructor, isAdmin } = require('../middlewares/auth-middleware');



// Create a course route
router.post('/', isAuthenticated,isInstructor, createCourses);




router.get('/', getAllCoursesController);
router.get('/instructor/:name', getByInstructorNameController );

//course details route
// router.get('/:courseId', getCourseDetailsController);

router.get('/:identifier', getCourseDetailsHandler);





//export the route
module.exports = router;