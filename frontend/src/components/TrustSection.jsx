import React from 'react';
import { Shield, Lock, Fingerprint, Brain, Heart } from 'lucide-react';

export default function TrustSection() {
    return (
        <section className="py-24 bg-navy-900 text-white border-t border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16 reveal visible">
                    <h2 className="text-3xl font-black mb-4">Security First. Always.</h2>
                    <p className="text-white/60">Your health data is your most private asset. We treat it with the highest level of cryptographic security.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-reveal">
                    {[
                        { icon: Shield, title: 'HIPAA Compliant', desc: 'All data storage, transmission, and processing adheres to HIPAA regulations for protected health information.' },
                        { icon: Lock, title: 'End-to-End Encryption', desc: 'AES-256 encryption at rest and TLS 1.3 in transit. Your health data never leaves a secure environment.' },
                        { icon: Fingerprint, title: 'Zero-Knowledge Architecture', desc: 'We cannot read your data. Biometric authentication and client-side encryption keep you in full control.' },
                        { icon: Brain, title: 'Ethical AI Commitment', desc: 'Our mental health AI includes an ethical disclaimer: it supports, never diagnoses. Critical cases are escalated to certified professionals.' },
                    ].map((feature, i) => (
                        <div key={i} className="reveal visible bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Mental Health AI Disclaimer */}
                <div className="mt-12 bg-white/5 border border-amber-500/30 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 reveal visible">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-400 mb-2">Mental Health AI — Ethical Disclaimer</h4>
                        <p className="text-sm text-white/60 leading-relaxed">
                            Aegis Health's mental wellness features are designed to <strong className="text-white">support</strong>, not replace, professional mental healthcare. Our AI provides coping resources and mood tracking but <strong className="text-white">never provides clinical diagnoses</strong>. If our system detects signs of crisis, it will sensitively recommend connecting with certified professionals and emergency services.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
