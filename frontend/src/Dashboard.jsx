import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from './api';
import { Activity, Bell, FileText, HeartPulse, LogOut, Settings, Shield, User, UploadCloud, X, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AIHealthBot from './components/AIHealthBot';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Upload State
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard');
                setDashboardData(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();

        // Refresh interactions every 10 seconds to show bot replies in real-time
        const interval = setInterval(fetchDashboard, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return;

        setUploadStatus('uploading');
        setUploadError('');

        const formData = new FormData();
        formData.append('file', uploadFile);

        try {
            await api.post('/reports/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadStatus('success');
            // Refresh dashboard data instantly
            const res = await api.get('/dashboard');
            setDashboardData(res.data);

            setTimeout(() => {
                setIsUploadOpen(false);
                setUploadFile(null);
                setUploadStatus('idle');
            }, 2000);
        } catch (error) {
            console.error("Upload failed", error);
            setUploadStatus('error');
            setUploadError(error.response?.data?.detail || 'Failed to upload report');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (!dashboardData) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* ... Sidebar and headers ... */}
            <aside className="w-64 bg-navy-500 text-white flex flex-col hidden md:flex">
                <div className="p-6 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-teal-400" />
                    <span className="text-xl font-bold">Aegis <span className="text-teal-400">Health</span></span>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {[
                        { icon: Activity, label: 'Overview', active: true },
                        { icon: FileText, label: 'Reports' },
                        { icon: HeartPulse, label: 'Medications' },
                        { icon: Bell, label: 'Alerts' },
                        { icon: Settings, label: 'Settings' },
                    ].map((item) => (
                        <a
                            key={item.label}
                            href="#"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${item.active ? 'bg-teal-500 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </a>
                    ))}
                </nav>
                <div className="p-4 mt-auto">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-navy-500">Welcome back, {dashboardData.user.name}</h1>
                        <p className="text-gray-500 text-sm mt-1">Here is your health summary for today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-navy-500 transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
                    {/* Top Stats */}
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                                <Activity className="w-6 h-6 text-teal-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Health Score</p>
                                <p className="text-2xl font-bold text-navy-500">{dashboardData.health_score}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Reports</p>
                                <p className="text-2xl font-bold text-navy-500">{dashboardData.summary.reports_uploaded}</p>
                            </div>
                            <button
                                onClick={() => setIsUploadOpen(true)}
                                className="ml-auto w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                                title="Upload new report"
                            >
                                <UploadCloud className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                <HeartPulse className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Medications</p>
                                <p className="text-2xl font-bold text-navy-500">{dashboardData.summary.active_medications}</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl p-6 shadow-lg shadow-teal-500/20 text-white flex flex-col justify-center">
                            <p className="text-teal-50 font-medium text-sm">Protected by</p>
                            <p className="text-xl font-bold mt-1 flex items-center gap-2">
                                <Shield className="w-5 h-5" /> AES-256 Vault
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Vitals */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative group">
                            <h2 className="text-lg font-bold text-navy-500 mb-6">Latest Vitals</h2>
                            <div className="space-y-4">
                                {Object.entries(dashboardData.vitals).map(([key, data]) => (
                                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="capitalize text-gray-600 font-medium">
                                            {key.replace('_', ' ')}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-bold text-navy-500">{data.value}</span>
                                            <span className="text-sm text-gray-400">{data.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent AI Interactions */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-navy-500">Recent AI Interactions</h2>
                                <button className="text-sm text-teal-600 font-medium hover:text-teal-700">View All</button>
                            </div>
                            {dashboardData.recent_interactions.length > 0 ? (
                                <div className="space-y-4">
                                    {dashboardData.recent_interactions.map((chat, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                                                <Activity className="w-5 h-5 text-teal-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-sm text-navy-500">{chat.agent}</span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        • {chat.timestamp ? new Date(chat.timestamp).toLocaleDateString() : 'Recent'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">"{chat.message}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-48 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                                        <User className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No interactions yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Your AI agents are standing by.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <AIHealthBot />

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => uploadStatus !== 'uploading' && setIsUploadOpen(false)}
                        className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
                    >
                        <button
                            onClick={() => uploadStatus !== 'uploading' && setIsUploadOpen(false)}
                            disabled={uploadStatus === 'uploading'}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <UploadCloud className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-navy-500">Upload Health Report</h2>
                                <p className="text-xs text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
                            </div>
                        </div>

                        {uploadStatus === 'success' ? (
                            <div className="py-8 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg text-navy-500 mb-1">Upload Successful!</h3>
                                <p className="text-sm text-gray-500">Your report has been secured in the vault.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleFileUpload} className="space-y-6">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${uploadFile ? 'border-teal-500 bg-teal-50/50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    {uploadFile ? (
                                        <div className="flex flex-col items-center gap-2 text-teal-700">
                                            <FileText className="w-8 h-8" />
                                            <span className="font-semibold text-sm truncate max-w-[200px]">{uploadFile.name}</span>
                                            <span className="text-xs opacity-70">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-gray-500">
                                            <UploadCloud className="w-8 h-8 text-gray-400" />
                                            <div>
                                                <span className="font-semibold text-blue-600 hover:underline">Click to browse</span>
                                                <span> or drag and drop</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {uploadError && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                        {uploadError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!uploadFile || uploadStatus === 'uploading'}
                                    className="w-full py-4 bg-navy-500 text-white rounded-xl font-bold shadow-lg shadow-navy-500/30 hover:bg-navy-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploadStatus === 'uploading' ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Securing encryption...</>
                                    ) : (
                                        'Upload to Health Vault'
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
