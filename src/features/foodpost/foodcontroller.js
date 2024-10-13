import mongoose from "mongoose";
import FoodRepository from "./foodrepo.js";

export default class FoodController {
    constructor() {
        this.foodRepository = new FoodRepository();
    }

    async postHotel(req, res) {
        const { type, name, address, city, items } = req.body;
        const imagePath = req.file?.path;

        // Log the received data for debuggin

        try {
            // Function to parse items from the textarea input
            const parseItems = (itemsString) => {
                return itemsString.split(',').map(item => {
                    const [name, cost, image] = item.split(' - ');
                    return { 
                        name: name.trim(),
                        cost: parseFloat(cost.replace('$', '').trim()), 
                        image: image.trim() 
                    };
                });
            };

            // Parse the items from the form input
            const parsedItems = parseItems(items);

            // Prepare the hotel data
            const hotelData = {
                type,
                name,
                image: imagePath,
                address,
                city,
                items: parsedItems
            };

            // Save the hotel data
            const hotel = await this.foodRepository.saveHotel(hotelData);
            res.redirect('/');
        } catch (err) {
            console.error('Error saving hotel:', err);
            req.flash('error', 'Error saving hotel. Please check your input and try again.');
            res.redirect('/food/hotelpost/posthotel');
        }
    }
}
