/* WealthyTrees Daily Edition: flip-newspaper built from /api/pulse (Sprout), /data/brief.json and /api/quotes. */
(function () {
  "use strict";
  var RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function safe(u) { return typeof u === "string" && /^https?:\/\//i.test(u) ? u : "#"; }
  function jget(url, ms) {
    var c = new AbortController(), t = setTimeout(function () { c.abort(); }, ms || 8000);
    return fetch(url, { signal: c.signal }).then(function (r) { clearTimeout(t); if (!r.ok) throw 0; return r.json(); });
  }
  function ago(ms) { var m = Math.round((Date.now() - ms) / 60000); return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.floor(m / 60) + " h ago" : "yesterday"; }

  var now = new Date();
  var dateStr = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now);
  var hour = +new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hourCycle: "h23" }).format(now);
  var edName = hour < 12 ? "Morning" : hour < 17 ? "Midday" : hour < 21 ? "Evening" : "Late";
  var ist = new Date(now.getTime() + 19800000);
  var doy = Math.floor((Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - Date.UTC(ist.getUTCFullYear(), 0, 0)) / 864e5);

  var GLOSS = [["Repo rate", "The rate at which the RBI lends short-term money to banks."], ["Inflation", "How fast prices in general are rising over time."],
    ["Market cap", "A company\u2019s total value: share price times number of shares."], ["P/E ratio", "Share price divided by yearly profit per share."],
    ["Bull market", "A stretch when prices are generally rising."], ["Bear market", "A stretch when prices keep falling, often 20% or more from a peak."],
    ["Dividend", "A share of profit a company pays to its shareholders."]];
  var FMT = { "CRUDE WTI": function (v) { return "$" + v.toFixed(1); }, "USD/INR": function (v) { return v.toFixed(2); } };
  function fmt(n, v) { return (FMT[n] || function (x) { return x.toLocaleString("en-US", { maximumFractionDigits: 0 }); })(v); }

  var book = document.getElementById("book"), dotsEl = document.getElementById("dots"), live = document.getElementById("live"),
      prevB = document.getElementById("prev"), nextB = document.getElementById("next"), press = document.getElementById("press"),
      root = document.getElementById("ed"), flatB = document.getElementById("flat");
  var pages = [], titles = [], cur = 0, typed = false, counted = false, flat = RM;

  function shell(title) {
    var pg = el("section", "page"), f = el("div", "front"), b = el("div", "back");
    pg.setAttribute("aria-label", title); b.append(el("span", "bk", "WealthyTrees"));
    pg.append(f, b); return { pg: pg, f: f };
  }
  function head(f, kick, title) { var h = el("header", "ph rv"); h.append(el("span", "kick", kick), el("h2", "", title)); f.append(h); }
  function folio(f, n, total) {
    var r = el("div", "folio"); r.append(el("span", "", "WealthyTrees Daily \u00B7 Page " + n + " of " + total), el("span", "", "Education only. Not investment advice.")); f.append(r);
  }
  function link(text, url) { var a = el("a", "src", text); a.href = safe(url); a.target = "_blank"; a.rel = "noopener noreferrer"; return a; }

  function ilink(text, href) { var a = el("a", "src", text); a.href = href; return a; }

  function story(s, i) {
    var a = el("article", "st rv"); a.style.setProperty("--i", i + 1);
    var m = el("div", "sm"); m.append(el("span", "pill", s.topic || "News"));
    if (s.t) m.append(el("time", "", ago(s.t)));
    a.append(m, el("h3", "", s.hook || s.title));
    if (s.summary) a.append(el("p", "", s.summary));
    if (s.simple) {
      var d = el("div", "simple"); d.hidden = true; d.append(el("b", "", "Explain simply"), el("span", "", s.simple));
      var b = el("button", "more", "Explain simply \u25BE"); b.type = "button"; b.setAttribute("aria-expanded", "false");
      b.onclick = function () { var on = d.hidden; d.hidden = !on; b.setAttribute("aria-expanded", String(on)); b.textContent = on ? "Hide \u25B4" : "Explain simply \u25BE"; };
      a.append(b, d);
    }
    var src = (s.sources || [])[0]; if (src && safe(src.url) !== "#") a.append(link("Read at " + src.name + " \u2197", src.url));
    return a;
  }

  function build(pulse, brief, quotes) {
    if (!pulse) { try { var c = JSON.parse(localStorage.getItem("wt-pulse") || "null"); if (c && c.j && Date.now() - c.at < 6 * 3600e3) pulse = c.j; } catch (e) {} }
    var stories = (pulse && pulse.stories) || [], leadLine = pulse && pulse.ai ? pulse.lead || "" : "";
    var items = (brief && brief.items) || [], ticker = ((brief && brief.ticker) || []).map(function (x) { return { name: x.name, value: x.value, change: x.change, num: NaN }; });
    if (quotes && quotes.quotes) ticker.forEach(function (x) { var q = quotes.quotes[x.name]; if (q && q.price && q.prev) { x.num = q.price; x.value = fmt(x.name, q.price); x.change = (q.price - q.prev) / q.prev * 100; } });
    var N = 5, ml, top = stories[0] || (items[0] ? { topic: items[0].category, title: items[0].title, summary: items[0].summary, sources: [{ name: items[0].source, url: items[0].url }] } : null);
    var fresh = !!(top && top.t && Date.now() - top.t < 1800000);

    /* Page 1: cover */
    var p = shell("Front page"), f = p.f; f.classList.add("cover");
    var tl = el("div", "tline rv"); tl.append(el("span", "", "Vol. 1 \u00B7 " + edName + " Edition"), el("span", "", dateStr)); f.append(tl);
    var h = el("h1", "mast"); h.setAttribute("aria-label", "The WealthyTrees Daily");
    "The WealthyTrees Daily".split("").forEach(function (ch, i) { var s = el("span", "", ch === " " ? "\u00A0" : ch); s.style.setProperty("--i", i); s.setAttribute("aria-hidden", "true"); h.append(s); });
    f.append(h, el("p", "tagl rv", "Markets, simplified. No tips. No hype."));
    var lead = el("article", "lead rv"); lead.style.setProperty("--i", 3);
    if (fresh) lead.append(el("span", "stamp", "Stop press"));
    if (top) {
      lead.append(el("span", "kick", top.topic || "Top story"), el("h2", "", top.hook || top.title));
      if (top.summary) lead.append(el("p", "", top.summary));
    } else lead.append(el("span", "kick", "Presses warming up"), el("h2", "", "Today\u2019s stories are still loading"), el("p", "", "Live news is slow right now. Try again in a minute, or turn the page to read the lessons."));
    var go1 = el("button", "btn", "Turn the page \u2192"); go1.type = "button"; go1.onclick = function () { go(cur + 1); }; lead.append(go1); f.append(lead);
    var sp = el("p", "sprout rv", ""); sp.style.setProperty("--i", 5); sp.dataset.text = leadLine ? "Sprout reports: " + leadLine : ""; if (leadLine) f.append(sp);
    var strip = el("div", "strip rv"); strip.style.setProperty("--i", 6);
    ticker.slice(0, 4).forEach(function (x) { var s = el("span", "", x.name + " "); s.append(el("b", x.change >= 0 ? "up" : "dn", x.value + " " + (x.change >= 0 ? "\u25B2" : "\u25BC") + Math.abs(x.change).toFixed(2) + "%")); strip.append(s); });
    if (ticker.length) f.append(strip);
    folio(f, 1, N); pages.push(p.pg); titles.push("Front page");

    /* Page 2: top stories */
    p = shell("Top stories"); f = p.f; head(f, "Sprout\u2019s newsroom", "Top stories");
    var rest = stories.slice(1, 5); if (!rest.length) rest = stories.slice(0, 4);
    var cols = el("div", "cols"); rest.forEach(function (s, i) { cols.append(story(s, i)); });
    if (!rest.length) cols.append(el("p", "empty rv", "No major stories right now. Check the Live Wire on the home page."));
    var ml = el("p", "more-link rv"); ml.append(ilink("More on the Live Wire \u2192", "/#brief")); f.append(cols, ml);
    folio(f, 2, N); pages.push(p.pg); titles.push("Top stories");

    /* Page 3: the brief */
    p = shell("The brief"); f = p.f; head(f, "Daily brief", "Today\u2019s brief");
    cols = el("div", "cols");
    items.slice(0, 6).forEach(function (it, i) {
      var a = el("article", "st rv"); a.style.setProperty("--i", i + 1);
      var m = el("div", "sm"); m.append(el("span", "pill", it.category || "News")); a.append(m, el("h3", "", it.title), el("p", "", it.summary));
      if (it.why) a.append(el("p", "why", "Why it matters: " + it.why));
      if (safe(it.url) !== "#") a.append(link("Source: " + (it.source || "link") + " \u2197", it.url)); cols.append(a);
    });
    if (!items.length) cols.append(el("p", "empty rv", "The daily brief is being prepared."));
    f.append(cols); folio(f, 3, N); pages.push(p.pg); titles.push("The brief");

    /* Page 4: markets */
    p = shell("Markets"); f = p.f; head(f, "By the numbers", "Markets at a glance");
    var tb = el("div", "tbl");
    ticker.forEach(function (x, i) {
      var r = el("div", "row rv"); r.style.setProperty("--i", i + 1);
      var n = el("b", "num", x.value), raw = (x.num === x.num) ? x.num : parseFloat(String(x.value).replace(/[^0-9.\-]/g, ""));
      if (raw === raw) { n.dataset.to = raw; n.dataset.name = x.name; n.dataset.dec = (String(x.value).split(".")[1] || "").replace(/\D/g, "").length; n.dataset.pre = /^\$/.test(x.value) ? "$" : ""; }
      r.append(el("span", "nm", x.name), n, el("span", "chg " + (x.change >= 0 ? "up" : "dn"), (x.change >= 0 ? "\u25B2 " : "\u25BC ") + Math.abs(x.change).toFixed(2) + "%")); tb.append(r);
    });
    if (!ticker.length) tb.append(el("p", "empty rv", "Market numbers are loading."));
    ml = el("p", "more-link rv"); ml.append(ilink("Open the charts \u2192", "/markets.html"));
    f.append(tb, el("p", "note rv", "Prices may be delayed by up to 15 minutes. Open the interactive charts to explore."), ml);
    folio(f, 4, N); pages.push(p.pg); titles.push("Markets");

    /* Page 5: learn + back page */
    p = shell("Learn"); f = p.f; head(f, "Back page", "Learn something today");
    var t = null; stories.forEach(function (s) { if (!t && s.term && s.meaning) t = [s.term, s.meaning]; }); if (!t) t = GLOSS[doy % GLOSS.length];
    var w = el("article", "word rv"); w.style.setProperty("--i", 1); w.append(el("span", "kick", "Word of the day"), el("h3", "", t[0]), el("p", "", t[1])); f.append(w);
    var L = doy % 2 ? ["/learn-2.html", "Reading a company", "The three financial statements and the red flags to check."] : ["/learn-1.html", "Market basics", "Exchanges, indices, how a trade works and who regulates it."];
    var ls = el("article", "word rv"); ls.style.setProperty("--i", 2); ls.append(el("span", "kick", "Lesson of the day"), el("h3", "", L[1]), el("p", "", L[2])); ls.append(ilink("Start the lesson \u2192", L[0])); f.append(ls);
    var end = el("div", "end rv"); end.style.setProperty("--i", 3); end.append(el("p", "", "That\u2019s the edition. A fresh one is printed through the day."));
    var sb = el("a", "btn", "Get it by email"); sb.href = "#nl"; end.append(sb); f.append(end);
    folio(f, 5, N); pages.push(p.pg); titles.push("Learn");

    pages.forEach(function (pg) { book.append(pg); });
    dotsEl.innerHTML = "";
    titles.forEach(function (tt, i) { var d = el("button", "dot"); d.type = "button"; d.setAttribute("aria-label", "Page " + (i + 1) + ": " + tt); d.onclick = function () { go(i); }; dotsEl.append(d); });
    var start = /^#p(\d)$/.exec(location.hash); cur = start ? Math.min(N, Math.max(1, +start[1])) - 1 : 0;
    setFlat(flat); go(cur, true);
  }

  function runOn(i) {
    var pg = pages[i];
    if (i === 0 && !typed) { var sp = pg.querySelector(".sprout"); if (sp && sp.dataset.text) { typed = true; var txt = sp.dataset.text; if (flat || RM) sp.textContent = txt; else { sp.textContent = ""; var k = 0; (function nx() { sp.textContent = txt.slice(0, ++k); if (k < txt.length) setTimeout(nx, 22); })(); } } }
    if (i === 3 && !counted) {
      counted = true;
      pg.querySelectorAll(".num[data-to]").forEach(function (n) {
        var to = +n.dataset.to, dec = +n.dataset.dec || 0, pre = n.dataset.pre || "", name = n.dataset.name, t0 = Date.now();
        var show = function (v) { n.textContent = pre + (name === "CRUDE WTI" || name === "USD/INR" ? v.toFixed(dec) : v.toLocaleString("en-US", { maximumFractionDigits: dec, minimumFractionDigits: dec })); };
        if (flat || RM) return show(to);
        (function st() { var q = Math.min(1, (Date.now() - t0) / 1000); show(to * (1 - Math.pow(1 - q, 3))); if (q < 1) requestAnimationFrame(st); })();
      });
    }
  }

  function go(n, first) {
    var N = pages.length; if (!N) return; n = Math.max(0, Math.min(N - 1, n)); if (n === cur && !first && !flat) return; cur = n;
    pages.forEach(function (pg, i) {
      var was = pg.classList.contains("flipped"), now_ = !flat && i < cur;
      pg.classList.toggle("flipped", now_); pg.classList.toggle("on", flat || i === cur);
      if (was !== now_ && !first) { pg.style.zIndex = 100 + i; setTimeout(function () { pg.style.zIndex = now_ ? i : N - i; }, 950); } else pg.style.zIndex = now_ ? i : N - i;
      if (flat || i === cur) { pg.removeAttribute("inert"); pg.removeAttribute("aria-hidden"); } else { pg.setAttribute("inert", ""); pg.setAttribute("aria-hidden", "true"); }
    });
    dotsEl.querySelectorAll(".dot").forEach(function (d, i) { d.classList.toggle("act", i === cur); if (i === cur) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
    prevB.disabled = cur === 0; nextB.disabled = cur === N - 1;
    live.textContent = "Page " + (cur + 1) + " of " + N + ": " + titles[cur];
    try { history.replaceState(null, "", "#p" + (cur + 1)); } catch (e) {}
    if (flat) pages.forEach(function (_, i) { runOn(i); }); else runOn(cur);
  }

  function setFlat(on) {
    flat = !!on; book.classList.toggle("flat", flat); root.classList.toggle("flat-on", flat);
    flatB.textContent = flat ? "Switch to flip view" : "Switch to scroll view"; flatB.setAttribute("aria-pressed", String(flat));
    if (pages.length) go(cur, true);
  }

  prevB.onclick = function () { go(cur - 1); }; nextB.onclick = function () { go(cur + 1); };
  var el1 = document.getElementById("edge-l"), el2 = document.getElementById("edge-r");
  if (el1) el1.onclick = function () { go(cur - 1); }; if (el2) el2.onclick = function () { go(cur + 1); };
  flatB.onclick = function () { setFlat(!flat); };
  document.addEventListener("keydown", function (e) {
    if (flat || /INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || "")) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") go(cur + 1); else if (e.key === "ArrowLeft" || e.key === "PageUp") go(cur - 1);
    else if (e.key === "Home") go(0); else if (e.key === "End") go(pages.length - 1);
  });
  var sx = null, sy = 0;
  book.addEventListener("pointerdown", function (e) { if (flat || (e.target.closest && e.target.closest("a,button"))) { sx = null; return; } sx = e.clientX; sy = e.clientY; });
  book.addEventListener("pointerup", function (e) { if (sx == null) return; var dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go(cur + (dx < 0 ? 1 : -1)); });
  book.addEventListener("pointercancel", function () { sx = null; });
  if (!RM && window.matchMedia && matchMedia("(hover:hover)").matches) {
    var tilt = document.getElementById("tilt");
    tilt.addEventListener("mousemove", function (e) { var r = tilt.getBoundingClientRect(); book.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 5 + "deg"); book.style.setProperty("--rx", (.5 - (e.clientY - r.top) / r.height) * 3 + "deg"); });
    tilt.addEventListener("mouseleave", function () { book.style.setProperty("--ry", "0deg"); book.style.setProperty("--rx", "0deg"); });
  }

  var t0 = Date.now(), done = false;
  function finish(pulse, brief, quotes) {
    if (done) return; done = true;
    try { build(pulse, brief, quotes); } catch (e) { book.append(el("p", "empty", "The edition could not be printed. Please refresh.")); }
    var wait = RM ? 0 : Math.max(0, 1500 - (Date.now() - t0));
    setTimeout(function () { press.classList.add("done"); root.classList.add("ready"); setTimeout(function () { press.remove(); }, 900); }, wait);
  }
  var out = [null, null, null];
  Promise.all([jget("/api/pulse", 10000).catch(function () { return null; }), jget("/data/brief.json?t=" + Date.now(), 8000).catch(function () { return null; }), jget("/api/quotes", 6000).catch(function () { return null; })])
    .then(function (r) { finish(r[0], r[1], r[2]); });
  setTimeout(function () { finish(null, null, null); }, 14000);
})();
