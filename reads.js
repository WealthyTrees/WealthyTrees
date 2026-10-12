/* Quick Reads: swipeable story cards built from /data/brief.json, with tap-for-meaning jargon terms */
(function () {
  var root = document.getElementById("p-reads"), tabBtn = document.getElementById("t-reads");
  if (!root || !tabBtn) return;

  /* Plain-English meanings. Education only. Add more lines any time: "term": "meaning". */
  var GLOSS = {
    "repo rate": "The interest rate at which the RBI lends short-term money to banks. It influences loan and deposit rates across the economy.",
    "RBI": "Reserve Bank of India, the country's central bank. It sets the repo rate and looks after the rupee and the banking system.",
    "MPC": "Monetary Policy Committee, the RBI panel that decides the repo rate.",
    "SEBI": "Securities and Exchange Board of India, the regulator of the stock market.",
    "Sensex": "An index of 30 large companies listed on the BSE. It shows how big Indian stocks are moving overall.",
    "Bank Nifty": "An index of the biggest banking stocks on the NSE.",
    "Nifty": "The Nifty 50: an index of 50 large companies on the NSE. It is a quick read on how the Indian market is doing.",
    "S&P 500": "An index of 500 large US-listed companies, widely used as a gauge of the US stock market.",
    "Nasdaq": "A US stock exchange known for technology companies. Its main index tracks most of the stocks listed on it.",
    "Dow Jones": "An index of 30 large US companies.",
    "Dow": "Short for the Dow Jones index: 30 large US companies.",
    "inflation": "The rate at which prices rise over time, so each rupee buys a little less than before.",
    "CPI": "Consumer Price Index. It tracks price changes in a basket of things households buy and is India's main retail inflation measure.",
    "GDP": "Gross Domestic Product: the total value of goods and services a country produces in a period. A broad measure of economic size and growth.",
    "fiscal deficit": "When the government spends more than it earns (not counting borrowing). The gap is filled by borrowing.",
    "current account deficit": "When a country pays more to the rest of the world (for imports, services and transfers) than it earns from it.",
    "trade deficit": "When a country imports more goods than it exports.",
    "tariff": "A tax on imported goods.",
    "recession": "A significant, broad slowdown in economic activity. A common rule of thumb is two straight quarters of falling GDP.",
    "FII": "Foreign Institutional Investor: an overseas fund that buys and sells Indian shares and bonds.",
    "FPI": "Foreign Portfolio Investor: an overseas investor holding Indian shares or bonds.",
    "DII": "Domestic Institutional Investor: big Indian investors such as mutual funds and insurers.",
    "bond yield": "The yearly return from a bond, shown as a percentage of its price. When a bond's price falls, its yield rises.",
    "yield": "The yearly return from a bond or investment, shown as a percentage of its price.",
    "crude oil": "Unrefined petroleum. Its price affects fuel costs and inflation, and India imports most of the oil it uses.",
    "Brent": "A global benchmark price for crude oil.",
    "WTI": "West Texas Intermediate: the US benchmark price for crude oil.",
    "OPEC": "A group of oil-producing countries that coordinate how much crude they supply.",
    "MCX": "Multi Commodity Exchange of India, where commodities such as gold, silver and crude oil are traded.",
    "safe haven": "An asset, such as gold, that investors often turn to when markets feel uncertain.",
    "futures": "A contract to buy or sell something at a fixed price on a set future date.",
    "market cap": "Market capitalisation: a company's total share value, found by multiplying its share price by its number of shares.",
    "market capitalisation": "A company's total share value, found by multiplying its share price by its number of shares.",
    "P/E ratio": "Price-to-earnings ratio: share price divided by earnings per share. It shows how much investors pay for each rupee of profit.",
    "P/E": "Price-to-earnings ratio: share price divided by earnings per share.",
    "EPS": "Earnings per share: a company's profit divided by its number of shares.",
    "dividend": "A share of a company's profit paid out to its shareholders.",
    "IPO": "Initial Public Offering: when a company sells its shares to the public for the first time.",
    "ETF": "Exchange-traded fund: a basket of securities that trades on an exchange like a single share.",
    "NPA": "Non-performing asset: a loan where the borrower has stopped paying interest or principal for 90 days or more.",
    "rate cut": "When a central bank lowers its policy interest rate, which makes borrowing cheaper.",
    "rate hike": "When a central bank raises its policy interest rate, which makes borrowing costlier.",
    "basis point": "One hundredth of a percentage point. So 25 basis points is 0.25%.",
    "bps": "Basis points. One basis point is 0.01 percentage point.",
    "liquidity": "How easily something can be bought or sold at a fair price. In banking, it also means the cash available in the system.",
    "volatility": "How sharply and how quickly prices move up and down.",
    "bull market": "A period when prices rise broadly over a sustained stretch.",
    "bear market": "A period when prices fall broadly, often defined as a drop of 20% or more from a recent peak.",
    "forex reserves": "Foreign currency held by the central bank to support the rupee and pay for imports.",
    "foreign exchange reserves": "Foreign currency held by the central bank to support the rupee and pay for imports.",
    "Federal Reserve": "The central bank of the United States. Its interest rate decisions affect markets worldwide.",
    "Fed": "Short for the Federal Reserve, the central bank of the United States.",
    "dollar index": "A measure of the US dollar against a basket of six major currencies.",
    "DXY": "The dollar index: the US dollar measured against a basket of six major currencies."
  };

  var esc = function (s) { return s.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&"); };
  var keys = Object.keys(GLOSS).sort(function (a, b) { return b.length - a.length; });
  var map = {}; keys.forEach(function (k) { map[k.toLowerCase()] = k; });
  var RX = new RegExp("\\b(?:" + keys.map(esc).join("|") + ")(?:s|es)?\\b", "gi");
  function lookup(m) {
    var l = m.toLowerCase();
    if (map[l]) return map[l];
    if (l.slice(-2) === "es" && map[l.slice(0, -2)]) return map[l.slice(0, -2)];
    if (l.slice(-1) === "s" && map[l.slice(0, -1)]) return map[l.slice(0, -1)];
    return null;
  }

  /* Fill an element with text, turning the first mention of each known term into a tappable button. */
  var uid = 0;
  function fill(el, text, used) {
    var last = 0, m;
    RX.lastIndex = 0;
    while ((m = RX.exec(text))) {
      var key = lookup(m[0]);
      if (!key || used.n >= 4 || used[key]) continue;
      if (/^[A-Z]/.test(key) && m[0].indexOf(key) !== 0) continue; /* "Fed" must be capitalised; "fed" is just a word */
      used[key] = 1; used.n++;
      el.appendChild(document.createTextNode(text.slice(last, m.index)));
      var b = document.createElement("button");
      b.type = "button"; b.className = "jt"; b.textContent = m[0]; b.dataset.k = key;
      b.setAttribute("aria-expanded", "false");
      el.appendChild(b);
      last = m.index + m[0].length;
    }
    el.appendChild(document.createTextNode(text.slice(last)));
  }

  /* One shared popover for all terms */
  var pop = document.createElement("div");
  pop.className = "gloss"; pop.hidden = true; pop.id = "gloss"; pop.setAttribute("role", "dialog");
  pop.innerHTML = '<b class="gt"></b><p class="gd"></p><a href="/learn.html">More in Learn</a>';
  document.body.appendChild(pop);
  var openBtn = null;
  function closePop(refocus) {
    if (!openBtn) return;
    openBtn.setAttribute("aria-expanded", "false");
    var b = openBtn; openBtn = null; pop.hidden = true;
    if (refocus) b.focus();
  }
  function openPop(b) {
    if (openBtn === b) { closePop(); return; }
    closePop();
    openBtn = b; b.setAttribute("aria-expanded", "true");
    pop.querySelector(".gt").textContent = b.dataset.k;
    pop.querySelector(".gd").textContent = GLOSS[b.dataset.k];
    pop.style.visibility = "hidden"; pop.hidden = false;
    var r = b.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    var left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
    var top = r.bottom + 8;
    if (top + h > window.innerHeight - 8 && r.top - h - 8 > 8) top = r.top - h - 8;
    pop.style.left = left + "px"; pop.style.top = top + "px"; pop.style.visibility = "";
  }
  root.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".jt");
    if (b) { e.stopPropagation(); openPop(b); }
  });
  document.addEventListener("click", function (e) { if (openBtn && !pop.contains(e.target)) closePop(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(true); });
  window.addEventListener("scroll", function () { closePop(); }, { passive: true });
  window.addEventListener("resize", function () { closePop(); });
  root.addEventListener("scroll", function () { closePop(); }, { passive: true, capture: true });

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  var CHEV = function (d) { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function build(items) {
    root.innerHTML = "";
    if (!items.length) { root.appendChild(el("p", "note", "No stories yet. Please check back soon.")); return; }
    var head = el("div", "rhead"), count = el("span", "rcount");
    count.setAttribute("aria-live", "polite");
    var nav = el("div", "rnav"), prev = el("button", "rbtn"), next = el("button", "rbtn");
    prev.type = next.type = "button";
    prev.setAttribute("aria-label", "Previous story"); next.setAttribute("aria-label", "Next story");
    prev.innerHTML = CHEV("M15 5l-7 7 7 7"); next.innerHTML = CHEV("M9 5l7 7-7 7");
    nav.append(prev, next); head.append(count, nav);

    var track = el("div", "reads");
    track.tabIndex = 0; track.setAttribute("role", "region");
    track.setAttribute("aria-roledescription", "carousel"); track.setAttribute("aria-label", "Quick Reads stories");
    var dots = el("div", "dots"), cards = [], dotEls = [];

    items.forEach(function (it, i) {
      var c = el("article", "rc" + (/commod/i.test(it.category || "") ? " gold" : ""));
      c.setAttribute("role", "group"); c.setAttribute("aria-roledescription", "story");
      c.setAttribute("aria-label", (i + 1) + " of " + items.length);
      var used = { n: 0 };
      var num = el("span", "rnum", String(i + 1).padStart(2, "0")); num.setAttribute("aria-hidden", "true");
      var tag = el("span", "tag " + String(it.category || "").toLowerCase(), it.category || "");
      var h = el("h3", "", it.title || "");
      var s = el("p", "rs"); fill(s, it.summary || "", used);
      var why = el("div", "rwhy"), wl = el("b", "", "Why it matters"), wp = el("span"); fill(wp, it.why || "", used);
      why.append(wl, wp);
      c.append(num, tag, h, s);
      if (it.why) c.append(why);
      if (typeof spark === "function" && it.spark && it.spark.length > 1) {
        c.insertAdjacentHTML("beforeend", spark(it.spark, it.spark[it.spark.length - 1] >= it.spark[0]));
      }
      var foot = el("div", "rfoot");
      if (it.url && /^https?:\/\//i.test(it.url)) {
        var a = el("a", "src", "Source: " + (it.source || "link")); a.href = it.url; a.target = "_blank"; a.rel = "noopener noreferrer"; foot.append(a);
      }
      c.append(foot);
      c.style.animationDelay = (i * 40) + "ms";
      track.append(c); cards.push(c);

      var d = el("button"); d.type = "button"; d.setAttribute("aria-label", "Go to story " + (i + 1));
      d.onclick = function () { go(i); }; dots.append(d); dotEls.push(d);
    });

    var note = el("p", "note", "Summaries are written by AI from the linked sources and can contain mistakes. Check the source. Tap an underlined term for its meaning. For education only, not investment advice.");
    root.append(head, track, dots, note);

    var now = 0;
    function go(i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      track.scrollTo({ left: cards[i].offsetLeft - 3, behavior: reduce ? "auto" : "smooth" });
    }
    function cur() {
      if (track.scrollLeft <= 2) return 0;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 3) return cards.length - 1;
      var base = track.scrollLeft, best = 0, bd = 1e9;
      cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft - 3 - base); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    function upd() {
      if (!track.clientWidth) return; /* tab hidden: measure when it becomes visible */
      now = cur();
      count.textContent = (now + 1) + " / " + cards.length;
      prev.disabled = now === 0; next.disabled = now === cards.length - 1;
      dotEls.forEach(function (d, i) { if (i === now) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
    }
    var raf = 0;
    track.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(upd); }, { passive: true });
    window.addEventListener("resize", upd);
    function step(dir) { /* move to the neighbouring card that actually changes the view */
      var x = track.scrollLeft, t = dir > 0 ? cards.length - 1 : 0, i;
      if (dir > 0) { for (i = 0; i < cards.length; i++) if (cards[i].offsetLeft - 3 > x + 4) { t = i; break; } }
      else { for (i = cards.length - 1; i >= 0; i--) if (cards[i].offsetLeft - 3 < x - 4) { t = i; break; } }
      go(t);
    }
    prev.onclick = function () { step(-1); }; next.onclick = function () { step(1); };
    track.addEventListener("keydown", function (e) {
      if (e.target !== track) return;
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(cards.length - 1); }
    });
    if (window.ResizeObserver) new ResizeObserver(upd).observe(track);
    tabBtn.addEventListener("click", function () { requestAnimationFrame(upd); });
    upd();
  }

  root.appendChild(el("p", "note", "Loading stories\u2026"));
  fetch("/data/brief.json").then(function (r) { return r.json(); })
    .then(function (d) { build(d.items || []); })
    .catch(function () { root.innerHTML = ""; root.appendChild(el("p", "note", "Quick Reads are unavailable right now. See Today\u2019s brief.")); });
})();
