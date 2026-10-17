/* WealthyTrees Dussehra intro — original video, responsive presentation, final-screen logo replacement. */
(() => {
  "use strict";
  const FESTIVAL_DATE = "2026-10-20";
  const SESSION_KEY = "wtDussehraIntroSeen2026";
  const VIDEO_URL = "/assets/dussehra-intro.mp4";
  const PREVIEW_MODE = new URLSearchParams(window.location.search).get("previewDussehra") === "1";
  const BRANDING_START = 12.45;

  function indiaDateString() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const part = (type) => parts.find((item) => item.type === type)?.value || "";
    return part("year") + "-" + part("month") + "-" + part("day");
  }

  function addStyles() {
    if (document.getElementById("wt-dussehra-intro-style")) return;
    const style = document.createElement("style");
    style.id = "wt-dussehra-intro-style";
    style.textContent = `
      #wt-dussehra-intro, #wt-dussehra-intro * { box-sizing: border-box; }
      #wt-dussehra-intro {
        position: fixed; inset: 0; z-index: 2147483000; display: grid; place-items: center;
        overflow: hidden; isolation: isolate; color: #173f2e;
        background:
          radial-gradient(circle at 12% 18%, rgba(248, 203, 118, .25) 0 2px, transparent 3px),
          radial-gradient(circle at 88% 72%, rgba(211, 126, 55, .20) 0 3px, transparent 4px),
          radial-gradient(ellipse at 50% 10%, #fff4d9 0%, transparent 42%),
          linear-gradient(135deg, #f9dfbe 0%, #fff0d8 48%, #f2c7a4 100%);
        font-family: "Noto Sans Devanagari", "Mangal", system-ui, sans-serif;
      }
      #wt-dussehra-intro .wt-stage {
        position: relative; width: min(100vw, 56.25dvh); height: min(100dvh, 177.7778vw);
        aspect-ratio: 9 / 16; overflow: hidden; background: #f7ddbd;
        box-shadow: 0 18px 65px rgba(93, 54, 24, .20);
      }
      #wt-dussehra-intro .wt-video {
        position: absolute; inset: 0; display: block; width: 100%; height: 100%;
        object-fit: cover; background: #f7ddbd;
      }
      #wt-dussehra-intro .wt-brand-plaque {
        position: absolute; z-index: 4; top: 5.45%; left: 22%; width: 56%; height: 22.25%;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 1.5%; padding: 3% 4%;
        overflow: hidden; border: 2px solid #bf8627; border-radius: clamp(14px, 5vw, 38px);
        background:
          radial-gradient(circle at 7% 11%, #b95b2b 0 3px, transparent 3.7px),
          radial-gradient(circle at 9% 14%, #f0b13b 0 4px, transparent 4.7px),
          radial-gradient(circle at 93% 11%, #b95b2b 0 3px, transparent 3.7px),
          radial-gradient(circle at 91% 14%, #f0b13b 0 4px, transparent 4.7px),
          #fff9e8;
        box-shadow: 0 5px 0 rgba(142, 91, 25, .25), inset 0 0 0 2px #f2d28a, inset 0 0 0 5px rgba(255,255,255,.72);
        opacity: 0; visibility: hidden; transform: translateY(7px) scale(.985);
        transition: opacity .3s ease, transform .3s ease, visibility .3s ease;
        pointer-events: none;
      }
      #wt-dussehra-intro .wt-brand-plaque.is-visible {
        opacity: 1; visibility: visible; transform: translateY(0) scale(1);
      }
      #wt-dussehra-intro .wt-brand-logo {
        display: block; width: 36%; height: 61%; max-width: 150px;
        object-fit: contain; flex: 0 1 auto;
      }
      #wt-dussehra-intro .wt-brand-name {
        margin: 0; color: #176443; text-align: center; font-size: clamp(14px, 4.8vw, 34px);
        font-weight: 850; line-height: 1.08; letter-spacing: .005em;
        text-shadow: 0 1px 0 rgba(255,255,255,.8);
      }
      #wt-dussehra-intro .wt-skip, #wt-dussehra-intro .wt-enter {
        position: fixed; z-index: 8; border: 1px solid rgba(129, 86, 28, .35);
        border-radius: 999px; padding: 12px 18px; min-height: 44px;
        font: inherit; font-size: 14px; font-weight: 750; cursor: pointer;
        box-shadow: 0 5px 20px rgba(93, 54, 24, .14); backdrop-filter: blur(8px);
        -webkit-tap-highlight-color: transparent;
      }
      #wt-dussehra-intro .wt-skip {
        top: max(16px, env(safe-area-inset-top)); right: max(16px, env(safe-area-inset-right));
        color: #16412e; background: rgba(255, 249, 232, .95);
      }
      #wt-dussehra-intro .wt-enter {
        left: 50%; bottom: max(16px, env(safe-area-inset-bottom)); transform: translateX(-50%);
        white-space: nowrap; color: #fff8e8; border-color: #0d6746;
        background: linear-gradient(135deg, #146b49, #0b5138);
      }
      #wt-dussehra-intro .wt-skip:hover, #wt-dussehra-intro .wt-enter:hover { filter: brightness(1.06); }
      #wt-dussehra-intro button:focus-visible { outline: 3px solid #a06a17; outline-offset: 4px; }
      #wt-dussehra-intro .wt-error {
        position: fixed; z-index: 9; left: 50%; top: 50%; transform: translate(-50%, -50%);
        max-width: min(88vw, 420px); margin: 0; padding: 14px 17px; border-radius: 14px;
        color: #542d14; border: 1px solid #dfb361; background: #fff8e7; text-align: center;
        box-shadow: 0 8px 30px rgba(93, 54, 24, .18); font-size: 14px;
      }
      @media (min-width: 700px) {
        #wt-dussehra-intro .wt-enter {
          left: auto; right: max(24px, calc((100vw - min(100vw, 56.25dvh)) / 4 - 90px));
          bottom: max(26px, env(safe-area-inset-bottom)); transform: none;
        }
      }
      @media (max-width: 420px) {
        #wt-dussehra-intro .wt-skip { top: max(10px, env(safe-area-inset-top)); right: 10px; padding: 10px 13px; font-size: 12px; }
        #wt-dussehra-intro .wt-enter { padding: 10px 16px; font-size: 13px; }
        #wt-dussehra-intro .wt-brand-name { font-size: clamp(13px, 4.8vw, 20px); }
        #wt-dussehra-intro .wt-brand-plaque { border-width: 1.5px; }
      }
      @media (prefers-reduced-motion: reduce) {
        #wt-dussehra-intro .wt-brand-plaque { transition: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (!PREVIEW_MODE && indiaDateString() !== FESTIVAL_DATE) return;
    try {
      if (!PREVIEW_MODE && sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch (_) {}
    if (document.getElementById("wt-dussehra-intro")) return;

    addStyles();
    const overlay = document.createElement("section");
    overlay.id = "wt-dussehra-intro";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "दशहरा उत्सव परिचय");
    overlay.innerHTML = `
      <div class="wt-stage">
        <video class="wt-video" autoplay muted playsinline preload="auto" aria-label="दशहरा उत्सव का वीडियो">
          <source src="${VIDEO_URL}" type="video/mp4">
        </video>
        <div class="wt-brand-plaque" aria-label="WealthyTrees">
          <img class="wt-brand-logo" src="/assets/logo.svg" alt="WealthyTrees money-tree logo">
          <p class="wt-brand-name">WealthyTrees</p>
        </div>
      </div>
      <button class="wt-skip" type="button">परिचय छोड़ें</button>
      <button class="wt-enter" type="button">वेबसाइट पर आगे बढ़ें</button>
    `;
    document.body.appendChild(overlay);

    const video = overlay.querySelector(".wt-video");
    const plaque = overlay.querySelector(".wt-brand-plaque");
    const priorOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const syncBranding = () => {
      plaque.classList.toggle("is-visible", video.currentTime >= BRANDING_START);
    };
    video.addEventListener("timeupdate", syncBranding);
    video.addEventListener("seeked", syncBranding);
    video.addEventListener("ended", syncBranding);
    video.addEventListener("error", () => {
      if (overlay.querySelector(".wt-error")) return;
      const note = document.createElement("p");
      note.className = "wt-error";
      note.setAttribute("role", "status");
      note.textContent = "वीडियो लोड नहीं हो पाया। कृपया इंटरनेट कनेक्शन जाँचें या कुछ देर बाद पुनः प्रयास करें।";
      overlay.appendChild(note);
    }, { once: true });

    const dismiss = () => {
      try { if (!PREVIEW_MODE) sessionStorage.setItem(SESSION_KEY, "1"); } catch (_) {}
      video.pause();
      overlay.remove();
      document.documentElement.style.overflow = priorOverflow;
    };
    overlay.querySelector(".wt-skip").addEventListener("click", dismiss);
    overlay.querySelector(".wt-enter").addEventListener("click", dismiss);
    document.addEventListener("keydown", function onKeydown(event) {
      if (event.key === "Escape" && document.getElementById("wt-dussehra-intro")) {
        dismiss();
        document.removeEventListener("keydown", onKeydown);
      }
    });

    video.play().catch(() => { video.setAttribute("controls", "controls"); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();