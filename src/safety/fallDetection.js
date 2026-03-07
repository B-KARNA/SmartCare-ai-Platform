// ============================================================
// Fall Detection Simulator
// ============================================================

const STORAGE_KEY = 'medvault_fall_detection';

let fallDetectionEnabled = false;
let countdownTimer = null;
let countdownValue = 10;
let onCountdownTick = null;
let onAlertSent = null;
let onCancelled = null;

export function isFallDetectionEnabled() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || false;
    } catch { return false; }
}

export function setFallDetectionEnabled(enabled) {
    fallDetectionEnabled = enabled;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
}

export function initFallDetection(callbacks = {}) {
    onCountdownTick = callbacks.onTick || null;
    onAlertSent = callbacks.onAlert || null;
    onCancelled = callbacks.onCancel || null;
    fallDetectionEnabled = isFallDetectionEnabled();
}

/** Simulates a fall/impact detection event */
export function triggerFallDetected() {
    if (countdownTimer) return; // already counting

    countdownValue = 10;
    if (onCountdownTick) onCountdownTick(countdownValue, 'started');

    countdownTimer = setInterval(() => {
        countdownValue--;
        if (onCountdownTick) onCountdownTick(countdownValue, 'counting');

        if (countdownValue <= 0) {
            clearInterval(countdownTimer);
            countdownTimer = null;
            sendEmergencyAlert();
        }
    }, 1000);
}

export function cancelFallCountdown() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        countdownValue = 10;
        if (onCancelled) onCancelled();
    }
}

function sendEmergencyAlert() {
    // Simulate GPS coordinates
    const gps = {
        lat: 28.6139 + (Math.random() * 0.01 - 0.005),
        lng: 77.2090 + (Math.random() * 0.01 - 0.005)
    };
    const mapsUrl = `https://maps.google.com/?q=${gps.lat.toFixed(6)},${gps.lng.toFixed(6)}`;

    const alertData = {
        timestamp: new Date().toISOString(),
        type: 'FALL_DETECTED',
        gps,
        mapsUrl,
        message: `🚨 FALL DETECTED — MedVault Emergency\nPatient may have fallen.\nGPS: ${gps.lat.toFixed(6)}, ${gps.lng.toFixed(6)}\nMap: ${mapsUrl}\nTime: ${new Date().toLocaleString('en-IN')}`
    };

    if (onAlertSent) onAlertSent(alertData);
}

export function isCountdownActive() {
    return countdownTimer !== null;
}
