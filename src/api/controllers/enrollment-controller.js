const enrollmentService = require('../services/enrollment-service');
const asyncHandler = require('express-async-handler')


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



const getStudentEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    const result = await enrollmentService.getCoursesEnrolledByStudent(studentId);
                           
    if (result.error) return res.status(400).json({ error: result.error });

    return res.status(200).json({ data: result });
  } catch (error) {
    console.error('Error in controller:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


//milestone 3 sub-3:Update Course completion status

const courseCompletionStatusHandler = asyncHandler(async(req, res, next)=>{

  const { enrollmentId } = req.params;
  const { isCompleted } = req.body;
  const requestingStudentId = req.user._id; // Or req.user.id, depending on token payload

   //Conduct basic validation
   if (typeof isCompleted !== 'boolean') {
        console.warn('[ENROLLMENT_CONTROLLER] updateEnrollmentStatus: Missing or invalid "isCompleted" in request body.');
        const error = new Error('Request body must include "isCompleted" as a boolean value (true or false).');
        error.statusCode = 400; // Bad Request
        return next(error); // Pass to global error handler
    } 

   

    try {
      //Call the Service Function:
      // Delegate the core logic to the enrollmentService. 
      const updatedEnrollment = await enrollmentService.updateEnrollmentCompletionStatus(
        enrollmentId,
        requestingStudentId,
        isCompleted

      );

  
      if (updatedEnrollment?.errors) {
        return res.status(400).json({ error: updatedEnrollment?.errors });
      }

      //Send HTTP Response:
      //If the service function completes successfully, it returns the updated
      res.status(200).json({
          success: true,
          message: 'Enrollment completion status updated successfully.',
          data: updatedEnrollment
      });

    } catch (error) {
      console.error('Error updating enrollment completion status:', error.message);
      res.status(500).json({ error: 'Failed to update enrollment completion status' });
    }

})

  


module.exports = {
  enrollInCourse,
  getCourseEnrollments,
  getStudentEnrolledCourses,
  courseCompletionStatusHandler,
};
