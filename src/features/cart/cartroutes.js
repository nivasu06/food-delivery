import express from 'express';
import { Order } from './cartschema.js';
const cartrouter = express.Router();
cartrouter.post('/cart/add-items', (req, res) => {
  const userId = req.body.userId;
  const hotelId = req.body.hotelId;
  const hotelName = req.body.hotelName;
  const items = req.body.items;

  const cartItems = items.map((item) => {
    return {
      itemId: item._id,
      quantity: item.quantity,
      cost: item.cost
    };
  });

  res.render('cart', { userId, hotelId, hotelName, cartItems });
});

cartrouter.post('/cart/place-order', (req, res) => {
  const userId = req.body.userId;
  const hotelId = req.body.hotelId;
  const items = req.body.items;

  const order = new Order({
    userId,
    hotelId,
    items
  });

  order.save((err, order) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error placing order');
    } else {
      res.send('Order placed successfully');
    }
  });
});
export default cartrouter;


// Route to handle adding items to the cart
