/* WealthyTrees dussehra.js v2: cinematic Dussehra opening + closing scene (all drawn in code, no images except the logo).
   Chariot ride-in, Ram draws a divine arrow, Ravan burns, dawn fireworks, greeting + company logo.
   Started by festival.js on 20 Oct. Preview any time: add ?fest=2026-10-20 to a page address. */
(function () {
  var G = 380, HEADS = [[640, 140, 22], [603, 128, 17], [677, 128, 17], [572, 110, 15], [708, 110, 15], [610, 96, 15], [670, 96, 15], [588, 74, 13], [692, 74, 13], [640, 66, 16]];
  var NAME = "WealthyTrees Private Limited";

  function ravHead(h, i) {
    var x = h[0], y = h[1], r = h[2];
    return '<g class="dz-hb" style="animation-delay:' + (5.7 + i * .12).toFixed(2) + 's">'
      + '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#dzRav)" stroke="#12081f" stroke-width="2"/>'
      + '<path d="M' + (x - r) + ' ' + (y - r * .35) + 'L' + (x - r * .75) + ' ' + (y - r * 1.55) + 'L' + (x - r * .25) + ' ' + (y - r * .95) + 'L' + x + ' ' + (y - r * 1.8) + 'L' + (x + r * .25) + ' ' + (y - r * .95) + 'L' + (x + r * .75) + ' ' + (y - r * 1.55) + 'L' + (x + r) + ' ' + (y - r * .35) + 'Z" fill="url(#dzGold)" stroke="#5a3a08" stroke-width="1.2"/>'
      + '<path d="M' + (x - r * .75) + ' ' + (y - r * .28) + 'L' + (x - r * .15) + ' ' + (y - r * .05) + ' M' + (x + r * .75) + ' ' + (y - r * .28) + 'L' + (x + r * .15) + ' ' + (y - r * .05) + '" stroke="#0a0412" stroke-width="' + Math.max(2, r * .16) + '" stroke-linecap="round"/>'
      + '<ellipse class="dz-eye" cx="' + (x - r * .4) + '" cy="' + (y + r * .08) + '" rx="' + r * .2 + '" ry="' + r * .13 + '" fill="#ff3b2f"/><ellipse class="dz-eye" cx="' + (x + r * .4) + '" cy="' + (y + r * .08) + '" rx="' + r * .2 + '" ry="' + r * .13 + '" fill="#ff3b2f"/>'
      + '<path d="M' + (x - r * .5) + ' ' + (y + r * .5) + ' Q' + x + ' ' + (y + r * .3) + ' ' + (x + r * .5) + ' ' + (y + r * .5) + '" fill="none" stroke="#0a0412" stroke-width="' + Math.max(1.6, r * .12) + '" stroke-linecap="round"/>'
      + '<path d="M' + (x - r * .3) + ' ' + (y + r * .45) + 'l' + r * .08 + ' ' + r * .28 + 'l' + r * .08 + ' -' + r * .25 + 'M' + (x + r * .14) + ' ' + (y + r * .45) + 'l' + r * .08 + ' ' + r * .28 + 'l' + r * .08 + ' -' + r * .25 + '" fill="#fff" stroke="#fff" stroke-width="1"/></g>';
  }
  function flame(x, y, k, d) {
    return '<g transform="translate(' + x + ' ' + y + ')"><g class="dz-fl" style="animation-delay:' + d + 's;--k:' + (k * .55).toFixed(2) + '"><path d="M0 0C-18 -20 -9 -46 0 -76C11 -46 20 -20 0 0Z" fill="#ff5a14"/><path d="M0 0C-11 -12 -6 -30 0 -48C6 -30 12 -12 0 0Z" fill="#ffb02e"/><path d="M0 0C-5 -6 -3 -16 0 -26C3 -16 5 -6 0 0Z" fill="#fff2a8"/></g></g>';
  }
  function horse(x, y, tone, dl) {
    var legs = '';
    [[-26, 0], [-14, .22], [16, .11], [28, .33]].forEach(function (l, i) {
      legs += '<g transform="translate(' + (x + l[0]) + ' ' + (y + 12) + ')"><g class="dz-lg" style="animation-delay:' + (dl + l[1]) + 's"><path d="M0 0 L' + (i % 2 ? 3 : -3) + ' 20 L' + (i % 2 ? 2 : -2) + ' 40" stroke="' + tone + '" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M' + (i % 2 ? 2 : -2) + ' 39 l0 5" stroke="#3a2410" stroke-width="7" stroke-linecap="round"/></g></g>';
    });
    return legs
      + '<path d="M' + (x - 44) + ' ' + (y - 4) + ' Q' + (x - 70) + ' ' + (y + 16) + ' ' + (x - 62) + ' ' + (y + 44) + '" fill="none" stroke="#f3e8d0" stroke-width="8" stroke-linecap="round" class="dz-tail"/>'
      + '<ellipse cx="' + x + '" cy="' + y + '" rx="46" ry="21" fill="' + tone + '"/>'
      + '<path d="M' + (x + 32) + ' ' + (y - 8) + ' Q' + (x + 48) + ' ' + (y - 30) + ' ' + (x + 58) + ' ' + (y - 42) + ' L' + (x + 74) + ' ' + (y - 34) + ' Q' + (x + 58) + ' ' + (y - 14) + ' ' + (x + 44) + ' ' + (y + 10) + 'Z" fill="' + tone + '"/>'
      + '<ellipse cx="' + (x + 72) + '" cy="' + (y - 34) + '" rx="15" ry="8" transform="rotate(28 ' + (x + 72) + ' ' + (y - 34) + ')" fill="' + tone + '"/>'
      + '<path d="M' + (x + 52) + ' ' + (y - 44) + ' l4 -12 l5 12" fill="' + tone + '"/><circle cx="' + (x + 76) + '" cy="' + (y - 38) + '" r="2" fill="#2a1608"/>'
      + '<path d="M' + (x + 40) + ' ' + (y - 24) + ' Q' + (x + 26) + ' ' + (y - 40) + ' ' + (x + 22) + ' ' + (y - 8) + '" fill="none" stroke="#d9a032" stroke-width="5" stroke-linecap="round" class="dz-mane"/>'
      + '<path d="M' + (x - 10) + ' ' + (y - 21) + ' L' + (x + 4) + ' ' + (y + 20) + ' M' + (x + 44) + ' ' + (y - 10) + ' L' + (x + 70) + ' ' + (y - 40) + '" stroke="url(#dzGold)" stroke-width="3" fill="none"/>'
      + '<path d="M' + (x + 56) + ' ' + (y - 44) + ' l0 -14" stroke="#e5322d" stroke-width="4" stroke-linecap="round"/>';
  }
  function spokes() { var s = ''; for (var i = 0; i < 8; i++) s += '<line x1="0" y1="0" x2="0" y2="-32" stroke="url(#dzGold)" stroke-width="4" transform="rotate(' + i * 45 + ')"/>'; return s; }

  function scene() {
    var s = '<svg viewBox="0 0 800 450" style="width:100%;height:100%;display:block" role="img" aria-label="Lord Ram rides his chariot, shoots a divine arrow and Ravan burns. Good wins over evil." preserveAspectRatio="xMidYMid meet">';
    s += '<defs>'
      + '<linearGradient id="dzBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cb8ff"/><stop offset="1" stop-color="#2160d6"/></linearGradient>'
      + '<linearGradient id="dzGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".5" stop-color="#f0b13a"/><stop offset="1" stop-color="#b9771a"/></linearGradient>'
      + '<linearGradient id="dzRav" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b3fa0"/><stop offset="1" stop-color="#1b0e33"/></linearGradient>'
      + '<linearGradient id="dzSaff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc24a"/><stop offset="1" stop-color="#ee7a12"/></linearGradient>'
      + '<linearGradient id="dzTrail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffb02e" stop-opacity="0"/><stop offset="1" stop-color="#fff2a8" stop-opacity=".95"/></linearGradient>'
      + '<radialGradient id="dzAuraR"><stop offset="0" stop-color="#ff3b1f" stop-opacity=".75"/><stop offset=".55" stop-color="#b3122a" stop-opacity=".3"/><stop offset="1" stop-color="#b3122a" stop-opacity="0"/></radialGradient>'
      + '<radialGradient id="dzAuraG"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".95"/><stop offset=".5" stop-color="#ffc24a" stop-opacity=".35"/><stop offset="1" stop-color="#ffc24a" stop-opacity="0"/></radialGradient>'
      + '<radialGradient id="dzHor"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".85"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>'
      + '</defs>';
    var st = ''; for (var i = 0; i < 70; i++) st += '<circle cx="' + (((i * 137) % 2000) - 600) + '" cy="' + (((i * 71) % 760) - 520) + '" r="' + (i % 4 ? 1.4 : 2.4) + '" fill="#fff" class="dz-tw" style="animation-delay:' + (i % 9) * .35 + 's"/>';
    s += st + '<circle cx="110" cy="60" r="30" fill="#ffeab0"/><circle cx="110" cy="60" r="58" fill="url(#dzAuraG)"/>';
    s += '<ellipse cx="400" cy="' + G + '" rx="900" ry="120" fill="url(#dzHor)" opacity=".7"/>';
    s += '<path d="M-1200 ' + (G - 8) + ' L0 ' + G + ' Q200 ' + (G - 16) + ' 400 ' + (G - 4) + ' T800 ' + (G - 8) + ' L2000 ' + (G - 6) + ' V1200 H-1200Z" fill="#150a26"/>';
    s += '<path d="M-1200 ' + (G + 10) + ' H2000" stroke="#3b1f55" stroke-width="2"/>';
    /* far Lanka skyline */
    s += '<path d="M500 ' + (G - 8) + ' V300 L512 280 L524 300 V' + (G - 8) + 'M540 ' + (G - 8) + ' V270 Q556 240 572 270 V' + (G - 8) + 'M700 ' + (G - 8) + ' V290 L714 262 L728 290 V' + (G - 8) + 'M740 ' + (G - 8) + ' V310 H770 V' + (G - 8) + '" fill="#241037" stroke="none" opacity=".8"/>';
    /* Ravan */
    s += '<g class="dz-rvin"><circle class="dz-aura" cx="640" cy="230" r="210" fill="url(#dzAuraR)"/>'
      + '<g class="dz-rv"><g class="dz-rvb">'
      + '<path d="M596 270 L684 270 L704 ' + (G - 6) + ' L576 ' + (G - 6) + 'Z" fill="#6e0f26" stroke="#12081f" stroke-width="2.5"/><path d="M582 360 H698" stroke="url(#dzGold)" stroke-width="7"/>'
      + '<path d="M606 ' + (G - 6) + ' V300 M674 ' + (G - 6) + ' V300" stroke="#1b0e33" stroke-width="22" stroke-linecap="round"/>'
      + '<path d="M584 176 Q640 148 696 176 L690 280 L590 280Z" fill="url(#dzRav)" stroke="#12081f" stroke-width="2.5"/>'
      + '<path d="M604 190 Q640 232 676 190" fill="none" stroke="url(#dzGold)" stroke-width="9" stroke-linecap="round"/><circle cx="640" cy="222" r="9" fill="#ff3b2f"/><circle cx="640" cy="222" r="14" fill="none" stroke="url(#dzGold)" stroke-width="3"/>'
      + '<rect x="590" y="268" width="100" height="12" fill="url(#dzGold)"/>'
      + '<g stroke="#2a1648" stroke-width="15" stroke-linecap="round" fill="none"><path d="M588 186 L548 168 L520 150"/><path d="M586 204 L540 212 L514 206"/><path d="M590 224 L548 252 L526 262"/><path d="M692 186 L732 168 L760 150"/><path d="M694 204 L740 212 L766 206"/><path d="M690 224 L732 252 L754 262"/></g>'
      + '<path d="M522 154 L490 96" stroke="#dfe8f2" stroke-width="6" stroke-linecap="round"/><path d="M514 150 L530 142" stroke="url(#dzGold)" stroke-width="7" stroke-linecap="round"/>'
      + '<path d="M514 206 L484 210" stroke="#8d6a2a" stroke-width="6" stroke-linecap="round"/><circle cx="478" cy="210" r="14" fill="#7d7f8a" stroke="#12081f" stroke-width="2"/>'
      + '<path d="M526 262 L500 300" stroke="#8d6a2a" stroke-width="5" stroke-linecap="round"/><path d="M488 288 L500 300 L512 288 M500 266 V300" stroke="#dfe8f2" stroke-width="4" fill="none" stroke-linecap="round"/>'
      + '<path d="M760 150 L778 100" stroke="#8d6a2a" stroke-width="5" stroke-linecap="round"/><path d="M764 100 L792 108 L784 124Z" fill="#cfd6e0"/>'
      + '<path d="M766 206 L792 190" stroke="#8d6a2a" stroke-width="6" stroke-linecap="round"/><path d="M780 170 Q812 190 790 214" stroke="#8d6a2a" stroke-width="5" fill="none"/>'
      + '<path d="M754 262 L780 296" stroke="#cfd6e0" stroke-width="6" stroke-linecap="round"/>'
      + '<circle cx="584" cy="178" r="20" fill="url(#dzGold)" stroke="#5a3a08" stroke-width="2"/><circle cx="696" cy="178" r="20" fill="url(#dzGold)" stroke="#5a3a08" stroke-width="2"/>'
      + '</g><g class="dz-heads">' + HEADS.map(ravHead).join('') + '</g></g></g>';
    /* flames over Ravan */
    s += '<g class="dz-fire">' + flame(610, 290, 1.5, 0) + flame(640, 280, 2, .1) + flame(672, 290, 1.6, .2) + flame(622, 230, 1.7, .15) + flame(660, 230, 1.8, .05) + flame(640, 170, 1.9, .25) + flame(590, 190, 1.2, .3) + flame(692, 190, 1.2, .12) + flame(640, 110, 1.6, .22) + '</g>';
    /* chariot + horses + Ram */
    s += '<g class="dz-ch">';
    s += '<ellipse cx="180" cy="' + (G - 4) + '" rx="150" ry="8" fill="#000" opacity=".35"/>';
    s += horse(318, 318, "#fbf5ea", .1) + horse(344, 308, "#e8dcc4", 0);
    s += '<path d="M236 330 L330 312" stroke="url(#dzGold)" stroke-width="5" stroke-linecap="round"/>';
    s += '<g transform="translate(150 350)"><g class="dz-wh"><circle r="42" fill="#2a1608" stroke="url(#dzGold)" stroke-width="7"/><circle r="30" fill="none" stroke="url(#dzGold)" stroke-width="3"/>' + spokes() + '<circle r="9" fill="url(#dzGold)"/></g></g>';
    s += '<path d="M92 290 L240 290 Q256 290 252 308 L238 346 L106 346 Q92 340 90 318Z" fill="url(#dzGold)" stroke="#6b3d0a" stroke-width="3"/><path d="M240 290 Q268 268 256 240" fill="none" stroke="url(#dzGold)" stroke-width="9" stroke-linecap="round"/>';
    s += '<path d="M104 312 H232" stroke="#8a4a10" stroke-width="2"/><circle cx="128" cy="326" r="6" fill="#e5322d"/><circle cx="170" cy="326" r="6" fill="#2a79e0"/><circle cx="212" cy="326" r="6" fill="#e5322d"/>';
    s += '<path d="M100 292 V130" stroke="url(#dzGold)" stroke-width="5"/><g class="dz-flag"><path d="M100 132 L40 148 L62 166 L40 186 L100 176Z" fill="url(#dzSaff)" stroke="#8a3d08" stroke-width="2"/><text x="76" y="166" font-size="18" fill="#fff" text-anchor="middle">&#2384;</text></g>';
    /* Ram */
    s += '<circle class="dz-halo" cx="170" cy="146" r="46" fill="url(#dzAuraG)"/><circle cx="170" cy="146" r="30" fill="none" stroke="#ffe9a0" stroke-width="2" opacity=".8"/>';
    s += '<g class="dz-sc"><path d="M154 178 Q112 176 88 196 Q112 186 100 214 Q134 190 158 196Z" fill="#e5322d" opacity=".95"/></g>';
    s += '<g transform="rotate(-18 150 176)"><rect x="140" y="132" width="13" height="60" rx="4" fill="#6b3d0a"/><path d="M143 132 l3 -14 l3 14 M148 132 l3 -18 l3 18" fill="#e5322d" stroke="#e5322d"/></g>';
    s += '<g class="dz-dh"><path d="M148 234 L194 234 L202 291 L146 291Z" fill="url(#dzSaff)" stroke="#8a3d08" stroke-width="2"/><path d="M146 291 Q120 270 110 250 Q132 258 150 250Z" fill="#ffb43a"/></g>';
    s += '<rect x="147" y="228" width="48" height="10" rx="3" fill="#e5322d" stroke="#8a1010" stroke-width="1.5"/>';
    s += '<path d="M146 176 Q170 164 196 176 L192 236 L150 236Z" fill="url(#dzBlue)" stroke="#12306e" stroke-width="2.5"/>';
    s += '<path d="M152 182 Q170 214 190 182" fill="none" stroke="url(#dzGold)" stroke-width="5" stroke-linecap="round"/><circle cx="171" cy="206" r="6" fill="#e5322d" stroke="#ffe9a0" stroke-width="1.5"/>';
    s += '<rect x="146" y="178" width="12" height="7" fill="url(#dzGold)"/><rect x="186" y="178" width="12" height="7" fill="url(#dzGold)"/>';
    s += '<path class="dz-sp" d="M238 126 L196 198 L238 266" fill="none" stroke="#fff6dc" stroke-width="2"/><path class="dz-ss" d="M238 126 L238 266" fill="none" stroke="#fff6dc" stroke-width="2"/>';
    s += '<path d="M238 126 Q292 196 238 266" fill="none" stroke="url(#dzGold)" stroke-width="8" stroke-linecap="round"/><circle cx="238" cy="126" r="5" fill="#e5322d"/><circle cx="238" cy="266" r="5" fill="#e5322d"/>';
    s += '<path d="M192 182 L264 198" stroke="#3a78d8" stroke-width="12" stroke-linecap="round"/><path d="M154 186 L196 198" stroke="#3a78d8" stroke-width="11" stroke-linecap="round"/><circle cx="264" cy="198" r="6" fill="url(#dzGold)"/><circle cx="196" cy="198" r="6" fill="#ffd9a0"/>';
    s += '<rect x="165" y="164" width="12" height="16" rx="5" fill="#2b72d4"/><circle cx="170" cy="148" r="17" fill="url(#dzBlue)" stroke="#12306e" stroke-width="2.5"/>';
    s += '<circle cx="160" cy="134" r="9" fill="#14102b"/><path d="M154 140 L156 116 L163 128 L170 106 L177 128 L184 116 L186 140Z" fill="url(#dzGold)" stroke="#5a3a08" stroke-width="1.5"/><circle cx="170" cy="120" r="3.4" fill="#e5322d"/><circle cx="170" cy="138" r="2.4" fill="#ff5a4a"/>';
    s += '<path d="M161 147 q4 -3 8 0 M172 147 q4 -3 8 0" stroke="#0e1e46" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="165" cy="150" r="1.9" fill="#fff"/><circle cx="177" cy="150" r="1.9" fill="#fff"/><path d="M164 158 Q171 164 178 158" fill="none" stroke="#0e1e46" stroke-width="2" stroke-linecap="round"/><circle cx="153" cy="152" r="3" fill="url(#dzGold)"/>';
    /* arrow + charge */
    s += '<g class="dz-arr"><g class="dz-arr0"><path d="M196 198 L270 198" stroke="url(#dzGold)" stroke-width="4" stroke-linecap="round"/><path d="M268 190 L288 198 L268 206Z" fill="#fff2a8"/><path d="M198 198 L188 190 M198 198 L188 206" stroke="#e5322d" stroke-width="3"/><rect class="dz-trl" x="60" y="193" width="210" height="10" fill="url(#dzTrail)"/></g></g>';
    s += '<g transform="translate(288 198)"><circle class="dz-orb" r="22" fill="url(#dzAuraG)"/><circle class="dz-orb2" r="8" fill="#fff8d0"/><circle class="dz-ring" r="14" fill="none" stroke="#fff2a8" stroke-width="2.5"/></g>';
    s += '</g>';
    /* impact + shock */
    s += '<g transform="translate(628 226)"><circle class="dz-hit" r="60" fill="#fff6c9"/><circle class="dz-sw" r="30" fill="none" stroke="#ffd36a" stroke-width="6"/><circle class="dz-sw dz-sw2" r="30" fill="none" stroke="#fff" stroke-width="3"/></g>';
    /* diyas */
    for (var d = 0; d < 14; d++) {
      var x = -40 + d * 66, y = G + 24 + (d % 2) * 8;
      s += '<g transform="translate(' + x + ' ' + y + ')" class="dz-di" style="animation-delay:' + (10.2 + d * .1) + 's"><ellipse rx="26" ry="9" cy="-4" fill="url(#dzAuraG)"/><path d="M-10 0 Q0 13 10 0Z" fill="#d6702d" stroke="#2b1240" stroke-width="1.5"/><path class="dz-df" d="M0 -2 C-5 -9 -2 -14 0 -20 C3 -14 5 -9 0 -2Z" fill="#ffd54a" style="animation-delay:' + d * .13 + 's"/></g>';
    }
    return s + '</svg>';
  }

  var CSS = ".dz{position:fixed;inset:0;z-index:99995;overflow:hidden;background:linear-gradient(#0a0620 0%,#1d0f3d 40%,#4a1a55 75%,#a8402f 100%);opacity:0;animation:dzin .9s ease forwards;font-family:Inter,system-ui,sans-serif;color:#fff}"
    + ".dz.out{animation:dzout .7s ease forwards}@keyframes dzin{to{opacity:1}}@keyframes dzout{to{opacity:0}}"
    + ".dz-stage{position:absolute;inset:0}.dz-red{position:absolute;inset:0;background:radial-gradient(circle at 75% 60%,rgba(255,40,30,.55),rgba(120,0,40,.0) 60%);opacity:0;animation:dzred 8s ease 1s forwards;pointer-events:none}"
    + "@keyframes dzred{20%{opacity:1}70%{opacity:1}100%{opacity:0}}"
    + ".dz-dawn{position:absolute;inset:0;background:linear-gradient(#ffcf8a 0%,#ff9a5a 38%,#c9507a 72%,#4a2a7a 100%);opacity:0;animation:dzdawn 2.6s ease 8.6s forwards;pointer-events:none;mix-blend-mode:screen}@keyframes dzdawn{to{opacity:.34}}"
    + ".dz canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}"
    + ".dz-t{position:absolute;left:0;right:0;top:0;padding:4.4rem 1rem 0;text-align:center;pointer-events:none;z-index:3}"
    + ".dz-gold{background:linear-gradient(180deg,#fff6c8,#ffd25a 45%,#e08a1a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 14px rgba(0,0,0,.55))}"
    + ".dz-t h2{margin:0;font:700 clamp(2.4rem,9vw,4.6rem)/1.05 Caveat,'Segoe Print',cursive;letter-spacing:.02em}.dz-t small{display:block;font-weight:700;letter-spacing:.3em;font-size:clamp(.7rem,2.4vw,.95rem);color:#ffe9b8;margin-top:.5rem;text-shadow:0 2px 8px rgba(0,0,0,.6)}"
    + ".dz-t p{margin:.5rem auto 0;max-width:30rem;font-weight:600;font-size:clamp(.9rem,3.2vw,1.1rem);color:#fff3d6;text-shadow:0 2px 10px rgba(0,0,0,.6)}"
    + ".dz-1{opacity:0;animation:dzf 3.2s ease .5s forwards}.dz-2{opacity:0;animation:dzf 2.2s ease 3.3s forwards}@keyframes dzf{18%,78%{opacity:1;transform:none}0%{transform:translateY(10px)}100%{opacity:0}}"
    + ".dz-3{opacity:0;transform:translateY(16px) scale(.94);animation:dzup 1.1s cubic-bezier(.2,1.3,.4,1) 10.8s forwards}@keyframes dzup{to{opacity:1;transform:none}}"
    + ".dz-ft{position:absolute;left:50%;transform:translateX(-50%);width:max-content;max-width:92vw;bottom:max(12px,env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:.15rem;text-align:center;z-index:3;padding:.55rem 1.4rem .7rem;border-radius:20px;background:rgba(18,8,38,.62);border:1px solid rgba(255,214,120,.45);box-shadow:0 8px 30px rgba(0,0,0,.45);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;animation:dzfi 1.2s ease 11.6s forwards;pointer-events:none}@keyframes dzfi{to{opacity:1}}"
    + ".dz-ft img{width:76px;height:76px;margin:-.2rem 0 -.3rem;filter:drop-shadow(0 0 14px rgba(255,214,120,.8))}.dz-ft b{font:700 clamp(1.05rem,3.6vw,1.3rem) Inter,system-ui,sans-serif;letter-spacing:.04em;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.7)}.dz-ft span{font-size:.82rem;font-weight:600;color:#ffe3a6;text-shadow:0 2px 8px rgba(0,0,0,.7)}"
    + ".dz-btn{position:absolute;top:14px;right:14px;border:0;border-radius:999px;background:#f2b632;color:#2b1240;font:700 .95rem Inter,system-ui,sans-serif;padding:.6rem 1.3rem;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4);z-index:5}.dz-btn:hover{background:#ffd54a}.dz-btn:focus-visible{outline:3px solid #fff;outline-offset:2px}"
    + ".dz svg *{transform-box:fill-box;transform-origin:center}"
    + ".dz-tw{animation:dztw 2.8s ease-in-out infinite}@keyframes dztw{50%{opacity:.2}}"
    + ".dz-ch{animation:dzch 3.2s cubic-bezier(.15,.7,.25,1) both}@keyframes dzch{from{transform:translateX(-380px)}to{transform:translateX(0)}}"
    + ".dz-wh{animation:dzwh 3.2s cubic-bezier(.15,.7,.25,1) both}@keyframes dzwh{from{transform:rotate(0)}to{transform:rotate(1260deg)}}"
    + ".dz-lg{transform-origin:50% 0;animation:dzlg .42s ease-in-out 8 alternate both}@keyframes dzlg{from{transform:rotate(-30deg)}to{transform:rotate(30deg)}}"
    + ".dz-mane,.dz-tail{animation:dzmn .5s ease-in-out infinite alternate}@keyframes dzmn{to{transform:skewX(-8deg) translateY(2px)}}"
    + ".dz-flag{transform-origin:0 50%;animation:dzfg .5s ease-in-out infinite alternate}@keyframes dzfg{from{transform:skewY(-5deg) scaleX(1)}to{transform:skewY(5deg) scaleX(.9)}}"
    + ".dz-sc{transform-origin:100% 50%;animation:dzsc .7s ease-in-out infinite alternate}@keyframes dzsc{from{transform:skewY(-6deg)}to{transform:skewY(6deg) scaleX(.92)}}"
    + ".dz-dh{transform-origin:50% 0;animation:dzdh .8s ease-in-out infinite alternate}@keyframes dzdh{to{transform:skewX(-4deg)}}"
    + ".dz-halo{animation:dzhl 2.2s ease-in-out infinite alternate}@keyframes dzhl{from{transform:scale(.9);opacity:.7}to{transform:scale(1.12);opacity:1}}"
    + ".dz-rvin{opacity:0;transform:translateY(50px);animation:dzrin 1.8s ease-out .8s forwards}@keyframes dzrin{to{opacity:1;transform:none}}"
    + ".dz-aura{animation:dzau 1.2s ease-in-out infinite alternate}@keyframes dzau{from{transform:scale(.9);opacity:.6}to{transform:scale(1.1);opacity:1}}"
    + ".dz-eye{animation:dzey .6s ease-in-out infinite alternate}@keyframes dzey{from{opacity:.55}to{opacity:1}}"
    + ".dz-heads{animation:dzro .12s linear 2.3s 6 alternate}@keyframes dzro{to{transform:translateY(-3px)}}"
    + ".dz-rvb{animation:dzbf 2.2s ease-in 6.4s forwards}@keyframes dzbf{to{opacity:0;transform:translateY(30px) scale(.94)}}"
    + ".dz-hb{animation:dzhb .9s ease-in forwards;animation-fill-mode:forwards}@keyframes dzhb{0%{transform:scale(1);filter:none}25%{transform:scale(1.25)}100%{transform:scale(1.9) translateY(-24px);opacity:0}}"
    + ".dz-rv{animation:dzsh .07s linear 5.55s 16}@keyframes dzsh{50%{transform:translateX(4px)}}"
    + ".dz-fire{opacity:0;animation:dzfo1 .5s ease-out 5.6s forwards,dzfo2 2s ease-in 8.6s forwards}@keyframes dzfo1{to{opacity:1}}@keyframes dzfo2{to{opacity:0}}"
    + ".dz-fl{transform-origin:50% 100%;animation:dzfl .4s ease-in-out infinite alternate;transform:scale(var(--k))}@keyframes dzfl{from{transform:scale(calc(var(--k)*.8),calc(var(--k)*.9))}to{transform:scale(calc(var(--k)*1.1),calc(var(--k)*1.25))}}"
    + ".dz-sp{animation:dzsp .01s linear 5s forwards}@keyframes dzsp{to{opacity:0}}.dz-ss{opacity:0;animation:dzss .01s linear 5s forwards}@keyframes dzss{to{opacity:1}}"
    + ".dz-arr{animation:dzar .55s cubic-bezier(.6,0,.9,.7) 5s forwards}.dz-arr0{opacity:0;animation:dzaw .01s linear 3.6s forwards}@keyframes dzaw{to{opacity:1}}@keyframes dzar{0%{transform:translateX(0);opacity:1}92%{opacity:1}100%{transform:translateX(352px);opacity:0}}"
    + ".dz-orb{opacity:0;animation:dzob 1.4s ease-in 3.6s forwards,dzof .15s linear 5s forwards}@keyframes dzob{from{transform:scale(.2);opacity:0}to{transform:scale(1.6);opacity:1}}@keyframes dzof{to{opacity:0}}"
    + ".dz-orb2{opacity:0;animation:dzob 1.4s ease-in 3.6s forwards,dzof .15s linear 5s forwards}.dz-ring{opacity:0;animation:dzrg .7s ease-out 3.7s 2,dzof .1s linear 5s forwards}@keyframes dzrg{from{opacity:1;transform:scale(2.6)}to{opacity:0;transform:scale(.3)}}"
    + ".dz-hit{opacity:0;animation:dzhit .8s ease-out 5.52s forwards}@keyframes dzhit{0%{opacity:1;transform:scale(.2)}100%{opacity:0;transform:scale(2.2)}}"
    + ".dz-sw{opacity:0;animation:dzsw 1.1s ease-out 5.52s forwards}.dz-sw2{animation-delay:5.7s}@keyframes dzsw{0%{opacity:1;transform:scale(.3)}100%{opacity:0;transform:scale(7)}}"
    + ".dz-di{opacity:0;animation:dzdi .7s ease forwards}@keyframes dzdi{to{opacity:1}}.dz-df{animation:dzdf .5s ease-in-out infinite alternate}@keyframes dzdf{from{transform:scale(.8)}to{transform:scale(1.2)}}";

  var el, svg, cv, cx, W = 0, H = 0, done = false, t0 = 0, raf = 0, parts = [], ev = {}, shake = 0;
  /* camera keyframes: time, focus point (px,py), its screen fraction (ax,ay), must-fit size (fw,fh) */
  var K = [[0, 430, 250, .5, .55, 860, 360], [2.9, 420, 250, .5, .55, 780, 340], [3.7, 215, 250, .4, .55, 330, 330], [5, 225, 250, .4, .55, 320, 320], [5.5, 440, 240, .5, .55, 560, 330], [6.2, 640, 240, .5, .55, 340, 380], [9, 640, 240, .5, .55, 340, 380], [11, 420, 300, .5, .66, 780, 320]];
  function ease(x) { return x * x * (3 - 2 * x); }
  var vb = { x: 0, y: 0, w: 800, h: 450 };
  function camera(t) {
    var i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
    var a = K[i], b = K[i + 1], u = Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))); u = ease(u);
    function m(j) { return a[j] + (b[j] - a[j]) * u; }
    var fw = m(5), fh = m(6), sc = Math.min(W / fw, H / fh), vw = W / sc, vh = H / sc;
    var sx = shake > 0 ? (Math.random() - .5) * shake : 0, sy = shake > 0 ? (Math.random() - .5) * shake : 0;
    vb.w = vw; vb.h = vh; vb.x = m(1) - m(3) * vw + sx; vb.y = m(2) - m(4) * vh + sy;
    svg.setAttribute("viewBox", vb.x.toFixed(2) + " " + vb.y.toFixed(2) + " " + vw.toFixed(2) + " " + vh.toFixed(2));
  }
  function P(x, y) { return [(x - vb.x) / vb.w * W, (y - vb.y) / vb.h * H]; }
  function add(o) { parts.push(o); }
  function ember(x, y, big) { var p = P(x, y), sc = W / vb.w; add({ k: "e", x: p[0], y: p[1], vx: (Math.random() - .5) * 40 * sc / 3, vy: -(40 + Math.random() * 90) * sc / 3, l: 0, m: 1.4 + Math.random() * 1.6, r: (big ? 2.6 : 1.6) * (.6 + Math.random()) * Math.min(2, sc / 2 + .6), h: 20 + Math.random() * 25 }); }
  function spark(x, y, n, hue) { var p = P(x, y), sc = W / vb.w; for (var i = 0; i < n; i++) { var a = Math.random() * 6.283, v = (60 + Math.random() * 260) * sc / 2.4; add({ k: "s", x: p[0], y: p[1], vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 0, m: .6 + Math.random() * .8, r: 1.8 + Math.random() * 2, h: hue + Math.random() * 20 }); } }
  function firework() { var x = W * (.12 + Math.random() * .76), y = H * (.1 + Math.random() * .34), hue = [18, 45, 340, 190, 130, 280][Math.floor(Math.random() * 6)], n = 46; for (var i = 0; i < n; i++) { var a = i / n * 6.283, v = 90 + Math.random() * 110; add({ k: "f", x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 0, m: 1.5 + Math.random() * .6, r: 2.2, h: hue + Math.random() * 25 }); } }
  function dust() { var p = P(150, 372), sc = W / vb.w; add({ k: "d", x: p[0] - 40 * sc, y: p[1] + 6 * sc, vx: -30 - Math.random() * 40, vy: -8 - Math.random() * 10, l: 0, m: .9, r: (6 + Math.random() * 8) * Math.min(1.6, sc / 2 + .4), h: 30 }); }
  function draw(dt) {
    cx.clearRect(0, 0, W, H); cx.globalCompositeOperation = "lighter";
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i]; p.l += dt; if (p.l >= p.m) { parts.splice(i, 1); continue; }
      var u = p.l / p.m, a = 1 - u;
      if (p.k === "f") { p.vy += 70 * dt; p.vx *= .985; } else if (p.k === "s") { p.vy += 120 * dt; } else if (p.k === "e") { p.vx += (Math.random() - .5) * 30 * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.k === "d") { cx.fillStyle = "rgba(190,150,100," + (a * .22).toFixed(3) + ")"; cx.beginPath(); cx.arc(p.x, p.y, p.r * (1 + u * 2), 0, 6.283); cx.fill(); continue; }
      cx.fillStyle = "hsla(" + p.h + ",100%," + (p.k === "e" ? 55 : 65) + "%," + (a * (p.k === "e" ? .9 : 1)).toFixed(3) + ")";
      cx.beginPath(); cx.arc(p.x, p.y, Math.max(.4, p.r * (p.k === "e" ? a + .2 : 1)), 0, 6.283); cx.fill();
    }
    cx.globalCompositeOperation = "source-over";
  }
  function once(k, t, fn) { if (!ev[k] && t >= ev[k + "_t"]) { ev[k] = 1; fn(); } }
  var last = 0, acc = {};
  function frame(now) {
    if (done) return; if (!t0) { t0 = now; last = now; }
    var t = window.__dzT != null ? window.__dzT : (now - t0) / 1000, dt = Math.min(.05, (now - last) / 1000); last = now;
    if (W !== el.clientWidth || H !== el.clientHeight) size();
    if (t > 5.52 && t < 6.7) shake = 14 * (1 - (t - 5.52) / 1.2); else shake = 0;
    camera(t);
    function every(k, p, a, b, fn) { if (t >= a && t <= b) { acc[k] = (acc[k] || 0) + dt; while (acc[k] > p) { acc[k] -= p; fn(); } } }
    every("d", .06, .3, 3.3, dust);
    every("e", .02, 5.7, 9.3, function () { ember(590 + Math.random() * 100, 150 + Math.random() * 190, 1); });
    every("e2", .05, 5.7, 9.3, function () { var h = HEADS[Math.floor(Math.random() * 10)]; ember(h[0], h[1], 1); });
    every("o", .03, 3.7, 5, function () { spark(288 + Math.random() * 4, 198, 1, 45); });
    every("f", .45, 10, 40, firework);
    if (!ev.hit && t >= 5.52) { ev.hit = 1; spark(628, 226, 90, 40); }
    HEADS.forEach(function (h, i) { var k = "h" + i; if (!ev[k] && t >= 5.7 + i * .12) { ev[k] = 1; spark(h[0], h[1], 26, 25); } });
    if (!ev.fw0 && t >= 9.4) { ev.fw0 = 1; firework(); firework(); }
    draw(dt); raf = requestAnimationFrame(frame);
  }
  function size() {
    W = el.clientWidth; H = el.clientHeight; var d = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0);
  }
  function close() { if (done) return; done = true; cancelAnimationFrame(raf); el.classList.add("out"); setTimeout(function () { el.remove(); document.documentElement.style.overflow = ""; }, 750); }

  window.WT_DUSSEHRA = function (note) {
    if (!document.querySelector('link[href*="Caveat"]')) { var fl = document.createElement("link"); fl.rel = "stylesheet"; fl.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"; document.head.appendChild(fl); }
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    el = document.createElement("div"); el.className = "dz"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Dussehra greeting");
    el.innerHTML = '<div class="dz-stage">' + scene() + '</div><div class="dz-red"></div><div class="dz-dawn"></div><canvas></canvas>'
      + '<button class="dz-btn" type="button">Skip</button>'
      + '<div class="dz-t dz-1"><small>&#2357;&#2367;&#2332;&#2351;&#2342;&#2358;&#2350;&#2368;</small><h2 class="dz-gold">Vijayadashami</h2></div>'
      + '<div class="dz-t dz-2"><h2 class="dz-gold">Jai Shri Ram</h2></div>'
      + '<div class="dz-t dz-3"><h2 class="dz-gold">Happy Dussehra!</h2><p>May every wrong in your life burn away and every right thing win.' + (note ? "<br>" + note : "") + '</p></div>'
      + '<div class="dz-ft"><img src="/assets/logo-dark.svg" alt=""><b>' + NAME + '</b><span>A grand welcome to WealthyTrees</span></div>';
    document.body.appendChild(el); document.documentElement.style.overflow = "hidden";
    svg = el.querySelector("svg"); cv = el.querySelector("canvas"); cx = cv.getContext("2d");
    el.querySelector(".dz-btn").onclick = close;
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", k); } });
    size(); raf = requestAnimationFrame(frame);
    setTimeout(close, 42000);
  };
})();
