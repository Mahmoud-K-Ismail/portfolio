'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, ExternalLink, Code2 } from 'lucide-react';
import { GraphNode } from '@/lib/graphData';

interface DetailPanelProps {
  node: GraphNode | null;
  onClose: () => void;
}

export default function DetailPanel({ node, onClose }: DetailPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!node || !node.details) return null;

  return (
    <AnimatePresence>
      {node && node.details && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       w-[94vw] max-w-3xl rounded-2xl overflow-hidden"
            style={{
              background: '#0d0d12',
              border: `1px solid ${node.color}25`,
              boxShadow: `0 0 60px -15px ${node.color}30`,
            }}
          >
            {/* Color accent top */}
            <div className="h-1.5 w-full" style={{ background: node.color }} />
            
            {/* Header */}
            <div className="p-8 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                    <span 
                      className="text-sm font-mono uppercase tracking-wider"
                      style={{ color: node.color }}
                    >
                      {node.type}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {node.details.title}
                  </h2>
                  
                  {/* Subtitle */}
                  {node.details.subtitle && (
                    <p className="text-white/60 text-xl">
                      {node.details.subtitle}
                    </p>
                  )}
                </div>
                
                {/* Close */}
                <button
                  onClick={onClose}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={22} className="text-white/50" />
                </button>
              </div>
              
              {/* Meta */}
              {(node.details.period || node.details.location) && (
                <div className="flex flex-wrap gap-6 mt-5 text-base">
                  {node.details.period && (
                    <div className="flex items-center gap-2.5 text-white/50">
                      <Calendar size={18} />
                      <span className="font-mono">{node.details.period}</span>
                    </div>
                  )}
                  {node.details.location && (
                    <div className="flex items-center gap-2.5 text-white/50">
                      <MapPin size={18} />
                      <span className="font-mono">{node.details.location}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Divider */}
            <div className="mx-8 h-px bg-white/10" />
            
            {/* Content - scrollable */}
            <div className="p-8 pt-6 max-h-[50vh] overflow-y-auto">
              {/* Bullets */}
              <div className="space-y-5 mb-8">
                {node.details.bullets.map((bullet, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex gap-4 items-start"
                  >
                    <div 
                      className="w-[6px] h-[6px] rounded-full flex-shrink-0 mt-[0.5em]"
                      style={{ backgroundColor: node.color }}
                    />
                    <p className="text-white/75 text-[17px] leading-[1.7] flex-1">
                      {bullet}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              {/* Technologies */}
              {node.details.technologies && node.details.technologies.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 size={16} className="text-white/40" />
                    <span className="text-sm font-mono uppercase tracking-wider text-white/40">
                      Tech Stack
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {node.details.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 rounded-lg text-sm font-mono
                                 bg-white/5 text-white/60 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Links */}
              {node.details.links && node.details.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {node.details.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-base font-medium
                               transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        backgroundColor: `${node.color}15`,
                        color: node.color,
                        border: `1px solid ${node.color}30`,
                      }}
                    >
                      <ExternalLink size={18} />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5">
              <p className="text-center text-white/30 text-sm font-mono">
                Press <kbd className="px-2 py-1 mx-1 rounded bg-white/10 text-white/50">ESC</kbd> to close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
