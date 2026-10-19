/* WealthyTrees - Mahanavami greeting (19 Oct 2026 IST). Theme strip + Live Wire only. Never touches the live ticker or Daily Edition.
   Preview any day: add ?mahanavami=1 to the URL. */
(function () {
  var force = location.search.indexOf('mahanavami=1') > -1;
  var today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  if (!force && today !== '2026-10-19') return;

  var css = '\
.themebar.wt-mn-on{display:flex;align-items:center;overflow:hidden;background:linear-gradient(90deg,#fff1cf,#ffe2b0 45%,var(--bg) 100%)}\
.themebar.wt-mn-on>.wrap{flex:none;position:relative;z-index:3}\
#wt-mn{position:relative;z-index:3;flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:14px;padding:6px 14px}\
#wt-mn img,#wt-mn svg{width:68px;height:68px;border-radius:50%;object-fit:contain;background:#fff;border:2px solid #e8a33d;box-shadow:0 0 16px rgba(255,140,0,.8);flex:none;animation:wtmnF 3.6s ease-in-out infinite}\
#wt-mn .t{min-width:0;color:#7a1f00;line-height:1.2}\
#wt-mn .h{font-weight:800;font-size:clamp(17px,2.6vw,26px);text-shadow:0 0 10px rgba(255,170,0,.6)}\
#wt-mn .e{font-weight:700;font-size:clamp(12px,1.6vw,15px)}\
#wt-mn .s{font-weight:500;font-size:clamp(10px,1.3vw,12px);opacity:.85}\
@keyframes wtmnF{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}\
.wt-mn-petals{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2}\
.wt-mn-p{position:absolute;top:-12px;width:9px;height:13px;border-radius:80% 0 80% 0;opacity:.9;filter:drop-shadow(0 0 4px #ffb703) drop-shadow(0 0 8px #ff7aa2);animation:wtmnP linear infinite}\
@keyframes wtmnP{0%{transform:translate(0,-8px) rotate(0)}50%{transform:translate(24px,30px) rotate(180deg)}100%{transform:translate(-10px,90px) rotate(360deg)}}\
@media(max-width:640px){.themebar.wt-mn-on{flex-wrap:wrap}#wt-mn{flex:1 1 100%;padding:6px 10px}#wt-mn img,#wt-mn svg{width:54px;height:54px}.themebar.wt-mn-on>.wrap{flex:1 1 100%}}\
.wt-mn-sp{margin:6px 0 0;padding:6px 10px;border-radius:12px;background:#fff4d6;color:#7a1f00;border:1px solid #e8a33d;box-shadow:0 0 10px rgba(255,140,0,.5);font-weight:600;font-size:13px;line-height:1.4}\
@media(prefers-reduced-motion:reduce){#wt-mn img,#wt-mn svg,.wt-mn-p{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var fb = '<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#ffe3b0"/><g fill="#e8590c"><ellipse cx="50" cy="62" rx="10" ry="22"/><ellipse cx="32" cy="66" rx="9" ry="19" transform="rotate(-35 32 66)"/><ellipse cx="68" cy="66" rx="9" ry="19" transform="rotate(35 68 66)"/></g></svg>';

  function strip() {
    var host = document.querySelector('.themebar');
    if (!host || host.classList.contains('wt-mn-on')) return !!host;
    host.classList.add('wt-mn-on');
    var card = document.createElement('div'); card.id = 'wt-mn';
    card.innerHTML = '<img id="wt-mn-img" src="assets/matarani.jpg" alt="Maa Durga"><div class="t"><div class="h">शुभ महानवमी 🙏</div><div class="e">Shubh Mahanavami</div><div class="s">WealthyTrees Private Limited की ओर से सभी को हार्दिक शुभकामनाएँ</div></div>';
    host.insertBefore(card, host.firstChild);
    var box = document.createElement('div'); box.className = 'wt-mn-petals';
    var cols = ['#ffb703', '#ff7aa2', '#ff9f1c', '#ffd6e0', '#fb8500'];
    for (var i = 0; i < 22; i++) {
      var p = document.createElement('span'); p.className = 'wt-mn-p';
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = cols[i % cols.length];
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      p.style.animationDelay = (-Math.random() * 7) + 's';
      box.appendChild(p);
    }
    host.appendChild(box);
    document.getElementById('wt-mn-img').onerror = function () { this.outerHTML = fb; };
    return true;
  }

  /* Sprout's Hindi wish: a fixed line inside the Live Wire intro bubble (not floating) */
  function sprout() {
    var b = document.querySelector('#p-live .sp-intro .sp-bub');
    if (!b) return false;
    if (!b.querySelector('.wt-mn-sp')) {
      var d = document.createElement('p'); d.className = 'wt-mn-sp';
      d.textContent = 'शुभ महानवमी! 🙏 WealthyTrees Private Limited की ओर से आप सभी को महानवमी की हार्दिक शुभकामनाएँ। — Sprout 🌱';
      b.appendChild(d);
    }
    return true;
  }

  var n = 0, a = false, c = false;
  var t = setInterval(function () {
    if (!a) a = strip();
    if (!c) c = sprout();
    if ((a && c) || ++n > 40) clearInterval(t);
  }, 300);
})();
