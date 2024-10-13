import express from 'express';
import FoodController from './foodcontroller.js';
import { upload } from '../../middlewares/multer.js';
import jwtAuth from '../../middlewares/jwt.js';

const FoodRouter = express.Router();
const foodController = new FoodController();

// Route to display the hotel post form - requires authentication
FoodRouter.get('/posthotel', jwtAuth, (req, res) => {
    console.log('GET /food/posthotel route hit');
    res.render('hotelpost', { errorMessage: req.flash('error') });
});

FoodRouter.post('/posthotel', jwtAuth, upload.single('image'), async (req, res) => {
    console.log('POST /food/posthotel route hit');
    try {
        await foodController.postHotel(req, res);
    } catch (err) {
        console.error('Error processing POST request:', err);
        req.flash('error', 'Error processing your request. Please try again.');
        res.redirect('/food/posthotel');
    }
});


export default FoodRouter;
