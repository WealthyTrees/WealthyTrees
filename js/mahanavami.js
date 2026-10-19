/* WealthyTrees - Mahanavami greeting (19 Oct 2026 IST). Lives ONLY in the theme strip (Light/Dark/Paper). Never touches the live ticker.
   Preview any day: add ?mahanavami=1 to the URL. */
(function () {
  var force = location.search.indexOf('mahanavami=1') > -1;
  var today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  if (!force && today !== '2026-10-19') return;

  function run() {
    if (document.getElementById('wt-mn')) return;
    var isTk = function (el) { return el && el.closest && el.closest('[id*="ticker" i],[class*="ticker" i],[id*="dussehra" i],[class*="dussehra" i]'); };

    /* find theme buttons (Light / Dark / Paper) */
    var btns = [].slice.call(document.querySelectorAll('button,a,[role="button"],[data-theme],[data-set-theme]')).filter(function (b) {
      var t = (b.textContent || '').trim().toLowerCase();
      return !isTk(b) && /^(\S{0,3}\s*)?(light|dark|paper)$/.test(t);
    });
    var host = null;
    if (btns.length) {
      host = btns[0].parentElement;
      while (host && btns.some(function (b) { return !host.contains(b); })) host = host.parentElement;
      /* widen to the full-width strip */
      var guard = 0;
      while (host && host.parentElement && host.parentElement !== document.body && guard++ < 3 &&
             host.getBoundingClientRect().width < innerWidth * 0.8 && !isTk(host.parentElement) &&
             !host.parentElement.querySelector('[id*="ticker" i],[class*="ticker" i]')) host = host.parentElement;
      if (isTk(host) || (host && host.querySelector('[id*="ticker" i],[class*="ticker" i]'))) host = null;
    }

    var css = '\
#wt-mn{position:absolute;left:8px;top:50%;transform:translateY(-50%);z-index:3;display:flex;align-items:center;gap:6px;\
padding:2px 10px 2px 3px;border-radius:30px;background:linear-gradient(90deg,#fff4d6,#ffd9a0);border:1px solid #e8a33d;\
box-shadow:0 0 12px rgba(255,140,0,.6);color:#7a1f00;font:600 11px/1.15 inherit;white-space:nowrap;animation:wtmnF 3.6s ease-in-out infinite}\
#wt-mn img,#wt-mn svg{height:var(--mnh,34px);width:var(--mnh,34px);border-radius:50%;object-fit:contain;background:#fff;border:1.5px solid #e8a33d;flex:none}\
#wt-mn span{display:block}#wt-mn small{display:block;font-weight:500;font-size:9px;opacity:.8}\
#wt-mn.fix{position:fixed;left:8px;bottom:12px;top:auto;transform:none;z-index:60}\
@keyframes wtmnF{0%,100%{margin-top:0}50%{margin-top:-4px}}\
.wt-mn-petals{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2}\
.wt-mn-p{position:absolute;top:-12px;width:8px;height:11px;border-radius:80% 0 80% 0;opacity:.9;\
filter:drop-shadow(0 0 4px #ffb703) drop-shadow(0 0 8px #ff7aa2);animation:wtmnP linear infinite}\
@keyframes wtmnP{0%{transform:translate(0,-6px) rotate(0)}50%{transform:translate(22px,18px) rotate(180deg)}100%{transform:translate(-8px,60px) rotate(360deg)}}\
@media(max-width:480px){#wt-mn small{display:none}}\
@media(prefers-reduced-motion:reduce){#wt-mn,.wt-mn-p{animation:none}}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var fb = '<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#ffe3b0"/><g fill="#e8590c"><ellipse cx="50" cy="62" rx="10" ry="22"/><ellipse cx="32" cy="66" rx="9" ry="19" transform="rotate(-35 32 66)"/><ellipse cx="68" cy="66" rx="9" ry="19" transform="rotate(35 68 66)"/></g></svg>';
    var card = document.createElement('div'); card.id = 'wt-mn';
    card.innerHTML = '<img id="wt-mn-img" src="assets/matarani.jpg" alt="Maa Durga"><div><span>शुभ महानवमी 🙏</span><small>Shubh Mahanavami</small></div>';

    if (host) {
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.style.overflow = 'hidden';
      var h = host.getBoundingClientRect().height;
      card.style.setProperty('--mnh', Math.max(24, Math.min(44, h - 8)) + 'px');
      /* petals: inside the theme strip only */
      var box = document.createElement('div'); box.className = 'wt-mn-petals';
      var cols = ['#ffb703', '#ff7aa2', '#ff9f1c', '#ffd6e0', '#fb8500'];
      for (var i = 0; i < 14; i++) {
        var p = document.createElement('span'); p.className = 'wt-mn-p';
        p.style.left = (Math.random() * 100) + '%';
        p.style.background = cols[i % cols.length];
        p.style.animationDuration = (3 + Math.random() * 4) + 's';
        p.style.animationDelay = (-Math.random() * 7) + 's';
        box.appendChild(p);
      }
      host.appendChild(box);
      host.appendChild(card);
      /* keep theme buttons clear of the card */
      var fr = btns[0].getBoundingClientRect(), hr = host.getBoundingClientRect(), cw = card.getBoundingClientRect().width + 16;
      if (fr.left - hr.left < cw) host.style.paddingLeft = cw + 'px';
    } else {
      card.className = 'fix'; document.body.appendChild(card); /* fallback: no petals, nowhere near the ticker */
    }
    document.getElementById('wt-mn-img').onerror = function () { this.outerHTML = fb; };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();

  /* Sprout AI wishes (Hindi), shown as a speech bubble beside Sprout whenever it is on screen. Never near the ticker. */
  (function sprout() {
    if (sessionStorage.getItem('wtMnSprout') === 'x') return;
    var st = document.createElement('style');
    st.textContent = '#wt-sp{position:fixed;z-index:70;max-width:230px;padding:9px 12px;border-radius:14px 14px 14px 3px;background:#fff4d6;color:#7a1f00;border:1px solid #e8a33d;box-shadow:0 0 14px rgba(255,140,0,.6),0 4px 12px rgba(0,0,0,.2);font:600 12px/1.4 inherit;display:none;animation:wtsp 3s ease-in-out infinite}#wt-sp small{display:block;font-weight:500;font-size:10px;margin-top:3px;opacity:.85}#wt-sp i{position:absolute;top:-8px;right:-8px;width:20px;height:20px;border-radius:50%;background:#7a1f00;color:#fff;font:normal 13px/20px sans-serif;text-align:center;cursor:pointer}@keyframes wtsp{0%,100%{margin-top:0}50%{margin-top:-4px}}';
    document.head.appendChild(st);
    var b = document.createElement('div'); b.id = 'wt-sp';
    b.innerHTML = '<i>×</i>शुभ महानवमी! 🙏<br>WealthyTrees Private Limited की ओर से आप सभी को महानवमी की हार्दिक शुभकामनाएँ।<small>— Sprout 🌱</small>';
    document.body.appendChild(b);
    b.querySelector('i').onclick = function () { sessionStorage.setItem('wtMnSprout', 'x'); b.remove(); clearInterval(t); };
    function find() {
      var els = document.querySelectorAll('[id*="sprout" i],[class*="sprout" i]');
      for (var i = 0; i < els.length; i++) {
        var e = els[i];
        if (e.closest('[id*="ticker" i],[class*="ticker" i],#wt-sp')) continue;
        var r = e.getBoundingClientRect();
        if (r.width > 10 && r.height > 10 && r.bottom > 0 && r.top < innerHeight) return r;
      }
      return null;
    }
    function tick() {
      var r = find();
      if (!r) { b.style.display = 'none'; return; }
      b.style.display = 'block';
      var w = b.offsetWidth, h = b.offsetHeight;
      var left = Math.min(Math.max(8, r.left), innerWidth - w - 8);
      var top = r.top - h - 8; if (top < 8) top = Math.min(r.bottom + 8, innerHeight - h - 8);
      b.style.left = left + 'px'; b.style.top = top + 'px';
    }
    var t = setInterval(tick, 700); addEventListener('scroll', tick, { passive: true });
  })();
})();
