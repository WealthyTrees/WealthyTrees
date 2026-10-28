/* WealthyTrees Dhanteras cinematic intro — 15-second story.
   Preview: ?previewDhanteras=1. Isolated until approved. */
(() => {
  "use strict";

  const FESTIVAL_DATE = "2026-11-06";
  const SESSION_KEY = "wtDhanterasIntroSeen2026";
  const PREVIEW_MODE = new URLSearchParams(window.location.search).get("previewDhanteras") === "1";
  const INTRO_DURATION = 15000;
  const REMOVE_DURATION = 520;
  let stopParticles = () => {};

  function indiaDateString() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const part = (type) => parts.find((item) => item.type === type)?.value || "";
    return part("year") + "-" + part("month") + "-" + part("day");
  }

  function addStyles() {
    if (document.getElementById("wt-dhanteras-intro-style")) return;
    const css = [
      '#wt-dhanteras-intro,#wt-dhanteras-intro *{box-sizing:border-box}',
      '#wt-dhanteras-intro{position:fixed;inset:0;z-index:2147483000;overflow:hidden;isolation:isolate;color:#fff3d2;background:#04130d;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}',
      '#wt-dhanteras-intro .wt-dh-stage{position:relative;isolation:isolate;display:block;width:100%;height:100%;min-height:100vh;min-height:100svh;overflow:hidden;background:radial-gradient(ellipse at 50% 43%,rgba(36,109,66,.56),transparent 44%),radial-gradient(ellipse at 50% 105%,rgba(205,130,36,.18),transparent 46%),linear-gradient(125deg,#03110b 0%,#0b281b 49%,#05170f 100%)}',
      '#wt-dhanteras-intro .wt-dh-stage:before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,transparent 0%,rgba(0,0,0,.03) 48%,rgba(0,0,0,.54) 100%),repeating-linear-gradient(115deg,transparent 0 95px,rgba(242,199,111,.018) 96px 97px,transparent 98px 195px)}',
      '#wt-dhanteras-intro .wt-dh-stage:after{content:"";position:absolute;inset:12px;z-index:8;border:1px solid rgba(234,195,107,.14);pointer-events:none;mask-image:linear-gradient(#000,transparent 18%,transparent 82%,#000);-webkit-mask-image:linear-gradient(#000,transparent 18%,transparent 82%,#000)}',
      '#wt-dhanteras-intro .wt-dh-rays{position:absolute;left:50%;top:43%;z-index:0;width:min(105vw,105vh);aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);opacity:.18;background:repeating-conic-gradient(from 0deg,rgba(242,196,105,.17) 0deg 1deg,transparent 1deg 10deg);mask-image:radial-gradient(circle,transparent 0 17%,#000 42%,transparent 73%);-webkit-mask-image:radial-gradient(circle,transparent 0 17%,#000 42%,transparent 73%);animation:wtDhRays 70s linear infinite}',
      '#wt-dhanteras-intro .wt-dh-mandala{position:absolute;left:50%;top:43%;z-index:0;width:min(78vw,75vh);aspect-ratio:1;transform:translate(-50%,-50%);border:1px solid rgba(237,194,98,.17);border-radius:50%;box-shadow:0 0 0 15px rgba(237,194,98,.018),0 0 0 31px rgba(237,194,98,.025),0 0 80px rgba(222,166,61,.09);animation:wtDhHalo 5s ease-in-out infinite}',
      '#wt-dhanteras-intro .wt-dh-mandala:before,#wt-dhanteras-intro .wt-dh-mandala:after{content:"";position:absolute;inset:8%;border:1px dashed rgba(248,211,126,.35);border-radius:50%;transform:rotate(18deg)}',
      '#wt-dhanteras-intro .wt-dh-mandala:after{inset:18%;border:1px solid rgba(248,211,126,.13);transform:rotate(-24deg)}',
      '#wt-dhanteras-intro .wt-d-particle-canvas{position:absolute;inset:0;z-index:1;width:100%;height:100%;pointer-events:none}',
      '#wt-dhanteras-intro .wt-d-header{position:absolute;z-index:9;top:max(25px,env(safe-area-inset-top));left:clamp(24px,5vw,70px);right:clamp(165px,15vw,230px);display:flex;align-items:center;justify-content:space-between;gap:12px;opacity:0;animation:wtDhFade .7s .1s ease-out forwards}',
      '#wt-dhanteras-intro .wt-d-overline{color:rgba(255,240,203,.74);font-size:10px;font-weight:800;letter-spacing:.22em;text-transform:uppercase}',
      '#wt-dhanteras-intro .wt-d-date{padding:8px 12px;border:1px solid rgba(240,198,110,.24);border-radius:999px;background:rgba(3,20,12,.45);color:#f5d48c;font-size:9px;font-weight:800;letter-spacing:.15em;white-space:nowrap}',
      '#wt-dhanteras-intro .wt-d-skip{position:absolute;z-index:12;top:max(18px,env(safe-area-inset-top));right:clamp(22px,4.2vw,58px);display:flex;align-items:center;gap:8px;min-height:40px;padding:0 13px;border:1px solid rgba(255,242,210,.21);border-radius:999px;background:rgba(255,255,255,.045);color:rgba(255,244,218,.84);font:700 11px/1 Inter,ui-sans-serif,system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:background .2s,border-color .2s}',
      '#wt-dhanteras-intro .wt-d-skip:hover{background:rgba(255,255,255,.1);border-color:rgba(240,198,110,.55)}',
      '#wt-dhanteras-intro .wt-d-skip:focus-visible,#wt-dhanteras-intro .wt-d-enter:focus-visible{outline:2px solid #ffe5a2;outline-offset:4px}',
      '#wt-dhanteras-intro .wt-d-skip svg{width:12px;height:12px}',
      '#wt-dhanteras-intro .wt-d-art{position:absolute;z-index:3;left:50%;top:43%;width:min(70vw,700px);height:min(65vh,610px);transform:translate(-50%,-50%);display:grid;place-items:center}',
      '#wt-dhanteras-intro .wt-d-lakshmi{position:absolute;display:block;width:auto;height:min(61vh,570px);max-width:min(80vw,530px);object-fit:contain;opacity:0;transform:translateY(37px) scale(.86);filter:drop-shadow(0 0 20px rgba(238,184,76,.1));transition:opacity 1.25s ease,transform 1.45s cubic-bezier(.18,.75,.2,1),filter 1s ease;animation:wtDhBlessing 4.5s ease-in-out infinite;animation-play-state:paused}',
      '#wt-dhanteras-intro[data-beat="2"] .wt-d-lakshmi,#wt-dhanteras-intro[data-beat="3"] .wt-d-lakshmi{opacity:1;transform:translateY(0) scale(1);animation-play-state:running;filter:drop-shadow(0 0 29px rgba(238,184,76,.2))}',
      '#wt-dhanteras-intro[data-beat="4"] .wt-d-lakshmi{opacity:.36;transform:translateY(-46px) scale(.78);animation-play-state:paused;filter:drop-shadow(0 0 44px rgba(238,184,76,.25))}',
      '#wt-dhanteras-intro .wt-d-diya-intro{position:absolute;display:grid;place-items:center;width:clamp(170px,21vw,255px);aspect-ratio:1;opacity:0;transform:translateY(17px) scale(.74);transition:opacity .8s ease,transform 1.1s cubic-bezier(.15,.8,.25,1);filter:drop-shadow(0 0 35px rgba(239,176,63,.16))}',
      '#wt-dhanteras-intro[data-beat="1"] .wt-d-diya-intro{opacity:1;transform:translateY(0) scale(1)}',
      '#wt-dhanteras-intro .wt-d-diya-intro svg{display:block;width:100%;height:100%;overflow:visible}',
      '#wt-dhanteras-intro .wt-d-flame{transform-origin:128px 91px;animation:wtDhFlame 1.15s ease-in-out infinite}',
      '#wt-dhanteras-intro .wt-d-flame-glow{transform-origin:128px 104px;animation:wtDhFlameGlow 2s ease-in-out infinite}',
      '#wt-dhanteras-intro .wt-d-copy{position:absolute;z-index:7;left:20px;right:20px;bottom:clamp(86px,11.5vh,132px);display:flex;flex-direction:column;align-items:center;text-align:center;opacity:0;visibility:hidden;transform:translateY(23px) scale(.985);pointer-events:none}',
      '#wt-dhanteras-intro[data-beat="1"] .wt-d-copy--1,#wt-dhanteras-intro[data-beat="2"] .wt-d-copy--2,#wt-dhanteras-intro[data-beat="3"] .wt-d-copy--3,#wt-dhanteras-intro[data-beat="4"] .wt-d-copy--4{visibility:visible;animation:wtDhCopyIn .78s .18s cubic-bezier(.16,.8,.24,1) forwards}',
      '#wt-dhanteras-intro .wt-d-kicker{margin:0 0 12px;color:#e8bd68;font-size:10px;font-weight:850;letter-spacing:.24em;line-height:1.4;text-transform:uppercase}',
      '#wt-dhanteras-intro .wt-d-headline{max-width:900px;margin:0;color:#fff4d9;font-family:Fraunces,Georgia,"Times New Roman",serif;font-size:clamp(36px,5.25vw,70px);font-weight:600;line-height:1.03;letter-spacing:-.055em;text-wrap:balance;text-shadow:0 8px 34px rgba(0,0,0,.28)}',
      '#wt-dhanteras-intro .wt-d-headline em{color:#efc56e;font-weight:600;font-style:normal;text-shadow:0 0 30px rgba(241,190,89,.22)}',
      '#wt-dhanteras-intro .wt-d-description{max-width:550px;margin:13px auto 0;color:rgba(255,244,218,.75);font-size:clamp(12px,1.2vw,15px);font-weight:450;line-height:1.65}',
      '#wt-dhanteras-intro .wt-d-final{position:absolute;z-index:8;left:50%;top:50%;display:flex;flex-direction:column;align-items:center;text-align:center;opacity:0;visibility:hidden;transform:translate(-50%,-43%) scale(.96);width:min(94vw,820px);pointer-events:none}',
      '#wt-dhanteras-intro[data-beat="4"] .wt-d-final{visibility:visible;animation:wtDhFinalIn .9s .05s cubic-bezier(.16,.8,.24,1) forwards}',
      '#wt-dhanteras-intro .wt-d-final-mark{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:18px;padding:9px 19px 9px 10px;border:1px solid rgba(245,207,122,.34);border-radius:999px;background:rgba(3,19,12,.7);box-shadow:0 10px 38px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.04);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}',
      '#wt-dhanteras-intro .wt-d-final-mark img{display:block;width:47px;height:47px;flex:none;object-fit:contain;filter:drop-shadow(0 0 12px rgba(63,219,148,.22))}',
      '#wt-dhanteras-intro .wt-d-final-mark span{color:#fbebc4;font-size:16px;font-weight:850;letter-spacing:-.03em;white-space:nowrap}',
      '#wt-dhanteras-intro .wt-d-final-kicker{margin:0 0 9px;color:#efc56e;font-size:10px;font-weight:850;letter-spacing:.24em;text-transform:uppercase}',
      '#wt-dhanteras-intro .wt-d-final-title{margin:0;color:#fff4d8;font-family:Fraunces,Georgia,serif;font-size:clamp(40px,7vw,88px);font-weight:650;line-height:.98;letter-spacing:-.06em;text-wrap:balance;text-shadow:0 10px 44px rgba(0,0,0,.3)}',
      '#wt-dhanteras-intro .wt-d-final-title span{display:block;color:#f0c56e}',
      '#wt-dhanteras-intro .wt-d-final-copy{margin:15px 0 0;color:rgba(255,242,215,.86);font-size:clamp(12px,1.45vw,16px);line-height:1.6;letter-spacing:.035em}',
      '#wt-dhanteras-intro .wt-d-final-rule{width:70px;height:1px;margin:19px 0 0;background:linear-gradient(90deg,transparent,#e9bd64,transparent);box-shadow:0 0 12px #d4a44d}',
      '#wt-dhanteras-intro .wt-d-lights{position:absolute;z-index:2;left:0;right:0;top:0;height:20%;pointer-events:none;opacity:.75}',
      '#wt-dhanteras-intro .wt-d-lights svg{width:100%;height:100%;overflow:visible}',
      '#wt-dhanteras-intro .wt-d-light-bulb{transform-origin:center;animation:wtDhBulb 1.8s ease-in-out infinite alternate}',
      '#wt-dhanteras-intro .wt-d-side-lamp{position:absolute;z-index:3;bottom:5%;width:clamp(50px,8vw,105px);opacity:.76;filter:drop-shadow(0 0 18px rgba(238,169,54,.27));animation:wtDhLampFloat 3.8s ease-in-out infinite}',
      '#wt-dhanteras-intro .wt-d-side-lamp svg{width:100%;height:auto;overflow:visible}',
      '#wt-dhanteras-intro .wt-d-side-lamp--left{left:clamp(15px,6vw,80px)}',
      '#wt-dhanteras-intro .wt-d-side-lamp--right{right:clamp(15px,6vw,80px);animation-delay:-1.7s}',
      '#wt-dhanteras-intro .wt-d-coin-river{position:absolute;inset:0;z-index:4;width:100%;height:100%;opacity:0;pointer-events:none;transition:opacity .8s ease}',
      '#wt-dhanteras-intro[data-beat="3"] .wt-d-coin-river,#wt-dhanteras-intro[data-beat="4"] .wt-d-coin-river{opacity:1}',
      '#wt-dhanteras-intro .wt-d-river-line{fill:none;stroke:url(#wtDhRiverGold);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:3 13;stroke-dashoffset:950;filter:drop-shadow(0 0 5px rgba(243,191,89,.85));animation:wtDhRiverTravel 4.8s linear infinite}',
      '#wt-dhanteras-intro .wt-d-river-line--two{stroke-width:1.1;stroke-dasharray:2 20;animation-duration:6.2s;animation-direction:reverse;opacity:.6}',
      '#wt-dhanteras-intro .wt-d-coins{position:absolute;inset:0;z-index:5;overflow:hidden;pointer-events:none;opacity:0;transition:opacity .6s ease}',
      '#wt-dhanteras-intro[data-beat="3"] .wt-d-coins,#wt-dhanteras-intro[data-beat="4"] .wt-d-coins{opacity:1}',
      '#wt-dhanteras-intro .wt-d-coin{position:absolute;left:var(--x);top:var(--y);width:clamp(17px,2.1vw,28px);aspect-ratio:1;display:grid;place-items:center;border:1.5px solid #fff0b2;border-radius:50%;background:radial-gradient(circle at 32% 27%,#fff2b6 0%,#f2c86b 27%,#c28a2f 72%,#8d5c1b 100%);color:#754715;font-family:Georgia,serif;font-size:clamp(8px,1vw,12px);font-weight:900;box-shadow:0 0 11px rgba(245,192,83,.55),inset 0 0 0 2px rgba(255,250,210,.24);opacity:0;animation:wtDhCoinFlow var(--duration) var(--delay) ease-in infinite}',
      '#wt-dhanteras-intro .wt-d-coin:nth-child(3n){width:clamp(13px,1.6vw,21px);filter:brightness(1.12)}',
      '#wt-dhanteras-intro .wt-d-petals{position:absolute;inset:0;z-index:5;overflow:hidden;pointer-events:none}',
      '#wt-dhanteras-intro .wt-d-petal{position:absolute;left:var(--x);top:-8%;width:var(--size);height:calc(var(--size)*1.4);border-radius:80% 5% 80% 5%;background:linear-gradient(140deg,#ffe6a0,#d99c47 70%,#9c6335);opacity:0;animation:wtDhPetalFall var(--duration) var(--delay) linear infinite}',
      '#wt-dhanteras-intro .wt-d-footer{position:absolute;z-index:9;left:20px;right:20px;bottom:max(18px,env(safe-area-inset-bottom));display:flex;justify-content:center;align-items:center;gap:8px;color:rgba(255,241,211,.43);font-size:9px;font-weight:750;letter-spacing:.15em;text-align:center;text-transform:uppercase;opacity:0;animation:wtDhFade .7s .6s ease-out forwards}',
      '#wt-dhanteras-intro .wt-d-footer b{color:rgba(240,198,110,.7);font-weight:700}',
      '#wt-dhanteras-intro.is-leaving{animation:wtDhLeave .52s ease-in forwards;pointer-events:none}',
      '#wt-dhanteras-intro.is-leaving .wt-dh-stage{filter:brightness(1.2);transform:scale(1.02);transition:filter .5s ease,transform .5s ease}',
      '@keyframes wtDhRays{to{transform:translate(-50%,-50%) rotate(360deg)}}',
      '@keyframes wtDhHalo{0%,100%{opacity:.75;scale:.98}50%{opacity:1;scale:1.035}}',
      '@keyframes wtDhFlame{0%,100%{transform:translateY(0) rotate(-3deg) scale(1,1)}36%{transform:translateY(-5px) rotate(3deg) scale(.92,1.08)}68%{transform:translateY(1px) rotate(-1deg) scale(1.05,.96)}}',
      '@keyframes wtDhFlameGlow{0%,100%{opacity:.3;scale:.85}50%{opacity:.75;scale:1.16}}',
      '@keyframes wtDhFade{to{opacity:1}}',
      '@keyframes wtDhCopyIn{to{opacity:1;visibility:visible;transform:translateY(0) scale(1)}}',
      '@keyframes wtDhFinalIn{to{opacity:1;visibility:visible;transform:translate(-50%,-50%) scale(1)}}',
      '@keyframes wtDhBlessing{0%,100%{filter:drop-shadow(0 0 25px rgba(238,184,76,.18));translate:0 0}50%{filter:drop-shadow(0 0 36px rgba(238,184,76,.34));translate:0 -5px}}',
      '@keyframes wtDhBulb{from{opacity:.55;filter:drop-shadow(0 0 4px #f2bc5c)}to{opacity:1;filter:drop-shadow(0 0 13px #ffe6a0)}}',
      '@keyframes wtDhLampFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-8px) rotate(1deg)}}',
      '@keyframes wtDhRiverTravel{to{stroke-dashoffset:-950}}',
      '@keyframes wtDhCoinFlow{0%{opacity:0;transform:translate3d(0,0,0) rotate(0) scale(.35)}12%{opacity:.92}78%{opacity:.86}100%{opacity:0;transform:translate3d(var(--dx),var(--dy),0) rotate(var(--turn)) scale(.72)}}',
      '@keyframes wtDhPetalFall{0%{opacity:0;transform:translate3d(0,-5vh,0) rotate(0)}10%{opacity:.8}85%{opacity:.7}100%{opacity:0;transform:translate3d(var(--drift),110vh,0) rotate(var(--turn))}}',
      '@keyframes wtDhLeave{to{opacity:0;visibility:hidden;transform:scale(1.025)}}',
      '@media(max-width:760px){#wt-dhanteras-intro .wt-d-header{top:max(19px,env(safe-area-inset-top));left:18px;right:18px}#wt-dhanteras-intro .wt-d-overline{font-size:8px;letter-spacing:.13em}#wt-dhanteras-intro .wt-d-date{font-size:8px;padding:7px 8px;letter-spacing:.08em}#wt-dhanteras-intro .wt-d-skip{top:max(67px,calc(env(safe-area-inset-top) + 56px));right:18px;min-height:35px;font-size:10px}#wt-dhanteras-intro .wt-d-art{top:39%;width:94vw;height:48vh;height:48svh}#wt-dhanteras-intro .wt-d-lakshmi{height:min(44svh,380px);max-width:88vw}#wt-dhanteras-intro .wt-d-diya-intro{width:clamp(160px,47vw,225px)}#wt-dhanteras-intro .wt-d-copy{bottom:clamp(84px,12vh,117px);left:15px;right:15px}#wt-dhanteras-intro .wt-d-kicker{font-size:8px;letter-spacing:.16em;margin-bottom:9px}#wt-dhanteras-intro .wt-d-headline{font-size:clamp(32px,9.5vw,48px)}#wt-dhanteras-intro .wt-d-description{font-size:12px;max-width:330px;margin-top:10px}#wt-dhanteras-intro .wt-d-final{top:53%;width:96vw}#wt-dhanteras-intro .wt-d-final-mark{gap:9px;margin-bottom:16px;padding:7px 14px 7px 8px}#wt-dhanteras-intro .wt-d-final-mark img{width:39px;height:39px}#wt-dhanteras-intro .wt-d-final-mark span{font-size:14px}#wt-dhanteras-intro .wt-d-final-kicker{font-size:8px;letter-spacing:.17em}#wt-dhanteras-intro .wt-d-final-title{font-size:clamp(39px,10.5vw,56px)}#wt-dhanteras-intro .wt-d-final-copy{font-size:12px;margin-top:12px}#wt-dhanteras-intro .wt-d-final-rule{margin-top:14px}#wt-dhanteras-intro .wt-d-side-lamp{bottom:8%;width:53px;opacity:.5}#wt-dhanteras-intro .wt-d-footer{font-size:7px;letter-spacing:.075em;gap:5px;bottom:max(14px,env(safe-area-inset-bottom))}#wt-dhanteras-intro .wt-d-coin{width:17px}}',
      '@media(max-width:390px){#wt-dhanteras-intro .wt-d-art{top:37%;height:44svh}#wt-dhanteras-intro .wt-d-lakshmi{height:40svh}#wt-dhanteras-intro .wt-d-copy{bottom:90px}#wt-dhanteras-intro .wt-d-headline{font-size:32px}#wt-dhanteras-intro .wt-d-final{top:54%}#wt-dhanteras-intro .wt-d-final-title{font-size:38px}#wt-dhanteras-intro .wt-d-final-mark img{width:34px;height:34px}#wt-dhanteras-intro .wt-d-final-copy{max-width:270px}}',
      '@media(max-height:700px) and (min-width:761px){#wt-dhanteras-intro .wt-d-art{height:56vh;top:40%}#wt-dhanteras-intro .wt-d-lakshmi{height:52vh}#wt-dhanteras-intro .wt-d-copy{bottom:86px}#wt-dhanteras-intro .wt-d-headline{font-size:clamp(34px,4vw,53px)}#wt-dhanteras-intro .wt-d-final{top:52%}#wt-dhanteras-intro .wt-d-final-title{font-size:clamp(38px,5vw,64px)}}',
      '@media(prefers-reduced-motion:reduce){#wt-dhanteras-intro *,#wt-dhanteras-intro *:before,#wt-dhanteras-intro *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}#wt-dhanteras-intro .wt-d-particle-canvas{display:none}}'
    ].join("\n");
    const style = document.createElement("style");
    style.id = "wt-dhanteras-intro-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function diyaSvg() {
    return '<svg viewBox="0 0 256 256" aria-hidden="true"><defs><radialGradient id="wtDhDiyaGlow"><stop stop-color="#ffdb7d" stop-opacity=".45"/><stop offset="1" stop-color="#ffdb7d" stop-opacity="0"/></radialGradient><linearGradient id="wtDhDiyaBowl" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffe9ae"/><stop offset=".46" stop-color="#d49636"/><stop offset="1" stop-color="#6c3d1c"/></linearGradient><linearGradient id="wtDhDiyaFire" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#e47724"/><stop offset=".6" stop-color="#ffd66f"/><stop offset="1" stop-color="#fffbe6"/></linearGradient><filter id="wtDhDiyaBlur"><feGaussianBlur stdDeviation="7"/></filter></defs><circle cx="128" cy="111" r="103" fill="url(#wtDhDiyaGlow)"/><ellipse class="wt-d-flame-glow" cx="128" cy="110" rx="34" ry="49" fill="#f5b746" opacity=".38" filter="url(#wtDhDiyaBlur)"/><path class="wt-d-flame" d="M128 31 C96 67 98 92 113 113 C119 121 124 124 128 126 C150 113 166 92 156 65 C150 50 138 38 128 31Z" fill="url(#wtDhDiyaFire)" stroke="#fff2be" stroke-width="1.6"/><path d="M128 81 C111 101 119 116 128 121 C141 107 138 93 128 81Z" fill="#fffbe2"/><path d="M70 150 Q128 176 186 150 L168 193 Q128 214 88 193Z" fill="url(#wtDhDiyaBowl)" stroke="#ffe5a0" stroke-width="2.6"/><path d="M71 150 Q128 173 185 150" fill="none" stroke="#fff0b7" stroke-width="4" stroke-linecap="round"/><path d="M84 189 Q128 208 172 189" fill="none" stroke="#f3c56b" stroke-width="2"/><ellipse cx="128" cy="220" rx="66" ry="8" fill="#000" opacity=".2"/></svg>';
  }

  function sideLampSvg() {
    return '<svg viewBox="0 0 120 100" aria-hidden="true"><defs><linearGradient id="wtDhSmallBowl" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffeab1"/><stop offset=".5" stop-color="#d79b39"/><stop offset="1" stop-color="#6b3b18"/></linearGradient><linearGradient id="wtDhSmallFlame" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#ed8e27"/><stop offset="1" stop-color="#fff6bd"/></linearGradient></defs><ellipse cx="60" cy="83" rx="30" ry="5" fill="#000" opacity=".25"/><path d="M29 60 Q60 72 91 60 L82 77 Q60 86 38 77Z" fill="url(#wtDhSmallBowl)" stroke="#ffe3a0" stroke-width="1.4"/><path d="M60 14 C46 28 48 42 54 50 C57 53 59 54 60 54 C69 49 75 41 71 30 C68 23 64 17 60 14Z" fill="url(#wtDhSmallFlame)" stroke="#fff1bb" stroke-width=".8"/></svg>';
  }

  function initParticles(overlay) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = overlay.querySelector(".wt-d-particle-canvas");
    if (!canvas || !canvas.getContext) return;
    let ctx;
    try { ctx = canvas.getContext("2d"); } catch (_) { return; }
    if (!ctx) return;
    let width = 0, height = 0, ratio = 1, frame = 0, active = true, particles = [];
    function resize() {
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      ctx.setTransform(ratio,0,0,ratio,0,0);
      const count = Math.min(86, Math.max(36, Math.round(width / 17)));
      particles = Array.from({length:count}, () => ({
        x:Math.random()*width,y:Math.random()*height,r:.4+Math.random()*1.6,
        speed:.11+Math.random()*.42,drift:(Math.random()-.5)*.22,
        phase:Math.random()*Math.PI*2,alpha:.14+Math.random()*.62
      }));
    }
    function draw() {
      if (!active) return;
      ctx.clearRect(0,0,width,height);
      particles.forEach(p => {
        p.phase += .014; p.y -= p.speed; p.x += p.drift + Math.sin(p.phase)*.15;
        if (p.y < -8) { p.y = height+7; p.x = Math.random()*width; }
        if (p.x < -7) p.x = width+5;
        if (p.x > width+7) p.x = -5;
        ctx.beginPath();
        ctx.fillStyle = "rgba(245,202,116,"+p.alpha.toFixed(3)+")";
        ctx.shadowColor = "rgba(245,191,91,.62)"; ctx.shadowBlur = p.r*3;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      ctx.shadowBlur = 0;
      frame = window.requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener("resize",resize,{passive:true});
    frame = window.requestAnimationFrame(draw);
    stopParticles = () => {
      active=false; window.cancelAnimationFrame(frame);
      window.removeEventListener("resize",resize);
      ctx.clearRect(0,0,width,height);
      stopParticles=()=>{};
    };
  }

  function init() {
    if (!PREVIEW_MODE && indiaDateString() !== FESTIVAL_DATE) return;
    try { if (!PREVIEW_MODE && sessionStorage.getItem(SESSION_KEY) === "1") return; } catch (_) {}
    if (document.getElementById("wt-dhanteras-intro")) return;

    addStyles();
    const overlay = document.createElement("section");
    overlay.id = "wt-dhanteras-intro";
    overlay.dataset.beat = "1";
    overlay.setAttribute("role","dialog");
    overlay.setAttribute("aria-modal","true");
    overlay.setAttribute("aria-label","WealthyTrees 15-second Dhanteras celebration");
    const lights = Array.from({length:30},(_,i)=>{
      const y=(8+Math.sin(i*.57)*64+Math.cos(i*.21)*12).toFixed(1);
      return '<g class="wt-d-light-bulb" style="animation-delay:-'+(i%7*.22).toFixed(2)+'s"><circle cx="'+(i*50-5)+'" cy="'+y+'" r="11" fill="#ffcf68" opacity=".08"/><circle cx="'+(i*50-5)+'" cy="'+y+'" r="3.3" fill="'+(i%3===0?"#fff0b8":"#edbf64")+'"/></g>';
    }).join("");
    const coins = Array.from({length:34},()=>{
      const x=(26+Math.random()*48).toFixed(1)+"%";
      const y=(36+Math.random()*29).toFixed(1)+"%";
      const dx=((Math.random()-.5)*85).toFixed(1)+"vw";
      const dy=(30+Math.random()*60).toFixed(1)+"vh";
      const duration=(2.2+Math.random()*2.3).toFixed(2)+"s";
      const delay=(-Math.random()*4.2).toFixed(2)+"s";
      const turn=Math.round(240+Math.random()*720)+"deg";
      return '<span class="wt-d-coin" style="--x:'+x+';--y:'+y+';--dx:'+dx+';--dy:'+dy+';--duration:'+duration+';--delay:'+delay+';--turn:'+turn+'">₹</span>';
    }).join("");
    const petals = Array.from({length:18},(_,i)=>{
      const palette=["#f3c46c","#f7d9a5","#dba051","#d98294"];
      return '<i class="wt-d-petal" style="--x:'+(Math.random()*100).toFixed(1)+'%;--size:'+(4+Math.random()*7).toFixed(1)+'px;--duration:'+(4+Math.random()*5).toFixed(2)+'s;--delay:'+(-Math.random()*8).toFixed(2)+'s;--drift:'+Math.round((Math.random()-.5)*100)+'px;--turn:'+Math.round(180+Math.random()*520)+'deg;background:'+palette[i%palette.length]+'"></i>';
    }).join("");

    overlay.innerHTML =
      '<div class="wt-dh-stage"><div class="wt-dh-rays" aria-hidden="true"></div><div class="wt-dh-mandala" aria-hidden="true"></div><canvas class="wt-d-particle-canvas" aria-hidden="true"></canvas>'+
      '<div class="wt-d-lights" aria-hidden="true"><svg viewBox="0 0 1440 210" preserveAspectRatio="none"><path d="M-20 8 C220 150 390 14 600 85 S990 180 1460 24" fill="none" stroke="#b98d45" stroke-opacity=".5" stroke-width="2">'+
      '</path>'+lights+'</svg></div>'+
      '<header class="wt-d-header"><span class="wt-d-overline">A festive special from WealthyTrees</span><span class="wt-d-date">DHANTERAS · 06 NOV 2026</span></header>'+
      '<button class="wt-d-skip" type="button" aria-label="Skip intro and continue to website">Skip intro <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>'+
      '<div class="wt-d-art"><div class="wt-d-diya-intro">'+diyaSvg()+'</div><img class="wt-d-lakshmi" src="/assets/dhanteras-lakshmi.svg" alt="Maa Lakshmi seated on a lotus, in a golden festive illustration" width="600" height="740" fetchpriority="high"></div>'+
      '<svg class="wt-d-coin-river" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="wtDhRiverGold" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#c2872e" stop-opacity="0"/><stop offset=".4" stop-color="#ffdc85"/><stop offset=".75" stop-color="#dca342"/><stop offset="1" stop-color="#fff0b0" stop-opacity="0"/></linearGradient></defs><path class="wt-d-river-line" d="M500 302 C590 360 630 390 725 390 S860 450 1040 394"/><path class="wt-d-river-line wt-d-river-line--two" d="M490 328 C585 389 650 425 745 411 S880 475 1050 432"/><path class="wt-d-river-line" d="M520 340 C430 404 370 432 276 420 S115 460 -40 415"/></svg>'+
      '<div class="wt-d-coins" aria-hidden="true">'+coins+'</div><div class="wt-d-petals" aria-hidden="true">'+petals+'</div>'+
      '<div class="wt-d-side-lamp wt-d-side-lamp--left" aria-hidden="true">'+sideLampSvg()+'</div><div class="wt-d-side-lamp wt-d-side-lamp--right" aria-hidden="true">'+sideLampSvg()+'</div>'+
      '<div class="wt-d-copy wt-d-copy--1"><p class="wt-d-kicker">The night of light begins</p><h1 class="wt-d-headline">When the first diya glows...</h1><p class="wt-d-description">A season of blessings, hope, and beautiful new beginnings.</p></div>'+
      '<div class="wt-d-copy wt-d-copy--2"><p class="wt-d-kicker">A blessing for every home</p><h2 class="wt-d-headline">May Maa Lakshmi<br><em>bless every home.</em></h2><p class="wt-d-description">May wisdom guide every step towards peace and prosperity.</p></div>'+
      '<div class="wt-d-copy wt-d-copy--3"><p class="wt-d-kicker">Let prosperity flow</p><h2 class="wt-d-headline">May wealth grow<br><em>with wisdom.</em></h2><p class="wt-d-description">Celebrate abundance with understanding, care, and confidence.</p></div>'+
      '<div class="wt-d-final"><div class="wt-d-final-mark"><img src="/assets/logo.svg" alt="" width="47" height="47"><span>WealthyTrees</span></div><p class="wt-d-final-kicker">With light, wisdom &amp; prosperity</p><h2 class="wt-d-final-title">Wishing you a <span>Happy Dhanteras</span></h2><p class="wt-d-final-copy">Warm festive wishes from WealthyTrees.</p><div class="wt-d-final-rule" aria-hidden="true"></div></div>'+
      '<div class="wt-d-footer" aria-hidden="true"><span>Markets, simplified</span><b>·</b><span>Learning without the noise</span><b>·</b><span>WealthyTrees</span></div></div>';
    document.body.appendChild(overlay);

    const priorOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    let finished = false;
    let exitTimer = 0;
    const skipButton = overlay.querySelector(".wt-d-skip");
    const lakshmi = overlay.querySelector(".wt-d-lakshmi");
    if (lakshmi) lakshmi.addEventListener("error", () => {
      lakshmi.remove();
      overlay.classList.add("wt-d-art-fallback");
    }, {once:true});

    function finishExperience() {
      if (finished) return;
      finished = true;
      if (exitTimer) window.clearTimeout(exitTimer);
      stopParticles();
      try { if (!PREVIEW_MODE) sessionStorage.setItem(SESSION_KEY,"1"); } catch (_) {}
      overlay.classList.add("is-leaving");
      document.removeEventListener("keydown",onKeydown);
      window.setTimeout(() => {
        overlay.remove();
        document.documentElement.style.overflow = priorOverflow;
      },REMOVE_DURATION);
    }
    function onKeydown(event) {
      if (event.key === "Escape" && overlay.isConnected) finishExperience();
    }
    const storyBeats = [
      {at:0,beat:"1"},
      {at:3500,beat:"2"},
      {at:7350,beat:"3"},
      {at:10850,beat:"4"}
    ];
    storyBeats.forEach(item => window.setTimeout(() => {
      if (!finished && overlay.isConnected) overlay.dataset.beat = item.beat;
    },item.at));
    skipButton.addEventListener("click",finishExperience);
    document.addEventListener("keydown",onKeydown);
    initParticles(overlay);
    try { skipButton.focus({preventScroll:true}); } catch (_) { skipButton.focus(); }
    exitTimer = window.setTimeout(finishExperience,INTRO_DURATION);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();