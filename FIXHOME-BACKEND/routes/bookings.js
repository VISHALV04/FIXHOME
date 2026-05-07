const express = require('express');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/bookings — get bookings for logged-in user or provider
router.get('/', protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'provider') {
      bookings = await Booking.find({ provider: req.user._id }).sort({ createdAt: -1 });
      // Also return unassigned pending bookings so providers can accept them
      const unassigned = await Booking.find({ provider: null, status: 'pending' }).sort({ createdAt: -1 });
      bookings = [...bookings, ...unassigned];
    } else if (req.user.role === 'admin') {
      bookings = await Booking.find().populate('user', 'name email').sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bookings — create a new booking
router.post('/', protect, upload.single('image'), async (req, res) => {
  const { name, phone, service, description, address } = req.body;
  try {
    const booking = await Booking.create({
      user: req.user._id,
      userName: name || req.user.name,
      userEmail: req.user.email,
      phone,
      service,
      description,
      address,
      imagePath: req.file ? req.file.path : null,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
    });
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/bookings/:id — update status or feedback
router.patch('/:id', protect, async (req, res) => {
  const { status, feedback } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (status) booking.status = status;
    if (feedback) booking.feedback = feedback;

    // Assign provider when they accept
    if (status === 'approved' && req.user.role === 'provider') {
      booking.provider = req.user._id;
    }

    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
