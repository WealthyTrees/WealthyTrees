/* WealthyTrees - Diwali / Muhurat Trading (7-8 Nov 2026 IST) + holiday status (10 Nov).
   Toran + side garlands + tree diyas + Shubh Diwali heading, and a market-status
   override so the clock shows the Muhurat session (not 'closed') and the
   Balipratipada holiday (not 'open'). The live ticker's markup and data are
   untouched - only the clock pill / popup (site.js status UI) is corrected.
   Preview any day: ?diwali=1 (8 Nov, Muhurat 2:30 PM), ?diwali=7, ?diwali=10. */
(function () {
  'use strict';

  var DECOR_DATES = { '2026-11-07': 1, '2026-11-08': 1 };
  var MUHURAT_DATE = '2026-11-08';
  var HOLIDAY_DATE = '2026-11-10';
  var MU_START = 14 * 60 + 5, MU_END = 15 * 60 + 30; /* 2:05 PM - 3:30 PM IST */
  var FONT_HREF = 'https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700&display=swap';

  var preview = null, reduceMotion = false;
  try { preview = new URLSearchParams(window.location.search).get('diwali'); } catch (e) {}
  try { reduceMotion = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}

  function istNow() {
    var p = {};
    try {
      new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      var t = {};
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).forEach(function (x) { t[x.type] = x.value; });
      return { date: p.year + '-' + p.month + '-' + p.day, h: +t.hour, m: +t.minute };
    } catch (e) { return { date: '', h: 0, m: 0 }; }
  }
  function now() {
    if (preview === '1' || preview === '8') return { date: MUHURAT_DATE, h: 14, m: 30 };
    if (preview === '7') return { date: '2026-11-07', h: 10, m: 0 };
    if (preview === '10') return { date: HOLIDAY_DATE, h: 10, m: 0 };
    return istNow();
  }
  var N = now();
  var isDecor = !!DECOR_DATES[N.date] || preview === '1' || preview === '7' || preview === '8';
  var isStatus = N.date === MUHURAT_DATE || N.date === HOLIDAY_DATE || preview === '1' || preview === '8' || preview === '10';
  if (!isDecor && !isStatus) return;

  function special() {
    var n = now(), mins = n.h * 60 + n.m;
    if (n.date === MUHURAT_DATE && mins >= MU_START && mins < MU_END) return 'muhurat';
    if (n.date === HOLIDAY_DATE) return 'holiday';
    return null;
  }

  /* ---------- CSS ---------- */
  var CSS =
    "#wt-dw-toran{position:relative;height:52px;overflow:hidden;pointer-events:none;background:linear-gradient(180deg,#fff8e6,#fff1cf);border-bottom:1px solid rgba(201,138,18,.35);z-index:3}" +
    ".wt-dw-stem{position:absolute;left:0;right:0;top:5px;height:2px;background:#4a7a3a}" +
    ".wt-dw-row{position:relative;display:flex;justify-content:space-evenly;align-items:flex-start;padding-top:6px}" +
    ".wt-dw-fl{display:flex;flex-direction:column;align-items:center;transform-origin:top center;animation:wt-dw-sway 3.4s ease-in-out infinite}" +
    ".wt-dw-th{width:2px;background:#6b8e5a}" +
    ".wt-dw-fl svg{width:28px;height:28px;display:block}" +
    ".wt-dw-lf svg{width:15px;height:15px;display:block}" +
    "@keyframes wt-dw-sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}" +
    ".wt-dw-side{position:fixed;top:0;bottom:0;width:34px;z-index:4;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly}" +
    ".wt-dw-side.left{left:8px}.wt-dw-side.right{right:8px}" +
    ".wt-dw-vstem{position:absolute;left:50%;top:0;bottom:0;width:2px;margin-left:-1px;background:#4a7a3a}" +
    ".wt-dw-side svg{width:22px;height:22px;display:block}" +
    "@media(max-width:1199px){.wt-dw-side{display:none}}" +
    ".wt-st.wt-dw-diya{background:radial-gradient(circle at 50% 30%,#fff3c4,#ffd76a 55%,#e8a33d);border-color:#c98a12}" +
    ".wt-st.wt-dw-diya svg{width:62%;height:62%}" +
    ".wt-dw-diya .wt-dw-flame{transform-box:fill-box;transform-origin:50% 100%;animation:wt-dw-flick 1.8s ease-in-out infinite}" +
    "@keyframes wt-dw-flick{0%,100%{transform:scale(1);opacity:1}30%{transform:scale(1.08,1.14);opacity:.94}60%{transform:scale(.94,1.02);opacity:1}}" +
    ".wt-dw-greet{position:relative;z-index:3;font-family:'Mukta','Noto Serif Devanagari',sans-serif;font-weight:600;font-size:20px;line-height:1.2;text-align:center;white-space:nowrap;background:var(--paper,#fff8e6);border:1px solid rgba(201,138,18,.55);border-radius:999px;padding:.2rem .95rem;box-shadow:0 4px 14px rgba(180,120,0,.18)}.wt-dw-greet span{background:linear-gradient(90deg,#d61f0a,#ff6a00 55%,#c78d00);-webkit-background-clip:text;background-clip:text;color:transparent}" +
    ".wt-stage .wt-dw-greet{position:absolute;left:50%;top:-2.3rem;transform:translateX(-50%)}" +
    ".hero .wt-dw-greet{grid-column:1/-1;order:-2;justify-self:center;margin-bottom:.2rem;font-size:18px}" +
    ".clock .dot.muhurat{background:var(--gold);animation:pulse 1.6s infinite}" +
    "@media(prefers-reduced-motion:reduce){.wt-dw-fl,.wt-dw-diya .wt-dw-flame,.clock .dot.muhurat{animation:none!important}}";

  function injectCSS() {
    if (document.getElementById('wt-dw-style')) return;
    var st = document.createElement('style');
    st.id = 'wt-dw-style'; st.textContent = CSS;
    document.head.appendChild(st);
    if (!document.getElementById('wt-dw-font')) {
      var l = document.createElement('link');
      l.id = 'wt-dw-font'; l.rel = 'stylesheet'; l.href = FONT_HREF;
      document.head.appendChild(l);
    }
  }

  /* ---------- marigold + diya artwork (SVG only) ---------- */
  function flowerSVG() {
    var petals = '', k;
    for (k = 0; k < 8; k++) {
      petals += '<ellipse cx="12" cy="4.6" rx="2.7" ry="5" fill="' + (k % 2 ? '#ff8c00' : '#ffa726') + '" transform="rotate(' + (k * 45) + ' 12 12)"/>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + petals +
      '<circle cx="12" cy="12" r="3.6" fill="#e67300"/><circle cx="12" cy="12" r="1.9" fill="#ffb400"/></svg>';
  }
  function leafSVG() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C6 16 5 10 12 3c7 7 6 13 0 18z" fill="#3d7a34"/></svg>';
  }
  var DIYA_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path class="wt-dw-flame" d="M12 4c1.9 2.4 2.9 4.1 2.9 5.9a2.9 2.9 0 1 1-5.8 0c0-1.8 1-3.5 2.9-5.9z" fill="#ff7a00"/>' +
    '<path class="wt-dw-flame" d="M12 6.6c1 1.3 1.5 2.2 1.5 3a1.5 1.5 0 1 1-3 0c0-.8.5-1.7 1.5-3z" fill="#ffd23e"/>' +
    '<path d="M3.5 12.5h17c0 3.6-3.8 6.2-8.5 6.2s-8.5-2.6-8.5-6.2z" fill="#b34a1a"/>' +
    '<path d="M3.5 12.5h17" stroke="#e8a33d" stroke-width="1.4" fill="none"/>' +
    '</svg>';

  /* ---------- toran (under the header) ---------- */
  function buildToran() {
    if (document.getElementById('wt-dw-toran')) return;
    var header = document.querySelector('header');
    if (!header) return;
    var toran = document.createElement('div');
    toran.id = 'wt-dw-toran'; toran.setAttribute('aria-hidden', 'true');
    var stem = document.createElement('div'); stem.className = 'wt-dw-stem'; toran.appendChild(stem);
    var row = document.createElement('div'); row.className = 'wt-dw-row';
    var n = Math.max(8, Math.round((window.innerWidth || 1200) / 56)), i;
    for (i = 0; i < n; i++) {
      var drop = Math.round(2 + 12 * Math.sin(Math.PI * ((i % 6) / 6)));
      var fl = document.createElement('span'); fl.className = 'wt-dw-fl';
      fl.style.animationDelay = (i % 5) * 0.45 + 's';
      var th = document.createElement('i'); th.className = 'wt-dw-th'; th.style.height = drop + 'px';
      fl.appendChild(th);
      var f = document.createElement('span'); f.innerHTML = flowerSVG(); fl.appendChild(f);
      row.appendChild(fl);
      if (i % 3 === 2) {
        var lf = document.createElement('span'); lf.className = 'wt-dw-lf';
        lf.style.marginTop = Math.round(drop / 2) + 'px';
        lf.innerHTML = leafSVG(); row.appendChild(lf);
      }
    }
    toran.appendChild(row);
    header.after(toran);
  }

  /* ---------- side garlands (desktop only) ---------- */
  function buildSides() {
    if (document.querySelector('.wt-dw-side')) return;
    var count = Math.max(6, Math.round((window.innerHeight || 800) / 64)), i, s;
    ['left', 'right'].forEach(function (side) {
      var g = document.createElement('div');
      g.className = 'wt-dw-side ' + side; g.setAttribute('aria-hidden', 'true');
      var vs = document.createElement('div'); vs.className = 'wt-dw-vstem'; g.appendChild(vs);
      for (i = 0; i < count; i++) {
        s = document.createElement('span');
        s.innerHTML = flowerSVG();
        s.style.transform = 'translateX(' + ((i % 2 ? 3 : -3)) + 'px)';
        g.appendChild(s);
      }
      document.body.appendChild(g);
    });
  }

  /* ---------- tree: floating tiles -> floating diyas + greeting ---------- */
  var swapped = false, greetPlaced = false;
  function swapTiles() {
    if (swapped) return;
    var tiles = document.querySelectorAll('.wt-st');
    if (!tiles.length) return;
    tiles.forEach(function (tile) {
      var tip = tile.querySelector('.wt-tip');
      if (tip) tip.remove();
      tile.innerHTML = DIYA_SVG;
      tile.classList.add('wt-dw-diya');
      tile.style.setProperty('--bg1', '#f6c453');
      tile.style.setProperty('--fg1', '#7a3a00');
      tile.setAttribute('aria-hidden', 'true');
    });
    swapped = true;
  }
  function placeGreet() {
    if (greetPlaced) return;
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var stage = document.querySelector('.wt-stage');
    var wide = false;
    try { wide = window.matchMedia('(min-width:761px)').matches; } catch (e) {}
    var g = document.createElement('div');
    g.className = 'wt-dw-greet'; g.innerHTML = '<span>शुभ दीवाली</span>';
    if (stage && wide) { stage.appendChild(g); greetPlaced = true; return; }
    var tree = hero.querySelector('.herotree');
    if (!tree) return;
    if (wide && !stage) return; /* stage still building - wait for it */
    hero.insertBefore(g, tree);
    greetPlaced = true;
  }
  function pollTree() {
    swapTiles();
    placeGreet();
    if (!swapped || !greetPlaced) setTimeout(pollTree, 300);
  }

  /* ---------- market status: Muhurat open, holiday closed ---------- */
  function fixPopup(kind) {
    var cp = document.querySelector('.cpop');
    if (!cp || cp.hidden) return;
    var rows = cp.querySelectorAll('.row');
    var cs = cp.querySelector('.cs'), sm = cp.querySelector('small');
    if (!rows.length || !cs) return;
    if (kind === 'muhurat') {
      if (rows[0]) rows[0].querySelector('b').textContent = '2:20 PM \u2013 3:30 PM';
      if (rows[1]) rows[1].querySelector('b').textContent = '2:05 PM \u2013 2:20 PM';
      if (rows[2]) rows[2].querySelector('b').textContent = '2:20 PM \u2013 3:30 PM';
      cs.textContent = 'Muhurat Trading \u00b7 2:20\u20133:30 PM';
      cs.style.color = '';
      if (sm) sm.textContent = 'Special Diwali session \u00b7 Samvat 2083 \u00b7 NSE & BSE';
    } else if (kind === 'holiday') {
      if (rows[0]) rows[0].querySelector('b').textContent = 'Closed';
      if (rows[1]) rows[1].querySelector('b').textContent = '\u2014';
      if (rows[2]) rows[2].querySelector('b').textContent = '\u2014';
      cs.textContent = 'Closed \u2014 Diwali (Balipratipada) holiday';
      cs.style.color = 'var(--down)';
      if (sm) sm.textContent = 'Exchange holiday \u00b7 Markets reopen Wed 11 Nov';
    }
  }
  function applyStatus() {
    var kind = special();
    if (!kind) return;
    var dot = document.querySelector('.clock .dot');
    if (dot) {
      var want = kind === 'muhurat' ? 'dot muhurat' : 'dot closed';
      if (dot.className !== want) dot.className = want;
    }
    fixPopup(kind);
  }
  var clockObserved = false;
  function observeClock() {
    if (clockObserved) return;
    var dot = document.querySelector('.clock .dot');
    var cp = document.querySelector('.cpop');
    if (!dot || !cp || !('MutationObserver' in window)) return;
    clockObserved = true;
    var obs = new MutationObserver(function () { applyStatus(); });
    obs.observe(dot, { attributes: true, attributeFilter: ['class'] });
    obs.observe(cp, { childList: true });
  }

  /* ---------- boot ---------- */
  function boot() {
    injectCSS();
    if (isDecor) {
      buildToran();
      buildSides();
      pollTree();
    }
    if (isStatus) {
      observeClock();
      setInterval(function () { observeClock(); applyStatus(); }, 1000);
      applyStatus();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
