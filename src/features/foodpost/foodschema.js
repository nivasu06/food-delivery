import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    image: { type: String, required: true } // URL or path to the image
});

// Define schema for hotel
const hotelSchema = new mongoose.Schema({
    type: { type: String, enum: ['hotel', 'icecream_shop', 'juice_shop', 'fastfood_center'], required: true },
    name: { type: String, required: true },
    image: { type: String, required: true }, // URL or path to the hotel image
    address: { type: String, required: true },
    city: { type: String, required: true },
    items: [itemSchema] // Array of items
});

// Create a model for the schema
export const Hotel = mongoose.model('Hotel', hotelSchema);


