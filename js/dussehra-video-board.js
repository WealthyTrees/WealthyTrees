/* WealthyTrees Dussehra video board: date-gated, inline, viewport-triggered greeting video. */
(() => {
  "use strict";

  const FESTIVAL_DATE = "2026-10-20";
  const GREETING_VIDEO_URL = "/assets/dussehra-greeting.mp4";
  const params = new URLSearchParams(window.location.search);
  const PREVIEW_MODE = ["previewDussehra", "previewDussehraBar", "previewDussehraFestival"]
    .some((key) => params.get(key) === "1");

  function indiaDateString() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const part = (type) => parts.find((item) => item.type === type)?.value || "";
    return part("year") + "-" + part("month") + "-" + part("day");
  }

  function addStyles() {
    if (document.getElementById("wt-dussehra-video-board-style")) return;
    const style = document.createElement("style");
    style.id = "wt-dussehra-video-board-style";
    style.textContent = `
      .wt-newsroom-layout {
        display:grid; grid-template-columns:minmax(0,1fr) minmax(270px,320px);
        gap:clamp(1rem,2.2vw,1.6rem); align-items:start;
      }
      .wt-newsroom-main {min-width:0}
      .wt-dussehra-video-board {
        position:sticky; top:112px; min-width:0; overflow:hidden;
        border:1px solid rgba(210,166,76,.68); border-radius:16px;
        padding:clamp(14px,1.8vw,20px);
        color:#f9f2dd;
        background:radial-gradient(ellipse at 50% 0%,rgba(205,159,65,.18),transparent 42%),
          linear-gradient(155deg,#193d2c 0%,#0b2117 55%,#07160f 100%);
        box-shadow:0 14px 36px rgba(7,27,17,.18),inset 0 0 0 1px rgba(255,240,187,.05);
      }
      .wt-dussehra-video-board::before {
        content:""; position:absolute; inset:7px; border:1px solid rgba(244,211,139,.17);
        border-radius:11px; pointer-events:none;
      }
      .wt-dussehra-board-head {position:relative;z-index:1;text-align:center;margin:0 0 12px}
      .wt-dussehra-board-kicker {
        display:flex;align-items:center;justify-content:center;gap:7px;
        margin:0 0 7px;color:#f2cf7b;font-size:.69rem;letter-spacing:.15em;
        line-height:1.3;font-weight:800;text-transform:uppercase;
      }
      .wt-dussehra-board-kicker::before,.wt-dussehra-board-kicker::after {
        content:"";display:block;width:18px;height:1px;background:#d4ac60;opacity:.8;
      }
      .wt-dussehra-video-board h3 {
        margin:0;color:#ffe4a0;font-family:Georgia,"Noto Sans Devanagari","Mangal",serif;
        font-size:clamp(1.22rem,1.8vw,1.55rem);line-height:1.25;
        text-shadow:0 0 15px rgba(255,205,91,.16);
      }
      .wt-dussehra-board-intro {margin:7px 0 0;color:#d5dfd5;font-size:.8rem;line-height:1.45}
      .wt-dussehra-video-frame {
        position:relative;z-index:1;overflow:hidden;width:100%;aspect-ratio:9/16;
        border:1px solid rgba(236,196,104,.5);border-radius:9px;background:#07130d;
        box-shadow:0 7px 22px rgba(0,0,0,.28);
      }
      .wt-dussehra-video-player {
        display:block;width:100%;height:100%;object-fit:contain;background:#07130d;
      }
      .wt-dussehra-board-status {
        position:absolute;inset:auto 8px 8px;z-index:2;padding:7px 10px;border-radius:7px;
        color:#fff8e5;background:rgba(7,19,13,.88);text-align:center;font-size:.78rem;
        line-height:1.35;pointer-events:none;
      }
      .wt-dussehra-board-status[hidden] {display:none}
      .wt-dussehra-board-play {
        position:absolute;z-index:3;left:50%;top:50%;transform:translate(-50%,-50%);
        border:1px solid #f0cf80;border-radius:999px;background:rgba(8,35,23,.94);
        color:#ffedbd;padding:12px 18px;font:700 .9rem/1.2 Inter,system-ui,sans-serif;
        box-shadow:0 5px 24px rgba(0,0,0,.38);cursor:pointer;
      }
      .wt-dussehra-board-play[hidden] {display:none}
      .wt-dussehra-board-play:focus-visible {outline:3px solid #fff0bf;outline-offset:4px}
      .wt-dussehra-board-foot {
        position:relative;z-index:1;margin:12px 0 0;color:#d5dfd5;text-align:center;
        font-family:Georgia,"Times New Roman",serif;font-size:.82rem;font-style:italic;line-height:1.5;
      }
      [data-theme="light"] .wt-dussehra-video-board,
      [data-theme="sepia"] .wt-dussehra-video-board {box-shadow:0 12px 32px rgba(19,46,32,.15)}
      @media(max-width:900px) {
        .wt-newsroom-layout {grid-template-columns:minmax(0,1fr)}
        .wt-dussehra-video-board {position:relative;top:auto;width:min(100%,420px);margin:1.5rem auto 0}
        .wt-dussehra-video-frame {max-height:62vh}
      }
      @media(max-width:480px) {
        .wt-dussehra-video-board {padding:15px}
        .wt-dussehra-board-intro {font-size:.78rem}
      }
      @media(prefers-reduced-motion:reduce) {
        .wt-dussehra-video-board * {scroll-behavior:auto}
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (!PREVIEW_MODE && indiaDateString() !== FESTIVAL_DATE) return;
    const pLive = document.getElementById("p-live");
    const pBrief = document.getElementById("p-brief");
    const tabs = document.querySelector(".tabs");
    if (!pLive || !pBrief || !tabs || document.querySelector(".wt-dussehra-video-board")) return;

    addStyles();

    // Keep both newsroom tabs together so the video board stays at the right,
    // whether the reader is on Live Wire or Today's brief.
    const layout = document.createElement("div");
    layout.className = "wt-newsroom-layout";
    const mainColumn = document.createElement("div");
    mainColumn.className = "wt-newsroom-main";
    tabs.insertAdjacentElement("afterend", layout);
    layout.append(mainColumn);
    mainColumn.append(pLive, pBrief);

    const board = document.createElement("aside");
    board.className = "wt-dussehra-video-board";
    board.setAttribute("aria-label", "WealthyTrees Dussehra greeting video board");
    board.innerHTML = `
      <div class="wt-dussehra-board-head">
        <p class="wt-dussehra-board-kicker">A festive greeting</p>
        <h3>शुभ विजयादशमी</h3>
        <p class="wt-dussehra-board-intro">A special greeting from WealthyTrees Private Limited</p>
      </div>
      <div class="wt-dussehra-video-frame">
        <video class="wt-dussehra-video-player" muted playsinline loop controls preload="metadata"
          aria-label="WealthyTrees Vijayadashami greeting video">
          <source src="${GREETING_VIDEO_URL}" type="video/mp4">
        </video>
        <p class="wt-dussehra-board-status" role="status">Loading greeting video…</p>
        <button class="wt-dussehra-board-play" type="button" hidden>Play greeting</button>
      </div>
      <p class="wt-dussehra-board-foot">Wishing you prosperity, happiness and success.</p>
    `;
    layout.append(board);

    const video = board.querySelector("video");
    const status = board.querySelector(".wt-dussehra-board-status");
    const playButton = board.querySelector(".wt-dussehra-board-play");
    let isInView = false;
    let manualPlayRequested = false;

    const showStatus = (message) => {
      status.textContent = message;
      status.hidden = false;
    };
    const hideStatus = () => { status.hidden = true; };
    const requestPlayback = () => {
      if (!isInView && !manualPlayRequested) return;
      if (document.visibilityState === "hidden") return;
      video.muted = true; // Muted inline autoplay is the most reliable browser-supported default.
      const result = video.play();
      if (result && typeof result.then === "function") {
        result.then(() => {
          playButton.hidden = true;
          hideStatus();
        }).catch(() => {
          playButton.hidden = false;
          showStatus("Tap Play greeting to start the video.");
        });
      }
    };

    video.addEventListener("loadeddata", () => {
      hideStatus();
      if (isInView) requestPlayback();
    });
    video.addEventListener("playing", () => {
      playButton.hidden = true;
      hideStatus();
    });
    video.addEventListener("waiting", () => {
      if (isInView) showStatus("Loading greeting video…");
    });
    video.addEventListener("error", () => {
      playButton.hidden = false;
      showStatus("The greeting video could not load. Tap Play greeting to retry.");
    });
    playButton.addEventListener("click", () => {
      manualPlayRequested = true;
      playButton.hidden = true;
      showStatus("Loading greeting video…");
      if (video.error) {
        video.src = GREETING_VIDEO_URL;
        video.load();
      } else {
        video.load();
      }
      requestPlayback();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") video.pause();
      else if (isInView) requestPlayback();
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting && entry.intersectionRatio >= 0.3;
          if (isInView) requestPlayback();
          else {
            manualPlayRequested = false;
            video.pause();
          }
        });
      }, { threshold: [0, 0.3, 0.6], rootMargin: "0px 0px -5% 0px" });
      observer.observe(board);
    } else {
      isInView = true;
      requestPlayback();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
