import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar({ scrolled, isMenuOpen, setIsMenuOpen, openRegisterModal, openLoginModal }) {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'Dashboard', href: '#dashboard' },
        { label: 'Pricing', href: '#pricing' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-navy-500/5'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-shadow">
                            <ShieldCheck className="w-5 h-5 text-white" />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                        </div>
                        <div>
                            <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-navy-500' : 'text-white'} transition-colors`}>
                                Aegis <span className="text-teal-500">Health</span>
                            </span>
                        </div>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${scrolled
                                    ? 'text-gray-600 hover:text-navy-500 hover:bg-gray-100'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${scrolled
                                        ? 'text-navy-500 hover:bg-gray-100'
                                        : 'text-white/90 hover:bg-white/10'
                                        }`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:scale-105 transition-all duration-300 btn-shine"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={openLoginModal}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${scrolled
                                        ? 'text-navy-500 hover:bg-gray-100'
                                        : 'text-white/90 hover:bg-white/10'
                                        }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={openRegisterModal}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300 btn-shine"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-navy-500' : 'text-white'
                            }`}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button> // Mobile layout omitted for brevity, logic remains identical
                </div>
            </div>
        </nav>
    );
}
