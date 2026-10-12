/* Live Wire: Sprout picks the stories that matter and explains each one simply. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ol = $("wire"), note = $("lw-note"), bar = $("lw-cats");
  if (!ol || !bar) return;
  ol.className = "chat";

  var stories = [], topic = "All", seen = {}, firstDraw = true, open = {}, loaded = false;

  function face(m) {
    var mouth = m === "up" ? "M13 25q7 7 14 0" : "M14 26q6 3 12 0";
    return '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><line x1="20" y1="2" x2="20" y2="11" stroke="#e0b04f" stroke-width="1.6"/>' +
      '<rect x="16.5" y="4.5" width="7" height="6" rx="1" fill="#e0b04f"/><circle cx="20" cy="24" r="15" class="sp-body"/>' +
      '<circle cx="14.5" cy="21" r="3.4" fill="#fff"/><circle cx="25.5" cy="21" r="3.4" fill="#fff"/>' +
      '<circle cx="15" cy="21.4" r="1.6" fill="#0e1f1a"/><circle cx="26" cy="21.4" r="1.6" fill="#0e1f1a"/>' +
      '<path d="' + mouth + '" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
  }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function ago(ms) {
    var m = Math.round((Date.now() - ms) / 60000);
    return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.floor(m / 60) + " h ago" : "yesterday";
  }
  var safe = function (u) { return /^https?:\/\//i.test(u || ""); };

  var intro = el("div", "sp-row sp-intro");
  intro.innerHTML = '<span class="sp-av">' + face("up") + "</span>";
  var im = el("div", "sp-main"), ib = el("div", "sp-bub");
  ib.append(el("p", "sp-say", "Hi, I\u2019m Sprout \uD83C\uDF31 I pick the stories that matter for the markets and the economy, then explain each one simply."));
  im.append(ib); intro.append(im);
  ol.before(intro);

  function skeleton() {
    ol.innerHTML = "";
    for (var i = 0; i < 3; i++) {
      var li = el("li", "sp-row sp-skel"); li.innerHTML = '<span class="sp-av">' + face("calm") + "</span>";
      var m = el("div", "sp-main"), b = el("div", "sp-bub");
      b.innerHTML = '<span class="sk" style="width:35%"></span><span class="sk" style="width:92%"></span><span class="sk" style="width:78%"></span>';
      if (i === 0) { b.setAttribute("role", "status"); b.append(el("span", "sp-ty", "Sprout is reading today\u2019s news\u2026")); }
      m.append(b); li.append(m); ol.append(li);
    }
  }

  function row(s, idx, fresh) {
    var id = s.id, li = el("li", "sp-row" + (fresh ? " pop" : ""));
    if (fresh) li.style.animationDelay = Math.min(idx, 8) * 60 + "ms";
    var av = el("span", "sp-av"); av.innerHTML = face("calm"); li.append(av);
    var main = el("div", "sp-main"), meta = el("div", "sp-meta"), tm = el("time", "", ago(s.t)); tm.dataset.t = s.t;
    meta.append(el("b", "", "Sprout"), tm);
    var hot = Date.now() - s.t < 1800000;
    if (hot) meta.append(el("span", "pill new", "NEW"));
    meta.append(el("span", "pill", s.topic || "News"));
    var bub = el("div", "sp-bub" + (hot ? " hot" : ""));
    var q = el("div", "sp-quote"); q.append(el("span", "", (s.sources && s.sources[0] ? s.sources[0].name : "") + (s.sources && s.sources.length > 1 ? " + " + (s.sources.length - 1) + " more" : "")), el("strong", "", s.title)); bub.append(q);
    var hasAI = !!s.summary;
    if (hasAI) {
      bub.append(el("p", "sp-sum", s.summary));
      var sm = el("div", "sp-simple"); sm.append(el("b", "", "In simple words"), el("span", "", s.simple)); bub.append(sm);
      if (s.term && s.meaning) { var tp = el("p", "sp-term"); tp.append(el("b", "", s.term), document.createTextNode(" \u00B7 " + s.meaning)); bub.append(tp); }
    }
    var det = el("div", "sp-links");
    (s.sources || []).forEach(function (src) {
      if (!safe(src.url)) return;
      var a = el("a", "sp-go", "Read at " + src.name + " \u2197"); a.href = src.url; a.target = "_blank"; a.rel = "noopener noreferrer"; det.append(a);
    });
    if (hasAI) {
      det.hidden = !open[id];
      var btn = el("button", "sp-more", open[id] ? "Hide sources \u25B4" : "Sources \u25BE"); btn.type = "button"; btn.setAttribute("aria-expanded", String(!!open[id]));
      btn.onclick = function () { var on = det.hidden; det.hidden = !on; open[id] = on; btn.setAttribute("aria-expanded", String(on)); btn.textContent = on ? "Hide sources \u25B4" : "Sources \u25BE"; };
      bub.append(btn, det);
    } else bub.append(det);
    main.append(meta, bub); li.append(main);
    return li;
  }

  function draw() {
    var topics = ["All"]; stories.forEach(function (s) { var t = s.topic || "News"; if (topics.indexOf(t) < 0) topics.push(t); });
    if (topics.indexOf(topic) < 0) topic = "All";
    bar.hidden = topics.length < 3;
    var sig = topics.join("|");
    if (bar.dataset.sig !== sig) {
      bar.dataset.sig = sig; bar.innerHTML = "";
      topics.forEach(function (c) {
        var b = el("button", "chip", c); b.type = "button"; b.setAttribute("aria-pressed", String(c === topic));
        b.onclick = function () { topic = c; Array.prototype.forEach.call(bar.querySelectorAll("button"), function (y) { y.setAttribute("aria-pressed", String(y === b)); }); draw(); };
        bar.append(b);
      });
    }
    ol.innerHTML = "";
    stories.filter(function (s) { return topic === "All" || (s.topic || "News") === topic; }).forEach(function (s, i) { ol.append(row(s, i, firstDraw || !seen[s.id])); });
    stories.forEach(function (s) { seen[s.id] = 1; });
    firstDraw = false;
  }

  function apply(j) {
    stories = j.stories || []; loaded = true;
    note.textContent = !stories.length ? "No major stories right now. Please check back soon."
      : j.ai ? "Sprout picks stories from established news outlets. Summaries are AI-written from the headlines alone, so they can be wrong. Check the source. For learning only, not investment advice."
             : "Showing key headlines from established news outlets. Each links to the original publisher.";
    draw();
  }
  function plain() {
    return fetch("/api/headlines").then(function (r) { return r.json(); }).then(function (j) {
      apply({ ai: false, stories: (j.items || []).slice(0, 8).map(function (x) { return { id: x.id, t: x.t, title: x.title, topic: x.cat, sources: [{ name: x.source, url: x.url }] }; }) });
    });
  }
  function load() {
    if (document.hidden && loaded) return;
    fetch("/api/pulse").then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { if (!j.stories) throw 0; apply(j); })
      .catch(function () { plain().catch(function () { if (!loaded) { ol.innerHTML = ""; note.textContent = "Live headlines are unavailable right now. See Today\u2019s brief."; } }); });
  }
  function tick() {
    Array.prototype.forEach.call(ol.querySelectorAll("time"), function (t) { t.textContent = ago(+t.dataset.t); });
    Array.prototype.forEach.call(ol.querySelectorAll(".pill.new"), function (p) {
      var t = p.parentNode.querySelector("time"); if (t && Date.now() - +t.dataset.t >= 1800000) p.remove();
    });
  }
  note.textContent = "";
  skeleton(); load();
  setInterval(load, 180000);
  setInterval(function () { if (!document.hidden) tick(); }, 60000);
})();
