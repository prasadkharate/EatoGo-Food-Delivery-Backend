const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Changed from 'text' to 'image'
  bgColor: { type: String, default: '#ef4f5f' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);