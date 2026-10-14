/* WealthyTrees intro.js v1: the Learn menu link plays a short animated intro, then opens the Learn page */
(function () {
  var rm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var st = document.createElement("style");
  st.textContent = ".wt-intro{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;text-align:center;cursor:pointer;opacity:0;transition:opacity .35s;background-color:var(--paper,#fffdf6);background-image:repeating-linear-gradient(transparent 0 33px,color-mix(in srgb,var(--up,#0f8a5f) 14%,transparent) 33px 34px)}"
    + ".wt-intro.on{opacity:1}.wt-intro.out{opacity:0;transition:opacity .9s .15s}.wt-intro::before{content:'';position:absolute;top:0;bottom:0;left:max(2.2rem,8vw);width:2px;background:color-mix(in srgb,var(--down,#c8452f) 55%,transparent)}"
    + ".wt-intro img{width:120px;height:120px;transform:scale(.3);opacity:0;animation:wti-grow .9s .1s cubic-bezier(.2,1.3,.4,1) forwards,wti-glow 1.6s .9s ease-in-out infinite}"
    + ".wt-intro h2{font-family:Caveat,'Segoe Print','Comic Sans MS',cursive;font-size:clamp(2.2rem,7vw,3.4rem);margin:.6rem 0 .2rem;min-height:1.3em;color:var(--ink,#16231d)}"
    + ".wt-intro h2 i{display:inline-block;width:3px;height:.9em;background:var(--up,#0f8a5f);margin-left:3px;vertical-align:-.1em;animation:wti-blink .7s steps(1) infinite}"
    + ".wt-chips{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;margin:.6rem 0 1rem;opacity:0;animation:wti-up .5s 1.1s forwards}"
    + ".wt-chips span{font:600 .85rem Inter,system-ui,sans-serif;padding:.25rem .75rem;border:1.5px dashed var(--line,#d9e2da);border-radius:999px;color:var(--mute,#5a6b62);background:var(--bg,#f6f8f4)}"
    + ".wt-bar{width:min(260px,70vw);height:6px;border-radius:9px;background:var(--line,#d9e2da);overflow:hidden;margin:0 auto}.wt-bar b{display:block;height:100%;width:0;background:var(--up,#0f8a5f);animation:wti-fill 1.7s .1s linear forwards}"
    + ".wt-skip{margin-top:.8rem;font:600 .8rem Inter,system-ui,sans-serif;color:var(--mute,#5a6b62)}"
    + "@keyframes wti-grow{to{transform:scale(1);opacity:1}}@keyframes wti-glow{50%{filter:drop-shadow(0 0 18px color-mix(in srgb,var(--up,#0f8a5f) 55%,transparent))}}@keyframes wti-blink{50%{opacity:0}}@keyframes wti-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes wti-fill{to{width:100%}}";
  document.head.appendChild(st);
  function go() {
    if (document.querySelector(".wt-intro")) return;
    var f = document.createElement("link"); f.rel = "stylesheet"; f.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"; document.head.appendChild(f);
    var p = document.createElement("link"); p.rel = "prefetch"; p.href = "/learn.html"; document.head.appendChild(p);
    var o = document.createElement("div"); o.className = "wt-intro"; o.setAttribute("role", "status");
    o.innerHTML = '<div><img src="/assets/logo.svg" alt=""><h2 aria-label="Let\'s learn the markets"><span></span><i></i></h2><div class="wt-chips"><span>6 modules</span><span>23 lessons</span><span>free</span></div><div class="wt-bar"><b></b></div><div class="wt-skip">Tap anywhere to skip</div></div>';
    document.body.appendChild(o); requestAnimationFrame(function () { o.classList.add("on"); });
    var t = "Let's learn the markets", n = 0, sp = o.querySelector("h2 span"), done = false;
    var ty = setInterval(function () { sp.textContent = t.slice(0, ++n); if (n >= t.length) clearInterval(ty); }, 55);
    function scatter() {
      var im = o.querySelector("img"), r = im.getBoundingClientRect(), c = document.createElement("canvas"), x = c.getContext("2d"), w = c.width = innerWidth, h = c.height = innerHeight, P = [], t0 = performance.now(), N = 90;
      c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:100000"; document.body.appendChild(c);
      for (var i = 0; i < N; i++) { var a = Math.random() * 6.283, v = 4 + Math.random() * 11; P.push({ x: r.left + r.width / 2, y: r.top + r.height / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, s: 14 + Math.random() * 18, k: i % 3, rot: Math.random() * 6, vr: (Math.random() - .5) * .3 }); }
      (function f(now) { var t = (now - t0) / 1000; x.clearRect(0, 0, w, h);
        P.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += .32; p.vx *= .995; p.rot += p.vr; x.save(); x.globalAlpha = Math.max(0, Math.min(1, (1.15 - t) / .45)); x.translate(p.x, p.y); x.rotate(p.rot);
          if (p.k === 0) { var g = x.createRadialGradient(-p.s / 5, -p.s / 5, 1, 0, 0, p.s / 2); g.addColorStop(0, "#fff3b0"); g.addColorStop(1, "#e0a82e"); x.fillStyle = g; x.beginPath(); x.arc(0, 0, p.s / 2, 0, 6.283); x.fill(); x.strokeStyle = "#a8741a"; x.lineWidth = 2; x.stroke(); x.fillStyle = "#8a5a10"; x.font = "700 " + p.s * .6 + "px Inter,sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("\u20B9", 0, 1); }
          else { x.fillStyle = p.k === 1 ? "#e0a82e" : "#0f8a5f"; x.font = "700 " + p.s * 1.3 + "px Inter,sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("\u20B9", 0, 0); }
          x.restore(); });
        t < 1.2 ? requestAnimationFrame(f) : c.remove(); })(t0);
    }
    function leave() { if (done) return; done = true; clearInterval(ty); o.classList.add("out"); o.querySelector("div").style.cssText += ";opacity:0;transition:opacity .25s"; scatter(); setTimeout(function () { location.href = "/learn.html"; }, 1000); }
    o.addEventListener("click", leave); document.addEventListener("keydown", function (e) { if (e.key === "Escape" || e.key === "Enter") leave(); });
    setTimeout(leave, 1900);
  }
  // Any link to the Learn page (any spelling) plays the intro. Runs first (capture) so nothing else can stop it.
  var LEARN = /^(https?:\/\/(www\.)?wealthytrees\.online)?\/?learn(\.html)?\/?(#.*)?$/i;
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank") return;
    if (!LEARN.test(a.getAttribute("href") || "")) return;
    if (/^\/learn(\.html|\/|$)/.test(location.pathname) || rm) return;
    e.preventDefault(); go();
  }, true);
})();
