/* WealthyTrees motion.js v2: cursor grid, SVG stickers, slanted bands, 3D tilt cards (mouse hover, touch press) */
(function () {
  "use strict";
  if (document.querySelector(".wt-grid")) return;
  var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var IC = {
    sprout: '<path d="M12 21v-9"/><path d="M12 12C12 8 9 6 5 6c0 4 3 6 7 6z"/><path d="M12 14c0-3.5 2.5-6 7-6 0 3.5-2.5 6-7 6z"/>',
    note: '<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6.5 10v4M17.5 10v4"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.5 1 .5 1.6V16h6v-.5c0-.6 0-1.2.5-1.6A6 6 0 0 0 12 3z"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    chart: '<path d="M4 18l5-5 4 3 7-8"/><path d="M15 8h5v5"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M9 8h6M9 11h6M9 8h1.5a3 3 0 0 1 0 6H9l5 3.5"/>'
  };
  var COL = { sprout: ["#0f7b55", "#fff"], note: ["#c9a227", "#16241d"], bulb: ["#fff3c4", "#0f3d2e"], spark: ["#0f3d2e", "#c9a227"], chart: ["#8fdcb4", "#0b2e22"], coin: ["#c9a227", "#16241d"] };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + "</svg>"; }
  function tint(e, k) { e.style.setProperty("--bg1", COL[k][0]); e.style.setProperty("--fg1", COL[k][1]); }

  /* grid + hero parallax */
  var g = el("div", "wt-grid"); g.setAttribute("aria-hidden", "true");
  g.append(el("i", "g0"), el("i", "g1"), el("i", "g2")); document.body.prepend(g);
  var hero = document.querySelector(".hero"), tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, busy = false;
  function frame() {
    x += (tx - x) * .16; y += (ty - y) * .16;
    g.style.setProperty("--mx", x.toFixed(1) + "px"); g.style.setProperty("--my", y.toFixed(1) + "px");
    if (Math.abs(tx - x) > .5 || Math.abs(ty - y) > .5) requestAnimationFrame(frame); else busy = false;
  }
  if (fine && !rm) {
    addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY; g.classList.add("on");
      if (!busy) { busy = true; requestAnimationFrame(frame); }
      if (hero) { var r = hero.getBoundingClientRect(); hero.style.setProperty("--cx", ((e.clientX - r.left) / r.width - .5).toFixed(2)); hero.style.setProperty("--cy", ((e.clientY - r.top) / r.height - .5).toFixed(2)); }
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { g.classList.remove("on"); });
  }

  /* 3D tilt cards: mouse hover, finger press (phones, tablets) */
  if (!rm) {
    var SEL = ".cardlink,.item", cur = null, pend = null, raf = 0, tm = 0;
    function apply() {
      raf = 0; if (!pend || !cur) return;
      var r = cur.getBoundingClientRect(), px = (pend.x - r.left) / r.width, py = (pend.y - r.top) / r.height;
      cur.style.setProperty("--ry", ((px - .5) * 16).toFixed(1) + "deg"); cur.style.setProperty("--rx", ((.5 - py) * 12).toFixed(1) + "deg");
      cur.style.setProperty("--sx", (pend.x - r.left).toFixed(0) + "px"); cur.style.setProperty("--sy", (pend.y - r.top).toFixed(0) + "px");
    }
    function on(c, e) { if (c !== cur) { off(); cur = c; c.classList.add("wt-t"); } pend = { x: e.clientX, y: e.clientY }; if (!raf) raf = requestAnimationFrame(apply); }
    function off() { if (!cur) return; cur.classList.remove("wt-t"); cur.style.removeProperty("--rx"); cur.style.removeProperty("--ry"); cur = null; }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") { if (cur) on(cur, e); return; }
      var c = e.target.closest && e.target.closest(SEL);
      if (!c && cur) { var q = cur.getBoundingClientRect(); if (e.clientX > q.left - 10 && e.clientX < q.right + 10 && e.clientY > q.top - 10 && e.clientY < q.bottom + 10) c = cur; }
      if (c) on(c, e); else off();
    }, { passive: true });
    document.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "touch") return;
      var c = e.target.closest && e.target.closest(SEL); if (c) { clearTimeout(tm); on(c, e); }
    }, { passive: true });
    function rel(e) { if (e.pointerType === "touch") { clearTimeout(tm); tm = setTimeout(off, 450); } }
    document.addEventListener("pointerup", rel, { passive: true }); document.addEventListener("pointercancel", rel, { passive: true });
    document.documentElement.addEventListener("mouseleave", off);
    /* touch users get a one-time glare sweep as each card scrolls in */
    if (!fine && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (l) { l.forEach(function (n) { if (n.isIntersecting) { n.target.classList.add("wt-in"); io.unobserve(n.target); } }); }, { threshold: .6 });
      document.querySelectorAll(SEL).forEach(function (c) { io.observe(c); });
    }
  }

  /* home page only */
  if (!hero) return;
  var ch = el("div", "wt-chars"); ch.setAttribute("aria-hidden", "true");
  [["sprout", "57%", "9%", 6, .2, 14, "-8deg"], ["note", "88%", "5%", 7, 1.1, -18, "10deg"], ["bulb", "94%", "32%", 5.5, .6, 22, "-6deg"], ["spark", "62%", "82%", 6.5, 1.6, -12, "8deg"], ["chart", "93%", "74%", 7.5, .3, 16, "-10deg"], ["coin", "76%", "91%", 6, 2, -20, "12deg"]].forEach(function (a) {
    var b = el("b", "wt-st"); b.innerHTML = svg(a[0]); tint(b, a[0]);
    b.style.left = a[1]; b.style.top = a[2]; b.style.setProperty("--d", a[3] + "s"); b.style.setProperty("--l", a[4] + "s"); b.style.setProperty("--p", a[5]); b.style.setProperty("--r", a[6]); ch.append(b);
  });
  hero.append(ch);
  var cta = hero.querySelector(".cta");
  if (cta) {
    var pills = el("div", "wt-pills");
    [["bulb", "Big words? We decode them."], ["sprout", "Small steps. Smarter habits."]].forEach(function (p) { var s = el("span"), i = el("i"); i.innerHTML = svg(p[0]); tint(i, p[0]); s.append(i, document.createTextNode(p[1])); pills.append(s); });
    cta.after(pills);
  }
  var feat = document.querySelector(".feat");
  if (feat) {
    var T = [["spark", "Market basics"], ["sprout", "Money habits"], ["chart", "Smarter questions"], ["bulb", "News, decoded"], ["coin", "Money tools"], ["note", "Learn by doing"]];
    var wrap = el("div", "wt-bands"); wrap.setAttribute("aria-hidden", "true");
    ["b1", "b2"].forEach(function (c) {
      var b = el("div", "b " + c), row = el("div");
      for (var k = 0; k < 4; k++) T.forEach(function (t) { var s = el("span"); s.innerHTML = svg(t[0]); s.append(document.createTextNode(t[1])); row.append(s); });
      b.append(row); wrap.append(b);
    });
    feat.before(wrap);
  }

  /* desktop: 3D motion-graphic hero. One rAF loop drives the tree, glow, shadow and icons; the mouse steers it. */
  var tree = hero.querySelector(".herotree"), dq = matchMedia("(min-width:761px)"), stage = null, home = [], raf = 0, vis = true, G = {}, srcOld = tree && tree.getAttribute("src");
  function lerp(a, b, k) { return a + (b - a) * k; }
  function frame(ts) {
    raf = 0; if (!stage) return;
    var dt = G.last ? Math.min(.05, (ts - G.last) / 1000) : 0; G.last = ts; G.t += dt;
    var k1 = 1 - Math.exp(-dt * 5), k2 = 1 - Math.exp(-dt * 7), k3 = 1 - Math.exp(-dt * 2.6), t = G.t;
    G.h = lerp(G.h, G.hT, k1); G.px = lerp(G.px, G.pxT, k2); G.py = lerp(G.py, G.pyT, k2);
    var h = G.h, n = home.length, base = .24;
    G.vel = lerp(G.vel, base * (1 - .6 * h) - G.px * h * 1.7, k3); G.ang += G.vel * dt;
    var S = stage.offsetWidth, R = S * .58 * (1 + .14 * h), ringZ = -h * 190;
    home.forEach(function (tile, k) {
      var a = G.ang + k * 6.2832 / n, c = Math.cos(a), x = -R * Math.sin(a) * (1 + .03 * Math.sin(t * .9 + k)), z0 = R * c,
          z = z0 + ringZ + 20 * Math.sin(t * 1.1 + k * 1.7), y = z0 * .2 + 7 * Math.sin(t * 1.3 + k * 2.1), f = (c + 1) / 2;
      tile.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px," + z.toFixed(1) + "px) rotateY(" + (G.px * 16 * h).toFixed(1) + "deg) rotateX(" + (-G.py * 12 * h).toFixed(1) + "deg)";
      tile.style.opacity = (.74 + .26 * f).toFixed(2);
    });
    var sw = Math.sin(t * .45) * 4;
    G.orb.style.transform = "rotateX(" + (-G.py * 15 * (.3 + .7 * h)).toFixed(2) + "deg) rotateY(" + (G.px * 22 * (.3 + .7 * h) + sw).toFixed(2) + "deg)";
    G.t3.style.transform = "translate3d(" + (G.px * 8 * h).toFixed(1) + "px," + (Math.sin(t * .8) * 5 + G.py * 6 * h).toFixed(1) + "px," + (h * 100).toFixed(1) + "px) scale(" + (1 + .035 * h).toFixed(3) + ")";
    G.aura.style.opacity = (.8 + .12 * Math.sin(t * 1.2) + .1 * h).toFixed(2);
    G.aura.style.transform = "translateZ(-90px) scale(" + (1 + .03 * Math.sin(t * 1.2) + .1 * h).toFixed(3) + ")";
    G.sh.style.transform = "translateX(" + (-G.px * 16 * h).toFixed(1) + "px) scale(" + (1 - .16 * h + .03 * Math.sin(t * .8)).toFixed(3) + ")";
    G.sh.style.opacity = (.95 - .35 * h).toFixed(2);
    if (!rm && vis) raf = requestAnimationFrame(frame);
  }
  function go() { if (!raf && stage && !rm && vis) { G.last = 0; raf = requestAnimationFrame(frame); } }
  function build() {
    if (stage || !tree) return;
    stage = el("div", "wt-stage");
    var orb = el("div", "wt-orbit"), aura = el("div", "wt-aura"), t3 = el("div", "wt-tree3d"), sh = el("div", "wt-shade"), sg = el("div", "wt-sheen");
    tree.before(stage); tree.setAttribute("src", "/assets/logo-3d.svg"); t3.append(tree);
    home = [].slice.call(ch.children); orb.append(aura, t3); home.forEach(function (tile) { orb.append(tile); }); orb.append(sg);
    stage.append(sh, orb); hero.classList.add("wt-3d");
    G = { t: 0, last: 0, h: 0, hT: 0, px: 0, py: 0, pxT: 0, pyT: 0, ang: 0, vel: .24, orb: orb, t3: t3, aura: aura, sh: sh };
    if (fine && !rm) {
      stage.addEventListener("pointerenter", function () { G.hT = 1; });
      stage.addEventListener("pointermove", function (e) {
        var r = stage.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
        G.pxT = Math.max(-1, Math.min(1, (nx - .5) * 2)); G.pyT = Math.max(-1, Math.min(1, (ny - .5) * 2));
        stage.style.setProperty("--gx", (nx * 100).toFixed(0) + "%"); stage.style.setProperty("--gy", (ny * 100).toFixed(0) + "%");
      });
      stage.addEventListener("pointerleave", function () { G.hT = 0; G.pxT = 0; G.pyT = 0; });
    }
    if ("IntersectionObserver" in window) { G.io = new IntersectionObserver(function (l) { vis = l[0].isIntersecting; if (vis) go(); }, { threshold: 0 }); G.io.observe(stage); }
    frame(0); go();
  }
  function unbuild() {
    if (!stage) return;
    if (raf) cancelAnimationFrame(raf); raf = 0; if (G.io) G.io.disconnect();
    home.forEach(function (tile) { tile.style.transform = ""; tile.style.opacity = ""; ch.append(tile); });
    tree.setAttribute("src", srcOld); stage.before(tree); stage.remove(); stage = null; hero.classList.remove("wt-3d");
  }
  function sync() { if (dq.matches) build(); else unbuild(); }
  sync();
  if (dq.addEventListener) dq.addEventListener("change", sync); else if (dq.addListener) dq.addListener(sync);
})();
