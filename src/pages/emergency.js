// ============================================================
// Emergency Page — Enhanced with Fall Detection & Shake SOS
// ============================================================

import { getProfile } from '../vault/healthVault.js';
import { getAccessibilityModes } from '../accessibility/accessibilityManager.js';
import { initFallDetection, triggerFallDetected, cancelFallCountdown, isFallDetectionEnabled, setFallDetectionEnabled } from '../safety/fallDetection.js';
import { initShakeDetection, enableShake, disableShake } from '../safety/shakeDetection.js';
import { transcribeAudioEvent, isDeafMode } from '../accessibility/deafSupport.js';

let shakeInitialized = false;

export function renderEmergency() {
  const container = document.getElementById('emergency-content');
  const profile = getProfile();
  const ec = profile.emergencyContact;
  const modes = getAccessibilityModes();
  const fallEnabled = isFallDetectionEnabled();

  container.innerHTML = `
    <div class="emergency-hero">
      <button class="sos-button" id="sos-btn" aria-label="Emergency SOS">
        <span class="sos-icon">SOS</span>
        <span class="sos-text">Emergency</span>
      </button>
      <div class="emergency-title">Emergency Assistance</div>
      <div class="emergency-subtitle">
        Tap SOS to alert your emergency contacts
        ${modes.motor ? '<br><small style="color:var(--secondary)">📳 Shake device 3× for hands-free SOS</small>' : ''}
      </div>
    </div>

    <!-- Fall Detection & Shake Toggle Section -->
    <div class="safety-toggles-section">
      <div class="section-header">
        <span class="section-title">Safety Features</span>
      </div>

      <div class="setting-item">
        <div class="setting-left">
          <div class="setting-icon" style="background: rgba(255,86,48,.12)">⚡</div>
          <div class="setting-text">
            <div class="setting-name">Fall Detection</div>
            <div class="setting-desc">Auto-detect falls and send GPS alert</div>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" id="toggle-fall-detection" ${fallEnabled ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-item">
        <div class="setting-left">
          <div class="setting-icon" style="background: rgba(0,184,217,.12)">📳</div>
          <div class="setting-text">
            <div class="setting-name">Shake to SOS</div>
            <div class="setting-desc">Shake device 3× to trigger emergency</div>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" id="toggle-shake-sos" ${modes.motor ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
      </div>

      <!-- Simulate Fall Button -->
      <button class="simulate-fall-btn" id="simulate-fall-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        Simulate Impact / Fall
      </button>
    </div>

    <!-- Fall Detection Countdown Overlay (hidden by default) -->
    <div class="fall-countdown-overlay" id="fall-countdown-overlay" style="display:none">
      <div class="fall-countdown-card">
        <div class="fall-countdown-header">
          <span class="fall-icon-pulse">⚠️</span>
          <h3>Fall Detected!</h3>
          <p>Are you okay? Emergency alert will be sent in:</p>
        </div>
        <div class="fall-countdown-timer" id="fall-countdown-timer">10</div>
        <div class="fall-countdown-bar-track">
          <div class="fall-countdown-bar-fill" id="fall-countdown-bar"></div>
        </div>
        <div class="fall-gps-info" id="fall-gps-info">
          📍 GPS location will be included in alert
        </div>
        <button class="fall-cancel-btn" id="fall-cancel-btn">
          ✋ I'm OK — Cancel Alert
        </button>
      </div>
    </div>

    <!-- Alert Sent Confirmation (hidden by default) -->
    <div class="fall-alert-sent" id="fall-alert-sent" style="display:none">
      <div class="fall-alert-card">
        <div class="fall-alert-icon">🚨</div>
        <h3 class="fall-alert-title">Emergency Alert Sent!</h3>
        <div class="fall-alert-details" id="fall-alert-details"></div>
        <button class="fall-alert-dismiss" id="fall-alert-dismiss">Dismiss</button>
      </div>
    </div>

    <div class="section-header" style="margin-top: var(--space-lg);">
      <span class="section-title">Emergency Contacts</span>
      <span class="section-action">+ Add</span>
    </div>

    <div class="emergency-contacts">
      <div class="emergency-contact-card">
        <div class="contact-avatar" style="background: linear-gradient(135deg, #FF5630, #FF7452);">
          ${ec.name ? ec.name.charAt(0) : 'A'}
        </div>
        <div class="contact-info">
          <div class="contact-name">${ec.name || 'Anita Karn'}</div>
          <div class="contact-relation">${ec.relation || 'Mother'} • ${ec.phone || '+91 98765 43210'}</div>
        </div>
        <button class="contact-call-btn" aria-label="Call contact">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </button>
      </div>

      <div class="emergency-contact-card">
        <div class="contact-avatar" style="background: linear-gradient(135deg, #0052CC, #2684FF);">P</div>
        <div class="contact-info">
          <div class="contact-name">Dr. Priya Sharma</div>
          <div class="contact-relation">Primary Doctor • +91 97123 45678</div>
        </div>
        <button class="contact-call-btn" aria-label="Call contact">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </button>
      </div>

      <div class="emergency-contact-card">
        <div class="contact-avatar" style="background: linear-gradient(135deg, #36B37E, #57D9A3);">E</div>
        <div class="contact-info">
          <div class="contact-name">Emergency Services</div>
          <div class="contact-relation">Ambulance • 112</div>
        </div>
        <button class="contact-call-btn" aria-label="Call contact">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Nearest Hospital -->
    <div class="section-header mt-lg">
      <span class="section-title">Nearest Hospital</span>
    </div>
    <div class="hospital-card">
      <div class="hospital-name">🏥 AIIMS Emergency Wing</div>
      <div class="hospital-details">
        <span>📍 2.3 km away • Ansari Nagar, New Delhi</span>
        <span>📞 +91 11-2658 8500</span>
        <span>⏰ Open 24/7 — Average wait: ~12 min</span>
      </div>
    </div>
  `;

  // ──── SOS Button ────
  const sosBtn = document.getElementById('sos-btn');
  sosBtn.addEventListener('click', () => {
    sosBtn.style.transform = 'scale(0.95)';
    setTimeout(() => { sosBtn.style.transform = ''; }, 200);
    transcribeAudioEvent('sos_triggered');
    showSOSConfirmation();
  });

  // ──── Fall Detection Toggle ────
  const fallToggle = document.getElementById('toggle-fall-detection');
  fallToggle.addEventListener('change', (e) => {
    setFallDetectionEnabled(e.target.checked);
  });

  // ──── Shake Toggle ────
  const shakeToggle = document.getElementById('toggle-shake-sos');
  shakeToggle.addEventListener('change', (e) => {
    if (e.target.checked) enableShake();
    else disableShake();
  });

  // ──── Init Shake Detection (once) ────
  if (!shakeInitialized) {
    initShakeDetection(() => {
      transcribeAudioEvent('shake_detected');
      sosBtn.click();
    });
    if (modes.motor) enableShake();
    shakeInitialized = true;
  }

  // ──── Init Fall Detection ────
  initFallDetection({
    onTick: (seconds, state) => {
      const overlay = document.getElementById('fall-countdown-overlay');
      const timerEl = document.getElementById('fall-countdown-timer');
      const barEl = document.getElementById('fall-countdown-bar');

      if (state === 'started') {
        overlay.style.display = 'flex';
        document.getElementById('fall-alert-sent').style.display = 'none';
      }

      timerEl.textContent = seconds;
      barEl.style.width = `${(seconds / 10) * 100}%`;

      if (seconds <= 3) timerEl.style.color = 'var(--error)';
      else timerEl.style.color = 'var(--secondary)';

      transcribeAudioEvent('fall_countdown', seconds);
    },
    onAlert: (alertData) => {
      document.getElementById('fall-countdown-overlay').style.display = 'none';
      const sentPanel = document.getElementById('fall-alert-sent');
      sentPanel.style.display = 'flex';
      document.getElementById('fall-alert-details').innerHTML = `
        <div class="alert-detail-row"><span>📍 GPS</span><span>${alertData.gps.lat.toFixed(4)}°N, ${alertData.gps.lng.toFixed(4)}°E</span></div>
        <div class="alert-detail-row"><span>🗺️ Map</span><a href="${alertData.mapsUrl}" target="_blank" style="color: var(--secondary)">Open in Maps</a></div>
        <div class="alert-detail-row"><span>⏰ Time</span><span>${new Date().toLocaleTimeString('en-IN')}</span></div>
        <div class="alert-detail-row"><span>📱 SMS</span><span>Sent to 3 contacts</span></div>
      `;
      transcribeAudioEvent('fall_alert_sent');
    },
    onCancel: () => {
      document.getElementById('fall-countdown-overlay').style.display = 'none';
      transcribeAudioEvent('fall_cancelled');
    }
  });

  // ──── Simulate Fall Button ────
  document.getElementById('simulate-fall-btn').addEventListener('click', () => {
    transcribeAudioEvent('fall_detected');
    triggerFallDetected();
  });

  // ──── Cancel Button ────
  document.getElementById('fall-cancel-btn').addEventListener('click', cancelFallCountdown);

  // ──── Dismiss Alert ────
  document.getElementById('fall-alert-dismiss').addEventListener('click', () => {
    document.getElementById('fall-alert-sent').style.display = 'none';
  });
}

function showSOSConfirmation() {
  const overlay = document.createElement('div');
  overlay.className = 'sos-confirmation-overlay';
  overlay.innerHTML = `
    <div class="sos-confirmation-card">
      <div class="sos-confirm-icon">🚨</div>
      <h3>SOS Alert Sent!</h3>
      <p>Emergency contacts and nearby services have been notified with your location.</p>
      <div class="sos-confirm-contacts">
        <div>✅ Anita Karn (Mother) — notified</div>
        <div>✅ Dr. Priya Sharma — notified</div>
        <div>✅ Emergency Services (112) — called</div>
      </div>
      <button class="sos-confirm-dismiss" id="sos-dismiss">OK, Got it</button>
    </div>
  `;
  document.getElementById('app').appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  document.getElementById('sos-dismiss').addEventListener('click', () => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
  });
}
