/* WealthyTrees - Diwali / Muhurat Trading (7-8 Nov 2026 IST) + holiday status (10 Nov).
   Toran: an even SVG bandhanwar (marigold + mango leaf, gentle drape, danglers),
   drawn to the page width so every flower is evenly spaced. Side garlands
   (the user's marigold photo) hang on every main page, flowing and swaying,
   and they swing when you hover or drag a finger over them. Plus tree diyas +
   Shubh Diwali heading, a Diwali strip (same look as the Dhanteras strip,
   title 'Shubh Diwali', big diya badge instead of the kalash photo) with
   falling petals + a 3s shower, and opening fireworks: a cracker bursts, then
   a finance word appears (Learn, Invest, Grow, Save). Fireworks also run on
   the About / Founder's story page, where an orange 'Happy Diwali' pill sits
   under the Founder's story heading. Also a market-status override so the
   clock shows the Muhurat session (not 'closed') and the Balipratipada
   holiday (not 'open'). The live ticker's markup and data are untouched -
   only the clock pill / popup (site.js status UI) is corrected.
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

  /* Which page is this? Toran + side garlands run on every main page;
     fireworks run on the homepage and on About (Founder's story). */
  var path = '';
  try { path = window.location.pathname || ''; } catch (e) {}
  var isHome = path === '/' || path === '/index.html' || path.slice(-11) === '/index.html';
  var isAbout = path.indexOf('about') !== -1;

  function special() {
    var n = now(), mins = n.h * 60 + n.m;
    if (n.date === MUHURAT_DATE && mins >= MU_START && mins < MU_END) return 'muhurat';
    if (n.date === HOLIDAY_DATE) return 'holiday';
    return null;
  }

  /* ---------- CSS ---------- */
  var CSS =
    "#wt-dw-toran{position:relative;overflow:hidden;pointer-events:none;border-bottom:1px solid rgba(201,138,18,.35);z-index:3;height:72px}" +
    "#wt-dw-toran svg{display:block;width:100%;height:72px}" +
    "@media(max-width:640px){#wt-dw-toran{height:60px}#wt-dw-toran svg{height:60px}}" +
    ".wt-dw-side{position:fixed;top:0;bottom:0;width:34px;z-index:4;pointer-events:auto;touch-action:none;cursor:pointer;transform-origin:top center}" +
    ".wt-dw-side.wt-dw-side-kick{animation:wt-dw-kick 1.3s ease-in-out}" +
    "@keyframes wt-dw-kick{0%{transform:rotate(0)}25%{transform:rotate(7deg)}55%{transform:rotate(-5deg)}80%{transform:rotate(2.5deg)}100%{transform:rotate(0)}}" +
    ".wt-dw-side.left{left:8px}.wt-dw-side.right{right:8px}" +
    ".wt-dw-side-in{position:absolute;inset:0;background-image:url(/assets/diwali-side.png);background-repeat:repeat-y;background-size:34px auto;background-position:top center;transform-origin:top center;animation:wt-dw-sway 5s ease-in-out infinite,wt-dw-flow 14s linear infinite}" +
    ".wt-dw-side-in img{position:absolute;bottom:0;left:0;width:34px;height:auto;display:block}" +
    "@keyframes wt-dw-sway{0%,100%{transform:rotate(-1.6deg)}50%{transform:rotate(1.6deg)}}" +
    "@keyframes wt-dw-flow{from{background-position-y:0}to{background-position-y:236px}}" +
    "@media(max-width:1199px){.wt-dw-side{display:none}}" +
    ".wt-dw-founder-pill{display:inline-block;background:linear-gradient(90deg,#ff6a00,#ffb400);color:#fff;font-family:'Inter','Mukta',sans-serif;font-weight:700;font-size:15px;line-height:1;border-radius:999px;padding:.55rem 1.1rem;margin:.35rem 0 .9rem;box-shadow:0 4px 16px rgba(255,106,0,.35);animation:wt-dw-pillglow 2.4s ease-in-out infinite}" +
    "@keyframes wt-dw-pillglow{0%,100%{box-shadow:0 4px 16px rgba(255,106,0,.35)}50%{box-shadow:0 4px 24px rgba(255,140,0,.6)}}" +
    ".wt-st.wt-dw-diya{background:radial-gradient(circle at 50% 30%,#fff3c4,#ffd76a 55%,#e8a33d);border-color:#c98a12}" +
    ".wt-st.wt-dw-diya svg{width:62%;height:62%}" +
    ".wt-dw-diya .wt-dw-flame{transform-box:fill-box;transform-origin:50% 100%;animation:wt-dw-flick 1.8s ease-in-out infinite}" +
    "@keyframes wt-dw-flick{0%,100%{transform:scale(1);opacity:1}30%{transform:scale(1.08,1.14);opacity:.94}60%{transform:scale(.94,1.02);opacity:1}}" +
    ".wt-dw-greet{position:relative;z-index:3;font-family:'Mukta','Noto Serif Devanagari',sans-serif;font-weight:600;font-size:20px;line-height:1.2;text-align:center;white-space:nowrap;background:var(--paper,#fff8e6);border:1px solid rgba(201,138,18,.55);border-radius:999px;padding:.2rem .95rem;box-shadow:0 4px 14px rgba(180,120,0,.18)}.wt-dw-greet span{background:linear-gradient(90deg,#d61f0a,#ff6a00 55%,#c78d00);-webkit-background-clip:text;background-clip:text;color:transparent}" +
    ".wt-stage .wt-dw-greet{position:absolute;left:50%;top:-2.3rem;transform:translateX(-50%)}" +
    ".hero .wt-dw-greet{grid-column:1/-1;order:-2;justify-self:center;margin-bottom:.2rem;font-size:18px}" +
    ".clock .dot.muhurat{background:var(--gold);animation:pulse 1.6s infinite}" +
    "@media(prefers-reduced-motion:reduce){.wt-dw-diya .wt-dw-flame,.clock .dot.muhurat{animation:none!important}}" +
  ".themebar.wt-dw-on{background:linear-gradient(90deg,#fff1cf,#ffe2b0 45%,var(--bg,#faf7f0) 100%);font-variant-numeric:lining-nums}" +
  ".themebar.wt-dw-on{display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden}" +
  ".themebar.wt-dw-on>.wrap{flex:0 0 auto;width:auto;position:relative;z-index:3}" +
  "#wt-dw{background:linear-gradient(90deg,#fff1cf,#ffe2b0 45%,#f7ead0 100%);font-variant-numeric:lining-nums}" +
  "#wt-dw{position:relative;flex:1 1 auto;min-width:0;max-height:70px;height:70px;display:flex;align-items:center;gap:12px;padding:2px 12px;box-sizing:border-box;overflow:hidden;color:#7a1f00;z-index:3}" +
  ".wt-dw-bg,.wt-dw-petals{position:absolute;inset:0;overflow:hidden;pointer-events:none}" +
  ".wt-dw-bg{z-index:1;opacity:.28}.wt-dw-bg svg{width:100%;height:100%;display:block}" +
  ".wt-dw-petals{z-index:2}" +
  ".wt-dw-badge{position:relative;z-index:3;flex:0 0 60px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle at 50% 32%,#fff8dc,#ffe9a8 55%,#f0ad1d);border:2px solid #c98a12;box-shadow:0 0 12px rgba(255,180,0,.6);animation:wt-dw-fill 2.6s ease-in-out infinite;display:flex;align-items:center;justify-content:center}" +
  ".wt-dw-badge svg{width:46px;height:46px;display:block}" +
  ".wt-dw-txt{position:relative;z-index:3;flex:1 1 auto;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:0}" +
  ".wt-dw-l1{position:relative;display:inline-block;align-self:flex-start;height:48px;line-height:48px;min-width:180px;font-family:'Yatra One','Noto Serif Devanagari','Mukta',serif;font-size:28px;font-weight:700;overflow:hidden;white-space:nowrap}" +
  ".wt-dw-l1-t{display:inline-block;padding-top:3px;line-height:42px;background:linear-gradient(90deg,#d61f0a,#ff6a00 50%,#ffb400);-webkit-background-clip:text;background-clip:text;color:transparent}" +
  ".wt-dw-shim{position:absolute;inset:0;pointer-events:none;background:linear-gradient(108deg,rgba(255,255,255,0) 20%,rgba(255,250,220,.85) 50%,rgba(255,255,255,0) 80%);transform:translate3d(-120%,0,0);opacity:0;animation:wt-dw-shimmer 1.1s ease-out .2s 1 forwards}" +
  ".wt-dw-l3{color:#7a1f00;white-space:nowrap;height:15px;line-height:15px;font-family:'Inter','Noto Serif Devanagari','Mukta',sans-serif;font-size:11px;font-weight:500;overflow:hidden}" +
  ".wt-dw-petal{position:absolute;top:0;left:var(--wt-dw-x,50%);width:var(--wt-dw-s,12px);height:var(--wt-dw-s,12px);border-radius:85% 0 85% 0;background:var(--wt-dw-pc,#ff6a00);pointer-events:none;opacity:0;transform:translate3d(0,-14px,0) rotate(0deg);animation:wt-dw-petalfall var(--wt-dw-d,4.2s) ease-in-out var(--wt-dw-dl,0s) infinite}" +
  ".wt-dw-sp{margin:8px 0 0;padding:8px 12px;background:#fff4d6;color:#7a1f00;border:1px solid #e8a33d;border-radius:12px;font-family:'Inter','Mukta',sans-serif;font-size:13px;line-height:1.45;font-variant-numeric:lining-nums}" +
  ".wt-dw-sp-t{background:linear-gradient(90deg,#d61f0a,#ff6a00 55%,#c78d00);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:15px}" +
  "#wt-dw-shower{position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden}" +
  ".wt-dw-ov{position:absolute;left:50%;top:12px;width:9px;height:11px;margin-left:-4.5px;border-radius:85% 0 85% 0;background:linear-gradient(135deg,#ff6a00,#d61f0a);opacity:0;animation:wt-dw-ov 2.6s ease-in-out infinite}" +
  ".wt-dw-ov:nth-child(2){--ox:-11px}.wt-dw-ov:nth-child(3){--ox:0;animation-delay:.85s;background:linear-gradient(135deg,#ffd76a,#ffb400)}.wt-dw-ov:nth-child(4){--ox:11px;animation-delay:1.7s;background:linear-gradient(135deg,#ff8c42,#ff6a00)}" +
  "@keyframes wt-dw-fill{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}" +
  "@keyframes wt-dw-ov{0%{transform:translate(0,10px) scale(.5);opacity:0}25%{opacity:1}55%{transform:translate(var(--ox,0),-6px) scale(1)}100%{transform:translate(calc(var(--ox,0)*1.6),12px) scale(.75);opacity:0}}" +
  "#ticker.wt-dw-tk{margin:10px 14px 0;border-radius:14px;border:2px solid #c98a12;outline:0;box-shadow:0 0 0 1px rgba(255,215,0,.5),0 8px 28px rgba(180,120,0,.35),inset 0 0 0 1px rgba(255,215,0,.28);overflow:hidden;-webkit-mask-image:none;mask-image:none}" +
  "[data-theme=dark] #ticker.wt-dw-tk{box-shadow:0 0 0 1px rgba(255,215,0,.5),0 8px 28px rgba(180,120,0,.35),inset 0 0 0 1px rgba(255,215,0,.28),0 0 60px 10px rgba(255,170,40,.12)}" +
  "@media(max-width:640px){#ticker.wt-dw-tk{margin:8px 8px 0;border-radius:10px}}" +
  "@keyframes wt-dw-shimmer{0%{transform:translate3d(-120%,0,0);opacity:.95}85%{transform:translate3d(120%,0,0);opacity:.95}100%{transform:translate3d(120%,0,0);opacity:0}}" +
  "@keyframes wt-dw-petalfall{0%{transform:translate3d(0,-14px,0) rotate(0deg);opacity:0}12%,88%{opacity:.95}50%{transform:translate3d(var(--wt-dw-dx,8px),calc(var(--wt-dw-y,64px)*.5),0) rotate(160deg);opacity:.95}100%{transform:translate3d(calc(var(--wt-dw-dx,8px)*-.6),var(--wt-dw-y,64px),0) rotate(320deg);opacity:0}}" +
  "@keyframes wt-dw-twinkle{0%,100%{opacity:.25}50%{opacity:1}}" +
  "@media (max-width:860px){#wt-dw{gap:8px;padding:2px 8px}.wt-dw-l1{font-size:23px;min-width:150px;height:40px;line-height:40px}.wt-dw-l1-t{line-height:34px}.wt-dw-l3{height:14px;line-height:14px;font-size:10.5px}}" +
  "@media (max-width:640px){.themebar.wt-dw-on{flex-wrap:wrap}#wt-dw{flex:0 0 100%;width:100%;max-height:54px;height:54px;gap:6px;padding:2px 8px}.themebar.wt-dw-on>.wrap{flex:0 0 100%;width:100%;justify-content:flex-end}.wt-dw-badge{flex:0 0 46px;width:46px;height:46px}.wt-dw-badge svg{width:36px;height:36px}.wt-dw-l1{font-size:20px;min-width:125px;height:36px;line-height:36px}.wt-dw-l1-t{padding-top:3px;line-height:30px}.wt-dw-ov{top:9px;width:8px;height:8px;margin-left:-4px}.wt-dw-l3{font-size:8.6px;height:13px;line-height:13px}}" +
  "@media (max-width:360px){#wt-dw{max-height:68px;height:auto}.wt-dw-l3{white-space:normal;height:auto;line-height:13px}}" +
  ".wt-dw-fwword{position:fixed;left:50%;top:40%;z-index:71;pointer-events:none;transform:translate(-50%,-50%) scale(.8);font-family:Georgia,'Noto Serif Devanagari',serif;font-weight:700;font-size:36px;letter-spacing:.5px;color:#ffb400;text-shadow:0 0 18px rgba(255,180,0,.85),0 2px 0 rgba(120,60,0,.45);opacity:0;transition:opacity .45s ease,transform .45s ease;white-space:nowrap}" +
  ".wt-dw-fwword-show{opacity:1;transform:translate(-50%,-50%) scale(1)}" +
  ".wt-dw-fwword-out{opacity:0;transform:translate(-50%,-50%) scale(1.18)}" +
  "@media (max-width:640px){.wt-dw-fwword{font-size:28px}}" +
  "#wt-dw.wt-dw-paused *,#wt-dw-shower.wt-dw-paused *{animation-play-state:paused!important}" +
  "@media(prefers-reduced-motion:reduce){#wt-dw *,#wt-dw-shower *{animation:none!important}.wt-dw-petals,#wt-dw-shower,.wt-dw-shim{display:none!important}.wt-dw-ov{display:none!important}#wt-dw-fw,.wt-dw-fwword{display:none!important}}";

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
  var DIYA_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path class="wt-dw-flame" d="M12 4c1.9 2.4 2.9 4.1 2.9 5.9a2.9 2.9 0 1 1-5.8 0c0-1.8 1-3.5 2.9-5.9z" fill="#ff7a00"/>' +
    '<path class="wt-dw-flame" d="M12 6.6c1 1.3 1.5 2.2 1.5 3a1.5 1.5 0 1 1-3 0c0-.8.5-1.7 1.5-3z" fill="#ffd23e"/>' +
    '<path d="M3.5 12.5h17c0 3.6-3.8 6.2-8.5 6.2s-8.5-2.6-8.5-6.2z" fill="#b34a1a"/>' +
    '<path d="M3.5 12.5h17" stroke="#e8a33d" stroke-width="1.4" fill="none"/>' +
    '</svg>';

  /* ---------- toran (under the header): an even SVG bandhanwar ----------
     Marigold pom-poms (orange / yellow alternating) strung on a gold thread
     with a gentle drape, green mango leaves every 5th flower, and little
     2-flower danglers every 6th. Flowers are placed at exact even intervals
     from the real page width, so the toran is perfectly even on any screen. */
  function drawToran(toran) {
    var W = toran.clientWidth || window.innerWidth || 1200;
    if (W < 200) W = window.innerWidth || 1200;
    var small = false;
    try { small = window.matchMedia('(max-width:640px)').matches; } catch (e) {}
    var H = small ? 60 : 72, sag = small ? 7 : 9, r = small ? 11 : 13, gap = small ? 30 : 34;
    var N = Math.max(8, Math.round(W / gap));
    var step = W / N;
    function yAt(x) { var t = (2 * x / W) - 1; return 22 + sag * (1 - t * t); }
    var s = '<svg width="100%" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><defs>';
    s += '<radialGradient id="wt-dw-mgo" cx="42%" cy="38%" r="65%"><stop offset="0%" stop-color="#ffb400"/><stop offset="55%" stop-color="#ff6a00"/><stop offset="100%" stop-color="#d61f0a"/></radialGradient>';
    s += '<radialGradient id="wt-dw-mgy" cx="42%" cy="38%" r="65%"><stop offset="0%" stop-color="#fff3c4"/><stop offset="55%" stop-color="#ffb400"/><stop offset="100%" stop-color="#e67300"/></radialGradient>';
    s += '<g id="wt-dw-mg-o">' +
      '<circle cx="0" cy="-11" r="4" fill="#e67300"/><circle cx="7.8" cy="-7.8" r="4" fill="#e67300"/><circle cx="11" cy="0" r="4" fill="#e67300"/><circle cx="7.8" cy="7.8" r="4" fill="#e67300"/><circle cx="0" cy="11" r="4" fill="#e67300"/><circle cx="-7.8" cy="7.8" r="4" fill="#e67300"/><circle cx="-11" cy="0" r="4" fill="#e67300"/><circle cx="-7.8" cy="-7.8" r="4" fill="#e67300"/>' +
      '<circle r="13" fill="url(#wt-dw-mgo)"/><circle r="7.5" fill="#ff8c42" opacity=".5"/><circle r="3" fill="#8a1f00" opacity=".5"/></g>';
    s += '<g id="wt-dw-mg-y">' +
      '<circle cx="0" cy="-11" r="4" fill="#ffb400"/><circle cx="7.8" cy="-7.8" r="4" fill="#ffb400"/><circle cx="11" cy="0" r="4" fill="#ffb400"/><circle cx="7.8" cy="7.8" r="4" fill="#ffb400"/><circle cx="0" cy="11" r="4" fill="#ffb400"/><circle cx="-7.8" cy="7.8" r="4" fill="#ffb400"/><circle cx="-11" cy="0" r="4" fill="#ffb400"/><circle cx="-7.8" cy="-7.8" r="4" fill="#ffb400"/>' +
      '<circle r="13" fill="url(#wt-dw-mgy)"/><circle r="7.5" fill="#ffd76a" opacity=".6"/><circle r="3" fill="#7a3a00" opacity=".45"/></g>';
    s += '<g id="wt-dw-leaf"><path d="M0 0 C 6 -2, 14 2, 16 10 C 10 14, 2 10, 0 0 Z" fill="#2e7d32"/><path d="M2 1 C 7 4, 11 7, 13 10" stroke="#1b5e20" stroke-width="1" fill="none"/></g>';
    s += '</defs>';
    var pts = [], i, x, y;
    for (i = 0; i < N; i++) { x = (i + 0.5) * step; pts.push(x.toFixed(1) + ',' + (yAt(x) - r - 1).toFixed(1)); }
    s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#c98a12" stroke-width="1.6"/>';
    for (i = 0; i < N; i++) {
      x = (i + 0.5) * step; y = yAt(x);
      s += '<use href="#wt-dw-mg-' + (i % 2 === 0 ? 'o' : 'y') + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '"/>';
      if (i % 5 === 4) s += '<use href="#wt-dw-leaf" x="' + (x + 9).toFixed(1) + '" y="' + (y + 8).toFixed(1) + '"/>';
      if (i % 6 === 5) {
        s += '<line x1="' + x.toFixed(1) + '" y1="' + (y + r - 1).toFixed(1) + '" x2="' + x.toFixed(1) + '" y2="' + (y + r + 11).toFixed(1) + '" stroke="#c98a12" stroke-width="1.2"/>';
        s += '<circle cx="' + (x - 4).toFixed(1) + '" cy="' + (y + r + 15).toFixed(1) + '" r="5" fill="url(#wt-dw-mgy)"/>';
        s += '<circle cx="' + (x + 4).toFixed(1) + '" cy="' + (y + r + 17).toFixed(1) + '" r="5" fill="url(#wt-dw-mgo)"/>';
      }
    }
    s += '</svg>';
    toran.innerHTML = s;
  }
  function buildToran() {
    if (document.getElementById('wt-dw-toran')) return;
    var header = document.querySelector('header');
    if (!header) return;
    var toran = document.createElement('div');
    toran.id = 'wt-dw-toran'; toran.setAttribute('aria-hidden', 'true');
    header.after(toran);
    drawToran(toran);
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { drawToran(toran); }, 200);
    });
  }

  /* ---------- side garlands (desktop only) ---------- */
  /* ---------- side garlands (desktop only): flow, sway, and swing ----------
     The garland flows (its flower string drifts slowly down) and sways gently.
     Hover with a mouse, or drag a finger over it on a tablet, and it swings
     toward your pointer like a real hanging garland, then springs back. */
  function bindSideSwing(g) {
    var lastKick = 0;
    function kick() {
      var t = Date.now();
      if (t - lastKick < 1200) return;
      lastKick = t;
      g.classList.remove('wt-dw-side-kick');
      void g.offsetWidth; /* restart the swing animation */
      g.classList.add('wt-dw-side-kick');
    }
    g.addEventListener('pointerenter', kick);
    g.addEventListener('pointerdown', kick);
    g.addEventListener('pointermove', kick);
    g.addEventListener('animationend', function () { g.classList.remove('wt-dw-side-kick'); });
  }
  function buildSides() {
    if (document.querySelector('.wt-dw-side')) return;
    ['left', 'right'].forEach(function (side) {
      var g = document.createElement('div');
      g.className = 'wt-dw-side ' + side; g.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('div');
      inner.className = 'wt-dw-side-in';
      var ts = document.createElement('img');
      ts.src = '/assets/diwali-tassel.png'; ts.alt = '';
      inner.appendChild(ts);
      g.appendChild(inner);
      document.body.appendChild(g);
      bindSideSwing(g);
    });
  }

  /* ---------- Founder's story: orange 'Happy Diwali' pill ---------- */
  function buildFounderPill() {
    if (!isAbout) return;
    var h = document.getElementById('founder');
    if (!h || document.querySelector('.wt-dw-founder-pill')) return;
    var pill = document.createElement('div');
    pill.className = 'wt-dw-founder-pill';
    pill.textContent = '🪔 Happy Diwali';
    h.after(pill);
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
  var treeTries = 0;
  function pollTree() {
    swapTiles();
    placeGreet();
    treeTries++;
    if ((!swapped || !greetPlaced) && treeTries < 20) setTimeout(pollTree, 300);
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


  /* ---------- Diwali strip (same look as the Dhanteras strip) ---------- */
  var FONT_TITLE_HREF = 'https://fonts.googleapis.com/css2?family=Yatra+One&display=swap&text=%E0%A4%B6%E0%A5%81%E0%A4%AD%E0%A4%A6%E0%A5%80%E0%A4%B5%E0%A4%BE%E0%A4%B2%E0%A5%80';
  var KEY_SHOWER_DW = 'wt-dw-shower-2026-11-07';
  var KEY_FW = 'wt-dw-fw-2026';
  var FW_WORDS = ['Learn', 'Invest', 'Grow', 'Save'];
  var FW_COLORS = ['#ffb400', '#ff6a00', '#ffd76a', '#ff8c42'];

  var BG_SVG_DW =
    '<svg viewBox="0 0 600 64" preserveAspectRatio="none" aria-hidden="true">' +
    '<defs><pattern id="wt-dw-pa" width="40" height="64" patternUnits="userSpaceOnUse"><path d="M0,4Q20,12 40,4M0,60Q20,52 40,60" fill="none" stroke="#c9a227" stroke-width="1.2"/></pattern></defs>' +
    '<rect width="600" height="64" fill="url(#wt-dw-pa)"/>' +
    '<path d="M478,16V32M470,24H486M478,16H486M478,32H470M470,24V16M486,24V32" stroke="#d9531e" stroke-width="1.4" fill="none"/>' +
    '<g fill="#d9531e" transform="translate(525,18)"><ellipse cx="4" cy="7" rx="2.3" ry="4" transform="rotate(-12 4 7)"/><circle cx="2" cy="1.2" r=".8"/><circle cx="4" cy=".8" r=".8"/><circle cx="6" cy="1.4" r=".7"/><ellipse cx="12" cy="8" rx="2.3" ry="4" transform="rotate(12 12 8)"/><circle cx="10" cy="2.2" r=".7"/><circle cx="12" cy="1.6" r=".8"/><circle cx="14" cy="2.2" r=".8"/></g></svg>';

  var BADGE_DIYA_SVG =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
    '<defs><radialGradient id="wt-dw-flg" cx="50%" cy="78%" r="65%"><stop offset="0%" stop-color="#fffbe0"/><stop offset="45%" stop-color="#ffe27a"/><stop offset="78%" stop-color="#ffb400"/><stop offset="100%" stop-color="#ff7a00"/></radialGradient></defs>' +
    '<circle cx="24" cy="25" r="21" fill="rgba(255,190,60,.20)"/>' +
    '<path d="M24 4 C27.5 9.5 28.5 13 28.5 16 C28.5 19.5 26.5 21.5 24 21.5 C21.5 21.5 19.5 19.5 19.5 16 C19.5 13 20.5 9.5 24 4 Z" fill="url(#wt-dw-flg)"/>' +
    '<ellipse cx="24" cy="16" rx="2.1" ry="3.1" fill="#fffbe0"/>' +
    '<path d="M9 25 Q24 20 39 25 L36.5 33 Q24 39 11.5 33 Z" fill="#c85a1e"/>' +
    '<path d="M9 25 Q24 20 39 25 L38 27.5 Q24 30.5 10 27.5 Z" fill="#e8a33d"/>' +
    '<path d="M13.5 33.5 Q24 37.5 34.5 33.5" stroke="#8a3c10" stroke-width="1" fill="none"/></svg>';

  var PETAL_COLORS = ['#d61f0a', '#ffb400', '#ff6a00', '#ff8c42', '#e67300'];
  function makePetalsDw(n, fallY, s0, sR) {
    var box = document.createElement('div');
    box.className = 'wt-dw-petals';
    box.setAttribute('aria-hidden', 'true');
    if (reduceMotion) return box;
    for (var i = 0, m = n > 32 ? 32 : n; i < m; i++) {
      var c = document.createElement('span');
      c.className = 'wt-dw-petal';
      c.style.setProperty('--wt-dw-pc', PETAL_COLORS[i % PETAL_COLORS.length]);
      c.style.setProperty('--wt-dw-s', (s0 + Math.floor(Math.random() * sR)) + 'px');
      c.style.setProperty('--wt-dw-x', (2 + ((i * 92) / m) + Math.random() * 3).toFixed(1) + '%');
      c.style.setProperty('--wt-dw-d', (3 + Math.random() * 3).toFixed(2) + 's');
      c.style.setProperty('--wt-dw-dl', (Math.random() * 2.2).toFixed(2) + 's');
      c.style.setProperty('--wt-dw-dx', ((i % 2 ? -1 : 1) * (3 + (i % 5))) + 'px');
      c.style.setProperty('--wt-dw-y', fallY);
      box.appendChild(c);
    }
    return box;
  }

  var showerDwDone = false;
  function launchShowerDw() {
    if (showerDwDone || reduceMotion || !document.body) return;
    var run = preview === '1' || preview === '7' || preview === '8';
    if (!run) {
      try {
        if (!window.localStorage.getItem(KEY_SHOWER_DW)) {
          window.localStorage.setItem(KEY_SHOWER_DW, '1');
          run = true;
        }
      } catch (e) { run = true; }
    }
    showerDwDone = true;
    if (!run) return;
    var layer = makePetalsDw(30, '98vh', 9, 6);
    layer.id = 'wt-dw-shower';
    if (document.hidden) layer.classList.add('wt-dw-paused');
    document.body.appendChild(layer);
    setTimeout(function () {
      try { if (layer.parentNode) layer.parentNode.removeChild(layer); } catch (e) {}
    }, 3000);
  }

  var stripDwBuilt = false;
  function buildStrip() {
    if (stripDwBuilt) return;
    try {
      if (document.head && !document.getElementById('wt-dw-font-title')) {
        var lt = document.createElement('link');
        lt.id = 'wt-dw-font-title'; lt.rel = 'stylesheet'; lt.href = FONT_TITLE_HREF;
        document.head.appendChild(lt);
      }
    } catch (e) {}
    launchShowerDw();
    var bar = document.querySelector('.themebar');
    if (bar && isHome) {
      bar.classList.add('wt-dw-on');
      if (!document.getElementById('wt-dw')) {
        var el = document.createElement('div');
        el.id = 'wt-dw';
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', 'Shubh Diwali Greeting');
        el.innerHTML =
          '<div class="wt-dw-bg" aria-hidden="true">' + BG_SVG_DW + '</div>' +
          '<div class="wt-dw-badge" aria-hidden="true">' + BADGE_DIYA_SVG + '<i class="wt-dw-ov"></i><i class="wt-dw-ov"></i><i class="wt-dw-ov"></i></div>' +
          '<div class="wt-dw-txt"><div class="wt-dw-l1"><span class="wt-dw-l1-t">शुभ दीवाली</span>' +
          (reduceMotion ? '' : '<span class="wt-dw-shim" aria-hidden="true"></span>') +
          '</div>' +
          '<div class="wt-dw-l3">WealthyTrees Private Limited की ओर से सभी को दीवाली की हार्दिक शुभकामनाएँ</div></div>';
        el.insertBefore(makePetalsDw(24, '64px', 8, 6), el.children[1]);
        bar.insertBefore(el, bar.firstChild);
      }
      stripDwBuilt = true;
    }
    var tk = document.getElementById('ticker');
    if (tk) tk.classList.add('wt-dw-tk');
    var bub = document.querySelector('#p-live .sp-intro .sp-bub');
    if (bub && !bub.querySelector('.wt-dw-sp')) {
      var p = document.createElement('p');
      p.className = 'wt-dw-sp';
      p.innerHTML = '<b class="wt-dw-sp-t">शुभ दीवाली!</b> 🪔 WealthyTrees Private Limited की ओर से आप सभी को दीवाली की हार्दिक शुभकामनाएँ। — Sprout 🌱';
      bub.appendChild(p);
    }
  }

  /* ---------- fireworks on load: a cracker bursts, then a finance word ---------- */
  var fwDone = false;
  function runFireworks() {
    if (fwDone || reduceMotion || !document.body) return;
    fwDone = true;
    var isPreview = preview === '1' || preview === '7' || preview === '8';
    if (!isPreview) {
      try {
        /* Homepage and About each get their own once-per-session show,
           so the Founder's story firecrackers still fire after the homepage. */
        var fwKey = KEY_FW + (isAbout ? '-about' : '');
        if (window.sessionStorage.getItem(fwKey)) return;
        window.sessionStorage.setItem(fwKey, '1');
      } catch (e) {}
    }
    var cv = document.createElement('canvas');
    cv.id = 'wt-dw-fw';
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:70';
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d');
    function size() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
    size();
    window.addEventListener('resize', size);
    var rockets = [], sparks = [], idx = 0, finished = false;
    function showWord(word, x, y) {
      var el = document.createElement('div');
      el.className = 'wt-dw-fwword';
      el.textContent = word;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      document.body.appendChild(el);
      setTimeout(function () { el.classList.add('wt-dw-fwword-show'); }, 60);
      setTimeout(function () {
        el.classList.add('wt-dw-fwword-out');
        setTimeout(function () { try { el.remove(); } catch (e) {} }, 700);
      }, 1700);
    }
    function burst(r) {
      var n = 70, i, a, sp;
      for (i = 0; i < n; i++) {
        a = Math.random() * Math.PI * 2;
        sp = 1.5 + Math.random() * 4.5;
        sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: 0.008 + Math.random() * 0.012, color: r.color, size: 1 + Math.random() * 2 });
      }
      showWord(r.word, r.x, r.y);
    }
    function tick() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      var i, r, s;
      for (i = rockets.length - 1; i >= 0; i--) {
        r = rockets[i];
        r.y += r.vy; r.vy += 0.12;
        ctx.beginPath(); ctx.moveTo(r.x, r.y + 16); ctx.lineTo(r.x, r.y); ctx.strokeStyle = r.color; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(r.x, r.y, 3, 0, Math.PI * 2); ctx.fillStyle = '#fff8e6'; ctx.fill();
        if (r.vy >= -1 || r.y <= r.ty) { rockets.splice(i, 1); burst(r); }
      }
      for (i = sparks.length - 1; i >= 0; i--) {
        s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.05; s.vx *= 0.985; s.vy *= 0.985; s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fillStyle = s.color; ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (rockets.length || sparks.length || idx < FW_WORDS.length) {
        requestAnimationFrame(tick);
      } else if (!finished) {
        finished = true;
        cv.style.transition = 'opacity .8s';
        cv.style.opacity = '0';
        setTimeout(function () { try { cv.remove(); } catch (e) {} }, 900);
      }
    }
    function schedule() {
      if (idx >= FW_WORDS.length) return;
      var x = cv.width * (0.2 + Math.random() * 0.6);
      var y = cv.height * (0.16 + Math.random() * 0.22);
      rockets.push({ x: x, y: cv.height + 10, vy: -(9 + Math.random() * 2), ty: y, color: FW_COLORS[idx % FW_COLORS.length], word: FW_WORDS[idx] });
      idx++;
      setTimeout(schedule, 1500);
    }
    setTimeout(schedule, 700);
    requestAnimationFrame(tick);
  }

  /* ---------- boot ---------- */
  function boot() {
    injectCSS();
    if (isDecor) {
      buildToran();
      buildSides();
      pollTree();
      buildStrip();
      /* Fireworks on the homepage and on About / Founder's story only. */
      if (isHome || isAbout) runFireworks();
      buildFounderPill();
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
