// ============================================================
// Deaf Support — Visual Transcription System
// ============================================================

let deafModeActive = false;
let toastContainer = null;

export function initDeafSupport() {
    // Create a persistent toast container for visual alerts
    if (!document.getElementById('deaf-visual-alerts')) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'deaf-visual-alerts';
        toastContainer.className = 'deaf-visual-alerts';
        document.getElementById('app').appendChild(toastContainer);
    } else {
        toastContainer = document.getElementById('deaf-visual-alerts');
    }
}

export function setDeafMode(active) {
    deafModeActive = active;
}

export function isDeafMode() {
    return deafModeActive;
}

/**
 * Show an animated visual notification with medical icon and text.
 * Replaces audio/voice alerts for deaf users.
 * @param {string} message — The text content
 * @param {string} type — 'info' | 'warning' | 'emergency' | 'success'
 * @param {number} duration — ms to show (default 4000)
 */
export function showVisualAlert(message, type = 'info', duration = 4000) {
    if (!toastContainer) initDeafSupport();

    const icons = {
        info: '💬',
        warning: '⚠️',
        emergency: '🚨',
        success: '✅',
        medication: '💊',
        heartbeat: '❤️',
        alert: '🔔'
    };

    const colors = {
        info: '#00B8D9',
        warning: '#FFAB00',
        emergency: '#FF5630',
        success: '#36B37E',
        medication: '#36B37E',
        heartbeat: '#FF5630',
        alert: '#0052CC'
    };

    const toast = document.createElement('div');
    toast.className = `deaf-toast deaf-toast-${type}`;
    toast.style.borderLeftColor = colors[type] || colors.info;
    toast.innerHTML = `
    <div class="deaf-toast-icon" style="background: ${colors[type] || colors.info}22; color: ${colors[type] || colors.info}">
      ${icons[type] || icons.info}
    </div>
    <div class="deaf-toast-content">
      <div class="deaf-toast-label">Visual Alert</div>
      <div class="deaf-toast-message">${message}</div>
    </div>
    <div class="deaf-toast-progress" style="background: ${colors[type] || colors.info}">
    </div>
  `;

    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
        const progress = toast.querySelector('.deaf-toast-progress');
        if (progress) {
            progress.style.transition = `width ${duration}ms linear`;
            progress.style.width = '0%';
        }
    });

    // Auto-dismiss
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Convert any audio/notification event to visual display
 * Should be called whenever audio output would normally occur
 */
export function transcribeAudioEvent(eventType, details) {
    if (!deafModeActive) return;

    const transcriptions = {
        'sos_triggered': { msg: '🚨 SOS ALERT TRIGGERED — Emergency contacts being notified', type: 'emergency' },
        'fall_detected': { msg: '⚠️ FALL DETECTED — Impact sensed, countdown started', type: 'warning' },
        'fall_countdown': { msg: `⏱️ Fall countdown: ${details} seconds remaining — Tap to cancel`, type: 'warning' },
        'fall_alert_sent': { msg: '📱 Emergency SMS sent with GPS location to all contacts', type: 'emergency' },
        'fall_cancelled': { msg: '✅ Fall alert cancelled — No emergency action taken', type: 'success' },
        'reminder_set': { msg: '🔔 Medication reminder has been set successfully', type: 'success' },
        'shake_detected': { msg: '📳 Shake gesture detected — SOS triggering...', type: 'warning' },
        'voice_input': { msg: `🎙️ Voice transcription: "${details}"`, type: 'info' },
        'notification': { msg: details || 'New notification received', type: 'info' },
    };

    const t = transcriptions[eventType] || { msg: details || eventType, type: 'info' };
    showVisualAlert(t.msg, t.type);
}
