'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, ExternalLink, Code2 } from 'lucide-react';
import { GraphNode } from '@/lib/graphData';

interface DetailPanelProps {
  node: GraphNode | null;
  position?: { x: number; y: number } | null;
  onClose: () => void;
}

export default function DetailPanel({ node, position, onClose }: DetailPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!node || !node.details) return null;

  // Calculate initial position (from node or center)
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
  const initialX = position?.x ?? centerX;
  const initialY = position?.y ?? centerY;

  return (
    <AnimatePresence>
      {node && node.details && (
        <>
          {/* Backdrop with radial gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
            style={{
              background: `radial-gradient(circle at ${initialX}px ${initialY}px, ${node.color}15 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.95) 100%)`,
              backdropFilter: 'blur(8px)',
            }}
            onClick={onClose}
          />
          
          {/* Circular Container with zoom-in animation */}
          <motion.div
            initial={{
              scale: 0,
              x: initialX - centerX,
              y: initialY - centerY,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              x: 0,
              y: 0,
              opacity: 1,
            }}
            exit={{
              scale: 0,
              x: initialX - centerX,
              y: initialY - centerY,
              opacity: 0,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              mass: 0.8,
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       w-[94vw] max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden"
            style={{
              background: `radial-gradient(circle at center, ${node.color}08 0%, #0a0a0f 40%, #050505 100%)`,
              border: `2px solid ${node.color}40`,
              boxShadow: `
                0 0 0 1px ${node.color}20,
                0 0 80px ${node.color}20,
                inset 0 0 60px ${node.color}05
              `,
              willChange: 'transform, opacity',
            }}
          >
            {/* Inner glow ring */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, transparent 40%, ${node.color}08 100%)`,
                border: `1px solid ${node.color}15`,
              }}
            />
            
            {/* Content Container with proper padding */}
            <div className="relative w-full py-12 px-12 md:py-14 md:px-16 flex flex-col overflow-hidden">
              {/* Close button - top right - More noticeable */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 md:top-8 md:right-8 z-10 p-3 rounded-full 
                         transition-all duration-200 hover:scale-125
                         backdrop-blur-sm"
                style={{
                  background: `rgba(255, 255, 255, 0.15)`,
                  border: `2px solid ${node.color}70`,
                  boxShadow: `0 0 25px ${node.color}50, inset 0 0 15px ${node.color}15`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(255, 255, 255, 0.25)`;
                  e.currentTarget.style.boxShadow = `0 0 40px ${node.color}70, inset 0 0 20px ${node.color}25`;
                  e.currentTarget.style.borderColor = `${node.color}90`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `rgba(255, 255, 255, 0.15)`;
                  e.currentTarget.style.boxShadow = `0 0 25px ${node.color}50, inset 0 0 15px ${node.color}15`;
                  e.currentTarget.style.borderColor = `${node.color}70`;
                }}
              >
                <X size={22} className="text-white" style={{ color: node.color }} strokeWidth={2.5} />
              </button>

              {/* Scrollable content */}
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                
                {/* ═══════════ HEADER SECTION ═══════════ */}
                <div className="mb-10">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: node.color }}
                    />
                    <span 
                      className="text-xs font-mono uppercase tracking-widest"
                      style={{ color: node.color }}
                    >
                      {node.type}
                    </span>
                  </motion.div>
                  
                  {/* Logo + Title Row */}
                  <div className="flex items-center gap-5 mb-5">
                    {node.details.image && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        className="flex-shrink-0"
                      >
                        <div 
                          className="w-16 h-16 md:w-20 md:h-20 rounded-xl p-2.5 flex items-center justify-center bg-white"
                          style={{
                            border: `2px solid ${node.color}30`,
                            boxShadow: `0 4px 24px ${node.color}25`,
                          }}
                        >
                          <img 
                            src={node.details.image} 
                            alt={node.details.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                    <div className="flex-1 min-w-0">
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight"
                      >
                        {node.details.title}
                      </motion.h2>
                      
                      {node.details.subtitle && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="text-white/60 text-sm md:text-base"
                        >
                          {node.details.subtitle}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  
                  {/* Meta info */}
                  {(node.details.period || node.details.location) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-4 text-sm"
                    >
                      {node.details.period && (
                        <div className="flex items-center gap-2 text-white/50">
                          <Calendar size={14} />
                          <span className="font-mono">{node.details.period}</span>
                        </div>
                      )}
                      {node.details.location && (
                        <div className="flex items-center gap-2 text-white/50">
                          <MapPin size={14} />
                          <span className="font-mono">{node.details.location}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
                
                {/* ═══════════ DIVIDER ═══════════ */}
                <div 
                  className="h-px mb-14"
                  style={{ background: `linear-gradient(90deg, transparent, ${node.color}40, transparent)` }}
                />
                
                {/* ═══════════ DESCRIPTION SECTION ═══════════ */}
                <div className="space-y-6 mb-16 pt-2 px-6 md:px-8">
                  {node.details.bullets.map((bullet, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.03, duration: 0.3 }}
                      className="flex gap-4"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: node.color,
                          marginTop: '0.6em',
                          alignSelf: 'flex-start'
                        }}
                      />
                      <p className="text-white/70 text-sm md:text-base leading-relaxed flex-1">
                        {bullet}
                      </p>
                    </motion.div>
                  ))}
                </div>
                
                {/* ═══════════ TECH STACK SECTION ═══════════ */}
                {node.details.technologies && node.details.technologies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-12 pt-4 px-6 md:px-8"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <Code2 size={16} style={{ color: node.color }} />
                      <span 
                        className="text-sm font-mono uppercase tracking-wider font-semibold"
                        style={{ color: node.color }}
                      >
                        Tech Stack
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {node.details.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-6 py-3 rounded-lg text-xs font-mono font-medium
                                   transition-all duration-200 cursor-default
                                   backdrop-blur-sm"
                          style={{
                            background: `${node.color}20`,
                            color: node.color,
                            border: `1.5px solid ${node.color}40`,
                            boxShadow: `0 2px 8px ${node.color}20`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${node.color}30`;
                            e.currentTarget.style.boxShadow = `0 4px 12px ${node.color}40`;
                            e.currentTarget.style.borderColor = `${node.color}60`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = `${node.color}20`;
                            e.currentTarget.style.boxShadow = `0 2px 8px ${node.color}20`;
                            e.currentTarget.style.borderColor = `${node.color}40`;
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* ═══════════ LINKS SECTION ═══════════ */}
                {node.details.links && node.details.links.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="flex flex-wrap gap-4 pb-6 px-6 md:px-8"
                  >
                    {node.details.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-lg text-sm font-medium
                                 transition-all duration-200 whitespace-nowrap
                                 backdrop-blur-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#ffffff',
                          border: '1.5px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                        }}
                      >
                        <ExternalLink size={14} className="flex-shrink-0" />
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
