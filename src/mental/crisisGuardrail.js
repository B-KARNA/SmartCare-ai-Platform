// ============================================================
// Crisis Guardrail — Self-harm keyword detection & help overlay
// ============================================================

const CRISIS_KEYWORDS = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
    'self-harm', 'self harm', 'cutting myself', 'hurt myself',
    'no reason to live', 'better off dead', 'give up',
    'can\'t go on', 'can\'t take it', 'hopeless', 'worthless',
    'nobody cares', 'ending it', 'jump off', 'overdose'
];

const HIGH_STRESS_KEYWORDS = [
    'panic attack', 'anxiety attack', 'can\'t breathe', 'breaking down',
    'mental breakdown', 'extreme stress', 'losing my mind', 'going crazy',
    'can not cope', 'severely depressed', 'deep depression'
];

/**
 * Check if text contains crisis or high-stress indicators.
 * Returns { isCrisis: bool, isHighStress: bool }
 */
export function detectCrisis(text) {
    const lower = text.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some(kw => lower.includes(kw));
    const isHighStress = HIGH_STRESS_KEYWORDS.some(kw => lower.includes(kw));
    return { isCrisis, isHighStress };
}

/** Show the crisis intervention overlay */
export function showGetHelpOverlay(type = 'crisis') {
    // Remove existing if any
    const existing = document.getElementById('crisis-overlay');
    if (existing) existing.remove();

    const isCrisis = type === 'crisis';

    const overlay = document.createElement('div');
    overlay.id = 'crisis-overlay';
    overlay.className = 'crisis-overlay';
    overlay.innerHTML = `
    <div class="crisis-card">
      <div class="crisis-header">
        <span class="crisis-icon">${isCrisis ? '🆘' : '💙'}</span>
        <h3 class="crisis-title">${isCrisis ? 'You\'re Not Alone' : 'We\'re Here For You'}</h3>
        <p class="crisis-subtitle">${isCrisis
            ? 'If you or someone you know is in immediate danger, please reach out for help right away.'
            : 'It sounds like you\'re going through a tough time. Professional support can make a difference.'}</p>
      </div>

      <div class="crisis-helplines">
        <div class="crisis-helpline">
          <div class="helpline-icon" style="background: rgba(255,86,48,.12); color: #FF5630;">📞</div>
          <div class="helpline-info">
            <div class="helpline-name">iCall — TISS</div>
            <div class="helpline-number">9152987821</div>
            <div class="helpline-hours">Mon–Sat, 8am–10pm</div>
          </div>
          <a href="tel:9152987821" class="helpline-call-btn">Call</a>
        </div>

        <div class="crisis-helpline">
          <div class="helpline-icon" style="background: rgba(0,82,204,.12); color: #2684FF;">📞</div>
          <div class="helpline-info">
            <div class="helpline-name">Vandrevala Foundation</div>
            <div class="helpline-number">1860-2662-345</div>
            <div class="helpline-hours">24/7, Multilingual</div>
          </div>
          <a href="tel:18602662345" class="helpline-call-btn">Call</a>
        </div>

        <div class="crisis-helpline">
          <div class="helpline-icon" style="background: rgba(54,179,126,.12); color: #36B37E;">📞</div>
          <div class="helpline-info">
            <div class="helpline-name">NIMHANS Helpline</div>
            <div class="helpline-number">080-46110007</div>
            <div class="helpline-hours">24/7</div>
          </div>
          <a href="tel:08046110007" class="helpline-call-btn">Call</a>
        </div>
      </div>

      <button class="crisis-counselor-btn" id="crisis-counselor-btn">
        🧑‍⚕️ Talk to a Registered Counselor
      </button>

      <div class="crisis-message">
        💛 You matter. Reaching out takes courage.<br>
        A trained professional is just one call away.
      </div>

      <button class="crisis-dismiss-btn" id="crisis-dismiss-btn">
        I understand, go back
      </button>
    </div>
  `;

    document.getElementById('app').appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    overlay.querySelector('#crisis-dismiss-btn').addEventListener('click', () => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    });

    overlay.querySelector('#crisis-counselor-btn').addEventListener('click', () => {
        window.open('tel:9152987821', '_self');
    });
}
