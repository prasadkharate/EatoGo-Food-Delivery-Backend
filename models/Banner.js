const mongoose = require('mongoose'); // Add this line

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);