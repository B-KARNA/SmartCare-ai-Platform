import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import DashboardShowcase from './components/DashboardShowcase';
import PricingSection from './components/PricingSection';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import WatchDemoModal from './components/WatchDemoModal';
import EmergencySticky from './components/EmergencySticky';
import AIHealthBot from './components/AIHealthBot';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [modals, setModals] = useState({
        login: false,
        register: false,
        demo: false,
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Re-run intersection observer for scroll reveal animations
            document.querySelectorAll('.reveal').forEach((el) => {
                const windowHeight = window.innerHeight;
                const elementTop = el.getBoundingClientRect().top;
                const elementVisible = 150;
                if (elementTop < windowHeight - elementVisible) {
                    el.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Locking body scroll when any modal is open
    useEffect(() => {
        if (modals.login || modals.register || modals.demo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Restore exact class names if any layout shifts happen
        }
    }, [modals]);

    const openModal = (modalName) => setModals(prev => ({ ...prev, [modalName]: true }));
    const closeModal = (modalName) => setModals(prev => ({ ...prev, [modalName]: false }));

    return (
        <div className="font-sans antialiased text-navy-500 selection:bg-teal-500/30">
            {/* Assembly of Modular Components */}
            <Navbar
                scrolled={scrolled}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                openLoginModal={() => openModal('login')}
                openRegisterModal={() => openModal('register')}
            />

            <main>
                <HeroSection
                    openLoginModal={() => openModal('login')}
                    openWatchDemoModal={() => openModal('demo')}
                />
                <FeaturesSection />
                <DashboardShowcase />
                <PricingSection openRegisterModal={() => openModal('register')} />
                <TrustSection />
            </main>

            <Footer />

            <EmergencySticky />
            <AIHealthBot />

            {/* Modals wrapped in AnimatePresence for mount/unmount animations */}
            <AnimatePresence>
                {modals.login && (
                    <LoginModal
                        onClose={() => closeModal('login')}
                        openRegisterModal={() => {
                            closeModal('login');
                            openModal('register');
                        }}
                    />
                )}
                {modals.register && (
                    <RegisterModal onClose={() => closeModal('register')} />
                )}
                {modals.demo && (
                    <WatchDemoModal onClose={() => closeModal('demo')} />
                )}
            </AnimatePresence>
        </div>
    );
}
