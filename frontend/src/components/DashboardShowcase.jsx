import React from 'react';
import { Activity, Lock, Fingerprint, Shield, ShieldCheck, TrendingUp, CheckCircle } from 'lucide-react';

export default function DashboardShowcase() {
    return (
        <section id="dashboard" className="relative py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto reveal visible">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6">
                        <Activity className="w-4 h-4" />
                        Product Showcase
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-500 leading-tight">
                        Your Complete <span className="gradient-text">Health Dashboard</span>
                    </h2>
                    <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                        Real-time health intelligence at your fingertips — Live Health Score, Mood Trends,
                        Medication Timeline, all secured with military-grade encryption.
                    </p>
                </div>

                {/* Dashboard Mock-up */}
                <div className="mt-16 reveal visible">
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-accent-cyan/10 to-teal-500/20 rounded-3xl blur-3xl scale-95" />

                        <div className="relative bg-navy-500 rounded-3xl p-6 sm:p-8 lg:p-10 dashboard-shadow">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                    <Lock className="w-3.5 h-3.5 text-teal-400" />
                                    <span className="text-xs text-white/50 font-medium">aegis-health.app/dashboard</span>
                                </div>
                                <div className="w-16" />
                            </div>

                            <div className="grid lg:grid-cols-12 gap-6">
                                <div className="lg:col-span-4"><HealthScoreCard /></div>
                                <div className="lg:col-span-8"><MoodGraphCard /></div>
                                <div className="lg:col-span-8"><MedicationTimeline /></div>
                                <div className="lg:col-span-4"><SecurityBadge /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function HealthScoreCard() {
    const score = 92;
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="glass rounded-2xl p-6 text-center h-full flex flex-col items-center justify-center">
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Live Health Score</h4>
            <div className="relative w-36 h-36">
                <svg className="w-full h-full score-ring" viewBox="0 0 120 120">
                    <defs>
                        <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#008080" />
                            <stop offset="50%" stopColor="#00D4FF" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="score-ring-bg" />
                    <circle
                        cx="60" cy="60" r="54" fill="none" strokeWidth="8"
                        className="score-ring-fg"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white">{score}</span>
                    <span className="text-xs text-teal-400 font-semibold">Excellent</span>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +3 from last week
            </div>
        </div>
    );
}

function MoodGraphCard() {
    const moods = [
        { day: 'Mon', value: 70, emoji: '😊' },
        { day: 'Tue', value: 85, emoji: '😄' },
        { day: 'Wed', value: 60, emoji: '😐' },
        { day: 'Thu', value: 75, emoji: '😊' },
        { day: 'Fri', value: 90, emoji: '😁' },
        { day: 'Sat', value: 80, emoji: '😊' },
        { day: 'Sun', value: 95, emoji: '😄' },
    ];

    return (
        <div className="glass rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Mood Trend</h4>
                <span className="text-xs text-teal-400 font-medium px-3 py-1 rounded-full bg-teal-500/10">This Week</span>
            </div>
            <div className="flex items-end gap-3 h-40">
                {moods.map((m) => (
                    <div key={m.day} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-lg">{m.emoji}</span>
                        <div className="w-full bg-white/5 rounded-full overflow-hidden" style={{ height: '100px' }}>
                            <div
                                className="w-full rounded-full bg-gradient-to-t from-teal-500 to-accent-cyan transition-all duration-1000"
                                style={{ height: `${m.value}%`, marginTop: `${100 - m.value}%` }}
                            />
                        </div>
                        <span className="text-xs text-white/40 font-medium">{m.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MedicationTimeline() {
    const meds = [
        { time: '8:00 AM', name: 'Metformin', dose: '500mg', status: 'taken', icon: '💊' },
        { time: '12:00 PM', name: 'Vitamin D3', dose: '1000 IU', status: 'taken', icon: '☀️' },
        { time: '6:00 PM', name: 'Lisinopril', dose: '10mg', status: 'upcoming', icon: '💊' },
        { time: '10:00 PM', name: 'Melatonin', dose: '5mg', status: 'upcoming', icon: '🌙' },
    ];

    return (
        <div className="glass rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Medication Timeline</h4>
                <span className="text-xs text-accent-emerald font-medium">2/4 Taken</span>
            </div>
            <div className="space-y-4">
                {meds.map((med) => (
                    <div key={med.time} className="flex items-center gap-4">
                        <div className="text-sm text-white/40 font-medium w-20 shrink-0">{med.time}</div>
                        <div className={`w-3 h-3 rounded-full shrink-0 ${med.status === 'taken' ? 'bg-accent-emerald' : 'bg-white/20'}`} />
                        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5">
                            <span>{med.icon}</span>
                            <div>
                                <div className="text-sm text-white font-medium">{med.name}</div>
                                <div className="text-xs text-white/40">{med.dose}</div>
                            </div>
                        </div>
                        {med.status === 'taken' && (
                            <CheckCircle className="w-5 h-5 text-accent-emerald shrink-0" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SecurityBadge() {
    return (
        <div className="glass rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-accent-cyan/20 flex items-center justify-center mb-4 glow-teal">
                <ShieldCheck className="w-8 h-8 text-teal-400" />
            </div>
            <h4 className="text-white font-bold text-lg">Secure Health Vault</h4>
            <p className="text-white/40 text-sm mt-2 mb-4">Your data is protected with military-grade security.</p>
            <div className="space-y-2 w-full">
                <div className="flex items-center gap-2 text-sm text-white/60 px-3 py-2 rounded-lg bg-white/5">
                    <Lock className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>AES-256 Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60 px-3 py-2 rounded-lg bg-white/5">
                    <Fingerprint className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Biometric Access</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60 px-3 py-2 rounded-lg bg-white/5">
                    <Shield className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>HIPAA Compliant</span>
                </div>
            </div>
        </div>
    );
}
