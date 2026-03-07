// ============================================================
// AI Chat Page — Multi-Agent Medical System
// ============================================================

import { AGENTS, detectIntent, getUploadAgent, getAgentResponse, getOCRResponse } from '../agents/agentDefinitions.js';

export function renderChat() {
  const container = document.getElementById('chat-content');

  container.innerHTML = `
    <div class="chat-container">
      <!-- Agent Roster Bar -->
      <div class="agent-roster" id="agent-roster">
        ${Object.values(AGENTS).map(a => `
          <div class="agent-chip" data-agent="${a.id}" title="${a.description}">
            <span class="agent-chip-icon" style="background: ${a.gradient}">${a.icon}</span>
            <span class="agent-chip-name">${a.name.replace(' Agent', '')}</span>
          </div>
        `).join('')}
      </div>

      <!-- Chat Messages Area -->
      <div class="chat-messages" id="chat-messages">
        <!-- Welcome message -->
        <div class="agent-label-row">
          <span class="agent-label-icon" style="background: ${AGENTS.triage.gradient}">${AGENTS.triage.icon}</span>
          <span class="agent-label-name">${AGENTS.triage.name}</span>
        </div>
        <div class="chat-bubble ai">
          Welcome to <strong>MedVault AI</strong> — a multi-agent medical system. I'll route your queries to the right specialist:<br><br>
          🩺 <strong>Symptom Agent</strong> — Describe pain or symptoms<br>
          💊 <strong>Prescription Agent</strong> — Medication queries<br>
          📋 <strong>Report Agent</strong> — Upload or ask about reports<br>
          🌿 <strong>Wellness Agent</strong> — Health tips & risk assessment<br><br>
          Try typing a symptom, uploading a report, or asking about your medications!
        </div>
      </div>

      <!-- Suggestion Chips -->
      <div class="chat-suggestions" id="chat-suggestions">
        <button class="chat-suggestion-chip" data-msg="I have a persistent headache and feel dizzy">🩺 Symptom Check</button>
        <button class="chat-suggestion-chip" data-msg="What medications am I currently taking?">💊 Medications</button>
        <button class="chat-suggestion-chip" data-msg="Analyze my latest blood test report">📋 Lab Report</button>
        <button class="chat-suggestion-chip" data-msg="What's my cardiovascular disease risk?">🌿 Risk Check</button>
      </div>

      <!-- Rich Input Bar -->
      <div class="chat-input-bar-multi" id="chat-input-bar">
        <input type="file" id="chat-file-input" accept="image/*,.pdf" style="display:none" />
        <button class="chat-action-btn" id="btn-upload" aria-label="Upload report or image" title="Upload report/prescription">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <button class="chat-action-btn" id="btn-mic" aria-label="Voice input" title="Voice to text">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>
        <input type="text" class="chat-input" id="chat-input" placeholder="Describe symptoms, ask about meds..." />
        <button class="chat-send-btn" id="chat-send-btn" aria-label="Send message">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // ──── DOM refs ────
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const messages = document.getElementById('chat-messages');
  const suggestions = document.getElementById('chat-suggestions');
  const fileInput = document.getElementById('chat-file-input');
  const btnUpload = document.getElementById('btn-upload');
  const btnMic = document.getElementById('btn-mic');

  // ──── Helpers ────

  function scrollToBottom() {
    requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
  }

  function addAgentLabel(agent) {
    const row = document.createElement('div');
    row.className = 'agent-label-row';
    row.innerHTML = `
      <span class="agent-label-icon" style="background: ${agent.gradient}">${agent.icon}</span>
      <span class="agent-label-name">${agent.name}</span>
    `;
    messages.appendChild(row);
  }

  function addTextBubble(content, type) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + type;
    if (type === 'ai') {
      bubble.innerHTML = content;
    } else {
      bubble.textContent = content;
    }
    messages.appendChild(bubble);
    scrollToBottom();
  }

  function addThinkingIndicator(agent) {
    const el = document.createElement('div');
    el.className = 'thinking-indicator';
    el.id = 'thinking-indicator';
    el.innerHTML = `
      <span class="thinking-avatar" style="background: ${agent.gradient}">${agent.icon}</span>
      <div class="thinking-content">
        <span class="thinking-text">${agent.thinkingText}</span>
        <span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
      </div>
    `;
    messages.appendChild(el);
    scrollToBottom();
  }

  function removeThinking() {
    const el = document.getElementById('thinking-indicator');
    if (el) el.remove();
  }

  function highlightAgent(agentId) {
    document.querySelectorAll('.agent-chip').forEach(c => c.classList.remove('active'));
    const chip = document.querySelector(`.agent-chip[data-agent="${agentId}"]`);
    if (chip) chip.classList.add('active');
  }

  // ──── Rich Card Renderers ────

  function renderReportSummary(data) {
    const el = document.createElement('div');
    el.className = 'chat-card report-summary-card';
    el.innerHTML = `
      <div class="card-header-row">
        <span class="card-badge" style="background: rgba(0,82,204,.12); color: #2684FF;">📋 Report</span>
        <span class="card-date">${data.date}</span>
      </div>
      <div class="card-title">${data.title}</div>
      <div class="card-meta">${data.doctor} • ${data.lab}</div>
      <div class="findings-table">
        <div class="findings-header">
          <span>Test</span><span>Value</span><span>Range</span><span>Status</span>
        </div>
        ${data.findings.map(f => `
          <div class="findings-row">
            <span class="finding-name">${f.name}</span>
            <span class="finding-value">${f.value}</span>
            <span class="finding-range">${f.range}</span>
            <span class="finding-status ${f.status}">${f.status === 'normal' ? '✅' : f.status === 'attention' ? '⚠️' : '🔴'}</span>
          </div>
        `).join('')}
      </div>
      <div class="card-summary">${data.summary}</div>
    `;
    messages.appendChild(el);
    scrollToBottom();
  }

  function renderMedicationCard(data) {
    const el = document.createElement('div');
    el.className = 'chat-card medication-card';
    el.innerHTML = `
      <div class="card-header-row">
        <span class="card-badge" style="background: rgba(54,179,126,.12); color: #36B37E;">💊 Medication</span>
      </div>
      <div class="card-title">${data.name}</div>
      <div class="med-details">
        <div class="med-detail-row"><span class="med-label">Dosage</span><span class="med-value">${data.dosage}</span></div>
        <div class="med-detail-row"><span class="med-label">Timing</span><span class="med-value">${data.timing}</span></div>
        <div class="med-detail-row"><span class="med-label">Refill</span><span class="med-value">${data.refillDate}</span></div>
        <div class="med-detail-row"><span class="med-label">Doctor</span><span class="med-value">${data.doctor}</span></div>
      </div>
      <div class="card-summary">${data.instructions}</div>
      <button class="set-reminder-btn" id="set-reminder-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        Set Reminder
      </button>
    `;
    messages.appendChild(el);

    // Reminder button
    el.querySelector('.set-reminder-btn').addEventListener('click', () => {
      const btn = el.querySelector('.set-reminder-btn');
      btn.innerHTML = '✅ Reminder Set!';
      btn.classList.add('set');
      btn.disabled = true;
    });

    scrollToBottom();
  }

  function renderRiskGauge(data) {
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (circumference * data.risk / 100);
    const riskColor = data.risk < 30 ? '#36B37E' : data.risk < 60 ? '#FFAB00' : '#FF5630';

    const el = document.createElement('div');
    el.className = 'chat-card risk-gauge-card';
    el.innerHTML = `
      <div class="card-header-row">
        <span class="card-badge" style="background: ${riskColor}22; color: ${riskColor};">⚡ Risk Assessment</span>
        <span class="risk-level" style="color: ${riskColor}">${data.level} Risk</span>
      </div>
      <div class="risk-gauge-row">
        <div class="mini-gauge">
          <svg width="84" height="84" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="36" fill="none" stroke="var(--bg-elevated)" stroke-width="6"/>
            <circle cx="42" cy="42" r="36" fill="none" stroke="${riskColor}" stroke-width="6"
              stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"
              data-target="${offset}" class="risk-fill"
              transform="rotate(-90 42 42)"/>
          </svg>
          <span class="mini-gauge-value" style="color: ${riskColor}" data-target="${data.risk}">0%</span>
        </div>
        <div class="risk-info">
          <div class="risk-condition">${data.condition}</div>
          <div class="risk-factors">
            ${data.factors.map(f => `<span class="risk-factor-tag">${f}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="card-summary">${data.recommendation}</div>
    `;
    messages.appendChild(el);

    // Animate gauge
    requestAnimationFrame(() => {
      setTimeout(() => {
        const fill = el.querySelector('.risk-fill');
        if (fill) fill.style.strokeDashoffset = fill.dataset.target;

        const valEl = el.querySelector('.mini-gauge-value');
        if (valEl) animateNumber(valEl, 0, data.risk, 1000, '%');
      }, 100);
    });

    scrollToBottom();
  }

  function animateNumber(el, from, to, duration, suffix = '') {
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ──── Render response items ────

  function renderResponseItems(items) {
    items.forEach((item, i) => {
      setTimeout(() => {
        if (item.type === 'text') addTextBubble(item.content, 'ai');
        else if (item.type === 'report-summary') renderReportSummary(item.data);
        else if (item.type === 'medication-card') renderMedicationCard(item.data);
        else if (item.type === 'risk-gauge') renderRiskGauge(item.data);
      }, i * 400);
    });
  }

  // ──── Send Message Handler ────

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    addTextBubble(text, 'user');
    input.value = '';

    // Hide suggestions after first message
    suggestions.style.display = 'none';

    // Detect intent
    const agent = detectIntent(text);
    highlightAgent(agent.id);

    // Show thinking state
    addThinkingIndicator(agent);

    // Simulate agent processing
    const thinkTime = 1200 + Math.random() * 800;
    setTimeout(() => {
      removeThinking();
      addAgentLabel(agent);
      const response = getAgentResponse(agent.id);
      renderResponseItems(response);
    }, thinkTime);
  }

  // ──── File Upload Handler ────

  btnUpload.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show upload bubble
    addTextBubble(`📎 Uploaded: ${file.name}`, 'user');
    suggestions.style.display = 'none';

    const agent = getUploadAgent();
    highlightAgent(agent.id);
    addThinkingIndicator(agent);

    setTimeout(() => {
      removeThinking();
      addAgentLabel(agent);
      const response = getOCRResponse();
      renderResponseItems(response);
    }, 2000);

    fileInput.value = '';
  });

  // ──── Voice Input (Simulated) ────

  let isRecording = false;

  btnMic.addEventListener('click', () => {
    if (isRecording) {
      isRecording = false;
      btnMic.classList.remove('recording');
      // Simulate voice transcription
      input.value = 'I have been experiencing chest pain and shortness of breath';
      input.focus();
    } else {
      isRecording = true;
      btnMic.classList.add('recording');
      // Auto-stop after 3 seconds for demo
      setTimeout(() => {
        if (isRecording) {
          isRecording = false;
          btnMic.classList.remove('recording');
          input.value = 'I have been experiencing chest pain and shortness of breath';
          input.focus();
        }
      }, 3000);
    }
  });

  // ──── Event Listeners ────

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  suggestions.addEventListener('click', (e) => {
    const chip = e.target.closest('.chat-suggestion-chip');
    if (!chip) return;
    input.value = chip.dataset.msg;
    handleSend();
  });
}
