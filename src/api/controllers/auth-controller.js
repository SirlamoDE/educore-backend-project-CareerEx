/**
 * @desc auth-controller.js
 * @description This file contains the controller functions for user authentication.
 * @author meshach
 * @date 2025-15-05
 * @version 1.0.1
 */
const { registerUser, verifyEmail, requestPasswordReset, resetPassword } = require('../services/auth-service');
const asyncHandler = require('express-async-handler');



//Register a user
const register = asyncHandler(async(req,res,next)=>{
    
    try {
        const result = await registerUser(req.body);
        if (result.error) {
        const err = new Error(result.error);
        err.statusCode = result.statusCode || 400;
        return next(err);
        }
        res.status(201).json(result);
    }catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({message: 'Internal server error'});
        
    }
});

//Login a user
const login = async(req,res)=>{
    try{
        const result = await authService.loginUser(req.body);
        if (result.error) {
            return res.status(400).json({message: result.error});
        }
        res.status(200).json(result);
    }catch(error){
        console.error('Error logging in user:', error.message);
        res.status(500).json({message: 'Internal server error'});
    }
}

// Email verification handler
const verifyEmailHandler = async (req, res) => {
    const { token } = req.params;
    const result = await verifyEmail(token);
    if (result.error) {
        return res.status(400).json({ message: result.error });
    }
    res.json({ message: result.message });
};

// Forgot password handler
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    if (result.error) {
        return res.status(400).json({ message: result.error });
    }
    res.json({ message: result.message });
};

// Reset password handler
const resetPasswordHandler = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const result = await resetPassword(token, password);
    if (result.error) {
        return res.status(400).json({ message: result.error });
    }
    res.json({ message: result.message });
};


module.exports = { 
    register,
    login,
    verifyEmailHandler,
    forgotPassword,
    resetPasswordHandler
}