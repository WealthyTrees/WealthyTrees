/* WealthyTrees notebook.js v2: self-drawing diagrams, reading progress, and the Learn course page */
(function () {
  var de = document.documentElement, KEY = "wt-learn-";
  function get(n) { try { return +localStorage.getItem(KEY + n) || 0; } catch (e) { return 0; } }
  // 1) Module pages: remember how far down the reader got (saved only in their own browser)
  var m = location.pathname.match(/learn-(\d+)/), art = document.querySelector(".article");
  if (m && art) {
    var best = get(m[1]), tk = false;
    var up = function () {
      tk = false;
      var p = Math.round(100 * (window.pageYOffset + innerHeight) / de.scrollHeight);
      if (p >= 94) p = 100;
      if (p > best) { best = p; try { localStorage.setItem(KEY + m[1], String(p)); } catch (e) {} }
    };
    addEventListener("scroll", function () { if (!tk) { tk = true; requestAnimationFrame(up); } }, { passive: true });
  }
  // 2) Learn page: progress bars and the Start / Continue button
  var cards = document.querySelectorAll("a.ccard[data-mod]");
  if (cards.length) {
    var next = 0, anyDone = false, sum = 0;
    cards.forEach(function (c) {
      var n = +c.dataset.mod, p = get(n); sum += p;
      c.style.setProperty("--p", p + "%");
      c.querySelector(".cst").textContent = p >= 100 ? "Done \u2713" : p > 0 ? p + "% read" : "Not started";
      c.querySelector(".cgo").textContent = p >= 100 ? "Review \u2192" : p > 0 ? "Continue \u2192" : "Start lesson \u2192";
      if (p >= 100) anyDone = true; else if (!next) next = n;
    });
    var op = Math.round(sum / document.querySelectorAll(".ccard").length), ot = document.getElementById("opct"), ob = document.getElementById("obar");
    if (ot) { ot.textContent = op + "%"; ob.style.width = op + "%"; }
    var b = document.getElementById("cont");
    if (b) {
      if (!next) { b.textContent = "Review Module 1"; b.href = "/learn-1.html"; }
      else { b.href = "/learn-" + next + ".html"; b.textContent = get(next) > 0 ? "Continue Module " + next : anyDone ? "Next: Module " + next : "Start here"; }
    }
  }
  // 3) Diagrams draw themselves when scrolled into view; thumbnails replay on hover or tap
  var g = document.querySelectorAll(".dgm");
  if (!g.length) return;
  if ((window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) || !("IntersectionObserver" in window)) return;
  de.classList.add("js-nb");
  function show(n) { n.classList.add("in"); setTimeout(function () { n.classList.add("done"); }, 1800); }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }); }, { threshold: 0.25 });
  g.forEach(function (el) { io.observe(el); });
  setTimeout(function () { g.forEach(function (el) { el.classList.add("in", "done"); }); }, 8000);
  document.querySelectorAll(".ccard").forEach(function (c) {
    var th = c.querySelector(".dgm"), re = function () { th.classList.remove("in", "done"); void th.offsetWidth; show(th); };
    c.addEventListener("mouseenter", re); c.addEventListener("touchstart", re, { passive: true });
  });
})();
