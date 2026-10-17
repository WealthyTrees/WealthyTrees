/* WealthyTrees Dussehra video board: fixed ad-style placement with resilient inline playback. */
(() => {
  "use strict";

  const FESTIVAL_DATE = "2026-10-20";
  const GREETING_VIDEO_URL = "/assets/dussehra-greeting.mp4";
  const VERSION = "board-playback-2";
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
        display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start;
      }
      .wt-newsroom-main {min-width:0}
      .wt-dussehra-video-board {
        position:fixed;z-index:45;top:104px;
        right:max(16px,calc((100vw - 68rem)/2 + 1.2rem));
        width:min(300px,calc(100vw - 32px));max-height:calc(100dvh - 120px);
        overflow:hidden;visibility:hidden;opacity:0;pointer-events:none;
        transform:translateY(-6px);
        border:1px solid rgba(210,166,76,.72);border-radius:16px;
        padding:14px 16px 13px;color:#f9f2dd;
        background:radial-gradient(ellipse at 50% 0%,rgba(205,159,65,.18),transparent 42%),
          linear-gradient(155deg,#193d2c 0%,#0b2117 55%,#07160f 100%);
        box-shadow:0 14px 36px rgba(7,27,17,.24),inset 0 0 0 1px rgba(255,240,187,.05);
        transition:opacity .2s ease,transform .2s ease,visibility .2s;
      }
      .wt-dussehra-video-board.is-locked {
        visibility:visible;opacity:1;pointer-events:auto;transform:translateY(0);
      }
      .wt-dussehra-video-board::before {
        content:"";position:absolute;inset:7px;border:1px solid rgba(244,211,139,.17);
        border-radius:11px;pointer-events:none;
      }
      .wt-dussehra-board-head {position:relative;z-index:1;text-align:center;margin:0 0 10px}
      .wt-dussehra-board-kicker {
        display:flex;align-items:center;justify-content:center;gap:7px;
        margin:0 0 6px;color:#f2cf7b;font-size:.67rem;letter-spacing:.15em;
        line-height:1.3;font-weight:800;text-transform:uppercase;
      }
      .wt-dussehra-board-kicker::before,.wt-dussehra-board-kicker::after {
        content:"";display:block;width:18px;height:1px;background:#d4ac60;opacity:.8;
      }
      .wt-dussehra-video-board h3 {
        margin:0;color:#ffe4a0;font-family:Georgia,"Noto Sans Devanagari","Mangal",serif;
        font-size:1.42rem;line-height:1.2;text-shadow:0 0 15px rgba(255,205,91,.16);
      }
      .wt-dussehra-board-intro {margin:6px 0 0;color:#d5dfd5;font-size:.77rem;line-height:1.4}
      .wt-dussehra-video-frame {
        position:relative;z-index:1;overflow:hidden;width:100%;
        height:min(52dvh,460px);min-height:220px;
        border:1px solid rgba(236,196,104,.5);border-radius:9px;background:#07130d;
        box-shadow:0 7px 22px rgba(0,0,0,.28);
      }
      .wt-dussehra-video-player {
        display:block;width:100%;height:100%;object-fit:contain;background:#07130d;
      }
      .wt-dussehra-board-status {
        position:absolute;inset:auto 7px 7px;z-index:2;padding:6px 8px;border-radius:7px;
        color:#fff8e5;background:rgba(7,19,13,.9);text-align:center;font-size:.73rem;
        line-height:1.35;pointer-events:none;
      }
      .wt-dussehra-board-status[hidden] {display:none}
      .wt-dussehra-board-foot {
        position:relative;z-index:1;margin:9px 0 0;color:#d5dfd5;text-align:center;
        font-family:Georgia,"Times New Roman",serif;font-size:.79rem;font-style:italic;line-height:1.4;
      }
      @media(min-width:1100px) and (max-height:650px) {
        .wt-dussehra-video-board {top:90px;width:258px;right:max(12px,calc((100vw - 68rem)/2 + 1rem));padding:10px 12px}
        .wt-dussehra-video-board h3 {font-size:1.22rem}
        .wt-dussehra-board-head {margin-bottom:7px}
        .wt-dussehra-video-frame {height:calc(100dvh - 290px);min-height:170px}
        .wt-dussehra-board-foot {margin-top:7px;font-size:.72rem}
      }
      @media(max-width:1099px) {
        .wt-newsroom-layout {grid-template-columns:minmax(0,1fr)}
        .wt-dussehra-video-board {
          position:relative;top:auto;right:auto;visibility:visible;opacity:1;pointer-events:auto;
          transform:none;width:min(100%,390px);max-height:none;margin:1.5rem auto 0;
          padding:16px;border-radius:14px;
        }
        .wt-dussehra-video-board.is-locked {transform:none}
        .wt-dussehra-video-frame {height:min(62dvh,480px);min-height:240px}
      }
      @media(prefers-reduced-motion:reduce) {
        .wt-dussehra-video-board {transition:none}
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (!PREVIEW_MODE && indiaDateString() !== FESTIVAL_DATE) return;
    const pLive = document.getElementById("p-live");
    const pBrief = document.getElementById("p-brief");
    const tabs = document.querySelector(".tabs");
    const newsroom = document.getElementById("brief");
    if (!pLive || !pBrief || !tabs || !newsroom || document.querySelector(".wt-dussehra-video-board")) return;

    addStyles();
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
        <video class="wt-dussehra-video-player" autoplay muted playsinline loop controls preload="auto"
          aria-label="WealthyTrees Vijayadashami greeting video"></video>
        <p class="wt-dussehra-board-status" role="status">Preparing greeting video…</p>
      </div>
      <p class="wt-dussehra-board-foot">Wishing you prosperity, happiness and success.</p>
    `;
    layout.append(board);

    const video = board.querySelector("video");
    const status = board.querySelector(".wt-dussehra-board-status");
    const mediaUrl = GREETING_VIDEO_URL + "?v=" + encodeURIComponent(VERSION);
    let playedAtLeastOnce = false;
    let playRequested = false;
    let retried = false;
    let watchdog = 0;

    const showStatus = (message) => { status.textContent = message; status.hidden = false; };
    const hideStatus = () => { status.hidden = true; };
    const stopWatchdog = () => {
      if (watchdog) window.clearTimeout(watchdog);
      watchdog = 0;
    };
    const attemptPlay = () => {
      if (document.visibilityState === "hidden" || playedAtLeastOnce || playRequested) return;
      playRequested = true;
      const result = video.play();
      if (result && typeof result.then === "function") {
        result.then(() => { playRequested = false; }).catch(() => {
          playRequested = false;
          stopWatchdog();
          showStatus("Use the player’s ▶ control to start the greeting.");
        });
      }
    };
    const startWatchdog = () => {
      stopWatchdog();
      watchdog = window.setTimeout(() => {
        if (playedAtLeastOnce || video.error) return;
        if (!retried) {
          retried = true;
          playRequested = false;
          showStatus("Reconnecting to the greeting video…");
          video.pause();
          video.src = GREETING_VIDEO_URL + "?retry=" + Date.now();
          video.load();
          attemptPlay();
          startWatchdog();
        } else {
          showStatus("The greeting video did not start. Use the player’s ▶ control or refresh this page.");
        }
      }, 9000);
    };

    video.addEventListener("loadedmetadata", attemptPlay);
    video.addEventListener("loadeddata", attemptPlay);
    video.addEventListener("canplay", attemptPlay);
    video.addEventListener("playing", () => {
      playedAtLeastOnce = true;
      playRequested = false;
      stopWatchdog();
      hideStatus();
    });
    video.addEventListener("waiting", () => {
      if (playedAtLeastOnce) showStatus("Rebuffering greeting…");
    });
    video.addEventListener("stalled", () => {
      if (!playedAtLeastOnce) showStatus("Loading greeting video…");
    });
    video.addEventListener("error", () => {
      stopWatchdog();
      playRequested = false;
      const code = video.error ? video.error.code : 0;
      const detail = code === 4
        ? "The browser could not open the MP4 file."
        : code === 3 ? "The browser could not decode the MP4 file."
        : "The greeting video could not be downloaded.";
      showStatus(detail + " Refresh the page to retry.");
    });

    // On desktop, lock the board to the upper-right only while the Newsroom
    // is on screen. Fixed positioning means the panel no longer gets clipped
    // by the bottom of the news container.
    if (window.matchMedia("(min-width: 1100px)").matches && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) board.classList.toggle("is-locked", entry.isIntersecting);
      }, { threshold: 0 });
      observer.observe(layout);
    } else if (window.matchMedia("(min-width: 1100px)").matches) {
      board.classList.add("is-locked");
    }

    video.src = mediaUrl;
    video.load();
    startWatchdog();
    attemptPlay();

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && !playedAtLeastOnce) attemptPlay();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
