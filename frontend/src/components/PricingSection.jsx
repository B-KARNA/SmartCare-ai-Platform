import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export default function PricingSection({ openRegisterModal }) {
    const plans = [
        {
            tier: 'Base',
            price: 'Free',
            period: '',
            desc: 'Essential health monitoring for everyone.',
            features: [
                'Symptom Analysis (AI-Powered)',
                'Health History & Records',
                'Icon-Based Input Mode',
                'Basic Health Score',
                'Community Support',
            ],
            cta: 'Get Started Free',
            popular: false,
        },
        {
            tier: 'Pro',
            price: '$9.99',
            period: '/month',
            desc: 'Advanced AI capabilities for proactive health.',
            features: [
                'Everything in Base',
                'Report Analysis (OCR)',
                'Wearable Integration',
                'Advanced Fall Detection',
                'Real-Time Risk Alerts',
                'Priority AI Responses',
                'Mood & Mental Wellness AI',
            ],
            cta: 'Start Pro Trial',
            popular: true,
        },
        {
            tier: 'Family',
            price: '$19.99',
            period: '/month',
            desc: 'Complete protection for your loved ones.',
            features: [
                'Everything in Pro',
                'Up to 5 Family Members',
                'Emergency Alerts Network',
                'Memory Care Mode (Elderly)',
                'Family Health Dashboard',
                'Caregiver Access Controls',
                'Dedicated Support Line',
            ],
            cta: 'Protect Your Family',
            popular: false,
        },
    ];

    return (
        <section id="pricing" className="relative py-24 lg:py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto reveal visible">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6">
                        <Star className="w-4 h-4" />
                        Simple Pricing
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-500 leading-tight">
                        Choose Your <span className="gradient-text">Protection Level</span>
                    </h2>
                    <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                        From free essentials to complete family care. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
                    {plans.map((plan) => (
                        <PricingCard key={plan.tier} {...plan} openRegisterModal={openRegisterModal} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PricingCard({ tier, price, period, desc, features, cta, popular, openRegisterModal }) {
    return (
        <div
            className={`relative p-8 rounded-3xl transition-all duration-500 reveal visible ${popular
                    ? 'bg-gradient-to-b from-teal-500 to-teal-700 text-white shadow-2xl shadow-teal-500/30 scale-105 border-0'
                    : 'bg-gray-50 text-navy-500 border border-gray-100 hover:shadow-xl hover:-translate-y-1'
                }`}
        >
            {popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-accent-cyan text-navy-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="mb-8">
                <h3 className={`text-xl font-bold mb-4 ${popular ? 'text-teal-100' : 'text-gray-500'}`}>{tier}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black">{price}</span>
                    <span className={`text-sm font-medium ${popular ? 'text-teal-100' : 'text-gray-400'}`}>{period}</span>
                </div>
                <p className={`mt-4 text-sm leading-relaxed ${popular ? 'text-teal-50' : 'text-gray-500'}`}>{desc}</p>
            </div>

            <div className={`h-px w-full mb-8 ${popular ? 'bg-white/20' : 'bg-gray-200'}`} />

            <ul className="space-y-4 mb-8">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <CheckCircle className={`w-5 h-5 shrink-0 ${popular ? 'text-accent-cyan' : 'text-teal-500'}`} />
                        <span className={`text-sm ${popular ? 'text-white/90' : 'text-gray-600'}`}>{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={openRegisterModal}
                className={`w-full py-4 rounded-xl text-sm font-bold transition-all duration-300 ${popular
                        ? 'bg-accent-cyan text-navy-900 hover:bg-white hover:scale-105 shadow-lg'
                        : 'bg-navy-900 text-white hover:bg-teal-600 hover:shadow-lg'
                    }`}
            >
                {cta}
            </button>
        </div>
    );
}
