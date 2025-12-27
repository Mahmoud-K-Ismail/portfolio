'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 150);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="fixed top-6 left-6 z-30"
    >
      <div 
        className={`
          relative flex items-center gap-2
          bg-white/5 backdrop-blur-xl
          border rounded-full
          transition-all duration-300
          ${isFocused 
            ? 'border-white/30 shadow-lg shadow-white/5 w-72' 
            : 'border-white/10 w-56 hover:border-white/20'
          }
        `}
      >
        <Search 
          size={16} 
          className={`
            ml-4 flex-shrink-0 transition-colors duration-200
            ${isFocused ? 'text-white/70' : 'text-white/40'}
          `}
        />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search nodes..."
          className="
            w-full py-2.5 pr-4 bg-transparent
            text-white/90 text-sm font-mono
            placeholder:text-white/30
            focus:outline-none
          "
        />
        <AnimatePresence>
          {localValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="
                absolute right-3 p-1 rounded-full
                bg-white/10 hover:bg-white/20
                transition-colors
              "
            >
              <X size={12} className="text-white/70" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Hint text */}
      <AnimatePresence>
        {isFocused && !localValue && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 ml-4 text-xs text-white/30 font-mono"
          >
            Try "Python", "LLMs", or "Research"
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
