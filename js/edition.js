/* WealthyTrees Daily Edition v4: Instagram-Stories-style tab inside the Newsroom. No prices. Uses Sprout's stories (/api/pulse). */
(function () {
  "use strict";
  var tabs = document.querySelector('.tabs[aria-label="Newsroom"]') || document.querySelector(".tabs"), live = document.getElementById("p-live");
  if (!tabs || !live || document.getElementById("t-ed")) return;
  var RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches), DUR = 14000;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function safe(u) { return typeof u === "string" && /^https?:\/\//i.test(u) ? u : ""; }
  function jget(u, ms) { var c = new AbortController(), t = setTimeout(function () { c.abort(); }, ms); return fetch(u, { signal: c.signal }).then(function (r) { clearTimeout(t); if (!r.ok) throw 0; return r.json(); }); }

  // Show the greeting opening slide on Vijayadashami only; query flags enable preview.
  var query = new URLSearchParams(window.location.search);
  var festivalPreview = ["previewDussehra", "previewDussehraEdition"].some(function (key) { return query.get(key) === "1"; });
  var indiaParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  var indiaPart = function (type) { return (indiaParts.find(function (item) { return item.type === type; }) || {}).value || ""; };
  var indiaDate = indiaPart("year") + "-" + indiaPart("month") + "-" + indiaPart("day");
  var SHOW_FESTIVAL_GREETING = festivalPreview || indiaDate === "2026-10-20";


  var now = new Date(), hour = +new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hourCycle: "h23" }).format(now);
  var date = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" }).format(now);
  var doy = Math.floor((now.getTime() + 19800000) / 864e5);
  var ED = hour >= 6 && hour < 12 ? ["Morning", "Afternoon Edition at 12:00 PM"] : hour >= 12 && hour < 18 ? ["Afternoon", "Night Edition at 6:00 PM, the last of the day"] : ["Night", "Morning Edition at 6:00 AM"];
  var GL = [["Repo rate", "The rate at which the RBI lends short-term money to banks."], ["Inflation", "How fast prices in general are rising."], ["Market cap", "A company\u2019s total value: share price times number of shares."], ["Dividend", "A share of profit paid to shareholders."], ["Bull market", "A stretch when prices are generally rising."], ["Bear market", "A stretch when prices keep falling."], ["P/E ratio", "Share price divided by yearly profit per share."]];

  /* tab + panel */
  var tb = el("button", "tab", "Daily Edition"); tb.id = "t-ed"; tb.type = "button"; tb.setAttribute("role", "tab"); tb.setAttribute("aria-selected", "false"); tb.setAttribute("aria-controls", "p-ed");
  var panel = el("section"); panel.id = "p-ed"; panel.setAttribute("role", "tabpanel"); panel.setAttribute("aria-labelledby", "t-ed"); panel.hidden = true;
  var a0 = document.getElementById("t-reads"); if (a0) tabs.insertBefore(tb, a0); else tabs.append(tb); live.after(panel);

  var N = 5, slides = [], bars = [], cur = 0, el_ = 0, playing = !RM, loaded = false, visible = false, timer = null, root, story, pp;

  function slide(cls, i) { var s = el("div", "sl " + cls); s.setAttribute("aria-label", "Slide " + (i + 1) + " of " + N); return s; }
  function link(t, u) { var a = el("a", "go", t); a.href = u; a.target = "_blank"; a.rel = "noopener noreferrer"; return a; }

  function pick(st) {
    var ok = st.filter(function (x) { return x && (x.hook || x.title) && (x.summary || x.simple); });
    var lk = ok.filter(function (x) { return (x.sources || []).some(function (s) { return s && safe(s.url); }); });
    if (lk.length >= 3) ok = lk;
    return ok.map(function (x, i) { return { x: x, i: i, n: (x.sources || []).length }; })
      .sort(function (a, b) { return b.n - a.n || a.i - b.i; }).slice(0, 8).map(function (o) { return o.x; });
  }
  function build(stories, lead) {
    var L = pick(stories), s;
    slides = [];
    N = L.length + 2 + (SHOW_FESTIVAL_GREETING ? 1 : 0);
    if (SHOW_FESTIVAL_GREETING) {
      s = slide("sfestival", slides.length);
      var greeting = el("video", "ed-greeting-video");
      // This is an embedded story slide, not a separate video-player UI.
      greeting.autoplay = true;
      greeting.muted = true;
      greeting.defaultMuted = true;
      greeting.playsInline = true;
      greeting.loop = true;
      greeting.preload = "auto";
      greeting.setAttribute("autoplay", "");
      greeting.setAttribute("muted", "");
      greeting.setAttribute("playsinline", "");
      greeting.setAttribute("webkit-playsinline", "");
      greeting.setAttribute("loop", "");
      greeting.setAttribute("aria-label", "WealthyTrees Dussehra greeting video");
      greeting.poster = "/assets/dussehra-greeting-poster.svg?v=1";
      greeting.setAttribute("poster", "/assets/dussehra-greeting-poster.svg?v=1");
      // Version the media URL so a previously cached, failed/partial MP4 is not reused.
      greeting.src = "/assets/dussehra-greeting.mp4?v=20261017-inline3";
      // Keep the greeting artwork unobstructed: no title banner or bottom hint over the video.
      s.append(greeting);
      slides.push(s);
    }
    s = slide("s0", slides.length);
    s.append(el("span", "pillx", ED[0] + " Edition \u00B7 " + date), el("h3", "big", lead || (L[0] ? L[0].hook || L[0].title : "Today\u2019s stories are still loading.")));
    var ul = el("ol", "toc"); L.slice(0, 5).forEach(function (x) { ul.append(el("li", "", x.hook || x.title)); });
    s.append(el("p", "kk", "In this edition \u00B7 " + L.length + " stories"), ul, el("p", "hint", "Tap or swipe to continue \u2192")); slides.push(s);
    L.forEach(function (x, i) {
      s = slide("s" + (1 + i % 3), slides.length);
      s.append(el("span", "pillx", x.topic || "News"), el("h3", "hk", x.hook || x.title));
      if (x.summary) s.append(el("p", "sum", x.summary));
      if (x.simple) { var ex = el("div", "ex wd"); ex.append(el("b", "", "In simple words"), el("span", "", x.simple)); if (x.term && x.meaning) ex.append(el("small", "", x.term + " \u00B7 " + x.meaning)); s.append(ex); }
      var sb = el("div", "foot"), seen = 0;
      (x.sources || []).forEach(function (sc) { if (sc && safe(sc.url) && seen < 1) { sb.append(link((seen ? sc.name : "Read full story at " + sc.name) + " \u2197", sc.url)); if (!seen) sb.lastChild.className = "go main"; seen++; } });
      if (!seen) sb.append(el("small", "", "Source link not available"));
      s.append(sb); slides.push(s);
    });
    s = slide("s4", N - 1); s.append(el("span", "pillx", "That\u2019s the edition"));
    var w = null; stories.forEach(function (x) { if (!w && x.term && x.meaning) w = [x.term, x.meaning]; }); w = w || GL[doy % GL.length];
    var wd = el("div", "ex wd"); wd.append(el("b", "", "Word of the day"), el("span", "", w[0] + ": " + w[1]));
    var rp = el("button", "exb", "Replay \u21BA"); rp.type = "button"; rp.onclick = function () { go(0); };
    s.append(wd, el("p", "hint", "Next: " + ED[1]), rp); slides.push(s);
  }

  function mount() {
    root = el("div", "ed2"); story = el("div", "story"); story.tabIndex = 0; story.setAttribute("role", "region"); story.setAttribute("aria-roledescription", "carousel"); story.setAttribute("aria-label", "Daily Edition");
    var bw = el("div", "bars"); for (var i = 0; i < N; i++) { var b = el("i"); b.append(el("b")); bw.append(b); bars.push(b.firstChild); }
    var hd = el("div", "shead"), av = el("span", "av"); av.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3ecf8e" stroke-width="2.4" stroke-linecap="round"><path d="M12 21v-9"/><path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7z"/><path d="M12 14c0-3-2-5-5-5 0 3 2 5 5 5z"/></svg>';
    var nm = el("div", "sprout-head");
    nm.append(el("b", "sprout-name", "Sprout"), el("small", "sprout-edition", ED[0] + " Edition"));
    pp = el("button", "pp", ""); pp.type = "button"; pp.setAttribute("aria-label", "Pause or play");
    hd.append(av, nm);
    if (SHOW_FESTIVAL_GREETING) {
      hd.classList.add("is-festival");
      hd.append(el("span", "festival-edition-badge", "SPECIAL FESTIVAL EDITION"));
    }
    hd.append(pp);
    var sw = el("div", "slides"); slides.forEach(function (s) { sw.append(s); });
    var l = el("button", "tz l"), r = el("button", "tz r"); l.type = r.type = "button"; l.setAttribute("aria-label", "Previous slide"); r.setAttribute("aria-label", "Next slide"); l.tabIndex = r.tabIndex = -1;
    story.append(bw, hd, sw, l, r); root.append(story, el("p", "ednote", ED[0] + " Edition \u00B7 3 editions a day (Morning 6 AM, Afternoon 12 PM, Night 6 PM, the last). Education only, not investment advice."));
    panel.innerHTML = ""; panel.append(root); upd();
    l.onclick = function () { if (!nc) go(cur - 1); }; r.onclick = function () { if (!nc) go(cur + 1); }; pp.onclick = function () { playing = !playing; upd(); };
    var sx = null, sy = 0, st = 0, nc = false;
    story.addEventListener("pointerdown", function (e) { if (e.target.closest("a,button:not(.tz)")) { sx = null; return; } sx = e.clientX; sy = e.clientY; st = Date.now(); hold(true); });
    story.addEventListener("pointerup", function (e) {
      hold(false); if (sx == null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy, elapsed = Date.now() - st, longp = elapsed >= 300;
      sx = null;
      if (longp || Math.abs(dx) > 10 || Math.abs(dy) > 10) { nc = true; setTimeout(function () { nc = false; }, 350); }
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        go(cur + (dx < 0 ? 1 : -1));
      } else if (!longp && Math.abs(dx) <= 12 && Math.abs(dy) <= 12 && slides[cur] && slides[cur].querySelector(".ed-greeting-video")) {
        // Tap anywhere on the greeting slide to move directly to the next Story card.
        go(cur + 1);
      }
    });
        story.addEventListener("pointercancel", function () { sx = null; hold(false); });
    document.addEventListener("keydown", function (e) { if (!visible || /INPUT|TEXTAREA/.test(e.target.tagName)) return; if (e.key === "ArrowRight") go(cur + 1); else if (e.key === "ArrowLeft") go(cur - 1); });
    go(0);
  }

  var holdN = 0; function hold(on) { holdN = Math.max(0, holdN + (on ? 1 : -1)); }
  function upd() { if (pp) { pp.textContent = playing ? "\u275A\u275A" : "\u25B6"; pp.setAttribute("aria-pressed", String(!playing)); } }
  function go(n) {
    if (n < 0) n = 0; if (n > N - 1) n = N - 1; cur = n; el_ = 0;
    slides.forEach(function (s, i) { s.classList.toggle("on", i === cur); s.classList.toggle("past", i < cur); if (i === cur) { s.removeAttribute("inert"); s.removeAttribute("aria-hidden"); } else { s.setAttribute("inert", ""); s.setAttribute("aria-hidden", "true"); } });
    bars.forEach(function (b, i) { b.style.width = i < cur ? "100%" : "0%"; });
    slides.forEach(function (node, i) {
      var v = node.querySelector(".ed-greeting-video");
      if (!v) return;
      if (i === cur && visible && !panel.hidden) {
        // Keep the clip embedded and muted. Never expose native media controls.
        v.muted = true;
        v.defaultMuted = true;
        var promise = v.play();
        if (promise && typeof promise.catch === "function") promise.catch(function () {
          // Retry once shortly after the browser's first media-decoding pass.
          window.setTimeout(function () {
            if (i === cur && visible && !panel.hidden) {
              var retry = v.play();
              if (retry && typeof retry.catch === "function") retry.catch(function () {});
            }
          }, 250);
        });
      } else {
        v.pause();
      }
    });
    holdN = 0; slides.forEach(function (s) { s.querySelectorAll(".ex:not(.wd)").forEach(function (x) { x.hidden = true; }); s.querySelectorAll(".exb").forEach(function (b) { if (b.textContent === "Close") b.textContent = "Explain simply"; }); });
  }
  function tick() {
    if (!visible || document.hidden || !playing || holdN > 0 || !slides.length) return;
    el_ += 100; bars[cur].style.width = Math.min(100, el_ / DUR * 100) + "%";
    if (el_ >= DUR) { if (cur < N - 1) go(cur + 1); else playing = false, upd(); }
  }
  function open() {
    visible = true; if (timer == null) timer = setInterval(tick, 100);
    if (loaded) return; loaded = true; panel.append(el("p", "ednote", "Printing today\u2019s edition\u2026"));
    jget("/api/pulse", 10000).catch(function () { try { var c = JSON.parse(localStorage.getItem("wt-pulse") || "null"); if (c && c.j) return c.j; } catch (e) {} return null; })
      .then(function (p) {
        if (p && p.stories && p.stories.length) return p;
        return jget("/data/brief.json?t=" + Date.now(), 6000).then(function (b) { return { stories: (b.items || []).map(function (i) { return { topic: i.category, title: i.title, hook: i.title, summary: i.summary, sources: [{ name: i.source, url: i.url }] }; }) }; }).catch(function () { return { stories: [] }; });
      }).then(function (p) { build(p.stories || [], p.ai ? p.lead : ""); mount(); });
  }
  function close() { visible = false; slides.forEach(function (node) { var v = node.querySelector(".ed-greeting-video"); if (v) v.pause(); }); }
  tabs.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".tab"); if (!b) return;
    if (b === tb) { tabs.querySelectorAll(".tab").forEach(function (x) { x.setAttribute("aria-selected", String(x === tb)); }); document.querySelectorAll('[role="tabpanel"]').forEach(function (p) { p.hidden = p !== panel; }); open(); }
    else { panel.hidden = true; tb.setAttribute("aria-selected", "false"); close(); }
  });
})();
