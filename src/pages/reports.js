// ============================================================
// Smart Analytics Dashboard (formerly Reports)
// ============================================================

import { startVitalsStream, stopVitalsStream, subscribeToVitals } from '../analytics/vitalsStream.js';
import { generateFullRiskProfile, RISK_LEVELS } from '../analytics/riskPrediction.js';
import { getRecommendedDiet, generateDailyMealPlan } from '../analytics/nutritionPlanner.js';
import { getProfile, getHistory, getVitals } from '../vault/healthVault.js';

export function renderReports() {
  const container = document.getElementById('reports-content');

  // 1. Fetch User Data
  const profile = getProfile();
  const history = getHistory();
  const vitals = getVitals(); // Baseline from vault

  // 2. Generate Analytics
  const latestVitals = vitals.length > 0 ? vitals[vitals.length - 1] : { heartRate: 75, bloodPressureSys: 125, bloodPressureDia: 82 };
  const riskProfile = generateFullRiskProfile(profile, history, latestVitals);
  const recommendedDiet = getRecommendedDiet(riskProfile);
  const todayMeals = generateDailyMealPlan(recommendedDiet);

  // 3. Static Reports Data (preserved from Phase 1)
  const reports = [
    { name: 'Complete Blood Count (CBC)', type: 'lab', date: 'Mar 1, 2026', doctor: 'Dr. Priya Sharma', status: 'normal' },
    { name: 'Chest X-Ray', type: 'imaging', date: 'Feb 20, 2026', doctor: 'Dr. Rajesh Gupta', status: 'normal' },
    { name: 'Lipid Profile Panel', type: 'lab', date: 'Feb 10, 2026', doctor: 'Dr. Priya Sharma', status: 'attention' },
    { name: 'Metformin 500mg Prescription', type: 'rx', date: 'Jan 25, 2026', doctor: 'Dr. Meena Patel', status: 'normal' },
    { name: 'Annual Physical Exam', type: 'visit', date: 'Jan 15, 2026', doctor: 'Dr. Priya Sharma', status: 'normal' },
    { name: 'Thyroid Function Test', type: 'lab', date: 'Dec 28, 2025', doctor: 'Dr. Rajesh Gupta', status: 'critical' },
  ];
  const typeIcons = { lab: '🧪', imaging: '📷', rx: '💊', visit: '🏥' };
  const statusLabels = { normal: 'Normal', attention: 'Review', critical: 'Critical' };

  // 4. Render UI
  container.innerHTML = `
    <!-- Top section: Title & Actions -->
    <div class="analytics-header">
      <div class="analytics-title-group">
        <div class="analytics-title">Smart Analytics</div>
        <div class="analytics-subtitle">AI-powered preventive health insights</div>
      </div>
      <button class="analytics-sync-btn" id="sync-wearable-btn">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <span>Live Vitals</span>
      </button>
    </div>

    <!-- Section 1: Wearable Dashboard (Real-time Vitals) -->
    <div class="analytics-section" id="live-vitals-section" style="display: none;">
      <div class="section-header">
        <span class="section-title">Live Wearable Data</span>
        <span class="live-indicator"><span class="pulse-dot"></span> Streaming</span>
      </div>
      <div class="live-vitals-grid">
        <div class="live-vital-card heart-rate">
          <div class="vital-icon">❤️</div>
          <div class="vital-value"><span id="live-hr">--</span> <small>bpm</small></div>
          <div class="vital-label">Heart Rate</div>
        </div>
        <div class="live-vital-card blood-pressure">
          <div class="vital-icon">🩸</div>
          <div class="vital-value"><span id="live-bp">--/--</span> <small>mmHg</small></div>
          <div class="vital-label">Blood Pressure</div>
        </div>
        <div class="live-vital-card spo2">
          <div class="vital-icon">💨</div>
          <div class="vital-value"><span id="live-spo2">--</span> <small>%</small></div>
          <div class="vital-label">Blood Oxygen</div>
        </div>
      </div>
    </div>

    <!-- Section 2: Disease Risk Prediction -->
    <div class="analytics-section">
      <div class="section-header">
        <span class="section-title">Disease Risk Profile</span>
      </div>
      <div class="risk-cards-grid">
        ${riskProfile.map(risk => `
          <div class="risk-card" style="border-left: 4px solid ${risk.level.color}">
            <div class="risk-card-header">
              <h4 class="risk-name">${risk.name}</h4>
              <span class="risk-badge" style="background: ${risk.level.bg}; color: ${risk.level.color}">
                ${risk.level.label}
              </span>
            </div>
            <div class="risk-insights">
              <ul class="risk-insight-list">
                ${risk.insights.map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
            <div class="risk-progress-bar">
              <div class="risk-progress-fill" style="width: ${Math.min(100, (risk.score / 10) * 100)}%; background: ${risk.level.color}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Section 3: AI Nutrition Planner -->
    <div class="analytics-section">
      <div class="section-header">
        <span class="section-title">AI Nutrition Planner</span>
        <span class="section-action" style="color: var(--secondary); font-size: 11px;">Tailored for you</span>
      </div>
      <div class="nutrition-card">
        <div class="diet-header">
          <div class="diet-icon">🥗</div>
          <div class="diet-info">
            <div class="diet-name">${recommendedDiet.name}</div>
            <div class="diet-desc">${recommendedDiet.description}</div>
          </div>
        </div>
        <div class="diet-restrictions">
          ${recommendedDiet.restrictions.map(r => `<span class="diet-restriction-chip">${r}</span>`).join('')}
        </div>
        
        <div class="meal-plan-daily">
          <h5 class="meal-plan-title">Today's Meal Plan</h5>
          <div class="meal-list">
            ${todayMeals.map(meal => `
              <div class="meal-item">
                <div class="meal-line"></div>
                <div class="meal-type">${meal.type}</div>
                <div class="meal-details">
                  <div class="meal-name">${meal.name}</div>
                  <div class="meal-cals">${meal.calories} kcal</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4: Document Vault (Original Reports logic) -->
    <div class="analytics-section">
      <div class="section-header">
        <span class="section-title">Medical Records</span>
      </div>
      <div class="filter-chips">
        <button class="filter-chip active" data-filter="all">All</button>
        <button class="filter-chip" data-filter="lab">Lab Tests</button>
        <button class="filter-chip" data-filter="imaging">Imaging</button>
        <button class="filter-chip" data-filter="rx">Prescriptions</button>
        <button class="filter-chip" data-filter="visit">Visits</button>
      </div>

      <div class="report-list" id="report-list">
        ${reports.map(r => `
          <div class="report-card category-${r.type}" data-type="${r.type}">
            <div class="report-icon ${r.type}">${typeIcons[r.type]}</div>
            <div class="report-info">
              <div class="report-name">${r.name}</div>
              <div class="report-meta">
                <span>${r.date}</span>
                <span>•</span>
                <span>${r.doctor}</span>
              </div>
            </div>
            <span class="report-badge ${r.status}">${statusLabels[r.status]}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // ──── Interaction Logic ────

  // 1. Wearable Stream Toggle
  const syncBtn = document.getElementById('sync-wearable-btn');
  const vitalsSection = document.getElementById('live-vitals-section');
  let streamActive = false;
  let unsubscribe = null;

  syncBtn.addEventListener('click', () => {
    streamActive = !streamActive;

    if (streamActive) {
      syncBtn.classList.add('active');
      syncBtn.querySelector('span').textContent = 'Stop Sync';
      vitalsSection.style.display = 'block';
      vitalsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

      startVitalsStream();
      unsubscribe = subscribeToVitals((data) => {
        document.getElementById('live-hr').textContent = data.heartRate;
        document.getElementById('live-bp').textContent = `${data.bloodPressureSys}/${data.bloodPressureDia}`;
        document.getElementById('live-spo2').textContent = data.spO2;

        // Add a micro-animation class to indicate update
        const els = [document.getElementById('live-hr'), document.getElementById('live-bp'), document.getElementById('live-spo2')];
        els.forEach(el => {
          el.classList.remove('vital-pop');
          void el.offsetWidth; // trigger reflow
          el.classList.add('vital-pop');
        });
      });
    } else {
      syncBtn.classList.remove('active');
      syncBtn.querySelector('span').textContent = 'Live Vitals';
      vitalsSection.style.display = 'none';
      stopVitalsStream();
      if (unsubscribe) unsubscribe();
    }
  });

  // 2. Reports Filtering (Legacy functionality)
  const chipContainer = container.querySelector('.filter-chips');
  chipContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;

    chipContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.dataset.filter;
    container.querySelectorAll('.report-list .report-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.type === filter) ? 'flex' : 'none';
    });
  });
}
