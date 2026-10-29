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

  /* desktop: 3D hero. Icons orbit the tree; on hover the tree comes forward, icons swing behind, scene tilts with the mouse. */
  var tree = hero.querySelector(".herotree"), dq = matchMedia("(min-width:761px)"), stage = null, home = [];
  function build() {
    if (stage || !tree) return;
    stage = el("div", "wt-stage");
    var orb = el("div", "wt-orbit"), rw = el("div", "wt-ringwrap"), ring = el("div", "wt-ring"), t3 = el("div", "wt-tree3d");
    tree.before(stage);
    for (var i = 3; i >= 1; i--) { var c = tree.cloneNode(false); c.removeAttribute("class"); c.className = "wt-layer"; c.alt = ""; c.setAttribute("aria-hidden", "true"); c.style.setProperty("--i", i); t3.append(c); }
    t3.append(tree);
    var sh = el("div", "wt-shade"), sg = el("div", "wt-sheen");
    home = [].slice.call(ch.children);
    home.forEach(function (tile, k) {
      var slot = el("div", "wt-slot"); slot.style.setProperty("--k", k); slot.style.setProperty("--n", home.length); slot.style.setProperty("--dd", (3 + k * .45) + "s"); slot.append(tile); ring.append(slot);
    });
    rw.append(ring); orb.append(rw, t3, sg); stage.append(sh, orb);
    stage.classList.add("on"); hero.classList.add("wt-3d");
    if (fine && !rm) {
      stage.addEventListener("pointermove", function (e) {
        var r = stage.getBoundingClientRect();
        stage.style.setProperty("--ry", (((e.clientX - r.left) / r.width - .5) * 34).toFixed(1) + "deg");
        stage.style.setProperty("--rx", (((e.clientY - r.top) / r.height - .5) * -26).toFixed(1) + "deg");
        stage.style.setProperty("--gx", (((e.clientX - r.left) / r.width) * 100).toFixed(0) + "%");
        stage.style.setProperty("--gy", (((e.clientY - r.top) / r.height) * 100).toFixed(0) + "%");
      });
      stage.addEventListener("pointerleave", function () { stage.style.setProperty("--ry", "0deg"); stage.style.setProperty("--rx", "0deg"); });
    }
  }
  function unbuild() {
    if (!stage) return;
    home.forEach(function (tile) { ch.append(tile); });
    stage.before(tree); stage.remove(); stage = null; hero.classList.remove("wt-3d");
  }
  function sync() { if (dq.matches) build(); else unbuild(); }
  sync();
  if (dq.addEventListener) dq.addEventListener("change", sync); else if (dq.addListener) dq.addListener(sync);
})();
