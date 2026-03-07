// ============================================================
// Mental Health Page — Mood Tracker + CBT Counselor
// ============================================================

import { MOODS, getMoodHistory, saveMoodEntry, getTodayMood, getLast7Days, seedMoodData } from '../mental/moodTracker.js';
import { getCBTResponse, getCBTGreeting } from '../mental/cbtCounselor.js';
import { detectCrisis, showGetHelpOverlay } from '../mental/crisisGuardrail.js';

export function renderMentalHealth() {
    const container = document.getElementById('mentalhealth-content');
    seedMoodData();

    const todayMood = getTodayMood();
    const last7 = getLast7Days();

    container.innerHTML = `
    <!-- Daily Mood Check-in -->
    <div class="mood-checkin-card" id="mood-checkin">
      <div class="mood-checkin-title">How are you feeling today?</div>
      <div class="mood-checkin-subtitle">${todayMood ? '✅ You already checked in today' : 'Tap an emoji to log your mood'}</div>
      <div class="mood-emoji-row">
        ${MOODS.map(m => `
          <button class="mood-emoji-btn ${todayMood && todayMood.value === m.value ? 'selected' : ''}"
                  data-value="${m.value}" data-emoji="${m.emoji}" data-label="${m.label}" data-color="${m.color}"
                  style="${todayMood && todayMood.value === m.value ? `border-color: ${m.color}; background: ${m.color}18` : ''}">
            <span class="mood-emoji">${m.emoji}</span>
            <span class="mood-label">${m.label}</span>
          </button>
        `).join('')}
      </div>
      <div class="mood-note-row" id="mood-note-row" style="${todayMood ? '' : 'display:none'}">
        <input type="text" class="mood-note-input" id="mood-note-input"
               placeholder="Add a note (optional)..."
               value="${todayMood?.note || ''}" />
      </div>
    </div>

    <!-- 7-Day Mood Graph -->
    <div class="section-header">
      <span class="section-title">Mood Trend (7 Days)</span>
    </div>
    <div class="mood-graph-card">
      <div class="mood-graph" id="mood-graph">
        ${renderMoodGraph(last7)}
      </div>
    </div>

    <!-- CBT Counselor Chat -->
    <div class="section-header" style="margin-top: var(--space-lg)">
      <span class="section-title">AI Personal Counselor</span>
      <span class="section-action" style="color: var(--secondary); font-size: 11px;">💙 CBT-based</span>
    </div>

    <div class="cbt-chat-container">
      <div class="cbt-messages" id="cbt-messages">
        <div class="cbt-agent-label">
          <span class="cbt-agent-icon">🧑‍⚕️</span>
          <span>Wellness Counselor</span>
        </div>
        <div class="chat-bubble ai cbt-bubble">${getCBTGreeting()}</div>
      </div>

      <div class="cbt-suggestions" id="cbt-suggestions">
        <button class="chat-suggestion-chip cbt-chip" data-msg="I'm feeling very anxious today">😰 Anxiety</button>
        <button class="chat-suggestion-chip cbt-chip" data-msg="I've been feeling really sad and lonely">😢 Sadness</button>
        <button class="chat-suggestion-chip cbt-chip" data-msg="I can't sleep well at night">😴 Sleep</button>
        <button class="chat-suggestion-chip cbt-chip" data-msg="I'm feeling really good today!">😊 Positive</button>
      </div>

      <div class="chat-input-bar-multi" id="cbt-input-bar">
        <input type="text" class="chat-input" id="cbt-input" placeholder="Share what's on your mind..." />
        <button class="chat-send-btn" id="cbt-send-btn" aria-label="Send">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;

    // ──── Mood Check-in Handlers ────
    container.querySelectorAll('.mood-emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const value = parseInt(btn.dataset.value);
            const emoji = btn.dataset.emoji;
            const label = btn.dataset.label;
            const color = btn.dataset.color;

            // Deselect all
            container.querySelectorAll('.mood-emoji-btn').forEach(b => {
                b.classList.remove('selected');
                b.style.borderColor = '';
                b.style.background = '';
            });

            btn.classList.add('selected');
            btn.style.borderColor = color;
            btn.style.background = color + '18';

            document.getElementById('mood-note-row').style.display = 'flex';
            document.querySelector('.mood-checkin-subtitle').textContent = `Feeling ${label} ${emoji}`;

            saveMoodEntry({ value, emoji, label, note: '' });

            // Refresh graph
            const graphEl = document.getElementById('mood-graph');
            graphEl.innerHTML = renderMoodGraph(getLast7Days());
        });
    });

    // Save note on blur
    const noteInput = document.getElementById('mood-note-input');
    noteInput.addEventListener('change', () => {
        const today = getTodayMood();
        if (today) {
            saveMoodEntry({ ...today, note: noteInput.value });
        }
    });

    // ──── CBT Chat Handlers ────
    const cbtMessages = document.getElementById('cbt-messages');
    const cbtInput = document.getElementById('cbt-input');
    const cbtSendBtn = document.getElementById('cbt-send-btn');
    const cbtSuggestions = document.getElementById('cbt-suggestions');

    function cbtScrollBottom() {
        requestAnimationFrame(() => { cbtMessages.scrollTop = cbtMessages.scrollHeight; });
    }

    function addCbtBubble(content, type) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + type + (type === 'ai' ? ' cbt-bubble' : '');
        if (type === 'ai') bubble.innerHTML = content;
        else bubble.textContent = content;
        cbtMessages.appendChild(bubble);
        cbtScrollBottom();
    }

    function handleCbtSend() {
        const text = cbtInput.value.trim();
        if (!text) return;

        addCbtBubble(text, 'user');
        cbtInput.value = '';
        cbtSuggestions.style.display = 'none';

        // Crisis check
        const crisis = detectCrisis(text);
        if (crisis.isCrisis) {
            showGetHelpOverlay('crisis');
            // Still provide a gentle response
            setTimeout(() => {
                const label = document.createElement('div');
                label.className = 'cbt-agent-label';
                label.innerHTML = '<span class="cbt-agent-icon">🧑‍⚕️</span><span>Wellness Counselor</span>';
                cbtMessages.appendChild(label);
                addCbtBubble("I'm concerned about what you've shared. 💙 Please know that you are valued and help is available. I've shown you some resources — please reach out to them. You don't have to go through this alone.", 'ai');
            }, 800);
            return;
        }

        if (crisis.isHighStress) {
            showGetHelpOverlay('stress');
        }

        // Thinking state
        const thinking = document.createElement('div');
        thinking.className = 'thinking-indicator cbt-thinking';
        thinking.innerHTML = `
      <span class="thinking-avatar" style="background: linear-gradient(135deg, #7C3AED, #A78BFA)">🧑‍⚕️</span>
      <div class="thinking-content">
        <span class="thinking-text">Counselor is thinking with empathy...</span>
        <span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
      </div>
    `;
        cbtMessages.appendChild(thinking);
        cbtScrollBottom();

        setTimeout(() => {
            thinking.remove();
            const label = document.createElement('div');
            label.className = 'cbt-agent-label';
            label.innerHTML = '<span class="cbt-agent-icon">🧑‍⚕️</span><span>Wellness Counselor</span>';
            cbtMessages.appendChild(label);

            const { response } = getCBTResponse(text);
            addCbtBubble(response, 'ai');
        }, 1500 + Math.random() * 1000);
    }

    cbtSendBtn.addEventListener('click', handleCbtSend);
    cbtInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleCbtSend();
    });

    cbtSuggestions.addEventListener('click', (e) => {
        const chip = e.target.closest('.cbt-chip');
        if (!chip) return;
        cbtInput.value = chip.dataset.msg;
        handleCbtSend();
    });
}

// ──── Mood Graph Renderer ────

function renderMoodGraph(entries) {
    if (entries.length === 0) {
        return '<div style="text-align:center; color: var(--text-muted); padding: var(--space-lg); font-size: var(--font-xs);">No mood data yet. Check in above!</div>';
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const maxVal = 5;

    return `
    <div class="mood-graph-bars">
      ${entries.map(entry => {
        const pct = (entry.value / maxVal) * 100;
        const color = MOODS.find(m => m.value === entry.value)?.color || '#00B8D9';
        const d = new Date(entry.date);
        const dayName = days[d.getDay()];
        return `
          <div class="mood-bar-col">
            <div class="mood-bar-tooltip">${entry.emoji} ${entry.label}</div>
            <div class="mood-bar-track">
              <div class="mood-bar-fill" style="height: ${pct}%; background: ${color}"></div>
            </div>
            <span class="mood-bar-day">${dayName}</span>
          </div>
        `;
    }).join('')}
    </div>
  `;
}
