/* WealthyTrees site.js v19: theme bar (under header), IST clock + market status, newsletter box, design + Daily Edition loaders */
(function () {
  "use strict";
  var BD = "arorapriyansh"; /* <- put your Buttondown username between the quotes */
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var wrap = document.querySelector("header .wrap");

  /* ---- Theme bar: a slim row right under the header (not floating) ---- */
  var TH = [["light", "Light", "#fbfaf6"], ["dark", "Dark", "#15211b"], ["sepia", "Paper", "#f3ecdd"]];
  function setTheme(t) { document.documentElement.setAttribute("data-theme", t); try { localStorage.setItem("wt-theme", t); } catch (e) {} }
  function curTheme() { return document.documentElement.getAttribute("data-theme") || "light"; }
  var anchor = document.querySelector(".ticker") || document.querySelector("header");
  if (anchor) {
    var bar = el("div", "themebar"), bw = el("div", "wrap"), grp = el("div", "tseg"); grp.setAttribute("role", "group"); grp.setAttribute("aria-label", "Theme");
    bw.append(el("span", "tlabel", "Theme")); bw.append(grp); bar.append(bw);
    function paint() { grp.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.t === curTheme())); }); }
    TH.forEach(function (t) {
      var b = el("button"); b.type = "button"; b.dataset.t = t[0]; var sw = el("span", "sw"); sw.style.background = t[2]; b.append(sw, document.createTextNode(t[1]));
      b.onclick = function () { setTheme(t[0]); paint(); }; grp.append(b);
    });
    paint(); anchor.after(bar);
  }

  if (wrap) {
  /* ---- IST clock + market status ---- */
    var cw = el("div", "clockbox"), cb = el("button", "clock"); cb.type = "button"; cb.setAttribute("aria-label", "India time and market status");
    var dot = el("span", "dot closed"), ct = el("span", "ct"), cz = el("span", "cz", "IST"); cb.append(dot, ct, cz);
    var cp = el("div", "cpop"); cp.hidden = true; cw.append(cb, cp);
    cb.onclick = function (e) { e.stopPropagation(); cp.hidden = !cp.hidden; };
    document.addEventListener("click", function (e) { if (!cw.contains(e.target)) cp.hidden = true; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cp.hidden = true; });
    var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    function ist() { var p = {}; new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; }); return { d: DAYS.indexOf(p.weekday), h: +p.hour, m: +p.minute, s: p.second }; }
    function hm(h, m) { return h * 60 + m; }
    function fmt12(h, m) { var a = h >= 12 ? "PM" : "AM"; return ((h + 11) % 12 + 1) + ":" + (m < 10 ? "0" : "") + m + " " + a; }
    function tick() {
      var t = ist(), n = hm(t.h, t.m), wk = t.d >= 1 && t.d <= 5, st = "closed", label = "Stocks closed";
      if (wk && n >= hm(9, 0) && n < hm(9, 15)) { st = "pre"; label = "Pre-open session"; }
      else if (wk && n >= hm(9, 15) && n < hm(15, 30)) { st = "open"; label = "Stocks open"; }
      var mcx = wk && n >= hm(9, 0) && n < hm(23, 30);
      ct.textContent = fmt12(t.h, t.m); dot.className = "dot " + st;
      if (!cp.hidden || !cp.firstChild) {
        cp.innerHTML = "";
        var h4 = el("h4", "", "India time \u00B7 " + fmt12(t.h, t.m)); cp.append(h4);
        [["Stocks (NSE/BSE)", "9:15 AM \u2013 3:30 PM"], ["Pre-open", "9:00 AM \u2013 9:15 AM"], ["Commodities (MCX)", "9:00 AM \u2013 11:30 PM"]].forEach(function (r) { var d = el("div", "row"); d.append(el("span", "", r[0]), el("b", "", r[1])); cp.append(d); });
        cp.append(el("p", "cs", label + (mcx ? " \u00B7 Commodities open" : " \u00B7 Commodities closed")), el("small", "", "Monday to Friday, Indian time. Exchange holidays are not included."));
      }
    }
    tick(); setInterval(tick, 1000);
    wrap.append(cw);
  }

  /* ---- Newsletter box (Buttondown). Always shown; the form switches on once a username is set. ---- */
  var nl = document.getElementById("nl");
  if (nl) {
    var on = BD && BD.indexOf("YOUR_") !== 0, u = encodeURIComponent(BD);
    nl.className = "nl";
    nl.innerHTML = '<div class="wrap"><h2>Get the daily brief</h2><p>One short, clear email a day. Learning only, no tips.</p>' +
      (on ? '<form action="https://buttondown.com/api/emails/embed-subscribe/' + u + '" method="post" target="popupwindow" onsubmit="window.open(\'https://buttondown.com/' + u + '\',\'popupwindow\')">' +
        '<input type="email" name="email" placeholder="Your email" aria-label="Email address" required><button class="btn" type="submit">Subscribe</button></form>'
        : '<p><strong>The newsletter opens soon.</strong></p>') +
      '<small>Free. Unsubscribe anytime. Education only, not investment advice.</small></div>';
  }
})();

(function () {
  var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "/css/design.css?v=3"; document.head.appendChild(l);
  var s = document.createElement("script"); s.src = "/js/design.js?v=2"; s.defer = true; document.body.appendChild(s);
})();

(function () {
  if (!document.getElementById("p-live")) return;
  var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "/css/edition.css?v=8"; document.head.appendChild(l);
  var s = document.createElement("script"); s.src = "/js/edition.js?v=8"; s.defer = true; document.body.appendChild(s);
})();


(function () {
  function add(n, cb) { var s = document.createElement("script"); s.src = "/js/" + n + ".js?v=3" + (location.search.indexOf("fest=") > -1 ? "&t=" + Date.now() : ""); s.onload = s.onerror = cb || null; document.body.appendChild(s); }
  add("holidays", function () { add("festival"); });
})();
