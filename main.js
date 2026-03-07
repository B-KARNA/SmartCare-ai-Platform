// ============================================================
// MedVault — Main Entry Point
// ============================================================

import './style.css';
import { seedSampleData } from './src/vault/sampleData.js';
import { applyAccessibility, getAccessibilityModes } from './src/accessibility/accessibilityManager.js';
import { initDeafSupport, setDeafMode } from './src/accessibility/deafSupport.js';
import { renderHome } from './src/pages/home.js';
import { renderChat } from './src/pages/chat.js';
import { renderReports } from './src/pages/reports.js';
import { renderEmergency } from './src/pages/emergency.js';
import { renderSettings } from './src/pages/settings.js';
import { renderMentalHealth } from './src/pages/mentalHealth.js';

// ──── Initialize ────

// Seed sample data on first load
seedSampleData();

// Apply saved accessibility preferences
applyAccessibility();

// Initialize deaf support visual alerts
initDeafSupport();
const _modes = getAccessibilityModes();
if (_modes.deaf) setDeafMode(true);

// Set greeting based on time
setGreeting();

// ──── Page Renderers Map ────

const pages = {
    home: renderHome,
    chat: renderChat,
    reports: renderReports,
    emergency: renderEmergency,
    settings: renderSettings,
    mentalhealth: renderMentalHealth,
};

// ──── SPA Router ────

const navItems = document.querySelectorAll('.nav-item');
const pageSections = document.querySelectorAll('.page');

function navigateTo(pageName) {
    // Hide all pages
    pageSections.forEach(p => p.classList.remove('active'));

    // Deactivate all nav items
    navItems.forEach(n => n.classList.remove('active'));

    // Show target page
    const target = document.getElementById('page-' + pageName);
    if (target) {
        target.classList.add('active');
    }

    // Activate nav item
    const navBtn = document.querySelector(`.nav-item[data-page="${pageName}"]`);
    if (navBtn) navBtn.classList.add('active');

    // Render page content
    if (pages[pageName]) {
        pages[pageName]();
    }
}

// Nav click handlers
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        navigateTo(page);
        window.location.hash = page;
    });
});

// Settings button
document.getElementById('btn-settings').addEventListener('click', () => {
    navigateTo('settings');
    window.location.hash = 'settings';
});

// Hash-based routing
function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
}

window.addEventListener('hashchange', handleRoute);

// ──── Greeting ────

function setGreeting() {
    const h = new Date().getHours();
    let greeting = 'Good Evening';
    if (h < 12) greeting = 'Good Morning';
    else if (h < 17) greeting = 'Good Afternoon';

    const el = document.getElementById('greeting-text');
    if (el) el.textContent = greeting;
}

// ──── Initial Render ────
handleRoute();
