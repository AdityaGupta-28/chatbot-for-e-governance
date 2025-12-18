
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }
        const conn = await mongoose.connect(process.env.MONGO_URI.replace('localhost', '127.0.0.1'));
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('CRITICAL: MongoDB Connection Failed');
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;
