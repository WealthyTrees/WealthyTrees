/* WealthyTrees Dussehra ticker animation. Only runs on Dussehra (IST), unless previewDussehraBar=1 is set. */
(() => {
  "use strict";
  const FESTIVAL_DATE = "2026-10-20";
  const preview = new URLSearchParams(window.location.search).get("previewDussehraBar") === "1";
  const frames = [
    "MARKETS CLOSED · DUSSEHRA",
    "Happy Vijayadashami",
    "सत्य की विजय, समृद्धि का पर्व",
    "WealthyTrees Private Limited"
  ];
  const intervalMs = 3200;

  function istDate() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const get = (type) => parts.find((part) => part.type === type)?.value || "";
    return get("year") + "-" + get("month") + "-" + get("day");
  }

  function init() {
    if (!preview && istDate() !== FESTIVAL_DATE) return;
    const label = document.querySelector(".ticker.nse .tk-label");
    const title = document.getElementById("tkname");
    const status = document.getElementById("tkstat");
    if (!label || !title || !status || label.dataset.wtDussehraReady === "1") return;
    label.dataset.wtDussehraReady = "1";
    label.classList.add("wt-dussehra-label");
    title.textContent = "INDIA · DUSSEHRA";
    status.classList.add("wt-dussehra-status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-label", "Dussehra greeting and WealthyTrees message");

    const petals = document.createElement("span");
    petals.className = "wt-ticker-petals";
    petals.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 5; i++) {
      const petal = document.createElement("i");
      petal.className = "wt-ticker-petal";
      petal.style.setProperty("--px", (14 + i * 17) + "%");
      petal.style.setProperty("--delay", (i * -1.15) + "s");
      petals.appendChild(petal);
    }
    label.appendChild(petals);

    let index = 0;
    let timer = null;
    function showFrame() {
      title.textContent = "INDIA · DUSSEHRA";
      status.classList.add("is-changing");
      window.setTimeout(() => {
        if (!document.body.contains(label)) return;
        status.textContent = frames[index];
        status.classList.remove("is-changing");
        index = (index + 1) % frames.length;
      }, 220);
    }
    showFrame();
    timer = window.setInterval(showFrame, intervalMs);
    window.addEventListener("pagehide", () => { if (timer) window.clearInterval(timer); }, { once: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();