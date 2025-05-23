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
  }
});

// Create the Course model
const Course = mongoose.model('Course', courseSchema);

// Export the Course model
module.exports = Course;