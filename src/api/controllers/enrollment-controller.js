const enrollmentService = require('../services/enrollment-service');

const enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.body;
    const result = await enrollmentService.enrollStudent(studentId, courseId);

    if (result.error) return res.status(400).json({ error: result.error });

    return res.status(201).json({ message: 'Enrolled successfully', data: result });
  } catch (error) {
    console.error('Enrollment error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await enrollmentService.getEnrollmentsByCourse(courseId);

    if (result.error) return res.status(400).json({ error: result.error });

    return res.status(200).json({ data: result });
  } catch (error) {
    console.error('Get enrollments error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  enrollInCourse,
  getCourseEnrollments,
};
