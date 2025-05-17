
/**
 * @desc auth-controller.js
 * @description This file contains the controller functions for user authentication.
 * @author meshach
 * @date 2025-15-05
 * @version 1.0.1
 */
const authService = require('../services/auth-service');



//Register a user
const register =async(req,res)=>{
    
    try {
        const result = await authService.registerUser(req.body);
        if (result.error) {
            return res.status(400).json({message: result.error});
        }
        res.status(201).json(result);
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({message: 'Internal server error'});
        
    }
}



module.exports = { 
    register
}