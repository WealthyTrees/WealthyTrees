/* Live Wire: Sprout picks the stories that matter and explains each one simply. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ol = $("wire"), note = $("lw-note"), bar = $("lw-cats");
  if (!ol || !bar) return;
  ol.className = "chat";

  var stories = [], topic = "All", seen = {}, firstDraw = true, open = {}, xp = {}, loaded = false;

  /* The card bud + pop-up styles travel with this file, so a stale cached
     homepage can never leave the buds unstyled (an empty gold box). */
  (function () {
    if (document.getElementById("wt-wire-style")) return;
    var st = document.createElement("style"); st.id = "wt-wire-style";
    st.textContent = ".sp-av{flex:none;width:46px;height:46px;border-radius:14px;background:linear-gradient(160deg,#fdf6dd,#f3df9a);border:2px solid #e0b04f;overflow:hidden;display:grid;place-items:center;cursor:pointer;box-shadow:0 2px 10px rgba(224,176,79,.4),0 0 0 3px rgba(224,176,79,.14)}"
      + ".sp-av svg{width:38px;height:38px;animation:spfloat 2.8s ease-in-out infinite}"
      + "@keyframes spfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}"
      + ".sp-av:focus-visible{outline:3px solid var(--up);outline-offset:2px}"
      + "@media(max-width:640px){.sp-av{width:40px;height:40px}.sp-av svg{width:34px;height:34px}}"
      + ".sp-pop{position:fixed;z-index:90;max-width:min(280px,calc(100vw - 32px));background:#fffdf6;border:2px solid #e0b04f;border-radius:16px;box-shadow:0 14px 40px rgba(0,0,0,.25);padding:14px 16px 14px 14px;display:none}"
      + ".sp-pop.on{display:block;animation:sppop .35s cubic-bezier(.2,1.4,.4,1) both}"
      + "@keyframes sppop{from{opacity:0;transform:translateY(8px) scale(.92)}to{opacity:1;transform:none}}"
      + ".sp-pop::before{content:'';position:absolute;top:-7px;left:22px;width:12px;height:12px;background:#fffdf6;border-left:2px solid #e0b04f;border-top:2px solid #e0b04f;transform:rotate(45deg)}"
      + ".sp-pop.above::before{top:auto;bottom:-7px;transform:rotate(225deg)}"
      + ".sp-pop-bud{float:left;width:40px;height:40px;margin-right:10px}"
      + ".sp-pop-bud svg{width:40px;height:40px;animation:spfloat 2.8s ease-in-out infinite}"
      + ".sp-pop p{margin:2px 0 0;font-size:1rem;line-height:1.45;font-weight:600;color:var(--ink)}"
      + ".sp-pop-x{position:absolute;top:6px;right:8px;border:0;background:none;font-size:18px;line-height:1;color:var(--mute);cursor:pointer;padding:4px}";
    document.head.appendChild(st);
  })();

  /* Sprout's face is always the same green two-leaf bud — never another face.
     The bud is a button on each card; tapping it opens the 'Hi! I'm Sprout' pop-up. */
  function face() {
    return '<svg class="sp-bud" viewBox="0 0 64 64" width="38" height="38" aria-hidden="true" focusable="false">'
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
    spPop.innerHTML = '<button type="button" class="sp-pop-x" aria-label="Close">\u00D7</button><span class="sp-pop-bud">' + face() + '</span><p>Hi! I\u2019m Sprout, your personal news reporter.</p>';
    document.body.appendChild(spPop);
    return spPop;
  }
  function hideSproutPop() {
    if (spPopTimer) { clearTimeout(spPopTimer); spPopTimer = null; }
    if (spPop) { spPop.classList.remove("on"); spPop.classList.remove("above"); spPopAnchor = null; }
  }
  function placeSproutPop(anchor) {
    var p = spPop;
    p.classList.remove("above");
    var r = anchor.getBoundingClientRect();
    var pw = p.offsetWidth, ph = p.offsetHeight;
    var left = Math.max(8, Math.min(window.innerWidth - pw - 8, r.left));
    var top = r.bottom + 10;
    if (top + ph > window.innerHeight - 8) { top = Math.max(8, r.top - 10 - ph); p.classList.add("above"); }
    p.style.left = left + "px"; p.style.top = top + "px";
  }
  function showSproutPop(anchor) {
    var p = sproutPopEl();
    if (spPopAnchor === anchor && p.classList.contains("on")) { hideSproutPop(); return; }
    spPopAnchor = anchor;
    p.classList.add("on");
    placeSproutPop(anchor);
    if (spPopTimer) clearTimeout(spPopTimer);
    spPopTimer = setTimeout(hideSproutPop, 6000);
  }
  document.addEventListener("click", function (e) {
    var av = e.target.closest ? e.target.closest(".sp-av") : null;
    if (av) { showSproutPop(av); return; }
    hideSproutPop();
  });
  addEventListener("scroll", function () {
    /* The pop-up stays glued to its card while the card is on screen — so the
       scroll the opening click itself causes (the browser scrolling the bud
       into view) moves the pop-up with the card instead of closing it.
       Once the card scrolls off screen, the pop-up goes away. */
    if (!spPop || !spPop.classList.contains("on") || !spPopAnchor) return;
    var r = spPopAnchor.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) placeSproutPop(spPopAnchor);
    else hideSproutPop();
  }, { passive: true });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideSproutPop();
    if ((e.key === "Enter" || e.key === " ") && e.target && e.target.classList && e.target.classList.contains("sp-av")) {
      e.preventDefault(); showSproutPop(e.target);
    }
  });

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function ago(ms) {
    var m = Math.round((Date.now() - ms) / 60000);
    return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.floor(m / 60) + " h ago" : Math.floor(m / 1440) + " d ago";
  }
  var safe = function (u) { return /^https?:\/\//i.test(u || ""); };

  var intro = el("div", "sp-row sp-intro");
  var im = el("div", "sp-main"), imeta = el("div", "sp-meta"), ib = el("div", "sp-bub"), say = el("p", "sp-say");
  imeta.append(el("b", "", "Sprout"), el("span", "pill live", "\u25CF LIVE"));
  var iav = el("span", "sp-av"); iav.tabIndex = 0; iav.setAttribute("role", "button"); iav.setAttribute("aria-label", "Sprout \u2014 tap to say hello"); iav.innerHTML = face();
  ib.append(say); im.append(imeta, ib); intro.append(iav, im); ol.before(intro);
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
      var li = el("li", "sp-row sp-skel");
      var sav = el("span", "sp-av"); sav.tabIndex = 0; sav.setAttribute("role", "button"); sav.setAttribute("aria-label", "Sprout \u2014 tap to say hello"); sav.innerHTML = face(); li.append(sav);
      var m = el("div", "sp-main"), b = el("div", "sp-bub");
      b.innerHTML = '<span class="sk" style="width:35%"></span><span class="sk" style="width:92%"></span><span class="sk" style="width:78%"></span>';
      if (i === 0) { b.setAttribute("role", "status"); b.append(el("span", "sp-ty", "Sprout is pulling the latest\u2026")); }
      m.append(b); li.append(m); ol.append(li);
    }
  }

  function row(s, idx, fresh) {
    var id = s.id, li = el("li", "sp-row" + (fresh ? " pop" : ""));
    if (fresh) li.style.animationDelay = Math.min(idx, 8) * 60 + "ms";
    var av = el("span", "sp-av"); av.tabIndex = 0; av.setAttribute("role", "button"); av.setAttribute("aria-label", "Sprout \u2014 tap to say hello"); av.innerHTML = face(); li.append(av);
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
          else if (tries >= 1) plain().catch(function () { if (!loaded) { ol.innerHTML = ""; typeOut("Sprout here. The newsroom feed is down for a moment. Try THE 9:15.", true); note.textContent = ""; } });
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
