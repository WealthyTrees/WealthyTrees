/* WealthyTrees motion.js v1: cursor grid, tree parallax, playful characters, topic strip, card spotlight */
(function () {
  "use strict";
  var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (rm || document.querySelector(".wt-grid")) return;
  var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  /* grid */
  var g = el("div", "wt-grid"); g.setAttribute("aria-hidden", "true");
  g.append(el("i", "g0"), el("i", "g1"), el("i", "g2")); document.body.prepend(g);
  var tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, hero = document.querySelector(".hero"), busy = false;
  function frame() {
    x += (tx - x) * .16; y += (ty - y) * .16;
    g.style.setProperty("--mx", x.toFixed(1) + "px"); g.style.setProperty("--my", y.toFixed(1) + "px");
    if (Math.abs(tx - x) > .5 || Math.abs(ty - y) > .5) requestAnimationFrame(frame); else busy = false;
  }
  if (fine) {
    addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY; g.classList.add("on");
      if (!busy) { busy = true; requestAnimationFrame(frame); }
      if (hero) { var r = hero.getBoundingClientRect(); hero.style.setProperty("--cx", ((e.clientX - r.left) / r.width - .5).toFixed(2)); hero.style.setProperty("--cy", ((e.clientY - r.top) / r.height - .5).toFixed(2)); }
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { g.classList.remove("on"); });
    document.addEventListener("pointermove", function (e) {
      var c = e.target.closest && e.target.closest(".cardlink,.item"); if (!c) return;
      var r = c.getBoundingClientRect(); c.style.setProperty("--sx", (e.clientX - r.left) + "px"); c.style.setProperty("--sy", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* home page only */
  if (!hero) return;
  var ch = el("div", "wt-chars"); ch.setAttribute("aria-hidden", "true");
  [["🌱", "57%", "9%", 6, .2, 14], ["💸", "88%", "5%", 7, 1.1, -18], ["🧠", "94%", "32%", 5.5, .6, 22], ["✨", "62%", "82%", 6.5, 1.6, -12], ["📈", "93%", "74%", 7.5, .3, 16], ["🪙", "76%", "91%", 6, 2, -20]].forEach(function (a) {
    var b = el("b", "", a[0]); b.style.left = a[1]; b.style.top = a[2]; b.style.setProperty("--d", a[3] + "s"); b.style.setProperty("--l", a[4] + "s"); b.style.setProperty("--p", a[5]); ch.append(b);
  });
  hero.append(ch);
  var cta = hero.querySelector(".cta");
  if (cta) {
    var pills = el("div", "wt-pills");
    [["🧠", "Big words? We decode them."], ["🌱", "Small steps. Smarter habits."]].forEach(function (p) { var s = el("span"); s.append(el("em", "", p[0]), document.createTextNode(p[1])); pills.append(s); });
    cta.after(pills);
  }
  var feat = document.querySelector(".feat");
  if (feat) {
    var T = [["✳", "Market basics"], ["✿", "Money habits"], ["↗", "Smarter questions"], ["✦", "News, decoded"], ["◉", "Money tools"]], row = el("div");
    for (var k = 0; k < 2; k++) T.forEach(function (t) { var s = el("span"); s.append(el("b", "", t[0]), document.createTextNode(t[1])); row.append(s); });
    var st = el("div", "wt-strip"); st.setAttribute("aria-hidden", "true"); st.append(row); feat.before(st);
  }
})();
