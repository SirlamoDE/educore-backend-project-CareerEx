//course-model
const mongoose = require('mongoose');

// Define the Course schema
const courseSchema = new mongoose.Schema({
  title: {type:String, required: true},
  slug: {type:String, required: true, unique: true},
  description: {type:String, required: true},
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublished: { // <<< ADD THIS
        type: Boolean,
        default: false // Default to unpublished when a new course is created
    },
    publishedAt: { // <<< ADD THIS
        type: Date,
        default: null // Or don't set a default if you only set it upon publishing
    }
});

// Create the Course model
const Course = mongoose.model('Course', courseSchema);

// Export the Course model
module.exports = Course;