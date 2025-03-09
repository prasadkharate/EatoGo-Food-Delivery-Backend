const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'owner', 'admin', 'banner-manager', 'developer'], default: 'customer' }, // Added 'developer'
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);