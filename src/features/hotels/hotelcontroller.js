import { Hotel } from "../foodpost/foodschema.js";
export const filterHotelByCity = async (req, res) => {
    const city = req.params.city;
    try {
        const hotels = await Hotel.find({ city :{ $regex: new RegExp(city, 'i') } });
        if (hotels.length > 0) {
            res.render('hotel', { hotels, city });
        } else {
            res.render('nohotel', { city });
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
export const findById = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).send('Hotel not found');
        }
        const user = req.user; // Assuming req.user contains the authenticated user
        res.render('hotelitem', { hotel, user });
    } catch (err) {
        console.error('Error fetching hotel:', err);
        res.status(500).send('Server Error');
    }
};
