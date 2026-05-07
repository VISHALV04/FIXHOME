const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userEmail: String,
  phone: String,
  service: { type: String, required: true },
  description: String,
  address: String,
  imagePath: String,
  status: { type: String, enum: ['pending', 'approved', 'completed', 'rejected'], default: 'pending' },
  feedback: { type: Number, min: 1, max: 5, default: null },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  date: { type: String },
  time: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
