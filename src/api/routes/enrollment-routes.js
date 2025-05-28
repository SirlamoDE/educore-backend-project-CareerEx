const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment-controller');
const { isAuthenticated, isInstructor } = require('../middlewares/auth-middleware');

// Student enrolls in course
router.post('/enroll', isAuthenticated, enrollmentController.enrollInCourse);


// Instructor views enrolled students for a course
router.get('/course/:courseId/students', isAuthenticated, isInstructor, enrollmentController.getCourseEnrollments);

// Student views courses they are enrolled in
router.get('/my-courses', isAuthenticated, enrollmentController.getStudentEnrolledCourses);

//completion status route
router.patch('/:enrollmentId/status',isAuthenticated, enrollmentController.courseCompletionStatusHandler)


module.exports = router;
