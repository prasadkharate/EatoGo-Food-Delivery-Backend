const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth'); // Add this line

router.post('/register', async (req, res) => {
  const { name, email, password, role, restaurantName, restaurantImage } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    if (role === 'developer') {
      const developerCount = await User.countDocuments({ role: 'developer' });
      if (developerCount >= 2) {
        return res.status(403).json({ message: 'Developer registration limit reached (max 2)' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let restaurantId = null;

    if (role === 'owner') {
      if (!restaurantName || !restaurantImage) {
        return res.status(400).json({ message: 'Restaurant name and image are required for owners' });
      }
      const restaurant = new Restaurant({ name: restaurantName, image: restaurantImage });
      const savedRestaurant = await restaurant.save();
      restaurantId = savedRestaurant._id;
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      restaurantId: role === 'owner' ? restaurantId : undefined,
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, restaurantId: user.restaurantId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({ message: 'Profile updated', user: user.toObject({ getters: true }) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;