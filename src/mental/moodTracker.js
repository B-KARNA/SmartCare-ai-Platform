// ============================================================
// Mood Tracker — Daily Mood Check-in & History
// ============================================================

const STORAGE_KEY = 'medvault_mood_history';

export const MOODS = [
    { emoji: '😄', label: 'Great', value: 5, color: '#36B37E' },
    { emoji: '🙂', label: 'Good', value: 4, color: '#00B8D9' },
    { emoji: '😐', label: 'Okay', value: 3, color: '#FFAB00' },
    { emoji: '😔', label: 'Low', value: 2, color: '#FF7452' },
    { emoji: '😢', label: 'Bad', value: 1, color: '#FF5630' },
];

export function getMoodHistory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
}

export function saveMoodEntry(entry) {
    const history = getMoodHistory();
    // Replace if same date already exists
    const today = new Date().toISOString().slice(0, 10);
    const idx = history.findIndex(h => h.date === today);
    const record = { ...entry, date: today, timestamp: Date.now() };
    if (idx >= 0) history[idx] = record;
    else history.push(record);

    // Keep last 30 days only
    const trimmed = history.slice(-30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function getTodayMood() {
    const today = new Date().toISOString().slice(0, 10);
    const history = getMoodHistory();
    return history.find(h => h.date === today) || null;
}

export function getLast7Days() {
    const history = getMoodHistory();
    return history.slice(-7);
}

/** Seed some sample mood data if none exists */
export function seedMoodData() {
    if (getMoodHistory().length > 0) return;
    const now = Date.now();
    const sampleMoods = [
        { value: 4, emoji: '🙂', label: 'Good', note: 'Nice morning walk' },
        { value: 5, emoji: '😄', label: 'Great', note: 'Got promoted at work!' },
        { value: 3, emoji: '😐', label: 'Okay', note: 'Average day' },
        { value: 4, emoji: '🙂', label: 'Good', note: 'Dinner with friends' },
        { value: 2, emoji: '😔', label: 'Low', note: 'Feeling tired' },
        { value: 3, emoji: '😐', label: 'Okay', note: 'Work was stressful' },
        { value: 4, emoji: '🙂', label: 'Good', note: 'Great workout session' },
    ];
    const entries = sampleMoods.map((m, i) => ({
        ...m,
        date: new Date(now - (6 - i) * 86400000).toISOString().slice(0, 10),
        timestamp: now - (6 - i) * 86400000
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
