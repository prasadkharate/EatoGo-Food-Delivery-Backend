const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Food = require('../models/Food');
const Order = require('../models/Order');

// Middleware to check if user is owner
const isOwner = (req, res, next) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Owner access only' });
  next();
};

// Get owner's restaurant menu
router.get('/menu', auth, isOwner, async (req, res) => {
  try {
    const foods = await Food.find({ restaurantId: req.user.restaurantId });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add dish to menu
router.post('/menu', auth, isOwner, async (req, res) => {
  try {
    const food = new Food({ ...req.body, restaurantId: req.user.restaurantId });
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove dish from menu
router.delete('/menu/:id', auth, isOwner, async (req, res) => {
  try {
    const food = await Food.findOneAndDelete({ _id: req.params.id, restaurantId: req.user.restaurantId });
    if (!food) return res.status(404).json({ message: 'Food not found or not owned' });
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders for owner's restaurant
router.get('/orders', auth, isOwner, async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: 'items.foodId',
      match: { restaurantId: req.user.restaurantId },
    }).populate('userId', 'name');
    const filteredOrders = orders.filter(order => order.items.some(item => item.foodId));
    res.json(filteredOrders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;