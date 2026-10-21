/* WealthyTrees festival.js v1: animated festival greeting, once per day per browser.
   Preview any day: add ?fest=2026-11-08 to a page address (nothing is saved in preview). */
(function () {
  var F = {"2026-01-26": {"n": "Republic Day", "t": "Happy Republic Day", "m": "joy", "e": ["🇮🇳", "🧡", "🤍", "💚"]}, "2026-02-15": {"n": "Mahashivratri", "t": "Happy Mahashivratri", "m": "calm", "e": ["🔱", "🕉️", "✨"]}, "2026-03-03": {"n": "Holi", "t": "Happy Holi", "m": "joy", "e": ["🎨", "💧", "🌈", "💜", "💛"]}, "2026-03-19": {"n": "Gudi Padwa", "t": "Happy Gudi Padwa", "m": "joy", "e": ["🚩", "🌸", "✨"]}, "2026-03-21": {"n": "Id-Ul-Fitr", "t": "Eid Mubarak", "m": "joy", "e": ["🌙", "⭐", "✨"]}, "2026-03-26": {"n": "Ram Navami", "t": "Happy Ram Navami", "m": "calm", "e": ["🏹", "🪔", "🌼"]}, "2026-03-31": {"n": "Mahavir Jayanti", "t": "Happy Mahavir Jayanti", "m": "calm", "e": ["🕊️", "🌼", "✨"]}, "2026-04-03": {"n": "Good Friday", "t": "Wishing you a peaceful Good Friday", "m": "calm", "e": ["🕊️", "✨"]}, "2026-04-14": {"n": "Ambedkar Jayanti", "t": "Remembering Dr. Ambedkar today", "m": "calm", "e": ["📘", "✨", "🌟"]}, "2026-05-01": {"n": "Maharashtra Day", "t": "Happy Maharashtra Day", "m": "joy", "e": ["🚩", "🌟", "✨"]}, "2026-05-28": {"n": "Bakri Id", "t": "Eid Mubarak", "m": "joy", "e": ["🌙", "⭐", "✨"]}, "2026-06-26": {"n": "Muharram", "t": "Wishing you a day of peace", "m": "calm", "e": ["🕊️", "✨"]}, "2026-08-15": {"n": "Independence Day", "t": "Happy Independence Day", "m": "joy", "e": ["🇮🇳", "🧡", "🤍", "💚"]}, "2026-09-14": {"n": "Ganesh Chaturthi", "t": "Ganpati Bappa Morya! Happy Ganesh Chaturthi", "m": "joy", "e": ["🪷", "🌼", "🙏", "✨"]}, "2026-10-02": {"n": "Gandhi Jayanti", "t": "Remembering Mahatma Gandhi today", "m": "calm", "e": ["🕊️", "✨", "🌿"]}, "2026-10-20": {"n": "Dussehra", "t": "Happy Dussehra", "m": "joy", "e": ["🏹", "🔥", "✨", "🌼"]}, "2026-11-08": {"n": "Diwali", "t": "Happy Diwali! Shubh Deepavali", "m": "joy", "e": ["🪔", "✨", "🎆", "🪙", "₹"]}, "2026-11-10": {"n": "Diwali", "t": "Happy Diwali and Govardhan Puja", "m": "joy", "e": ["🪔", "✨", "🎆", "🪙"]}, "2026-11-24": {"n": "Guru Nanak Jayanti", "t": "Happy Gurpurb! Wishing you peace and light", "m": "calm", "e": ["🙏", "✨", "🌼"]}, "2026-12-25": {"n": "Christmas", "t": "Merry Christmas", "m": "joy", "e": ["🎄", "⭐", "❄️", "🎁"]}};
  var rm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var q = new URLSearchParams(location.search).get("fest"), key = q || (window.WT_HOL ? WT_HOL.ist() : new Date().toISOString().slice(0, 10)), f = F[key];
  if (!f) return;
  try { if (!q && localStorage.getItem("wt-fest") === key) return; if (!q) localStorage.setItem("wt-fest", key); } catch (e) {}
  var h = window.WT_HOL, tr = h && h.trading[key], mu = key === "2026-11-08";
  var note = mu ? "Muhurat trading session today. Timings are announced by NSE." : tr ? "Indian stock markets are closed today." : "";
  if (key === "2026-10-20" && !rm && document.getElementById("p-live")) return; /* home already has intro, ticker and festival edition */
  if (key === "2026-10-20" && !rm) {
    var ds = document.createElement("script"); ds.src = "/js/dussehra.js?v=3" + (q ? "&t=" + Date.now() : "");
    ds.onload = function () { var n = 0, w = setInterval(function () { if (!document.getElementById("wt-dussehra-intro") || ++n > 60) { clearInterval(w); window.WT_DUSSEHRA(note); } }, 500); }; document.body.appendChild(ds); return;
  }
  var st = document.createElement("style");
  st.textContent = ".wt-fest{position:fixed;top:12px;left:50%;z-index:99990;width:min(92vw,460px);transform:translate(-50%,-140%);transition:transform .7s cubic-bezier(.2,1.3,.4,1),opacity .5s;padding:.9rem 2.4rem .9rem 1rem;border-radius:16px;text-align:center;background:var(--paper,#fff);color:var(--ink,#16231d);border:2px solid var(--gold,#e0a82e);box-shadow:0 14px 40px rgba(0,0,0,.25),0 0 28px color-mix(in srgb,var(--gold,#e0a82e) 40%,transparent)}"
    + ".wt-fest.on{transform:translate(-50%,0)}.wt-fest.off{opacity:0;transform:translate(-50%,-30px)}.wt-fest h3{margin:0;font:700 clamp(1.5rem,5vw,2rem) Caveat,'Segoe Print',cursive}.wt-fest p{margin:.25rem 0 0;font:600 .88rem Inter,system-ui,sans-serif;color:var(--mute,#5a6b62)}"
    + ".wt-fest .big{font-size:2rem;display:block;animation:wtf-pop 1.2s ease-in-out infinite}.wt-fest button{position:absolute;top:6px;right:8px;border:0;background:none;font-size:1.4rem;line-height:1;cursor:pointer;color:var(--mute,#5a6b62)}"
    + ".wt-rain{position:fixed;inset:0;pointer-events:none;z-index:99989;overflow:hidden}.wt-rain span{position:absolute;top:-8%;animation:wtf-fall linear forwards}"
    + "@keyframes wtf-fall{to{transform:translateY(115vh) rotate(360deg);opacity:.9}}@keyframes wtf-pop{50%{transform:scale(1.2) rotate(-6deg)}}@media(prefers-reduced-motion:reduce){.wt-fest .big{animation:none}}";
  document.head.appendChild(st);
  var b = document.createElement("div"); b.className = "wt-fest"; b.setAttribute("role", "status");
  b.innerHTML = '<span class="big">' + f.e[0] + '</span><h3></h3>' + (note ? "<p></p>" : "") + '<button type="button" aria-label="Close">\u00D7</button>';
  b.querySelector("h3").textContent = f.t; if (note) b.querySelector("p").textContent = note;
  document.body.appendChild(b);
  var rain = null;
  if (!rm && f.m === "joy") {
    rain = document.createElement("div"); rain.className = "wt-rain";
    for (var i = 0; i < 34; i++) { var s = document.createElement("span"); s.textContent = f.e[i % f.e.length]; s.style.cssText = "left:" + Math.random() * 100 + "%;font-size:" + (18 + Math.random() * 20) + "px;animation-duration:" + (4 + Math.random() * 4) + "s;animation-delay:" + Math.random() * 2.5 + "s"; rain.appendChild(s); }
    document.body.appendChild(rain); setTimeout(function () { rain && rain.remove(); }, 9500);
  } else if (!rm) { rain = document.createElement("div"); rain.className = "wt-rain"; for (var j = 0; j < 12; j++) { var d = document.createElement("span"); d.textContent = f.e[j % f.e.length]; d.style.cssText = "left:" + Math.random() * 100 + "%;font-size:" + (16 + Math.random() * 10) + "px;opacity:.7;animation-duration:" + (8 + Math.random() * 4) + "s;animation-delay:" + Math.random() * 3 + "s"; rain.appendChild(d); } document.body.appendChild(rain); setTimeout(function () { rain && rain.remove(); }, 13000); }
  requestAnimationFrame(function () { requestAnimationFrame(function () { b.classList.add("on"); }); });
  function close() { b.classList.add("off"); setTimeout(function () { b.remove(); }, 600); }
  b.querySelector("button").onclick = close; setTimeout(close, 9000);
})();
