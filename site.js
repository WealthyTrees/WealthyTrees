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
