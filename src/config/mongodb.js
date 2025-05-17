const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
        console.log('MongoDB URI:', process.env.MONGO_URI);
        console.log('MongoDB Connection String:', mongoose.connection.client.s.url);

    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
// Compare this snippet from src/app.js:
// const express = require('express');
