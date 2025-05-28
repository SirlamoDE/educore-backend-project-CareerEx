
// Import the courseService from the service layer
const courseService = require('../services/course-service');
const asyncHandler = require('express-async-handler');

// Controller to handle course creation
const createCourses = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const course = await courseService.createCourse(req.body, instructorId);

    if (course?.error) {
      return res.status(400).json({ error: course.error });
    }

    return res.status(201).json({ message: 'Course created successfully', data: course });
  } catch (error) {
    console.error('Controller error:', error.message);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// Get all courses with instructor names populated
const getAllCoursesController = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    return res.status(200).json({ data: courses });
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get courses by instructor name
const getByInstructorNameController = async (req, res) => {
  try {
    const [firstName, lastName] = req.params.name.split('-');
    const courses = await courseService.getCoursesByInstructorName(firstName, lastName);
    return res.status(200).json({ data: courses });
  } catch (error) {
    console.error('Error getting instructor courses:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


//geting course details controller
const getCourseDetailsHandler = asyncHandler(async (req, res, next) => {
    const identifier = req.params.identifier; // the identifier can be course ID or slug

    // The controller simply passes the identifier to the service.
    // The service handles finding the course.
    const courseDetails = await courseService.getCourseDetails(identifier);

   
    res.status(200).json({
        success: true,
        message: 'Course details retrieved successfully.',
        data: courseDetails, // This will include the enrolledStudentCount
    });
});


module.exports = {
  createCourses,
  getAllCoursesController,
  getByInstructorNameController,
  getCourseDetailsHandler
};


