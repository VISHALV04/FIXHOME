import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ServiceCard = ({ service, onClick, className }) => {
  const Icon = LucideIcons[service.icon] || LucideIcons.Tool;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden flex flex-col p-6 h-full",
        "bg-white rounded-2xl border border-slate-200 shadow-premium",
        "hover:border-primary-200 hover:shadow-xl transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-100/30 rounded-full blur-2xl group-hover:bg-primary-200/40 transition-colors" />
      
      {/* Icon */}
      <div className="relative mb-4 w-14 h-14 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
        <Icon size={28} strokeWidth={2} />
      </div>
      
      {/* Content */}
      <div className="mt-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-700">
          {service.name}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <span className="text-primary-600 font-bold">{service.price}</span>
          <span className="text-xs font-semibold text-slate-400 group-hover:text-primary-500 flex items-center gap-1">
            Book Now <LucideIcons.ChevronRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
