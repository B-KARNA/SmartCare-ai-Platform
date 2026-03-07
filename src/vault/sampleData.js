// ============================================================
// Sample Data — Seeds the vault on first load
// ============================================================

import { saveProfile, saveVital, addHistory, isVaultEmpty } from './healthVault.js';

export function seedSampleData() {
    if (!isVaultEmpty()) return;

    // User Profile
    saveProfile({
        name: 'Bhuwan Karn',
        age: 28,
        gender: 'Male',
        bloodGroup: 'B+',
        allergies: ['Penicillin', 'Dust'],
        emergencyContact: {
            name: 'Anita Karn',
            phone: '+91 98765 43210',
            relation: 'Mother'
        }
    });

    // Vital Signs (last 5 readings)
    const now = Date.now();
    const vitalsData = [
        { heartRate: 72, systolic: 118, diastolic: 76, spo2: 98, temperature: 36.6, timestamp: now },
        { heartRate: 75, systolic: 120, diastolic: 78, spo2: 97, temperature: 36.7, timestamp: now - 86400000 },
        { heartRate: 68, systolic: 115, diastolic: 74, spo2: 99, temperature: 36.5, timestamp: now - 172800000 },
        { heartRate: 80, systolic: 122, diastolic: 80, spo2: 97, temperature: 36.8, timestamp: now - 259200000 },
        { heartRate: 70, systolic: 116, diastolic: 75, spo2: 98, temperature: 36.6, timestamp: now - 345600000 },
    ];
    vitalsData.reverse().forEach(v => saveVital(v));

    // Medical History
    const historyData = [
        { condition: 'Annual Health Checkup', date: '2026-03-01', doctor: 'Dr. Priya Sharma', notes: 'All vitals normal. Cholesterol slightly elevated.', type: 'checkup' },
        { condition: 'Flu Vaccination', date: '2026-02-15', doctor: 'Dr. Rajesh Gupta', notes: 'Influenza vaccine administered. No adverse reactions.', type: 'vaccination' },
        { condition: 'Blood Panel Test', date: '2026-01-20', doctor: 'Dr. Priya Sharma', notes: 'CBC, LFT, KFT — all within normal range.', type: 'lab' },
        { condition: 'Mild Allergic Reaction', date: '2025-12-10', doctor: 'Dr. Meena Patel', notes: 'Antihistamine prescribed. Resolved in 2 days.', type: 'treatment' },
    ];
    historyData.forEach(h => addHistory(h));
}
