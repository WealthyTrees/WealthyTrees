/* WealthyTrees notebook.js v1: hand-drawn diagrams draw themselves when scrolled into view */
(function () {
  var g = document.querySelectorAll(".dgm");
  if (!g.length) return;
  if ((window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js-nb");
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); var n = e.target; setTimeout(function () { n.classList.add("done"); }, 1800); } }); }, { threshold: 0.25 });
  g.forEach(function (el) { io.observe(el); });
  setTimeout(function () { g.forEach(function (el) { el.classList.add("in"); el.classList.add("done"); }); }, 8000);
})();
