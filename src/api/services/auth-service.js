/**
 * @desc auth-service.js
 * @description this file contains the service functions for user authentication.
 * @author Meshach
 * @date 2025-15-05
 * @version 1.0.1
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user-model');
const sendMail = require('../../utils/mailer');
const { registerSchema } = require('../../validators/auth-validator');
const asyncHandler = require('express-async-handler');

// Register a new user
const registerUser = async(userData)=>{
    // Validate user data
    const { error } = registerSchema.validate(userData);
    if (error) {
        return { error: error.details[0].message };
    }
    try{
        const { email, password, firstName, lastName, state } = userData;
        // Check if user already exists (by email or username)
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return {error: 'User with this email already exists'};
        }

        // Always assign 'student' role at registration
        const userRole = 'student';
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate email verification token
        const emailToken = crypto.randomBytes(32).toString('hex');
        console.log('Generated email verification token:', emailToken);
        // Create a new user (not verified yet)
        const newUser = new User({
            email,
            password: hashedPassword,
            role: userRole,
            emailToken,
            verified: false,
            firstName: firstName || '',
            lastName: lastName || '',
            state: state || ''
        });
        // Save the user to the database
        const savedUser = await newUser.save();
        console.log('Saved user for verification:', savedUser);

        // Send verification email
        const verifyUrl = `https://educore-backend-project-careerex-production.up.railway.app/api/auth/verify-email/${emailToken}`;
        console.log('Verification URL sent to user:', verifyUrl);
        await sendMail({
            to: savedUser.email,
            subject: 'Verify your EduCore account',
            html: `<p>Hello,</p><p>Thank you for registering. Please verify your email by clicking the link below:</p><a href="${verifyUrl}">${verifyUrl}</a><p>If you did not register, please ignore this email.</p>`
        });

        // Return a message to the client
        return {
            message: 'Registration successful! Please check your email to verify your account.'
        };
    }catch(error){
        console.error('Error registering user:', error.message);
        return {error: 'Internal server error'};
    }
}

// Verify email token
const verifyEmail = async (token) => {
    const user = await User.findOne({ emailToken: token });
    if (!user) {
        return { error: 'Invalid or expired verification token.' };
    }
    user.verified = true;
    user.emailToken = undefined;
    await user.save();
    return { message: 'Email verified successfully. You can now log in.' };
};

//after user is verified, they can log in
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { error: 'Invalid email or password.' };
    }
    if (!user.verified) {
        return { error: 'Please verify your email before logging in.' };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { error: 'Invalid email or password.' };
    }
    //since email and password matches database records
    // Generate JWT token
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token expires in 1 day
    );
    // Return user data and token
    return {
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            state: user.state,
            role: user.role
        },
        token
    };
};

//user can request to change their password

/**
 * @desc Request password reset
 * @param {string} email - User's email address
 * @return {Promise<Object>} - Result object containing success message or error
 * @description This function allows a user to request a password reset by providing their email address.
 * It generates a reset token, saves it to the user's record, and sends an email with the reset link.
 */


const changePassword = async (userId, currentPassword, newPassword) => { // Removed asyncHandler from here, controller handles it
    console.log(`[AUTH_SERVICE] changePassword attempt for user: ${userId}`);

    try {
        // 1. Fetch user WITH their current password hash
        const user = await User.findById(userId).select('+password');

        if (!user) {
            const err = new Error('User not found.');
            err.statusCode = 404;
            throw err;
        }

        // 2. Verify current password
        // bcrypt.compare returns a Promise, so you MUST await it.
        const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordMatch) {
            const err = new Error('Incorrect current password.');
            err.statusCode = 401; // Or 400
            throw err;
        }

        // 3. CORRECTED: Check if new plain text password is the same as the current plain text password
        //    Since isCurrentPasswordMatch is true, 'currentPassword' IS the user's old password.
        if (currentPassword === newPassword) {
            const err = new Error('New password cannot be the same as the current password.');
            err.statusCode = 400;
            throw err;
        }

        // 4. Hash the new password
        // bcrypt.hash also returns a Promise, so you MUST await it.
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save(); // Saves the user document with the new password

        console.log(`[AUTH_SERVICE] Password changed successfully for user: ${user.email}`);

        // 5. Send Password Change Notification Email
        try {
            const textMessage = `Hello ${user.firstName || user.username || 'User'},\n\nThis is a confirmation that the password for your EduCore account associated with the email ${user.email} was recently changed.\n\nIf you did not make this change, please contact our support team immediately.\n\nThanks,\nThe EduCore Team`;
            const htmlMessage = `
                <p>Hello ${user.firstName || user.username || 'User'},</p>
                <p>This is a confirmation that the password for your EduCore account associated with the email <strong>${user.email}</strong> was recently changed.</p>
                <p><strong>If you did not make this change, please contact our support team immediately.</strong></p>
                <p>Thanks,<br>The EduCore Team</p>
            `;
            await sendMail({
                to: user.email,
                subject: 'EduCore - Your Password Has Been Changed',
                text: textMessage,
                html: htmlMessage
            });
            console.log(`[AUTH_SERVICE] Password change confirmation email sent to ${user.email}`);
        } catch (emailError) {
            console.error(`[AUTH_SERVICE] CRITICAL: Failed to send password change confirmation email to ${user.email} after password was changed:`, emailError.message);
        }

        return { message: 'Password changed successfully.' };

    } catch (error) {
        console.error(`[AUTH_SERVICE] Error in changePassword for user ${userId}:`, error.message);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
};



// Request password reset
const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });
    if (!user) return { error: 'No account with that email exists.' };
    if (!user.verified) {
        return { error: 'Please verify your email before requesting a password reset.' };
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `https://educore-backend-project-careerex-production.up.railway.app/api/auth/reset-password/${resetToken}`;

    await sendMail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `<p>Hello,${user.firstName}</p>
               <p>You requested to reset your password. Click the link below to proceed:</p>
               <a href="${resetUrl}">${resetUrl}</a>
               <p>This link will expire in 1 hour.</p>`
    });

    return { message: 'Password reset link sent to your email.' };
};

// Reset password
const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return { error: 'Invalid or expired password reset token.' };

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password has been reset successfully.' };
};

// export the registerUser function
module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    changePassword,
    requestPasswordReset,
    resetPassword
}