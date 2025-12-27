'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const suggestions = ['Python', 'LLMs', 'Research', 'NLP'];

  return (
    <div className="fixed top-8 left-24 sm:left-24 md:left-28 z-30">
      <motion.div
        initial={false}
        animate={{
          width: isFocused ? 320 : 240,
        }}
        className={`
          relative flex items-center
          bg-white/[0.03] backdrop-blur-xl
          border rounded-2xl
          transition-all duration-300
          ${isFocused 
            ? 'border-white/20 shadow-lg shadow-black/20' 
            : 'border-white/5 hover:border-white/10'
          }
        `}
      >
        <Search 
          size={18} 
          className={`
            ml-4 flex-shrink-0 transition-colors duration-200
            ${isFocused ? 'text-white/60' : 'text-white/30'}
          `}
        />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Search skills, projects..."
          className="
            w-full py-3.5 px-3 bg-transparent
            text-white text-sm
            placeholder:text-white/25
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
              className="mr-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={14} className="text-white/50" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Quick suggestions */}
      <AnimatePresence>
        {isFocused && !localValue && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-3 flex items-center gap-2"
          >
            <Sparkles size={12} className="text-white/20" />
            <div className="flex gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setLocalValue(s)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono
                           bg-white/[0.02] text-white/30 
                           border border-white/5
                           hover:bg-white/[0.05] hover:text-white/50
                           transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
