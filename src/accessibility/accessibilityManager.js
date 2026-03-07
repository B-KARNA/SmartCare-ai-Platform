// ============================================================
// Accessibility Manager
// ============================================================

const STORAGE_KEY = 'medvault_accessibility';

const MODES = {
    visual: 'visual',    // Visually Impaired
    deaf: 'deaf',      // Deaf
    speech: 'speech',    // Speech-Impaired
    motor: 'motor',     // Physically Handicapped
    memory: 'memory',    // Memory Care / Dementia
};

export function getAccessibilityModes() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

export function setAccessibilityMode(mode, enabled) {
    const modes = getAccessibilityModes();
    modes[mode] = enabled;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modes));
    applyAccessibility();
}

export function applyAccessibility() {
    const modes = getAccessibilityModes();
    const activeStr = Object.entries(modes)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(' ');
    document.documentElement.setAttribute('data-accessibility', activeStr);

    // Toggle Memory Care overlay
    if (modes.memory) {
        showMemoryCareOverlay();
    } else {
        hideMemoryCareOverlay();
    }
}

// ──── Memory Care Mode Overlay ────

function showMemoryCareOverlay() {
    if (document.getElementById('memory-care-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'memory-care-overlay';
    overlay.className = 'memory-care-overlay';
    overlay.innerHTML = `
    <div class="memory-care-container">
      <div class="memory-care-header">
        <div class="memory-care-title-icon">🏠</div>
        <h2 class="memory-care-title">Simple Mode</h2>
        <p class="memory-care-subtitle">Tap a button for quick help</p>
      </div>

      <div class="memory-care-buttons">
        <button class="memory-btn memory-btn-home" id="mc-call-home">
          <span class="memory-btn-icon">📞</span>
          <span class="memory-btn-label">Call Home</span>
          <span class="memory-btn-desc">Talk to your family</span>
        </button>

        <button class="memory-btn memory-btn-location" id="mc-where-am-i">
          <span class="memory-btn-icon">📍</span>
          <span class="memory-btn-label">Where Am I?</span>
          <span class="memory-btn-desc">See your location</span>
        </button>

        <button class="memory-btn memory-btn-sos" id="mc-sos">
          <span class="memory-btn-icon">🚨</span>
          <span class="memory-btn-label">HELP!</span>
          <span class="memory-btn-desc">Call for emergency help</span>
        </button>

        <button class="memory-btn memory-btn-meds" id="mc-meds">
          <span class="memory-btn-icon">💊</span>
          <span class="memory-btn-label">My Medicine</span>
          <span class="memory-btn-desc">See what to take today</span>
        </button>
      </div>

      <div class="memory-care-info" id="mc-info-panel" style="display:none">
        <div class="memory-info-content" id="mc-info-content"></div>
        <button class="memory-btn-back" id="mc-back">← Back to Menu</button>
      </div>

      <button class="memory-care-exit" id="mc-exit" title="Exit Simple Mode">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Exit Simple Mode
      </button>
    </div>
  `;

    document.getElementById('app').appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    // Event handlers
    document.getElementById('mc-call-home').addEventListener('click', () => {
        showMcInfo('📞 Calling Home...', '<div class="mc-calling"><div class="mc-calling-avatar">👩</div><div class="mc-calling-name">Anita Karn (Mother)</div><div class="mc-calling-status">Calling +91 98765 43210...</div><div class="mc-calling-animation"><span></span><span></span><span></span></div></div>');
    });

    document.getElementById('mc-where-am-i').addEventListener('click', () => {
        const lat = 28.6139, lng = 77.2090;
        showMcInfo('📍 Your Location', `<div class="mc-location"><div class="mc-location-address"><strong>You are near:</strong><br>Ansari Nagar, New Delhi<br>Delhi 110029, India</div><div class="mc-location-coords">GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</div><div class="mc-location-note">📱 Your location has been shared<br>with your family.</div></div>`);
    });

    document.getElementById('mc-sos').addEventListener('click', () => {
        showMcInfo('🚨 HELP IS COMING!', '<div class="mc-sos-active"><div class="mc-sos-pulse">🚑</div><div class="mc-sos-text">Emergency services<br>have been notified!</div><div class="mc-sos-contacts">✅ Mother notified<br>✅ Doctor notified<br>✅ Ambulance called</div></div>');
    });

    document.getElementById('mc-meds').addEventListener('click', () => {
        showMcInfo('💊 Your Medicine Today', '<div class="mc-meds-list"><div class="mc-med-item"><span class="mc-med-time">🌅 Morning</span><span class="mc-med-name">Metformin 500mg</span><span class="mc-med-status done">✅ Taken</span></div><div class="mc-med-item"><span class="mc-med-time">🌇 Evening</span><span class="mc-med-name">Metformin 500mg</span><span class="mc-med-status pending">⏳ Pending</span></div><div class="mc-med-item"><span class="mc-med-time">🌙 Night</span><span class="mc-med-name">Vitamin D3</span><span class="mc-med-status pending">⏳ Pending</span></div></div>');
    });

    document.getElementById('mc-exit').addEventListener('click', () => {
        setAccessibilityMode('memory', false);
    });

    document.getElementById('mc-back').addEventListener('click', () => {
        document.getElementById('mc-info-panel').style.display = 'none';
        document.querySelector('.memory-care-buttons').style.display = 'grid';
    });
}

function showMcInfo(title, html) {
    const panel = document.getElementById('mc-info-panel');
    const content = document.getElementById('mc-info-content');
    document.querySelector('.memory-care-buttons').style.display = 'none';
    content.innerHTML = `<h3 class="mc-info-title">${title}</h3>${html}`;
    panel.style.display = 'block';
}

function hideMemoryCareOverlay() {
    const overlay = document.getElementById('memory-care-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
}

export { MODES };
