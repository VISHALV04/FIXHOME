import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50" 
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Main outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full"
        />
        
        {/* Inner pulsing circle */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-6 h-6 bg-primary-500 rounded-full"
        />
        
        {/* Subtle glow */}
        <div className="absolute inset-0 w-16 h-16 bg-primary-500/10 rounded-full blur-xl animate-pulse" />
      </div>
    </div>
  );
};

export default Loader;
