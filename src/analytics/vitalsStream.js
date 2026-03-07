// ============================================================
// Wearable Vitals Stream Simulator
// ============================================================

/**
 * Simulates real-time data from a connected wearable device.
 * Emits random variations around baseline vitals.
 */

// Baseline vitals
const BASELINE = {
    heartRate: 72,
    bloodPressureSys: 118,
    bloodPressureDia: 78,
    spO2: 98
};

// Current dynamic vitals
let currentVitals = { ...BASELINE };

// Listener callbacks
const listeners = [];

function generateFluctuations() {
    currentVitals.heartRate = BASELINE.heartRate + Math.floor(Math.random() * 9) - 4; // +/- 4 bpm
    currentVitals.bloodPressureSys = BASELINE.bloodPressureSys + Math.floor(Math.random() * 5) - 2;
    currentVitals.bloodPressureDia = BASELINE.bloodPressureDia + Math.floor(Math.random() * 3) - 1;

    // SpO2 rarely changes much, mostly 98-100
    const spRand = Math.random();
    currentVitals.spO2 = spRand > 0.8 ? 99 : (spRand > 0.4 ? 98 : 97);

    // Notify listeners
    listeners.forEach(cb => cb({ ...currentVitals }));
}

let intervalId = null;

export function startVitalsStream() {
    if (intervalId) return;
    // Emit new data every 2 seconds
    intervalId = setInterval(generateFluctuations, 2000);
}

export function stopVitalsStream() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

export function subscribeToVitals(callback) {
    listeners.push(callback);
    // Give immediate baseline
    callback({ ...currentVitals });
    return () => {
        const idx = listeners.indexOf(callback);
        if (idx > -1) listeners.splice(idx, 1);
    };
}

export function getCurrentVitals() {
    return { ...currentVitals };
}
