// services/course.service.js
const { courseSchemaValidator } = require('../../validators/course-validator');
const Course = require('../models/course-model');
const User = require('../models/user-model');
const slugify = require('slugify');
const Enrollment = require('../models/enrollment-model');
const mongoose = require('mongoose');


// Helper to generate a unique slug using instructor's first name
const generateUniqueSlug = async (title, instructorId) => {
  const baseSlug = slugify(title, { lower: true, strict: true });

  const instructor = await User.findById(instructorId);
  const firstName = instructor?.firstName || 'instructor';
  const namePart = slugify(firstName, { lower: true, strict: true });

  let slug = `${baseSlug}-by-${namePart}`;
  let counter = 1;

  while (await Course.findOne({ slug })) {
    slug = `${baseSlug}-by-${namePart}-${counter}`;
    counter++;
  }

  return slug;
};

// Create a new course
const createCourse = async (courseData, instructorId) => {
  try {
    // Validate course data
    const { error, value } = courseSchemaValidator.validate(courseData);
    if (error) return { error: error.details[0].message };

    const { title, slug: customSlug, description } = value;

    // Use custom slug or generate one with instructor name suffix
    const slug = customSlug || await generateUniqueSlug(title, instructorId);

    // Create the course
    const course = new Course({ title, slug, description, instructor: instructorId });
    await course.save();
    return course;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.slug) {
      return { error: 'Slug must be unique. Try a different one.' };
    }
    console.error('Error creating course:', error.message);
    throw new Error('Internal server error');
  }
};


// Get all courses with populated instructor names
const getAllCourses = async () => {
  try {
    return await Course.find().populate('instructor', 'firstName lastName');
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    return { error: 'Failed to fetch courses' };
  }
};

// Get courses by instructor name
const getCoursesByInstructorName = async (firstName, lastName) => {
  try {
    const instructor = await User.findOne({
        firstName: new RegExp(`^${firstName}$`, 'i'),
        lastName: new RegExp(`^${lastName}$`, 'i')
    });
    
    if (!instructor) return { error: 'Instructor not found' };

    const courses = await Course.find({ instructor: instructor._id }).populate('instructor', 'firstName lastName');
    return courses;
  } catch (error) {
    console.error('Error fetching instructor courses:', error.message);
    return { error: 'Failed to fetch instructor courses' };
  }
};




//course details
//Milestone 3 sub_task 3: Implement the getCourseDetails function to fetch course details along with the number of enrolled students

const getCourseDetails = async (identifier) => {
    console.log(`[COURSE_SERVICE] getCourseDetails (public) called for identifier: "${identifier}"`);

    let courseQuery;
    // Determine if the identifier is likely an ObjectId or a slug
    if (mongoose.Types.ObjectId.isValid(identifier)) {
        courseQuery = Course.findById(identifier);
    } else {
        courseQuery = Course.findOne({ slug: identifier });
    }

    // Fetch the course and populate instructor details
    const course = await courseQuery
        .populate({
            path: 'instructor', // Field name in Course schema that refs User
            select: 'firstName lastName email' // Select fields you want to show for the instructor
        });
        

    if (!course) {
        console.warn('[COURSE_SERVICE] Course not found with identifier:', identifier);
        const error = new Error('Course not found.');
        error.statusCode = 404;
        throw error;
    }

    // For this public route, only show published courses
    if (!course.isPublished) {
        console.warn(`[COURSE_SERVICE] Attempted to access unpublished course publicly: ${course.slug} (ID: ${course._id})`);
        const error = new Error('Course not found.'); // From a public perspective, an unpublished course is "not found"
        error.statusCode = 404;
        throw error;
    }

    // Count the number of students enrolled in this course
    // We only need the count, not the full enrollment documents
    const enrolledStudentCount = await Enrollment.countDocuments({ course: course._id });
    console.log(`[COURSE_SERVICE] Course "${course.title}" has ${enrolledStudentCount} enrolled students.`);


    // If you want to include modules and lessons later, you would populate them here as well,
    // potentially filtering for lessons that are 'isPreviewable' for public view.
    // For now, we'll just return the main course details.

    // Return the course object and add the enrolledStudentCount
    // We use toObject() or toJSON() to be able to add a new property to the Mongoose document
    const courseObject = course.toObject(); // Or course.toJSON();
    courseObject.enrolledStudentCount = enrolledStudentCount;

    // You might want to explicitly remove certain fields from the course object if they shouldn't be public
    // delete courseObject.__v; // Example

    return courseObject;
};





module.exports = {
  createCourse,
  getAllCourses,
  getCoursesByInstructorName,
  getCourseDetails
};
