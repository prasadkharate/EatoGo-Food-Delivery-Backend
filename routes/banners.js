const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const auth = require('../middleware/auth');

// Get all banners (public)
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a banner (banner-manager or developer only)
router.post('/', auth, async (req, res) => {
  if (!['banner-manager', 'developer'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const banner = new Banner({
      image: req.body.image, // Changed from 'text' to 'image'
      bgColor: req.body.bgColor,
      createdBy: req.user.id,
    });
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a banner (banner-manager or developer only)
router.delete('/:id', auth, async (req, res) => {
  if (!['banner-manager', 'developer'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json({ message: 'Banner removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;