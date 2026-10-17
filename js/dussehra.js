/* WealthyTrees dussehra.js v1: full-screen Dussehra scene. Ram shoots the arrow, Ravan burns, fireworks, greeting.
   Started by festival.js on 20 Oct. Preview: add ?fest=2026-10-20 to any page address. */
(function () {
  var S = 640, G = 392, n = 0;
  function head(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#6a3a8e" stroke="#2b1240" stroke-width="2"/>'
      + '<path d="M' + (x - r) + ' ' + (y - r * .5) + 'L' + (x - r * .6) + ' ' + (y - r * 1.5) + 'L' + x + ' ' + (y - r * .9) + 'L' + (x + r * .6) + ' ' + (y - r * 1.5) + 'L' + (x + r) + ' ' + (y - r * .5) + 'Z" fill="#f2b632" stroke="#2b1240" stroke-width="1.5"/>'
      + '<circle cx="' + (x - r * .38) + '" cy="' + y + '" r="' + r * .2 + '" fill="#fff"/><circle cx="' + (x + r * .38) + '" cy="' + y + '" r="' + r * .2 + '" fill="#fff"/>'
      + '<circle cx="' + (x - r * .38) + '" cy="' + y + '" r="' + r * .09 + '" fill="#200"/><circle cx="' + (x + r * .38) + '" cy="' + y + '" r="' + r * .09 + '" fill="#200"/>'
      + '<path d="M' + (x - r * .6) + ' ' + (y + r * .5) + ' Q' + x + ' ' + (y + r * .15) + ' ' + (x + r * .6) + ' ' + (y + r * .5) + '" fill="none" stroke="#200" stroke-width="2" stroke-linecap="round"/>';
  }
  function flame(x, y, k, d) {
    return '<g transform="translate(' + x + ' ' + y + ')"><g class="dz-fl" style="animation-delay:' + d + 's;--k:' + k + '"><path d="M0 0C-16 -18 -8 -40 0 -66C10 -40 18 -18 0 0Z" fill="#ff7a1a"/><path d="M0 0C-8 -10 -4 -24 0 -38C5 -24 9 -10 0 0Z" fill="#ffd54a"/></g></g>';
  }
  function burst(x, y, c, d, r) {
    var l = ""; for (var i = 0; i < 12; i++) l += '<line x1="0" y1="-' + r * .35 + '" x2="0" y2="-' + r + '" stroke="' + c + '" stroke-width="3" stroke-linecap="round" transform="rotate(' + i * 30 + ')"/>';
    return '<g transform="translate(' + x + ' ' + y + ')"><g class="dz-fw" style="animation-delay:' + d + 's">' + l + '<circle r="4" fill="' + c + '"/></g></g>';
  }
  function scene() {
    var s = '<svg viewBox="40 0 600 440" style="overflow:visible" role="img" aria-label="Lord Ram shoots an arrow at Ravan, who burns. Good wins over evil." preserveAspectRatio="xMidYMax meet">';
    var st = ""; for (var i = 0; i < 26; i++) st += '<circle cx="' + ((i * 97 + 31) % S) + '" cy="' + ((i * 53) % 190 + 6) + '" r="' + (i % 3 ? 1.3 : 2) + '" fill="#fff" class="dz-tw" style="animation-delay:' + (i % 7) * .4 + 's"/>';
    s += st + '<circle cx="110" cy="70" r="26" fill="#ffe9a8" opacity=".95"/><circle cx="110" cy="70" r="40" fill="#ffe9a8" opacity=".12"/>';
    s += '<path d="M-900 ' + (G - 8) + 'L0 ' + G + 'Q160 ' + (G - 22) + ' 320 ' + (G - 6) + 'T640 ' + (G - 10) + 'L1540 ' + (G - 8) + 'V440H-900Z" fill="#1b0f2e"/>';
    /* Ravan */
    s += '<g class="dz-rv"><g class="dz-rv2">'
      + '<path d="M450 ' + (G - 4) + 'L460 262 L540 262 L550 ' + (G - 4) + 'Z" fill="#f2b632" stroke="#2b1240" stroke-width="2.5"/>'
      + '<path d="M448 170 Q500 150 552 170 L546 270 L454 270Z" fill="#b3302a" stroke="#2b1240" stroke-width="2.5"/>'
      + '<path d="M462 190 Q500 220 538 190" fill="none" stroke="#f2b632" stroke-width="6"/>'
      + '<path d="M450 180 L408 150 M550 180 L596 140 M452 200 L414 214 M548 200 L588 216" stroke="#b3302a" stroke-width="12" stroke-linecap="round"/>'
      + '<path d="M596 140 L606 92" stroke="#cfd8e0" stroke-width="5" stroke-linecap="round"/>'
      + head(455, 78, 14) + head(485, 70, 14) + head(515, 70, 14) + head(545, 78, 14)
      + head(440, 108, 14) + head(470, 102, 14) + head(500, 98, 14) + head(530, 102, 14) + head(560, 108, 14)
      + head(500, 140, 19) + '</g></g>';
    /* flames on Ravan */
    s += '<g class="dz-fire">' + flame(470, 270, 1.2, 0) + flame(500, 262, 1.7, .15) + flame(530, 270, 1.3, .3) + flame(485, 220, 1.4, .1) + flame(520, 220, 1.4, .25) + flame(500, 160, 1.5, .2) + flame(455, 190, 1, .35) + flame(548, 190, 1, .05) + '</g>';
    /* Ram */
    s += '<g>'
      + '<path d="M96 ' + (G - 4) + 'L104 300 L150 300 L158 ' + (G - 4) + 'Z" fill="#f4d27a" stroke="#2b1240" stroke-width="2.5"/>'
      + '<path d="M98 200 Q128 186 158 200 L152 304 L104 304Z" fill="#4b86d6" stroke="#2b1240" stroke-width="2.5"/>'
      + '<path d="M106 224 Q128 250 152 224" fill="none" stroke="#f2b632" stroke-width="5"/>'
      + '<circle cx="128" cy="164" r="24" fill="#4b86d6" stroke="#2b1240" stroke-width="2.5"/>'
      + '<path d="M104 156 L110 120 L128 138 L146 120 L152 156Z" fill="#f2b632" stroke="#2b1240" stroke-width="2"/>'
      + '<circle cx="120" cy="164" r="2.6" fill="#fff"/><circle cx="138" cy="164" r="2.6" fill="#fff"/><circle cx="120" cy="164" r="1.2" fill="#200"/><circle cx="138" cy="164" r="1.2" fill="#200"/>'
      + '<path d="M118 176 Q128 184 138 176" fill="none" stroke="#200" stroke-width="2" stroke-linecap="round"/>'
      + '<path d="M150 214 L210 236" stroke="#4b86d6" stroke-width="11" stroke-linecap="round"/>'
      + '<path d="M104 216 L160 240" stroke="#4b86d6" stroke-width="11" stroke-linecap="round"/>'
      + '</g>';
    /* bow, string, arrow */
    s += '<path d="M208 168 Q262 240 208 312" fill="none" stroke="#8a5a2b" stroke-width="7" stroke-linecap="round"/>'
      + '<path class="dz-sp" d="M208 168 L176 240 L208 312" fill="none" stroke="#f4ecd8" stroke-width="2.2"/>'
      + '<path class="dz-ss" d="M208 168 L208 312" fill="none" stroke="#f4ecd8" stroke-width="2.2"/>'
      + '<g class="dz-ar"><g class="dz-ar0"><path d="M176 240 L252 240" stroke="#e9d6a6" stroke-width="4" stroke-linecap="round"/><path d="M252 232 L270 240 L252 248Z" fill="#ffd54a"/><path d="M178 240 L168 232 M178 240 L168 248" stroke="#e9d6a6" stroke-width="3"/><g class="dz-tail"><path d="M176 240 Q120 230 70 240 Q120 250 176 240Z" fill="#ff9a2e" opacity=".85"/></g></g></g>';
    /* impact flash */
    s += '<circle class="dz-hit" cx="500" cy="230" r="46" fill="#fff6c9"/>';
    /* fireworks */
    s += burst(150, 70, "#ffd54a", 7.2, 56) + burst(330, 48, "#ff6b6b", 7.7, 64) + burst(530, 62, "#5fe3a1", 8.2, 58) + burst(240, 120, "#7ec8ff", 8.8, 50) + burst(440, 110, "#ff9fe0", 9.2, 52) + burst(590, 140, "#ffd54a", 9.8, 46);
    /* diyas */
    for (var d = 0; d < 11; d++) {
      var x = 30 + d * 58, y = G + 22 + (d % 2) * 6;
      s += '<g transform="translate(' + x + ' ' + y + ')" class="dz-di" style="animation-delay:' + (9 + d * .12) + 's"><path d="M-9 0 Q0 12 9 0Z" fill="#c9622b" stroke="#2b1240" stroke-width="1.5"/><path class="dz-df" d="M0 -2 C-5 -8 -2 -13 0 -18 C3 -13 5 -8 0 -2Z" fill="#ffd54a" style="animation-delay:' + d * .17 + 's"/></g>';
    }
    return s + '</svg>';
  }
  var CSS = ".dz{position:fixed;inset:0;z-index:99995;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden;background:linear-gradient(#1a1040 0%,#4a1d5c 45%,#e0653a 88%,#f2b632 100%);opacity:0;animation:dzin .8s ease forwards;font-family:Inter,system-ui,sans-serif}"
    + ".dz.out{animation:dzout .6s ease forwards}@keyframes dzin{to{opacity:1}}@keyframes dzout{to{opacity:0}}"
    + ".dz svg{width:min(100vw,900px);height:auto;max-height:68vh;display:block}"
    + ".dz-top{z-index:2;position:absolute;top:0;left:0;right:0;padding:4.2rem 1rem 0;text-align:center;color:#fff;pointer-events:none}"
    + ".dz-top h2{margin:0;font:700 clamp(2.1rem,8vw,3.8rem) Caveat,'Segoe Print',cursive;text-shadow:0 3px 18px rgba(0,0,0,.45)}.dz-top p{margin:.3rem 0 0;font-weight:600;font-size:clamp(.9rem,3.2vw,1.1rem);color:#ffe9b8}"
    + ".dz-a{opacity:0;animation:dzfade 6.4s ease .8s forwards}@keyframes dzfade{15%,80%{opacity:1}100%{opacity:0}}"
    + ".dz-b{position:absolute;left:0;right:0;top:0;padding:4.2rem 1rem 0;opacity:0;transform:translateY(14px) scale(.95);animation:dzup 1s cubic-bezier(.2,1.3,.4,1) 8s forwards}@keyframes dzup{to{opacity:1;transform:none}}"
    + ".dz-btn{position:absolute;top:14px;right:14px;border:0;border-radius:999px;background:#f2b632;color:#2b1240;font:700 .95rem Inter,system-ui,sans-serif;padding:.6rem 1.2rem;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35);z-index:3}.dz-btn:hover{background:#ffd54a}.dz-btn:focus-visible{outline:3px solid #fff;outline-offset:2px}"
    + ".dz svg *{transform-box:fill-box;transform-origin:center}"
    + ".dz-tw{animation:dztw 2.6s ease-in-out infinite}@keyframes dztw{50%{opacity:.25}}"
    + ".dz-sp{opacity:1;animation:dzsp 0s linear 3.4s forwards}@keyframes dzsp{to{opacity:0}}"
    + ".dz-ss{opacity:0;animation:dzss 0s linear 3.4s forwards}@keyframes dzss{to{opacity:1}}"
    + ".dz-ar{animation:dzar .7s cubic-bezier(.5,0,.9,.6) 3.4s forwards}.dz-ar0{animation:dzpull 1.4s ease-out 1.8s both}"
    + "@keyframes dzpull{from{transform:translateX(0)}to{transform:translateX(-0px)}}@keyframes dzar{0%{transform:translateX(0);opacity:1}92%{opacity:1}100%{transform:translateX(262px);opacity:0}}"
    + ".dz-tail{opacity:0;animation:dztl .2s linear 3.4s forwards}@keyframes dztl{to{opacity:1}}"
    + ".dz-hit{opacity:0;animation:dzhit .7s ease-out 4.1s forwards}@keyframes dzhit{0%{opacity:.9;transform:scale(.2)}100%{opacity:0;transform:scale(1.8)}}"
    + ".dz-rv2{animation:dzsh .09s linear 4.1s 14,dzfall 2s ease-in 6.3s forwards}@keyframes dzsh{50%{transform:translateX(3px) rotate(.7deg)}}@keyframes dzfall{to{opacity:0;transform:translateY(40px) scaleY(.5)}}"
    + ".dz-fire{opacity:0;animation:dzfi .6s ease-out 4.3s forwards,dzfo 1.8s ease-in 7.4s forwards}@keyframes dzfi{to{opacity:1}}@keyframes dzfo{to{opacity:0}}"
    + ".dz-fl{animation:dzfl .45s ease-in-out infinite alternate;transform-origin:50% 100%}.dz-fl{transform:scale(var(--k))}@keyframes dzfl{from{transform:scale(calc(var(--k)*.8),calc(var(--k)*.9))}to{transform:scale(calc(var(--k)*1.1),calc(var(--k)*1.25))}}"
    + ".dz-fw{opacity:0;animation:dzfw 1.4s ease-out forwards}@keyframes dzfw{0%{opacity:1;transform:scale(.1)}70%{opacity:1}100%{opacity:0;transform:scale(1.5)}}"
    + ".dz-di{opacity:0;animation:dzdi .6s ease forwards}@keyframes dzdi{to{opacity:1}}.dz-df{animation:dzdf .5s ease-in-out infinite alternate}@keyframes dzdf{from{transform:scale(.8)}to{transform:scale(1.2)}}"
    + ".dz-pet{z-index:1;position:absolute;top:-8%;pointer-events:none;animation:dzpet linear forwards}@keyframes dzpet{to{transform:translateY(115vh) rotate(360deg)}}";
  var el, done = false, t1;
  function close() { if (done) return; done = true; clearTimeout(t1); el.classList.add("out"); setTimeout(function () { el.remove(); document.documentElement.style.overflow = ""; }, 650); }
  window.WT_DUSSEHRA = function (note) {
    if(!document.querySelector('link[href*="Caveat"]')){var fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap';document.head.appendChild(fl)}
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    el = document.createElement("div"); el.className = "dz"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Dussehra greeting");
    el.innerHTML = '<button class="dz-btn" type="button">Skip</button>'
      + '<div class="dz-top dz-a"><h2>Jai Shri Ram</h2><p>Vijayadashami: the day good won over evil</p></div>'
      + '<div class="dz-b dz-top"><h2>Happy Dussehra!</h2><p>May every wrong in your life burn away and every right thing win.' + (note ? "<br>" + note : "") + '</p></div>'
      + scene();
    document.body.appendChild(el); document.documentElement.style.overflow = "hidden";
    el.querySelector(".dz-btn").onclick = close;
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", k); } });
    var em = ["🌼", "🏹", "✨", "🪔", "🔥"];
    setTimeout(function () {
      if (done) return;
      for (var i = 0; i < 30; i++) { var p = document.createElement("span"); p.className = "dz-pet"; p.textContent = em[i % em.length]; p.style.cssText = "left:" + Math.random() * 100 + "%;font-size:" + (16 + Math.random() * 18) + "px;animation-duration:" + (4 + Math.random() * 4) + "s;animation-delay:" + Math.random() * 2 + "s"; el.appendChild(p); }
    }, 8000);
    t1 = setTimeout(close, 22000);
  };
})();
