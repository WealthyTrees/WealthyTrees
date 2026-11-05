/* WealthyTrees - Dhanteras greeting (6 Nov 2026 IST). Theme strip + Sprout + first-open shower + festive ticker frame and diya row. The ticker's own markup and data are untouched - only a gold frame around it and a diya row below it. Preview any day: ?dhanteras=1 */
(function () {
 'use strict';
 var DATE_IST = '2026-11-06';
 var KEY_SHOWER = 'wt-dh-shower-2026-11-06';
 var FONT_HREF = 'https://fonts.googleapis.com/css2?family=Yatra+One&display=swap&text=%E0%A4%B6%E0%A5%81%E0%A4%AD%E0%A4%A7%E0%A4%A8%E0%A4%A4%E0%A5%87%E0%A4%B0%E0%A4%B8';

 var preview = false, isDate = false, reduceMotion = false;
 try { preview = new URLSearchParams(window.location.search).get('dhanteras') === '1'; } catch (e) {}
 try { isDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()) === DATE_IST; } catch (e) {}
 if (!isDate && !preview) return;
 try { reduceMotion = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}

 var CSS =
  ".themebar.wt-dh-on,#wt-dh{background:linear-gradient(90deg,#fff1cf,#ffe2b0 45%,var(--bg,#faf7f0) 100%);font-variant-numeric:lining-nums}" +
  ".themebar.wt-dh-on{display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden}" +
  ".themebar.wt-dh-on>.wrap{flex:0 0 auto;width:auto;position:relative;z-index:3}" +
  "#wt-dh{position:relative;flex:1 1 auto;min-width:0;max-height:64px;height:64px;display:flex;align-items:center;gap:12px;padding:2px 12px;box-sizing:border-box;overflow:hidden;color:#7a1f00;z-index:3}" +
  ".wt-dh-bg,.wt-dh-coins{position:absolute;inset:0;overflow:hidden;pointer-events:none}" +
  ".wt-dh-bg{z-index:1;opacity:.28}.wt-dh-bg svg,.wt-dh-badge svg{width:100%;height:100%;display:block}" +
  ".wt-dh-coins{z-index:2}.wt-dh-badge{position:relative;z-index:3;flex:0 0 60px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle at 50% 32%,#fff8dc,#ffe9a8 55%,#f0ad1d);border:2px solid #c98a12;box-shadow:0 0 12px rgba(255,180,0,.6)}" +
  ".wt-dh-txt{position:relative;z-index:3;flex:1 1 auto;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:0}" +
  ".wt-dh-l1{position:relative;display:inline-block;align-self:flex-start;height:34px;line-height:34px;min-width:150px;font-family:'Yatra One','Noto Serif Devanagari','Mukta',serif;font-size:24px;font-weight:700;overflow:hidden;white-space:nowrap}" +
  ".wt-dh-l1-t{display:inline-block;padding-top:5px;line-height:29px;background:linear-gradient(90deg,#d61f0a,#ff6a00 50%,#ffb400);-webkit-background-clip:text;background-clip:text;color:transparent}" +
  ".wt-dh-shim{position:absolute;inset:0;pointer-events:none;background:linear-gradient(108deg,rgba(255,255,255,0) 20%,rgba(255,250,220,.85) 50%,rgba(255,255,255,0) 80%);transform:translate3d(-120%,0,0);opacity:0;animation:wt-dh-shimmer 1.1s ease-out .2s 1 forwards}" +
  ".wt-dh-l3{color:#7a1f00;white-space:nowrap;height:15px;line-height:15px}" +
  ".wt-dh-l3{font-family:'Inter','Noto Serif Devanagari','Mukta',sans-serif;font-size:11px;font-weight:500;overflow:hidden}" +
  ".wt-dh-coin{position:absolute;top:0;left:var(--wt-dh-x,50%);width:var(--wt-dh-s,12px);height:var(--wt-dh-s,12px);border-radius:50%;background:radial-gradient(circle at 32% 30%,#fff9c4,#ffd700 45%,#d48800 82%,#8c5000);box-shadow:inset 0 0 0 1px rgba(140,80,0,.55);pointer-events:none;opacity:0;transform:translate3d(0,-14px,0);animation:wt-dh-fall var(--wt-dh-d,4.2s) linear var(--wt-dh-dl,0s) infinite}" +
  ".wt-dh-flame{transform-origin:49px 21px;animation:wt-dh-flicker 1.8s ease-in-out infinite}" +
  ".wt-dh-sp1,.wt-dh-sp2,.wt-dh-sp3{animation:wt-dh-twinkle 2.2s ease-in-out infinite}.wt-dh-sp2{animation-delay:.8s}.wt-dh-sp3{animation-delay:.4s}" +
  ".wt-dh-sp{margin:8px 0 0;padding:8px 12px;background:#fff4d6;color:#7a1f00;border:1px solid #e8a33d;border-radius:12px;font-size:13px;line-height:1.45;font-variant-numeric:lining-nums}" +
  ".wt-dh-sp-t{background:linear-gradient(90deg,#d61f0a,#ff6a00 55%,#c78d00);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:15px}" +
  "#wt-dh-shower{position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden}" +
  "#ticker.wt-dh-tk{outline:2px solid #c98a12;outline-offset:-2px;box-shadow:0 0 0 1px rgba(255,215,0,.45),0 4px 18px rgba(180,120,0,.30)}" +
  "#wt-dh-diyas{display:flex;justify-content:space-evenly;align-items:flex-end;height:20px;padding:0 12px;background:linear-gradient(180deg,#fff3d2,#ffe3ae);overflow:hidden;pointer-events:none}" +
  ".wt-dh-diya{position:relative;flex:0 0 16px;width:16px;height:9px;background:radial-gradient(circle at 50% 0,#c05a1e,#7c2d12 72%);border-radius:2px 2px 10px 10px/2px 2px 9px 9px;box-shadow:0 1px 2px rgba(120,60,0,.45)}" +
  ".wt-dh-diya::before{content:\"\";position:absolute;left:50%;bottom:8px;width:7px;height:11px;margin-left:-3.5px;background:radial-gradient(circle at 50% 78%,#fff7ae,#ffb400 55%,#ff7a00);border-radius:50% 50% 50% 50%/62% 62% 38% 38%;transform-origin:50% 100%;animation:wt-dh-dflame 1.1s ease-in-out infinite alternate}" +
  "@keyframes wt-dh-dflame{from{transform:scale(1) rotate(-3deg);opacity:.9}to{transform:scale(1.14) rotate(3deg);opacity:1}}" +
  "[data-theme=dark] #wt-dh-diyas{background:linear-gradient(180deg,#4a3410,#33230a)}" +
  "#wt-dh.wt-dh-paused *,#wt-dh.wt-dh-offscreen *,#wt-dh-shower.wt-dh-paused *{animation-play-state:paused!important}" +
  "@keyframes wt-dh-shimmer{0%{transform:translate3d(-120%,0,0);opacity:.95}85%{transform:translate3d(120%,0,0);opacity:.95}100%{transform:translate3d(120%,0,0);opacity:0}}" +
  "@keyframes wt-dh-fall{0%{transform:translate3d(0,-14px,0) rotateY(0) scaleX(1);opacity:0}12%,88%{opacity:.9}50%{transform:translate3d(var(--wt-dh-dx,5px),calc(var(--wt-dh-y,64px)*.5),0) rotateY(180deg) scaleX(.62);opacity:.9}100%{transform:translate3d(calc(var(--wt-dh-dx,5px)*-.7),var(--wt-dh-y,64px),0) rotateY(360deg) scaleX(.82);opacity:0}}" +
  "@keyframes wt-dh-flicker{0%,100%{transform:scale(1,1);opacity:.95}50%{transform:scale(.92,1.08);opacity:.78}}" +
  "@keyframes wt-dh-twinkle{0%,100%{opacity:.25}50%{opacity:1}}" +
  "@media (max-width:860px){#wt-dh{gap:8px;padding:2px 8px}.wt-dh-l1{font-size:20px;min-width:130px;height:29px;line-height:29px}.wt-dh-l1-t{line-height:24px}.wt-dh-l3{height:14px;line-height:14px;font-size:10.5px}}" +
  "@media (max-width:640px){.themebar.wt-dh-on{flex-wrap:wrap}#wt-dh{flex:0 0 100%;width:100%;max-height:54px;height:54px;gap:6px;padding:2px 8px}.themebar.wt-dh-on>.wrap{flex:0 0 100%;width:100%;justify-content:flex-end}.wt-dh-badge{flex:0 0 46px;width:46px;height:46px}.wt-dh-l1{font-size:18px;min-width:110px;height:25px;line-height:25px}.wt-dh-l1-t{padding-top:3px;line-height:21px}.wt-dh-l3{font-size:8.6px;height:13px;line-height:13px}}" +
  "@media (max-width:360px){#wt-dh{max-height:68px;height:auto}.wt-dh-l3{white-space:normal;height:auto;line-height:13px}}" +
  "@media (prefers-reduced-motion:reduce){#wt-dh *,#wt-dh-shower *{animation:none!important}.wt-dh-coins,#wt-dh-shower,.wt-dh-shim{display:none!important}.wt-dh-diya::before{animation:none!important}}";

 var BG_SVG =
  '<svg viewBox="0 0 600 64" preserveAspectRatio="none" aria-hidden="true">' +
  '<defs><pattern id="wt-dh-pa" width="40" height="64" patternUnits="userSpaceOnUse"><path d="M0,4Q20,12 40,4M0,60Q20,52 40,60" fill="none" stroke="#c9a227" stroke-width="1.2"/></pattern></defs>' +
  '<rect width="600" height="64" fill="url(#wt-dh-pa)"/>' +
  '<path d="M478,16V32M470,24H486M478,16H486M478,32H470M470,24V16M486,24V32" stroke="#d9531e" stroke-width="1.4" fill="none"/>' +
  '<g fill="#d9531e" transform="translate(525,18)"><ellipse cx="4" cy="7" rx="2.3" ry="4" transform="rotate(-12 4 7)"/><circle cx="2" cy="1.2" r=".8"/><circle cx="4" cy=".8" r=".8"/><circle cx="6" cy="1.4" r=".7"/><ellipse cx="12" cy="8" rx="2.3" ry="4" transform="rotate(12 12 8)"/><circle cx="10" cy="2.2" r=".7"/><circle cx="12" cy="1.6" r=".8"/><circle cx="14" cy="2.2" r=".8"/></g></svg>';

 var BADGE_SVG =
  '<svg viewBox="3 0 58 64" aria-hidden="true"><defs>' +
  '<linearGradient id="wt-dh-gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffe999"/><stop offset="45%" stop-color="#f5b016"/><stop offset="100%" stop-color="#a85d00"/></linearGradient>' +
  '<linearGradient id="wt-dh-gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#c97a00"/><stop offset="50%" stop-color="#fff1b0"/><stop offset="100%" stop-color="#b86b00"/></linearGradient>' +
  '<radialGradient id="wt-dh-gg" cx=".5" cy=".5" r=".5"><stop offset="0%" stop-color="#fff4b8" stop-opacity=".9"/><stop offset="100%" stop-color="#ff9900" stop-opacity="0"/></radialGradient></defs>' +
  '<circle cx="30" cy="34" r="26" fill="url(#wt-dh-gg)"/><path d="M6,30A24,24 0 0,1 54,30" fill="none" stroke="#e89b25" stroke-dasharray="3,2"/><line x1="49" y1="2" x2="49" y2="22" stroke="#c97a00" stroke-width="1.2"/>' +
  '<g class="wt-dh-flame"><path d="M49,13C52,17 52,21 49,23C46,21 46,17 49,13Z" fill="#ff5100"/><path d="M49,15.5C50.8,18 50.8,20.8 49,22.2C47.2,20.8 47.2,18 49,15.5Z" fill="#ffeb75"/></g>' +
  '<path d="M42,22Q49,28 56,22L54,25Q49,27 44,25Z" fill="#b84a00" stroke="#ffd269" stroke-width=".7"/>' +
  '<path d="M18,24C13,18 14,13 21,17C23,18 25,21 26,24Z" fill="#1e7a44"/><path d="M36,24C41,18 40,13 33,17C31,18 29,21 28,24Z" fill="#176336"/>' +
  '<g fill="#ffd700" stroke="#a66300" stroke-width=".6"><circle cx="19" cy="24" r="3.4"/><circle cx="23.5" cy="22.2" r="3.6" fill="#ffe46b"/><circle cx="28" cy="21.8" r="3.8"/><circle cx="32.5" cy="22.8" r="3.5" fill="#ffdf4f"/><circle cx="35.8" cy="25.2" r="3.1"/><circle cx="15.5" cy="27.5" r="2.8" fill="#ffdf4f"/><circle cx="13" cy="56" r="2.7"/><circle cx="39" cy="56.2" r="2.9" fill="#ffe46b"/><circle cx="43.5" cy="54.8" r="2.5"/></g>' +
  '<rect x="16" y="25" width="22" height="4" rx="2" fill="url(#wt-dh-gr)" stroke="#995200" stroke-width=".7"/><path d="M19,29L35,29L33,33L21,33Z" fill="#d98200"/>' +
  '<path d="M21,33C11,36 11,51 22,55L32,55C43,51 43,36 33,33Z" fill="url(#wt-dh-gp)" stroke="#995200" stroke-width="1.3"/>' +
  '<path d="M15,43Q27,47 39,43M27,37V45M23,41H31M27,37H31M27,45H23M23,41V37M31,41V45" fill="none" stroke="#d92b0f" stroke-width="1.5"/>' +
  '<rect x="19" y="55" width="16" height="3.2" rx="1.5" fill="url(#wt-dh-gr)" stroke="#995200" stroke-width=".6"/>' +
  '<path class="wt-dh-sp1" d="M10,14L11.2,17.2L14.4,18.4L11.2,19.6L10,22.8L8.8,19.6L5.6,18.4L8.8,17.2Z" fill="#ffb700"/>' +
  '<path class="wt-dh-sp2" d="M54,35L55,37.5L57.5,38.5L55,39.5L54,42L53,39.5L50.5,38.5L53,37.5Z" fill="#ff9000"/><circle class="wt-dh-sp3" cx="28" cy="11" r="1.6" fill="#ffae00"/></svg>';

 function makeCoins(n, fallY, s0, sR) {
  var box = document.createElement('div');
  box.className = 'wt-dh-coins';
  box.setAttribute('aria-hidden', 'true');
  if (reduceMotion) return box;
  for (var i = 0, m = n > 20 ? 20 : n; i < m; i++) {
   var c = document.createElement('span');
   c.className = 'wt-dh-coin';
   c.style.setProperty('--wt-dh-s', (s0 + Math.floor(Math.random() * sR)) + 'px');
   c.style.setProperty('--wt-dh-x', (2 + ((i * 92) / m) + Math.random() * 3).toFixed(1) + '%');
   c.style.setProperty('--wt-dh-d', (3 + Math.random() * 3).toFixed(2) + 's');
   c.style.setProperty('--wt-dh-dl', (Math.random() * 2.2).toFixed(2) + 's');
   c.style.setProperty('--wt-dh-dx', ((i % 2 ? -1 : 1) * (3 + (i % 5))) + 'px');
   c.style.setProperty('--wt-dh-y', fallY);
   box.appendChild(c);
  }
  return box;
 }

 var io = null, visSet = false, showerDone = false;
 function setupPause(strip) {
  function onVis() {
   var h = Boolean(document.hidden);
   var st = document.getElementById('wt-dh');
   if (st) st.classList.toggle('wt-dh-paused', h);
   var sw = document.getElementById('wt-dh-shower');
   if (sw) sw.classList.toggle('wt-dh-paused', h);
  }
  if (!visSet) { document.addEventListener('visibilitychange', onVis, false); visSet = true; }
  onVis();
  if ('IntersectionObserver' in window && strip && !io) {
   io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
     if (entries[i].target && entries[i].target.id === 'wt-dh') {
      entries[i].target.classList.toggle('wt-dh-offscreen', !entries[i].isIntersecting);
     }
    }
   }, { threshold: 0.01 });
   io.observe(strip);
  }
 }

 function launchShower() {
  if (showerDone || reduceMotion || !document.body) return;
  var run = preview;
  if (!run) {
   try {
    if (!window.localStorage.getItem(KEY_SHOWER)) {
     window.localStorage.setItem(KEY_SHOWER, '1');
     run = true;
    }
   } catch (e) { run = true; }
  }
  showerDone = true;
  if (!run) return;
  var layer = makeCoins(20, '98vh', 13, 6);
  layer.id = 'wt-dh-shower';
  if (document.hidden) layer.classList.add('wt-dh-paused');
  document.body.appendChild(layer);
  setTimeout(function () {
   try { if (layer.parentNode) layer.parentNode.removeChild(layer); } catch (e) {}
  }, 3000);
 }

 function pollDom() {
  var okBar = false, okSp = false;
  try {
   if (document.head) {
    if (!document.getElementById('wt-dh-font')) {
     var l = document.createElement('link');
     l.id = 'wt-dh-font'; l.rel = 'stylesheet'; l.href = FONT_HREF;
     document.head.appendChild(l);
    }
    if (!document.getElementById('wt-dh-style')) {
     var st = document.createElement('style');
     st.id = 'wt-dh-style'; st.textContent = CSS;
     document.head.appendChild(st);
    }
   }
   launchShower();
   var bar = document.querySelector('.themebar');
   if (bar) {
    bar.classList.add('wt-dh-on');
    if (!document.getElementById('wt-dh')) {
     var el = document.createElement('div');
     el.id = 'wt-dh';
     el.setAttribute('role', 'region');
     el.setAttribute('aria-label', 'Shubh Dhanteras Greeting');
     el.innerHTML =
      '<div class="wt-dh-bg" aria-hidden="true">' + BG_SVG + '</div>' +
      '<div class="wt-dh-badge" aria-hidden="true">' + BADGE_SVG + '</div>' +
      '<div class="wt-dh-txt"><div class="wt-dh-l1"><span class="wt-dh-l1-t">शुभ धनतेरस</span>' +
      (reduceMotion ? '' : '<span class="wt-dh-shim" aria-hidden="true"></span>') +
      '</div>' +
      '<div class="wt-dh-l3">WealthyTrees Private Limited की ओर से सभी को धनतेरस की हार्दिक शुभकामनाएँ</div></div>';
     el.insertBefore(makeCoins(14, '64px', 10, 6), el.children[1]);
     bar.insertBefore(el, bar.firstChild);
     setupPause(el);
    }
    okBar = true;
   }
   var tk = document.getElementById('ticker');
   if (tk) {
    tk.classList.add('wt-dh-tk');
    if (!document.getElementById('wt-dh-diyas')) {
     var dr = document.createElement('div');
     dr.id = 'wt-dh-diyas';
     dr.setAttribute('aria-hidden', 'true');
     var dh = '';
     for (var di = 0; di < 12; di++) dh += '<span class="wt-dh-diya"></span>';
     dr.innerHTML = dh;
     tk.parentNode.insertBefore(dr, tk);
    }
   }
   var bub = document.querySelector('#p-live .sp-intro .sp-bub');
   if (bub) {
    if (!bub.querySelector('.wt-dh-sp')) {
     var p = document.createElement('p');
     p.className = 'wt-dh-sp';
     p.innerHTML = '<b class="wt-dh-sp-t">शुभ धनतेरस!</b> 🪔 WealthyTrees Private Limited की ओर से आप सभी को धनतेरस की हार्दिक शुभकामनाएँ। — Sprout 🌱';
     bub.appendChild(p);
    }
    okSp = true;
   }
  } catch (e) {}
  return okBar && okSp;
 }

 var attempts = 0;
 var timer = setInterval(function () {
  attempts += 1;
  if (pollDom() || attempts >= 40) clearInterval(timer);
 }, 300);
 pollDom();
})();