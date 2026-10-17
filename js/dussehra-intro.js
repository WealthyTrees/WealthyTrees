/* WealthyTrees Dussehra intro — India date-gated.
   Put this file at /js/dussehra-intro.js
   Put the supplied video at /assets/festival/dussehra-intro.mp4
   Add <script src="/js/dussehra-intro.js" defer></script> to index.html.
*/
(() => {
  "use strict";

  const FESTIVAL_DATE = "2026-10-20"; // Dussehra 2026, India
  const SESSION_KEY = "wtDussehraIntroSeen2026";
  const VIDEO_URL = "/assets/festival/dussehra-intro.mp4";
  const PREVIEW_MODE = new URLSearchParams(window.location.search).get("previewDussehra") === "1";

  function indiaDateString() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    const part = (type) => parts.find((p) => p.type === type)?.value || "";
    return `${part("year")}-${part("month")}-${part("day")}`;
  }

  function addStyles() {
    if (document.getElementById("wt-dussehra-intro-style")) return;
    const style = document.createElement("style");
    style.id = "wt-dussehra-intro-style";
    style.textContent = `
      #wt-dussehra-intro, #wt-dussehra-intro * { box-sizing: border-box; }
      #wt-dussehra-intro {
        position: fixed; inset: 0; z-index: 2147483000; overflow: hidden;
        display: grid; place-items: center; background: #08271b; color: #fff8e8;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
      }
      #wt-dussehra-intro[hidden] { display: none !important; }
      #wt-dussehra-intro .wt-video {
        position: absolute; inset: 0; width: 100%; height: 100%;
        object-fit: cover; object-position: center; background: #08271b;
      }
      #wt-dussehra-intro .wt-shade {
        position: absolute; inset: 0; pointer-events: none;
        background: linear-gradient(180deg, rgba(4,24,16,.10), rgba(4,24,16,.12) 40%, rgba(4,24,16,.72));
      }
      #wt-dussehra-intro .wt-copy {
        position: relative; z-index: 2; align-self: end; width: min(900px, 100%);
        padding: 30px 22px max(38px, env(safe-area-inset-bottom)); text-align: center;
        animation: wtDussehraRise .8s ease both;
      }
      #wt-dussehra-intro .wt-eyebrow {
        margin: 0 0 14px; color: #f7d88b; font-size: 11px; font-weight: 800;
        text-transform: uppercase; letter-spacing: .22em;
      }
      #wt-dussehra-intro h1 {
        margin: 0 auto 14px; font: 400 clamp(36px, 7vw, 74px)/1.02 Georgia, serif;
        letter-spacing: -.035em; text-wrap: balance; text-shadow: 0 4px 25px #0005;
      }
      #wt-dussehra-intro h1 em { color: #f7d88b; }
      #wt-dussehra-intro .wt-subtitle {
        max-width: 580px; margin: 0 auto 24px; color: #fff8e8e8;
        font-size: clamp(13px, 2vw, 17px); line-height: 1.65;
      }
      #wt-dussehra-intro .wt-actions { display:flex; justify-content:center; flex-wrap:wrap; gap:12px; }
      #wt-dussehra-intro button {
        min-height: 48px; border-radius: 999px; padding: 13px 22px;
        font: inherit; font-size: 14px; font-weight: 750; cursor: pointer;
      }
      #wt-dussehra-intro .wt-enter {
        color:#143b29; border:0; background:linear-gradient(135deg,#ffe8a7,#e9b84f);
        box-shadow:0 10px 30px #0003;
      }
      #wt-dussehra-intro .wt-skip {
        position:absolute; z-index:3; top:max(16px,env(safe-area-inset-top));
        right:max(16px,env(safe-area-inset-right)); color:#fff8e8;
        border:1px solid #ffffff75; background:#06291dcc; backdrop-filter:blur(8px);
      }
      #wt-dussehra-intro button:focus-visible { outline:3px solid #fff; outline-offset:4px; }
      @keyframes wtDussehraRise { from {opacity:0;transform:translateY(14px)} to {opacity:1;transform:translateY(0)} }
      @media(max-width:600px) {
        #wt-dussehra-intro .wt-copy { padding-left:18px; padding-right:18px; }
        #wt-dussehra-intro .wt-actions { flex-direction:column; align-items:center; }
        #wt-dussehra-intro .wt-actions button { width:min(100%,320px); }
        #wt-dussehra-intro .wt-video { object-position:center; }
      }
      @media(prefers-reduced-motion:reduce) {
        #wt-dussehra-intro .wt-copy { animation:none; }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    // Only show on Dussehra in the India timezone.
    if (!PREVIEW_MODE && indiaDateString() !== FESTIVAL_DATE) return;
    if (!PREVIEW_MODE && sessionStorage.getItem(SESSION_KEY) === "1") return;
    if (document.getElementById("wt-dussehra-intro")) return;

    addStyles();
    const overlay = document.createElement("section");
    overlay.id = "wt-dussehra-intro";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Dussehra festival introduction");
    overlay.innerHTML = `
      <video class="wt-video" autoplay muted loop playsinline preload="auto" aria-label="Dussehra intro video">
        <source src="${VIDEO_URL}" type="video/mp4">
      </video>
      <div class="wt-shade"></div>
      <button class="wt-skip" type="button">Skip Intro</button>
      <div class="wt-copy">
        <p class="wt-eyebrow">A season of prosperity</p>
        <h1>May prosperity<br>take <em>root.</em></h1>
        <p class="wt-subtitle">Wishing you a Dussehra filled with new beginnings, growth and brighter possibilities.</p>
        <div class="wt-actions"><button class="wt-enter" type="button">Enter Website</button></div>
      </div>
    `;
    document.body.appendChild(overlay);
    const video = overlay.querySelector("video");
    document.documentElement.style.overflow = "hidden";

    const dismiss = () => {
      if (!PREVIEW_MODE) sessionStorage.setItem(SESSION_KEY, "1");
      video.pause();
      overlay.remove();
      document.documentElement.style.overflow = "";
    };
    overlay.querySelector(".wt-skip").addEventListener("click", dismiss);
    overlay.querySelector(".wt-enter").addEventListener("click", dismiss);
    video.play().catch(() => {
      // Autoplay may be blocked by browser settings; the video remains visible.
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
