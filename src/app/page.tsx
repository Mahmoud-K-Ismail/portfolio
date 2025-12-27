'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import GraphContainer from '@/components/GraphContainer';
import DetailPanel from '@/components/DetailPanel';
import SearchBar from '@/components/SearchBar';
import { GraphNode } from '@/lib/graphData';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Home() {
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNodeClick = useCallback((node: GraphNode) => {
    setActiveNode(node);
  }, []);

  const handleClosePanel = useCallback(() => {
    setActiveNode(null);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050505]">
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 animated-gradient opacity-50" />
      
      {/* Noise texture overlay */}
      <div className="noise-overlay" />
      
      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={handleSearchChange} />
      
      {/* Graph Container */}
      <div className="absolute inset-0">
        <GraphContainer 
          onNodeClick={handleNodeClick}
          searchTerm={searchTerm}
        />
      </div>
      
      {/* Title overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed bottom-6 left-6 z-20 pointer-events-none"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white/90 mb-1">
          Mahmoud Kassem
        </h1>
        <p className="text-white/50 font-mono text-sm">
          CS & Applied Mathematics • AI/NLP
        </p>
      </motion.div>
      
      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="fixed bottom-6 right-6 z-20 flex gap-3"
      >
        <SocialLink href="https://github.com" icon={<Github size={18} />} label="GitHub" />
        <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} label="LinkedIn" />
        <SocialLink href="mailto:hello@example.com" icon={<Mail size={18} />} label="Email" />
      </motion.div>
      
      {/* Instructions hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 
                   text-white/30 text-xs font-mono
                   bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full
                   border border-white/10"
      >
        Click on nodes to explore • Drag to pan • Scroll to zoom
      </motion.div>
      
      {/* Detail Panel */}
      <DetailPanel node={activeNode} onClose={handleClosePanel} />
    </main>
  );
}

function SocialLink({ 
  href, 
  icon, 
  label 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="
        p-3 rounded-full
        bg-white/5 backdrop-blur-sm
        border border-white/10
        text-white/50 hover:text-white
        hover:bg-white/10 hover:border-white/20
        transition-colors
      "
      aria-label={label}
    >
      {icon}
    </motion.a>
  );
}
