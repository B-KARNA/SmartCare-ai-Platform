// ============================================================
// Home Page — Health Dashboard
// ============================================================

import { getLatestVitals, getHistory, getProfile } from '../vault/healthVault.js';

export function renderHome() {
    const container = document.getElementById('home-content');
    const vitals = getLatestVitals();
    const history = getHistory();
    const profile = getProfile();

    const hr = vitals?.heartRate || 72;
    const sys = vitals?.systolic || 118;
    const dia = vitals?.diastolic || 76;
    const spo2 = vitals?.spo2 || 98;
    const temp = vitals?.temperature || 36.6;

    // Calculate health score (simple weighted average)
    const hrScore = hr >= 60 && hr <= 100 ? 25 : (hr >= 50 && hr <= 110 ? 15 : 5);
    const bpScore = sys >= 90 && sys <= 130 && dia >= 60 && dia <= 85 ? 25 : 15;
    const spo2Score = spo2 >= 95 ? 25 : (spo2 >= 90 ? 15 : 5);
    const tempScore = temp >= 36.1 && temp <= 37.2 ? 25 : 15;
    const healthScore = hrScore + bpScore + spo2Score + tempScore;

    const scoreStatus = healthScore >= 85 ? 'Excellent' : healthScore >= 70 ? 'Good' : healthScore >= 50 ? 'Fair' : 'Needs Attention';
    const circumference = 2 * Math.PI * 80; // radius 80

    container.innerHTML = `
    <!-- Health Score Card -->
    <div class="card card-glass" style="margin-bottom: var(--space-lg); overflow: visible;">
      <div class="health-score-container">
        <div class="gauge-wrapper">
          <svg class="gauge-svg" width="180" height="180" viewBox="0 0 180 180">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0052CC"/>
                <stop offset="100%" stop-color="#00B8D9"/>
              </linearGradient>
            </defs>
            <circle class="gauge-bg" cx="90" cy="90" r="80"/>
            <circle class="gauge-fill" cx="90" cy="90" r="80"
              style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference};"
              data-target="${circumference - (circumference * healthScore / 100)}"/>
          </svg>
          <div class="gauge-center">
            <div class="gauge-score" data-target="${healthScore}">0</div>
            <div class="gauge-label">Health Score</div>
          </div>
        </div>
        <div class="gauge-status">${scoreStatus}</div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="section-header">
      <span class="section-title">Vital Signs</span>
      <span class="section-action">View All</span>
    </div>
    <div class="stats-grid">
      <div class="stat-card heart">
        <div class="stat-icon heart">❤️</div>
        <div class="stat-value">${hr} <span class="stat-unit">bpm</span></div>
        <div class="stat-label">Heart Rate</div>
      </div>
      <div class="stat-card bp">
        <div class="stat-icon bp">🩸</div>
        <div class="stat-value">${sys}/${dia} <span class="stat-unit">mmHg</span></div>
        <div class="stat-label">Blood Pressure</div>
      </div>
      <div class="stat-card spo2">
        <div class="stat-icon spo2">💧</div>
        <div class="stat-value">${spo2}<span class="stat-unit">%</span></div>
        <div class="stat-label">SpO₂ Level</div>
      </div>
      <div class="stat-card temp">
        <div class="stat-icon temp">🌡️</div>
        <div class="stat-value">${temp}<span class="stat-unit">°C</span></div>
        <div class="stat-label">Temperature</div>
      </div>
    </div>

    <!-- Health History Timeline -->
    <div class="section-header">
      <span class="section-title">Health History</span>
      <span class="section-action">See All</span>
    </div>
    <div class="timeline" id="health-timeline">
      ${history.slice(0, 4).map((h, i) => `
        <div class="timeline-item">
          <div class="timeline-dot ${i === 0 ? 'active' : ''}"></div>
          <div class="timeline-card">
            <div class="timeline-date">${formatDate(h.date)}</div>
            <div class="timeline-title">${h.condition}</div>
            <div class="timeline-desc">${h.notes}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

    // Animate gauge
    requestAnimationFrame(() => {
        setTimeout(() => {
            const gaugeFill = container.querySelector('.gauge-fill');
            if (gaugeFill) {
                gaugeFill.style.strokeDashoffset = gaugeFill.dataset.target;
            }
            // Animate score number
            const scoreEl = container.querySelector('.gauge-score');
            if (scoreEl) animateNumber(scoreEl, 0, healthScore, 1200);
        }, 100);
    });
}

function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(from + (to - from) * eased);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
