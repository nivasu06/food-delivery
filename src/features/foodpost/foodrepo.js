import { Hotel } from "./foodschema.js";

export default class FoodRepository {
    async saveHotel(data){
        try {
            const hotel = new Hotel(data);
            await hotel.save();
            return hotel;
        } catch (err) {
            throw new Error('Error saving hotel: ' + err.message);
        }
    };
}
