const BUTTONDOWN = "arorapriyansh";
const nl = document.getElementById("nl");
if (nl) {
  nl.className = "nl";
  nl.innerHTML = `<div class="wrap"><h2>Get the brief by email</h2>
  <p>One short, plain-English market email. No tips, no spam. Unsubscribe any time.</p>
  <form action="https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN}" method="post" target="popupwindow"
   onsubmit="window.open('https://buttondown.com/${BUTTONDOWN}','popupwindow')">
  <input type="email" name="email" required placeholder="you@example.com" aria-label="Email address">
  <input type="hidden" value="1" name="embed"><button class="btn" type="submit">Subscribe</button></form>
  <small>Check your inbox to confirm. It takes 5 seconds. We use your email only to send the brief.</small></div>`;
}
/* Live IST clock with market hours */
(function () {
  var wrap = document.querySelector("header .wrap"); if (!wrap) return;
  var box = document.createElement("div"); box.className = "clockbox";
  box.innerHTML = '<button class="clock" aria-expanded="false" aria-label="Indian time and market hours"><span class="dot"></span><span class="ct">--:--:--</span><span class="cz">IST</span></button>' +
   '<div class="cpop" hidden><h4>Market hours (IST)</h4>' +
   '<div class="row"><b>NSE / BSE stocks</b><span>9:15 AM - 3:30 PM</span></div>' +
   '<div class="row"><b>MCX commodities</b><span>9:00 AM - 11:30 PM</span></div>' +
   '<div class="row"><b>US markets</b><span>7:00 PM - 1:30 AM</span></div>' +
   '<p class="cs" id="cstat"></p>' +
   '<small>Monday to Friday. Closed on weekends and exchange holidays (not tracked here). MCX runs until 11:55 PM while US daylight saving applies. US hours become 8:00 PM - 2:30 AM after US clocks go back (1 Nov 2026). Timings can change, so check the exchange site.</small></div>';
  var btn = box.querySelector(".clock"), pop = box.querySelector(".cpop"), ct = box.querySelector(".ct"), dot = box.querySelector(".dot"), st = box.querySelector("#cstat");
  var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hourCycle: "h23", hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short" });
  function tick() {
    var p = {}; f.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    ct.textContent = p.hour + ":" + p.minute + ":" + p.second;
    var m = +p.hour * 60 + +p.minute, wk = p.weekday !== "Sat" && p.weekday !== "Sun", s = "Closed", c = "closed";
    if (wk && m >= 540 && m < 555) { s = "Pre-open"; c = "pre"; } else if (wk && m >= 555 && m < 930) { s = "Open"; c = "open"; }
    dot.className = "dot " + c; st.textContent = "NSE equities: " + s + (wk ? "" : " (weekend)");
  }
  function show(v) { pop.hidden = !v; btn.setAttribute("aria-expanded", String(v)); }
  btn.onclick = function (e) { e.stopPropagation(); show(pop.hidden); };
  if (matchMedia("(hover:hover)").matches) { box.onmouseenter = function () { show(true); }; box.onmouseleave = function () { show(false); }; }
  document.addEventListener("click", function () { show(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") show(false); });
  wrap.appendChild(box); tick(); setInterval(tick, 1000);
})();
/* Theme switcher */
(function () {
  var root = document.documentElement, wrap = document.querySelector("header .wrap");
  if (!wrap) return;
  var themes = [["light", "Light", "#f6f8f7"], ["dark", "Dark", "#0e1612"], ["sepia", "Paper", "#f3ecdd"]];
  function apply(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("wt-theme", t); } catch (e) {}
    var img = document.querySelector(".logo img");
    if (img) img.src = t === "dark" ? "/logo-dark.svg" : "/logo.svg";
    menu.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.t === t); });
    window.dispatchEvent(new Event("themechange"));
  }
  var box = document.createElement("div"); box.className = "theme";
  box.innerHTML = '<button class="tbtn" aria-label="Change theme" aria-expanded="false"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button><div class="tmenu" hidden></div>';
  var btn = box.querySelector(".tbtn"), menu = box.querySelector(".tmenu");
  themes.forEach(function (t) {
    var b = document.createElement("button");
    b.dataset.t = t[0]; b.innerHTML = '<span class="sw" style="background:' + t[2] + '"></span>' + t[1];
    b.onclick = function () { apply(t[0]); menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    menu.appendChild(b);
  });
  btn.onclick = function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute("aria-expanded", String(!menu.hidden)); };
  document.addEventListener("click", function () { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") menu.hidden = true; });
  wrap.appendChild(box);
  var cur = root.getAttribute("data-theme") || "light";
  menu.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.t === cur); });
  var img = document.querySelector(".logo img"); if (img && cur === "dark") img.src = "/logo-dark.svg";
})();
