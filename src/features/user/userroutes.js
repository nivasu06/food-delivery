// Handle signin orm submission
// Handle signin orm submission
import express from "express";
import UserController from "./usercontroller.js";
import jwtAuth from "../../middlewares/jwt.js";

const userRouter = express.Router();
const userController = new UserController();

// Render signup page
userRouter.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle signup form submission
userRouter.post('/signup', (req, res, next) => {
    userController.signUp(req, res, next);
});

// Render signin page
userRouter.get('/signin', (req, res) => {
    res.render('login');
});

// Handle signin form submission
userRouter.post('/signin', (req, res) => {
    userController.signIn(req, res);
});

// Reset password route
userRouter.put('/resetPassword', jwtAuth, (req, res, next) => {
    userController.resetPassword(req, res, next);
});
userRouter.get('/logout', (req, res) => {
    userController.logout(req, res);
});
userRouter.get('/profile', jwtAuth, (req, res, next) => {
    userController.getProfile(req, res, next);
});
userRouter.get('/verify-notice', (req, res) => {
    res.render('verify', { email: req.query.email });
});
// Handle email verification
userRouter.post('/verify', (req, res, next) => {
    userController.verifyEmail(req, res, next);
});

// Handle change password form submission
userRouter.post('/changepassword', jwtAuth, (req, res, next) => {
    userController.changePassword(req, res, next);
});
userRouter.get('/changepassword', (req, res) => {
    if (req.session.user) {
        res.render('changepassword', { email: req.session.user.email });
    } else {
        res.redirect('/login'); // Redirect to login if user is not logged in
    }
});

export default userRouter;
