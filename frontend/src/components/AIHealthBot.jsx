import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import api from '../api';

export default function AIHealthBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const initialMsg = token
            ? "Hello! I am your Multi-Agent AI Assistant. I have your medical records ready. How can I help you today?"
            : "Welcome to Aegis Health! I'm an AI Preview of our medical ecosystem. Feel free to ask about symptoms, risks, or mental health, or Sign In for full vaulted access.";
        setMessages([{ id: 1, type: 'bot', agent: 'Aegis Assistant', content: initialMsg }]);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);


    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = { id: Date.now(), type: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await api.post('/chat/route', { message: input });
            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                agent: res.data.agent_assigned || 'AI Health Bot',
                content: res.data.response
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            const errMsg = { id: Date.now() + 2, type: 'bot', agent: 'System', content: 'Oops! I encountered an error. Please try again later.' };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 rounded-2xl bg-teal-500 text-white shadow-2xl shadow-teal-500/30 flex items-center justify-center hover:bg-teal-600 transition-all group"
                    >
                        <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? 'w-72 h-14' : 'w-[400px] h-[600px]'}`}
                    >
                        {/* Header */}
                        <div className="p-4 bg-navy-500 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-400/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight">AI Health Vault Agent</h3>
                                    {!isMinimized && <p className="text-[10px] text-teal-400 uppercase tracking-widest font-black">Active Context Bus</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Chat Area */}
                                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${msg.type === 'user' ? 'bg-navy-500 text-white border-navy-500' : 'bg-white text-teal-600 border-gray-200 shadow-sm'}`}>
                                                    {msg.type === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                                </div>
                                                <div className={`p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-teal-500 text-white rounded-tr-none' : 'bg-white text-navy-500 border border-gray-100 shadow-sm rounded-tl-none'}`}>
                                                    {msg.agent && <div className="text-[9px] uppercase font-bold opacity-60 mb-1">{msg.agent}</div>}
                                                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
                                                <span className="text-xs text-gray-500 italic">Agent routing...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Input */}
                                <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask about symptoms, reports, or wellness..."
                                        className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all border border-transparent focus:border-teal-500/30"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isTyping}
                                        className="w-10 h-10 rounded-xl bg-navy-500 text-white flex items-center justify-center hover:bg-teal-500 transition-all disabled:opacity-50 disabled:hover:bg-navy-500"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
