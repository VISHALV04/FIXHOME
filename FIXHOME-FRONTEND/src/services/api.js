import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data; // { token, user }
  },
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data; // { token, user }
  },
};

export const bookingApi = {
  getBookings: async () => {
    const { data } = await api.get('/bookings');
    return data;
  },
  createBooking: async (formData) => {
    // formData is a pre-built FormData object from the component
    const { data } = await api.post('/bookings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  updateBookingStatus: async (bookingId, status, feedback = null) => {
    const { data } = await api.patch(`/bookings/${bookingId}`, { status, feedback });
    return data; // { success, booking }
  },
};

export const verificationApi = {
  submitVerification: async (formData) => {
    // formData is already a FormData object built in the component
    const { data } = await api.post('/verification/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  getStatus: async () => {
    const { data } = await api.get('/verification/status');
    return data;
  },
};

export const adminApi = {
  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data;
  },
  getProviders: async () => {
    const { data } = await api.get('/admin/providers');
    return data;
  },
  verifyProvider: async (providerId, status) => {
    const { data } = await api.patch(`/admin/providers/${providerId}/verify`, { status });
    return data;
  },
  deleteUser: async (userId) => {
    const { data } = await api.delete(`/admin/users/${userId}`);
    return data;
  },
};

export default api;
