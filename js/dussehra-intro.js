/* WealthyTrees Dussehra intro — Hindi, responsive, date-gated, with preview mode. */
(() => {
  "use strict";
  const FESTIVAL_DATE = "2026-10-20";
  const SESSION_KEY = "wtDussehraIntroSeen2026";
  // IMPORTANT: The actual video already lives at this path in the repository.
  const VIDEO_URL = "/assets/dussehra-intro.mp4";
  const PREVIEW_MODE = new URLSearchParams(window.location.search).get("previewDussehra") === "1";

  function indiaDateString() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
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
      #wt-dussehra-intro { position:fixed; inset:0; z-index:2147483000; overflow:hidden; display:grid; place-items:center; background:#071e16; color:#fff8e8; font-family:"Noto Sans Devanagari","Mangal",system-ui,sans-serif; isolation:isolate; }
      #wt-dussehra-intro .wt-video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; background:#071e16; }
      #wt-dussehra-intro .wt-shade { position:absolute; inset:0; background:linear-gradient(180deg,rgba(3,18,12,.25),rgba(3,18,12,.08) 34%,rgba(3,18,12,.82)); pointer-events:none; }
      #wt-dussehra-intro .wt-top { position:absolute; z-index:3; top:max(18px,env(safe-area-inset-top)); left:clamp(16px,4vw,48px); display:flex; align-items:center; gap:12px; padding:9px 16px 9px 10px; border:1px solid #fff5; border-radius:999px; background:#06251bcc; backdrop-filter:blur(12px); box-shadow:0 8px 28px #0003; }
      #wt-dussehra-intro .wt-logo { width:48px; height:48px; object-fit:contain; border-radius:50%; background:#fff; padding:3px; }
      #wt-dussehra-intro .wt-brand { font-size:14px; font-weight:800; line-height:1.25; letter-spacing:.01em; }
      #wt-dussehra-intro .wt-brand small { display:block; margin-top:3px; font-size:10px; font-weight:600; letter-spacing:.13em; color:#f4d88b; }
      #wt-dussehra-intro .wt-copy { position:relative; z-index:2; align-self:end; width:min(940px,100%); padding:30px 22px max(42px,env(safe-area-inset-bottom)); text-align:center; animation:wtDussehraRise .8s ease both; }
      #wt-dussehra-intro .wt-eyebrow { margin:0 0 14px; color:#f8d982; font-size:clamp(11px,1.5vw,14px); font-weight:800; letter-spacing:.13em; }
      #wt-dussehra-intro h1 { margin:0 auto 16px; font-weight:800; font-size:clamp(34px,7.2vw,72px); line-height:1.2; letter-spacing:-.025em; text-wrap:balance; text-shadow:0 4px 25px #0008; }
      #wt-dussehra-intro h1 em { color:#f8d982; font-style:normal; }
      #wt-dussehra-intro .wt-subtitle { max-width:720px; margin:0 auto 25px; color:#fff8e8; font-size:clamp(15px,2vw,21px); line-height:1.8; text-shadow:0 2px 14px #0008; }
      #wt-dussehra-intro .wt-actions { display:flex; justify-content:center; flex-wrap:wrap; gap:12px; }
      #wt-dussehra-intro button { min-height:50px; border-radius:999px; padding:13px 25px; font:inherit; font-size:15px; font-weight:800; cursor:pointer; transition:transform .18s ease,filter .18s ease; }
      #wt-dussehra-intro button:hover { transform:translateY(-2px); filter:brightness(1.04); }
      #wt-dussehra-intro .wt-enter { color:#123b29; border:0; background:linear-gradient(135deg,#ffe9a8,#e8b747); box-shadow:0 10px 30px #0004; }
      #wt-dussehra-intro .wt-skip { position:absolute; z-index:4; top:max(18px,env(safe-area-inset-top)); right:max(18px,env(safe-area-inset-right)); color:#fff8e8; border:1px solid #ffffff85; background:#06291dcc; backdrop-filter:blur(8px); }
      #wt-dussehra-intro button:focus-visible { outline:3px solid #fff; outline-offset:4px; }
      #wt-dussehra-intro .wt-error { position:relative; z-index:5; margin:0 18px 18px; padding:10px 14px; border-radius:12px; background:#7f1d1d; color:white; font-size:13px; }
      @keyframes wtDussehraRise { from {opacity:0;transform:translateY(14px)} to {opacity:1;transform:translateY(0)} }
      @media(max-width:600px) {
        #wt-dussehra-intro .wt-top { left:12px; top:max(12px,env(safe-area-inset-top)); gap:8px; padding:6px 12px 6px 6px; }
        #wt-dussehra-intro .wt-logo { width:38px; height:38px; }
        #wt-dussehra-intro .wt-brand { font-size:12px; }
        #wt-dussehra-intro .wt-brand small { font-size:8px; }
        #wt-dussehra-intro .wt-skip { top:max(12px,env(safe-area-inset-top)); right:12px; padding:10px 13px; font-size:12px; }
        #wt-dussehra-intro .wt-copy { padding-left:18px; padding-right:18px; padding-bottom:max(30px,env(safe-area-inset-bottom)); }
        #wt-dussehra-intro .wt-actions { flex-direction:column; align-items:center; }
        #wt-dussehra-intro .wt-actions button { width:min(100%,320px); }
      }
      @media(prefers-reduced-motion:reduce) { #wt-dussehra-intro .wt-copy { animation:none; } #wt-dussehra-intro button { transition:none; } }
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (!PREVIEW_MODE && indiaDateString() !== FESTIVAL_DATE) return;
    if (!PREVIEW_MODE && sessionStorage.getItem(SESSION_KEY) === "1") return;
    if (document.getElementById("wt-dussehra-intro")) return;

    addStyles();
    const overlay = document.createElement("section");
    overlay.id = "wt-dussehra-intro";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "दशहरा उत्सव परिचय");
    overlay.innerHTML = `
      <video class="wt-video" autoplay muted loop playsinline preload="auto" aria-label="दशहरा उत्सव का वीडियो">
        <source src="${VIDEO_URL}" type="video/mp4">
      </video>
      <div class="wt-shade"></div>
      <div class="wt-top">
        <img class="wt-logo" src="/assets/logo.svg" alt="WealthyTrees का लोगो">
        <div class="wt-brand">WealthyTrees<small>प्राइवेट लिमिटेड</small></div>
      </div>
      <button class="wt-skip" type="button">परिचय छोड़ें</button>
      <div class="wt-copy">
        <p class="wt-eyebrow">✨ विजयादशमी की हार्दिक शुभकामनाएँ ✨</p>
        <h1>आपके जीवन में<br><em>समृद्धि और खुशियाँ</em> आएँ</h1>
        <p class="wt-subtitle">बुराई पर अच्छाई की विजय का यह पावन पर्व आपके परिवार में सुख, शांति, सफलता और नई संभावनाएँ लेकर आए।<br>आपके विश्वास और साथ के लिए हृदय से धन्यवाद।</p>
        <div class="wt-actions"><button class="wt-enter" type="button">वेबसाइट पर आगे बढ़ें</button></div>
      </div>
    `;
    document.body.appendChild(overlay);
    const video = overlay.querySelector("video");
    document.documentElement.style.overflow = "hidden";

    const showVideoError = () => {
      if (overlay.querySelector(".wt-error")) return;
      const note = document.createElement("p");
      note.className = "wt-error";
      note.textContent = "वीडियो लोड नहीं हो पाया। कृपया इंटरनेट कनेक्शन जाँचें या कुछ देर बाद पुनः प्रयास करें।";
      overlay.appendChild(note);
    };
    video.addEventListener("error", showVideoError, { once: true });
    video.addEventListener("loadeddata", () => {
      const note = overlay.querySelector(".wt-error");
      if (note) note.remove();
    }, { once: true });

    const dismiss = () => {
      if (!PREVIEW_MODE) sessionStorage.setItem(SESSION_KEY, "1");
      video.pause();
      overlay.remove();
      document.documentElement.style.overflow = "";
    };
    overlay.querySelector(".wt-skip").addEventListener("click", dismiss);
    overlay.querySelector(".wt-enter").addEventListener("click", dismiss);
    video.play().catch(() => {
      // Muted autoplay is attempted; controls remain available if the browser blocks it.
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
