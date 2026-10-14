/* WealthyTrees notebook.js v2: self-drawing diagrams, reading progress, and the Learn course page */
(function () {
  var de = document.documentElement, KEY = "wt-learn-";
  function get(n) { try { return +localStorage.getItem(KEY + n) || 0; } catch (e) { return 0; } }
  // A module is complete only when it is read to the end AND all 3 lab tasks are ticked AND the quiz is finished.
  function prog(n) {
    var read = Math.min(100, get(n)), lab = 0, qd = false;
    try { var o = JSON.parse(localStorage.getItem("wt-lab-" + n) || "{}"); for (var k in o) if (o[k]) lab++; qd = !!localStorage.getItem("wt-quizdone-" + n); } catch (e) {}
    lab = Math.min(3, lab);
    var done = read >= 100 && lab >= 3 && qd;
    return { read: read, lab: lab, qd: qd, done: done, pct: done ? 100 : Math.min(99, Math.round(read * 0.4 + lab * 10 + (qd ? 30 : 0))) };
  }
  window.WTP = prog;
  // 1) Module pages: remember how far down the reader got (saved only in their own browser)
  var m = location.pathname.match(/module-(\d+)/), art = document.querySelector(".article");
  if (m && art) {
    var best = get(m[1]), tk = false;
    var up = function () {
      tk = false;
      var p = Math.round(100 * (window.pageYOffset + innerHeight) / de.scrollHeight);
      if (p >= 94) p = 100;
      if (p > best) { best = p; try { localStorage.setItem(KEY + m[1], String(p)); } catch (e) {} if (p === 100) window.dispatchEvent(new Event("wt-progress")); }
    };
    addEventListener("scroll", function () { if (!tk) { tk = true; requestAnimationFrame(up); } }, { passive: true });
  }
  // 2) Learn page: progress bars and the Start / Continue button
  var cards = document.querySelectorAll("a.ccard[data-mod]");
  if (cards.length) {
    var next = 0, anyDone = false, sum = 0;
    cards.forEach(function (c) {
      var n = +c.dataset.mod, P = prog(n), p = P.pct; sum += p;
      c.style.setProperty("--p", p + "%");
      c.querySelector(".cst").textContent = P.done ? "Done \u2713" : p > 0 ? p + "% done" : "Not started";
      c.querySelector(".cgo").textContent = P.done ? "Review \u2192" : p > 0 ? "Continue \u2192" : "Start lesson \u2192";
      if (P.done) anyDone = true; else if (!next) next = n;
    });
    var op = Math.round(sum / document.querySelectorAll(".ccard").length), ot = document.getElementById("opct"), ob = document.getElementById("obar");
    if (ot) { ot.textContent = op + "%"; ob.style.width = op + "%"; }
    var b = document.getElementById("cont");
    if (b) {
      if (!next) { b.textContent = "Review Module 1"; b.href = "/learn/module-1.html"; }
      else { b.href = "/learn/module-" + next + ".html"; b.textContent = prog(next).pct > 0 ? "Continue Module " + next : anyDone ? "Next: Module " + next : "Start here"; }
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

/* Practice lab: tick boxes are remembered in the visitor's own browser */
(function () {
  var lab = document.querySelector(".lab"); if (!lab) return;
  var k = "wt-lab-" + lab.dataset.lab, saved = {};
  try { saved = JSON.parse(localStorage.getItem(k) || "{}"); } catch (e) {}
  var boxes = lab.querySelectorAll("input[type=checkbox]"), cnt = lab.querySelector(".lab-cnt");
  function paint() {
    var n = 0; boxes.forEach(function (b) { if (b.checked) n++; b.closest("li").classList.toggle("ok", b.checked); });
    cnt.textContent = n === boxes.length ? "All done \u2713 Great work" : n + " of " + boxes.length + " done";
    lab.classList.toggle("all", n === boxes.length);
  }
  boxes.forEach(function (b) {
    b.checked = !!saved[b.dataset.i];
    b.addEventListener("change", function () { saved[b.dataset.i] = b.checked; try { localStorage.setItem(k, JSON.stringify(saved)); } catch (e) {} paint(); });
  });
  var strip = document.createElement("div"); strip.className = "mdone";
  strip.innerHTML = '<span data-k="read">Read</span><span data-k="lab">Lab</span><span data-k="quiz">Quiz</span><p class="mdone-msg"></p>';
  lab.insertBefore(strip, lab.querySelector(".mpath"));
  function strp() {
    var P = window.WTP(lab.dataset.lab), sp = strip.querySelectorAll("span");
    sp[0].className = P.read >= 100 ? "ok" : ""; sp[0].textContent = (P.read >= 100 ? "\u2713 " : "") + "Read to the end";
    sp[1].className = P.lab >= 3 ? "ok" : ""; sp[1].textContent = (P.lab >= 3 ? "\u2713 " : "") + "Lab " + P.lab + "/3";
    sp[2].className = P.qd ? "ok" : ""; sp[2].textContent = (P.qd ? "\u2713 " : "") + "Quiz";
    strip.querySelector(".mdone-msg").textContent = P.done ? "Module complete. Great work!" : "Finish all three to complete this module.";
  }
  boxes.forEach(function (b) { b.addEventListener("change", strp); });
  window.addEventListener("wt-progress", strp); strp();
  paint();
})();
