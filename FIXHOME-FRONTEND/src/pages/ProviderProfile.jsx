import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  Share2, 
  ThumbsUp, 
  Clock,
  Briefcase,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { mockApi } from '../services/api';
import Loader from '../components/Loader';

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      const data = await mockApi.getProviders();
      setProvider(data[0]); // Mocking first provider for now
      setLoading(false);
    };
    fetchProvider();
  }, [id]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-400 hover:text-slate-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-8 sticky top-24">
             <div className="relative mb-6">
                <div className="w-32 h-32 bg-primary-100 rounded-3xl mx-auto flex items-center justify-center text-primary-600 text-4xl font-black">
                  {provider.name[0]}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                  <ShieldCheck size={20} />
                </div>
             </div>
             
             <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-slate-800 mb-1">{provider.name}</h1>
                <p className="text-slate-400 font-medium">Certified Electrician</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />)}
                  <span className="text-sm font-bold text-slate-800 ml-2">{provider.rating}</span>
                  <span className="text-sm text-slate-400">({provider.reviews} reviews)</span>
                </div>
             </div>

             <div className="space-y-4 border-t border-slate-50 pt-8">
                <div className="flex items-center gap-3 text-slate-600">
                   <MapPin size={18} className="text-primary-500" />
                   <span className="text-sm font-medium">New York, NY (5km away)</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                   <Briefcase size={18} className="text-primary-500" />
                   <span className="text-sm font-medium">150+ Jobs Completed</span>
                </div>
             </div>

             <div className="mt-8 grid grid-cols-2 gap-3">
                <button className="btn-secondary py-3 flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> Chat
                </button>
                <button className="btn-secondary py-3 flex items-center justify-center gap-2">
                  <Share2 size={18} /> Share
                </button>
             </div>
          </div>
        </div>

        {/* Right Column: Details & Booking */}
        <div className="lg:col-span-2 space-y-10">
           {/* About */}
           <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-2xl font-black text-slate-800 mb-6 font-heading">About Professional</h2>
              <p className="text-slate-600 leading-relaxed font-medium text-lg">
                {provider.bio} I specialize in modern residential wiring, smart home integrations, and emergency electrical repairs. I take pride in my work and ensure every job meets safety standards.
              </p>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                 {['Wiring', 'Lighting', 'Safety Check', 'Smart Home'].map(skill => (
                   <div key={skill} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-center text-xs font-bold border border-slate-100">
                      {skill}
                   </div>
                 ))}
              </div>
           </section>

           {/* Booking CTA */}
           <section className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                 <h3 className="text-3xl font-black mb-2">Ready to fix it?</h3>
                 <p className="text-white/80 font-medium text-lg">Book Alex Smith starting at $50/hr</p>
              </div>
              <button 
                onClick={() => navigate(`/booking/${id}`)}
                className="bg-white text-primary-600 px-10 py-4 rounded-2xl font-black text-xl hover:bg-slate-50 hover:scale-105 transition-all shadow-xl shadow-primary-900/20"
              >
                Book Appointment
              </button>
           </section>

           {/* Reviews Mock */}
           <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-800 font-heading">Recent Reviews</h2>
                <div className="flex items-center gap-2 text-primary-600 font-bold">
                   Filter <ThumbsUp size={18} />
                </div>
              </div>
              
              <div className="space-y-8">
                 {[1,2].map(r => (
                   <div key={r} className="flex gap-6 pb-8 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <User size={24} className="text-slate-400" />
                      </div>
                      <div className="space-y-2">
                         <div className="flex items-center gap-4">
                            <h4 className="font-bold text-slate-800">Reviewer {r}</h4>
                            <div className="flex text-yellow-400"><Star size={14} className="fill-current" /> 5.0</div>
                         </div>
                         <p className="text-slate-500 font-medium leading-relaxed">
                            "Excellent work, arrived on time and finished the job perfectly. Very professional and polite. Highly recommended!"
                         </p>
                         <p className="text-xs text-slate-400 font-bold">2 weeks ago</p>
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
