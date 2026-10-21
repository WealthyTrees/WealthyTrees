/* WealthyTrees Dussehra ticker experience — cinematic, responsive, date-gated (IST). */
(() => {
  "use strict";
  const query = new URLSearchParams(location.search);
  const preview = query.get("previewDussehraFestival")==="1" ||
                  query.get("previewDussehraBar")==="1";
  const FESTIVAL_DATE = "2026-10-20";

  function todayIST() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone:"Asia/Kolkata", year:"numeric", month:"2-digit", day:"2-digit"
    }).formatToParts(new Date());
    const value = type => parts.find(part => part.type===type)?.value || "";
    return value("year")+"-"+value("month")+"-"+value("day");
  }

  function makeScene() {
    return `
      <div class="wt-fest-stage">
        <div class="wt-fest-sky-glow"></div>
        <div class="wt-fest-torana" aria-hidden="true"><span>✦</span><i></i><span>✦</span><i></i><span>✦</span><i></i><span>✦</span></div>
        <div class="wt-fest-badge">INDIA · DUSSEHRA <span>MARKETS CLOSED</span></div>
        <svg class="wt-fest-scene" viewBox="0 0 1200 280" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="wtdSky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#0d2035"/><stop offset=".42" stop-color="#683f52"/><stop offset=".76" stop-color="#d67945"/><stop offset="1" stop-color="#ffc266"/></linearGradient>
            <radialGradient id="wtdSun"><stop stop-color="#fff2ba"/><stop offset=".45" stop-color="#ffc66a" stop-opacity=".78"/><stop offset="1" stop-color="#ff9b4c" stop-opacity="0"/></radialGradient>
            <linearGradient id="wtdGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff6ba"/><stop offset=".48" stop-color="#f4c04d"/><stop offset="1" stop-color="#aa5e23"/></linearGradient>
            <linearGradient id="wtdBlue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#54c1ce"/><stop offset=".56" stop-color="#267695"/><stop offset="1" stop-color="#16425e"/></linearGradient>
            <linearGradient id="wtdCloth" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f5d16c"/><stop offset=".5" stop-color="#e98c34"/><stop offset="1" stop-color="#8d3540"/></linearGradient>
            <filter id="wtdGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <g id="wtdRavanaHead">
              <circle r="17" fill="#b96b50" stroke="#f5d17c" stroke-width="2"/>
              <path d="M-11 -4Q-6 -9 0 -5Q6 -9 11 -4" fill="none" stroke="#652c35" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="-6" cy="0" r="1.8" fill="#241d2b"/><circle cx="6" cy="0" r="1.8" fill="#241d2b"/>
              <path d="M-6 8Q0 13 6 8" fill="none" stroke="#4a202c" stroke-width="2" stroke-linecap="round"/>
              <path d="M-14 -15L-10 -28L-3 -20L0 -31L4 -20L11 -28L14 -15Z" fill="url(#wtdGold)" stroke="#fff0a7" stroke-width="1.4"/>
              <circle cx="0" cy="-19" r="2" fill="#fff7cb"/>
            </g>
            <g id="wtdSpark">
              <path d="M0 -27L4 -8L19 -20L9 -4L28 0L9 4L19 20L4 8L0 29L-4 8L-19 20L-9 4L-28 0L-9 -4L-19 -20L-4 -8Z" fill="#ffc84c"/>
              <path d="M0 -43V-31M0 31V44M-43 0H-31M31 0H44M-30 -30L-21 -21M22 22L31 31M30 -30L21 -21M-22 22L-31 31" stroke="#fff5ba" stroke-width="3" stroke-linecap="round"/>
            </g>
          </defs>
          <rect width="1200" height="280" fill="url(#wtdSky)"/>
          <circle cx="610" cy="88" r="130" fill="url(#wtdSun)"/>
          <circle cx="610" cy="88" r="42" fill="#ffe5a6" opacity=".38"/>
          <g fill="#fce4bb" opacity=".22">
            <circle cx="95" cy="53" r="2"/><circle cx="172" cy="96" r="1.6"/><circle cx="450" cy="43" r="2"/><circle cx="535" cy="70" r="1.8"/>
            <circle cx="726" cy="43" r="1.8"/><circle cx="838" cy="75" r="2"/><circle cx="1020" cy="45" r="1.6"/><circle cx="1125" cy="99" r="2"/>
          </g>
          <path d="M0 183L90 143L154 176L245 132L337 182L440 145L520 179L645 139L737 182L838 146L936 179L1031 138L1113 169L1200 139V280H0Z" fill="#513247" opacity=".62"/>
          <g fill="#241f31" opacity=".76">
            <path d="M0 220V176H24V157H40V176H52V145H69V176H83V220Z"/>
            <path d="M70 222V185L86 170L102 185V222Z"/>
            <path d="M1085 220V176H1100V150H1116V176H1132V160H1148V176H1168V220Z"/>
            <path d="M1024 221V185L1043 167L1061 185V221Z"/>
          </g>
          <g stroke="#f6c86b" stroke-width="2" fill="#4b253a">
            <path d="M0 230Q155 198 292 224T595 222T904 219T1200 218V280H0Z" fill="#342433" stroke="none"/>
          </g>
          <g class="wt-fest-ravana">
            <ellipse cx="298" cy="255" rx="118" ry="11" fill="#140f1d" opacity=".42"/>
            <path d="M236 210Q246 168 267 165H329Q350 174 359 210L380 249H215Z" fill="url(#wtdCloth)" stroke="#eec66e" stroke-width="3"/>
            <path d="M267 167L279 208L298 225L317 208L329 167" fill="#8d2e46" stroke="#f3cb79" stroke-width="2"/>
            <path d="M298 168V246" stroke="#ffdc83" stroke-width="3"/>
            <path d="M232 192L194 219L206 231L255 210M354 193L389 217L377 230L333 211" fill="#a74a45" stroke="#eec66e" stroke-width="3"/>
            <g>
              <use href="#wtdRavanaHead" x="218" y="95"/><use href="#wtdRavanaHead" x="258" y="77"/>
              <use href="#wtdRavanaHead" x="298" y="69"/><use href="#wtdRavanaHead" x="338" y="77"/>
              <use href="#wtdRavanaHead" x="378" y="95"/>
              <use href="#wtdRavanaHead" x="239" y="130"/><use href="#wtdRavanaHead" x="278" y="121"/>
              <use href="#wtdRavanaHead" x="318" y="121"/><use href="#wtdRavanaHead" x="357" y="130"/>
              <use href="#wtdRavanaHead" x="298" y="143"/>
            </g>
            <path d="M202 246L218 260H378L393 246" fill="none" stroke="#f7cb70" stroke-width="4" stroke-linecap="round"/>
          </g>
          <g class="wt-fest-rama">
            <ellipse cx="890" cy="258" rx="85" ry="10" fill="#140f1d" opacity=".38"/>
            <path d="M854 205L842 250H931L918 205Z" fill="url(#wtdCloth)" stroke="#ffe2a0" stroke-width="2.5"/>
            <path d="M870 154Q889 144 906 157L923 208H855Z" fill="url(#wtdBlue)" stroke="#f0cf78" stroke-width="2.5"/>
            <path d="M867 177L836 156L821 169L854 200" fill="#2d7d9e" stroke="#f0cf78" stroke-width="3"/>
            <path d="M906 170L946 135" stroke="#2f7897" stroke-width="10" stroke-linecap="round"/>
            <path d="M946 135L958 122" stroke="#f0cf78" stroke-width="6" stroke-linecap="round"/>
            <circle cx="889" cy="124" r="25" fill="url(#wtdBlue)" stroke="#f2d27e" stroke-width="2.5"/>
            <path d="M861 116L872 86L889 98L906 86L918 116Z" fill="url(#wtdGold)" stroke="#fff1ad" stroke-width="2"/>
            <path d="M889 87L889 74" stroke="#ffeaa1" stroke-width="3"/><circle cx="889" cy="71" r="4" fill="#fff1b3"/>
            <path d="M878 123H883M895 123H900" stroke="#fff6d7" stroke-width="3" stroke-linecap="round"/>
            <path d="M882 135Q889 140 897 135" fill="none" stroke="#fff6d7" stroke-width="2" stroke-linecap="round"/>
            <path d="M846 145Q804 183 846 220" fill="none" stroke="url(#wtdGold)" stroke-width="5" stroke-linecap="round"/>
            <path d="M846 145Q888 183 846 220" fill="none" stroke="#fff1bd" stroke-width="1.7" stroke-linecap="round"/>
            <path d="M840 181L849 181" stroke="#e6c66a" stroke-width="4" stroke-linecap="round"/>
            <path d="M864 162L850 152L840 163" fill="none" stroke="#e8c878" stroke-width="4" stroke-linecap="round"/>
          </g>
          <g class="wt-fest-arrow" filter="url(#wtdGlow)">
            <path d="M0 190H74" stroke="#fff5b6" stroke-width="4" stroke-linecap="round"/>
            <path d="M-15 190L8 179L4 190L8 201Z" fill="url(#wtdGold)" stroke="#fff6bd" stroke-width="1"/>
            <path d="M71 186L83 180M71 194L83 200" stroke="#f0ce73" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M22 182L14 174M22 198L14 206" stroke="#fff1b7" stroke-width="2"/>
            <circle cx="38" cy="190" r="3.4" fill="#fff"/>
            <path d="M25 190L9 190" stroke="#ffb04e" stroke-width="9" opacity=".45"/>
          </g>
          <g class="wt-fest-main-burst" transform="translate(298 191)" filter="url(#wtdGlow)">
            <use href="#wtdSpark">
              <animateTransform attributeName="transform" attributeType="XML" type="scale"
                values=".12;.12;.9;1.55;.22;.12" keyTimes="0;.274;.29;.315;.38;1"
                dur="15s" repeatCount="indefinite"/>
            </use>
            <circle r="10" fill="#fff8c5">
              <animate attributeName="r" values="1;1;14;19;2;1"
                keyTimes="0;.274;.29;.315;.38;1" dur="15s" repeatCount="indefinite"/>
            </circle>
          </g>
          <g class="wt-fest-firework wt-fw-a" transform="translate(445 100)">
            <use href="#wtdSpark" transform="scale(.63)" fill="#ffdf6c">
              <animateTransform attributeName="transform" attributeType="XML" type="scale"
                values=".08;.08;.63;1.05;.08;.08" keyTimes="0;.28;.30;.35;.42;1"
                dur="15s" repeatCount="indefinite"/>
            </use>
          </g>
          <g class="wt-fest-firework wt-fw-b" transform="translate(515 160)">
            <use href="#wtdSpark" transform="scale(.4)">
              <animateTransform attributeName="transform" attributeType="XML" type="scale"
                values=".05;.05;.42;.78;.05;.05" keyTimes="0;.30;.32;.37;.44;1"
                dur="15s" repeatCount="indefinite"/>
            </use>
          </g>
          <g class="wt-fest-firework wt-fw-c" transform="translate(178 158)">
            <use href="#wtdSpark" transform="scale(.45)">
              <animateTransform attributeName="transform" attributeType="XML" type="scale"
                values=".05;.05;.48;.88;.05;.05" keyTimes="0;.31;.33;.38;.45;1"
                dur="15s" repeatCount="indefinite"/>
            </use>
          </g>
          <g class="wt-fest-streamers" fill="none" stroke-linecap="round">
            <path d="M116 45q20 14 2 27t3 24M470 32q-15 16 2 25t-1 28M722 52q17 12 1 24t1 25M1080 39q-18 12-2 26t-3 25" stroke="#ffd76e" stroke-width="4"/>
            <path d="M120 46l-9 -7M476 33l8 -8M728 54l9 -8M1077 42l-7 -8" stroke="#fff2b2" stroke-width="2.5"/>
          </g>
        </svg>
        <div class="wt-fest-petal-rain" aria-hidden="true"></div>
        <div class="wt-fest-message">
          <img src="/assets/logo.svg" alt="WealthyTrees logo">
          <div class="wt-fest-copy">
            <h2>Happy Vijayadashami</h2>
            <p>अधर्म पर धर्म की विजय आपके जीवन में सुख, शांति और समृद्धि लाए।</p>
            <strong>WealthyTrees Private Limited</strong>
          </div>
          <span class="wt-fest-card-flower" aria-hidden="true">✿</span>
        </div>
        <div class="wt-fest-foot">सत्य की विजय · समृद्धि का पर्व</div>
      </div>`;
  }

  function addPetals(stage) {
    const rain = stage.querySelector(".wt-fest-petal-rain");
    if (!rain || rain.dataset.ready === "1") return;
    rain.dataset.ready = "1";
    for (let i=0; i<34; i++) {
      const petal = document.createElement("i");
      petal.className = "wt-fest-petal";
      petal.style.setProperty("--x", (Math.random()*100)+"%");
      petal.style.setProperty("--size", (7+Math.random()*11)+"px");
      petal.style.setProperty("--fall", (3.1+Math.random()*2.2)+"s");
      petal.style.setProperty("--delay", (Math.random()*4.4)+"s");
      petal.style.setProperty("--drift", (Math.round((Math.random()-.5)*70))+"px");
      petal.style.setProperty("--rot", Math.round(Math.random()*130-65)+"deg");
      rain.appendChild(petal);
    }
  }

  function init() {
    if (!preview && todayIST()!==FESTIVAL_DATE) return;
    const ticker=document.getElementById("ticker");
    const track=document.getElementById("track");
    if (!ticker || !track || ticker.dataset.wtFestRail==="1") return;
    ticker.dataset.wtFestRail="1";
    ticker.classList.add("wt-dussehra-festival");
    ticker.classList.remove("live");
    track.classList.remove("wt-promo-track");
    track.dataset.wtFestival="1";
    track.dataset.sig="wt-festival-v2";
    track.style.removeProperty("--dur");
    track.innerHTML=makeScene();
    addPetals(track.querySelector(".wt-fest-stage"));
  }

  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();