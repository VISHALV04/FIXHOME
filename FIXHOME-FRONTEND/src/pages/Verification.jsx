import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Video, Phone, CheckCircle, ArrowRight,
  GraduationCap, Hammer, Image as ImageIcon, Clock, ChevronRight, X
} from 'lucide-react';
import { verificationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Verification = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [type, setType] = useState(user?.verificationType || null);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    serviceType: '',
    experienceYears: '',
    institution: '',
    degree: '',
    experienceDesc: '',
  });
  const [certificate, setCertificate] = useState(null);
  const [workSamples, setWorkSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const certRef = useRef();
  const samplesRef = useRef();

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
    setError('');
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      if (certificate) payload.append('certificate', certificate);
      workSamples.forEach(f => payload.append('workSamples', f));

      const result = await verificationApi.submitVerification(payload);
      if (result.status === 'pending') {
        // Update local user state so VerificationPending shows correct status
        refreshUser({ ...user, verificationStatus: 'pending' });
        navigate('/verification-pending');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    }
    setLoading(false);
  };

  const removeWorkSample = (index) => {
    setWorkSamples(prev => prev.filter((_, i) => i !== index));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-800 mb-4 font-heading tracking-tight">Verify Your Expertise</h2>
              <p className="text-slate-500 font-medium text-lg">Choose the path that best represents your professional background</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div onClick={() => handleTypeSelect('educated')} className="p-10 rounded-[2.5rem] border-2 border-slate-100 hover:border-primary-500 hover:bg-primary-50/30 cursor-pointer transition-all group">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3">Educated Provider</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Recommended if you have formal degrees, diplomas, or certifications from recognized institutions.</p>
                <div className="mt-8 flex items-center text-primary-600 font-bold">Get Verified <ChevronRight size={20} /></div>
              </div>
              <div onClick={() => handleTypeSelect('non-educated')} className="p-10 rounded-[2.5rem] border-2 border-slate-100 hover:border-secondary-500 hover:bg-secondary-50/30 cursor-pointer transition-all group">
                <div className="w-16 h-16 bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Hammer size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3">Experienced Pro</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Perfect if you have years of successful real-world projects and satisfied clients, but no formal papers.</p>
                <div className="mt-8 flex items-center text-secondary-600 font-bold">Get Verified <ChevronRight size={20} /></div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 font-bold flex items-center transition-colors">
                <ArrowRight className="rotate-180 mr-2" size={18} /> Back to selection
              </button>
              <div className="px-4 py-1 bg-slate-100 rounded-full text-xs font-black text-slate-500 tracking-widest uppercase italic">Step 01/02</div>
            </div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2 font-heading">Professional Profile</h2>
              <p className="text-slate-500 font-medium">Basic information to set up your work presence</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">What service do you offer?</label>
                <select required className="input-field" value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}>
                  <option value="">Select a service category</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="cleaning">House Cleaning</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="ac_repair">AC Repair</option>
                  <option value="gardening">Gardening</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="tel" required placeholder="+91 99999 99999" className="input-field pl-12"
                    value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Years of Experience</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="number" required min="0" placeholder="Ex: 5" className="input-field pl-12"
                    value={formData.experienceYears} onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="md:col-span-2 mt-4 w-full btn-primary h-14 text-lg font-black shadow-lg shadow-primary-100">
                Next: Upload Documents
              </button>
            </form>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-600 font-bold flex items-center transition-colors">
                <ArrowRight className="rotate-180 mr-2" size={18} /> Back
              </button>
              <div className="px-4 py-1 bg-slate-100 rounded-full text-xs font-black text-slate-500 tracking-widest uppercase italic">Step 02/02</div>
            </div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2 font-heading">
                {type === 'educated' ? 'Upload Certificates' : 'Show Your Work'}
              </h2>
              <p className="text-slate-500 font-medium">
                {type === 'educated' ? 'Provide your degrees or professional certifications' : 'Upload photos or videos of your best projects'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">{error}</div>
              )}

              {type === 'educated' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Institution Name</label>
                      <input type="text" required placeholder="Ex: IIT Madras" className="input-field"
                        value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Degree / Certificate Name</label>
                      <input type="text" required placeholder="Ex: Diploma in Electrical" className="input-field"
                        value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Upload Certificate (PDF / Image)</label>
                    <input ref={certRef} type="file" accept=".pdf,image/*" className="hidden"
                      onChange={(e) => setCertificate(e.target.files[0] || null)} />
                    <div
                      onClick={() => certRef.current.click()}
                      className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-primary-400 transition-colors cursor-pointer"
                    >
                      <FileText size={32} className="text-primary-500 mb-2" />
                      {certificate ? (
                        <span className="text-sm font-bold text-primary-600">{certificate.name}</span>
                      ) : (
                        <>
                          <span className="text-sm font-bold text-slate-500">Click to choose file</span>
                          <span className="text-xs text-slate-400 mt-1">PDF or Image up to 10MB</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Describe Your Work Experience</label>
                    <textarea required placeholder="Briefly describe your past projects, companies worked at..." className="input-field min-h-[100px] py-4"
                      value={formData.experienceDesc} onChange={(e) => setFormData({ ...formData, experienceDesc: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Upload Work Samples (Photos / Videos)</label>
                    <input ref={samplesRef} type="file" accept="image/*,video/*" multiple className="hidden"
                      onChange={(e) => setWorkSamples(prev => [...prev, ...Array.from(e.target.files)])} />
                    <div
                      onClick={() => samplesRef.current.click()}
                      className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-secondary-400 transition-colors cursor-pointer"
                    >
                      <ImageIcon size={32} className="text-secondary-500 mb-2" />
                      <span className="text-sm font-bold text-slate-500">Click to choose files</span>
                      <span className="text-xs text-slate-400 mt-1">Images or Videos, up to 5 files</span>
                    </div>
                    {workSamples.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {workSamples.map((f, i) => (
                          <div key={i} className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600">
                            {f.name.length > 20 ? f.name.slice(0, 20) + '…' : f.name}
                            <button type="button" onClick={() => removeWorkSample(i)} className="ml-1 text-slate-400 hover:text-red-500">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full btn-primary h-16 text-xl font-black mt-4 flex items-center justify-center shadow-2xl shadow-primary-100">
                {loading ? <Loader /> : 'Submit Application'}
              </button>
            </form>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      {step < 3 && (
        <div className="mt-16 flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-3 rounded-full transition-all duration-500 ${s === step ? 'w-20 bg-primary-600' : 'w-4 bg-slate-200'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Verification;
