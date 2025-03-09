const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const auth = require('../middleware/auth');

// Get all food items for a restaurant (existing)
router.get('/:restaurantId', async (req, res) => {
  try {
    const foods = await Food.find({ restaurantId: req.params.restaurantId });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single food item by ID (existing)
router.get('/item/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all food items (new)
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes (existing)
router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ... (other admin routes like put, delete remain unchanged)

module.exports = router;