import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MapPin, 
  User,
  ShieldAlert, 
  ChevronRight, 
  Filter, 
  Plus,
  LayoutDashboard,
  Star,
  Phone,
  MessageSquare,
  Camera,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/api';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user, role } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    name: user?.name || '',
    phone: '',
    service: '',
    description: '',
    address: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    'Electrician', 'Plumber', 'House Cleaning', 'AC Repair', 'Gardening', 'Carpentry'
  ];

  useEffect(() => {
    fetchData();
  }, [role]);

  const fetchData = async () => {
    if (!user?.email) return;
    setLoading(true);
    const data = await mockApi.getBookings(role, user.email);
    setBookings(data);
    setLoading(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await mockApi.createBooking(bookingFormData, user.email);
    if (result.success) {
      setShowBookingModal(false);
      setBookingFormData({ name: user?.name || '', phone: '', service: '', description: '', address: '', image: null });
      await fetchData(); // Refresh list immediately
    }
    setIsSubmitting(false);
  };

  const handleUpdateStatus = async (bookingId, newStatus, feedback = null) => {
    const result = await mockApi.updateBookingStatus(bookingId, newStatus, feedback);
    if (result.success) {
      fetchData(); // Refresh list
    }
  };

  const renderStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-blue-100 text-blue-700 border-blue-200",
      completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${variants[status] || variants.pending} capitalize`}>
        {status}
      </span>
    );
  };

  const UserDashboard = () => (
    <div className="space-y-8">
      {/* Stats row */}
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
          <p className="text-xs text-slate-500 font-medium">{bookings.length > 0 ? '+1 since last visit' : 'Start your first journey'}</p>
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

      {/* Bookings table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 font-heading">Recent Activity</h3>
          <button className="text-sm font-bold text-primary-600 flex items-center hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-all">
            View All <ChevronRight size={14} className="ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Professional</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length > 0 ? bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800">{booking.service}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                         {(booking.provider || 'P')[0]}
                       </div>
                       <span className="text-sm font-medium text-slate-600">{booking.provider || 'Service Pro'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-bold text-slate-700">{booking.date}</p>
                      <p className="text-xs text-slate-400">{booking.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{renderStatusBadge(booking.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {/* Completion Button: ONLY for User role and ONLY if status is 'approved' */}
                       {role === 'user' && booking.status === 'approved' && (
                         <button 
                           onClick={() => handleUpdateStatus(booking.id, 'completed')}
                           className="text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-100 transition-all font-heading"
                         >
                           Mark Completed
                         </button>
                       )}

                       {/* Feedback Stars: ONLY for User role and ONLY if status IS completed */}
                       {role === 'user' && booking.status === 'completed' && (
                         <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                           {[1, 2, 3, 4, 5].map((star) => (
                             <Star 
                               key={star} 
                               size={14} 
                               className={`cursor-pointer transition-all hover:scale-110 ${booking.feedback >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                               onClick={() => handleUpdateStatus(booking.id, 'completed', star)}
                             />
                           ))}
                         </div>
                       )}

                       <button className="text-xs font-bold text-slate-400 hover:text-slate-600 p-2 border border-transparent hover:border-slate-200 rounded-lg transition-all">Details</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                        <MessageSquare size={32} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-400">No activities found</p>
                        <p className="text-sm font-medium text-slate-400">Book your first service to get started!</p>
                      </div>
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

  const ProviderDashboard = () => (
    <div className="space-y-8">
      {/* Verification Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-10">
          <ShieldAlert size={200} />
        </div>
        <div className="relative z-10 max-w-lg">
          <h3 className="text-2xl font-black mb-3">Verification Pending</h3>
          <p className="text-white/80 font-medium mb-6">Your profile is currently being reviewed by our team. You'll be notified via email once approved to start accepting bookings.</p>
          <div className="flex gap-4">
            <button className="bg-white text-primary-600 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors">View Details</button>
            <button className="bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-xl font-bold hover:bg-white/20 transition-colors">Support</button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+14%</span>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Earnings</p>
          <h4 className="text-3xl font-black text-slate-800">$0.00</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">New</span>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Jobs</p>
          <h4 className="text-3xl font-black text-slate-800">{bookings.length}</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">Live</span>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Services Offered</p>
          <h4 className="text-3xl font-black text-slate-800">0</h4>
        </div>
      </div>

      {/* New Requests Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-black text-slate-800 font-heading">New Service Requests</h3>
           <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
             <Filter size={18} />
           </button>
        </div>
        
        <div className="space-y-4">
          {bookings.length > 0 ? bookings.map((booking) => (
            <div key={booking.id} className="p-5 rounded-2xl border border-slate-50 hover:border-primary-100 hover:bg-primary-50/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-black">
                   {(booking.user || booking.userEmail || 'U')[0]?.toUpperCase()}
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-800">{booking.user || booking.userEmail || 'Customer'}</h4>
                   <p className="text-sm text-slate-500 font-medium capitalize">{booking.service} Service</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{booking.date}</p>
                  <p className="text-xs text-slate-400">{booking.time}</p>
                </div>
                {renderStatusBadge(booking.status)}
                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(booking.id, 'approved')}
                        className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 shadow-sm shadow-primary-200 transition-all"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                        className="px-4 py-2 bg-white text-slate-400 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {booking.status === 'approved' && (
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">Accepted</span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-16 text-center">
              <p className="text-lg font-black text-slate-400 italic">No incoming requests</p>
              <p className="text-sm font-medium text-slate-400">Wait for your first service booking!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (role === 'provider' && user?.verificationStatus === 'pending') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 sm:p-12">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white rounded-[3.5rem] shadow-premium p-12 sm:p-20 text-center max-w-3xl border border-slate-50"
        >
          <div className="relative inline-block mb-12">
             <div className="w-32 h-32 bg-yellow-100 text-yellow-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-yellow-50 relative z-10 animate-pulse">
              <Clock size={64} />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce pointer-events-none">
              <CheckCircle size={24} />
            </div>
          </div>
          
          <h2 className="text-4xl font-black text-slate-800 mb-6 font-heading tracking-tight">Application Under Review</h2>
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-6 py-2 rounded-full font-black text-sm mb-8 border border-yellow-100 italic tracking-wide">
             <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
             WAITING FOR ADMIN APPROVAL
          </div>
          
          <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed mb-12">
            Professional excellence takes a little time. Our compliance team is currently verifying your documents and experience. We'll grant you full access within <span className="text-slate-800 font-bold italic">24-48 hours</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary px-10 h-16 text-lg w-full sm:w-auto font-black shadow-xl shadow-primary-100" onClick={() => window.location.reload()}>
              Refresh Status
            </button>
            <button className="btn-secondary px-10 h-16 text-lg w-full sm:w-auto font-black border-2" onClick={() => window.location.href = '#'}>
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">
             <LayoutDashboard size={14} /> My Personal Dashboard
          </div>
          <h1 className="text-4xl font-black text-slate-800 font-heading tracking-tight capitalize">
            {role} <span className="text-primary-600 underline decoration-primary-200 decoration-8 underline-offset-2">Portal</span>
          </h1>
        </motion.div>
      </div>

      {loading ? (
        <Loader fullScreen={false} />
      ) : (
        <div className="min-h-[400px]">
          {role === 'user' ? <UserDashboard /> : 
           role === 'provider' ? <ProviderDashboard /> : 
           <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium"> Admin View Placeholder </div>}
        </div>
      )}
      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 font-heading">Book Service</h2>
                    <p className="text-slate-500 font-medium mt-1">Fill in the details to request a professional</p>
                  </div>
                  <button 
                    onClick={() => setShowBookingModal(false)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" required className="input-field pl-12 h-12" placeholder="Your Name"
                        value={bookingFormData.name}
                        onChange={(e) => setBookingFormData({...bookingFormData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="tel" required className="input-field pl-12 h-12" placeholder="+1 (555) 000-0000"
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({...bookingFormData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Select Service</label>
                    <div className="relative">
                      <LayoutDashboard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        required className="input-field pl-12 h-12 appearance-none"
                        value={bookingFormData.service}
                        onChange={(e) => setBookingFormData({...bookingFormData, service: e.target.value})}
                      >
                        <option value="">Choose a Service...</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Service Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" required className="input-field pl-12 h-12" placeholder="123 Street, City"
                        value={bookingFormData.address}
                        onChange={(e) => setBookingFormData({...bookingFormData, address: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Problem Description</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
                      <textarea 
                        required className="input-field pl-12 py-3 h-32 resize-none" placeholder="Describe what needs to be fixed..."
                        value={bookingFormData.description}
                        onChange={(e) => setBookingFormData({...bookingFormData, description: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Defective Image (Optional)</label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-primary-400 transition-colors">
                      <input type="file" className="hidden" id="file-upload" accept="image/*" />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <Camera size={32} className="text-slate-300 mb-2" />
                        <span className="text-sm font-bold text-slate-500">Click to upload photo</span>
                        <span className="text-xs text-slate-400 mt-1">Supports JPG, PNG up to 5MB</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full btn-primary h-14 text-lg font-black shadow-xl shadow-primary-100 disabled:opacity-70"
                    >
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
