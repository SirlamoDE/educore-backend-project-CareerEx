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
        required: true,
        unique:true
    },
    state:{
        type:String,
        default:""
    },
    verified:{
        type:Boolean,
        default:false
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student',
        required: true
    },
    resetPasswordToken: {
        type:String
    },
    resetPasswordExpires:{
        type: Date
    }
}, { timestamps: true });

const User =  mongoose.model('User', userSchema);
module.exports = User;
