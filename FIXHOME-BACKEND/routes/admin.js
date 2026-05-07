const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/providers
router.get('/providers', protect, adminOnly, async (req, res) => {
  try {
    const providers = await User.find({ role: 'provider' }).select('-password').sort({ createdAt: -1 });
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/providers/:id/verify
router.patch('/providers/:id/verify', protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be approved or rejected' });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { verificationStatus: status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Provider not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id — remove any user/provider
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
