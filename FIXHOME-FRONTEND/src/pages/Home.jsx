import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ShieldCheck, Zap, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { mockApi } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import Loader from '../components/Loader';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const data = await mockApi.getServices();
      setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary-100/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-secondary-100/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-black mb-6 border border-primary-100 shadow-sm">
              <Star size={14} className="mr-2 fill-primary-600" /> Trusted by 10,000+ Households
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 font-heading tracking-tight">
              Expert Help for Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Perfect Home</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-12 font-medium leading-relaxed">
              Connect with verified professionals for electrical, plumbing, and cleaning services. Trust, quality, and reliability guaranteed.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto p-2 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-2"
          >
            <div className="w-full flex items-center px-4 py-3 gap-3">
              <Search className="text-slate-400" size={24} />
              <input
                type="text"
                placeholder="What service do you need today?"
                className="w-full bg-transparent outline-none text-lg font-medium text-slate-700 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-100" />
            <div className="w-full md:w-auto flex items-center px-4 py-3 gap-3">
              <MapPin className="text-slate-400" size={24} />
              <span className="text-lg font-bold text-slate-700 whitespace-nowrap">Your Location</span>
            </div>
            <button className="w-full md:w-auto btn-primary h-14 px-10 text-lg whitespace-nowrap">
              Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-3 font-heading">Popular Services</h2>
              <p className="text-slate-500 font-medium text-lg">Hand-picked professionals for every task</p>
            </div>
            <button className="flex items-center font-bold text-primary-600 hover:text-primary-700 group transition-colors">
              Explore All <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works / Trust Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 font-heading">Why Choose HomeAssist?</h2>
            <p className="text-slate-500 font-medium text-lg">We prioritize your safety and satisfaction through rigorous verification</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: ShieldCheck, 
                title: "Strict Verification", 
                desc: "Every provider undergoes certificate or work-proof verification by our expert team.",
                color: "bg-blue-500"
              },
              { 
                icon: UserCheck, 
                title: "Expert Professionals", 
                desc: "Connect with the top-rated specialists in your area with proven track records.",
                color: "bg-indigo-500"
              },
              { 
                icon: CheckCircle2, 
                title: "Satisfaction Guarantee", 
                desc: "We ensure high-quality service. Not happy? We'll make it right or refund your money.",
                color: "bg-emerald-500"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200/20`}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
