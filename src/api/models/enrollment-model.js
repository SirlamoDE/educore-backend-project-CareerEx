const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: { // Your field name for the user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: {         
    type: Number,
    default: 0,
    min: 0,
    max: 100, //using percentage
  },
  isCompleted: {     
    type: Boolean,
    default: false,
  },
  completedAt: { 
    type: Date,
    default: null,
  },
}, {
  timestamps: true,  // ( createdAt, updatedAt)
  
});

// Ensure a student can only enroll in a course once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
