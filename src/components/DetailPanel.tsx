'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Code2, ExternalLink } from 'lucide-react';
import { GraphNode } from '@/lib/graphData';

interface DetailPanelProps {
  node: GraphNode | null;
  onClose: () => void;
}

export default function DetailPanel({ node, onClose }: DetailPanelProps) {
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              mass: 0.8
            }}
            className="fixed right-0 top-0 h-full w-full md:w-[420px] z-50 
                       bg-gradient-to-br from-white/10 to-white/5
                       backdrop-blur-xl border-l border-white/10
                       shadow-2xl shadow-black/50
                       overflow-hidden"
          >
            {/* Decorative gradient orb */}
            <div 
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{ 
                background: `radial-gradient(circle, ${node.color}40, transparent 70%)` 
              }}
            />
            
            {/* Content container */}
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-white/10">
                <div className="flex-1 pr-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div 
                      className="inline-block px-2 py-0.5 rounded text-xs font-mono mb-2 uppercase tracking-wider"
                      style={{ 
                        backgroundColor: `${node.color}20`,
                        color: node.color,
                        border: `1px solid ${node.color}40`
                      }}
                    >
                      {node.type}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {node.details.title}
                    </h2>
                    {node.details.subtitle && (
                      <p className="text-white/60 font-medium">
                        {node.details.subtitle}
                      </p>
                    )}
                  </motion.div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 
                           border border-white/10 transition-colors"
                >
                  <X size={20} className="text-white/70" />
                </motion.button>
              </div>
              
              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Period */}
                {node.details.period && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-2 text-white/50"
                  >
                    <Calendar size={16} />
                    <span className="font-mono text-sm">{node.details.period}</span>
                  </motion.div>
                )}
                
                {/* Bullets */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  {node.details.bullets.map((bullet, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + index * 0.05 }}
                      className="flex gap-3"
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: node.color }}
                      />
                      <p className="text-white/80 leading-relaxed">
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
                    className="pt-4 border-t border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-3 text-white/50">
                      <Code2 size={16} />
                      <span className="text-xs font-mono uppercase tracking-wider">
                        Technologies
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {node.details.technologies.map((tech, index) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.45 + index * 0.03 }}
                          className="px-3 py-1.5 rounded-full text-sm font-mono
                                   bg-white/5 text-white/70 border border-white/10
                                   hover:bg-white/10 hover:text-white transition-colors"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-white/10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-white/30 text-xs font-mono"
                >
                  Click anywhere on the graph to explore more
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
