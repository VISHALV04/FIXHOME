require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');

connectDB().then(seedAdmin);

async function seedAdmin() {
  const exists = await User.findOne({ email: 'surendar@gmail.com' });
  if (!exists) {
    await User.create({
      name: 'surendar',
      email: 'surendar@gmail.com',
      password: '123',
      role: 'admin',
      verificationStatus: 'approved',
    });
    console.log('Admin user created: surendar@gmail.com');
  }
}

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Allow cross-origin access to uploaded files
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/verification', require('./routes/verification'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
