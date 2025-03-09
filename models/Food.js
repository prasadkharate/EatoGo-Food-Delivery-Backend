const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String, required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  offer: { type: Number, default: 0 }, // New: Percentage discount (e.g., 10 for 10% off)
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);