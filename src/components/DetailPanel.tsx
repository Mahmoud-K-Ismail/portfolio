'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Layers, ArrowRight, ExternalLink } from 'lucide-react';
import { GraphNode } from '@/lib/graphData';

interface DetailPanelProps {
  node: GraphNode | null;
  onClose: () => void;
}

export default function DetailPanel({ node, onClose }: DetailPanelProps) {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {node && node.details && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[500px] z-50 
                       bg-[#0c0c0c] border-l border-white/10
                       shadow-2xl shadow-black/80 overflow-hidden"
          >
            {/* Accent line */}
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(90deg, ${node.color}, ${node.color}50, transparent)` }}
            />
            
            {/* Glow orb */}
            <div 
              className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{ background: node.color }}
            />
            
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="p-8 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Badge */}
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider mb-4"
                      style={{ backgroundColor: `${node.color}20`, color: node.color }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }} />
                      {node.type}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {node.details.title}
                    </h2>
                    
                    {node.details.subtitle && (
                      <p className="text-xl text-white/50 font-light">
                        {node.details.subtitle}
                      </p>
                    )}
                  </motion.div>
                  
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 transition-colors flex-shrink-0"
                  >
                    <X size={20} className="text-white/60" />
                  </motion.button>
                </div>
                
                {/* Meta info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-wrap gap-4 mt-6"
                >
                  {node.details.period && (
                    <div className="flex items-center gap-2 text-white/40">
                      <Calendar size={14} />
                      <span className="text-sm font-mono">{node.details.period}</span>
                    </div>
                  )}
                  {node.details.location && (
                    <div className="flex items-center gap-2 text-white/40">
                      <MapPin size={14} />
                      <span className="text-sm font-mono">{node.details.location}</span>
                    </div>
                  )}
                </motion.div>
              </div>
              
              {/* Divider */}
              <div className="mx-8 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
              
              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 pt-6">
                {/* Bullets */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 mb-8"
                >
                  {node.details.bullets.map((bullet, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                      className="flex gap-3 group"
                    >
                      <ArrowRight 
                        size={14} 
                        className="mt-1.5 flex-shrink-0 opacity-40 group-hover:opacity-70 transition-opacity"
                        style={{ color: node.color }}
                      />
                      <p className="text-white/70 leading-relaxed text-[15px]">
                        {bullet}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Technologies */}
                {node.details.technologies && node.details.technologies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Layers size={14} className="text-white/30" />
                      <span className="text-xs font-mono uppercase tracking-widest text-white/30">
                        Technologies
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {node.details.technologies.map((tech, i) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.45 + i * 0.02 }}
                          className="px-3 py-1.5 rounded-lg text-sm font-mono
                                   bg-white/[0.03] text-white/50 border border-white/5
                                   hover:bg-white/[0.06] hover:text-white/70 transition-all"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Links */}
                {node.details.links && node.details.links.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-3"
                  >
                    {node.details.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                                 bg-white/5 border border-white/10
                                 text-white/60 hover:text-white hover:bg-white/10
                                 transition-all group"
                      >
                        <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-medium">{link.label}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-white/5">
                <p className="text-center text-white/20 text-xs font-mono">
                  Press ESC or click outside to close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
