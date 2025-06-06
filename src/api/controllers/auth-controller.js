/**
 * @desc auth-controller.js
 * @description This file contains the controller functions for user authentication.
 * @author meshach
 * @date 2025-15-05
 * @version 1.0.1
 */
const { registerUser, verifyEmail,loginUser, requestPasswordReset, resetPassword } = require('../services/auth-service');
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
    const { password } = req.body;
    const result = await resetPassword(token, password);
    if (result.error) {
        return res.status(400).json({ message: result.error });
    }
    res.json({ message: result.message });
});


module.exports = { 
    register,
    loginHandler,
    verifyEmailHandler,
    forgotPassword,
    resetPasswordHandler
}