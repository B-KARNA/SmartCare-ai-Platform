import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Accessibility, AlertTriangle, Battery, Heart, Globe, Zap, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api';

export default function FeaturesSection() {
    const features = [
        {
            id: 'multi-agent',
            icon: BrainCircuit,
            color: 'from-teal-500 to-cyan-500',
            shadowColor: 'shadow-teal-500/20',
            title: 'Autonomous Multi-Agent Logic',
            desc: 'Unlike static apps, our agents communicate with each other. If your Report Agent sees high glucose, your Nutrition Agent automatically updates your meal plan.',
            badge: 'AI-Powered',
        },
        {
            id: 'accessibility',
            icon: Accessibility,
            color: 'from-blue-500 to-indigo-500',
            shadowColor: 'shadow-blue-500/20',
            title: 'Universal Accessibility',
            desc: 'Built-in Special Modes for the Visually Impaired (Voice Navigation), Deaf (Visual Alerts & Haptics), and Speech-Impaired (Icon-Based Communication).',
            badge: 'Inclusive',
        },
        {
            id: 'fall-detection',
            icon: AlertTriangle,
            color: 'from-amber-500 to-orange-500',
            shadowColor: 'shadow-amber-500/20',
            title: 'Proactive Fall & Emergency',
            desc: 'Using device accelerometers to detect falls and trigger real-world emergency help automatically — without a manual button press.',
            badge: 'Life-Saving',
        },
        {
            id: 'mental-health',
            icon: Heart,
            color: 'from-rose-400 to-pink-500',
            shadowColor: 'shadow-rose-400/20',
            title: 'Mental Health AI',
            desc: 'Emotional pattern recognition tracking your mood over time. Provides guided exercises, cognitive coping prompts, and journaling tools.',
            badge: 'Wellness',
        },
        {
            id: 'wearable',
            icon: Battery,
            color: 'from-purple-500 to-fuchsia-500',
            shadowColor: 'shadow-purple-500/20',
            title: 'Wearable Integration',
            desc: 'Connects to smartwatches to pull real-time vitals. Our Risk Agent proactively analyzes resting heart rate spikes and SpO2 drops.',
            badge: 'Real-Time',
        },
        {
            id: 'multi-language',
            icon: Globe,
            color: 'from-lime-500 to-emerald-500',
            shadowColor: 'shadow-lime-500/20',
            title: 'Multi-Language Support',
            desc: 'Real-time contextual translation across 12 languages. Built with a specialized medical lexicon to ensure your symptoms are never misinterpreted.',
            badge: 'Global',
        }
    ];

    return (
        <section id="features" className="relative py-24 lg:py-32 bg-white overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #001F3F 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto reveal visible">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6">
                        <Zap className="w-4 h-4" />
                        What Sets Us Apart
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-500 leading-tight">
                        The <span className="gradient-text">"Agentic"</span> Difference
                    </h2>
                    <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                        Six specialized AI domains working in concert, communicating autonomously
                        to deliver proactive healthcare — not reactive symptom checking.
                    </p>
                </div>

                <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, i) => (
                        <FeatureCard key={feature.id} feature={feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ feature }) {
    const [expanded, setExpanded] = useState(false);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleExpand = async () => {
        if (!expanded && !details) {
            setLoading(true);
            try {
                const res = await api.get(`/features/details/${feature.id}`);
                setDetails(res.data);
            } catch (error) {
                console.error("Failed to load details");
            } finally {
                setLoading(false);
            }
        }
        setExpanded(!expanded);
    };

    const Icon = feature.icon;

    return (
        <motion.div layout className={`group relative p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl ${feature.shadowColor} transition-all duration-500`}>
            <div className="absolute top-6 right-6">
                <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${feature.color} text-white`}>
                    {feature.badge}
                </span>
            </div>

            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg ${feature.shadowColor} mb-6`}>
                <Icon className="w-7 h-7 text-white" />
            </div>

            <h3 className="text-xl font-bold text-navy-500 mb-3 pr-16">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>

            <button
                onClick={toggleExpand}
                className="mt-6 flex items-center text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors"
            >
                {expanded ? 'Show Less' : 'Learn More'}
                {expanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-6 pt-6 border-t border-gray-100"
                    >
                        {loading ? (
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                            </div>
                        ) : details ? (
                            <div className="space-y-4 text-sm text-gray-600">
                                <div>
                                    <h4 className="font-bold text-navy-500 mb-1">How It Works</h4>
                                    <p>{details.how_it_works}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-navy-500 mb-1">Data Privacy</h4>
                                    <p>{details.data_privacy}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-navy-500 mb-1">Accessibility Integration</h4>
                                    <p>{details.accessibility}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-navy-500 mb-1">Tech Stack</h4>
                                    <p className="font-mono text-xs bg-gray-50 p-2 rounded truncate">{details.tech_stack}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-red-500 text-sm">Failed to load detail data.</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
