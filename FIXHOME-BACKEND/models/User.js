const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
  verificationStatus: { type: String, enum: ['unverified', 'pending', 'approved', 'rejected'], default: 'unverified' },
  verificationType: { type: String, enum: ['educated', 'non-educated', null], default: null },
  verificationData: {
    serviceType: String,
    phoneNumber: String,
    experienceYears: Number,
    institution: String,
    degree: String,
    experienceDesc: String,
    certificatePath: String,
    workSamplePaths: [String],
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
