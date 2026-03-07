// ============================================================
// Multi-Agent Definitions
// ============================================================

export const AGENTS = {
    triage: {
        id: 'triage',
        name: 'Triage Agent',
        icon: '🧠',
        color: '#7C3AED',
        gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
        thinkingText: 'Triage Agent routing your query...',
        description: 'Routes your query to the right specialist agent'
    },
    symptom: {
        id: 'symptom',
        name: 'Symptom Agent',
        icon: '🩺',
        color: '#FF5630',
        gradient: 'linear-gradient(135deg, #FF5630, #FF7452)',
        thinkingText: 'Symptom Agent analyzing...',
        description: 'Analyzes symptoms and suggests possible conditions'
    },
    prescription: {
        id: 'prescription',
        name: 'Prescription Agent',
        icon: '💊',
        color: '#36B37E',
        gradient: 'linear-gradient(135deg, #36B37E, #57D9A3)',
        thinkingText: 'Prescription Agent reading...',
        description: 'Manages medications, dosages, and reminders'
    },
    report: {
        id: 'report',
        name: 'Report Agent',
        icon: '📋',
        color: '#0052CC',
        gradient: 'linear-gradient(135deg, #0052CC, #2684FF)',
        thinkingText: 'Report Agent processing...',
        description: 'Reads and summarizes medical reports & lab results'
    },
    wellness: {
        id: 'wellness',
        name: 'Wellness Agent',
        icon: '🌿',
        color: '#00B8D9',
        gradient: 'linear-gradient(135deg, #00B8D9, #4DD0E1)',
        thinkingText: 'Wellness Agent composing...',
        description: 'Provides health tips, lifestyle advice, and risk assessment'
    }
};

// ──── Intent Detection Keywords ────

const SYMPTOM_KEYWORDS = [
    'pain', 'ache', 'hurt', 'sore', 'fever', 'cough', 'cold', 'headache',
    'nausea', 'vomit', 'dizzy', 'fatigue', 'tired', 'swelling', 'rash',
    'itch', 'burning', 'cramp', 'bleeding', 'chest pain', 'shortness of breath',
    'symptom', 'sick', 'unwell', 'feeling bad', 'stomach', 'throat', 'back pain',
    'joint', 'muscle', 'migraine', 'allergy', 'sneeze', 'chills', 'weak'
];

const PRESCRIPTION_KEYWORDS = [
    'medicine', 'medication', 'drug', 'prescription', 'dosage', 'tablet',
    'capsule', 'pill', 'dose', 'side effect', 'reminder', 'schedule',
    'refill', 'pharmacy', 'antibiotic', 'painkiller', 'insulin', 'metformin'
];

const REPORT_KEYWORDS = [
    'report', 'lab', 'test', 'result', 'blood test', 'cbc', 'x-ray', 'scan',
    'mri', 'ct', 'ultrasound', 'biopsy', 'pathology', 'cholesterol', 'sugar',
    'hemoglobin', 'thyroid', 'lipid', 'ecg', 'ekg', 'reading', 'value'
];

const WELLNESS_KEYWORDS = [
    'diet', 'exercise', 'sleep', 'stress', 'mental health', 'yoga', 'meditation',
    'weight', 'bmi', 'nutrition', 'vitamin', 'hydration', 'water', 'wellness',
    'lifestyle', 'tip', 'advice', 'healthy', 'risk', 'prevention', 'fitness'
];

/**
 * Detect which agent should handle a given message.
 * Returns the agent object.
 */
export function detectIntent(text) {
    const lower = text.toLowerCase();

    // Score each agent
    const scores = {
        symptom: SYMPTOM_KEYWORDS.filter(k => lower.includes(k)).length,
        prescription: PRESCRIPTION_KEYWORDS.filter(k => lower.includes(k)).length,
        report: REPORT_KEYWORDS.filter(k => lower.includes(k)).length,
        wellness: WELLNESS_KEYWORDS.filter(k => lower.includes(k)).length,
    };

    // Find highest score
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (best[1] > 0) return AGENTS[best[0]];

    // Default to wellness for general health queries
    return AGENTS.wellness;
}

