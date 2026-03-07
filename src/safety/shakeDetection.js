// ============================================================
// Shake Detection — SOS Gesture for Physically Handicapped
// ============================================================

let shakeEnabled = false;
let lastAccel = { x: 0, y: 0, z: 0 };
let shakeThreshold = 25;
let shakeCount = 0;
let shakeTimeout = null;
let onShakeTriggered = null;

export function initShakeDetection(callback) {
    onShakeTriggered = callback;

    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleMotion, true);
    }

    // Fallback: keyboard simulation (press 'S' 3 times rapidly)
    let keyShakeCount = 0;
    let keyShakeTimer = null;
    window.addEventListener('keydown', (e) => {
        if (!shakeEnabled) return;
        if (e.key === 's' || e.key === 'S') {
            keyShakeCount++;
            clearTimeout(keyShakeTimer);
            keyShakeTimer = setTimeout(() => { keyShakeCount = 0; }, 1000);
            if (keyShakeCount >= 3) {
                keyShakeCount = 0;
                if (onShakeTriggered) onShakeTriggered();
            }
        }
    });
}

function handleMotion(event) {
    if (!shakeEnabled) return;

    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const deltaX = Math.abs(acc.x - lastAccel.x);
    const deltaY = Math.abs(acc.y - lastAccel.y);
    const deltaZ = Math.abs(acc.z - lastAccel.z);

    lastAccel = { x: acc.x, y: acc.y, z: acc.z };

    if ((deltaX + deltaY + deltaZ) > shakeThreshold) {
        shakeCount++;
        clearTimeout(shakeTimeout);
        shakeTimeout = setTimeout(() => { shakeCount = 0; }, 1500);

        if (shakeCount >= 3) {
            shakeCount = 0;
            if (onShakeTriggered) onShakeTriggered();
        }
    }
}

export function enableShake() {
    shakeEnabled = true;
}

export function disableShake() {
    shakeEnabled = false;
    shakeCount = 0;
}

export function isShakeEnabled() {
    return shakeEnabled;
}
