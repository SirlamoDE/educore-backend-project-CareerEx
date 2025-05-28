
const Enrollment = require('../models/enrollment-model');// importing required enrollment model
const Course = require('../models/course-model'); // Course model
// const User = require('../models/user-model');

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


//milestone 3: get courses a student is enrolled in
const getCoursesEnrolledByStudent = async (studentId) => {
  try {
    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'firstName lastName' },
      });
    
    return enrollments;
  } catch (error) {
    console.error('Error fetching student enrollments:', error.message);
    return { error: 'Failed to fetch enrollments' };
  }
};


// Milestone 3 Sub-3: Course completion status
const updateEnrollmentCompletionStatus = async (enrollmentId, requestingStudentId, isCompleted) => {
    console.log(`[ENROLLMENT_SERVICE] updateEnrollmentCompletionStatus called for enrollment: ${enrollmentId}, by student: ${requestingStudentId}, set isCompleted to: ${isCompleted}`);

    if (typeof isCompleted !== 'boolean') {
        console.warn('[ENROLLMENT_SERVICE] Invalid isCompleted value provided.');
        const error = new Error('Invalid value for completion status. Must be true or false.');
        error.statusCode = 400;
        throw error;
    }

    try {
        const enrollment = await Enrollment.findById(enrollmentId);

        if (!enrollment) {
            console.warn('[ENROLLMENT_SERVICE] Enrollment not found with ID:', enrollmentId);
            const error = new Error('Enrollment not found.');
            error.statusCode = 404;
            throw error;
        }
        
        //suggest the comment for the code below
        if (enrollment.student.toString() !== requestingStudentId.toString()) {
            console.warn(`[ENROLLMENT_SERVICE] Student ${requestingStudentId} attempted to update enrollment ${enrollmentId} not owned by them.`);
            const error = new Error('Forbidden: You are not authorized to update this enrollment.');
            error.statusCode = 403;
            throw error;
        }

        
        enrollment.isCompleted = isCompleted;
        if (isCompleted && !enrollment.completedAt) {
            enrollment.completedAt = new Date();
        } else if (!isCompleted) {
            enrollment.completedAt = null;
        }

        const updatedEnrollment = await enrollment.save();
        console.log(`[ENROLLMENT_SERVICE] Enrollment ${enrollmentId} completion status updated.`);

        return updatedEnrollment;

    } catch (error) {
        console.error('[ENROLLMENT_SERVICE] Error in updateEnrollmentCompletionStatus:', error);
        if (!error.statusCode) { // If it's not an error we've already assigned a statusCode to
            error.message = 'Could not update enrollment completion status due to a server error.';
        }
        throw error;
    }
};


 



module.exports = {
  enrollStudent,
  getEnrollmentsByCourse,
  getCoursesEnrolledByStudent,
  updateEnrollmentCompletionStatus
};
