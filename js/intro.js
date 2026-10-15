/* WealthyTrees intro.js v5: curtain intro on arrival at Learn and Markets (once per visit). The page loads underneath, so there is no wait and no lag when the curtain lifts. */
(function () {
  if (window.__wtIntro) return; window.__wtIntro = 1;
  var P = location.pathname.replace(/\/+$/, "").replace(/\.html$/, ""), key = P === "/learn" ? "learn" : P === "/markets" ? "markets" : null;
  if (!key) return;
  try { if (sessionStorage.getItem("wt-i-" + key)) return; sessionStorage.setItem("wt-i-" + key, "1"); } catch (e) {}
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var root = document.documentElement, M = key === "markets", dk = M || root.getAttribute("data-theme") === "dark";
  var TXT = M ? "Welcome to the world of markets" : "Let's learn the markets";
  var CH = M ? ["Interactive charts", "Practice game", "free"] : ["6 modules", "23 lessons", "free"];
  var INK = dk ? "#e8f1ec" : "#16231d", BG = M ? "#0b1612" : dk ? "#101b16" : "#fffdf6", LN = dk ? "rgba(15,138,95,.16)" : "rgba(15,138,95,.14)";
  var css = ".wti-lock,.wti-lock body{overflow:hidden!important}.wti{position:fixed;inset:0;z-index:99999;overflow:hidden;cursor:pointer;pointer-events:auto}"
    + ".wti-c{position:absolute;inset:0;display:grid;place-items:center;text-align:center;background-color:" + BG + ";will-change:transform;transition:transform .85s cubic-bezier(.7,0,.25,1);border-bottom:10px solid #e0a82e;box-shadow:0 12px 30px rgba(0,0,0,.35);"
    + "background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 2px,transparent 2px 46px,rgba(255,255,255,.05) 46px 48px)," + (M ? "repeating-linear-gradient(transparent 0 39px,rgba(15,138,95,.12) 39px 40px)" : "repeating-linear-gradient(transparent 0 33px," + LN + " 33px 34px)") + "}"
    + (M ? "" : ".wti-c::before{content:'';position:absolute;top:0;bottom:0;left:max(2.2rem,8vw);width:2px;background:rgba(200,69,47,.5)}")
    + ".wti.up .wti-c{transform:translateY(-104%)}.wti-in{position:relative;z-index:2;padding:0 1rem}"
    + ".wti img{width:104px;height:104px;transform:scale(.3);opacity:0;animation:wti-grow .8s .05s cubic-bezier(.2,1.3,.4,1) forwards}"
    + ".wti h2{font-family:Caveat,'Segoe Print','Comic Sans MS',cursive;font-size:clamp(2.1rem,7vw,3.5rem);margin:.5rem 0 .2rem;min-height:1.3em;color:" + INK + ";font-weight:700;border:0;padding:0}"
    + ".wti h2 i{display:inline-block;width:3px;height:.9em;background:#0f8a5f;margin-left:3px;vertical-align:-.1em;animation:wti-blink .7s steps(1) infinite}"
    + ".wti-chips{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;margin:.6rem 0 .8rem;opacity:0;animation:wti-up .5s .9s forwards}"
    + ".wti-chips span{font:600 .85rem Inter,system-ui,sans-serif;padding:.25rem .75rem;border:1.5px dashed " + (dk ? "rgba(255,255,255,.25)" : "#d9e2da") + ";border-radius:999px;color:" + (dk ? "#a9bdb2" : "#5a6b62") + "}"
    + ".wti-skip{font:600 .8rem Inter,system-ui,sans-serif;color:" + (dk ? "#a9bdb2" : "#5a6b62") + ";opacity:.8}"
    + ".wti-cv{position:absolute;inset:0;z-index:3;pointer-events:none;transition:opacity .3s}"
    + ".wti-tape{position:absolute;top:0;left:0;right:0;height:38px;overflow:hidden;border-bottom:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.25);z-index:2}"
    + ".wti-tape div{display:flex;width:max-content;animation:wti-tp 7s linear infinite;font:700 .8rem Inter,system-ui,sans-serif;line-height:38px;color:#cfe0d6}.wti-tape b{margin:0 1.1rem;white-space:nowrap}.wti-tape .u{color:#2fc790}.wti-tape .d{color:#ef6a58}"
    + ".wti-ch{position:absolute;left:0;right:0;bottom:0;width:100%;height:46%;opacity:.9;z-index:1}.wti-ch .k{transform-box:fill-box;transform-origin:50% 100%;opacity:0;animation:wti-pop .4s both}"
    + ".wti-ch .ma{fill:none;stroke:#e0a82e;stroke-width:2.5;stroke-dasharray:1;stroke-dashoffset:1;animation:wti-dr 1.5s .2s ease-out forwards}"
    + "@keyframes wti-grow{to{transform:scale(1);opacity:1}}@keyframes wti-blink{50%{opacity:0}}@keyframes wti-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}"
    + "@keyframes wti-tp{to{transform:translateX(-50%)}}@keyframes wti-pop{from{opacity:0;transform:scaleY(.1)}to{opacity:1;transform:none}}@keyframes wti-dr{to{stroke-dashoffset:0}}";
  var st = document.createElement("style"); st.textContent = css; (document.head || root).appendChild(st);
  var f = document.createElement("link"); f.rel = "stylesheet"; f.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"; (document.head || root).appendChild(f);
  var extra = "";
  if (M) {
    var s = 7, r = function () { s = (s * 16807) % 2147483647; return s / 2147483647; }, N = 30, v = 55, pts = [], i;
    for (i = 0; i < N; i++) { var o0 = v, c0 = v + (r() - .4) * 38; v = Math.max(20, Math.min(100, c0)); pts.push([o0, v, Math.max(o0, v) + r() * 14, Math.min(o0, v) - r() * 14]); }
    var cw = 600 / N, k = "", ma = "";
    pts.forEach(function (p, j) { var x = j * cw + cw / 2, up = p[1] <= p[0], col = up ? "#2fc790" : "#ef6a58", y1 = 175 - p[2], y2 = 175 - p[3], b1 = 175 - Math.max(p[0], p[1]), b2 = 175 - Math.min(p[0], p[1]);
      k += '<g class="k" style="animation-delay:' + (j * 45) + 'ms"><line x1="' + x + '" x2="' + x + '" y1="' + y1 + '" y2="' + y2 + '" stroke="' + col + '"/><rect x="' + (x - cw * .3) + '" y="' + b1 + '" width="' + cw * .6 + '" height="' + Math.max(2, b2 - b1) + '" fill="' + col + '"/></g>';
      var a = 0, n = 0; for (var q = Math.max(0, j - 4); q <= j; q++) { a += pts[q][1]; n++; } ma += (j ? " L" : "M") + x + " " + (175 - a / n); });
    var tp = ["NIFTY 50 \u25B2", "SENSEX \u25B2", "BANK NIFTY \u25BC", "GOLD \u25B2", "CRUDE WTI \u25BC", "S&P 500 \u25B2", "NASDAQ \u25B2", "USD/INR \u25B2", "SILVER \u25BC"].map(function (t) { return '<b class="' + (t.slice(-1) === "\u25B2" ? "u" : "d") + '">' + t + "</b>"; }).join("");
    extra = '<div class="wti-tape" aria-hidden="true"><div>' + tp + tp + '</div></div><svg class="wti-ch" viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true">' + k + '<path class="ma" pathLength="1" d="' + ma + '"/></svg>';
  }
  var o = document.createElement("div"); o.className = "wti"; o.setAttribute("role", "status"); o.setAttribute("aria-label", TXT);
  o.innerHTML = '<div class="wti-c">' + extra + '<div class="wti-in"><img src="/assets/logo' + (dk ? "-dark" : "") + '.svg" alt=""><h2><span></span><i></i></h2><div class="wti-chips">' + CH.map(function (c) { return "<span>" + c + "</span>"; }).join("") + '</div><div class="wti-skip">Tap to skip</div></div></div><canvas class="wti-cv"></canvas>';
  root.appendChild(o); root.classList.add("wti-lock");
  var sp = o.querySelector("h2 span"), n = 0, ty = setInterval(function () { sp.textContent = TXT.slice(0, ++n); if (n >= TXT.length) clearInterval(ty); }, Math.round(1100 / TXT.length));
  /* falling coins: sprites are drawn once, then only copied each frame (cheap) */
  function sprite(kind, ch) { var c = document.createElement("canvas"), x = c.getContext("2d"); c.width = c.height = 64; x.textAlign = "center"; x.textBaseline = "middle";
    if (kind === 0) { var g = x.createRadialGradient(24, 24, 3, 32, 32, 30); g.addColorStop(0, "#fff3b0"); g.addColorStop(1, "#e0a82e"); x.fillStyle = g; x.beginPath(); x.arc(32, 32, 29, 0, 6.283); x.fill(); x.strokeStyle = "#a8741a"; x.lineWidth = 3; x.stroke(); x.fillStyle = "#8a5a10"; x.font = "700 34px Inter,sans-serif"; x.fillText(ch, 32, 34); }
    else { x.fillStyle = kind === 1 ? "#2fc790" : "#e0a82e"; x.font = "700 54px Inter,sans-serif"; x.fillText(ch, 32, 34); } return c; }
  var SP = M ? [sprite(0, "\u20B9"), sprite(0, "$"), sprite(1, "\u20B9"), sprite(1, "$"), sprite(2, "\u20B9")] : [sprite(0, "\u20B9"), sprite(1, "\u20B9"), sprite(2, "\u20B9")];
  var cv = o.querySelector("canvas"), cx = cv.getContext("2d"), W = cv.width = innerWidth, H = cv.height = innerHeight, Q = [], t0 = performance.now(), last = t0, raf = 0, gone = false;
  function frame(now) { var dt = Math.min(2.5, (now - last) / 16.7); last = now; var t = (now - t0) / 1000;
    if (t < 1.25 && Q.length < 70) for (var a = 0; a < 2; a++) if (Math.random() < .75) { var s2 = 20 + Math.random() * 24; Q.push({ x: Math.random() * W, y: -s2, vy: 2.5 + Math.random() * 3, s: s2, k: Math.random() * SP.length | 0, r: Math.random() * 6, vr: (Math.random() - .5) * .12, ph: Math.random() * 6, sw: .4 + Math.random() * .8 }); }
    cx.clearRect(0, 0, W, H);
    for (var i = Q.length - 1; i >= 0; i--) { var p = Q[i]; p.vy += .09 * dt; p.y += p.vy * dt; p.x += Math.sin(now / 300 + p.ph) * p.sw; p.r += p.vr * dt; if (p.y > H + 50) { Q.splice(i, 1); continue; }
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.drawImage(SP[p.k], -p.s / 2, -p.s / 2, p.s, p.s); cx.restore(); }
    if (!gone) raf = requestAnimationFrame(frame); }
  raf = requestAnimationFrame(frame);
  var lifted = false, tl, tf;
  function lift() { if (lifted) return; lifted = true; clearInterval(ty); sp.textContent = TXT; o.classList.add("up"); cv.style.opacity = "0"; tf = setTimeout(done, 950); }
  function done() { if (gone) return; gone = true; cancelAnimationFrame(raf); clearTimeout(tl); clearTimeout(tf); clearTimeout(ks); root.classList.remove("wti-lock"); if (o.parentNode) o.parentNode.removeChild(o); document.removeEventListener("keydown", key2); }
  function key2(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") lift(); }
  o.addEventListener("click", lift); document.addEventListener("keydown", key2);
  tl = setTimeout(lift, M ? 1700 : 1500);
  var ks = setTimeout(done, 3200); /* safety: the intro can never stay on screen longer than this */
})();
