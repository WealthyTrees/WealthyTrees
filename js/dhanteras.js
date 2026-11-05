/* WealthyTrees - Dhanteras greeting (6 Nov 2026 IST). Theme strip + Sprout + first-open shower + festive ticker frame and diya row + photo kalash badge that fills and overflows with coins + natural glowing diya row. The ticker's own markup and data are untouched - only a gold frame around it and a diya row below it. Preview any day: ?dhanteras=1 */
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
  ".themebar.wt-dh-on{background:linear-gradient(90deg,#fff1cf,#ffe2b0 45%,var(--bg,#faf7f0) 100%);font-variant-numeric:lining-nums}" +
  "#wt-dh{background:linear-gradient(90deg,#fff1cf,#ffe2b0 45%,#f7ead0 100%);font-variant-numeric:lining-nums}" +
  ".themebar.wt-dh-on{display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden}" +
  ".themebar.wt-dh-on>.wrap{flex:0 0 auto;width:auto;position:relative;z-index:3}" +
  "#wt-dh{position:relative;flex:1 1 auto;min-width:0;max-height:70px;height:70px;display:flex;align-items:center;gap:12px;padding:2px 12px;box-sizing:border-box;overflow:hidden;color:#7a1f00;z-index:3}" +
  ".wt-dh-bg,.wt-dh-coins{position:absolute;inset:0;overflow:hidden;pointer-events:none}" +
  ".wt-dh-bg{z-index:1;opacity:.28}.wt-dh-bg svg{width:100%;height:100%;display:block}" +
  ".wt-dh-coins{z-index:2}.wt-dh-badge{position:relative;z-index:3;flex:0 0 60px;width:60px;height:60px;border-radius:50%;background:url(/assets/dhanteras-kalash.jpg) center/cover no-repeat,radial-gradient(circle at 50% 32%,#fff8dc,#ffe9a8 55%,#f0ad1d);border:2px solid #c98a12;box-shadow:0 0 12px rgba(255,180,0,.6);animation:wt-dh-fill 2.6s ease-in-out infinite}" +
  ".wt-dh-txt{position:relative;z-index:3;flex:1 1 auto;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:0}" +
  ".wt-dh-l1{position:relative;display:inline-block;align-self:flex-start;height:48px;line-height:48px;min-width:180px;font-family:'Yatra One','Noto Serif Devanagari','Mukta',serif;font-size:28px;font-weight:700;overflow:hidden;white-space:nowrap}" +
  ".wt-dh-l1-t{display:inline-block;padding-top:3px;line-height:42px;background:linear-gradient(90deg,#d61f0a,#ff6a00 50%,#ffb400);-webkit-background-clip:text;background-clip:text;color:transparent}" +
  ".wt-dh-shim{position:absolute;inset:0;pointer-events:none;background:linear-gradient(108deg,rgba(255,255,255,0) 20%,rgba(255,250,220,.85) 50%,rgba(255,255,255,0) 80%);transform:translate3d(-120%,0,0);opacity:0;animation:wt-dh-shimmer 1.1s ease-out .2s 1 forwards}" +
  ".wt-dh-l3{color:#7a1f00;white-space:nowrap;height:15px;line-height:15px}" +
  ".wt-dh-l3{font-family:'Inter','Noto Serif Devanagari','Mukta',sans-serif;font-size:11px;font-weight:500;overflow:hidden}" +
  ".wt-dh-coin{position:absolute;top:0;left:var(--wt-dh-x,50%);width:var(--wt-dh-s,12px);height:var(--wt-dh-s,12px);border-radius:50%;background:radial-gradient(circle at 32% 30%,#fff9c4,#ffd700 45%,#d48800 82%,#8c5000);box-shadow:inset 0 0 0 1px rgba(140,80,0,.55);pointer-events:none;opacity:0;transform:translate3d(0,-14px,0);animation:wt-dh-fall var(--wt-dh-d,4.2s) linear var(--wt-dh-dl,0s) infinite}" +
  ".wt-dh-sp1,.wt-dh-sp2,.wt-dh-sp3{animation:wt-dh-twinkle 2.2s ease-in-out infinite}.wt-dh-sp2{animation-delay:.8s}.wt-dh-sp3{animation-delay:.4s}" +
  ".wt-dh-sp{margin:8px 0 0;padding:8px 12px;background:#fff4d6;color:#7a1f00;border:1px solid #e8a33d;border-radius:12px;font-size:13px;line-height:1.45;font-variant-numeric:lining-nums}" +
  ".wt-dh-sp-t{background:linear-gradient(90deg,#d61f0a,#ff6a00 55%,#c78d00);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:15px}" +
  "#wt-dh-shower{position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden}" +
  ".wt-dh-ov{position:absolute;left:50%;top:12px;width:9px;height:9px;margin-left:-4.5px;border-radius:50%;background:radial-gradient(circle at 32% 30%,#fff9c4,#ffd700 45%,#d48800 82%,#8c5000);box-shadow:inset 0 0 0 1px rgba(140,80,0,.55);opacity:0;animation:wt-dh-ov 2.6s ease-in-out infinite}" +
  ".wt-dh-ov:nth-child(1){--ox:-11px}.wt-dh-ov:nth-child(2){--ox:0;animation-delay:.85s}.wt-dh-ov:nth-child(3){--ox:11px;animation-delay:1.7s}" +
  "@keyframes wt-dh-fill{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}" +
  "@keyframes wt-dh-ov{0%{transform:translate(0,10px) scale(.5);opacity:0}25%{opacity:1}55%{transform:translate(var(--ox,0),-6px) scale(1)}100%{transform:translate(calc(var(--ox,0)*1.6),12px) scale(.75);opacity:0}}" +
  "#ticker.wt-dh-tk{outline:2px solid #c98a12;outline-offset:-2px;box-shadow:0 0 0 1px rgba(255,215,0,.45),0 4px 18px rgba(180,120,0,.30)}" +
  "#wt-dh-diyas{position:relative;display:flex;justify-content:space-evenly;align-items:flex-end;height:26px;padding:0 12px;background:linear-gradient(180deg,#fff3d2,#ffe3ae);border-bottom:1px solid rgba(201,138,18,.35);pointer-events:none}" +
  ".wt-dh-diya{position:relative;z-index:1;flex:0 0 18px;width:18px;height:10px;background:radial-gradient(circle at 50% 0,#d4692a,#a34a18 55%,#6e2a10);border-radius:2px 2px 10px 10px/2px 2px 9px 9px;box-shadow:0 1px 2px rgba(120,60,0,.45),inset 0 2px 0 rgba(255,210,105,.65)}" +
  ".wt-dh-diya::before{content:\"\";position:absolute;left:50%;bottom:9px;width:8px;height:13px;margin-left:-4px;background:radial-gradient(circle at 50% 78%,#fffbe0,#ffe27a 35%,#ffb400 62%,#ff7a00);border-radius:50% 50% 50% 50%/62% 62% 38% 38%;transform-origin:50% 100%;box-shadow:0 0 7px 2px rgba(255,170,40,.35);animation:wt-dh-dflame 1.6s ease-in-out infinite}" +
  ".wt-dh-diya::after{content:\"\";position:absolute;left:50%;top:-14px;width:26px;height:26px;margin-left:-13px;background:radial-gradient(circle,rgba(255,200,80,.5),rgba(255,160,40,.18) 55%,transparent 70%);border-radius:50%;pointer-events:none;animation:wt-dh-glow 2.8s ease-in-out infinite}" +
  ".wt-dh-diya:nth-child(odd)::before{animation-duration:1.3s}.wt-dh-diya:nth-child(3n)::before{animation-duration:1.9s;animation-delay:.4s}.wt-dh-diya:nth-child(even)::after{animation-delay:.9s}" +
  "@keyframes wt-dh-dflame{0%{transform:scale(1) rotate(-2deg);opacity:.92}20%{transform:scale(1.06,1.12) rotate(2deg);opacity:1}40%{transform:scale(.96,1.02) rotate(-3deg);opacity:.9}60%{transform:scale(1.08,1.15) rotate(1deg);opacity:1}80%{transform:scale(.98,.95) rotate(-1deg);opacity:.94}100%{transform:scale(1) rotate(-2deg);opacity:.92}}" +
  "@keyframes wt-dh-glow{0%,100%{opacity:.55;transform:scale(.94)}50%{opacity:1;transform:scale(1.06)}}" +
  "@keyframes wt-dh-amb{0%,100%{opacity:.75}50%{opacity:1}}" +
  "[data-theme=dark] #wt-dh-diyas{background:linear-gradient(180deg,#fff3d2,#ffe3ae)}" +
  "[data-theme=dark] #wt-dh-diyas::before{content:\"\";position:absolute;left:-2%;right:-2%;top:-36px;bottom:-18px;background:radial-gradient(ellipse 55% 100% at 50% 65%,rgba(255,180,60,.22),rgba(255,150,40,.09) 55%,transparent 78%);pointer-events:none;animation:wt-dh-amb 3.2s ease-in-out infinite}" +
  "[data-theme=dark] #ticker.wt-dh-tk{box-shadow:0 0 0 1px rgba(255,215,0,.45),0 4px 18px rgba(180,120,0,.30),0 0 70px 14px rgba(255,170,40,.10)}" +
  "[data-theme=dark] .wt-dh-diya::before{box-shadow:0 0 12px 4px rgba(255,180,60,.5)}" +
  "#wt-dh.wt-dh-paused *,#wt-dh.wt-dh-offscreen *,#wt-dh-shower.wt-dh-paused *{animation-play-state:paused!important}" +
  "@keyframes wt-dh-shimmer{0%{transform:translate3d(-120%,0,0);opacity:.95}85%{transform:translate3d(120%,0,0);opacity:.95}100%{transform:translate3d(120%,0,0);opacity:0}}" +
  "@keyframes wt-dh-fall{0%{transform:translate3d(0,-14px,0) rotateY(0) scaleX(1);opacity:0}12%,88%{opacity:.9}50%{transform:translate3d(var(--wt-dh-dx,5px),calc(var(--wt-dh-y,64px)*.5),0) rotateY(180deg) scaleX(.62);opacity:.9}100%{transform:translate3d(calc(var(--wt-dh-dx,5px)*-.7),var(--wt-dh-y,64px),0) rotateY(360deg) scaleX(.82);opacity:0}}" +
  "@keyframes wt-dh-twinkle{0%,100%{opacity:.25}50%{opacity:1}}" +
  "@media (max-width:860px){#wt-dh{gap:8px;padding:2px 8px}.wt-dh-l1{font-size:23px;min-width:150px;height:40px;line-height:40px}.wt-dh-l1-t{line-height:34px}.wt-dh-l3{height:14px;line-height:14px;font-size:10.5px}}" +
  "@media (max-width:640px){.themebar.wt-dh-on{flex-wrap:wrap}#wt-dh{flex:0 0 100%;width:100%;max-height:54px;height:54px;gap:6px;padding:2px 8px}.themebar.wt-dh-on>.wrap{flex:0 0 100%;width:100%;justify-content:flex-end}.wt-dh-badge{flex:0 0 46px;width:46px;height:46px}.wt-dh-l1{font-size:20px;min-width:125px;height:36px;line-height:36px}.wt-dh-l1-t{padding-top:3px;line-height:30px}.wt-dh-ov{top:9px;width:8px;height:8px;margin-left:-4px}.wt-dh-l3{font-size:8.6px;height:13px;line-height:13px}}" +
  "@media (max-width:360px){#wt-dh{max-height:68px;height:auto}.wt-dh-l3{white-space:normal;height:auto;line-height:13px}}" +
  "@media (prefers-reduced-motion:reduce){#wt-dh *,#wt-dh-shower *{animation:none!important}.wt-dh-coins,#wt-dh-shower,.wt-dh-shim{display:none!important}.wt-dh-diya::before{animation:none!important}.wt-dh-ov{display:none!important}#wt-dh-diyas *,#wt-dh-diyas::before{animation:none!important}}";

 var BG_SVG =
  '<svg viewBox="0 0 600 64" preserveAspectRatio="none" aria-hidden="true">' +
  '<defs><pattern id="wt-dh-pa" width="40" height="64" patternUnits="userSpaceOnUse"><path d="M0,4Q20,12 40,4M0,60Q20,52 40,60" fill="none" stroke="#c9a227" stroke-width="1.2"/></pattern></defs>' +
  '<rect width="600" height="64" fill="url(#wt-dh-pa)"/>' +
  '<path d="M478,16V32M470,24H486M478,16H486M478,32H470M470,24V16M486,24V32" stroke="#d9531e" stroke-width="1.4" fill="none"/>' +
  '<g fill="#d9531e" transform="translate(525,18)"><ellipse cx="4" cy="7" rx="2.3" ry="4" transform="rotate(-12 4 7)"/><circle cx="2" cy="1.2" r=".8"/><circle cx="4" cy=".8" r=".8"/><circle cx="6" cy="1.4" r=".7"/><ellipse cx="12" cy="8" rx="2.3" ry="4" transform="rotate(12 12 8)"/><circle cx="10" cy="2.2" r=".7"/><circle cx="12" cy="1.6" r=".8"/><circle cx="14" cy="2.2" r=".8"/></g></svg>';


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
      '<div class="wt-dh-badge" aria-hidden="true"><i class="wt-dh-ov"></i><i class="wt-dh-ov"></i><i class="wt-dh-ov"></i></div>' +
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