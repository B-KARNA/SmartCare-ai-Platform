// ============================================================
// MedVault — Secure Health Vault (localStorage-backed)
// ============================================================

const VAULT_PREFIX = 'medvault_';

function encode(data) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function decode(str) {
    try {
        return JSON.parse(decodeURIComponent(escape(atob(str))));
    } catch {
        return null;
    }
}

function vaultGet(key) {
    const raw = localStorage.getItem(VAULT_PREFIX + key);
    return raw ? decode(raw) : null;
}

function vaultSet(key, data) {
    localStorage.setItem(VAULT_PREFIX + key, encode(data));
}

// ──── Schema Definitions ────

const SCHEMA = {
    profile: {
        name: '', age: null, gender: '', bloodGroup: '',
        allergies: [], emergencyContact: { name: '', phone: '', relation: '' }
    },
    vitals: [], // Array of { heartRate, systolic, diastolic, spo2, temperature, timestamp }
    history: [] // Array of { condition, date, doctor, notes, type }
};

// ──── Public API ────

export function getProfile() {
    return vaultGet('profile') || { ...SCHEMA.profile };
}

export function saveProfile(profile) {
    vaultSet('profile', profile);
}

export function getVitals() {
    return vaultGet('vitals') || [];
}

export function saveVital(vital) {
    const vitals = getVitals();
    vitals.unshift({ ...vital, timestamp: vital.timestamp || Date.now() });
    vaultSet('vitals', vitals);
}

export function getLatestVitals() {
    const vitals = getVitals();
    return vitals.length > 0 ? vitals[0] : null;
}

export function getHistory() {
    return vaultGet('history') || [];
}

export function addHistory(entry) {
    const history = getHistory();
    history.unshift({ ...entry, id: Date.now() });
    vaultSet('history', history);
}

export function clearVault() {
    Object.keys(localStorage)
        .filter(k => k.startsWith(VAULT_PREFIX))
        .forEach(k => localStorage.removeItem(k));
}

export function isVaultEmpty() {
    return !vaultGet('profile') && (!vaultGet('vitals') || vaultGet('vitals').length === 0);
}
