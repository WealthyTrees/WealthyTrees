/* WealthyTrees Dussehra ticker: three slow, separate right-to-left passes and petals confined to the ticker. */
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
        height:66px!important; min-height:66px!important; padding:0!important; overflow:hidden!important;
        border-top:1px solid rgba(225,181,88,.52)!important;
        border-bottom:1px solid rgba(225,181,88,.52)!important;
        background:linear-gradient(100deg,#091c14 0%,#173b2a 48%,#0b1b14 100%)!important;
        box-shadow:inset 0 1px 0 rgba(255,238,187,.08),0 4px 16px rgba(12,28,18,.12);
      }
      .ticker.nse.wt-dussehra-text-ticker .tk-label {display:none!important}
      .ticker.nse.wt-dussehra-text-ticker .tk-view {
        position:relative!important; isolation:isolate; display:block!important; flex:1 1 100%!important;
        width:100%!important; min-width:0!important; height:66px!important; min-height:66px!important;
        padding:0!important; margin:0!important; overflow:hidden!important;
      }
      .ticker.nse.wt-dussehra-text-ticker #track {
        position:absolute!important; inset:0!important; display:block!important; width:100%!important;
        height:100%!important; min-width:0!important; margin:0!important; padding:0!important;
        overflow:hidden!important; gap:0!important; transform:none!important; animation:none!important;
        white-space:normal!important; z-index:2;
      }
      .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message {
        position:absolute; left:0; top:50%; display:block; width:max-content; max-width:none;
        margin:0; padding:0 8px; white-space:nowrap; pointer-events:none;
        color:#ffe4a2; font-family:Georgia,"Times New Roman","Noto Sans Devanagari","Mangal",serif;
        font-size:clamp(18px,2.15vw,25px); font-weight:700; line-height:1.12;
        letter-spacing:.025em; text-shadow:0 0 2px rgba(255,244,202,.8),0 0 10px rgba(226,171,62,.4),0 1px 0 #39250c;
        opacity:0; visibility:hidden; will-change:transform,opacity;
        animation:wtDussehraSlowPass 36s linear infinite;
      }
      .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message--greeting {animation-delay:0s}
      .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message--hindi {animation-delay:12s}
      .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message--company {
        animation-delay:24s; font-family:Georgia,"Times New Roman",serif; font-size:clamp(17px,2vw,23px);
        letter-spacing:.035em;
      }
      @keyframes wtDussehraSlowPass {
        0%,2% {opacity:0;visibility:hidden;transform:translate3d(calc(100vw + 8px),-50%,0)}
        5% {opacity:1;visibility:visible;transform:translate3d(calc(100vw - 4px),-50%,0)}
        28% {opacity:1;visibility:visible;transform:translate3d(-110%,-50%,0)}
        32%,100% {opacity:0;visibility:hidden;transform:translate3d(-110%,-50%,0)}
      }
      .ticker.nse.wt-dussehra-text-ticker #track { z-index:5!important; }
      .wt-dussehra-sequence {
        position:absolute; left:0; top:50%; display:flex; align-items:center;
        gap:clamp(11px,1.8vw,23px); width:max-content; max-width:none; margin:0;
        padding:0 8px; white-space:nowrap; pointer-events:none;
        color:#ffe4a2; font-family:Georgia,"Times New Roman","Noto Sans Devanagari","Mangal",serif;
        font-size:clamp(18px,2.15vw,25px); font-weight:700; line-height:1.1;
        letter-spacing:.018em; text-shadow:0 0 2px rgba(255,244,202,.8),0 0 10px rgba(226,171,62,.4),0 1px 0 #39250c;
        opacity:0; visibility:hidden; will-change:transform,opacity;
        animation:wtDussehraSequencePass 16s linear infinite;
      }
      .wt-dussehra-sequence .wt-dussehra-hindi {
        font-family:"Noto Sans Devanagari","Mangal",Georgia,serif;
        font-size:1.05em; letter-spacing:.02em;
      }
      .wt-dussehra-sequence .wt-dussehra-company {
        font-family:Georgia,"Times New Roman",serif; font-size:.91em; letter-spacing:.025em;
      }
      .wt-dussehra-arrow {
        display:inline-block; flex:0 0 auto; width:clamp(34px,3vw,42px); height:26px;
        color:#ffd46a; transform-origin:center;
        filter:drop-shadow(0 0 3px rgba(255,207,87,.9)) drop-shadow(0 0 8px rgba(223,155,31,.72));
        animation:wtDussehraArrowGlow 1.6s ease-in-out infinite;
      }
      .wt-dussehra-arrow svg {display:block;width:100%;height:100%;overflow:visible}
      .wt-dussehra-arrow path {fill:none;stroke:#ffd45d;stroke-width:2.25;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
      .wt-dussehra-arrow .wt-bow {stroke:#fff0ad;stroke-width:2.7}
      .wt-dussehra-arrow .wt-bowstring {stroke:#ffe5a3;stroke-width:1.15}
      .wt-dussehra-arrow .wt-arrowhead {stroke:#fff0ad;stroke-width:2.6}
      .wt-dussehra-arrow .wt-fletching {stroke:#ffca62;stroke-width:1.8}
      @keyframes wtDussehraArrowGlow {
        0%,100% {opacity:.86;transform:scale(.94);filter:drop-shadow(0 0 2px #f8cc62) drop-shadow(0 0 5px rgba(244,171,38,.5))}
        50% {opacity:1;transform:scale(1.08);filter:drop-shadow(0 0 4px #fff1b1) drop-shadow(0 0 11px rgba(244,171,38,.95))}
      }
      @keyframes wtDussehraSequencePass {
        0%,2% {opacity:0;visibility:hidden;transform:translate3d(calc(100vw + 10px),-50%,0)}
        5% {opacity:1;visibility:visible;transform:translate3d(calc(100vw + 10px),-50%,0)}
        78% {opacity:1;visibility:visible;transform:translate3d(-100%,-50%,0)}
        83%,100% {opacity:0;visibility:hidden;transform:translate3d(-100%,-50%,0)}
      }
      .wt-dussehra-petal-layer {
        position:absolute!important; inset:0!important; z-index:4!important; overflow:hidden!important;
        pointer-events:none!important; contain:strict; clip-path:inset(0); isolation:isolate;
      }
      .wt-dussehra-petal {
        position:absolute; top:-12px; left:var(--x); display:block; width:var(--size); height:calc(var(--size)*1.7);
        border-radius:85% 12% 75% 18%; opacity:0;
        background:linear-gradient(145deg,#fff0b7 0%,#ffd35c 48%,#df8032 100%);
        box-shadow:inset 1px 1px 1px rgba(255,255,255,.58),0 0 5px rgba(240,177,63,.2);
        transform:rotate(var(--rot)); animation:wtDussehraPetalFall var(--fall) var(--delay) linear infinite;
        will-change:transform,opacity;
      }
      .wt-dussehra-petal:nth-child(4n) {background:linear-gradient(145deg,#ffe7eb,#e88a9a 62%,#c84d69)}
      .wt-dussehra-petal:nth-child(5n) {background:linear-gradient(145deg,#fff8d8,#f6c54d 60%,#db7632)}
      @keyframes wtDussehraPetalFall {
        0% {opacity:0;transform:translate3d(0,-4px,0) rotate(var(--rot))}
        12% {opacity:.96}
        83% {opacity:.92}
        100% {opacity:0;transform:translate3d(var(--drift),78px,0) rotate(var(--end-rot))}
      }
      @media(max-width:640px) {
        .ticker.nse.wt-dussehra-text-ticker,.ticker.nse.wt-dussehra-text-ticker .tk-view {height:60px!important;min-height:60px!important}
        .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message {font-size:clamp(17px,4.6vw,21px);letter-spacing:0}
        .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-message--company {font-size:clamp(16px,4.2vw,20px)}
        @keyframes wtDussehraPetalFall {100% {opacity:0;transform:translate3d(var(--drift),72px,0) rotate(var(--end-rot))}}
      }
      @media(prefers-reduced-motion:reduce) {
        .ticker.nse.wt-dussehra-text-ticker .wt-dussehra-sequence {animation:none!important;opacity:1;visibility:visible;position:relative;left:auto;top:auto;transform:none;justify-content:center;flex-wrap:wrap;white-space:normal;width:100%;padding:8px;gap:8px}
        .wt-dussehra-sequence .wt-dussehra-arrow {animation:none!important}
        .wt-dussehra-petal {animation:none!important;opacity:.25}
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (!preview && indiaDate() !== FESTIVAL_DATE) return;
    const ticker = document.getElementById("ticker");
    const track = document.getElementById("track");
    const view = ticker && ticker.querySelector(".tk-view");
    const label = ticker && ticker.querySelector(".tk-label");
    if (!ticker || !track || !view || ticker.dataset.wtDussehraTextReady === "1") return;

    addStyles();
    ticker.dataset.wtDussehraTextReady = "1";
    ticker.classList.add("wt-dussehra-text-ticker");
    ticker.setAttribute("aria-label", "We wish you a very शुभ विजयादशमी — WealthyTrees Private Limited");
    track.dataset.wtPromoActive = "1";
    track.dataset.wtFestival = "1";
    track.dataset.sig = "wt-dussehra-text";
    track.classList.remove("wt-promo-track");
    track.style.removeProperty("--dur");
    if (label) label.setAttribute("aria-hidden", "true");

    track.innerHTML = `
      <div class="wt-dussehra-sequence" aria-label="We wish you a very शुभ विजयादशमी — WealthyTrees Private Limited">
        <span class="wt-dussehra-greeting">We wish you a very</span>
        <span class="wt-dussehra-arrow" aria-hidden="true"><svg viewBox="0 0 64 32" role="presentation"><path class="wt-bow" d="M8 2 Q28 16 8 30"/><path class="wt-bowstring" d="M8 2 L8 30"/><path class="wt-arrow-shaft" d="M8 16 H57"/><path class="wt-arrowhead" d="M47 6 L60 16 L47 26"/><path class="wt-fletching" d="M15 16 L21 10 M15 16 L21 22"/></svg></span>
        <span class="wt-dussehra-hindi">शुभ विजयादशमी</span>
        <span class="wt-dussehra-arrow" aria-hidden="true"><svg viewBox="0 0 64 32" role="presentation"><path class="wt-bow" d="M8 2 Q28 16 8 30"/><path class="wt-bowstring" d="M8 2 L8 30"/><path class="wt-arrow-shaft" d="M8 16 H57"/><path class="wt-arrowhead" d="M47 6 L60 16 L47 26"/><path class="wt-fletching" d="M15 16 L21 10 M15 16 L21 22"/></svg></span>
        <span class="wt-dussehra-company">WealthyTrees Private Limited</span>
      </div>
`;

    const petals = document.createElement("span");
    petals.className = "wt-dussehra-petal-layer";
    petals.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 48; i++) {
      const petal = document.createElement("i");
      petal.className = "wt-dussehra-petal";
      petal.style.setProperty("--x", (Math.random() * 100).toFixed(2) + "%");
      petal.style.setProperty("--size", (3 + Math.random() * 3.5).toFixed(1) + "px");
      petal.style.setProperty("--fall", (2.2 + Math.random() * 2.1).toFixed(2) + "s");
      petal.style.setProperty("--delay", (-Math.random() * 4.2).toFixed(2) + "s");
      petal.style.setProperty("--drift", Math.round((Math.random() - .5) * 16) + "px");
      petal.style.setProperty("--rot", Math.round(Math.random() * 120 - 60) + "deg");
      petal.style.setProperty("--end-rot", Math.round(Math.random() * 540 + 180) + "deg");
      petals.appendChild(petal);
    }
    view.appendChild(petals);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
