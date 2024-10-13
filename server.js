import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectUsingMongoose } from './src/config/database.js';
import userRouter from './src/features/user/userroutes.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import UserController from './src/features/user/usercontroller.js';
import jwtAuth from './src/middlewares/jwt.js';
import FoodRouter from './src/features/foodpost/foodroutes.js';
import hotelRouter from './src/features/hotels/hotelroutes.js';
//import { cartrouter } from './src/features/cart/cartroutes.js';
import cartrouter from './src/features/cart/cartroutes.js';
//impport cart
const userController = new UserController();
dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(flash());
// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "src", "views"));

// Use cookie-parser and session middleware
app.use(cookieParser());
app.use(session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/foodDB',
        collectionName: 'sessions'
    }),
    cookie: { secure: false } // Use secure: true in production with HTTPS
}));
// Middleware to set user information in response locals
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Apply jwtAuth middleware to routes that require authentication
app.use('/food/users', userRouter);
app.use('/food', hotelRouter);
app.use('/food',FoodRouter);
app.use('/',cartrouter)
// Apply jwtAuth middleware to protected routes
app.use('/food', jwtAuth); // Apply to all /food routes if they require authentication
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// Define routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/support', (req, res) => {
    res.render('helper');
});
app.get('/profile', (req, res) => {
    res.render('profile'); // This will render index.ejs located in src/views
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectUsingMongoose();
});


