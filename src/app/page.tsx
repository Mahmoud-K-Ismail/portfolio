'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GraphContainer from '@/components/GraphContainer';
import DetailPanel from '@/components/DetailPanel';
import SearchBar from '@/components/SearchBar';
import RAGChat from '@/components/RAGChat';
import { GraphNode } from '@/lib/graphData';
import { Github, Linkedin, Mail, MousePointer2, Expand, MessageCircle } from 'lucide-react';

export default function Home() {
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);
  const [nodePosition, setNodePosition] = useState<{ x: number; y: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoading(false), 1800);
    const hintTimer = setTimeout(() => setShowHint(true), 2500);
    const hideHintTimer = setTimeout(() => setShowHint(false), 12000);
    
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(hintTimer);
      clearTimeout(hideHintTimer);
    };
  }, []);

  const handleNodeClick = useCallback((node: GraphNode, position?: { x: number; y: number } | null) => {
    setActiveNode(node);
    setNodePosition(position || null);
    setShowHint(false);
  }, []);

  const handleClosePanel = useCallback(() => {
    setActiveNode(null);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050505]">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/10 via-transparent to-purple-950/10" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-3xl" />
      </div>
      
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              {/* Rotating rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-12 border border-white/5 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-20 border border-white/[0.03] rounded-full"
              />
              
              <div className="text-center">
                <motion.div
                  animate={{ 
                    boxShadow: ['0 0 20px rgba(255,255,255,0.1)', '0 0 40px rgba(255,255,255,0.2)', '0 0 20px rgba(255,255,255,0.1)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 mx-auto mb-6 bg-white rounded-full"
                />
                <h1 className="text-xl font-medium text-white mb-1">Mahmoud Kassem</h1>
                <p className="text-white/30 font-mono text-xs">Initializing...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Bar */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <SearchBar value={searchTerm} onChange={handleSearchChange} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Graph */}
      <div className="absolute inset-0">
        <GraphContainer onNodeClick={handleNodeClick} searchTerm={searchTerm} />
      </div>
      
      {/* Hint */}
      <AnimatePresence>
        {showHint && !activeNode && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="flex items-center gap-5 px-5 py-3 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Expand size={14} className="text-blue-400" />
                <span>Click categories to expand</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <MousePointer2 size={14} className="text-purple-400" />
                <span>Click items for details</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Name */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-8 left-8 z-20"
          >
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Mahmoud
              <span className="block text-white/30">Kassem</span>
            </h1>
            <div className="mt-2 flex items-center gap-3 text-white/25 font-mono text-xs">
              <span>CS & Applied Math</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>NYU '26</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Socials and Chat */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="fixed bottom-8 right-8 z-20 flex flex-col items-end gap-3"
          >
            {/* Chat button with label - side by side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3"
            >
              {/* Chat bubble - modern clean design */}
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => setIsChatOpen(true)}
                className="relative group/bubble"
              >
                <div className="relative px-8 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md
                           text-white text-sm font-medium
                           border border-white/20
                           whitespace-nowrap min-w-[200px] w-auto
                           group-hover/bubble:bg-white/15 group-hover/bubble:border-white/30 transition-all
                           cursor-pointer shadow-lg"
                >
                  Ask me about Mahmoud
                </div>
                {/* Clean rounded tail */}
                <div 
                  className="absolute right-0 top-1/2 translate-x-[calc(100%-1px)] -translate-y-1/2 z-10 w-0 h-0"
                  style={{
                    borderTop: '7px solid transparent',
                    borderBottom: '7px solid transparent',
                    borderLeft: '10px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
              </motion.button>
              
              {/* Chat icon - bigger and cleaner */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsChatOpen(true)}
                className="relative p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500
                           text-white shadow-xl shadow-purple-500/60
                           hover:shadow-2xl hover:shadow-purple-500/80 transition-all
                           border-2 border-white/20"
                style={{
                  boxShadow: '0 0 25px rgba(168, 85, 247, 0.5), 0 0 50px rgba(59, 130, 246, 0.3)',
                }}
              >
                <MessageCircle size={24} strokeWidth={2.5} />
              </motion.button>
            </motion.div>
            
            {/* Social links */}
            <div className="flex gap-2">
              <SocialLink 
                href="https://github.com/Mahmoud-K-Ismail" 
                icon={<Github size={18} />} 
                label="GitHub" 
              />
              <SocialLink 
                href="https://www.linkedin.com/in/mahmoud-Kassem-b02338263/" 
                icon={<Linkedin size={18} />} 
                label="LinkedIn" 
              />
              <SocialLink 
                href="mailto:mahmoud.kassem@nyu.edu" 
                icon={<Mail size={18} />} 
                label="Email" 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Legend */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="fixed top-8 right-8 z-20 hidden md:block"
          >
            <div className="flex flex-col gap-2 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
              <LegendItem color="#3b82f6" label="Experience" />
              <LegendItem color="#8b5cf6" label="Projects" />
              <LegendItem color="#ec4899" label="Research" />
              <LegendItem color="#f59e0b" label="Education" />
              <LegendItem color="#10b981" label="Skills" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Detail Panel */}
      <DetailPanel node={activeNode} position={nodePosition} onClose={handleClosePanel} />
      
      {/* RAG Chat */}
      <RAGChat isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </main>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  // Different colors for each social link to stand out
  const getColorClasses = (label: string) => {
    switch (label.toLowerCase()) {
      case 'github':
        return 'bg-gray-800/80 border-gray-600/50 text-gray-200 hover:bg-gray-700/90 hover:border-gray-500 hover:text-white shadow-lg shadow-gray-900/50';
      case 'linkedin':
        return 'bg-blue-600/80 border-blue-500/50 text-blue-100 hover:bg-blue-500/90 hover:border-blue-400 hover:text-white shadow-lg shadow-blue-900/50';
      case 'email':
        return 'bg-red-600/80 border-red-500/50 text-red-100 hover:bg-red-500/90 hover:border-red-400 hover:text-white shadow-lg shadow-red-900/50';
      default:
        return 'bg-white/[0.15] border-white/20 text-white/70 hover:text-white hover:bg-white/[0.25] hover:border-white/30';
    }
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`p-3 rounded-xl border-2 transition-all backdrop-blur-sm ${getColorClasses(label)}`}
      aria-label={label}
    >
      {icon}
    </motion.a>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}50` }} />
      <span className="text-white/30 text-xs font-mono">{label}</span>
    </div>
  );
}
