/* WealthyTrees closed-market promotional rail.
   Shows wide brand/page cards on Indian weekends and NSE trading holidays.
   Preview any time with ?previewMarketPromo=1. */
(() => {
  "use strict";
  const params = new URLSearchParams(window.location.search);
  const PREVIEW = params.get("previewMarketPromo") === "1";
  const FESTIVE_PREVIEW = params.get("previewDussehraFestival") === "1" || params.get("previewDussehraBar") === "1";
  const DUSSEHRA_DATE = "2026-10-20";

  const cards = [
    { href: "/", title: "WealthyTrees", body: "Markets, simplified. Daily.", cta: "Read today's news" },
    { href: "/markets.html", title: "Explore the Markets", body: "Charts, indices and price moves \u2014 made clearer.", cta: "Open charts" },
    { href: "/learn.html", title: "Weekend Learning", body: "Build your market knowledge, one idea at a time.", cta: "Start Learning" },
    { href: "/about.html", title: "No hype. Just clarity.", body: "Understand what happened and why it matters.", cta: "Our approach" }
  ];
  let timer = null, idx = 0, paused = false;
  function show(i) { document.querySelectorAll("#track .wt-rot-card").forEach((el, k) => el.classList.toggle("on", k === i)); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start(track) {
    stop(); idx = 0; paused = false;
    ["mouseenter", "focusin", "touchstart"].forEach(e => track.addEventListener(e, () => { paused = true; }));
    ["mouseleave", "focusout", "touchend"].forEach(e => track.addEventListener(e, () => { paused = false; }));
    timer = setInterval(() => { if (paused) return; idx = (idx + 1) % cards.length; show(idx); }, 5000);
  }

  function indiaDay() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata", weekday: "short", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    return {
      weekday: parts.find(p => p.type === "weekday")?.value || "",
      date: parts.find(p => p.type === "year")?.value + "-" +
        parts.find(p => p.type === "month")?.value + "-" +
        parts.find(p => p.type === "day")?.value
    };
  }

  function indiaMarketClosed() {
    const d = indiaDay();
    if (d.weekday === "Sat" || d.weekday === "Sun") return true;
    const holidays = window.WT_HOL;
    if (holidays && typeof holidays.today === "function") {
      const h = holidays.today();
      if (h && h.kind === "closed") return true;
    }
    return false;
  }

  function cardMarkup(card, i) {
    return '<a class="wt-promo-card wt-rot-card' + (i ? '' : ' on') + '" href="' + card.href + '">' +
      '<span class="wt-rot-copy"><strong>' + card.title + '</strong><span>' + card.body + '</span></span>' +
      '<span class="wt-rot-btn"><span class="wt-rot-cta">' + card.cta + ' </span>\u2197</span></a>';
  }

  function setChip(day) {
    const n = document.getElementById("tkname"), st = document.getElementById("tkstat");
    if (!n || !st) return;
    const wk = day.weekday === "Sat" || day.weekday === "Sun";
    const h = window.WT_HOL && typeof window.WT_HOL.today === "function" ? window.WT_HOL.today() : null;
    if (wk) { n.textContent = "India \u00b7 Weekend"; st.textContent = "MARKETS CLOSED \u00b7 LAST CLOSE"; }
    else if (h && h.kind === "closed") { n.textContent = "India"; st.textContent = "HOLIDAY \u00b7 " + h.name; }
    else { n.textContent = "India"; st.textContent = "MARKETS CLOSED"; }
  }

  function render() {
    const ticker = document.getElementById("ticker");
    const track = document.getElementById("track");
    if (!ticker || !track) return;

    // The Dussehra scene owns the ticker exclusively while active.
    if (ticker.classList.contains("wt-dussehra-festival") || track.dataset.wtFestival === "1") return;

    const day = indiaDay();
    const dussehra = day.date === DUSSEHRA_DATE || FESTIVE_PREVIEW;
    const shouldPromote = !dussehra && (PREVIEW || indiaMarketClosed());

    if (shouldPromote) {
      setChip(day);
      if (track.dataset.wtPromoActive === "1" && track.querySelector(".wt-promo-card")) return;
      track.className = "track wt-rotor-track";
      ticker.classList.add("wt-rotor-on");
      track.dataset.wtPromoActive = "1";
      track.dataset.sig = "wt-promo";
      track.style.removeProperty("--dur");
      track.innerHTML = cards.map(cardMarkup).join("");
      start(track);
    } else if (track.dataset.wtPromoActive === "1") {
      stop();
      track.classList.remove("wt-rotor-track");
      ticker.classList.remove("wt-rotor-on");
      delete track.dataset.wtPromoActive;
      track.dataset.sig = "";
      track.style.removeProperty("--dur");
      window.dispatchEvent(new Event("wt-holidays")); // redraw live prices straight away
    }
  }

  function init() {
    render();
    window.addEventListener("wt-holidays", render);
    // Poll rather than observing all descendants: ticker text/content changes should not
    // trigger a render loop or compete with the festival animation.
    window.setInterval(render, 15000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();