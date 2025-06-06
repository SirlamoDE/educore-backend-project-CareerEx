const express = require('express');
const authRoutes = require('./api/routes/auth-routes');
const userRoutes = require('./api/routes/user-routes');
const courseRoutes = require('./api/routes/course-routes')
const enrollmentRoutes = require('./api/routes/enrollment-routes')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
    console.log(`The request url is: ${req.url}`);//added to monitor the url of the request source 
    console.log(`The request headers are: ${JSON.stringify(req.headers)}`);
    res.send(`Welcome to the root route of the app. Building secure and roburst backend app is our primary goal`);

})

app.use('/api/auth', authRoutes);

//user routes
app.use('/api/users', userRoutes);

//course route
app.use('/api/courses', courseRoutes)

// enrollment route
app.use('/api/enrollments', enrollmentRoutes);

//milestone 3 begins here

// student sees courses they are enrolled in
app.use('/api/enrollments/by-student', enrollmentRoutes);

//course details route
app.use('/api/courses/:identifier', courseRoutes);


//course completion 
app.use('/api/course/enrollments', enrollmentRoutes)

module.exports = app;