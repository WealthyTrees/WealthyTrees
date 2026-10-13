/* WealthyTrees design.js v1: headline word reveal, scroll reveal, scroll progress bar, header shadow */
(function () {
  "use strict";
  var rm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var de = document.documentElement;

  var h1 = document.querySelector(".hero h1");
  if (h1 && !h1.dataset.split) {
    h1.dataset.split = "1";
    var txt = h1.textContent.trim(), words = txt.split(/\s+/), i = 0;
    h1.setAttribute("aria-label", txt); h1.textContent = "";
    words.forEach(function (w, k) {
      var s = document.createElement("span"); s.className = "w" + (/^simplified\.?$/i.test(w) ? " hl" : ""); s.style.setProperty("--i", k); s.setAttribute("aria-hidden", "true"); s.textContent = w;
      h1.append(s); if (k < words.length - 1) h1.append(" ");
    });
  }

  var pt = document.querySelector(".page > h1"); if (pt) pt.classList.add("pt");

  var bar = document.createElement("div"); bar.className = "wt-prog"; bar.setAttribute("aria-hidden", "true"); document.body.append(bar);
  var hd = document.querySelector("header"), tk = false;
  function onScroll() {
    if (tk) return; tk = true;
    requestAnimationFrame(function () {
      var h = de.scrollHeight - innerHeight, y = window.pageYOffset || de.scrollTop;
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
      if (hd) { hd.classList.toggle("sc", y > 8); if (y > 90) hd.classList.add("sm"); else if (y < 30) hd.classList.remove("sm"); } tk = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if (rm || !("IntersectionObserver" in window)) return;
  var t = document.querySelectorAll("main h2.sec, .feat .cardlink, main .card, main .lesson, .nl .wrap, .page h2, .page .callout, .page .learn, .page .cardlink");
  if (!t.length) return;
  de.classList.add("js-rv");
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  t.forEach(function (el, n) { el.classList.add("rv"); el.style.setProperty("--r", String(n % 3)); io.observe(el); });
  setTimeout(function () { t.forEach(function (el) { el.classList.add("in"); }); }, 6000); /* safety net */
})();
