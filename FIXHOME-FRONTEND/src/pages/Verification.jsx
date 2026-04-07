import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Video, 
  Upload, 
  Phone, 
  CheckCircle, 
  ArrowRight, 
  HelpCircle,
  GraduationCap,
  Hammer,
  Image as ImageIcon,
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { mockApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Verification = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [type, setType] = useState(user?.verificationType || null); 
  const [formData, setFormData] = useState({
    certificates: [],
    workSamples: [],
    phoneNumber: '',
    serviceType: '',
    experienceYears: '',
    institution: '',
    degree: '',
    experienceDesc: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-skip to step 2 if verificationType was already chosen during registration
  useEffect(() => {
    if (user?.verificationType) {
      setType(user.verificationType);
      setStep(2);
    }
  }, [user]);

  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    const result = await mockApi.submitVerification(formData);
    if (result.status === 'pending') {
      setSuccess(true);
      setStep(4);
    }
    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-800 mb-4 font-heading tracking-tight">Verify Your Expertise</h2>
              <p className="text-slate-500 font-medium text-lg">Choose the path that best represents your professional background</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                onClick={() => handleTypeSelect('educated')}
                className="p-10 rounded-[2.5rem] border-2 border-slate-100 hover:border-primary-500 hover:bg-primary-50/30 cursor-pointer transition-all group relative overflow-hidden"
              >
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3">Educated Provider</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Recommended if you have formal degrees, diplomas, or certifications from recognized institutions.
                </p>
                <div className="mt-8 flex items-center text-primary-600 font-bold group-hover:gap-2 transition-all">
                  Get Verified <ChevronRight size={20} />
                </div>
              </div>

              <div 
                onClick={() => handleTypeSelect('non-educated')}
                className="p-10 rounded-[2.5rem] border-2 border-slate-100 hover:border-secondary-500 hover:bg-secondary-50/30 cursor-pointer transition-all group relative overflow-hidden"
              >
                <div className="w-16 h-16 bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Hammer size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3">Experienced Pro</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Perfect if you have years of successful real-world projects and satisfied clients, but no formal papers.
                </p>
                <div className="mt-8 flex items-center text-secondary-600 font-bold group-hover:gap-2 transition-all">
                  Get Verified <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-8">
               <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 font-bold flex items-center transition-colors">
                <ArrowRight className="rotate-180 mr-2" size={18} /> Back to selection
              </button>
              <div className="px-4 py-1 bg-slate-100 rounded-full text-xs font-black text-slate-500 tracking-widest uppercase italic">Step 02/03</div>
            </div>
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2 font-heading">Professional Profile</h2>
              <p className="text-slate-500 font-medium">Basic information to set up your work presence</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[2rem] shadow-premium border border-slate-100">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">What service do you offer?</label>
                <select 
                  required
                  className="input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                >
                  <option value="">Select a service category</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="cleaning">House Cleaning</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="ac_repair">AC Repair</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="tel" required placeholder="+1 (555) 000-0000" className="input-field pl-12"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Years of Experience</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number" required placeholder="Ex: 5" className="input-field pl-12"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="md:col-span-2 mt-4 w-full btn-primary h-14 text-lg font-black shadow-lg shadow-primary-100">
                Next: Verification Material
              </button>
            </form>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-8">
               <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-600 font-bold flex items-center transition-colors">
                <ArrowRight className="rotate-180 mr-2" size={18} /> Back
              </button>
              <div className="px-4 py-1 bg-slate-100 rounded-full text-xs font-black text-slate-500 tracking-widest uppercase italic">Step 03/03</div>
            </div>
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2 font-heading">
                {type === 'educated' ? 'Upload Certificates' : 'Show Your Work'}
              </h2>
              <p className="text-slate-500 font-medium">
                {type === 'educated' ? 'Provide your degrees or professional certifications' : 'Upload photos or videos of your best projects'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 bg-white p-10 rounded-[3rem] shadow-premium border border-slate-100">
               {type === 'educated' ? (
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Institution Name</label>
                        <input type="text" required placeholder="Ex: IIT Madras" className="input-field" 
                          value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Degree/Certificate</label>
                        <input type="text" required placeholder="Ex: Diploma in Electrical" className="input-field" 
                          value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Upload Certificate (PDF/Image)</label>
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-primary-400 transition-colors cursor-pointer">
                        <FileText size={32} className="text-primary-500 mb-2" />
                        <span className="text-xs font-bold text-slate-500">Click to upload doc</span>
                      </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Previous Work Experience (Years/Companies)</label>
                      <textarea required placeholder="Briefly describe your past projects..." className="input-field min-h-[100px] py-4" 
                        value={formData.experienceDesc} onChange={(e) => setFormData({...formData, experienceDesc: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Upload Work Samples (Photos/Videos)</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-secondary-400 transition-colors cursor-pointer">
                          <ImageIcon size={24} />
                          <span className="text-[10px] font-bold mt-1">Add Image</span>
                        </div>
                        <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-secondary-400 transition-colors cursor-pointer">
                          <Video size={24} />
                          <span className="text-[10px] font-bold mt-1">Add Video</span>
                        </div>
                      </div>
                    </div>
                 </div>
               )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-primary h-16 text-xl font-black mt-4 flex items-center justify-center shadow-2xl shadow-primary-100"
              >
                {loading ? <Loader /> : 'Submit Application'}
              </button>
            </form>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-[3.5rem] shadow-2xl border border-slate-50 max-w-3xl mx-auto"
          >
            <div className="relative inline-block mb-12">
               <div className="w-32 h-32 bg-yellow-100 text-yellow-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-yellow-50 relative z-10 animate-pulse">
                <Clock size={64} />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce pointer-events-none">
                <CheckCircle size={24} />
              </div>
            </div>
            
            <h2 className="text-4xl font-black text-slate-800 mb-4 font-heading">Application Received!</h2>
            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-6 py-2 rounded-full font-black text-sm mb-8 border border-yellow-100">
               <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
               Waiting for Admin Approval
            </div>
            
            <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed mb-12">
              Great skill matters. Our team is now reviewing your credentials and work samples. This usually takes <span className="text-slate-800 font-bold italic">24-48 hours</span>. We'll notify you the moment you're cleared to start earning!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-10">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="btn-primary px-10 h-16 text-lg w-full sm:w-auto font-black shadow-xl shadow-primary-100"
              >
                Go to My Dashboard
              </button>
              <button className="btn-secondary px-10 h-16 text-lg w-full sm:w-auto font-black border-2">
                Help & Support
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
      
      {step < 4 && (
        <div className="mt-16 flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-3 rounded-full transition-all duration-500 ${
                s === step ? 'w-20 bg-primary-600' : 'w-4 bg-slate-200'
              }`} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Verification;
