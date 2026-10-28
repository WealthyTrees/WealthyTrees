/* WealthyTrees Dhanteras intro — isolated festival experience, previewable with ?previewDhanteras=1. */
(() => {
  "use strict";

  const FESTIVAL_DATE = "2026-11-06";
  const SESSION_KEY = "wtDhanterasIntroSeen2026";
  const PREVIEW_MODE = new URLSearchParams(window.location.search).get("previewDhanteras") === "1";
  const AUTO_EXIT_MS = 8800;
  let stopParticles = () => {};

  function indiaDateString() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    const part = (type) => parts.find((item) => item.type === type)?.value || "";
    return part("year") + "-" + part("month") + "-" + part("day");
  }

  function addStyles() {
    if (document.getElementById("wt-dhanteras-intro-style")) return;
    const css = [
      "#wt-dhanteras-intro,#wt-dhanteras-intro *{box-sizing:border-box}",
      "#wt-dhanteras-intro{--wt-d-gold:#f0c66e;--wt-d-cream:#fff4d7;--wt-d-emerald:#0e6547;position:fixed;inset:0;z-index:2147483000;overflow:hidden;isolation:isolate;display:grid;place-items:center;color:var(--wt-d-cream);background:radial-gradient(ellipse at 50% 43%,rgba(39,105,69,.4),transparent 42%),radial-gradient(ellipse at 50% 110%,rgba(209,145,48,.15),transparent 45%),linear-gradient(135deg,#04120c 0%,#09251a 48%,#06170f 100%);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;-webkit-font-smoothing:antialiased}",
      "#wt-dhanteras-intro .wt-d-stage{position:relative;display:grid;place-items:center;width:100%;height:100%;min-height:100vh;min-height:100svh;padding:clamp(24px,5vh,52px) clamp(18px,4vw,56px);overflow:hidden;isolation:isolate}",
      "#wt-dhanteras-intro .wt-d-grain{position:absolute;inset:-40%;z-index:-1;pointer-events:none;opacity:.16;background-image:url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.94' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.24'/%3E%3C/svg%3E\");transform:rotate(-8deg)}",
      "#wt-dhanteras-intro .wt-d-spotlight{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(480px circle at var(--wt-d-mx,50%) var(--wt-d-my,45%),rgba(242,196,105,.12),transparent 72%);transition:background .12s ease-out}",
      "#wt-dhanteras-intro .wt-d-rays{position:absolute;left:50%;top:45%;z-index:0;width:min(105vw,105vh);aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;opacity:.17;background:repeating-conic-gradient(from 0deg,rgba(237,190,95,.16) 0deg 1.1deg,transparent 1.1deg 12deg);mask-image:radial-gradient(circle,transparent 0 23%,#000 42%,transparent 72%);-webkit-mask-image:radial-gradient(circle,transparent 0 23%,#000 42%,transparent 72%);animation:wtDhanterasRayTurn 85s linear infinite}",
      "#wt-dhanteras-intro .wt-d-particle-canvas{position:absolute;inset:0;z-index:1;width:100%;height:100%;pointer-events:none}",
      "#wt-dhanteras-intro .wt-d-topline{position:absolute;z-index:5;top:max(21px,env(safe-area-inset-top));left:clamp(20px,4vw,54px);right:clamp(20px,4vw,54px);display:flex;align-items:center;justify-content:space-between;gap:18px;opacity:0;animation:wtDhanterasFadeUp .8s .2s ease-out forwards}",
      "#wt-dhanteras-intro .wt-d-overline,#wt-dhanteras-intro .wt-d-date{font-size:10px;line-height:1.3;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,241,205,.72)}",
      "#wt-dhanteras-intro .wt-d-date{padding:9px 12px;border:1px solid rgba(240,198,110,.24);border-radius:999px;color:#f4d58f;background:rgba(255,255,255,.035);letter-spacing:.13em;white-space:nowrap}",
      "#wt-dhanteras-intro .wt-d-sidecard{position:absolute;z-index:2;top:50%;width:clamp(150px,18vw,230px);padding:16px 17px;border:1px solid rgba(240,198,110,.18);border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.015));box-shadow:0 16px 60px rgba(0,0,0,.14);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);opacity:0;animation:wtDhanterasSideIn 1s 1.2s cubic-bezier(.2,.75,.2,1) forwards}",
      "#wt-dhanteras-intro .wt-d-sidecard--left{left:clamp(22px,5vw,74px);transform:translateY(calc(-50% + 14px))}",
      "#wt-dhanteras-intro .wt-d-sidecard--right{right:clamp(22px,5vw,74px);transform:translateY(calc(-50% + 14px));animation-delay:1.45s}",
      "#wt-dhanteras-intro .wt-d-side-label{display:block;margin-bottom:13px;color:rgba(255,244,215,.68);font-size:9px;font-weight:800;letter-spacing:.14em;line-height:1.5;text-transform:uppercase}",
      "#wt-dhanteras-intro .wt-d-side-bars{display:flex;align-items:end;gap:6px;height:50px;padding:0 2px 2px;border-bottom:1px solid rgba(240,198,110,.22)}",
      "#wt-dhanteras-intro .wt-d-side-bars i{display:block;flex:1;min-width:4px;border-radius:4px 4px 1px 1px;background:linear-gradient(180deg,#f7dc97,#bb8330);transform-origin:bottom;animation:wtDhanterasBar 1.8s ease-in-out infinite alternate}",
      "#wt-dhanteras-intro .wt-d-side-bars i:nth-child(1){height:24%;animation-delay:-.4s}#wt-dhanteras-intro .wt-d-side-bars i:nth-child(2){height:38%;animation-delay:-1.1s}#wt-dhanteras-intro .wt-d-side-bars i:nth-child(3){height:31%;animation-delay:-.6s}#wt-dhanteras-intro .wt-d-side-bars i:nth-child(4){height:59%;animation-delay:-1.4s}#wt-dhanteras-intro .wt-d-side-bars i:nth-child(5){height:47%;animation-delay:-.8s}#wt-dhanteras-intro .wt-d-side-bars i:nth-child(6){height:79%;animation-delay:-.2s}#wt-dhanteras-intro .wt-d-side-bars i:nth-child(7){height:96%;animation-delay:-1s}",
      "#wt-dhanteras-intro .wt-d-side-foot{display:flex;align-items:center;gap:7px;margin-top:12px;color:rgba(255,244,215,.78);font-size:10px;font-weight:650;letter-spacing:.025em}",
      "#wt-dhanteras-intro .wt-d-side-dot{width:5px;height:5px;flex:none;border-radius:50%;background:#f1c86e;box-shadow:0 0 11px #eebc59}",
      "#wt-dhanteras-intro .wt-d-core{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;width:min(100%,620px);margin-top:10px;text-align:center}",
      "#wt-dhanteras-intro .wt-d-emblem{position:relative;display:grid;place-items:center;width:clamp(190px,25vw,300px);aspect-ratio:1;margin:0 auto clamp(8px,1.8vh,18px);opacity:0;transform:translateY(15px) scale(.82);animation:wtDhanterasEmblemIn 1.45s .25s cubic-bezier(.16,.82,.24,1) forwards}",
      "#wt-dhanteras-intro .wt-d-mandala{position:absolute;inset:0;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 0 12px rgba(236,183,78,.15))}",
      "#wt-dhanteras-intro .wt-d-ring{fill:none;stroke:url(#wtDhanterasGold);stroke-width:1.1;stroke-dasharray:2 8;stroke-linecap:round;transform-origin:160px 160px;animation:wtDhanterasRingDash 28s linear infinite}",
      "#wt-dhanteras-intro .wt-d-petal-ring{fill:rgba(238,190,95,.025);stroke:rgba(244,201,116,.64);stroke-width:1.15;transform-origin:160px 160px;stroke-dasharray:2 5;animation:wtDhanterasPetalTurn 55s linear infinite}",
      "#wt-dhanteras-intro .wt-d-inner-ring{fill:none;stroke:rgba(240,198,110,.3);stroke-width:1;stroke-dasharray:1 6}",
      "#wt-dhanteras-intro .wt-d-lamp{position:relative;z-index:2;display:grid;place-items:center;width:51%;aspect-ratio:1;filter:drop-shadow(0 0 32px rgba(228,163,55,.2));animation:wtDhanterasLampFloat 4.5s 1.5s ease-in-out infinite}",
      "#wt-dhanteras-intro .wt-d-lamp svg{display:block;width:100%;height:auto;overflow:visible}",
      "#wt-dhanteras-intro .wt-d-flame{transform-origin:60px 43px;animation:wtDhanterasFlame 1.65s ease-in-out infinite}",
      "#wt-dhanteras-intro .wt-d-lamp-glow{position:absolute;width:65%;height:56%;top:6%;left:17.5%;border-radius:50%;background:#ffd875;filter:blur(28px);opacity:.13;animation:wtDhanterasFlameGlow 2.4s ease-in-out infinite}",
      "#wt-dhanteras-intro .wt-d-kicker{margin:0 0 13px;color:#e6bf6d;font-size:10px;font-weight:850;letter-spacing:.25em;text-transform:uppercase;opacity:0;animation:wtDhanterasFadeUp .72s 1.15s ease-out forwards}",
      "#wt-dhanteras-intro .wt-d-title{max-width:100%;margin:0;color:#fff4d8;font-family:Fraunces,Georgia,serif;font-size:clamp(38px,5.3vw,72px);font-weight:600;line-height:.99;letter-spacing:-.055em;text-wrap:balance;text-shadow:0 7px 35px rgba(0,0,0,.22);opacity:0;transform:translateY(18px);animation:wtDhanterasTitleIn 1s 1.35s cubic-bezier(.16,.82,.24,1) forwards}",
      "#wt-dhanteras-intro .wt-d-title em{color:#eec773;font-weight:600;font-style:normal;text-shadow:0 0 30px rgba(236,187,93,.16)}",
      "#wt-dhanteras-intro .wt-d-copy{max-width:430px;margin:17px auto 0;color:rgba(255,244,218,.72);font-size:clamp(13px,1.15vw,15px);font-weight:450;line-height:1.65;letter-spacing:.005em;opacity:0;animation:wtDhanterasFadeUp .8s 1.9s ease-out forwards}",
      "#wt-dhanteras-intro .wt-d-brand{display:flex;align-items:center;justify-content:center;gap:11px;margin-top:clamp(22px,3vh,34px);padding:9px 17px 9px 10px;border:1px solid rgba(240,198,110,.28);border-radius:999px;background:rgba(4,24,15,.35);box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 12px 28px rgba(0,0,0,.1);opacity:0;transform:translateY(8px) scale(.97);animation:wtDhanterasBrandIn .85s 2.4s cubic-bezier(.2,.8,.2,1) forwards}",
      "#wt-dhanteras-intro .wt-d-brand img{display:block;width:42px;height:42px;flex:none;object-fit:contain;filter:drop-shadow(0 0 9px rgba(67,205,140,.15))}",
      "#wt-dhanteras-intro .wt-d-brand span{color:#f8e7bd;font-size:15px;font-weight:800;letter-spacing:-.025em;white-space:nowrap}",
      "#wt-dhanteras-intro .wt-d-actions{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:clamp(18px,2.5vh,27px);opacity:0;animation:wtDhanterasFadeUp .7s 3.05s ease-out forwards}",
      "#wt-dhanteras-intro .wt-d-enter{display:inline-flex;align-items:center;justify-content:center;gap:14px;min-height:49px;padding:0 23px;border:1px solid rgba(255,239,191,.8);border-radius:999px;background:linear-gradient(115deg,#f8df9d,#d7a54b 54%,#f1d28a);color:#12291c;font:800 12px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.015em;box-shadow:0 0 0 4px rgba(236,190,96,.07),0 8px 32px rgba(206,153,51,.16);cursor:pointer;transition:transform .25s ease,box-shadow .25s ease,filter .25s ease;-webkit-tap-highlight-color:transparent}",
      "#wt-dhanteras-intro .wt-d-enter svg{width:15px;height:15px;transition:transform .25s ease}",
      "#wt-dhanteras-intro .wt-d-enter:hover{transform:translateY(-2px);filter:brightness(1.04);box-shadow:0 0 0 5px rgba(236,190,96,.1),0 14px 40px rgba(206,153,51,.24)}#wt-dhanteras-intro .wt-d-enter:hover svg{transform:translateX(3px)}",
      "#wt-dhanteras-intro .wt-d-enter:active{transform:translateY(0) scale(.985)}",
      "#wt-dhanteras-intro .wt-d-skip{position:absolute;z-index:10;top:max(19px,env(safe-area-inset-top));right:clamp(20px,4vw,54px);display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;border:1px solid rgba(255,245,218,.2);border-radius:999px;background:rgba(255,255,255,.035);color:rgba(255,244,218,.82);font:650 11px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.025em;cursor:pointer;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:border-color .2s,color .2s,background .2s}",
      "#wt-dhanteras-intro .wt-d-skip:hover{border-color:rgba(240,198,110,.55);color:#fff5d8;background:rgba(255,255,255,.08)}",
      "#wt-dhanteras-intro button:focus-visible{outline:2px solid #ffe4a1;outline-offset:4px}",
      "#wt-dhanteras-intro .wt-d-bottom{position:absolute;z-index:4;left:20px;right:20px;bottom:max(18px,env(safe-area-inset-bottom));display:flex;justify-content:center;gap:8px;color:rgba(255,241,211,.38);font-size:9px;font-weight:700;letter-spacing:.14em;text-align:center;text-transform:uppercase;opacity:0;animation:wtDhanterasFadeUp .8s 3.4s ease-out forwards}",
      "#wt-dhanteras-intro .wt-d-bottom b{color:rgba(240,198,110,.65);font-weight:700}",
      "#wt-dhanteras-intro.is-lifting{animation:wtDhanterasCurtainOut .78s cubic-bezier(.7,0,.85,.35) forwards;pointer-events:none}",
      "#wt-dhanteras-intro.is-lifting .wt-d-stage{transform:scale(1.025);filter:brightness(1.12);transition:transform .78s ease,filter .78s ease}",
      "#wt-dhanteras-intro .wt-d-emblem:after{content:'';position:absolute;inset:14%;border-radius:50%;border:1px solid rgba(255,222,145,.22);box-shadow:0 0 38px rgba(241,188,80,.09);animation:wtDhanterasHalo 3.8s 1.4s ease-in-out infinite}",
      "@keyframes wtDhanterasRayTurn{to{transform:translate(-50%,-50%) rotate(360deg)}}",
      "@keyframes wtDhanterasRingDash{to{stroke-dashoffset:-160}}",
      "@keyframes wtDhanterasPetalTurn{to{transform:rotate(360deg)}}",
      "@keyframes wtDhanterasFlame{0%,100%{transform:rotate(-2deg) scale(1,1)}35%{transform:rotate(2.8deg) scale(.94,1.06)}65%{transform:rotate(-1deg) scale(1.04,.97)}}",
      "@keyframes wtDhanterasFlameGlow{0%,100%{opacity:.1;transform:scale(.9)}50%{opacity:.24;transform:scale(1.12)}}",
      "@keyframes wtDhanterasLampFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}",
      "@keyframes wtDhanterasEmblemIn{to{opacity:1;transform:translateY(0) scale(1)}}",
      "@keyframes wtDhanterasTitleIn{to{opacity:1;transform:translateY(0)}}",
      "@keyframes wtDhanterasBrandIn{to{opacity:1;transform:translateY(0) scale(1)}}",
      "@keyframes wtDhanterasFadeUp{to{opacity:1;transform:translateY(0)}}",
      "@keyframes wtDhanterasSideIn{to{opacity:1;transform:translateY(-50%)}}",
      "@keyframes wtDhanterasBar{to{transform:scaleY(.78);filter:brightness(.8)}}",
      "@keyframes wtDhanterasHalo{0%,100%{transform:scale(.97);opacity:.4}50%{transform:scale(1.055);opacity:.9}}",
      "@keyframes wtDhanterasCurtainOut{to{opacity:0;visibility:hidden;transform:translateY(-2.5%) scale(1.018)}}",
      "@media(max-width:760px){#wt-dhanteras-intro .wt-d-sidecard{display:none}#wt-dhanteras-intro .wt-d-core{margin-top:0}#wt-dhanteras-intro .wt-d-emblem{width:clamp(172px,47vw,240px);margin-bottom:7px}#wt-dhanteras-intro .wt-d-title{font-size:clamp(39px,10.2vw,60px)}#wt-dhanteras-intro .wt-d-copy{max-width:300px;margin-top:14px;font-size:13px}#wt-dhanteras-intro .wt-d-brand{margin-top:22px}#wt-dhanteras-intro .wt-d-actions{margin-top:19px}#wt-dhanteras-intro .wt-d-bottom{font-size:8px;letter-spacing:.09em}}",
      "@media(max-width:390px){#wt-dhanteras-intro .wt-d-topline{left:16px;right:16px}#wt-dhanteras-intro .wt-d-overline{font-size:8px;letter-spacing:.12em}#wt-dhanteras-intro .wt-d-date{padding:8px 9px;font-size:8px}#wt-dhanteras-intro .wt-d-title{font-size:38px}#wt-dhanteras-intro .wt-d-emblem{width:165px}#wt-dhanteras-intro .wt-d-brand{margin-top:18px}#wt-dhanteras-intro .wt-d-actions{margin-top:16px}}",
      "@media(max-height:720px) and (min-width:761px){#wt-dhanteras-intro .wt-d-emblem{width:190px;margin-bottom:0}#wt-dhanteras-intro .wt-d-title{font-size:clamp(38px,5vw,58px)}#wt-dhanteras-intro .wt-d-copy{margin-top:10px}#wt-dhanteras-intro .wt-d-brand{margin-top:14px}#wt-dhanteras-intro .wt-d-actions{margin-top:12px}}",
      "@media(prefers-reduced-motion:reduce){#wt-dhanteras-intro *,#wt-dhanteras-intro *:before,#wt-dhanteras-intro *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}#wt-dhanteras-intro .wt-d-particle-canvas{display:none}}"
    ].join("\n");
    const style = document.createElement("style");
    style.id = "wt-dhanteras-intro-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function initParticles(overlay) {
    const canvas = overlay.querySelector(".wt-d-particle-canvas");
    if (!canvas || !canvas.getContext) return;
    let context;
    try { context = canvas.getContext("2d"); } catch (_) { return; }
    if (!context) return;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let particles = [];
    let frame = 0;
    let active = true;

    function resize() {
      ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(92, Math.max(36, Math.round(width / 15)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: .45 + Math.random() * 1.7,
        speed: .12 + Math.random() * .48,
        drift: (Math.random() - .5) * .26,
        phase: Math.random() * Math.PI * 2,
        alpha: .16 + Math.random() * .68
      }));
    }

    function draw() {
      if (!active) return;
      context.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.phase += .012;
        p.y -= p.speed;
        p.x += p.drift + Math.sin(p.phase) * .18;
        if (p.y < -10) { p.y = height + 8; p.x = Math.random() * width; }
        if (p.x < -8) p.x = width + 6;
        if (p.x > width + 8) p.x = -6;
        context.beginPath();
        context.fillStyle = "rgba(244,201,117," + p.alpha.toFixed(3) + ")";
        context.shadowColor = "rgba(245,197,99,.7)";
        context.shadowBlur = p.radius * 3;
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.shadowBlur = 0;
      frame = window.requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    frame = window.requestAnimationFrame(draw);
    stopParticles = () => {
      active = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      context.clearRect(0, 0, width, height);
      stopParticles = () => {};
    };
  }

  function init() {
    if (!PREVIEW_MODE && indiaDateString() !== FESTIVAL_DATE) return;
    if (!PREVIEW_MODE && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (!PREVIEW_MODE && sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch (_) {}
    if (document.getElementById("wt-dhanteras-intro")) return;

    addStyles();
    const overlay = document.createElement("section");
    overlay.id = "wt-dhanteras-intro";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "WealthyTrees Dhanteras celebration intro");
    overlay.innerHTML = '<div class="wt-d-stage"><div class="wt-d-grain" aria-hidden="true"></div><div class="wt-d-spotlight" aria-hidden="true"></div><div class="wt-d-rays" aria-hidden="true"></div><canvas class="wt-d-particle-canvas" aria-hidden="true"></canvas><div class="wt-d-topline"><span class="wt-d-overline">WealthyTrees presents</span><span class="wt-d-date">Dhanteras &middot; 2026</span></div><div class="wt-d-sidecard wt-d-sidecard--left" aria-hidden="true"><span class="wt-d-side-label">Understand the markets</span><div class="wt-d-side-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="wt-d-side-foot"><span class="wt-d-side-dot"></span>Knowledge grows here</div></div><div class="wt-d-sidecard wt-d-sidecard--right" aria-hidden="true"><span class="wt-d-side-label">Build better money habits</span><div class="wt-d-side-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="wt-d-side-foot"><span class="wt-d-side-dot"></span>Learn. Grow. Repeat.</div></div><main class="wt-d-core"><div class="wt-d-emblem" aria-hidden="true"><svg class="wt-d-mandala" viewBox="0 0 320 320" focusable="false"><defs><linearGradient id="wtDhanterasGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1ba"/><stop offset=".52" stop-color="#e6b453"/><stop offset="1" stop-color="#9d6b22"/></linearGradient></defs><circle class="wt-d-ring" cx="160" cy="160" r="144"></circle><circle class="wt-d-ring" cx="160" cy="160" r="132"></circle><circle class="wt-d-inner-ring" cx="160" cy="160" r="119"></circle><g class="wt-d-petal-ring"><ellipse cx="160" cy="45" rx="13" ry="32"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(22.5 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(45 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(67.5 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(90 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(112.5 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(135 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(157.5 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(180 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(202.5 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(225 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(247.5 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(270 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(292.5 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(315 160 160)"></ellipse><ellipse cx="160" cy="45" rx="13" ry="32" transform="rotate(337.5 160 160)"></ellipse></g><circle class="wt-d-inner-ring" cx="160" cy="160" r="77"></circle><circle cx="160" cy="160" r="62" fill="none" stroke="rgba(240,198,110,.18)" stroke-width="1"></circle></svg><div class="wt-d-lamp"><div class="wt-d-lamp-glow"></div><svg viewBox="0 0 120 100" role="img" aria-label="A glowing golden diya"><defs><linearGradient id="wtDhanterasBowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe8a4"/><stop offset=".45" stop-color="#d99a32"/><stop offset="1" stop-color="#78491c"/></linearGradient><linearGradient id="wtDhanterasFlame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f08b27"/><stop offset=".6" stop-color="#ffd778"/><stop offset="1" stop-color="#fff9dc"/></linearGradient></defs><ellipse cx="60" cy="83" rx="31" ry="5" fill="#000" opacity=".2"></ellipse><path d="M29 59 Q60 72 91 59 L82 77 Q60 86 38 77 Z" fill="url(#wtDhanterasBowl)" stroke="#ffe3a0" stroke-opacity=".78" stroke-width="1.1"></path><path d="M30 59 Q60 70 90 59" fill="none" stroke="#fff0b8" stroke-width="2.3" stroke-linecap="round"></path><path class="wt-d-flame" d="M60 13 C46 27 47 40 54 49 C56 52 58 53 60 54 C69 49 75 41 71 30 C69 24 64 18 60 13 Z" fill="url(#wtDhanterasFlame)" stroke="#fff1bb" stroke-width=".8"></path><path d="M60 35 C54 42 56 48 60 50 C65 46 65 41 60 35 Z" fill="#fff9dc" opacity=".92"></path><path d="M49 58 L45 66" stroke="#ffd77d" stroke-width="1.8" stroke-linecap="round"></path></svg></div></div><p class="wt-d-kicker">An auspicious beginning</p><h1 class="wt-d-title">Let knowledge<br><em>light your wealth.</em></h1><p class="wt-d-copy">Warm wishes on Dhanteras. May this season bring clarity, confidence, and a brighter financial future.</p><div class="wt-d-brand"><img src="/assets/logo.svg" alt="WealthyTrees money-tree logo" width="42" height="42"><span>WealthyTrees</span></div><div class="wt-d-actions"><button class="wt-d-enter" type="button">Explore WealthyTrees <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"></path></svg></button></div></main><div class="wt-d-bottom" aria-hidden="true"><span>Markets, simplified</span><b>&middot;</b><span>Learning without the noise</span><b>&middot;</b><span>WealthyTrees</span></div><button class="wt-d-skip" type="button" aria-label="Skip Dhanteras intro">Skip intro <span aria-hidden="true">&times;</span></button></div>';
    document.body.appendChild(overlay);

    const priorOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    let finished = false;
    let exitTimer = 0;
    const skipButton = overlay.querySelector(".wt-d-skip");
    const enterButton = overlay.querySelector(".wt-d-enter");
    const spotlight = overlay.querySelector(".wt-d-spotlight");

    function finishExperience() {
      if (finished) return;
      finished = true;
      if (exitTimer) window.clearTimeout(exitTimer);
      stopParticles();
      try { if (!PREVIEW_MODE) sessionStorage.setItem(SESSION_KEY, "1"); } catch (_) {}
      overlay.classList.add("is-lifting");
      document.removeEventListener("keydown", onKeydown);
      window.removeEventListener("pointermove", onPointerMove);
      window.setTimeout(() => {
        overlay.remove();
        document.documentElement.style.overflow = priorOverflow;
      }, 800);
    }

    function onKeydown(event) {
      if (event.key === "Escape" && overlay.isConnected) finishExperience();
    }

    function onPointerMove(event) {
      if (!spotlight || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const x = Math.round(event.clientX / Math.max(1, window.innerWidth) * 100);
      const y = Math.round(event.clientY / Math.max(1, window.innerHeight) * 100);
      overlay.style.setProperty("--wt-d-mx", x + "%");
      overlay.style.setProperty("--wt-d-my", y + "%");
    }

    skipButton.addEventListener("click", finishExperience);
    enterButton.addEventListener("click", finishExperience);
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    initParticles(overlay);
    try { skipButton.focus({ preventScroll: true }); } catch (_) { skipButton.focus(); }
    exitTimer = window.setTimeout(finishExperience, AUTO_EXIT_MS);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();