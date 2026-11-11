/* Ask Sprout — the floating finance friend. One-stop answers for markets, all finance
   and the site's calculators. Small golden bud, bottom-right on every page; tap it and a
   compact chat opens. Answers come from /api/ask (Gemini + live prices + headlines).
   Educational only. Not investment advice. */
(function () {
  "use strict";
  if (document.getElementById("spFloat")) return; // already here
  var BUD = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">'
    + '<path d="M32 62 C30 52 30 44 32 36" stroke="#58a34a" stroke-width="4" fill="none" stroke-linecap="round"/>'
    + '<path d="M32 38 C18 38 8 30 6 14 C18 14 28 24 32 38 Z" fill="#7cc46a"/>'
    + '<path d="M29 34 C24 29 19 23 14 17" stroke="#d9f0b4" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
    + '<path d="M32 38 C46 38 56 30 58 14 C46 14 36 24 32 38 Z" fill="#8fd07a"/>'
    + '<path d="M35 34 C40 29 45 23 50 17" stroke="#e2f4bd" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
    + '</svg>';
  var CHIPS = ["What is Nifty?", "What is a SIP?", "What is EMI?", "How does the SIP calculator work?", "Why did gold move today?"];

  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  /* The bud never blocks the page: a tiny × hides it for the session, and a slim
     "Ask Sprout" tab at the bottom edge brings it back. */
  var hidden = false;
  try { hidden = sessionStorage.getItem("wt-sprout-hidden") === "1"; } catch (e) {}

  var wrap = el("div", "sp-float-wrap");
  var btn = el("button", "sp-float");
  btn.id = "spFloat"; btn.type = "button";
  btn.setAttribute("aria-label", "Ask Sprout");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = BUD;
  var hideBtn = el("button", "sp-hide");
  hideBtn.type = "button"; hideBtn.setAttribute("aria-label", "Hide Sprout"); hideBtn.textContent = "×";
  wrap.append(btn, hideBtn);
  document.body.appendChild(wrap);

  var tab = el("button", "sp-tab");
  tab.id = "spTab"; tab.type = "button";
  tab.innerHTML = '<span class="sp-tab-bud">' + BUD + '</span> Ask Sprout';
  tab.setAttribute("aria-label", "Show Sprout");
  document.body.appendChild(tab);

  function setHidden(h) {
    hidden = h;
    wrap.style.display = h ? "none" : "block";
    tab.style.display = h ? "flex" : "none";
    if (h) toggle(false);
    try { if (h) sessionStorage.setItem("wt-sprout-hidden", "1"); else sessionStorage.removeItem("wt-sprout-hidden"); } catch (e) {}
  }
  hideBtn.onclick = function (e) { e.stopPropagation(); setHidden(true); };
  tab.onclick = function () { setHidden(false); };
  setHidden(hidden);

  var chat = el("div", "sp-chat");
  chat.id = "spChat"; chat.setAttribute("role", "dialog"); chat.setAttribute("aria-label", "Ask Sprout");
  var head = el("div", "sp-head");
  var bud = el("span", "bud"); bud.innerHTML = BUD;
  var tt = el("div");
  tt.append(el("b", "", "Ask Sprout"));
  var sm = el("small", "", "Your finance friend · replies in plain English");
  tt.append(sm);
  var x = el("button", "x"); x.type = "button"; x.setAttribute("aria-label", "Close"); x.textContent = "×";
  head.append(bud, tt, x);
  var msgs = el("div", "sp-msgs"); msgs.id = "spMsgs";
  var chips = el("div", "chips");
  CHIPS.forEach(function (c) {
    var b = el("button", "chip"); b.type = "button"; b.textContent = c;
    b.onclick = function () { ask(c); };
    chips.append(b);
  });
  var form = el("form", "sp-in");
  var inp = el("input"); inp.id = "spInput"; inp.type = "text"; inp.placeholder = "Ask anything about money…"; inp.setAttribute("autocomplete", "off");
  var send = el("button"); send.type = "submit"; send.textContent = "Ask";
  form.append(inp, send);
  var disc = el("div", "sp-disc", "Education only. Not investment advice.");
  chat.append(head, msgs, chips, form, disc);
  document.body.appendChild(chat);

  function addMsg(html, who) {
    var d = el("div", "msg " + who); d.innerHTML = html;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
    return d;
  }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var busy = false;
  function ask(q) {
    if (!q || !q.trim() || busy) return;
    q = q.trim();
    addMsg(esc(q), "user");
    inp.value = "";
    var t = addMsg('<span class="dots3" role="status" aria-label="Sprout is thinking"><i></i><i></i><i></i></span>', "bot");
    busy = true;
    fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ q: q }),
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j.answer) t.innerHTML = j.answer;
      else t.innerHTML = esc(j.error || "Sprout is taking a short break. Try again in a minute.");
    }).catch(function () {
      t.innerHTML = "Sprout is taking a short break right now. Check your connection and try again — the Learn pages and calculators are always there.";
    }).finally(function () { busy = false; msgs.scrollTop = msgs.scrollHeight; inp.focus(); });
  }
  function toggle(open) {
    var on = open !== undefined ? open : !chat.classList.contains("on");
    chat.classList.toggle("on", on);
    btn.setAttribute("aria-expanded", String(on));
    if (on && !msgs.children.length) {
      addMsg("Hi! I'm Sprout — your one-stop finance friend. Ask me anything: markets, saving, tax, insurance, or how any calculator works. I'll explain it in plain English.", "bot");
    }
    if (on) inp.focus();
  }
  btn.onclick = function () { toggle(); };
  x.onclick = function () { toggle(false); };
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(inp.value); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
})();
