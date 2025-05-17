
const connectDB = require('./config/mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');


const  PORT = process.env.PORT || 3400;

const startServer = async() =>{
    try {
        await connectDB();
        app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`);
        console.log(`click here to view the app: http://localhost:${PORT}`);
        })
    } catch (error) {
        console.error('Error starting the server:', error.message);
        process.exit(1);
    }
}  

startServer();
