import express from "express";
import jwtAuth from "../../middlewares/jwt.js";
import { filterHotelByCity ,findById} from "./hotelcontroller.js";
const hotelRouter=express.Router();
hotelRouter.use(jwtAuth);
hotelRouter.get('/locations/:city', filterHotelByCity);
hotelRouter.get('/hotels/:id', jwtAuth, findById);
export default hotelRouter;