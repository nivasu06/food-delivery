// Load environment variables from a .env file
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// Retrieve the MongoDB connection URL from environment variables
const url = process.env.DB_URL;

// Function to connect to MongoDB using Mongoose
export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB connected using Mongoose");
    } catch (err) {
        console.error("Error while connecting to DB:");
        console.error(`Message: ${err.message}`);
        console.error(`Stack Trace: ${err.stack}`);
    }
};

