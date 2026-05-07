const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const uploadFields = upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'workSamples', maxCount: 5 },
]);

// POST /api/verification/submit
router.post('/submit', protect, uploadFields, async (req, res) => {
  const { serviceType, phoneNumber, experienceYears, institution, degree, experienceDesc } = req.body;
  try {
    const certificatePath = req.files?.certificate?.[0]?.path || null;
    const workSamplePaths = req.files?.workSamples?.map(f => f.path) || [];

    await User.findByIdAndUpdate(req.user._id, {
      verificationStatus: 'pending',
      verificationData: { serviceType, phoneNumber, experienceYears, institution, degree, experienceDesc, certificatePath, workSamplePaths },
    });

    res.json({ status: 'pending', message: 'Verification application submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/verification/status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('verificationStatus verificationType verificationData');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
