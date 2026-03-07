import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, HeartPulse, FileText, Cpu, AlertTriangle, PhoneCall, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function HeroSection({ openLoginModal, openWatchDemoModal }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLaunchClick = () => {
        if (isAuthenticated) navigate('/dashboard');
        else openLoginModal();
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient">
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
                <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent-cyan/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-teal-300 text-sm font-medium mb-8"
                        >
                            <Sparkles className="w-4 h-4" />
                            Multi-Agent Autonomous Medical Ecosystem
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight"
                        >
                            Your Health,<br />
                            <span className="gradient-text">
                                Governed by Intelligence.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="mt-6 text-lg sm:text-xl text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            The world's first Multi-Agent Medical System that listens,
                            analyzes, and protects — <span className="text-white/90 font-medium">24/7</span>.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <button
                                onClick={handleLaunchClick}
                                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-lg font-bold shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300 btn-shine"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Launch Health Vault
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <button onClick={openWatchDemoModal} className="group px-8 py-4 rounded-2xl border-2 border-white/20 text-white text-lg font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                                <span className="flex items-center justify-center gap-2">
                                    <Play className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                                    Watch AI Demo
                                </span>
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="mt-14 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0"
                        >
                            {[
                                { value: '5', label: 'AI Agents' },
                                { value: '24/7', label: 'Monitoring' },
                                { value: 'AES-256', label: 'Encrypted' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center lg:text-left">
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]"
                    >
                        <AgentVisualization />
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>
    );
}

function AgentVisualization() {
    const agents = [
        { icon: HeartPulse, label: 'Symptom', color: '#F43F5E', x: '50%', y: '8%', delay: 0 },
        { icon: FileText, label: 'Report', color: '#00D4FF', x: '85%', y: '35%', delay: 0.4 },
        { icon: Cpu, label: 'Prescription', color: '#10B981', x: '75%', y: '75%', delay: 0.8 },
        { icon: AlertTriangle, label: 'Risk', color: '#F59E0B', x: '25%', y: '75%', delay: 1.2 },
        { icon: PhoneCall, label: 'Emergency', color: '#8B5CF6', x: '15%', y: '35%', delay: 1.6 },
    ];

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                    <div className="absolute inset-0 w-20 h-20 -m-2 rounded-full border-2 border-teal-500/30 animate-pulse-ring" />
                    <div className="absolute inset-0 w-20 h-20 -m-2 rounded-full border-2 border-teal-500/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-xl shadow-teal-500/40">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                <defs>
                    <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#008080" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                {agents.map((agent, i) => {
                    const ax = parseFloat(agent.x) / 100 * 400;
                    const ay = parseFloat(agent.y) / 100 * 400;
                    return (
                        <line
                            key={i}
                            x1="200" y1="200"
                            x2={ax} y2={ay}
                            stroke="url(#line-grad)"
                            strokeWidth="1.5"
                            className="agent-line"
                            style={{ animationDelay: `${i * 0.3}s` }}
                        />
                    );
                })}
            </svg>

            {agents.map((agent) => (
                <AgentNode key={agent.label} {...agent} />
            ))}
        </div>
    );
}

function AgentNode({ icon: Icon, label, color, x, y, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 + delay * 0.3 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-float"
            style={{
                left: x,
                top: y,
                animationDelay: `${delay}s`,
                animationDuration: `${5 + delay}s`
            }}
        >
            <div className="group relative cursor-pointer">
                <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center glass shadow-xl hover:scale-110 transition-transform duration-300"
                    style={{ boxShadow: `0 8px 30px ${color}30` }}
                >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color }} />
                </div>
                <div className="mt-2 text-center">
                    <span className="text-xs font-semibold text-white/70 tracking-wide">{label}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-white text-navy-500 text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {label} Agent
                </div>
            </div>
        </motion.div>
    );
}
