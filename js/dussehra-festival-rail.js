/* Dussehra festival ticker. Date-gated to IST; preview with ?previewDussehraFestival=1 */
(() => {
"use strict";
const p = new URLSearchParams(location.search);
const preview = p.get("previewDussehraFestival")==="1" || p.get("previewDussehraBar")==="1";
const festivalDate = "2026-10-20";
function todayIST(){
 const a = new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
 const v = t => a.find(x=>x.type===t)?.value||"";
 return v("year")+"-"+v("month")+"-"+v("day");
}
function init(){
 if(!preview && todayIST()!==festivalDate) return;
 const ticker=document.getElementById("ticker"), track=document.getElementById("track");
 if(!ticker||!track||ticker.dataset.wtFest==="1") return;
 ticker.dataset.wtFest="1"; ticker.classList.add("wt-dussehra-festival");
 track.classList.remove("wt-promo-track"); track.dataset.sig="wt-festival";
 track.innerHTML = `
 <div class="wt-fest-stage">
  <div class="wt-fest-ribbon">INDIA · DUSSEHRA <span>MARKETS CLOSED</span></div>
  <svg class="wt-fest-scene" viewBox="0 0 1000 180" preserveAspectRatio="none" aria-hidden="true">
   <defs>
    <linearGradient id="wtSky" x2="0" y2="1"><stop stop-color="#122c39"/><stop offset="1" stop-color="#e18a43"/></linearGradient>
    <linearGradient id="wtGold" x2="1" y2="1"><stop stop-color="#fff1a6"/><stop offset=".55" stop-color="#f2b532"/><stop offset="1" stop-color="#b46024"/></linearGradient>
    <linearGradient id="wtBlue"><stop stop-color="#3694ae"/><stop offset="1" stop-color="#164b66"/></linearGradient>
   </defs>
   <rect width="1000" height="180" fill="url(#wtSky)"/>
   <circle cx="520" cy="45" r="36" fill="#ffe2a0" opacity=".23"/>
   <path d="M0 138 Q140 100 260 142T520 137T780 141T1000 130V180H0Z" fill="#342632" opacity=".75"/>
   <path d="M0 157 Q180 138 340 159T660 155T1000 151V180H0Z" fill="#211f28"/>
   <g class="wt-ravan">
    <path d="M190 143L205 110H285L302 143Z" fill="#702e50" stroke="#eac05c" stroke-width="3"/>
    <g fill="#9f3546" stroke="#f7cb67" stroke-width="1.7">
     <circle cx="178" cy="68" r="14"/><circle cx="202" cy="54" r="14"/><circle cx="226" cy="46" r="14"/><circle cx="250" cy="42" r="14"/><circle cx="274" cy="46" r="14"/><circle cx="298" cy="54" r="14"/><circle cx="322" cy="68" r="14"/><circle cx="201" cy="80" r="14"/><circle cx="250" cy="72" r="14"/><circle cx="299" cy="80" r="14"/>
    </g>
    <g fill="url(#wtGold)"><path d="M165 57l13-19 13 19z"/><path d="M189 43l13-19 13 19z"/><path d="M213 35l13-19 13 19z"/><path d="M237 31l13-19 13 19z"/><path d="M261 35l13-19 13 19z"/><path d="M285 43l13-19 13 19z"/><path d="M309 57l13-19 13 19z"/><path d="M188 69l13-19 13 19z"/><path d="M237 61l13-19 13 19z"/><path d="M286 69l13-19 13 19z"/></g>
   </g>
   <g class="wt-rama">
    <path d="M770 144L760 169H821L811 144Z" fill="#f4bd49" stroke="#ffedaa" stroke-width="2"/>
    <path d="M770 105L757 145H819L807 105Z" fill="url(#wtBlue)" stroke="#edc86e" stroke-width="2"/>
    <circle cx="789" cy="83" r="19" fill="url(#wtBlue)" stroke="#f4d582" stroke-width="2"/>
    <path d="M765 76L775 54L789 64L803 54L813 76Z" fill="url(#wtGold)" stroke="#fff0ad" stroke-width="2"/>
    <path d="M803 109L834 83" stroke="#f0c96d" stroke-width="7" stroke-linecap="round"/>
    <path d="M837 57Q871 94 837 132M837 57Q803 94 837 132" fill="none" stroke="url(#wtGold)" stroke-width="4"/>
   </g>
   <g class="wt-fest-arrow"><path d="M802 88H720" stroke="#fff0a1" stroke-width="3" stroke-linecap="round"/><path d="M708 88l16-8-3 8 3 8z" fill="url(#wtGold)"/></g>
   <g class="wt-fest-burst" transform="translate(252 91)">
    <circle r="13" fill="#fff5b5"/><path d="M0-36L5-12L26-26L12-5L38 0L12 5L26 26L5 12L0 38L-5 12L-26 26L-12 5L-38 0L-12-5L-26-26L-5-12Z" fill="#ffc64b"/>
   </g>
   <g class="wt-fest-fireworks" stroke="#ffe9a0" stroke-width="2.5" stroke-linecap="round">
    <path d="M400 32v17m-9-8h18m-15-7l12 14m0-14l-12 14"/><path d="M585 45v15m-8-7h16m-13-6l10 12m0-12l-10 12"/><path d="M685 30v13m-7-6h14m-11-5l8 10m0-10l-8 10"/>
   </g>
  </svg>
  <div class="wt-fest-message">
    <img src="/assets/logo.svg" alt="WealthyTrees logo">
    <div><h2>Happy Vijayadashami</h2><p>अधर्म पर धर्म की विजय आपके जीवन में सुख, शांति और समृद्धि लाए।</p><strong>WealthyTrees Private Limited</strong></div>
  </div>
  <div class="wt-fest-foot">सत्य की विजय · समृद्धि का पर्व</div>
 </div>`;
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true}); else init();
})();