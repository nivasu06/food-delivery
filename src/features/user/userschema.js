import mongoose from "mongoose";

// Password should be validated before hashing
export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: [25, "Name can't be greater than 25 characters"]
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+\@.+\../, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Customer', 'Seller']
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});
