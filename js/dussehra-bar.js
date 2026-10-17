/* WealthyTrees Dussehra ticker. Runs on 20 Oct 2026 (India time), or in preview mode. */
(() => {
  "use strict";
  const FESTIVAL_DATE = "2026-10-20";
  const params = new URLSearchParams(window.location.search);
  const preview = ["previewDussehra", "previewDussehraBar", "previewDussehraFestival"]
    .some((key) => params.get(key) === "1");

  function indiaDate() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const part = (type) => parts.find((item) => item.type === type)?.value || "";
    return part("year") + "-" + part("month") + "-" + part("day");
  }

  function addStyles() {
    if (document.getElementById("wt-dussehra-ticker-style")) return;
    const style = document.createElement("style");
    style.id = "wt-dussehra-ticker-style";
    style.textContent = `
      .ticker.nse.wt-dussehra-text-ticker {
        position:relative!important; display:flex!important; align-items:stretch!important;
        height:62px!important; min-height:62px!important; padding:0!important; overflow:hidden!important;
        border-top:1px solid rgba(225,181,88,.48)!important;
        border-bottom:1px solid rgba(225,181,88,.48)!important;
        background:linear-gradient(100deg,#0a1d16 0%,#163626 46%,#0b1d16 100%)!important;
        box-shadow:inset 0 1px 0 rgba(255,238,187,.08),0 4px 18px rgba(12,28,18,.12);
      }
      .ticker.nse.wt-dussehra-text-ticker .tk-label {display:none!important}
      .ticker.nse.wt-dussehra-text-ticker .tk-view {
        position:relative!important; display:block!important; flex:1 1 100%!important;
        width:100%!important; min-width:0!important; height:62px!important; min-height:62px!important;
        padding:0!important; margin:0!important; overflow:hidden!important;
      }
      .ticker.nse.wt-dussehra-text-ticker #track {
        position:absolute!important; inset:0!important; display:block!important; width:100%!important;
        height:100%!important; min-width:0!important; margin:0!important; padding:0!important;
        overflow:hidden!important; gap:0!important; transform:none!important; animation:none!important;
        white-space:normal!important;
      }
      .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message {
        position:absolute; left:0; top:50%; display:block; width:max-content; max-width:none;
        margin:0; padding:0 8px; white-space:nowrap; pointer-events:none;
        color:#ffe3a0; font-family:Georgia,"Times New Roman",serif;
        font-size:clamp(18px,2.2vw,25px); font-weight:700; line-height:1.1;
        letter-spacing:.025em; text-shadow:0 0 2px rgba(255,244,202,.8),0 0 12px rgba(226,171,62,.46),0 1px 0 #39250c;
        opacity:0; will-change:transform,opacity;
      }
      .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message--greeting {
        animation:wtDussehraGreetingPass 8s ease-in-out infinite;
      }
      .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message--company {
        animation:wtDussehraCompanyPass 8s ease-in-out infinite;
      }
      @keyframes wtDussehraGreetingPass {
        0%,2% {opacity:0;transform:translate(-110%,-50%)}
        7% {opacity:1}
        40% {opacity:1;transform:translate(calc(100vw + 30px),-50%)}
        45%,100% {opacity:0;transform:translate(calc(100vw + 30px),-50%)}
      }
      @keyframes wtDussehraCompanyPass {
        0%,50% {opacity:0;transform:translate(-110%,-50%)}
        55% {opacity:1}
        88% {opacity:1;transform:translate(calc(100vw + 30px),-50%)}
        93%,100% {opacity:0;transform:translate(calc(100vw + 30px),-50%)}
      }
      @media(max-width:640px) {
        .ticker.nse.wt-dussehra-text-ticker,.ticker.nse.wt-dussehra-text-ticker .tk-view {height:56px!important;min-height:56px!important}
        .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message {font-size:clamp(17px,4.5vw,21px);letter-spacing:0}
      }
      @media(prefers-reduced-motion:reduce) {
        .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message {animation:none!important;opacity:0}
        .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message--greeting {opacity:1;position:static;transform:none}
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (!preview && indiaDate() !== FESTIVAL_DATE) return;
    const ticker = document.getElementById("ticker");
    const track = document.getElementById("track");
    const label = ticker && ticker.querySelector(".tk-label");
    if (!ticker || !track || ticker.dataset.wtDussehraTextReady === "1") return;

    addStyles();
    ticker.dataset.wtDussehraTextReady = "1";
    ticker.classList.add("wt-dussehra-text-ticker");
    ticker.setAttribute("aria-label", "Happy Vijayadashami greeting from WealthyTrees Private Limited");
    track.dataset.wtPromoActive = "1";
    track.dataset.wtFestival = "1";
    track.dataset.sig = "wt-dussehra-text";
    track.classList.remove("wt-promo-track");
    track.style.removeProperty("--dur");
    if (label) label.setAttribute("aria-hidden", "true");

    track.innerHTML = `
      <span class="wt-dussehra-message wt-dussehra-message--greeting">Happy Vijayadashami</span>
      <span class="wt-dussehra-message wt-dussehra-message--company">WealthyTrees Private Limited</span>
    `;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
