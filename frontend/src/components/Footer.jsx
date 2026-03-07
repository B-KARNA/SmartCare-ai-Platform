import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-navy-900 border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-6 h-6 text-teal-500" />
                            <span className="text-xl font-bold text-white">Aegis <span className="text-teal-500">Health</span></span>
                        </div>
                        <p className="text-white/50 text-sm max-w-sm">
                            The multi-agent autonomous Medical Ecosystem. Protecting lives through intelligent healthcare.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-white/50">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Dashboard</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Security</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">API</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-white/50">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">HIPAA Notice</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-white/40">
                    <p>© 2024 Aegis Health. All rights reserved.</p>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        All systems operational
                    </div>
                </div>
            </div>
        </footer>
    );
}
