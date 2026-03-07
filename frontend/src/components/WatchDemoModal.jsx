import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ChevronRight, Activity, ShieldCheck, CheckCircle } from 'lucide-react';
import api from '../api';

export default function WatchDemoModal({ onClose }) {
    const [tourData, setTourData] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDemo = async () => {
            try {
                const res = await api.get('/demo-info');
                setTourData(res.data);
            } catch (error) {
                console.error("Failed to load demo info", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDemo();
    }, []);

    if (!tourData && !loading) return null;

    const nextStep = () => {
        if (currentStep < tourData.steps.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-navy-900/80 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
            >
                {loading ? (
                    <div className="w-full flex items-center justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Progress Sidebar */}
                        <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-100 p-8 flex flex-col relative hidden md:flex">
                            <h3 className="font-bold text-navy-500 mb-8">{tourData.title}</h3>
                            <div className="relative flex-1">
                                <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gray-200"></div>
                                <div className="space-y-8 relative z-10">
                                    {tourData.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-500 ${idx === currentStep ? 'bg-teal-500 border-teal-500 shadow-lg shadow-teal-500/30' :
                                                    idx < currentStep ? 'bg-teal-100 border-teal-500' : 'bg-white border-gray-300'
                                                }`}>
                                                {idx < currentStep && <CheckCircle className="w-3 h-3 text-teal-600" />}
                                                {idx === currentStep && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
                                            </div>
                                            <div className={`text-sm font-semibold transition-colors duration-500 ${idx === currentStep ? 'text-teal-600' :
                                                    idx < currentStep ? 'text-gray-500' : 'text-gray-400'
                                                }`}>
                                                {step.agent}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="w-full md:w-2/3 p-8 md:p-12 relative flex flex-col justify-center">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-1"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 border border-teal-100 shadow-inner">
                                        <Activity className="w-8 h-8 text-teal-500" />
                                    </div>
                                    <span className="text-teal-600 font-bold text-sm tracking-widest uppercase mb-2 block">
                                        Step {tourData.steps[currentStep].step} — {tourData.steps[currentStep].agent}
                                    </span>
                                    <h2 className="text-2xl font-black text-navy-500 mb-6">
                                        {tourData.steps[currentStep].title}
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                                        {tourData.steps[currentStep].description}
                                    </p>
                                    <div className="p-4 rounded-xl bg-gray-50 border-l-4 border-teal-500">
                                        <p className="font-semibold text-gray-700 text-sm">System Action:</p>
                                        <p className="text-gray-600 text-sm mt-1">{tourData.steps[currentStep].action}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-12 flex justify-end">
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-navy-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-all shadow-lg flex items-center gap-2"
                                >
                                    {currentStep === tourData.steps.length - 1 ? 'Finish Tour' : 'Next Step'} <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
