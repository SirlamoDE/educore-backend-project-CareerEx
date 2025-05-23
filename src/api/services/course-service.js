// services/course.service.js
const { courseSchemaValidator } = require('../../validators/course-validator');
const Course = require('../models/course-model');
const User = require('../models/user-model');
const slugify = require('slugify');



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


module.exports = {
  createCourse,
  getAllCourses,
  getCoursesByInstructorName
};
