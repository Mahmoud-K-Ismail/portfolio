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
                       w-[88vw] max-w-2xl min-h-[400px] max-h-[85vh] rounded-2xl overflow-hidden"
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
            <div className="relative w-full h-full pt-8 pb-0 px-8 md:pt-10 md:pb-0 md:px-10 flex flex-col overflow-hidden">
              {/* Close button - top right */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-10 p-2.5 rounded-full 
                         transition-all duration-200 hover:scale-110
                         backdrop-blur-sm"
                style={{
                  background: `rgba(255, 255, 255, 0.1)`,
                  border: `2px solid ${node.color}50`,
                  boxShadow: `0 0 20px ${node.color}30, inset 0 0 10px ${node.color}10`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(255, 255, 255, 0.15)`;
                  e.currentTarget.style.boxShadow = `0 0 30px ${node.color}50, inset 0 0 15px ${node.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `rgba(255, 255, 255, 0.1)`;
                  e.currentTarget.style.boxShadow = `0 0 20px ${node.color}30, inset 0 0 10px ${node.color}10`;
                }}
              >
                <X size={20} className="text-white" style={{ color: node.color }} />
              </button>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-1 pr-3 custom-scrollbar" style={{ paddingBottom: 0 }}>
                {/* Header */}
                <div className="mb-6">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 mb-3"
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
                  
                  {/* Image and Title */}
                  <div className="flex items-start gap-3 mb-3">
                    {node.details.image && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        className="flex-shrink-0"
                      >
                        <div 
                          className="w-14 h-14 md:w-16 md:h-16 rounded-lg p-2.5 flex items-center justify-center bg-white"
                          style={{
                            border: `1.5px solid ${node.color}30`,
                            boxShadow: `0 4px 20px ${node.color}20`,
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
                        className="text-lg md:text-xl font-bold text-white mb-1 leading-tight"
                      >
                        {node.details.title}
                      </motion.h2>
                      
                      {node.details.subtitle && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="text-white/50 text-sm"
                        >
                          {node.details.subtitle}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  
                  {/* Meta */}
                  {(node.details.period || node.details.location) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-3 text-xs md:text-sm"
                    >
                      {node.details.period && (
                        <div className="flex items-center gap-1.5 text-white/40">
                          <Calendar size={13} />
                          <span className="font-mono">{node.details.period}</span>
                        </div>
                      )}
                      {node.details.location && (
                        <div className="flex items-center gap-1.5 text-white/40">
                          <MapPin size={13} />
                          <span className="font-mono">{node.details.location}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
                
                {/* Divider */}
                <div 
                  className="h-px mb-5"
                  style={{ background: `linear-gradient(90deg, transparent, ${node.color}30, transparent)` }}
                />
                
                {/* Bullets */}
                <div className="space-y-4 mb-5">
                  {node.details.bullets.map((bullet, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.03, duration: 0.3 }}
                      className="flex gap-3"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: node.color,
                          marginTop: '0.5em',
                          alignSelf: 'flex-start'
                        }}
                      />
                      <p className="text-white/70 text-sm leading-normal flex-1 pr-2">
                        {bullet}
                      </p>
                    </motion.div>
                  ))}
                </div>
                
                {/* Technologies */}
                {node.details.technologies && node.details.technologies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Code2 size={16} style={{ color: node.color }} />
                      <span 
                        className="text-sm font-mono uppercase tracking-wider font-semibold"
                        style={{ color: node.color }}
                      >
                        Tech Stack
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {node.details.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-8 py-2 rounded-lg text-xs font-mono font-medium
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
                
                {/* Links */}
                {node.details.links && node.details.links.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="flex flex-wrap gap-2"
                  >
                    {node.details.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-8 py-2 rounded-lg text-xs md:text-sm font-medium
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
                        <ExternalLink size={12} className="flex-shrink-0" />
                        <span className="truncate">{link.label}</span>
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
