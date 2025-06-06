//authorization middleware
const jwt = require('jsonwebtoken')  ;
const User = require( '../models/user-model.js');



const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers['authorization']; // More robust check
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ message: 'Authentication failed: Please,you need to Login' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const userIdFromToken = decoded.id || decoded.userId; // Adjust based on your token payload
        if (!userIdFromToken) {
            return res.status(401).json({ message: 'Authentication failed: Token is invalid or malformed (missing user identifier)' });
        }

        const user = await User.findById(userIdFromToken).select('-password'); // Fetch user, exclude password

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed: User not found' });
        }

        req.user = user; // Attach the full (but sanitized) user object to req
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: `Authentication failed: ${error.message}` });
        }
        return res.status(500).json({ message: 'Internal server error during authentication' });
    }
};


const isAdmin = async (req, res, next) => {
    // req.user is now the full user object from the DB, set by isAuthenticated
    if ( req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
};
// req.user is now the full user object from the DB, no need for optional chaining
const isInstructor = async (req, res, next) => {
    if (req.user.role === 'instructor') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: Instructor privileges required' });
    }
};

module.exports = {
    isAuthenticated,
    isAdmin,
    isInstructor
};