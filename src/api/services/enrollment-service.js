const Enrollment = require('../models/enrollment-model');
const Course = require('../models/course-model');
const User = require('../models/user-model');

const enrollStudent = async (studentId, courseId) => {
  try {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return { error: 'Course not found' };

    // Create enrollment
    const enrollment = new Enrollment({ student: studentId, course: courseId });
    await enrollment.save();
    return enrollment;
  } catch (error) {
    if (error.code === 11000) {
      return { error: 'Student already enrolled in this course' };
    }
    console.error('Error enrolling student:', error.message);
    return { error: 'Failed to enroll student' };
  }
};

const getEnrollmentsByCourse = async (courseId) => {
  try {
    return await Enrollment.find({ course: courseId }).populate('student', 'firstName lastName email');
  } catch (error) {
    console.error('Error fetching enrollments:', error.message);
    return { error: 'Failed to fetch enrollments' };
  }
};

module.exports = {
  enrollStudent,
  getEnrollmentsByCourse,
};
