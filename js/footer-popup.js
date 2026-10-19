/* WealthyTrees footer-popup.js v2 (runs after DOM ready, creates footer if missing): new footer (no logo) + once-per-visit subscribe popup */
(function () {
  function boot() {
  var BD = "arorapriyansh";
  var css = '' +
  'footer.wt-f{display:block!important;visibility:visible!important;background:var(--deep,#0e2a20);color:#b8c8bf;margin-top:2rem;padding:2.6rem 0 1.4rem;font-size:.92rem}' +
  'footer.wt-f a{color:#cfe0d6;text-decoration:none}footer.wt-f a:hover{color:#4fd1a0}' +
  '.wt-fg{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:2rem}' +
  '.wt-fg h4{margin:0 0 .8rem;font:700 1.05rem Fraunces,Georgia,serif;color:#fff}' +
  '.wt-fg li{list-style:none;margin:.45rem 0}.wt-fg ul{margin:0;padding:0}' +
  '.wt-fb{font:700 1.4rem Fraunces,Georgia,serif;color:#fff;margin:0 0 .6rem}' +
  'footer.wt-f a.wt-lg{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .8rem;transition:transform .2s}footer.wt-f a.wt-lg:hover{transform:translateY(-1px)}' +
  '.wt-lg img{width:44px;height:44px}.wt-lg span{font:700 1.65rem Fraunces,Georgia,serif;letter-spacing:-.01em;color:#fff}' +
  '.wt-fn{margin-top:1rem;padding:.9rem 1rem;border-radius:12px;background:rgba(255,255,255,.06);font-size:.86rem;line-height:1.5}' +
  '.wt-fn em{display:block;color:#e0b04f;font-style:italic;margin-bottom:.3rem}' +
  '.wt-fl{border-top:1px solid rgba(255,255,255,.12);margin-top:1.8rem;padding-top:1rem;font-size:.8rem;color:#93a89c}' +
  '.wt-sf{margin-top:2rem;padding-top:1.4rem;border-top:1px solid rgba(255,255,255,.12);display:flex;flex-wrap:wrap;gap:1rem 2rem;align-items:center;justify-content:space-between}' +
  '.wt-sf h4{margin:0 0 .2rem;font:700 1.05rem Fraunces,Georgia,serif;color:#fff}.wt-sf p{margin:0;font-size:.85rem;color:#93a89c}' +
  '.wt-sf form{display:flex;gap:.5rem;flex:1 1 360px;max-width:520px}' +
  '.wt-sf input{flex:1;min-width:0;padding:.8rem 1.1rem;border:0;border-radius:999px;background:#fff;color:#0e1f1a;font:inherit}' +
  '.wt-sf button{padding:.8rem 1.4rem;border:0;border-radius:999px;background:#f5c26b;color:#0e1f1a;font:700 .95rem Inter,sans-serif;cursor:pointer;white-space:nowrap}' +
  '@media(max-width:760px){.wt-fg{grid-template-columns:1fr 1fr}.wt-fg>div:first-child{grid-column:1/-1}}' +
  '#wt-sub{position:fixed;inset:0;z-index:2147482000;background:rgba(5,12,9,.6);display:grid;place-items:center;padding:1rem;animation:wtIn .3s ease}' +
  '#wt-sub .b{position:relative;max-width:440px;width:100%;background:var(--paper);color:var(--ink);border-radius:18px;padding:1.8rem 1.5rem 1.4rem;box-shadow:0 20px 60px rgba(0,0,0,.4);text-align:center}' +
  '#wt-sub h2{margin:.2rem 0 .5rem;font:700 1.5rem Fraunces,Georgia,serif}' +
  '#wt-sub p{margin:0 0 1rem;color:var(--mute);font-size:.95rem}' +
  '#wt-sub input{width:100%;box-sizing:border-box;padding:.8rem 1rem;border:1px solid var(--line);border-radius:999px;background:var(--bg);color:var(--ink);font:inherit;margin-bottom:.6rem}' +
  '#wt-sub button.go{width:100%;padding:.8rem;border:0;border-radius:999px;background:#f5c26b;color:#0e1f1a;font:700 1rem Inter,sans-serif;cursor:pointer}' +
  '#wt-sub .x{position:absolute;top:.6rem;right:.8rem;background:none;border:0;font-size:1.5rem;color:var(--mute);cursor:pointer}' +
  '#wt-sub small{display:block;margin-top:.8rem;color:var(--mute);font-size:.75rem}' +
  '@keyframes wtIn{from{opacity:0}to{opacity:1}}';
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---- Footer ---- */
  var old = document.querySelector("div.nl");
  if (old) { old.style.display = "none"; old.removeAttribute("id"); }
  var f = document.querySelector("footer");
  if (!f && document.body) { f = document.createElement("footer"); document.body.appendChild(f); }
  if (f) {
    f.className = "wt-f";
    f.innerHTML = '<div class="wrap"><div class="wt-fg">' +
      '<div><a class="wt-lg" href="/"><img src="/assets/logo-dark.svg" alt=""><span>WealthyTrees</span></a>Markets, simplified. Daily. Indian stock and commodity news in plain language, plus a learning path that respects your pace.' +
      '<div class="wt-fn"><em>Built by Priyansh</em>A finance student who got tired of market news that needs a dictionary. WealthyTrees is his attempt to fix that: learn the concept, then read the headline.</div></div>' +
      '<div><h4>Explore</h4><ul><li><a href="/">Newsroom</a></li><li><a href="/markets.html">Markets</a></li><li><a href="/learn.html">Learn</a></li><li><a href="/about.html">About</a></li></ul></div>' +
      '<div><h4>Learn</h4><ul><li><a href="/beginner.html">Beginner path</a></li><li><a href="/intermediate.html">Intermediate path</a></li><li><a href="/#nl">Daily brief newsletter</a></li></ul></div>' +
      '<div><h4>WealthyTrees</h4><ul><li><a href="/about.html">About &amp; the founder\u2019s story</a></li><li><a href="mailto:priyansharora@wealthytrees.online">priyansharora@wealthytrees.online</a></li><li><a href="/disclaimer.html">Disclaimer</a></li></ul></div>' +
      '</div><div class="wt-sf" id="nl"><div><h4>Get the daily brief</h4><p>One short, clear email a day. Learning only, no tips.</p></div>' +
      '<form action="https://buttondown.com/api/emails/embed-subscribe/' + encodeURIComponent(BD) + '" method="post" target="popupwindow" onsubmit="window.open(\'https://buttondown.com/' + encodeURIComponent(BD) + '\',\'popupwindow\')"><input type="email" name="email" placeholder="you@example.com" aria-label="Email address" required><button type="submit">Subscribe, free</button></form></div>' +
      '<div class="wt-fl">For education only. Not investment advice. We are not SEBI-registered advisors. \u00a9 ' + new Date().getFullYear() + ' WealthyTrees</div></div>';
  }

  /* ---- Subscribe popup: once per visit (tab session), after the intro ---- */
  if (/404/.test(location.pathname)) return;
  try { if (sessionStorage.getItem("wt-sub-shown") === "1") return; } catch (e) {}
  function show() {
    if (document.getElementById("wt-sub")) return;
    try { sessionStorage.setItem("wt-sub-shown", "1"); } catch (e) {}
    var u = encodeURIComponent(BD), d = document.createElement("div");
    d.id = "wt-sub"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
    d.innerHTML = '<div class="b"><button class="x" aria-label="Close">\u00d7</button><div style="font-size:2rem">\ud83c\udf31</div>' +
      '<h2>Get the daily brief</h2><p>One short, clear email a day: what moved the markets and the concept behind it. Learning only, no tips.</p>' +
      '<form action="https://buttondown.com/api/emails/embed-subscribe/' + u + '" method="post" target="popupwindow">' +
      '<input type="email" name="email" placeholder="Your email" aria-label="Email address" required><button class="go" type="submit">Subscribe, free</button></form>' +
      '<small>Free. Unsubscribe anytime. Education only, not investment advice.</small></div>';
    function close() { d.remove(); document.removeEventListener("keydown", esc); }
    function esc(e) { if (e.key === "Escape") close(); }
    d.addEventListener("click", function (e) { if (e.target === d || e.target.className === "x") close(); });
    d.querySelector("form").addEventListener("submit", function () { window.open("https://buttondown.com/" + u, "popupwindow"); setTimeout(close, 400); });
    document.addEventListener("keydown", esc);
    document.body.appendChild(d);
  }
  function wait() { if (document.getElementById("wt-dussehra-intro")) return setTimeout(wait, 500); setTimeout(show, 1500); }
  setTimeout(wait, 1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
