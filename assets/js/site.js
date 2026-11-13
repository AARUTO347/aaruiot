/* ═══════════════════════════════════════════════════════════
   AARUIOT — interaction engine
   boot sequence · IoT mesh · scroll systems · live GitHub ·
   cross-host contact channel
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const CFG = window.AARUIOT || {};
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

/* ── Boot sequence ───────────────────────────────────────── */
const boot = $('#boot');
const bootLog = $('#boot-log');
const bootFill = $('#boot-fill');
let booted = false;

const BOOT_LINES = [
  ['AARUIOT BIOS v2.6.1 — cold start', ''],
  ['[ OK ] kernel.mount ......... applied-ai', 'ok'],
  ['[ OK ] kernel.mount ......... autonomous-robotics', 'ok'],
  ['[ OK ] kernel.mount ......... unified-interfaces', 'ok'],
  ['[ OK ] kernel.mount ......... open-technologies', 'ok'],
  ['[ OK ] mesh.link ............ 18,000+ components online', 'ok'],
  ['[ OK ] hid.bridge ........... human control established', 'ok'],
  ['[ >> ] bridging intelligence, hardware & human control', 'warn'],
  ['BOOT COMPLETE — welcome to AARUIOT', 'ok']
];

function finishBoot() {
  if (booted) return;
  booted = true;
  try { sessionStorage.setItem('aaruiot-booted', '1'); } catch {}
  boot.classList.add('done');
  setTimeout(() => boot.remove(), 600);
  startReveals();
}

function runBoot() {
  let seen = false;
  try { seen = sessionStorage.getItem('aaruiot-booted') === '1'; } catch {}
  if (reduced || seen) { boot.remove(); booted = true; startReveals(); return; }
  let i = 0;
  const step = () => {
    if (booted) return;
    if (i >= BOOT_LINES.length) { setTimeout(finishBoot, 320); return; }
    const [text, cls] = BOOT_LINES[i];
    const line = document.createElement('span');
    if (cls) line.className = cls;
    line.textContent = text + '\n';
    bootLog.appendChild(line);
    bootFill.style.width = ((i + 1) / BOOT_LINES.length * 100) + '%';
    i++;
    setTimeout(step, i === BOOT_LINES.length ? 200 : 150);
  };
  setTimeout(step, 260);
  $('#boot-skip').addEventListener('click', finishBoot);
  boot.addEventListener('click', e => { if (e.target === boot) finishBoot(); });
  addEventListener('keydown', function skip(e) {
    if (!booted) finishBoot();
    removeEventListener('keydown', skip);
  });
  setTimeout(finishBoot, 4200); // hard safety
}

