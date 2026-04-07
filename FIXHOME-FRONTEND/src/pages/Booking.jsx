import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft,
  Info
} from 'lucide-react';
import Loader from '../components/Loader';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM", "06:00 PM"];
  const dates = [
    { day: "Today", date: "Apr 07" },
    { day: "Tomorrow", date: "Apr 08" },
    { day: "Wed", date: "Apr 09" },
    { day: "Thu", date: "Apr 10" },
    { day: "Fri", date: "Apr 11" }
  ];

  const handleBooking = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setStep(3);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2 font-heading tracking-tight">Select Schedule</h2>
              <p className="text-slate-500 font-medium text-lg">Pick a date and time that works for you</p>
            </div>

            <div className="space-y-6">
               <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                 <CalendarIcon size={20} className="text-primary-600" /> Choose Date
               </h4>
               <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                 {dates.map((d, idx) => (
                   <div 
                    key={idx}
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${
                      selectedDate === d.date ? 'border-primary-600 bg-primary-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                   >
                     <p className={`text-xs font-bold uppercase mb-1 ${selectedDate === d.date ? 'text-primary-600' : 'text-slate-400'}`}>{d.day}</p>
                     <p className={`text-lg font-black ${selectedDate === d.date ? 'text-primary-800' : 'text-slate-800'}`}>{d.date}</p>
                   </div>
                 ))}
               </div>

               <h4 className="text-lg font-black text-slate-800 flex items-center gap-2 mt-10">
                 <Clock size={20} className="text-primary-600" /> Select Time
               </h4>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {timeSlots.map((time, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedTime(time)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center font-bold ${
                        selectedTime === time ? 'border-primary-600 bg-primary-50/50 text-primary-700' : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {time}
                    </div>
                 ))}
               </div>

               <button 
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(2)}
                className="w-full btn-primary h-14 text-lg mt-8 disabled:opacity-50"
               >
                 Confirm Schedule <ChevronRight size={20} className="inline ml-1" />
               </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2 font-heading tracking-tight">Booking Summary</h2>
              <p className="text-slate-500 font-medium">Review your appointment details</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
               <div className="p-8 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-xl">A</div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800">Alex Smith</h4>
                      <p className="text-sm font-bold text-slate-400">Certified Electrician</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Rate</p>
                    <p className="text-2xl font-black text-primary-600">$50/hr</p>
                  </div>
               </div>

               <div className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <CalendarIcon size={20} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-400">Date & Time</p>
                        <p className="text-lg font-black text-slate-800">{selectedDate}, 2026 at {selectedTime}</p>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-3">
                     <div className="flex justify-between text-slate-600 font-medium">
                        <span>Service Fee</span>
                        <span>$45.00</span>
                     </div>
                     <div className="flex justify-between text-slate-600 font-medium">
                        <span>Platform Commission</span>
                        <span>$5.00</span>
                     </div>
                     <div className="flex justify-between text-2xl font-black text-slate-800 pt-3">
                        <span>Total Due</span>
                        <span className="text-primary-600 underline decoration-primary-100 decoration-4">$50.00</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-2xl flex items-start gap-4 border border-amber-100 italic">
               <Info size={20} className="text-amber-600 shrink-0 mt-1" />
               <p className="text-sm text-amber-800 font-medium">
                 You will only be charged after the professional completes the job and you approve it.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                 onClick={() => setStep(1)}
                 className="btn-secondary h-14 text-lg"
               >
                 Go Back
               </button>
               <button 
                 onClick={handleBooking}
                 disabled={loading}
                 className="btn-primary h-14 text-lg flex items-center justify-center gap-2"
               >
                 {loading ? <Loader /> : <>Confirm Booking <ShieldCheck size={20} /></>}
               </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
             <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-50">
                <CheckCircle2 size={48} />
             </div>
             <h2 className="text-4xl font-black text-slate-800 mb-4 font-heading tracking-tight">Booking Confirmed!</h2>
             <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed mb-10">
               Your appointment with Alex Smith is set for {selectedDate} at {selectedTime}. You can track the status in your dashboard.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary px-10 h-14 text-lg w-full sm:w-auto"
                >
                  Track in Dashboard
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="btn-secondary px-10 h-14 text-lg w-full sm:w-auto"
                >
                  Back to Home
                </button>
             </div>
          </motion.div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <button 
        onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
        className="flex items-center text-slate-400 hover:text-slate-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Cancel
      </button>

      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      <div className="mt-16 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? 'w-12 bg-primary-600' : 'w-2 bg-slate-200'
              }`} 
            />
          ))}
      </div>
    </div>
  );
};

export default Booking;
