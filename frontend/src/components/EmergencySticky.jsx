import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, AlertTriangle, ShieldAlert } from 'lucide-react';
import api from '../api';

export default function EmergencySticky() {
    const [isHovered, setIsHovered] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [emergencyMsg, setEmergencyMsg] = useState("Initializing emergency uplink...");

    const handleEmergencyClick = async () => {
        setToastVisible(true);
        setEmergencyMsg("Broadcasting SOS to Aegis Health Multi-Agent Bus...");
        try {
            const res = await api.post('/chat/route', { message: "SOS EMERGENCY HELP" });
            setEmergencyMsg(res?.data?.response || "Emergency protocol activated. Assistance is on the way.");
        } catch (error) {
            setEmergencyMsg("Emergency protocol failed to broadcast. Please dial local emergency services immediately.");
        }
    };

    useEffect(() => {
        if (toastVisible) {
            const timer = setTimeout(() => {
                setToastVisible(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toastVisible]);

    return (
        <>
            <motion.div
                className="fixed bottom-6 left-6 z-50 flex items-center"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -20, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: 'auto' }}
                            exit={{ opacity: 0, x: -20, width: 0 }}
                            className="overflow-hidden whitespace-nowrap bg-red-600 text-white font-bold text-sm px-4 py-3 rounded-r-full shadow-lg shadow-red-600/30 flex items-center pl-8 -ml-2 order-2"
                        >
                            Emergency SOS
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={handleEmergencyClick}
                    className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-600/40 hover:scale-110 active:scale-95 transition-all z-10 order-1"
                >
                    <div className="absolute inset-0 w-full h-full rounded-full border-2 border-red-500/50 animate-ping"></div>
                    <PhoneCall className="w-6 h-6 text-white" />
                </button>
            </motion.div>

            {/* Emergency Toast */}
            <AnimatePresence>
                {toastVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 left-6 z-50 bg-red-600 border border-red-500 p-4 rounded-2xl shadow-2xl flex items-start gap-4 max-w-sm w-full"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-white">
                            <h4 className="font-bold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Aegis Emergency Mitigation
                            </h4>
                            <p className="text-sm text-red-100 mt-1 leading-relaxed whitespace-pre-wrap">
                                {emergencyMsg}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
