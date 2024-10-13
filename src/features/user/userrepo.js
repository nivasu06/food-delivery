import mongoose from "mongoose";
import { userSchema } from "./userschema.js";
import { ApplicationError } from "../../errorhandler/applicationerror.js";

export const UserModel = mongoose.model('User', userSchema);

export default class UserRepository {
    async signUp(user) {
        try {
            // Check if user with the same email already exists
            const existingUser = await UserModel.findOne({ email: user.email });
            if (existingUser) {
                throw new Error('Email already registered');
            }
    
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser;
        } catch (err) {
            console.log(err);
            if (err.message === 'Email already registered') {
                throw new ApplicationError('Email already registered', 400); // Custom error message and status code
            } else if (err instanceof mongoose.Error.ValidationError) {
                throw err;
            } else {
                throw new ApplicationError('Something went wrong with database', 500);
            }
        }
    }
    

    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (err) {
            console.log('Error in UserRepository.findByEmail:', err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async updatePassword(userId, newPassword) {
        return await UserModel.findByIdAndUpdate(userId, { password: newPassword });
    }
    // Route to render the change password page
    
    async getUserById(userId) {
        try {
            console.log('Fetching user with ID:', userId);
            // Use Mongoose's findById method
            const user = await UserModel.findById(userId);
            console.log('User fetched:', user);
            return user;
        } catch (err) {
            console.error('Error fetching user data:', err);
            throw new Error('Error fetching user data: ' + err.message);
        }
    }
    

}
