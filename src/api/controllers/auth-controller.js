/**
 * @desc auth-controller.js
 * @description This file contains the controller functions for user authentication.
 * @author meshach
 * @date 2025-15-05
 * @version 1.0.1
 */
const { changePasswordSchema } = require('../../validators/auth-validator');
const { registerUser, verifyEmail,loginUser, requestPasswordReset, resetPassword, changePassword, } = require('../services/auth-service');
const asyncHandler = require('express-async-handler');


//Register a user
const register = asyncHandler(async(req,res,next)=>{
    const result = await registerUser(req.body);
    if (result.error) {
        const err = new Error(result.error);
        err.statusCode = result.statusCode || 400;
        return next(err);
    }
    res.status(201).json(result);
});


// Email verification handler
const verifyEmailHandler = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const result = await verifyEmail(token);
    if (result.error) {
        return res.status(400).json({ message: result.error });
    }
    res.json({ message: result.message });
});

// once a user email verification is successful, they can login
const loginHandler = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    if (result.error) {
        const err = new Error(result.error);
        err.statusCode = result.statusCode || 400;
        return next(err);
    }
    res.json(result);
});

// Change password controller
const changePasswordHandler = asyncHandler(async (req, res, next) => {
    // 1. Validate the entire request body against the Joi schema
    const { error, value: validatedData } = changePasswordSchema.validate(req.body, {
        abortEarly: false, // Show all validation errors
        // stripUnknown: true // Optionally remove fields not in schema from validatedData
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join('. ');
        const validationError = new Error(`Validation failed: ${errorMessages}`);
        validationError.statusCode = 400; // Bad Request
        return next(validationError); // Pass to global error handler
    }

    // 2. Ensure user is authenticated (already handled by isAuthenticated middleware which sets req.user)
    //    The check `if (!req.user?._id)` you had is a good safeguard, but if isAuthenticated
    //    is correctly implemented, req.user should always be present here.
    //    If req.user or req.user._id is missing, isAuthenticated should have already responded.

    const userId = req.user._id; // Get ID from the authenticated user session

    // 3. Call the service function with validated data
    const result = await changePassword(
        userId,
        validatedData.currentPassword,
        validatedData.newPassword
    );

    // 4. Send success response
    //    The service now either returns a success object or throws an error (caught by asyncHandler)
    res.status(200).json({
        success: true,
        message: result.message // "Password changed successfully."
    });
});

// Forgot password handler
const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    if (result.error) {
        return res.status(400).json({ message: result.error });
    }
    res.json({ message: result.message });
});

// Reset password handler
const resetPasswordHandler = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body; // confirmPassword is only for validation
    const result = await resetPassword(token, password);
    if (result.error) {
        return res.status(400).json({ message: result.error });
    }
    res.json({ message: result.message });
});


module.exports = { 
    register,
    loginHandler,
    changePasswordHandler,
    verifyEmailHandler,
    forgotPassword,
    resetPasswordHandler
}