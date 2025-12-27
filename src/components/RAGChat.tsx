'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { graphData } from '@/lib/graphData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function RAGChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm an AI assistant that knows about Mahmoud's career. Ask me anything about his experience, projects, research, or skills. For example: 'How is Mahmoud a fit for a Software Engineer role?' or 'Tell me about his AI/ML experience.'",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Build context from graph data
  const getContext = () => {
    let context = 'Mahmoud Kassem - Computer Science & Applied Mathematics student at NYU Abu Dhabi, graduating May 2026. GPA: 3.89/4.0, Major GPA: 3.93/4.0.\n\n';
    
    graphData.nodes.forEach(node => {
      if (node.details) {
        context += `${node.details.title}${node.details.subtitle ? ` - ${node.details.subtitle}` : ''}\n`;
        if (node.details.period) context += `Period: ${node.details.period}\n`;
        if (node.details.location) context += `Location: ${node.details.location}\n`;
        if (node.details.bullets) {
          context += node.details.bullets.join('\n') + '\n';
        }
        if (node.details.technologies) {
          context += `Technologies: ${node.details.technologies.join(', ')}\n`;
        }
        context += '\n';
      }
    });
    
    return context;
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30
                   p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500
                   text-white shadow-lg shadow-purple-500/50
                   hover:shadow-xl hover:shadow-purple-500/60 transition-all"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50
                         w-[95vw] max-w-3xl h-[650px] rounded-2xl overflow-hidden flex flex-col
                         bg-[#0d0d12] border border-white/10 shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-white/[0.02] flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <Bot size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Career Assistant</h3>
                      <p className="text-white/40 text-xs">Ask about Mahmoud's experience</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <X size={18} className="text-white/50" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 min-h-0">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="p-2 rounded-lg bg-purple-500/20 flex-shrink-0 self-start mt-1">
                        <Bot size={18} className="text-purple-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-xl px-5 py-4 overflow-hidden ${
                        msg.role === 'user'
                          ? 'bg-blue-500/20 text-white border border-blue-500/30'
                          : 'bg-white/5 text-white/90 border border-white/10'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-3 last:mb-0 text-white/90">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                              em: ({ children }) => <em className="italic text-white/80">{children}</em>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-2 text-white/90 ml-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-2 text-white/90 ml-1">{children}</ol>,
                              li: ({ children }) => <li className="ml-2 text-white/90 leading-relaxed">{children}</li>,
                              h1: ({ children }) => <h1 className="text-base font-bold mb-3 mt-4 first:mt-0 text-white">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-sm font-semibold mb-2 mt-4 first:mt-0 text-white">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-white">{children}</h3>,
                              code: ({ children }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-white/80">{children}</code>,
                              blockquote: ({ children }) => <blockquote className="border-l-2 border-white/20 pl-3 italic text-white/70 my-3">{children}</blockquote>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{msg.content}</p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0 self-start mt-1">
                        <User size={18} className="text-blue-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Bot size={18} className="text-purple-400" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                      <Loader2 size={18} className="text-white/50 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10 bg-white/[0.02] flex-shrink-0">
                <div className="flex gap-2.5 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about experience, projects, skills..."
                    className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
                             text-white placeholder:text-white/30 focus:outline-none
                             focus:border-purple-500/50 transition-colors text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500
                             text-white disabled:opacity-50 disabled:cursor-not-allowed
                             hover:shadow-lg hover:shadow-purple-500/50 transition-all
                             w-11 h-11 flex items-center justify-center"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

