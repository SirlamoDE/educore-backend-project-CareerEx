const express = require('express');
const authRoutes = require('./api/routes/auth-routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
    console.log(`The request method is: ${req.method}`);
    console.log(`The request url is: ${req.url}`);
    console.log(`The request headers are: ${JSON.stringify(req.headers)}`);
    res.send(`Welcome to the root route of the app`);

})

app.use('/api/auth', authRoutes);





module.exports = app;