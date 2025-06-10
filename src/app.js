const express = require('express');

const securityMiddleware = require('./api/middlewares/security');

const authRoutes = require('./api/routes/auth-routes');
const userRoutes = require('./api/routes/user-routes');
const courseRoutes = require('./api/routes/course-routes')
const enrollmentRoutes = require('./api/routes/enrollment-routes');
const { isAuthenticated } = require('./api/middlewares/auth-middleware');


// Create an Express application
const app = express();



// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply security middlewares
securityMiddleware(app);



app.get('/', (req,res)=>{
    console.log(`The request url is: ${req.url}`);//added to monitor the url of the request source 
    res.send(`Welcome to the root route of the app. Building secure and roburst backend app is our primary goal`);

})

// authentication routes
app.use('/api/auth', authRoutes);

//user routes
app.use('/api/users', userRoutes);

//course route
app.use('/api/courses', courseRoutes)

// enrollment route
app.use('/api/enrollments',isAuthenticated, enrollmentRoutes);

//milestone 3 begins here

// student sees courses they are enrolled in
app.use('/api/enrollments/by-student',isAuthenticated, enrollmentRoutes);

//course details route
app.use('/api/courses/:identifier', courseRoutes);


//course completion 
app.use('/api/course/enrollments', enrollmentRoutes)

//add 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: 'Resource not found',
    });
    next();
});

//Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
    
});



module.exports = app;