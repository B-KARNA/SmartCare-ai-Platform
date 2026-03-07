import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Mail, Lock, Phone, User, Eye, Ear, MessageSquare, Hand, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function RegisterModal({ onClose }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_relationship: '',
        accessibility_needs: {
            visual: false,
            hearing: false,
            speech: false,
            motor: false
        }
    });

    const updateData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
    const toggleAccessibility = (need) => setFormData(prev => ({
        ...prev,
        accessibility_needs: {
            ...prev.accessibility_needs,
            [need]: !prev.accessibility_needs[need]
        }
    }));

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/register', formData);
            login(res.data.user, res.data.access_token);
            onClose();
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="shrink-0 p-6 border-b border-gray-100 flex items-center justify-between bg-navy-500 text-white modal-glow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-teal-300" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Create Your Account</h2>
                            <p className="text-white/60 text-sm">Join the Aegis Health ecosystem</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5 text-white/60 hover:text-white" />
                    </button>
                </div>

                {error && (
                    <div className="m-6 mb-0 p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-start gap-3 border border-red-100 shrink-0">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                    <div className="space-y-8">
                        {/* Section 1: Personal Info */}
                        <div>
                            <h3 className="text-sm font-bold text-navy-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-teal-500" /> Personal Information
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                                    <input type="text" value={formData.name} onChange={e => updateData('name', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                                    <input type="email" value={formData.email} onChange={e => updateData('email', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                                    <input type="password" value={formData.password} onChange={e => updateData('password', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Emergency Contact */}
                        <div>
                            <h3 className="text-sm font-bold text-navy-500 uppercase tracking-wider mb-4 flex items-center gap-2 text-rose-500">
                                <Phone className="w-4 h-4" /> Emergency Contact
                            </h3>
                            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-rose-900 mb-2">Contact Name</label>
                                        <input type="text" value={formData.emergency_contact_name} onChange={e => updateData('emergency_contact_name', e.target.value)} className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-rose-900 mb-2">Phone</label>
                                        <input type="tel" value={formData.emergency_contact_phone} onChange={e => updateData('emergency_contact_phone', e.target.value)} className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-rose-900 mb-2">Relationship</label>
                                        <input type="text" value={formData.emergency_relationship} onChange={e => updateData('emergency_relationship', e.target.value)} className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Accessibility Profile */}
                        <div>
                            <h3 className="text-sm font-bold text-navy-500 uppercase tracking-wider mb-4 flex items-center gap-2 text-blue-500">
                                <Eye className="w-4 h-4" /> Accessibility Needs
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">Select any that apply to customize your UI automatically.</p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'visual', icon: Eye, label: 'Visual Impairment', desc: 'Voice Nav, High Contrast' },
                                    { id: 'hearing', icon: Ear, label: 'Hearing Loss', desc: 'Haptic & Visual Alerts' },
                                    { id: 'speech', icon: MessageSquare, label: 'Speech Difficulties', desc: 'Icon-based Communication' },
                                    { id: 'motor', icon: Hand, label: 'Motor Impairment', desc: 'Large Touch Targets' }
                                ].map(need => (
                                    <button
                                        key={need.id}
                                        onClick={() => toggleAccessibility(need.id)}
                                        className={`p-4 rounded-xl border text-left transition-all ${formData.accessibility_needs[need.id]
                                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500 ring-opacity-20'
                                            : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <need.icon className={`w-6 h-6 mb-2 ${formData.accessibility_needs[need.id] ? 'text-blue-600' : 'text-gray-400'}`} />
                                        <div className={`font-semibold text-sm ${formData.accessibility_needs[need.id] ? 'text-blue-900' : 'text-gray-700'}`}>{need.label}</div>
                                        <div className={`text-xs mt-1 ${formData.accessibility_needs[need.id] ? 'text-blue-700' : 'text-gray-500'}`}>{need.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    <p className="text-xs text-gray-500 max-w-xs">By registering, you agree to our Terms of Service & Privacy Policy. Data is secured via AES-256.</p>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.name || !formData.email || !formData.password}
                        className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
