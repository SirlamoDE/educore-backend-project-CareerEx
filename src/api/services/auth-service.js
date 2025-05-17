/**
 * @desc auth-service.js
 * @description this file contains the service functions for user authentication.
 * @author Meshach
 * @date 2025-15-05
 * @version 1.0.1
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user-model');
const { registerSchema, loginSchema } = require('../../validators/auth-validator');

// Register a new user
const registerUser = async(userData)=>{
    // Validate user data
    const { error } = registerSchema.validate(userData);
    if (error) {
        return { error: error.details[0].message };
    }
    try{
        const { username, email, password } = userData;
        // Check if user already exists (by email or username)
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return {error: 'User with this email already exists'};
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return {error: 'Username already taken'};
        }
        // Always assign 'student' role at registration
        const userRole = 'student';
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: userRole
        });
        // Save the user to the database
        const savedUser = await newUser.save();
        // Generate a JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION || '1h'
        });
        // Return the user data and token
        return {
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            },
            token
        };
    }catch(error){
        console.error('Error registering user:', error.message);
        return {error: 'Internal server error'};
    }
}


// Login a user
const loginUser = async(userData)=>{
    // Validate user data
    const { error } = loginSchema.validate(userData);
    if (error) {
        
        return { error: error.details[0].message };
    }
    
    try{
        // Destructure user data to get email and password
        const { email, password } = userData;
        // Find the user by email
        const user = await User.findOne({email});
        if (!user) {
            return {error: 'Invalid email or password'};
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {error: 'Invalid email or password'};
        }
        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION || '1h'
        });
        // Return the user data and token
        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        };
    }
    catch(error){
        console.error('Error logging in user:', error.message);
        return {error: 'Internal server error'};
    }

}

// export the registerUser function
module.exports = {
    registerUser,
    loginUser
}