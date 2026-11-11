/* Live Wire: Sprout picks the stories that matter and explains each one simply. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ol = $("wire"), note = $("lw-note"), bar = $("lw-cats");
  if (!ol || !bar) return;
  ol.className = "chat";

  var stories = [], topic = "All", seen = {}, firstDraw = true, open = {}, xp = {}, loaded = false;

  // v21 Reporter Sprout: press cap, mic, eyes that blink and follow the cursor, mood mouth, and a badge for the topic.
  function moodOf(s) {
    var t = ((s.hook || "") + " " + (s.title || "")).toLowerCase();
    var dn = /\b(fall|falls|fell|drop|drops|dropped|slump|slumps|crash|plunge|plunges|tumble|tumbles|slide|slides|sink|sinks|declin\w*|weak\w*|loss|losses|worr\w*|fear\w*|slip|slips|dip|dips|curbs?)\b/.test(t);
    var up = /\b(rise|rises|rose|surge|surges|jump|jumps|gain|gains|rally|rallies|climb|climbs|record|soar|soars|lift|lifts|strong\w*|boost\w*|higher|up)\b/.test(t);
    return up && !dn ? "up" : dn && !up ? "down" : "calm";
  }
  function badge(topic) {
    var c = '<circle class="sp-bd" cx="39" cy="40" r="7.2"/>', g;
    if (topic === "live") g = '<circle class="sp-live" cx="39" cy="40" r="3"/>';
    else if (topic === "Markets") g = '<rect class="sp-bar" x="35.4" y="41.6" width="2" height="3"/><rect class="sp-bar" x="38" y="39.4" width="2" height="5.2"/><rect class="sp-bar" x="40.6" y="36.8" width="2" height="7.8"/>';
    else if (topic === "Commodities") g = '<path d="M39 34.6Q43.2 38.6 41.5 42Q40.6 44.8 39 44.8Q36 44.8 36.5 41.6Q37 40.2 38 39.2Q38 37 39 34.6Z" fill="#e8641e"/><path d="M39 40.6Q40.6 42 39.8 43.6Q39 44.4 38.3 43.6Q37.6 42.4 39 40.6Z" fill="#ffd45e"/>';
    else if (topic === "Global") g = '<circle class="sp-ic" cx="39" cy="40" r="3.6"/><ellipse class="sp-ic" cx="39" cy="40" rx="1.5" ry="3.6"/><path class="sp-ic" d="M35.4 40H42.6"/>';
    else if (topic === "Policy") g = '<path class="sp-ic" d="M35.6 38.2L39 35.8L42.4 38.2Z"/><path class="sp-ic" d="M36.6 39.8V43.2M39 39.8V43.2M41.4 39.8V43.2M35.6 44.4H42.4"/>';
    else if (topic === "Economy") g = '<text x="39" y="43.2" text-anchor="middle" font-size="9" font-weight="700" fill="#a8741a" font-family="Inter,system-ui,sans-serif">&#8377;</text>';
    else if (topic) g = '<rect class="sp-ic" x="35.6" y="36.6" width="6.8" height="7.2" rx="1"/><path class="sp-ic" d="M37.2 39.2H40.8M37.2 41.2H40.8"/>';
    else return "";
    return '<g class="sp-badge">' + c + g + '</g>';
  }
  function face(m, topic) {
    /* Sprout's face is always the same green two-leaf bud — never another face. */
    return '<svg class="sp-bud" viewBox="0 0 64 64" aria-hidden="true" focusable="false">'
      + '<path d="M32 62 C30 52 30 44 32 36" stroke="#58a34a" stroke-width="4" fill="none" stroke-linecap="round"/>'
      + '<path d="M32 38 C18 38 8 30 6 14 C18 14 28 24 32 38 Z" fill="#7cc46a"/>'
      + '<path d="M29 34 C24 29 19 23 14 17" stroke="#d9f0b4" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
      + '<path d="M32 38 C46 38 56 30 58 14 C46 14 36 24 32 38 Z" fill="#8fd07a"/>'
      + '<path d="M35 34 C40 29 45 23 50 17" stroke="#e2f4bd" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
      + '</svg>';
  }
  /* Sprout says hello: tap the golden bud for a small playful pop-up.
     It disappears by itself: after 6 seconds, on scroll, or on any tap that is not the bud. */
  var spPop = null, spPopAnchor = null, spPopTimer = null;
  function sproutPopEl() {
    if (spPop) return spPop;
    spPop = document.createElement("div");
    spPop.className = "sp-pop";
    spPop.setAttribute("role", "dialog");
    spPop.setAttribute("aria-label", "Sprout says hello");
    spPop.innerHTML = '<button type="button" class="sp-pop-x" aria-label="Close">\u00D7</button><span class="sp-pop-bud">' + face("calm", "") + '</span><p>Hi! I\u2019m Sprout, your personal news reporter.</p>';
    document.body.appendChild(spPop);
    return spPop;
  }
  function hideSproutPop() {
    if (spPopTimer) { clearTimeout(spPopTimer); spPopTimer = null; }
    if (spPop) { spPop.classList.remove("on"); spPop.classList.remove("above"); spPopAnchor = null; }
  }
  function showSproutPop(anchor) {
    var p = sproutPopEl();
    if (spPopAnchor === anchor && p.classList.contains("on")) { hideSproutPop(); return; }
    spPopAnchor = anchor;
    p.classList.add("on"); p.classList.remove("above");
    var r = anchor.getBoundingClientRect();
    var pw = p.offsetWidth, ph = p.offsetHeight;
    var left = Math.max(8, Math.min(window.innerWidth - pw - 8, r.left));
    var top = r.bottom + 10;
    if (top + ph > window.innerHeight - 8) { top = Math.max(8, r.top - 10 - ph); p.classList.add("above"); }
    p.style.left = left + "px"; p.style.top = top + "px";
    if (spPopTimer) clearTimeout(spPopTimer);
    spPopTimer = setTimeout(hideSproutPop, 6000);
  }
  document.addEventListener("click", function (e) {
    var av = e.target.closest ? e.target.closest(".sp-av") : null;
    if (av) { showSproutPop(av); return; }
    hideSproutPop();
  });
  addEventListener("scroll", function () { if (spPop && spPop.classList.contains("on")) hideSproutPop(); }, { passive: true });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideSproutPop();
    if ((e.key === "Enter" || e.key === " ") && e.target && e.target.classList && e.target.classList.contains("sp-av")) {
      e.preventDefault(); showSproutPop(e.target);
    }
  });
  // eyes follow the cursor (only on devices with a mouse)
  (function () {
    if (!window.matchMedia || !matchMedia("(hover:hover)").matches) return;
    var raf = 0, mx = 0, my = 0, de = document.documentElement;
    addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        de.style.setProperty("--ex", ((mx / innerWidth) * 2 - 1).toFixed(2));
        de.style.setProperty("--ey", ((my / innerHeight) * 2 - 1).toFixed(2));
      });
    }, { passive: true });
  })();
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function ago(ms) {
    var m = Math.round((Date.now() - ms) / 60000);
    return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.floor(m / 60) + " h ago" : "yesterday";
  }
  var safe = function (u) { return /^https?:\/\//i.test(u || ""); };

  var intro = el("div", "sp-row sp-intro");
  intro.innerHTML = '<span class="sp-av" tabindex="0" role="button" aria-label="Sprout — tap to say hello">' + face("up", "live") + "</span>";
  var im = el("div", "sp-main"), imeta = el("div", "sp-meta"), ib = el("div", "sp-bub"), say = el("p", "sp-say");
  imeta.append(el("b", "", "Sprout"), el("span", "pill live", "\u25CF LIVE"));
  ib.append(say); im.append(imeta, ib); intro.append(im); ol.before(intro);
  var typed = "", born = Date.now();
  function dots() { say.innerHTML = '<span class="dots3" role="status" aria-label="Sprout is typing"><i></i><i></i><i></i></span>'; }
  function typeOut(text, instant) {
    if (typed === text) return; typed = text;
    if (instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { say.textContent = text; return; }
    say.textContent = ""; var i = 0, step = Math.max(12, Math.min(28, 1500 / text.length));
    (function nx() { say.textContent = text.slice(0, ++i); if (i < text.length && typed === text) setTimeout(nx, step); })();
  }
  function introSay(lead, instant) {
    var fest = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date()) === "2026-10-20";
    if (fest && !document.getElementById("wt-fest-font")) { var fl = document.createElement("link"); fl.id = "wt-fest-font"; fl.rel = "stylesheet"; fl.href = "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap"; document.head.appendChild(fl); if (say) say.style.fontFamily = "Kalam,'Segoe Print',cursive"; }
    var text = fest ? "Hello, I am Sprout, live from the newsroom. Happy Dussehra to all my readers! Markets rest today, so enjoy the festival." : "Sprout here, live from the newsroom. " + (lead || "Here\u2019s what\u2019s moving the markets and why it matters.");
    if (instant) typeOut(text, true); else setTimeout(function () { typeOut(text); }, Math.max(0, 900 - (Date.now() - born)));
  }
  dots();

  function skeleton() {
    ol.innerHTML = "";
    for (var i = 0; i < 3; i++) {
      var li = el("li", "sp-row sp-skel"); li.innerHTML = '<span class="sp-av" tabindex="0" role="button" aria-label="Sprout — tap to say hello">' + face("calm", "") + "</span>";
      var m = el("div", "sp-main"), b = el("div", "sp-bub");
      b.innerHTML = '<span class="sk" style="width:35%"></span><span class="sk" style="width:92%"></span><span class="sk" style="width:78%"></span>';
      if (i === 0) { b.setAttribute("role", "status"); b.append(el("span", "sp-ty", "Sprout is pulling the latest\u2026")); }
      m.append(b); li.append(m); ol.append(li);
    }
  }

  function row(s, idx, fresh) {
    var id = s.id, li = el("li", "sp-row" + (fresh ? " pop" : ""));
    if (fresh) li.style.animationDelay = Math.min(idx, 8) * 60 + "ms";
    var av = el("span", "sp-av"); av.tabIndex = 0; av.setAttribute("role", "button"); av.setAttribute("aria-label", "Sprout — tap to say hello"); av.innerHTML = face(moodOf(s), s.topic || "News"); li.append(av);
    var main = el("div", "sp-main"), meta = el("div", "sp-meta"), tm = el("time", "", ago(s.t)); tm.dataset.t = s.t;
    meta.append(el("b", "", "Sprout"), tm);
    var hot = Date.now() - s.t < 1800000;
    if (hot) meta.append(el("span", "pill new", "NEW"));
    meta.append(el("span", "pill", s.topic || "News"));
    var bub = el("div", "sp-bub" + (hot ? " hot" : ""));
    var hasAI = !!s.summary, srcs = s.sources || [];
    var q = el("div", "sp-quote");
    q.append(el("span", "", (srcs[0] ? srcs[0].name : "") + (srcs.length > 1 ? " + " + (srcs.length - 1) + " more" : "")), el("strong", "", s.hook || s.title));
    bub.append(q);
    if (hasAI) bub.append(el("p", "sp-sum", s.summary));
    var det = el("div", "sp-links"); det.hidden = hasAI && !open[id];
    if (hasAI && s.hook) det.append(el("p", "sp-orig", s.title));
    srcs.forEach(function (src) {
      if (!safe(src.url)) return;
      var a = el("a", "sp-go", "Read at " + src.name + " \u2197"); a.href = src.url; a.target = "_blank"; a.rel = "noopener noreferrer"; det.append(a);
    });
    if (hasAI) {
      var acts = el("div", "sp-acts");
      var sm = el("div", "sp-simple"); sm.hidden = !xp[id];
      sm.append(el("b", "", "Explain simply"), el("span", "", s.simple));
      if (s.term && s.meaning) { var tp = el("p", "sp-term"); tp.append(el("b", "", s.term), document.createTextNode(" \u00B7 " + s.meaning)); sm.append(tp); }
      var b1 = el("button", "sp-more", xp[id] ? "Hide \u25B4" : "Explain simply \u25BE"); b1.type = "button"; b1.setAttribute("aria-expanded", String(!!xp[id]));
      b1.onclick = function () { var on = sm.hidden; sm.hidden = !on; xp[id] = on; b1.setAttribute("aria-expanded", String(on)); b1.textContent = on ? "Hide \u25B4" : "Explain simply \u25BE"; };
      var b2 = el("button", "sp-more", open[id] ? "Hide sources \u25B4" : "Sources \u25BE"); b2.type = "button"; b2.setAttribute("aria-expanded", String(!!open[id]));
      b2.onclick = function () { var on = det.hidden; det.hidden = !on; open[id] = on; b2.setAttribute("aria-expanded", String(on)); b2.textContent = on ? "Hide sources \u25B4" : "Sources \u25BE"; };
      acts.append(b1, b2); bub.append(acts, sm, det);
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

  function newest(a) { return Math.max.apply(null, a.map(function (x) { return +x.t || 0; })); }
  function quiet(a) { return a.length && Date.now() - newest(a) > 1800000; }
  function apply(j, instant) {
    stories = j.stories || []; loaded = true;
    note.textContent = !stories.length ? "No major stories right now. Please check back soon."
      : j.ai ? (quiet(stories) ? "No new major stories since " + ago(newest(stories)) + ". Sprout is still watching. " : "") + (j.at ? "Sprout last checked the news " + ago(j.at) + ". " : "") + "Sprout writes these from headlines only, so double-check the source. Learning only, not investment advice."
             : "Key headlines from established outlets. Each links to the original publisher.";
    introSay(j.ai ? j.lead : "", instant);
    draw();
  }
  function plain() {
    return fetch("/api/headlines").then(function (r) { return r.json(); }).then(function (j) {
      apply({ ai: false, stories: (j.items || []).slice(0, 8).map(function (x) { return { id: x.id, t: x.t, title: x.title, topic: x.cat, sources: [{ name: x.source, url: x.url }] }; }) });
    });
  }
  var tries = 0;
  function load() {
    if (document.hidden && loaded) return;
    fetch("/api/pulse").then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        if (!j.stories) throw 0;
        tries = 0;
        if (j.ai) { try { localStorage.setItem("wt-pulse", JSON.stringify({ at: Date.now(), j: j })); } catch (e) {} }
        apply(j, loaded && !!stories.length && JSON.stringify(j.lead || "") === lastLead);
        lastLead = JSON.stringify(j.lead || "");
      })
      .catch(function () {
        // v20: never replace a good Sprout list with the plain one. Keep what is on screen, else use the last saved AI list (up to 24h), else the plain list. Then try again soon.
        var c = null; try { c = JSON.parse(localStorage.getItem("wt-pulse") || "null"); } catch (e) {}
        if (!(loaded && stories.length && stories[0].summary)) {
          if (c && c.j && c.j.stories && c.j.stories.length && Date.now() - c.at < 24 * 3600e3) apply(c.j, true);
          else if (tries >= 1) plain().catch(function () { if (!loaded) { ol.innerHTML = ""; typeOut("Sprout here. The newsroom feed is down for a moment. Try Today\u2019s brief.", true); note.textContent = ""; } });
        }
        if (tries++ < 3) setTimeout(load, 4000 * tries);
      });
  }
  function tick() {
    Array.prototype.forEach.call(ol.querySelectorAll("time"), function (t) { t.textContent = ago(+t.dataset.t); });
    Array.prototype.forEach.call(ol.querySelectorAll(".pill.new"), function (p) {
      var t = p.parentNode.querySelector("time"); if (t && Date.now() - +t.dataset.t >= 1800000) p.remove();
    });
  }
  var lastLead = "";
  note.textContent = "";
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem("wt-pulse") || "null"); } catch (e) {}
  if (cached && cached.j && cached.j.stories && Date.now() - cached.at < 6 * 3600e3) { apply(cached.j, true); lastLead = JSON.stringify(cached.j.lead || ""); }
  else skeleton();
  load();
  setInterval(load, 180000);
  setInterval(function () { if (!document.hidden) tick(); }, 60000);
})();
