// ============================================================
// Disease Risk Prediction Engine
// ============================================================

/**
 * Evaluates user profile, history, and current vitals to assess risks
 * for common conditions like Cardiovascular Disease and Type 2 Diabetes.
 */

export const RISK_LEVELS = {
    LOW: { label: 'Low Risk', color: '#36B37E', bg: 'rgba(54,179,126,.15)' },
    MODERATE: { label: 'Moderate Risk', color: '#FFAB00', bg: 'rgba(255,171,0,.15)' },
    HIGH: { label: 'High Risk', color: '#FF5630', bg: 'rgba(255,86,48,.15)' }
};

export function calculateCardioRisk(profile, history, vitals) {
    let score = 0; // 0-10 scale
    let insights = [];

    // Age factor
    if (profile.age > 45) {
        score += 2;
        insights.push('Age > 45 increases baseline risk.');
    }

    // BP factor
    if (vitals.bloodPressureSys > 130 || vitals.bloodPressureDia > 85) {
        score += 3;
        insights.push('Elevated blood pressure detected. Monitor sodium intake.');
    } else {
        insights.push('Blood pressure is in a healthy range.');
    }

    // History factors
    const hasHistory = history.some(h =>
        h.condition.toLowerCase().includes('heart') ||
        h.condition.toLowerCase().includes('cholesterol') ||
        h.condition.toLowerCase().includes('hypertension')
    );
    if (hasHistory) {
        score += 4;
        insights.push('Past medical history indicates cardio factors.');
    }

    let level = RISK_LEVELS.LOW;
    let severity = 'low';
    if (score >= 6) { level = RISK_LEVELS.HIGH; severity = 'high'; }
    else if (score >= 3) { level = RISK_LEVELS.MODERATE; severity = 'moderate'; }

    return { name: 'Cardiovascular Risk', score, level, severity, insights };
}

export function calculateDiabetesRisk(profile, history, vitals) {
    let score = 0;
    let insights = [];

    // Age factor
    if (profile.age > 40) score += 1;

    // History factors
    const hasHistory = history.some(h =>
        h.condition.toLowerCase().includes('diabetes') ||
        h.condition.toLowerCase().includes('sugar') ||
        h.condition.toLowerCase().includes('pcos')
    );
    if (hasHistory) {
        score += 5;
        insights.push('Pre-existing conditions linked to glycemic risk found.');
    } else {
        insights.push('No immediate history of glycemic issues.');
    }

    // Activity proxy (simulated via resting HR for now)
    if (vitals.heartRate > 85) {
        score += 2;
        insights.push('Higher resting heart rate suggests lower cardiovascular fitness, a secondary risk factor.');
    } else {
        insights.push('Excellent resting heart rate indicates good fitness.');
    }

    let level = RISK_LEVELS.LOW;
    let severity = 'low';
    if (score >= 6) { level = RISK_LEVELS.HIGH; severity = 'high'; }
    else if (score >= 3) { level = RISK_LEVELS.MODERATE; severity = 'moderate'; }

    return { name: 'Type 2 Diabetes Risk', score, level, severity, insights };
}

export function generateFullRiskProfile(profile, history, vitals) {
    // Use fallbacks if not provided
    const _profile = profile || { age: 35, gender: 'Male' };
    const _history = history || [];
    const _vitals = vitals || { heartRate: 72, bloodPressureSys: 118, bloodPressureDia: 78 };

    const cardio = calculateCardioRisk(_profile, _history, _vitals);
    const diabetes = calculateDiabetesRisk(_profile, _history, _vitals);

    return [cardio, diabetes];
}