/* ── Reveal on scroll ────────────────────────────────────── */
let revealObserver = null;
function startReveals() {
  const items = $$('.reveal');
  items.forEach(el => el.style.setProperty('--d', el.dataset.d || 0));
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) {
      en.target.classList.add('in');
      revealObserver.unobserve(en.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(el => revealObserver.observe(el));
}

/* ── IoT mesh canvas ─────────────────────────────────────── */
const canvas = $('#mesh');
const hero = $('#hero');
if (canvas && canvas.getContext) {
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 2);
  const COLORS = ['#00e5ff', '#ff2d95', '#a6ff3d', '#ffb020'];
  let W = 0, H = 0, nodes = [], pulses = [], raf = 0, running = false, heroVisible = true;
  let mouse = { x: -9999, y: -9999 };
  let lastPulse = 0;

  function size() {
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.min(110, Math.max(38, Math.round(W * H / 16000)));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.8 + 1,
      c: Math.random() < .28 ? COLORS[Math.floor(Math.random() * 4)] : '#5a8cc8',
      ph: Math.random() * Math.PI * 2
    }));
    pulses = [];
  }

  function frame(t) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    const LINK = 132;
    for (const p of nodes) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 150 && d > 0.01) {
        const f = (1 - d / 150) * .6;
        p.x += dx / d * f; p.y += dy / d * f;
      }
    }
    ctx.lineWidth = 1;
    const near = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          const al = (1 - d / LINK) * .22;
          ctx.strokeStyle = `rgba(0,229,255,${al})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          if (d < LINK * .8) near.push([i, j]);
        }
      }
    }
    // cursor links
    for (const p of nodes) {
      const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (d < 190) {
        ctx.strokeStyle = `rgba(255,45,149,${(1 - d / 190) * .35})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    // nodes
    for (const p of nodes) {
      const tw = .6 + Math.sin(t / 900 + p.ph) * .4;
      ctx.fillStyle = p.c;
      ctx.globalAlpha = .55 + tw * .4;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // pulses travelling along edges
    if (t - lastPulse > 420 && near.length && pulses.length < 7) {
      const [ai, bi] = near[Math.floor(Math.random() * near.length)];
      pulses.push({ a: nodes[ai], b: nodes[bi], t: 0, sp: .012 + Math.random() * .014, c: COLORS[Math.floor(Math.random() * 4)] });
      lastPulse = t;
    }
    pulses = pulses.filter(p => p.t <= 1);
    for (const p of pulses) {
      p.t += p.sp;
      const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.fillStyle = p.c;
      ctx.shadowColor = p.c; ctx.shadowBlur = 9;
      ctx.beginPath(); ctx.arc(x, y, 2.1, 0, 6.2832); ctx.fill();
      ctx.shadowBlur = 0;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() { if (!running && !reduced) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  size();
  if (reduced) { // one static frame
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 132) { ctx.strokeStyle = `rgba(0,229,255,${(1 - d / 132) * .2})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    }
    for (const p of nodes) { ctx.fillStyle = p.c; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1; }
  } else {
    new IntersectionObserver(en => { heroVisible = en[0].isIntersecting; heroVisible ? start() : stop(); }, { threshold: .02 }).observe(hero);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : (heroVisible && start()));
    hero.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (!running && !reduced) start(); }, 220); });
    start();
  }
}

/* ── Nav: scroll state, burger, scrollspy ────────────────── */
const nav = $('#nav');
const burger = $('#nav-burger');
const navLinks = $('#nav-links');
const progress = $('#scroll-progress');
const toTop = $('#to-top');

function onScroll() {
  const y = scrollY;
  nav.classList.toggle('scrolled', y > 24);
  toTop.classList.toggle('show', y > 700);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

function closeMenu() {
  navLinks.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
}
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('no-scroll', open);
});
navLinks.addEventListener('click', e => { if (e.target.tagName === 'A') closeMenu(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

const spyMap = new Map();
$$('.nav-links a[data-spy]').forEach(a => spyMap.set(a.getAttribute('href').slice(1), a));
const spy = new IntersectionObserver(entries => {
  for (const en of entries) if (en.isIntersecting) {
    spyMap.forEach(a => a.classList.remove('active'));
    const link = spyMap.get(en.target.id);
    if (link) link.classList.add('active');
  }
}, { rootMargin: '-35% 0px -55% 0px' });
spyMap.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

/* ── Animated counters ───────────────────────────────────── */
const fmt = n => Math.round(n).toLocaleString('en-US');
function animateCount(el) {
  const target = Number(el.dataset.count || 0);
  if (reduced) { el.textContent = fmt(target); return; }
  const t0 = performance.now(), dur = 1700;
  const tick = t => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = fmt(target * (1 - Math.pow(2, -10 * k)));
    if (k < 1) requestAnimationFrame(tick); else el.textContent = fmt(target);
  };
  requestAnimationFrame(tick);
}
const countObs = new IntersectionObserver(entries => {
  for (const en of entries) if (en.isIntersecting) {
    animateCount(en.target);
    countObs.unobserve(en.target);
  }
}, { threshold: .5 });
$$('.count').forEach(el => countObs.observe(el));

/* ── Hero float-card parallax ────────────────────────────── */
if (finePointer && !reduced) {
  const cards = $$('.float-card');
  let tx = 0, ty = 0, cx = 0, cy = 0, praf = 0;
  const loop = () => {
    cx += (tx - cx) * .06; cy += (ty - cy) * .06;
    for (const c of cards) {
      const d = Number(c.dataset.depth || 20);
      c.style.transform = `translate3d(${cx * d}px,${cy * d}px,0)`;
    }
    praf = requestAnimationFrame(loop);
  };
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - .5;
    ty = (e.clientY - r.top) / r.height - .5;
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
  loop();
}

/* ── Card tilt + glow tracking ───────────────────────────── */
if (finePointer && !reduced) {
  $$('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');
      card.style.transform = `translateY(-5px) perspective(900px) rotateX(${(0.5 - py) * 4}deg) rotateY(${(px - 0.5) * 4}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

/* ── Live GitHub data ────────────────────────────────────── */
const GH_USER = 'AARUTO347';
const GH_PUBLIC_TOTAL = 14;
const LANG_COLORS = { 'C++': '#f34b7d', 'C': '#555', 'Python': '#3572A5', 'TypeScript': '#3178c6', 'JavaScript': '#f1e05a', 'Shell': '#89e051', 'HTML': '#e34c26', 'Nim': '#ffc200', 'CSS': '#563d7c' };
const CATS = {
  AARUESP: ['hardware', 'Firmware'], AARUARDUINO: ['hardware', 'Firmware'], AARUNO: ['hardware', 'Hardware'],
  allxchat: ['ai', 'AI · Chat'], 'AARU_CHAT-BOT': ['ai', 'AI · Chat'],
  'morphic-ai-answer-engine-generative-ui': ['ai', 'AI · Chat'], 'AARUTO_ANIME.AI': ['ai', 'AI'],
  'AARUTO-animdustry': ['games', 'Game'], 'avocado-quest': ['games', 'Game'],
  'aurora-os': ['os', 'OS'], smartgarden: ['os', 'IoT']
};
const CAT_COLORS = { hardware: '#a6ff3d', ai: '#ff2d95', games: '#ffb020', os: '#00e5ff' };
const FALLBACK_REPOS = [
  { name: 'AARUESP', description: 'Universal ESP32/ESP8266 library — 1000+ modules, 200+ boards, one API. MADE BY AARUTO.', language: 'C++', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/AARUESP', homepage: '', pushed_at: '2026-11-01T00:00:00Z', fork: false },
  { name: 'AARUARDUINO', description: 'Universal Arduino Library — 1000+ modules, MADE BY AARUTO.', language: 'C++', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/AARUARDUINO', homepage: 'https://aaruto347.github.io/AARUARDUINO/', pushed_at: '2026-11-01T00:00:00Z', fork: false },
  { name: 'aurora-os', description: 'AURORA OS — bootable Ubuntu 26.04 LTS live desktop with XFCE, branded LightDM login and AURORA identity.', language: 'Shell', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/aurora-os', homepage: 'https://aaruto347.github.io/aurora-os/', pushed_at: '2026-10-20T00:00:00Z', fork: false },
  { name: 'smartgarden', description: 'SmartGarden — connected garden monitoring web dashboard.', language: 'HTML', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/smartgarden', homepage: 'https://aaruto347.github.io/smartgarden/', pushed_at: '2026-10-10T00:00:00Z', fork: false },
  { name: 'allxchat', description: 'ALLXCHAT — realtime chat + Groq AI + WhatsApp bridge (RTDB-powered).', language: 'TypeScript', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/allxchat', homepage: '', pushed_at: '2026-10-05T00:00:00Z', fork: false },
  { name: 'AARU_CHAT-BOT', description: 'AARU chat bot — web-based AI assistant.', language: 'TypeScript', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/AARU_CHAT-BOT', homepage: 'https://aaruto347.github.io/AARU_CHAT-BOT/', pushed_at: '2026-09-28T00:00:00Z', fork: false },
  { name: 'morphic-ai-answer-engine-generative-ui', description: 'Morphic — AI answer engine with generative UI.', language: 'TypeScript', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/morphic-ai-answer-engine-generative-ui', homepage: 'https://aaruto347.github.io/morphic-ai-answer-engine-generative-ui/', pushed_at: '2026-09-20T00:00:00Z', fork: false },
  { name: 'AARUNO', description: 'AARUNO — embedded hardware project.', language: 'C++', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/AARUNO', homepage: 'https://aaruto347.github.io/AARUNO/', pushed_at: '2026-09-12T00:00:00Z', fork: false },
  { name: 'AARUTO-animdustry', description: 'Revived Animdustry — anime gacha bullet-hell rhythm game (Nim/Fau).', language: 'Nim', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/AARUTO-animdustry', homepage: '', pushed_at: '2026-09-01T00:00:00Z', fork: false },
  { name: 'avocado-quest', description: 'Avocado Quest — browser game.', language: 'JavaScript', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/avocado-quest', homepage: '', pushed_at: '2026-08-22T00:00:00Z', fork: false },
  { name: 'AARUTO_ANIME.AI', description: 'ANIME.AI — anime-flavored AI experiments.', language: 'TypeScript', stargazers_count: 0, html_url: 'https://github.com/AARUTO347/AARUTO_ANIME.AI', homepage: '', pushed_at: '2026-08-10T00:00:00Z', fork: false }
];

function relTime(iso) {
  const d = (Date.now() - new Date(iso).getTime()) / 86400000;
  if (!isFinite(d)) return '—';
  if (d < 1) return 'today';
  if (d < 30) return Math.round(d) + 'd ago';
  if (d < 365) return Math.round(d / 30) + 'mo ago';
  return Math.round(d / 365) + 'y ago';
}

const ecoGrid = $('#eco-grid');
const ecoNote = $('#eco-note');
let allRepos = [];

function renderEco(repos) {
  ecoGrid.innerHTML = repos.map((r, i) => {
    const [cat, label] = CATS[r.name] || ['os', 'Open'];
    const color = CAT_COLORS[cat];
    const langColor = LANG_COLORS[r.language] || '#8b96b3';
    const demo = r.homepage && /^https?:\/\//.test(r.homepage)
      ? `<a href="${esc(r.homepage)}" target="_blank" rel="noopener">Live ↗</a>` : '';
    return `<article class="eco-card" data-cat="${cat}" style="--ec:${color};animation-delay:${i * 45}ms">
      <div class="eco-top"><span class="eco-dot"></span><b>${esc(r.name)}</b><span class="eco-cat">${label}</span></div>
      <p class="eco-desc">${esc(r.description || 'Open-source building block from the AARUIOT lab.')}</p>
      <div class="eco-meta">
        <span class="lang"><i style="background:${langColor}"></i>${esc(r.language || 'Code')}</span>
        <span>★ ${r.stargazers_count ?? 0}</span>
        <span>${relTime(r.pushed_at)}</span>
      </div>
      <div class="eco-links"><a href="${esc(r.html_url)}" target="_blank" rel="noopener">Source ↗</a>${demo}</div>
    </article>`;
  }).join('');
}

function applyFilter(f) {
  $$('.eco-card', ecoGrid).forEach(c => {
    const show = f === 'all' || c.dataset.cat === f;
    c.classList.toggle('hide', !show);
    if (show) { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = ''; }
  });
}
$$('.eco-chip').forEach(btn => btn.addEventListener('click', () => {
  $$('.eco-chip').forEach(b => b.classList.remove('is-on'));
  btn.classList.add('is-on');
  applyFilter(btn.dataset.filter);
}));

function fillFlagshipStats(repos) {
  const byName = new Map(repos.map(r => [r.name, r]));
  $$('[data-repo-stars]').forEach(el => {
    const r = byName.get(el.dataset.repoStars);
    if (r) el.textContent = '★ ' + (r.stargazers_count ?? 0) + ' stars';
  });
  $$('[data-repo-lang]').forEach(el => {
    const r = byName.get(el.dataset.repoLang);
    if (r && r.language) el.textContent = r.language;
  });
  $$('[data-repo-updated]').forEach(el => {
    const r = byName.get(el.dataset.repoUpdated);
    if (r) el.textContent = 'updated ' + relTime(r.pushed_at);
  });
}

async function loadGitHub() {
  ecoGrid.innerHTML = Array.from({ length: 6 }, () => '<div class="eco-skel"></div>').join('');
  let data = null;
  try {
    const cached = JSON.parse(sessionStorage.getItem('aaruiot-gh') || 'null');
    if (cached && Date.now() - cached.t < 600000) data = cached;
  } catch {}
  if (!data) {
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 9000);
      const [user, repos] = await Promise.all([
        fetch(`https://api.github.com/users/${GH_USER}`, { signal: ctl.signal }).then(r => r.ok ? r.json() : null),
        fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, { signal: ctl.signal }).then(r => r.ok ? r.json() : null)
      ]);
      clearTimeout(timer);
      if (Array.isArray(repos)) {
        data = { t: Date.now(), user, repos };
        try { sessionStorage.setItem('aaruiot-gh', JSON.stringify(data)); } catch {}
      }
    } catch {}
  }
  if (data) {
    allRepos = data.repos.filter(r => !r.fork);
    const total = data.user?.public_repos ?? data.repos.length;
    const rc = $('#repo-count');
    rc.dataset.count = total;
    if (rc.textContent !== '0') rc.textContent = fmt(total);
    renderEco(allRepos);
    fillFlagshipStats(data.repos);
    ecoNote.textContent = `● Live from GitHub — ${allRepos.length} public repositories · synced ${new Date(data.t).toLocaleTimeString()}`;
  } else {
    allRepos = FALLBACK_REPOS;
    const rc = $('#repo-count');
    rc.dataset.count = GH_PUBLIC_TOTAL;
    if (rc.textContent !== '0') rc.textContent = fmt(GH_PUBLIC_TOTAL);
    renderEco(allRepos);
    fillFlagshipStats(allRepos);
    ecoNote.textContent = '○ GitHub API unreachable — showing the curated lab snapshot.';
  }
  applyFilter($('.eco-chip.is-on')?.dataset.filter || 'all');
}

/* ── Contact channel (works on Qoder, Netlify, GitHub Pages) ── */
const form = $('#contact-form');
const statusEl = $('#form-status');
const successEl = $('#form-success');
const submitBtn = $('#cf-submit');
const fields = {
  name: $('#cf-name'), email: $('#cf-email'), topic: $('#cf-topic'),
  message: $('#cf-message'), website: form.querySelector('[name="website"]')
};

const TOPICS = ['Product build', 'Partnership', 'Open-source collaboration', 'Press & media', 'Something else'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function hostOf(url) { try { return new URL(url).hostname; } catch { return ''; } }
const qoderHost = hostOf(CFG.qoderUrl);
const netlifyHost = hostOf(CFG.netlifyUrl);
// Suffix matching keeps host detection correct even if a platform assigns a
// different subdomain than the one baked into config.js.
const onQoder = (qoderHost && location.hostname === qoderHost) || /\.qoder\.site$/i.test(location.hostname);
const onNetlify = (netlifyHost && location.hostname === netlifyHost) || /\.netlify\.app$/i.test(location.hostname);

function setErr(field, msg) {
  const wrap = form.querySelector(`[name="${field}"]`)?.closest('.field');
  const err = form.querySelector(`[data-err="${field}"]`);
  if (wrap) wrap.classList.toggle('invalid', !!msg);
  if (err) err.textContent = msg || '';
}
function validate() {
  const v = {
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    topic: fields.topic.value,
    message: fields.message.value.trim()
  };
  let ok = true;
  if (v.name.length < 2) { setErr('name', 'Tell us your name (2+ characters).'); ok = false; } else setErr('name');
  if (!EMAIL_RE.test(v.email)) { setErr('email', 'A valid email is required for the reply channel.'); ok = false; } else setErr('email');
  if (!TOPICS.includes(v.topic)) { setErr('topic', 'Pick a channel so we can route your signal.'); ok = false; } else setErr('topic');
  if (v.message.length < 10) { setErr('message', 'Give us at least 10 characters of context.'); ok = false; } else setErr('message');
  return ok ? v : null;
}
['name', 'email', 'topic', 'message'].forEach(n => {
  fields[n]?.addEventListener('input', () => setErr(n));
});

function mailtoFallback(v) {
  const body = `Name: ${v.name}\nTopic: ${v.topic}\n\n${v.message}`;
  return `mailto:aaruto00@gmail.com?subject=${encodeURIComponent('[AARUIOT] ' + v.topic)}&body=${encodeURIComponent(body)}`;
}

async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'same-origin'
  });
  let body = null;
  try { body = await res.json(); } catch {}
  if (!res.ok || !body || body.ok !== true) {
    const e = new Error(body?.error || `rejected_${res.status}`);
    e.rejected = true;
    throw e;
  }
  return body;
}

async function postNetlify(base, v) {
  const data = new URLSearchParams({
    'form-name': 'contact', name: v.name, email: v.email,
    topic: v.topic, message: v.message, website: ''
  });
  const res = await fetch(base || location.origin + '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data.toString(),
    mode: base ? 'no-cors' : 'cors'
  });
  if (!base && !res.ok && res.status !== 303) throw new Error('netlify_rejected');
  return { ok: true, id: 'NTL-' + Date.now().toString(36).toUpperCase() };
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  statusEl.textContent = '';
  statusEl.className = 'form-status';
  if (fields.website.value) { // honeypot — silently accept for bots
    form.reset();
    return;
  }
  const v = validate();
  if (!v) { statusEl.textContent = 'Check the highlighted fields.'; statusEl.classList.add('bad'); return; }

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  $('.btn-label', submitBtn).textContent = 'Transmitting…';
  const payload = { ...v, source: location.hostname || 'local' };
  let result = null, lastErr = null;

  // 1) Qoder Function — same-origin on the canonical host, absolute elsewhere.
  const qoderEndpoint = onQoder ? '/functions/v1/app/api/contact'
    : CFG.qoderUrl ? CFG.qoderUrl.replace(/\/$/, '') + '/functions/v1/app/api/contact' : null;
  if (qoderEndpoint) {
    try { result = await postJSON(qoderEndpoint, payload); }
    catch (err) { lastErr = err; }
  }
  // 2) Netlify Forms — native on Netlify, registered endpoint elsewhere.
  if (!result) {
    const canNetlify = onNetlify || (!onQoder && CFG.netlifyUrl);
    if (canNetlify) {
      try { result = await postNetlify(onNetlify ? '' : CFG.netlifyUrl.replace(/\/$/, '') + '/', v); }
      catch (err) { lastErr = err; }
    }
  }

  submitBtn.disabled = false;
  submitBtn.classList.remove('loading');
  $('.btn-label', submitBtn).textContent = 'Transmit message';

  if (result) {
    $('#ref-id').textContent = String(result.id || 'OK').slice(0, 13).toUpperCase();
    successEl.hidden = false;
    form.querySelectorAll('.field, #cf-submit').forEach(el => el.style.display = 'none');
    statusEl.textContent = '';
  } else {
    statusEl.classList.add('bad');
    statusEl.innerHTML = `Transmission failed${lastErr?.rejected ? ' (server rejected the signal)' : ''}. ` +
      `Retry, or <a href="${mailtoFallback(v)}">send it as a direct email ↗</a>.`;
  }
});

$('#form-reset').addEventListener('click', () => {
  form.reset();
  successEl.hidden = true;
  form.querySelectorAll('.field, #cf-submit').forEach(el => el.style.display = '');
  statusEl.textContent = '';
  fields.name.focus();
});

/* ── Footer: year + live host badges ─────────────────────── */
$('#year').textContent = new Date().getFullYear();
const hq = $('#host-qoder'), hn = $('#host-netlify');
if (CFG.qoderUrl) hq.href = CFG.qoderUrl; else hq.style.display = 'none';
if (CFG.netlifyUrl) hn.href = CFG.netlifyUrl; else hn.style.display = 'none';

/* ── Ignition ────────────────────────────────────────────── */
loadGitHub();
runBoot();

})();