/**
 * For file uploads, always route to report agent
 */
export function getUploadAgent() {
    return AGENTS.report;
}

// ──── Simulated Agent Responses ────

const AGENT_RESPONSES = {
    symptom: [
        {
            type: 'text',
            content: `Based on your symptoms, I'm running a preliminary analysis. Here's what I found:`
        },
        {
            type: 'risk-gauge',
            data: {
                condition: 'Tension Headache',
                risk: 35,
                level: 'Low',
                factors: ['Stress', 'Dehydration', 'Screen time'],
                recommendation: 'Rest, hydration, and OTC pain relief. Consult a doctor if symptoms persist beyond 48 hours.'
            }
        }
    ],
    prescription: [
        {
            type: 'text',
            content: `I've found your current medication information. Here's a summary:`
        },
        {
            type: 'medication-card',
            data: {
                name: 'Metformin 500mg',
                dosage: '1 tablet twice daily',
                timing: 'After breakfast & dinner',
                refillDate: 'Mar 15, 2026',
                doctor: 'Dr. Meena Patel',
                instructions: 'Take with food. Avoid alcohol. Monitor blood sugar regularly.'
            }
        }
    ],
    report: [
        {
            type: 'text',
            content: `I've analyzed your medical report. Here's a structured summary:`
        },
        {
            type: 'report-summary',
            data: {
                title: 'Complete Blood Count (CBC)',
                date: 'Mar 1, 2026',
                doctor: 'Dr. Priya Sharma',
                lab: 'MedVault Diagnostics',
                findings: [
                    { name: 'Hemoglobin', value: '14.2 g/dL', status: 'normal', range: '13.5-17.5' },
                    { name: 'WBC Count', value: '7,200 /μL', status: 'normal', range: '4,500-11,000' },
                    { name: 'Platelets', value: '2.8 L/μL', status: 'attention', range: '1.5-4.0' },
                    { name: 'RBC Count', value: '5.1 M/μL', status: 'normal', range: '4.7-6.1' }
                ],
                summary: 'Overall results are within normal range. Platelet count is slightly elevated but within acceptable limits. Follow-up recommended in 3 months.'
            }
        }
    ],
    wellness: [
        {
            type: 'text',
            content: `Here are some personalized wellness recommendations based on your health profile:`
        },
        {
            type: 'risk-gauge',
            data: {
                condition: 'Cardiovascular Risk',
                risk: 22,
                level: 'Low',
                factors: ['Good BP readings', 'Normal heart rate', 'Active lifestyle'],
                recommendation: 'Your cardiovascular health is excellent! Continue regular exercise (150 min/week) and maintain a balanced diet rich in omega-3 fatty acids.'
            }
        }
    ]
};

export function getAgentResponse(agentId) {
    return AGENT_RESPONSES[agentId] || AGENT_RESPONSES.wellness;
}

/** For file upload scenarios — return an OCR report analysis */
export function getOCRResponse() {
    return [
        {
            type: 'text',
            content: `📂 File received! I'm running OCR analysis on your uploaded document...`
        },
        {
            type: 'report-summary',
            data: {
                title: 'Scanned Prescription — OCR Analysis',
                date: 'Mar 5, 2026',
                doctor: 'Dr. Rajesh Gupta',
                lab: 'Digitized via MedVault OCR',
                findings: [
                    { name: 'Amoxicillin 500mg', value: '3x daily', status: 'normal', range: '7 days' },
                    { name: 'Pantoprazole 40mg', value: '1x morning', status: 'normal', range: '14 days' },
                    { name: 'Cetirizine 10mg', value: '1x at night', status: 'normal', range: '5 days' }
                ],
                summary: 'Prescription digitized successfully. 3 medications identified. Tap "Set Reminder" to schedule dosage alerts.'
            }
        }
    ];
}
