import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, CheckCircle, TrendingUp, Users, MapPin, User,
  ChevronRight, Filter, Plus, LayoutDashboard, Star, Phone,
  MessageSquare, Camera, X, FileText, Eye, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingApi, adminApi } from '../services/api';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user, role } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    name: user?.name || '', phone: '', service: '', description: '', address: '',
  });
  const [bookingImage, setBookingImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providers, setProviders] = useState([]);
  const imageRef = useRef();

  const services = ['Electrician', 'Plumber', 'House Cleaning', 'AC Repair', 'Gardening', 'Carpentry'];

  useEffect(() => {
    fetchData();
    if (role === 'admin') fetchProviders();
  }, [role]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await bookingApi.getBookings();
      setBookings(data);
    } catch (e) { /* ignore */ }
    setLoading(false);
  };

  const fetchProviders = async () => {
    try {
      const data = await adminApi.getProviders();
      setProviders(data);
    } catch (e) { /* ignore */ }
  };

  const handleVerifyProvider = async (providerId, status) => {
    await adminApi.verifyProvider(providerId, status);
    fetchProviders();
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData();
    Object.entries(bookingFormData).forEach(([k, v]) => form.append(k, v));
    if (bookingImage) form.append('image', bookingImage);
    const result = await bookingApi.createBooking(form);
    if (result.success) {
      setShowBookingModal(false);
      setBookingFormData({ name: user?.name || '', phone: '', service: '', description: '', address: '' });
      setBookingImage(null);
      fetchData();
    }
    setIsSubmitting(false);
  };

  const handleUpdateStatus = async (bookingId, newStatus, feedback = null) => {
    const result = await bookingApi.updateBookingStatus(bookingId, newStatus, feedback);
    if (result.success) fetchData();
  };

  const renderStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${variants[status] || variants.pending} capitalize`}>
        {status}
      </span>
    );
  };

  // ── USER DASHBOARD ──────────────────────────────────────────────────────────
  const UserDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
              <h4 className="text-3xl font-black text-slate-800">{bookings.length}</h4>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">{bookings.length > 0 ? 'Active bookings' : 'Start your first journey'}</p>
        </div>
        <div className="md:col-span-1 flex items-end pb-2">
          <button
            onClick={() => setShowBookingModal(true)}
            className="w-full btn-primary h-14 px-8 flex items-center justify-center gap-2 group shadow-xl shadow-primary-200"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Book New Service
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 font-heading">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length > 0 ? bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4"><span className="font-bold text-slate-800">{booking.service}</span></td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-700 text-sm">{booking.date}</p>
                    <p className="text-xs text-slate-400">{booking.time}</p>
                  </td>
                  <td className="px-6 py-4">{renderStatusBadge(booking.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(booking._id, 'completed')}
                          className="text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-100 transition-all"
                        >
                          Mark Completed
                        </button>
                      )}
                      {booking.status === 'completed' && (
                        <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star} size={14}
                              className={`cursor-pointer transition-all hover:scale-110 ${booking.feedback >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                              onClick={() => handleUpdateStatus(booking._id, 'completed', star)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                        <MessageSquare size={32} />
                      </div>
                      <p className="text-lg font-black text-slate-400">No bookings yet</p>
                      <p className="text-sm font-medium text-slate-400">Book your first service to get started!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ── PROVIDER DASHBOARD ───────────────────────────────────────────────────────
  const ProviderDashboard = () => (
    <div className="space-y-8">
      {/* Stats — Active Jobs & Services Offered only */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Jobs</p>
          <h4 className="text-3xl font-black text-slate-800">{bookings.filter(b => b.status === 'approved').length}</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completed Jobs</p>
          <h4 className="text-3xl font-black text-slate-800">{bookings.filter(b => b.status === 'completed').length}</h4>
        </div>
      </div>

      {/* Service Requests */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-800 font-heading">Service Requests</h3>
          <Filter size={18} className="text-slate-400" />
        </div>
        <div className="space-y-4">
          {bookings.length > 0 ? bookings.map((booking) => (
            <div key={booking._id} className="p-5 rounded-2xl border border-slate-100 hover:border-primary-100 hover:bg-primary-50/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-black text-lg">
                  {(booking.userName || booking.userEmail || 'U')[0]?.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{booking.userName || booking.userEmail || 'Customer'}</h4>
                  <p className="text-sm text-slate-500 font-medium capitalize">{booking.service}</p>
                  {booking.address && <p className="text-xs text-slate-400 mt-0.5">{booking.address}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{booking.date}</p>
                  <p className="text-xs text-slate-400">{booking.time}</p>
                </div>
                {renderStatusBadge(booking.status)}
                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'approved')}
                        className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                        className="px-4 py-2 bg-white text-red-500 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-50 transition-all"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {booking.status === 'approved' && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">Accepted</span>
                  )}
                  {booking.status === 'completed' && (
                    <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">Completed</span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-16 text-center">
              <p className="text-lg font-black text-slate-400 italic">No incoming requests yet</p>
              <p className="text-sm font-medium text-slate-400">Wait for your first service booking!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
  const AdminDashboard = () => {
    const BACKEND = 'http://localhost:5000';
    const getFileUrl = (p) => p ? `${BACKEND}/${p.replace(/\\/g, '/')}` : null;
    const isPdf = (p) => /\.pdf$/i.test(p);

    return (
      <div className="space-y-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="text-xl font-black text-slate-800 font-heading">Provider Verification Requests</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Review documents and approve or reject applications</p>
          </div>
          <div className="divide-y divide-slate-50">
            {providers.length > 0 ? providers.map((provider) => (
              <div key={provider._id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{provider.name}</p>
                  <p className="text-sm text-slate-400">{provider.email}</p>
                  <p className="text-xs text-slate-400 mt-1 capitalize">
                    {provider.verificationType || 'N/A'} · {provider.verificationData?.serviceType || '—'} · {provider.verificationData?.experienceYears || 0} yrs exp
                  </p>
                  {provider.verificationData?.institution && (
                    <p className="text-xs text-slate-500 mt-1">{provider.verificationData.institution} — {provider.verificationData.degree}</p>
                  )}
                  {provider.verificationData?.experienceDesc && (
                    <p className="text-xs text-slate-500 mt-1 max-w-md italic">"{provider.verificationData.experienceDesc}"</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {provider.verificationData?.certificatePath && (
                      <a href={getFileUrl(provider.verificationData.certificatePath)} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-xl hover:bg-primary-100 transition-all">
                        {isPdf(provider.verificationData.certificatePath) ? <FileText size={14} /> : <ImageIcon size={14} />}
                        View Certificate
                      </a>
                    )}
                    {provider.verificationData?.workSamplePaths?.map((p, i) => (
                      <a key={i} href={getFileUrl(p)} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-secondary-600 bg-secondary-50 border border-secondary-100 px-3 py-1.5 rounded-xl hover:bg-secondary-100 transition-all">
                        <Eye size={14} /> Sample {i + 1}
                      </a>
                    ))}
                    {!provider.verificationData?.certificatePath && !provider.verificationData?.workSamplePaths?.length && (
                      <span className="text-xs text-slate-400 italic">No documents uploaded</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {renderStatusBadge(provider.verificationStatus)}
                  {provider.verificationStatus === 'pending' && (
                    <>
                      <button onClick={() => handleVerifyProvider(provider._id, 'approved')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all">
                        Approve
                      </button>
                      <button onClick={() => handleVerifyProvider(provider._id, 'rejected')}
                        className="px-4 py-2 bg-white text-red-500 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-50 transition-all">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            )) : (
              <div className="py-16 text-center">
                <p className="text-lg font-black text-slate-400">No provider applications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">
            <LayoutDashboard size={14} /> My Dashboard
          </div>
          <h1 className="text-4xl font-black text-slate-800 font-heading tracking-tight capitalize">
            {role} <span className="text-primary-600 underline decoration-primary-200 decoration-8 underline-offset-2">Portal</span>
          </h1>
        </motion.div>
      </div>

      {loading ? <Loader fullScreen={false} /> : (
        <div className="min-h-[400px]">
          {role === 'user' ? <UserDashboard /> :
           role === 'provider' ? <ProviderDashboard /> :
           role === 'admin' ? <AdminDashboard /> : null}
        </div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 sm:p-10 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 font-heading">Book Service</h2>
                    <p className="text-slate-500 font-medium mt-1">Fill in the details to request a professional</p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" required className="input-field pl-12 h-12" placeholder="Your Name"
                        value={bookingFormData.name} onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="tel" required className="input-field pl-12 h-12" placeholder="+91 99999 99999"
                        value={bookingFormData.phone} onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Select Service</label>
                    <select required className="input-field h-12 appearance-none"
                      value={bookingFormData.service} onChange={(e) => setBookingFormData({ ...bookingFormData, service: e.target.value })}>
                      <option value="">Choose a Service...</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Service Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" required className="input-field pl-12 h-12" placeholder="123 Street, City"
                        value={bookingFormData.address} onChange={(e) => setBookingFormData({ ...bookingFormData, address: e.target.value })} />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Problem Description</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
                      <textarea required className="input-field pl-12 py-3 h-32 resize-none" placeholder="Describe what needs to be fixed..."
                        value={bookingFormData.description} onChange={(e) => setBookingFormData({ ...bookingFormData, description: e.target.value })} />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Defective Image (Optional)</label>
                    <input ref={imageRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => setBookingImage(e.target.files[0] || null)} />
                    <div onClick={() => imageRef.current.click()}
                      className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                      <Camera size={32} className="text-slate-300 mb-2 mx-auto" />
                      {bookingImage
                        ? <span className="text-sm font-bold text-primary-600">{bookingImage.name}</span>
                        : <><span className="text-sm font-bold text-slate-500">Click to upload photo</span>
                           <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 5MB</p></>}
                    </div>
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button type="submit" disabled={isSubmitting}
                      className="w-full btn-primary h-14 text-lg font-black shadow-xl shadow-primary-100 disabled:opacity-70">
                      {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
