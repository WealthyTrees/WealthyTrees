/* scrplay.js v1: screener view buttons, Quest "Show me" and Guess the P/E (practice only) */
(function () {
  var $ = function (i) { return document.getElementById(i); }, L = $("sqlens");
  if (!L) return;
  var VIEW = { 0: ["most_capitalized", "overview"], 1: ["most_capitalized", "valuation"], 2: ["most_capitalized", "valuation"], 3: ["top_gainers", "performance"], 4: ["most_capitalized", "overview"] };
  function press(g, test) { L.querySelectorAll('[data-g="' + g + '"]').forEach(function (b) { b.setAttribute("aria-pressed", test(b)); }); }
  function setView(s, c) { press("v", function (b) { return b.dataset.s === s && b.dataset.c === c; }); if (window.WTscreener) window.WTscreener({ screen: s, col: c }); }
  L.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".sqp"); if (!b) return;
    if (b.dataset.g === "m") { press("m", function (x) { return x === b; }); if (window.WTscreener) window.WTscreener({ mkt: b.dataset.m }); }
    else setView(b.dataset.s, b.dataset.c);
  });
  document.querySelectorAll(".sqshow").forEach(function (b) {
    b.addEventListener("click", function () { var v = VIEW[b.dataset.v]; setView(v[0], v[1]); $("sqlens").scrollIntoView({ behavior: "smooth", block: "center" }); });
  });
  /* Guess the P/E: 5 questions, made-up numbers */
  var PE = [8, 10, 12, 15, 18, 20, 25, 28, 32, 40, 45], EPS = [2, 4, 5, 6, 8, 10, 15, 20, 25, 30, 40, 50], K = "wt-gp-best", best = 0, n = 0, score = 0, cur = null, phase = "ask";
  try { best = +localStorage.getItem(K) || 0; } catch (e) {}
  var q = $("gpq"), inp = $("gpi"), btn = $("gpb"), fb = $("gpf"), st = $("gps");
  function pick(a) { return a[Math.random() * a.length | 0]; }
  function stars() { st.textContent = "\u2605".repeat(score) + "\u2606".repeat(5 - score); }
  function ask() { var pe = pick(PE), eps = pick(EPS); cur = { pe: pe, eps: eps, price: pe * eps }; n++; phase = "ask";
    q.innerHTML = '<span class="gpn">Question ' + n + ' of 5</span> <span class="gpx">Price \u20B9' + cur.price + '</span> \u00F7 <span class="gpx">Earnings \u20B9' + cur.eps + '</span> = <b>?</b>';
    inp.value = ""; inp.disabled = false; inp.hidden = false; btn.textContent = "Check"; fb.textContent = ""; inp.focus(); }
  function act() {
    if (phase === "ask") { var v = parseFloat(inp.value); if (isNaN(v)) { fb.textContent = "Type a number first."; return; }
      var ok = Math.abs(v - cur.pe) <= 0.5; if (ok) score++; stars();
      var m = cur.pe < 15 ? "A low P/E can mean cheap, or slow growth expected." : cur.pe <= 30 ? "A middle P/E. Compare it with companies in the same sector." : "A high P/E means big growth is expected, or the price is stretched.";
      fb.textContent = (ok ? "\u2714 Yes! " : "Not quite. ") + "\u20B9" + cur.price + " \u00F7 \u20B9" + cur.eps + " = " + cur.pe + ". You pay \u20B9" + cur.pe + " for every \u20B91 earned. " + m;
      inp.disabled = true; phase = n < 5 ? "next" : "done"; btn.textContent = n < 5 ? "Next" : "See score";
    } else if (phase === "next") ask();
    else if (phase === "done") { if (score > best) { best = score; try { localStorage.setItem(K, best); } catch (e) {} }
      q.innerHTML = "<b>Score " + score + " of 5</b> " + "\u2605".repeat(score) + "\u2606".repeat(5 - score) + " &nbsp; Best: " + best + " of 5"; fb.textContent = score === 5 ? "Perfect round! P/E is price divided by earnings." : "Play again to beat your best.";
      inp.hidden = true; phase = "again"; btn.textContent = "Play again"; }
    else { n = 0; score = 0; stars(); ask(); }
  }
  btn.addEventListener("click", act); inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); act(); } });
  stars(); ask();
})();
