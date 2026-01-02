"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Minimize2 } from 'lucide-react';
import { chatWithAI } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Jeremy's AI Assistant. Ask me anything about his experience, skills, or projects!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithAI(userMsg);
      // Backend returns { message: "..." } for chat type
      const botMsg = response?.message || "Sorry, I encountered an error connecting to the AI.";
      setMessages(prev => [...prev, { role: 'assistant', content: botMsg }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Jeremy&apos;s Assistant</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0
                  ${msg.role === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}
                `}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`
                  p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'}
                `}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                 </div>
                 <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about my experience..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600"
                disabled={loading}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute right-0 top-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
        </button>
      )}
    </div>
  );
}
