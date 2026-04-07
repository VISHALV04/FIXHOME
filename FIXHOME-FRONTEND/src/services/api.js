import axios from 'axios';

// Mock delay function for loading states
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const api = axios.create({
  baseURL: 'https://api.homeassist.mock/v1', // Placeholder
  headers: {
    'Content-Type': 'application/json',
  },
});

const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');

const syncStore = () => {
  localStorage.setItem('mock_users', JSON.stringify(users));
  localStorage.setItem('mock_bookings', JSON.stringify(bookings));
};

// Mocking some API responses for development
export const mockApi = {
  login: async (credentials) => {
    await delay(1200);
    const existingUser = users.find(u => u.email === credentials.email);
    
    // Use the registered role from the store if found, otherwise keep sim logic
    const role = existingUser ? existingUser.role : 
                 (credentials.email.includes('provider') ? 'provider' : 
                  credentials.email.includes('admin') ? 'admin' : 'user');

    const name = existingUser ? existingUser.name : credentials.email.split('@')[0];
    
    return {
      user: { 
        id: existingUser?.id || '1', 
        name, 
        email: credentials.email, 
        role, 
        verificationStatus: existingUser?.verificationStatus || 'unverified',
        verificationType: existingUser?.verificationType || null
      },
      token: 'dummy-jwt-token',
    };
  },

  register: async (data) => {
    await delay(1500);
    const newUser = { 
      id: (users.length + 1).toString(), 
      ...data,
      verificationStatus: data.role === 'provider' ? 'unverified' : 'approved'
    };
    users.push(newUser);
    syncStore();
    return {
      user: newUser,
      token: 'dummy-jwt-token-new',
    };
  },

  getServices: async () => {
    await delay(800);
    return [];
  },

  getProviders: async (serviceId) => {
    await delay(1000);
    return [];
  },

  submitVerification: async (formData, userEmail) => {
    await delay(2000);
    const userIndex = users.findIndex(u => u.email === userEmail);
    if (userIndex !== -1) {
      users[userIndex].verificationStatus = 'pending';
      syncStore();
    }
    return { status: 'pending', message: 'Verification application submitted successfully.' };
  },

  getBookings: async (role, userEmail) => {
    await delay(1000);
    // Filter bookings based on role and user identity (mock logic)
    if (role === 'provider') {
      return bookings.filter(b => b.providerEmail === userEmail || !b.providerEmail); 
    }
    return bookings.filter(b => b.userEmail === userEmail || !b.userEmail);
  },

  createBooking: async (bookingData, userEmail) => {
    await delay(1200);
    const newBooking = { 
      id: Math.random().toString(36).substr(2, 9), 
      ...bookingData, 
      userEmail,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM' 
    };
    bookings.push(newBooking);
    syncStore();
    return { success: true, booking: newBooking };
  },

  updateBookingStatus: async (bookingId, status, feedback = null) => {
    await delay(800);
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      bookings[bookingIndex] = { ...bookings[bookingIndex], status, feedback: feedback || bookings[bookingIndex].feedback };
      syncStore();
    }
    return { success: true, bookingId, status, feedback };
  }
};

export default api;
