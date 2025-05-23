const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment-controller');
const { isAuthenticated, isInstructor } = require('../middlewares/auth-middleware');

// Student enrolls in course
router.post('/enroll', isAuthenticated, enrollmentController.enrollInCourse);

// Instructor views enrolled students for a course
router.get('/course/:courseId/students', isAuthenticated, isInstructor, enrollmentController.getCourseEnrollments);

module.exports = router;
