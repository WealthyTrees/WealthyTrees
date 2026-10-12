/* Live Wire: Sprout the mascot reacts to fresh headlines in chat bubbles. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ol = $("wire"), note = $("lw-note"), bar = $("lw-cats");
  if (!ol || !bar) return;
  ol.className = "chat";

  var items = [], cat = "All", seen = {}, firstDraw = true, open = {}, polls = 0, quick = 0;

  /* Sprout's face changes with the headline's mood */
  function face(m) {
    var mouth = { up: "M13 25q7 7 14 0", down: "M13 29q7-7 14 0", mixed: "M14 27h12", calm: "M14 26q6 3 12 0" }[m] || "M14 26q6 3 12 0";
    var candle = m === "down" ? "#d64b3a" : "#e0b04f";
    return '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><line x1="20" y1="2" x2="20" y2="11" stroke="' + candle + '" stroke-width="1.6"/>' +
      '<rect x="16.5" y="4.5" width="7" height="6" rx="1" fill="' + candle + '"/><circle cx="20" cy="24" r="15" class="sp-body"/>' +
      '<circle cx="14.5" cy="21" r="3.4" fill="#fff"/><circle cx="25.5" cy="21" r="3.4" fill="#fff"/>' +
      '<circle cx="15" cy="21.4" r="1.6" fill="#0e1f1a"/><circle cx="26" cy="21.4" r="1.6" fill="#0e1f1a"/>' +
      '<path d="' + mouth + '" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
  }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function ago(ms) {
    var m = Math.round((Date.now() - ms) / 60000);
    return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.floor(m / 60) + " h ago" : "yesterday";
  }

  var intro = el("div", "sp-row sp-intro");
  intro.innerHTML = '<span class="sp-av">' + face("up") + '</span>';
  var im = el("div", "sp-main"), ib = el("div", "sp-bub");
  ib.append(el("p", "sp-say", "yo, I\u2019m Sprout \uD83C\uDF31 I read the headlines so you don\u2019t have to doomscroll 47 tabs. Tap \u201CBreak it down\u201D on any bubble for the plain-English version."));
  im.append(ib); intro.append(im);
  ol.before(intro);

  function row(x, idx, fresh) {
    var ai = x.ai, id = x.id || x.url;
    var li = el("li", "sp-row" + (fresh ? " pop" : ""));
    if (fresh) li.style.animationDelay = Math.min(idx, 8) * 60 + "ms";
    var av = el("span", "sp-av"); av.innerHTML = face(ai ? ai.mood : "calm"); li.append(av);
    var main = el("div", "sp-main");
    var meta = el("div", "sp-meta"), who = el("b", "", "Sprout"), tm = el("time", "", ago(x.t)); tm.dataset.t = x.t;
    meta.append(who, tm);
    if (Date.now() - x.t < 1800000) meta.append(el("span", "pill new", "NEW"));
    meta.append(el("span", "pill", x.cat));
    var bub = el("div", "sp-bub" + (Date.now() - x.t < 1800000 ? " hot" : ""));
    var q = el("div", "sp-quote"); q.append(el("span", "", x.source), el("strong", "", x.title)); bub.append(q);
    if (ai) bub.append(el("p", "sp-say", ai.say));
    var det = el("div", "sp-detail");
    if (ai) {
      var p1 = el("p", "sp-plain"); p1.append(el("b", "", "In plain English: "), document.createTextNode(ai.plain)); det.append(p1);
      if (ai.term && ai.meaning) { var p2 = el("p", "sp-term"); p2.append(el("b", "", ai.term), document.createTextNode(" \u00B7 " + ai.meaning)); det.append(p2); }
    }
    var go = el("a", "sp-go", "Read the full story at " + x.source + " \u2197");
    go.href = x.url; go.target = "_blank"; go.rel = "noopener noreferrer"; det.append(go);
    det.hidden = !open[id];
    var btn = el("button", "sp-more", open[id] ? "Hide \u25B4" : (ai ? "Break it down \u25BE" : "Open \u25BE"));
    btn.type = "button"; btn.setAttribute("aria-expanded", String(!!open[id]));
    btn.onclick = function () {
      var on = det.hidden; det.hidden = !on; open[id] = on; btn.setAttribute("aria-expanded", String(on));
      btn.textContent = on ? "Hide \u25B4" : (ai ? "Break it down \u25BE" : "Open \u25BE");
    };
    bub.append(btn, det);
    main.append(meta, bub); li.append(main);
    return li;
  }

  function typingRow() {
    var li = el("li", "sp-row sp-typing"); li.innerHTML = '<span class="sp-av">' + face("mixed") + '</span>';
    var m = el("div", "sp-main"), b = el("div", "sp-bub"); b.setAttribute("role", "status");
    b.innerHTML = '<span class="dots3" aria-hidden="true"><i></i><i></i><i></i></span>';
    b.append(el("span", "sp-ty", " Sprout is cooking up takes\u2026")); m.append(b); li.append(m); return li;
  }

  var pendingNow = false;
  function draw() {
    var cats = ["All"]; items.forEach(function (x) { if (cats.indexOf(x.cat) < 0) cats.push(x.cat); });
    if (bar.children.length !== cats.length) {
      bar.innerHTML = "";
      cats.forEach(function (c) {
        var b = el("button", "chip", c); b.type = "button"; b.setAttribute("aria-pressed", String(c === cat));
        b.onclick = function () { cat = c; Array.prototype.forEach.call(bar.querySelectorAll("button"), function (y) { y.setAttribute("aria-pressed", String(y === b)); }); draw(); };
        bar.append(b);
      });
    }
    ol.innerHTML = "";
    if (pendingNow) ol.append(typingRow());
    items.filter(function (x) { return cat === "All" || x.cat === cat; }).slice(0, 25).forEach(function (x, i) {
      var id = x.id || x.url;
      ol.append(row(x, i, firstDraw || !seen[id]));
    });
    items.forEach(function (x) { seen[x.id || x.url] = 1; });
    firstDraw = false;
  }

  function tick() {
    Array.prototype.forEach.call(ol.querySelectorAll("time"), function (t) { t.textContent = ago(+t.dataset.t); });
    Array.prototype.forEach.call(ol.querySelectorAll(".pill.new"), function (p) {
      var t = p.parentNode.querySelector("time"); if (t && Date.now() - +t.dataset.t >= 1800000) p.remove();
    });
  }

  var retry = 0;
  function apply(j) {
    items = j.items || [];
    pendingNow = !!j.pending;
    note.textContent = items.length
      ? (j.ai ? "Sprout\u2019s takes are AI-written from the headline alone, so they can be wrong. Check the source. Fun and learning only, not investment advice."
              : "Auto-updates every few minutes. Headlines link to the original publishers.")
      : "No headlines right now. Please check back soon.";
    draw();
    clearTimeout(retry);
    if (j.pending && quick < 6) { quick++; retry = setTimeout(load, 45000); } else if (!j.pending) quick = 0;
  }
  function plain() {
    return fetch("/api/headlines").then(function (r) { return r.json(); }).then(apply);
  }
  function load() {
    if (document.hidden) return;
    fetch("/api/pulse").then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { if (!j.items) throw 0; apply(j); })
      .catch(function () { plain().catch(function () { note.textContent = "Live headlines are unavailable right now. See Today\u2019s brief."; }); });
  }
  load();
  setInterval(load, 180000);
  setInterval(function () { if (!document.hidden) tick(); }, 60000);
})();
