/* WealthyTrees dussehra.js v3: 24-second cinematic Ramleela Dussehra intro + sliding close sequence
   (all drawn in code, no external images except /assets/logo-dark.svg with inline SVG fallback).
   Sequence (24s total):
   1. Full battleground & Chariot ride-in ("Buraai Par Achhai Ki Jeet") [0.0s - 4.2s]
   2. Ram Ji draws & fires the divine Brahmastra arrow ("Jai Shri Ram") [4.2s - 6.85s]
   3. Arrow strikes Ravan; Ravan's 10 heads & body burst into festive crackers [6.85s - 12.5s]
   4. Flowers of all varieties (Marigold, Rose, Lotus, Jasmine) rain on Ram Ji & across screen [11.8s - 24.0s]
   5. "Happy Dussehra!", Dussehra quote & "WealthyTrees Private Limited wishes you a very Happy Dussehra" + smooth sliding close [16.0s - 24.0s]
   Started by festival.js on 20 Oct. Preview any time: add ?fest=2026-10-20 to a page address. */
(function () {
  var G = 380;
  var HEADS = [
    [640, 140, 22], [603, 128, 17], [677, 128, 17], [572, 110, 15], [708, 110, 15],
    [610, 96, 15],  [670, 96, 15],  [588, 74, 13],  [692, 74, 13],  [640, 66, 16]
  ];
  var NAME = "WealthyTrees Private Limited";
  var WISH_LINE = NAME + " wishes you a very Happy Dussehra";

  function ravHead(h, i) {
    var x = h[0], y = h[1], r = h[2];
    return '<g class="dz-hb" style="animation-delay:' + (7.05 + i * 0.16).toFixed(2) + 's">'
      + '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#dzRav)" stroke="#12081f" stroke-width="2"/>'
      + '<path d="M' + (x - r) + ' ' + (y - r * 0.35) + 'L' + (x - r * 0.75) + ' ' + (y - r * 1.55) + 'L' + (x - r * 0.25) + ' ' + (y - r * 0.95) + 'L' + x + ' ' + (y - r * 1.8) + 'L' + (x + r * 0.25) + ' ' + (y - r * 0.95) + 'L' + (x + r * 0.75) + ' ' + (y - r * 1.55) + 'L' + (x + r) + ' ' + (y - r * 0.35) + 'Z" fill="url(#dzGold)" stroke="#5a3a08" stroke-width="1.2"/>'
      + '<path d="M' + (x - r * 0.75) + ' ' + (y - r * 0.28) + 'L' + (x - r * 0.15) + ' ' + (y - r * 0.05) + ' M' + (x + r * 0.75) + ' ' + (y - r * 0.28) + 'L' + (x + r * 0.15) + ' ' + (y - r * 0.05) + '" stroke="#0a0412" stroke-width="' + Math.max(2, r * 0.16) + '" stroke-linecap="round"/>'
      + '<ellipse class="dz-eye" cx="' + (x - r * 0.4) + '" cy="' + (y + r * 0.08) + '" rx="' + r * 0.2 + '" ry="' + r * 0.13 + '" fill="#ff3b2f"/>'
      + '<ellipse class="dz-eye" cx="' + (x + r * 0.4) + '" cy="' + (y + r * 0.08) + '" rx="' + r * 0.2 + '" ry="' + r * 0.13 + '" fill="#ff3b2f"/>'
      + '<path d="M' + (x - r * 0.5) + ' ' + (y + r * 0.5) + ' Q' + x + ' ' + (y + r * 0.3) + ' ' + (x + r * 0.5) + ' ' + (y + r * 0.5) + '" fill="none" stroke="#0a0412" stroke-width="' + Math.max(1.6, r * 0.12) + '" stroke-linecap="round"/>'
      + '<path d="M' + (x - r * 0.3) + ' ' + (y + r * 0.45) + 'l' + r * 0.08 + ' ' + r * 0.28 + 'l' + r * 0.08 + ' -' + r * 0.25 + 'M' + (x + r * 0.14) + ' ' + (y + r * 0.45) + 'l' + r * 0.08 + ' ' + r * 0.28 + 'l' + r * 0.08 + ' -' + r * 0.25 + '" fill="#fff" stroke="#fff" stroke-width="1"/></g>';
  }

  function flame(x, y, k, d) {
    return '<g transform="translate(' + x + ' ' + y + ')"><g class="dz-fl" style="animation-delay:' + d + 's;--k:' + (k * 0.55).toFixed(2) + '"><path d="M0 0C-18 -20 -9 -46 0 -76C11 -46 20 -20 0 0Z" fill="#ff5a14"/><path d="M0 0C-11 -12 -6 -30 0 -48C6 -30 12 -12 0 0Z" fill="#ffb02e"/><path d="M0 0C-5 -6 -3 -16 0 -26C3 -16 5 -6 0 0Z" fill="#fff2a8"/></g></g>';
  }

  function battleTent(x, sc) {
    var y = G - 8;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')" opacity=".72">'
      + '<path d="M-38 0 L0 -46 L38 0Z" fill="#2d123d" stroke="#6b3d0a" stroke-width="1.5"/>'
      + '<path d="M-14 0 L0 -26 L14 0Z" fill="#180824"/>'
      + '<path d="M0 -46 V-68" stroke="#d9a032" stroke-width="2"/>'
      + '<path d="M0 -68 L22 -62 L14 -56 L22 -50 L0 -52Z" fill="#e5322d" class="dz-flag"/>'
      + '</g>';
  }

  function horse(x, y, tone, dl) {
    var legs = '';
    [[-26, 0], [-14, 0.22], [16, 0.11], [28, 0.33]].forEach(function (l, i) {
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

  function spokes() {
    var s = '';
    for (var i = 0; i < 8; i++) {
      s += '<line x1="0" y1="0" x2="0" y2="-32" stroke="url(#dzGold)" stroke-width="4" transform="rotate(' + i * 45 + ')"/>';
    }
    return s;
  }

  function scene() {
    var s = '<svg viewBox="0 0 800 450" style="width:100%;height:100%;display:block" role="img" aria-label="Lord Ram rides his chariot onto the battleground, shoots a divine arrow, Ravan bursts into crackers, and flowers shower upon Ram. Buraai par achhai ki jeet." preserveAspectRatio="xMidYMid meet">';
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

    /* Starry sky + moon + battleground horizon glow */
    var st = '';
    for (var i = 0; i < 70; i++) {
      st += '<circle cx="' + (((i * 137) % 2000) - 600) + '" cy="' + (((i * 71) % 760) - 520) + '" r="' + (i % 4 ? 1.4 : 2.4) + '" fill="#fff" class="dz-tw" style="animation-delay:' + (i % 9) * 0.35 + 's"/>';
    }
    s += st + '<circle cx="110" cy="60" r="30" fill="#ffeab0"/><circle cx="110" cy="60" r="58" fill="url(#dzAuraG)"/>';
    s += '<ellipse cx="400" cy="' + G + '" rx="900" ry="120" fill="url(#dzHor)" opacity=".75"/>';

    /* Distant mountain ridges & full battleground silhouettes (war tents, standards, Lanka fortress) */
    s += '<path d="M-800 ' + (G - 8) + ' L-420 315 L-210 355 L-40 302 L140 358 L310 312 L470 356 L620 308 L840 352 L1100 310 L1400 ' + (G - 8) + 'Z" fill="#1e0d30" opacity=".68"/>';
    s += battleTent(42, 0.85) + battleTent(390, 0.72) + battleTent(455, 0.9) + battleTent(825, 0.8);
    s += '<path d="M500 ' + (G - 8) + ' V300 L512 280 L524 300 V' + (G - 8) + 'M540 ' + (G - 8) + ' V270 Q556 240 572 270 V' + (G - 8) + 'M700 ' + (G - 8) + ' V290 L714 262 L728 290 V' + (G - 8) + 'M740 ' + (G - 8) + ' V310 H770 V' + (G - 8) + '" fill="#241037" stroke="none" opacity=".85"/>';

    /* Battleground terrain */
    s += '<path d="M-1200 ' + (G - 8) + ' L0 ' + G + ' Q200 ' + (G - 16) + ' 400 ' + (G - 4) + ' T800 ' + (G - 8) + ' L2000 ' + (G - 6) + ' V1200 H-1200Z" fill="#150a26"/>';
    s += '<path d="M-1200 ' + (G + 10) + ' H2000" stroke="#3b1f55" stroke-width="2"/>';

    /* Ravan effigy on battleground */
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

    /* Flames & cracker bursts over Ravan */
    s += '<g class="dz-fire">'
      + flame(610, 290, 1.5, 0) + flame(640, 280, 2, 0.1) + flame(672, 290, 1.6, 0.2)
      + flame(622, 230, 1.7, 0.15) + flame(660, 230, 1.8, 0.05) + flame(640, 170, 1.9, 0.25)
      + flame(590, 190, 1.2, 0.3) + flame(692, 190, 1.2, 0.12) + flame(640, 110, 1.6, 0.22)
      + '</g>';

    /* Chariot + Horses + Lord Ram */
    s += '<g class="dz-ch">';
    s += '<ellipse cx="180" cy="' + (G - 4) + '" rx="150" ry="8" fill="#000" opacity=".35"/>';
    s += horse(318, 318, "#fbf5ea", 0.1) + horse(344, 308, "#e8dcc4", 0);
    s += '<path d="M236 330 L330 312" stroke="url(#dzGold)" stroke-width="5" stroke-linecap="round"/>';
    s += '<g transform="translate(150 350)"><g class="dz-wh"><circle r="42" fill="#2a1608" stroke="url(#dzGold)" stroke-width="7"/><circle r="30" fill="none" stroke="url(#dzGold)" stroke-width="3"/>' + spokes() + '<circle r="9" fill="url(#dzGold)"/></g></g>';
    s += '<path d="M92 290 L240 290 Q256 290 252 308 L238 346 L106 346 Q92 340 90 318Z" fill="url(#dzGold)" stroke="#6b3d0a" stroke-width="3"/><path d="M240 290 Q268 268 256 240" fill="none" stroke="url(#dzGold)" stroke-width="9" stroke-linecap="round"/>';
    s += '<path d="M104 312 H232" stroke="#8a4a10" stroke-width="2"/><circle cx="128" cy="326" r="6" fill="#e5322d"/><circle cx="170" cy="326" r="6" fill="#2a79e0"/><circle cx="212" cy="326" r="6" fill="#e5322d"/>';
    s += '<path d="M100 292 V130" stroke="url(#dzGold)" stroke-width="5"/><g class="dz-flag"><path d="M100 132 L40 148 L62 166 L40 186 L100 176Z" fill="url(#dzSaff)" stroke="#8a3d08" stroke-width="2"/><text x="76" y="166" font-size="18" fill="#fff" text-anchor="middle">&#2384;</text></g>';

    /* Lord Ram */
    s += '<circle class="dz-halo" cx="170" cy="146" r="48" fill="url(#dzAuraG)"/><circle cx="170" cy="146" r="31" fill="none" stroke="#ffe9a0" stroke-width="2" opacity=".85"/>';
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

    /* Divine Arrow + Brahmastra Charge */
    s += '<g class="dz-arr"><g class="dz-arr0"><path d="M196 198 L270 198" stroke="url(#dzGold)" stroke-width="4" stroke-linecap="round"/><path d="M268 190 L288 198 L268 206Z" fill="#fff2a8"/><path d="M198 198 L188 190 M198 198 L188 206" stroke="#e5322d" stroke-width="3"/><rect class="dz-trl" x="60" y="193" width="210" height="10" fill="url(#dzTrail)"/></g></g>';
    s += '<g transform="translate(288 198)"><circle class="dz-orb" r="22" fill="url(#dzAuraG)"/><circle class="dz-orb2" r="8" fill="#fff8d0"/><circle class="dz-ring" r="14" fill="none" stroke="#fff2a8" stroke-width="2.5"/></g>';
    s += '</g>';

    /* Arrow Impact + Twin Shockwaves on Ravan */
    s += '<g transform="translate(628 226)"><circle class="dz-hit" r="60" fill="#fff6c9"/><circle class="dz-sw" r="30" fill="none" stroke="#ffd36a" stroke-width="6"/><circle class="dz-sw dz-sw2" r="30" fill="none" stroke="#fff" stroke-width="3"/></g>';

    /* 14 Auspicious Diyas along Foreground */
    for (var d = 0; d < 14; d++) {
      var x = -40 + d * 66, y = G + 24 + (d % 2) * 8;
      s += '<g transform="translate(' + x + ' ' + y + ')" class="dz-di" style="animation-delay:' + (11.5 + d * 0.1) + 's"><ellipse rx="26" ry="9" cy="-4" fill="url(#dzAuraG)"/><path d="M-10 0 Q0 13 10 0Z" fill="#d6702d" stroke="#2b1240" stroke-width="1.5"/><path class="dz-df" d="M0 -2 C-5 -9 -2 -14 0 -20 C3 -14 5 -9 0 -2Z" fill="#ffd54a" style="animation-delay:' + d * 0.13 + 's"/></g>';
    }
    return s + '</svg>';
  }

  /* Inline SVG fallback logo in case /assets/logo-dark.svg is unavailable in local/GitHub preview */
  var FALLBACK_LOGO_URI = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">'
    + '<defs><radialGradient id="g" cx="50%" cy="42%" r="52%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="55%" stop-color="#10b981"/><stop offset="100%" stop-color="#065f46"/></radialGradient></defs>'
    + '<circle cx="48" cy="48" r="44" fill="#0d1f1a" stroke="#f59e0b" stroke-width="3"/>'
    + '<circle cx="48" cy="38" r="24" fill="url(#g)"/>'
    + '<circle cx="33" cy="43" r="14" fill="url(#g)"/>'
    + '<circle cx="63" cy="43" r="14" fill="url(#g)"/>'
    + '<path d="M44 52 L42 76 L54 76 L52 52Z" fill="#f59e0b"/>'
    + '<circle cx="48" cy="32" r="3.5" fill="#fef08a"/><circle cx="38" cy="40" r="3" fill="#fef08a"/><circle cx="58" cy="40" r="3" fill="#fef08a"/>'
    + '</svg>'
  );

  var CSS = ".dz{position:fixed;inset:0;z-index:99995;overflow:hidden;background:linear-gradient(#0a0620 0%,#1d0f3d 40%,#4a1a55 75%,#a8402f 100%);opacity:0;transform:translateY(0);animation:dzin .85s ease forwards;font-family:Inter,system-ui,sans-serif;color:#fff;will-change:transform,opacity}"
    + ".dz.out{animation:dzslideout .95s cubic-bezier(.77,0,.175,1) forwards}@keyframes dzin{to{opacity:1}}@keyframes dzslideout{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-102%);opacity:0}}"
    + ".dz-stage{position:absolute;inset:0}.dz-red{position:absolute;inset:0;background:radial-gradient(circle at 75% 60%,rgba(255,40,30,.55),rgba(120,0,40,.0) 60%);opacity:0;animation:dzred 9.5s ease 1s forwards;pointer-events:none}"
    + "@keyframes dzred{20%{opacity:1}70%{opacity:1}100%{opacity:0}}"
    + ".dz-dawn{position:absolute;inset:0;background:linear-gradient(#ffcf8a 0%,#ff9a5a 38%,#c9507a 72%,#4a2a7a 100%);opacity:0;animation:dzdawn 3s ease 11.2s forwards;pointer-events:none;mix-blend-mode:screen}@keyframes dzdawn{to{opacity:.36}}"
    + ".dz canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2}"
    + ".dz-t{position:absolute;left:0;right:0;top:0;padding:3.8rem 1rem 0;text-align:center;pointer-events:none;z-index:3}"
    + ".dz-gold{background:linear-gradient(180deg,#fff6c8,#ffd25a 45%,#e08a1a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 14px rgba(0,0,0,.55))}"
    + ".dz-t h2{margin:0;font:700 clamp(2.3rem,8.5vw,4.4rem)/1.06 Caveat,'Segoe Print',cursive;letter-spacing:.02em}"
    + ".dz-t small{display:block;font-weight:700;letter-spacing:.26em;font-size:clamp(.68rem,2.2vw,.92rem);color:#ffe9b8;margin-top:.4rem;text-shadow:0 2px 8px rgba(0,0,0,.65);text-transform:uppercase}"
    + ".dz-t p{margin:.55rem auto 0;max-width:36rem;font-weight:600;font-size:clamp(.92rem,3vw,1.14rem);line-height:1.45;color:#fff3d6;text-shadow:0 2px 10px rgba(0,0,0,.75)}"
    + ".dz-1{opacity:0;animation:dzf 3.7s ease .4s forwards}.dz-2{opacity:0;animation:dzf 2.8s ease 4.1s forwards}.dz-2b{opacity:0;animation:dzf 3.6s ease 12.2s forwards}@keyframes dzf{16%,80%{opacity:1;transform:none}0%{transform:translateY(12px)}100%{opacity:0}}"
    + ".dz-3{opacity:0;transform:translateY(18px) scale(.94);animation:dzup 1.15s cubic-bezier(.2,1.3,.4,1) 16.0s forwards}@keyframes dzup{to{opacity:1;transform:none}}"
    + ".dz-ft{position:absolute;left:50%;transform:translateX(-50%);width:max-content;max-width:94vw;bottom:max(16px,env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:.2rem;text-align:center;z-index:3;padding:.65rem 1.5rem .8rem;border-radius:20px;background:rgba(18,8,38,.74);border:1px solid rgba(255,214,120,.55);box-shadow:0 10px 34px rgba(0,0,0,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;animation:dzfi 1.2s ease 16.8s forwards;pointer-events:none}@keyframes dzfi{to{opacity:1}}"
    + ".dz-ft img{width:68px;height:68px;margin:-.15rem 0 -.15rem;filter:drop-shadow(0 0 14px rgba(255,214,120,.8))}"
    + ".dz-ft b{font:700 clamp(1rem,3.4vw,1.28rem) Inter,system-ui,sans-serif;letter-spacing:.03em;color:#ffd54a;text-shadow:0 2px 10px rgba(0,0,0,.8)}"
    + ".dz-ft span{font-size:.82rem;font-weight:600;color:#fff3d6;text-shadow:0 2px 8px rgba(0,0,0,.7)}"
    + ".dz-bar{position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.12);z-index:5}.dz-bar-fill{height:100%;width:0%;background:linear-gradient(90deg,#ff6b00,#ffd54a,#10b981);box-shadow:0 0 10px #ffd54a;animation:dzprog 24s linear forwards}@keyframes dzprog{to{width:100%}}"
    + ".dz-btn{position:absolute;top:14px;right:14px;border:0;border-radius:999px;background:#f2b632;color:#2b1240;font:700 .92rem Inter,system-ui,sans-serif;padding:.58rem 1.25rem;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4);z-index:5;transition:transform .15s ease,background .15s ease}.dz-btn:hover{background:#ffd54a;transform:translateY(-1px)}.dz-btn:focus-visible{outline:3px solid #fff;outline-offset:2px}"
    + ".dz svg *{transform-box:fill-box;transform-origin:center}"
    + ".dz-tw{animation:dztw 2.8s ease-in-out infinite}@keyframes dztw{50%{opacity:.2}}"
    + ".dz-ch{animation:dzch 3.6s cubic-bezier(.15,.7,.25,1) both}@keyframes dzch{from{transform:translateX(-380px)}to{transform:translateX(0)}}"
    + ".dz-wh{animation:dzwh 3.6s cubic-bezier(.15,.7,.25,1) both}@keyframes dzwh{from{transform:rotate(0)}to{transform:rotate(1260deg)}}"
    + ".dz-lg{transform-origin:50% 0;animation:dzlg .42s ease-in-out 9 alternate both}@keyframes dzlg{from{transform:rotate(-30deg)}to{transform:rotate(30deg)}}"
    + ".dz-mane,.dz-tail{animation:dzmn .5s ease-in-out infinite alternate}@keyframes dzmn{to{transform:skewX(-8deg) translateY(2px)}}"
    + ".dz-flag{transform-origin:0 50%;animation:dzfg .5s ease-in-out infinite alternate}@keyframes dzfg{from{transform:skewY(-5deg) scaleX(1)}to{transform:skewY(5deg) scaleX(.9)}}"
    + ".dz-sc{transform-origin:100% 50%;animation:dzsc .7s ease-in-out infinite alternate}@keyframes dzsc{from{transform:skewY(-6deg)}to{transform:skewY(6deg) scaleX(.92)}}"
    + ".dz-dh{transform-origin:50% 0;animation:dzdh .8s ease-in-out infinite alternate}@keyframes dzdh{to{transform:skewX(-4deg)}}"
    + ".dz-halo{animation:dzhl 2.2s ease-in-out infinite alternate}@keyframes dzhl{from{transform:scale(.9);opacity:.7}to{transform:scale(1.14);opacity:1}}"
    + ".dz-rvin{opacity:0;transform:translateY(50px);animation:dzrin 1.8s ease-out .8s forwards}@keyframes dzrin{to{opacity:1;transform:none}}"
    + ".dz-aura{animation:dzau 1.2s ease-in-out infinite alternate}@keyframes dzau{from{transform:scale(.9);opacity:.6}to{transform:scale(1.1);opacity:1}}"
    + ".dz-eye{animation:dzey .6s ease-in-out infinite alternate}@keyframes dzey{from{opacity:.55}to{opacity:1}}"
    + ".dz-heads{animation:dzro .12s linear 2.6s 8 alternate}@keyframes dzro{to{transform:translateY(-3px)}}"
    + ".dz-rvb{animation:dzbf 2.6s ease-in 7.8s forwards}@keyframes dzbf{to{opacity:0;transform:translateY(32px) scale(.92)}}"
    + ".dz-hb{animation:dzhb 1.0s ease-in forwards;animation-fill-mode:forwards}@keyframes dzhb{0%{transform:scale(1);filter:none}28%{transform:scale(1.32);filter:brightness(2)}100%{transform:scale(2.1) translateY(-28px);opacity:0}}"
    + ".dz-rv{animation:dzsh .07s linear 6.85s 20}@keyframes dzsh{50%{transform:translateX(5px)}}"
    + ".dz-fire{opacity:0;animation:dzfo1 .5s ease-out 6.9s forwards,dzfo2 2.4s ease-in 10.2s forwards}@keyframes dzfo1{to{opacity:1}}@keyframes dzfo2{to{opacity:0}}"
    + ".dz-fl{transform-origin:50% 100%;animation:dzfl .4s ease-in-out infinite alternate;transform:scale(var(--k))}@keyframes dzfl{from{transform:scale(calc(var(--k)*.8),calc(var(--k)*.9))}to{transform:scale(calc(var(--k)*1.1),calc(var(--k)*1.25))}}"
    + ".dz-sp{animation:dzsp .01s linear 6.2s forwards}@keyframes dzsp{to{opacity:0}}.dz-ss{opacity:0;animation:dzss .01s linear 6.2s forwards}@keyframes dzss{to{opacity:1}}"
    + ".dz-arr{animation:dzar .65s cubic-bezier(.6,0,.9,.7) 6.2s forwards}.dz-arr0{opacity:0;animation:dzaw .01s linear 4.4s forwards}@keyframes dzaw{to{opacity:1}}@keyframes dzar{0%{transform:translateX(0);opacity:1}92%{opacity:1}100%{transform:translateX(352px);opacity:0}}"
    + ".dz-orb{opacity:0;animation:dzob 1.7s ease-in 4.4s forwards,dzof .15s linear 6.2s forwards}@keyframes dzob{from{transform:scale(.2);opacity:0}to{transform:scale(1.65);opacity:1}}@keyframes dzof{to{opacity:0}}"
    + ".dz-orb2{opacity:0;animation:dzob 1.7s ease-in 4.4s forwards,dzof .15s linear 6.2s forwards}.dz-ring{opacity:0;animation:dzrg .75s ease-out 4.5s 2,dzof .1s linear 6.2s forwards}@keyframes dzrg{from{opacity:1;transform:scale(2.6)}to{opacity:0;transform:scale(.3)}}"
    + ".dz-hit{opacity:0;animation:dzhit .85s ease-out 6.85s forwards}@keyframes dzhit{0%{opacity:1;transform:scale(.2)}100%{opacity:0;transform:scale(2.4)}}"
    + ".dz-sw{opacity:0;animation:dzsw 1.15s ease-out 6.85s forwards}.dz-sw2{animation-delay:7.05s}@keyframes dzsw{0%{opacity:1;transform:scale(.3)}100%{opacity:0;transform:scale(7.5)}}"
    + ".dz-di{opacity:0;animation:dzdi .7s ease forwards}@keyframes dzdi{to{opacity:1}}.dz-df{animation:dzdf .5s ease-in-out infinite alternate}@keyframes dzdf{from{transform:scale(.8)}to{transform:scale(1.2)}}";

  var el, svg, cv, cx, W = 0, H = 0, done = false, t0 = 0, raf = 0, parts = [], flowers = [], ev = {}, shake = 0;

  /* 24-second Camera Keyframes: [time, focusX, focusY, screenFracX, screenFracY, fitW, fitH]
     - 0.0s - 3.6s: Wide battleground & chariot ride-in
     - 4.2s - 6.2s: Focus on Lord Ram drawing divine bow
     - 6.2s - 6.85s: Fast pan following arrow across battleground
     - 6.85s - 11.8s: Focus on Ravan getting hit & bursting into festive crackers
     - 12.2s - 15.8s: Focus on Lord Ram as flowers of all varieties shower upon him
     - 16.2s - 24.0s: Grand wide frame for Happy Dussehra quote, company greeting & fireworks */
  var K = [
    [0.0,  430, 250, 0.50, 0.55, 860, 360],
    [3.5,  420, 250, 0.50, 0.55, 780, 340],
    [4.4,  215, 245, 0.40, 0.55, 330, 330],
    [6.2,  225, 245, 0.40, 0.55, 320, 320],
    [6.8,  450, 240, 0.50, 0.55, 560, 330],
    [7.4,  640, 235, 0.50, 0.55, 360, 380],
    [11.4, 640, 235, 0.50, 0.55, 380, 380],
    [12.8, 210, 230, 0.45, 0.56, 360, 340],
    [15.4, 230, 235, 0.46, 0.56, 420, 350],
    [17.0, 420, 300, 0.50, 0.66, 780, 320]
  ];

  function ease(x) { return x * x * (3 - 2 * x); }
  var vb = { x: 0, y: 0, w: 800, h: 450 };

  function camera(t) {
    var i = 0;
    while (i < K.length - 2 && t > K[i + 1][0]) i++;
    var a = K[i], b = K[i + 1];
    var u = Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])));
    u = ease(u);
    function m(j) { return a[j] + (b[j] - a[j]) * u; }
    var fw = m(5), fh = m(6), sc = Math.min(W / fw, H / fh), vw = W / sc, vh = H / sc;
    var sx = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    var sy = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    vb.w = vw; vb.h = vh;
    vb.x = m(1) - m(3) * vw + sx;
    vb.y = m(2) - m(4) * vh + sy;
    svg.setAttribute("viewBox", vb.x.toFixed(2) + " " + vb.y.toFixed(2) + " " + vw.toFixed(2) + " " + vh.toFixed(2));
  }

  function P(x, y) { return [(x - vb.x) / vb.w * W, (y - vb.y) / vb.h * H]; }
  function add(o) { parts.push(o); }

  function ember(x, y, big) {
    var p = P(x, y), sc = W / vb.w;
    add({
      k: "e", x: p[0], y: p[1],
      vx: (Math.random() - 0.5) * 40 * sc / 3,
      vy: -(40 + Math.random() * 90) * sc / 3,
      l: 0, m: 1.4 + Math.random() * 1.6,
      r: (big ? 2.6 : 1.6) * (0.6 + Math.random()) * Math.min(2, sc / 2 + 0.6),
      h: 20 + Math.random() * 25
    });
  }

  function spark(x, y, n, hue) {
    var p = P(x, y), sc = W / vb.w;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.283, v = (60 + Math.random() * 260) * sc / 2.4;
      add({
        k: "s", x: p[0], y: p[1],
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        l: 0, m: 0.65 + Math.random() * 0.85,
        r: 1.8 + Math.random() * 2.2,
        h: hue + Math.random() * 25
      });
    }
  }

  /* Festive Cracker Burst directly on Ravan's heads & body when struck */
  function ravanCrackerBurst(svgX, svgY) {
    var p = P(svgX, svgY), sc = W / vb.w;
    var hues = [15, 42, 335, 145, 195, 285];
    var baseHue = hues[Math.floor(Math.random() * hues.length)];
    var count = 52;
    for (var i = 0; i < count; i++) {
      var a = (i / count) * 6.283 + (Math.random() - 0.5) * 0.12;
      var v = (75 + Math.random() * 190) * Math.min(1.6, sc / 2.2 + 0.5);
      add({
        k: "f", x: p[0], y: p[1],
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        l: 0, m: 1.15 + Math.random() * 0.65,
        r: 2.2 + Math.random() * 1.4,
        h: baseHue + Math.random() * 28
      });
    }
  }

  function firework() {
    var x = W * (0.12 + Math.random() * 0.76), y = H * (0.1 + Math.random() * 0.36);
    var hue = [18, 45, 340, 190, 130, 280][Math.floor(Math.random() * 6)], n = 48;
    for (var i = 0; i < n; i++) {
      var a = i / n * 6.283, v = 90 + Math.random() * 115;
      add({
        k: "f", x: x, y: y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        l: 0, m: 1.5 + Math.random() * 0.6,
        r: 2.2, h: hue + Math.random() * 25
      });
    }
  }

  function dust() {
    var p = P(150, 372), sc = W / vb.w;
    add({
      k: "d", x: p[0] - 40 * sc, y: p[1] + 6 * sc,
      vx: -30 - Math.random() * 40, vy: -8 - Math.random() * 10,
      l: 0, m: 0.9,
      r: (6 + Math.random() * 8) * Math.min(1.6, sc / 2 + 0.4),
      h: 30
    });
  }

  /* Multi-variety Flower Shower (Pushpavarsha):
     0 = Orange Marigold (Genda), 1 = Golden Marigold, 2 = Crimson Rose Petal (Gulab),
     3 = Pink Sacred Lotus (Kamal), 4 = Fragrant White Jasmine (Mogra) */
  var FLOWER_TYPES = [
    { type: "marigold", c1: "#ff6b00", c2: "#ffb703", r: 8.5 },
    { type: "marigold", c1: "#ffd000", c2: "#fb8500", r: 8.0 },
    { type: "rose",     c1: "#e11d48", c2: "#fb7185", r: 7.5 },
    { type: "lotus",    c1: "#f472b6", c2: "#fbcfe8", r: 9.0 },
    { type: "jasmine",  c1: "#fffbeb", c2: "#fde68a", r: 6.5 }
  ];

  function spawnFlower(onRamFocus) {
    var ft = FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)];
    var ramScreen = P(175, 145);
    var spawnX = onRamFocus && Math.random() < 0.55
      ? ramScreen[0] + (Math.random() - 0.5) * Math.max(260, W * 0.38)
      : Math.random() * W;
    flowers.push({
      x: spawnX,
      y: -16 - Math.random() * 40,
      vx: (Math.random() - 0.5) * 28,
      vy: 62 + Math.random() * 75,
      rot: Math.random() * 6.283,
      vRot: (Math.random() - 0.5) * 2.6,
      sway: Math.random() * 6.283,
      ft: ft,
      l: 0,
      m: 7.5
    });
  }

  function drawSingleFlower(f, alpha) {
    var ft = f.ft, r = ft.r, p;
    cx.save();
    cx.globalAlpha = alpha;
    cx.translate(f.x, f.y);
    cx.rotate(f.rot);

    if (ft.type === "marigold") {
      cx.fillStyle = ft.c1;
      for (p = 0; p < 8; p++) {
        cx.rotate(0.7854);
        cx.beginPath();
        cx.arc(r * 0.52, 0, r * 0.52, 0, 6.283);
        cx.fill();
      }
      cx.fillStyle = ft.c2;
      cx.beginPath();
      cx.arc(0, 0, r * 0.48, 0, 6.283);
      cx.fill();
    } else if (ft.type === "lotus") {
      cx.fillStyle = ft.c1;
      for (p = -2; p <= 2; p++) {
        cx.save();
        cx.rotate(p * 0.42);
        cx.beginPath();
        cx.ellipse(0, -r * 0.55, r * 0.36, r * 0.72, 0, 0, 6.283);
        cx.fill();
        cx.restore();
      }
      cx.fillStyle = "#fde047";
      cx.beginPath();
      cx.arc(0, 0, r * 0.28, 0, 6.283);
      cx.fill();
    } else if (ft.type === "jasmine") {
      cx.fillStyle = ft.c1;
      for (p = 0; p < 6; p++) {
        cx.rotate(1.0472);
        cx.beginPath();
        cx.ellipse(r * 0.48, 0, r * 0.52, r * 0.24, 0, 0, 6.283);
        cx.fill();
      }
      cx.fillStyle = ft.c2;
      cx.beginPath();
      cx.arc(0, 0, r * 0.26, 0, 6.283);
      cx.fill();
    } else {
      /* Rose petal */
      cx.fillStyle = ft.c1;
      cx.beginPath();
      cx.moveTo(0, -r);
      cx.bezierCurveTo(r, -r, r * 0.88, r * 0.6, 0, r);
      cx.bezierCurveTo(-r * 0.88, r * 0.6, -r, -r, 0, -r);
      cx.fill();
    }
    cx.restore();
  }

  function draw(dt, t) {
    cx.clearRect(0, 0, W, H);
    cx.globalCompositeOperation = "lighter";
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.l += dt;
      if (p.l >= p.m) { parts.splice(i, 1); continue; }
      var u = p.l / p.m, a = 1 - u;
      if (p.k === "f") { p.vy += 70 * dt; p.vx *= 0.985; }
      else if (p.k === "s") { p.vy += 120 * dt; }
      else if (p.k === "e") { p.vx += (Math.random() - 0.5) * 30 * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.k === "d") {
        cx.fillStyle = "rgba(190,150,100," + (a * 0.22).toFixed(3) + ")";
        cx.beginPath(); cx.arc(p.x, p.y, p.r * (1 + u * 2), 0, 6.283); cx.fill();
        continue;
      }
      cx.fillStyle = "hsla(" + p.h + ",100%," + (p.k === "e" ? 55 : 65) + "%," + (a * (p.k === "e" ? 0.9 : 1)).toFixed(3) + ")";
      cx.beginPath(); cx.arc(p.x, p.y, Math.max(0.4, p.r * (p.k === "e" ? a + 0.2 : 1)), 0, 6.283); cx.fill();
    }

    /* Render multi-variety flowers in source-over mode so petals have rich natural colors */
    cx.globalCompositeOperation = "source-over";
    for (var j = flowers.length - 1; j >= 0; j--) {
      var f = flowers[j];
      f.l += dt;
      if (f.l >= f.m || f.y > H + 30) { flowers.splice(j, 1); continue; }
      f.x += f.vx * dt + Math.sin(t * 2.2 + f.sway) * 0.85;
      f.y += f.vy * dt;
      f.rot += f.vRot * dt;
      var fa = Math.min(1, (1 - f.l / f.m) * 1.5);
      drawSingleFlower(f, fa);
    }
  }

  var last = 0, acc = {};
  function frame(now) {
    if (done) return;
    if (!t0) { t0 = now; last = now; }
    var t = window.__dzT != null ? window.__dzT : (now - t0) / 1000;
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (W !== el.clientWidth || H !== el.clientHeight) size();
    if (t > 6.85 && t < 8.1) shake = 15 * (1 - (t - 6.85) / 1.25); else shake = 0;
    camera(t);

    function every(k, p, a, b, fn) {
      if (t >= a && t <= b) {
        acc[k] = (acc[k] || 0) + dt;
        while (acc[k] > p) { acc[k] -= p; fn(); }
      }
    }

    /* Act I: Chariot dust clouds */
    every("d", 0.06, 0.3, 3.8, dust);
    /* Act II: Charging golden arrow sparks */
    every("o", 0.03, 4.4, 6.2, function () { spark(288 + Math.random() * 4, 198, 1, 45); });
    /* Act III: Ravan burning embers & bursting crackers */
    every("e", 0.025, 6.9, 11.8, function () { ember(590 + Math.random() * 100, 150 + Math.random() * 190, 1); });
    every("e2", 0.05, 6.9, 11.8, function () { var h = HEADS[Math.floor(Math.random() * 10)]; ember(h[0], h[1], 1); });
    every("rc", 0.28, 7.1, 11.6, function () {
      var h = HEADS[Math.floor(Math.random() * 10)];
      ravanCrackerBurst(h[0] + (Math.random() - 0.5) * 40, h[1] + (Math.random() - 0.5) * 45);
    });
    /* Act IV & V: Multi-variety flower shower on Ram Ji & across the screen */
    every("fl1", 0.045, 11.8, 17.5, function () { spawnFlower(true); });
    every("fl2", 0.075, 17.5, 24.0, function () { spawnFlower(false); });
    /* Sky fireworks */
    every("f", 0.42, 11.2, 23.5, firework);

    /* Arrow hits Ravan at 6.85s -> initial massive cracker explosion */
    if (!ev.hit && t >= 6.85) {
      ev.hit = 1;
      spark(628, 226, 95, 40);
      ravanCrackerBurst(640, 220);
    }

    /* Each of Ravan's 10 heads bursts into crackers sequentially */
    HEADS.forEach(function (h, i) {
      var k = "h" + i;
      if (!ev[k] && t >= 7.05 + i * 0.16) {
        ev[k] = 1;
        spark(h[0], h[1], 28, 25);
        ravanCrackerBurst(h[0], h[1]);
      }
    });

    if (!ev.fw0 && t >= 11.0) { ev.fw0 = 1; firework(); firework(); }

    draw(dt, t);
    raf = requestAnimationFrame(frame);
  }

  function size() {
    W = el.clientWidth; H = el.clientHeight;
    var d = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * d; cv.height = H * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
  }

  function close() {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    el.classList.add("out");
    setTimeout(function () {
      el.remove();
      document.documentElement.style.overflow = "";
    }, 950);
  }

  window.WT_DUSSEHRA = function (note) {
    if (el && document.body && document.body.contains(el)) return;
    done = false; t0 = 0; last = 0; parts = []; flowers = []; ev = {}; acc = {}; shake = 0;

    if (!document.querySelector('link[href*="Caveat"]')) {
      var fl = document.createElement("link");
      fl.rel = "stylesheet";
      fl.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap";
      document.head.appendChild(fl);
    }
    var st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);

    el = document.createElement("div");
    el.className = "dz";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Dussehra greeting from " + NAME);
    el.innerHTML = '<div class="dz-stage">' + scene() + '</div><div class="dz-red"></div><div class="dz-dawn"></div><canvas></canvas>'
      + '<button class="dz-btn" type="button">Skip</button>'
      + '<div class="dz-t dz-1"><small>&#2348;&#2369;&#2352;&#2366;&#2312; &#2346;&#2352; &#2309;&#2330;&#2381;&#2331;&#2366;&#2312; &#2325;&#2368; &#2332;&#2368;&#2340; &bull; VIJAYADASHAMI</small><h2 class="dz-gold">Buraai Par Achhai Ki Jeet</h2><p>The Triumph of Good Over Evil</p></div>'
      + '<div class="dz-t dz-2"><small>THE DIVINE ARROW OF TRUTH</small><h2 class="dz-gold">Jai Shri Ram</h2></div>'
      + '<div class="dz-t dz-2b"><small>&#2346;&#2369;&#2359;&#2381;&#2346;&#2357;&#2352;&#2381;&#2359;&#2366; &bull; CELESTIAL FLOWER SHOWER</small><h2 class="dz-gold">Victory of Light Over Darkness</h2></div>'
      + '<div class="dz-t dz-3"><small>&#2358;&#2369;&#2349; &#2342;&#2358;&#2361;&#2352;&#2366; &bull; HAPPY VIJAYADASHAMI</small><h2 class="dz-gold">Happy Dussehra!</h2><p>&ldquo;May every wrong in your life burn away like Ravan&rsquo;s ten heads of arrogance, and may truth, wisdom, and prosperity triumph.&rdquo;' + (note ? "<br>" + note : "") + '</p></div>'
      + '<div class="dz-ft"><img src="/assets/logo-dark.svg" alt="WealthyTrees Logo"><b>' + WISH_LINE + '</b><span>A grand welcome to WealthyTrees &bull; www.wealthytrees.online</span></div>'
      + '<div class="dz-bar"><div class="dz-bar-fill"></div></div>';

    document.body.appendChild(el);
    document.documentElement.style.overflow = "hidden";

    /* Graceful fallback to embedded SVG tree emblem if /assets/logo-dark.svg is missing in standalone preview */
    var logoImg = el.querySelector(".dz-ft img");
    if (logoImg) {
      logoImg.onerror = function () {
        this.onerror = null;
        this.src = FALLBACK_LOGO_URI;
      };
    }

    svg = el.querySelector("svg");
    cv = el.querySelector("canvas");
    cx = cv.getContext("2d");
    el.querySelector(".dz-btn").onclick = close;
    document.addEventListener("keydown", function k(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", k);
      }
    });
    size();
    raf = requestAnimationFrame(frame);
    /* Sequence closes smoothly with a sliding upward transition at 24 seconds (within 20-25s window) */
    setTimeout(close, 24000);
  };

  /* Auto-launch if ?fest=2026-10-20 or ?preview=1 is in the URL and festival.js hasn't called WT_DUSSEHRA yet */
  if (typeof window !== "undefined" && /[?&](fest|preview)=/i.test(window.location.search)) {
    var autoRun = function () {
      setTimeout(function () {
        if (!el) window.WT_DUSSEHRA();
      }, 150);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoRun);
    } else {
      autoRun();
    }
  }
})();
