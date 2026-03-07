// ============================================================
// Settings Page — Accessibility & Safety Modes
// ============================================================

import { getAccessibilityModes, setAccessibilityMode, MODES } from '../accessibility/accessibilityManager.js';
import { isFallDetectionEnabled, setFallDetectionEnabled } from '../safety/fallDetection.js';
import { enableShake, disableShake } from '../safety/shakeDetection.js';
import { setDeafMode } from '../accessibility/deafSupport.js';

export function renderSettings() {
  const container = document.getElementById('settings-content');
  const modes = getAccessibilityModes();
  const fallEnabled = isFallDetectionEnabled();

  const accessibilityItems = [
    {
      key: MODES.visual,
      icon: '👁️',
      bgColor: 'rgba(0,82,204,.12)',
      name: 'Visually Impaired',
      desc: 'High contrast, larger text, enhanced borders'
    },
    {
      key: MODES.deaf,
      icon: '🦻',
      bgColor: 'rgba(0,184,217,.12)',
      name: 'Deaf / Hard of Hearing',
      desc: 'Visual alerts replace all audio/voice output'
    },
    {
      key: MODES.speech,
      icon: '💬',
      bgColor: 'rgba(54,179,126,.12)',
      name: 'Speech Impaired',
      desc: 'Text-first communication, larger input areas'
    },
    {
      key: MODES.motor,
      icon: '♿',
      bgColor: 'rgba(255,171,0,.12)',
      name: 'Physically Handicapped',
      desc: 'Larger targets, shake-to-SOS gesture'
    },
    {
      key: MODES.memory,
      icon: '🧠',
      bgColor: 'rgba(124,58,237,.12)',
      name: 'Memory Care (Dementia)',
      desc: 'Simplified interface with massive action buttons'
    }
  ];

  container.innerHTML = `
    <div class="settings-title">Settings</div>

    <div class="settings-group">
      <div class="settings-group-title">Accessibility Modes</div>
      ${accessibilityItems.map(item => `
        <div class="setting-item">
          <div class="setting-left">
            <div class="setting-icon" style="background: ${item.bgColor}">${item.icon}</div>
            <div class="setting-text">
              <div class="setting-name">${item.name}</div>
              <div class="setting-desc">${item.desc}</div>
            </div>
          </div>
          <label class="toggle">
            <input type="checkbox" data-mode="${item.key}" ${modes[item.key] ? 'checked' : ''} />
            <span class="toggle-slider"></span>
          </label>
        </div>
      `).join('')}
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Safety Features</div>
      <div class="setting-item">
        <div class="setting-left">
          <div class="setting-icon" style="background: rgba(255,86,48,.12)">⚡</div>
          <div class="setting-text">
            <div class="setting-name">Fall Detection</div>
            <div class="setting-desc">Auto-detect impact and send GPS emergency alert</div>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" id="settings-fall-toggle" ${fallEnabled ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-item">
        <div class="setting-left">
          <div class="setting-icon" style="background: rgba(0,184,217,.12)">📳</div>
          <div class="setting-text">
            <div class="setting-name">Shake to SOS</div>
            <div class="setting-desc">Shake 3× to trigger emergency (or press S 3×)</div>
          </div>
        </div>
        <label class="toggle">
          <input type="checkbox" id="settings-shake-toggle" ${modes.motor ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Account</div>
      <div class="setting-item">
        <div class="setting-left">
          <div class="setting-icon" style="background: rgba(0,82,204,.12)">👤</div>
          <div class="setting-text">
            <div class="setting-name">Profile</div>
            <div class="setting-desc">Manage your personal information</div>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="setting-item">
        <div class="setting-left">
          <div class="setting-icon" style="background: rgba(0,184,217,.12)">🔒</div>
          <div class="setting-text">
            <div class="setting-name">Privacy & Security</div>
            <div class="setting-desc">Vault encryption, biometric lock</div>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="setting-item">
        <div class="setting-left">
          <div class="setting-icon" style="background: rgba(255,171,0,.12)">🔔</div>
          <div class="setting-text">
            <div class="setting-name">Notifications</div>
            <div class="setting-desc">Health reminders, appointment alerts</div>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">About</div>
      <div class="setting-item">
        <div class="setting-left">
          <div class="setting-icon" style="background: rgba(54,179,126,.12)">ℹ️</div>
          <div class="setting-text">
            <div class="setting-name">MedVault v1.1.0</div>
            <div class="setting-desc">Your secure medical super-app</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // ──── Accessibility Toggle Listeners ────
  container.querySelectorAll('.toggle input[data-mode]').forEach(input => {
    input.addEventListener('change', (e) => {
      const mode = e.target.dataset.mode;
      setAccessibilityMode(mode, e.target.checked);

      // Side-effects for specific modes
      if (mode === 'deaf') setDeafMode(e.target.checked);
      if (mode === 'motor') {
        if (e.target.checked) enableShake();
        else disableShake();
        // Sync shake toggle
        const shakeToggle = document.getElementById('settings-shake-toggle');
        if (shakeToggle) shakeToggle.checked = e.target.checked;
      }
    });
  });

  // ──── Safety Toggles ────
  const fallToggle = document.getElementById('settings-fall-toggle');
  if (fallToggle) {
    fallToggle.addEventListener('change', (e) => setFallDetectionEnabled(e.target.checked));
  }

  const shakeToggle = document.getElementById('settings-shake-toggle');
  if (shakeToggle) {
    shakeToggle.addEventListener('change', (e) => {
      if (e.target.checked) enableShake();
      else disableShake();
    });
  }
}
