const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: '',
        trim: true
    },
    lastName: {
        type: String,
        default:'',
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true  
    },
    state:{
        type:String,
        default:""
    },
    verified:{
        type:Boolean,
        default:false
    },
    emailToken:{
        type:String,
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student',
        required: true
    },
    resetPasswordToken: {
        type:String,
        select:false
    },
    resetPasswordExpires:{
        type: Date,
        select: false

    }
}, { timestamps: true });

//

userSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    // Storing a hash is more secure. The user gets the plain token.
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expiry time (10minutes)
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 15 minutes

    return resetToken; // Return the unhashed token to be sent via email
};

const User =  mongoose.model('User', userSchema);
module.exports = User;
