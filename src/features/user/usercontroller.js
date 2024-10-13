import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserRepository from './userrepo.js';
//import SendmailTransport from 'nodemailer/lib/sendmail-transport/index.js'; // Ensure this is correctly implemented
import sendVerificationEmail from '../../middlewares/nodemailer.js';
const verificationCodes = {};

export default class UserController {
    constructor() {
        this.UserRepository = new UserRepository();
    }

    async signUp(req, res, next) {
        const { name, email, password, type } = req.body;
        try {
            // Hash the user's password
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = { name, email, password: hashedPassword, type, isVerified: false };

            // Attempt to create the user
            await this.UserRepository.signUp(user);

            // Generate a verification code
            const verificationCode = crypto.randomBytes(3).toString('hex'); // 6-digit code
            verificationCodes[email] = verificationCode; // Store code temporarily

            // Send verification email
            sendVerificationEmail(user, verificationCode);

            // Redirect to verification notice
            res.redirect(`/food/users/verify-notice?email=${encodeURIComponent(email)}`);
        } catch (err) {
            console.log(err);
            if (err.message === 'Email already registered') {
                // Render the signup page with a specific error message
                res.render('signup', { errorMessage: 'Email already registered' });
            } else if (err instanceof mongoose.Error.ValidationError) {
                // Render the signup page with validation errors
                res.render('signup', { errorMessage: err.message });
            } else {
                // Pass other errors to the global error handler
                next(err);
            }
        }
    }

    async signIn(req, res, next) {
        const { email, password } = req.body;
        try {
            const user = await this.UserRepository.findByEmail(email);
            if (!user) {
                return res.render('login', { errorMessage: 'Incorrect Credentials' });
            }
            if (!user.isVerified) {
                return res.render('login', { errorMessage: 'Account not verified. Please check your email.' });
            }
    

            const result = await bcrypt.compare(password, user.password);
            if (result) {
                const token = jwt.sign(
                    { userID: user._id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                req.session.user = { id: user._id,name:user.name, email: user.email, type: user.type };
                res.cookie('token', token, { httpOnly: true });
                res.redirect('/');
                // After a successful action or an error
                //  req.flash('alertMessage', 'Login Successful');

            } else {
                res.render('login', { errorMessage: 'Incorrect Credentials' });
            }
        } catch (err) {
            console.log('Error in UserController.signIn:', err);
            res.status(500).send('Something went wrong');
        }
    }

    async logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Could not log out');
            }
            res.clearCookie('token');
            res.redirect('/');
            // alert("LogedOut");
            // req.flash('alertMessage', 'Login Successful');
        });
    }

    async getProfile(req, res, next) {
        try {
            if (!req.session.user || !req.session.user.id) {
                return res.redirect('/food/users/signin');
            }
    
            const user = await this.UserRepository.getUserById(req.session.user.id);
            console.log('User fetched:', user); // Add this line to debug
    
            if (!user) {
                return res.status(404).send('User not found');
            }
    
            res.render('profile', { user });
        } catch (err) {
            console.error('Error fetching user profile:', err);
            next(err);
        }
    }
    

    async verifyEmail(req, res, next) {
        const { email, verificationCode } = req.body;
    
        // Check if the verification code matches
        if (verificationCodes[email] !== verificationCode) {
            return res.render('verify', { email, errorMessage: 'Invalid verification code' });
        }
    
        try {
            // Find the user by email
            const user = await this.UserRepository.findByEmail(email);
            if (!user) {
                return res.render('verify', { email, errorMessage: 'User not found' });
            }
    
            // Update the user to set them as verified
            user.isVerified = true;
            await user.save();
    
            // Remove the verification code from storage
            delete verificationCodes[email];
    
            // Redirect to sign-in page after successful verification
            res.redirect('/food/users/signin');
            // alert("Email Verified");
        } catch (error) {
            console.error('Error verifying email:', error);
            res.status(500).send('Server error');
        }
    }
    
    

    async changePassword(req, res, next) {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        try {
            const user = await this.UserRepository.getUserById(req.session.user.id);

            if (!user) {
                return res.render('changepassword', { errorMessage: 'User not found.' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.render('changepassword', { errorMessage: 'Current password is incorrect.' });
            }

            if (newPassword !== confirmNewPassword) {
                return res.render('changepassword', { errorMessage: 'New passwords do not match.' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 12);
            await this.UserRepository.updatePassword(user._id, hashedNewPassword);

            res.redirect('/food/users/profile');
            // alert("Password Changed");
        } catch (err) {
            console.error('Error changing password:', err);
            next(err);
        }
    }
}
