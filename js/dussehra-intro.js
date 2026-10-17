/* WealthyTrees Dussehra intro: responsive, automatic curtain reveal, festive petal shower. */
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
        background: radial-gradient(ellipse at 50% 10%, #fff4d9 0%, transparent 42%), linear-gradient(135deg,#f9dfbe,#fff0d8 48%,#f2c7a4);
        font-family: "Noto Sans Devanagari", "Mangal", system-ui, sans-serif;
      }
      #wt-dussehra-intro .wt-stage { position: relative; width: min(100vw,56.25dvh); height: min(100dvh,177.7778vw); aspect-ratio:9/16; overflow:hidden; background:#f7ddbd; box-shadow:0 18px 65px #5d361833; }
      #wt-dussehra-intro .wt-video { position:absolute; inset:0; display:block; width:100%; height:100%; object-fit:cover; background:#f7ddbd; }
      #wt-dussehra-intro .wt-brand-plaque {
        position:absolute; z-index:4; top:5.2%; left:14%; width:72%; height:23%;
        display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1%;
        padding:2.4% 3%; overflow:hidden; border:2px solid #bf8627; border-radius:clamp(14px,5vw,38px);
        background: radial-gradient(circle at 7% 11%,#b95b2b 0 3px,transparent 3.7px), radial-gradient(circle at 9% 14%,#f0b13b 0 4px,transparent 4.7px), radial-gradient(circle at 93% 11%,#b95b2b 0 3px,transparent 3.7px), radial-gradient(circle at 91% 14%,#f0b13b 0 4px,transparent 4.7px), #fff9e8;
        box-shadow:0 5px 0 #8e5b1a40,inset 0 0 0 2px #f2d28a,inset 0 0 0 5px #ffffffb8;
        opacity:0; visibility:hidden; transform:translateY(7px) scale(.985); transition:opacity .3s ease,transform .3s ease,visibility .3s ease; pointer-events:none;
      }
      #wt-dussehra-intro .wt-brand-plaque.is-visible { opacity:1; visibility:visible; transform:translateY(0) scale(1); }
      #wt-dussehra-intro .wt-brand-logo { display:block; width:27%; height:57%; max-width:132px; min-height:0; object-fit:contain; flex:0 1 auto; }
      #wt-dussehra-intro .wt-brand-name {
        display:block; width:100%; max-width:100%; flex:0 0 auto; margin:0; padding:0 2px; color:#176443; text-align:center;
        font-family:system-ui,-apple-system,"Segoe UI",sans-serif; font-size:clamp(12px,3.45vw,23px); font-weight:850; line-height:1.08;
        letter-spacing:0; white-space:nowrap; text-shadow:0 1px 0 #ffffffcc;
      }
      #wt-dussehra-intro .wt-skip, #wt-dussehra-intro .wt-enter {
        position:fixed; z-index:8; border:1px solid #81561c59; border-radius:999px; padding:12px 18px; min-height:44px;
        font:inherit; font-size:14px; font-weight:750; cursor:pointer; box-shadow:0 5px 20px #5d361824; backdrop-filter:blur(8px); -webkit-tap-highlight-color:transparent;
      }
      #wt-dussehra-intro .wt-skip { top:max(16px,env(safe-area-inset-top)); right:max(16px,env(safe-area-inset-right)); color:#16412e; background:#fff9e8f2; }
      #wt-dussehra-intro .wt-enter { left:50%; bottom:max(16px,env(safe-area-inset-bottom)); transform:translateX(-50%); white-space:nowrap; color:#fff8e8; border-color:#0d6746; background:linear-gradient(135deg,#146b49,#0b5138); }
      #wt-dussehra-intro .wt-skip:hover, #wt-dussehra-intro .wt-enter:hover { filter:brightness(1.06); }
      #wt-dussehra-intro button:focus-visible { outline:3px solid #a06a17; outline-offset:4px; }
      #wt-dussehra-intro .wt-error { position:fixed; z-index:9; left:50%; top:50%; transform:translate(-50%,-50%); max-width:min(88vw,420px); margin:0; padding:14px 17px; border-radius:14px; color:#542d14; border:1px solid #dfb361; background:#fff8e7; text-align:center; box-shadow:0 8px 30px #5d36182e; font-size:14px; }
      #wt-dussehra-intro.is-lifting { animation:wtCurtainLift 1.05s cubic-bezier(.6,0,.8,.35) forwards; pointer-events:none; }
      @keyframes wtCurtainLift { 0%{transform:translateY(0);opacity:1} 65%{opacity:1} 100%{transform:translateY(-102%);opacity:.98} }
      @media(min-width:700px) { #wt-dussehra-intro .wt-enter { left:auto; right:max(24px,calc((100vw - min(100vw,56.25dvh))/4 - 90px)); bottom:max(26px,env(safe-area-inset-bottom)); transform:none; } }
      @media(max-width:420px) {
        #wt-dussehra-intro .wt-skip { top:max(10px,env(safe-area-inset-top)); right:10px; padding:10px 13px; font-size:12px; }
        #wt-dussehra-intro .wt-enter { padding:10px 16px; font-size:13px; }
        #wt-dussehra-intro .wt-brand-plaque { left:12%; width:76%; border-width:1.5px; border-radius:22px; }
        #wt-dussehra-intro .wt-brand-logo { width:25%; height:55%; }
        #wt-dussehra-intro .wt-brand-name { font-size:clamp(11px,3.7vw,17px); }
      }
      @media(prefers-reduced-motion:reduce) { #wt-dussehra-intro .wt-brand-plaque{transition:none} #wt-dussehra-intro.is-lifting{animation-duration:.15s} }
    `;
    document.head.appendChild(style);
  }


  function init() {
    if (!PREVIEW_MODE && indiaDateString() !== FESTIVAL_DATE) return;
    try { if (!PREVIEW_MODE && sessionStorage.getItem(SESSION_KEY) === "1") return; } catch (_) {}
    if (document.getElementById("wt-dussehra-intro")) return;

    addStyles();
    const overlay = document.createElement("section");
    overlay.id = "wt-dussehra-intro";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Dussehra celebration intro");
    overlay.innerHTML = `
      <div class="wt-stage">
        <video class="wt-video wt-intro-clip" autoplay muted playsinline preload="auto" aria-label="Dussehra festival intro">
          <source src="${VIDEO_URL}" type="video/mp4">
        </video>
        <div class="wt-brand-plaque" aria-label="WealthyTrees">
          <img class="wt-brand-logo" src="/assets/logo.svg" alt="WealthyTrees money-tree logo">
          <p class="wt-brand-name">WealthyTrees</p>
        </div>
      </div>
      <button class="wt-skip" type="button">Skip Intro</button>
      <button class="wt-enter" type="button">Continue to Website</button>
    `;
    document.body.appendChild(overlay);

    const introVideo = overlay.querySelector(".wt-intro-clip");
    const plaque = overlay.querySelector(".wt-brand-plaque");
    const skipButton = overlay.querySelector(".wt-skip");
    const enterButton = overlay.querySelector(".wt-enter");
    const priorOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    // The intro is the only full-screen video. When it ends or is skipped,
    // reveal the website directly; the separate greeting remains in Daily Edition.
    let finished = false;

    const finishExperience = () => {
      if (finished) return;
      finished = true;
      try { if (!PREVIEW_MODE) sessionStorage.setItem(SESSION_KEY, "1"); } catch (_) {}
      introVideo.pause();
      overlay.remove();
      document.documentElement.style.overflow = priorOverflow;
    };

    const syncBranding = () => {
      if (!hasTransitioned && plaque.isConnected) {
        plaque.classList.toggle("is-visible", introVideo.currentTime >= BRANDING_START);
      }
    };
    introVideo.addEventListener("timeupdate", syncBranding);
    introVideo.addEventListener("seeked", syncBranding);
    introVideo.addEventListener("ended", finishExperience, { once: true });
    introVideo.addEventListener("error", finishExperience, { once: true });
    skipButton.addEventListener("click", finishExperience);
    enterButton.addEventListener("click", finishExperience);
    document.addEventListener("keydown", function onKeydown(event) {
      if (event.key === "Escape" && document.getElementById("wt-dussehra-intro")) {
        finishExperience();
        document.removeEventListener("keydown", onKeydown);
      }
    });
    const playPromise = introVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Reveal the site if the intro cannot autoplay; never substitute another video.
        finishExperience();
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();