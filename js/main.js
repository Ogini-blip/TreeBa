// TreeBa — Main JS

// ── World Chat ──────────────────────────────────────────────────────────────
function initChat() {
  const input   = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const msgs    = document.getElementById('chatMessages');
  if (!input || !sendBtn || !msgs) return;

  const colors = ['#1a6fff','#22e5a0','#ff8c6e','#cc88ff','#ffd700','#1dff3f'];

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    const username = sessionStorage.getItem('treeba_user') || 'Guest';
    const initials = username.slice(0, 2).toUpperCase();
    const color    = colors[Math.floor(Math.random() * colors.length)];
    const now      = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const empty = msgs.querySelector('.chat-empty');
    if (empty) empty.remove();

    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg';
    msgEl.innerHTML = `
      <div class="chat-msg-avatar" style="background:${color}">${initials}</div>
      <div class="chat-msg-body">
        <div class="chat-msg-name">${username}<span>${now}</span></div>
        <div class="chat-msg-text">${escapeHTML(text)}</div>
      </div>`;
    msgs.appendChild(msgEl);
    msgs.scrollTop = msgs.scrollHeight;
    input.value = '';
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Team Finder Buttons ──────────────────────────────────────────────────────
function initTeamFinder() {
  const buttons = document.querySelectorAll('.team-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ── Vote Buttons ─────────────────────────────────────────────────────────────
function initVotes() {
  document.querySelectorAll('.feed-post').forEach(post => {
    const [upBtn, downBtn] = post.querySelectorAll('.vote-btn');
    const countEl = post.querySelector('.feed-vote span');
    if (!countEl) return;
    let count = parseInt(countEl.textContent);
    let voted = 0;

    upBtn?.addEventListener('click', () => {
      if (voted === 1) { count--; voted = 0; }
      else { count += (voted === -1 ? 2 : 1); voted = 1; }
      countEl.textContent = count;
    });
    downBtn?.addEventListener('click', () => {
      if (voted === -1) { count++; voted = 0; }
      else { count -= (voted === 1 ? 2 : 1); voted = -1; }
      countEl.textContent = count;
    });
  });
}

// ── Auth Forms ───────────────────────────────────────────────────────────────
function initRegister() {
  const form = document.getElementById('registerForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const username = form.username.value.trim();
    if (username) {
      sessionStorage.setItem('treeba_user', username);
      window.location.href = '../pages/profile.html';
    }
  });
}

function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const username = form.username.value.trim();
    if (username) {
      sessionStorage.setItem('treeba_user', username);
      window.location.href = '../pages/profile.html';
    }
  });
}

// ── Navbar Auth State ─────────────────────────────────────────────────────────
function initNavbar() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;
  const username = sessionStorage.getItem('treeba_user');
  const savedAvatar = sessionStorage.getItem('treeba_avatar');

  if (username) {
    const initials = username.slice(0, 2).toUpperCase();
    const avatarHTML = savedAvatar
      ? `<img src="${savedAvatar}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);">`
      : `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1dff3f,#1a6fff);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:#071a0d;">${initials}</div>`;

    navActions.innerHTML = `
      <a href="/pages/profile.html" style="display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--primary);font-weight:600;">
        ${avatarHTML}
        ${username}
      </a>
      <button onclick="logout()" class="btn-ghost">Log Out</button>
    `;
  }
}

function logout() {
  sessionStorage.clear();
  window.location.href = '../index.html';
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initChat();
  initTeamFinder();
  initVotes();
  initRegister();
  initLogin();
});