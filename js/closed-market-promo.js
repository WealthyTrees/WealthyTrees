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
    {
      href: "/",
      title: "WealthyTrees",
      body: "Markets, simplified. Daily.",
      variant: "brand"
    },
    {
      href: "/markets.html",
      title: "Explore the Markets",
      body: "Charts, indices and price moves — made clearer.",
      variant: "markets"
    },
    {
      href: "/learn.html",
      title: "Weekend Learning",
      body: "Build your market knowledge, one idea at a time.",
      variant: "learn"
    },
    {
      href: "/about.html",
      title: "No hype. Just clarity.",
      body: "Understand what happened and why it matters.",
      variant: "about"
    }
  ];

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

  function cardMarkup(card) {
    return '<a class="tk wt-promo-card wt-promo-' + card.variant + '" href="' + card.href + '">' +
      '<span class="wt-promo-mark"><img src="/assets/logo.svg" alt=""></span>' +
      '<span class="wt-promo-copy"><strong>' + card.title + '</strong><span>' + card.body + '</span></span>' +
      '<span class="wt-promo-arrow" aria-hidden="true">↗</span></a>';
  }

  function render() {
    const track = document.getElementById("track");
    if (!track) return;
    const day = indiaDay();
    const dussehra = day.date === DUSSEHRA_DATE || FESTIVE_PREVIEW;
    const shouldPromote = !dussehra && (PREVIEW || indiaMarketClosed());

    if (shouldPromote) {
      if (track.dataset.wtPromoActive === "1" && track.querySelector(".wt-promo-card")) return;
      const sequence = cards.map(cardMarkup).join("");
      track.classList.add("wt-promo-track");
      track.dataset.wtPromoActive = "1";
      track.dataset.sig = "wt-promo";
      track.style.setProperty("--dur", "58s");
      track.innerHTML = sequence + sequence;
    } else if (track.dataset.wtPromoActive === "1") {
      // app.js will restore the real market cards on its next quote refresh.
      track.classList.remove("wt-promo-track");
      delete track.dataset.wtPromoActive;
      track.dataset.sig = "";
      track.style.removeProperty("--dur");
    }
  }

  function init() {
    render();
    const ticker = document.getElementById("ticker");
    if (ticker && window.MutationObserver) {
      const observer = new MutationObserver(() => render());
      observer.observe(ticker, { childList: true, subtree: true });
    }
    window.setInterval(render, 15000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();