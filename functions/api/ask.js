// Cloudflare Pages Function: /api/ask
// Ask Sprout — the floating finance friend. One-stop answers for markets, all finance
// and the site's calculators, in plain English. Uses Gemini (same key as /api/pulse),
// with live prices + today's headlines as context, and exact maths for SIP / EMI / lumpsum.
// Answers stay in the chat; a "Learn more" link points to the module for going deeper.
// Fast paths: evergreen questions get an instant pre-written answer (no AI call), and
// GET ?suggest=1 returns today's suggested questions, which change with the market.
// Educational only: no tips, no predictions, no buy/sell talk.
//
// Needs (set in Cloudflare): secret GEMINI_API_KEY, optional text GEMINI_MODEL,
// optional Workers AI binding named AI, and a KV binding named PULSE (for the rate limit).
import { getHeadlines } from "./headlines.js";

const modelOf = (env) => env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const cfModelOf = (env) => env.WORKERS_AI_MODEL || "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const clip = (s, n) => String(s == null ? "" : s).replace(/\s+/g, " ").trim().slice(0, n);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SYS = `You are Sprout, the friendly finance teacher at WealthyTrees, a learning site for Indian students and beginners. Answer the user's question in plain, simple English — short sentences, no jargon, and define any finance word you use. Use the context given (live prices, today's headlines, the calculator list, the Learn modules) for all numbers, names and events — never invent those. You may also explain, in plain English, the publicly-known ways markets work (for example, how the dollar, interest rates, foreign-investor flows and global cues usually move gold, banks and indices) — that is general education, not a guess about today. If the context does not have a specific fact, say so plainly and point to the closest page below instead of guessing.
STRICT — NEVER BREAK THESE:
1. NEVER give a tip, a stock/fund pick, or a buy/sell recommendation of any kind.
2. NEVER predict where a price, an index or the market will go. Never say what will happen. "No one can know" is ONLY for questions about the future — never use it for a question about what already happened.
3. Educational only. No investment advice. No hype, no fear-mongering. No guaranteed returns.
4. Keep it short: 2–4 short sentences, answered right here in the chat. Then add a clear "For more on this, visit the learning module →" line with the matching Learn module or calculator link when one fits — the link is only for going deeper, never a replacement for the answer.
5. Money amounts in ₹. Percentages as %.
6. If the user asks for a calculation, use the "Calculated result" in the context exactly — do not recompute it.
7. Reply in the same language as the question (Hindi questions get a simple Hindi-English mix is fine, but keep it simple).
8. "Why did it move?" questions (why gold, Nifty, Bank Nifty, the rupee or crude rose or fell TODAY) are about the past, so ALWAYS explain them — never refuse, and never answer with "no one can know". Use the headlines in the context to find the trigger and the live price for how much it moved, and explain the mechanism in plain English — for example, a weaker dollar often lifts gold; an RBI step moves banks; foreign-investor buying lifts indices. If the headlines name a trigger (an RBI decision, a global cue, a foreign-investor flow figure), use it and say so. If they do not, explain the usual drivers and say plainly that today's exact trigger is not in the news, then point to the Learn module that explains the cause in detail.
9. Never start an answer with a greeting ("Hello", "Hi", "Hey", "Namaste") — the chat already greets the user. Begin directly with the answer itself.
10. If the user asks for a return calculation with an amount, a rate and a time, work the number out right here in the chat — never just point them to a calculator. If they do not say whether it is a one-time investment or a monthly SIP, ask them to choose between the two, then work it out once they choose. A calculator link is only a small line at the end for going deeper, never a replacement for the answer.
11. When the user asks about this website itself — its features, its founder, how to find something, or what WealthyTrees is — answer from the "About this website" context and always link to the right page. Never say the context does not mention a feature that is listed there. The heatmap, the stock screener, Live Wire, THE 9:15, the Learn courses and the founder's story are all part of this website.
12. The "For more on this" line must always include a real <a href="...">link</a> to a page from the context. Never write a page name as plain text without a link — a link the reader cannot tap is not a link.
Return ONLY the answer text (plain text with <a href="...">links</a> where useful). No markdown, no JSON.`;

const CALCS = [
  { name: "SIP calculator", url: "/pages/sip-calculator.html", what: "see how a fixed monthly investment grows" },
  { name: "Lumpsum calculator", url: "/pages/lumpsum-calculator.html", what: "grow a one-time investment" },
  { name: "EMI calculator", url: "/pages/emi-calculator.html", what: "home, car and personal loan EMI" },
  { name: "Goal planner", url: "/pages/goal-planner.html", what: "how much to invest monthly for a goal like ₹1 crore" },
  { name: "Cost of delay calculator", url: "/pages/cost-of-delay-calculator.html", what: "what starting your SIP late really costs" },
  { name: "Direct vs regular calculator", url: "/pages/direct-vs-regular-calculator.html", what: "the real cost of regular vs direct mutual funds" },
];
const LEARN = [
  { name: "Beginner 1: Market basics", url: "/learn/beginner/module-1.html" },
  { name: "Beginner 2: Reading a company", url: "/learn/beginner/module-2.html" },
  { name: "Beginner 3: Key ratios (P/E, ROE, debt)", url: "/learn/beginner/module-3.html" },
  { name: "Beginner 4: Reading charts", url: "/learn/beginner/module-4.html" },
  { name: "Beginner 5: RBI to your portfolio", url: "/learn/beginner/module-5.html" },
  { name: "Beginner 6: Risk and behaviour", url: "/learn/beginner/module-6.html" },
  { name: "Intermediate 1: Financial statements", url: "/learn/intermediate/module-1.html" },
  { name: "Intermediate 2: Valuation", url: "/learn/intermediate/module-2.html" },
  { name: "Intermediate 3: Sector thinking", url: "/learn/intermediate/module-3.html" },
  { name: "Intermediate 4: Mutual funds, SIPs, ETFs", url: "/learn/intermediate/module-4.html" },
  { name: "Intermediate 5: Technical analysis", url: "/learn/intermediate/module-5.html" },
  { name: "Intermediate 6: Taxes and costs", url: "/learn/intermediate/module-6.html" },
  { name: "Markets page", url: "/pages/markets.html" },
  { name: "Live Wire", url: "/#p-live" },
  { name: "THE 9:15", url: "/pages/the-915.html" },
];
// What this website itself offers — so Sprout can answer questions about WealthyTrees
// (its features, its founder, how to find something) instead of saying the context
// does not mention it. This is the site's own map; keep it current when a feature
// is added or removed.
const SITE = [
  { name: "Markets heatmap", url: "/pages/heatmap.html", what: "a colour map of 18 Indian and world markets — green means up, red means down; tap any box to learn more; open it from the Markets page" },
  { name: "Stock screener", url: "/pages/markets.html", what: "sort companies by market cap, P/E and change % on the Markets page" },
  { name: "Live Wire", url: "/#p-live", what: "real-time market news on the homepage" },
  { name: "Website tour", url: "https://muse.ai/s/wealthytrees-website-tour-xgi6cxwxixwkxwoxi/GZDl1iozoz4Or9lcZI1Adihh5KW7chf6MMQGg3uaKl4", what: "a 2-minute guided tour of the whole website — Sprout walks you through Live Wire, THE 9:15, Markets, Learn, the calculators and Ask Sprout; press Play and it plays itself with music" },
  { name: "THE 9:15", url: "/pages/the-915.html", what: "the morning e-newspaper, every weekday" },
  { name: "Learn", url: "/pages/learn.html", what: "Beginner (6 modules, 23 lessons) and Intermediate (6 modules, 36 lessons), free" },
  { name: "Tools", url: "/pages/tools.html", what: "all the calculators in one place — SIP, lumpsum, EMI, goal planner, cost of delay, direct vs regular" },
  { name: "Founder's story", url: "/pages/about.html", what: "Priyansh, a finance student, started WealthyTrees because market news needed a dictionary — his idea: learn the concept first, then read the headline" },
];

// STRICT: no tips, no predictions. These are never answered by the AI — they get a
// polite refusal that teaches instead. (The site's rule: no noise, no tips, no predictions.)
const TIP = /\b(which|best|top)\b.{0,30}\b(stock|share|mutual fund|mf|sip|fund|etf)\b.{0,20}\b(buy|invest|pick|choose)\b|\bshould i (buy|sell|invest)\b|\b(will|going to)\b.{0,25}\b(nifty|sensex|gold|market|stock|share|price)\b.{0,20}\b(go up|go down|rise|fall|increase|decrease|crash|rally)\b|\b(target price|price target|prediction|predict|forecast)\b|\b(buy|sell) (call|tip|recommendation)\b|\bmultibagger\b|\bguaranteed return/i;
const TIP_REFUSAL = "I don't give tips and I don't predict where prices will go — nobody can know that, and guessing would mislead you. What I can do is teach you the concept, so you can judge for yourself. Try asking what something <i>is</i> — for example, what a P/E ratio means, or how a SIP works — and I'll explain it in plain English.";

// ---- exact maths (so the numbers are never guessed) ----
function num(s) {
  if (s == null) return null;
  var m = String(s).replace(/,/g, "").match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}
function inr(n) {
  n = Math.round(n);
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2).replace(/\.00$/, "") + " crore";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2).replace(/\.00$/, "") + " lakh";
  return "₹" + n.toLocaleString("en-IN");
}
function calc(q) {
  var s = q.toLowerCase();
  var amt = null, yrs = null, rate = null;
  var m;
  // amount: ₹5,000 / 5000 / 5 lakh / 50 lakh / 1 crore
  m = s.match(/(?:₹|rs\.?\s*)?\s*(\d[\d,]*\.?\d*)\s*(lakh|crore)?/);
  if (m) { amt = parseFloat(m[1].replace(/,/g, "")); if (m[2] === "lakh") amt *= 100000; if (m[2] === "crore") amt *= 10000000; }
  m = s.match(/(\d[\d.]*)\s*(years?|yrs?|months?|mo)\b/);
  if (m) { yrs = parseFloat(m[1]); if (/month|mo/.test(m[2])) yrs = yrs / 12; }
  m = s.match(/(\d[\d.]*)\s*%/);
  if (m) rate = parseFloat(m[1]);
  if (amt == null || yrs == null) return null;
  if (rate == null) rate = 12;
  var n = Math.round(yrs * 12), r = rate / 100 / 12;
  if (/sip|monthly/.test(s)) {
    var fv = amt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    var inv = amt * n;
    return "SIP of " + inr(amt) + " a month for " + yrs + " years at " + rate + "% grows to about " + inr(fv) + " (you put in " + inr(inv) + ", the rest is growth).";
  }
  if (/emi|loan/.test(s)) {
    var emi = amt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    var tot = emi * n;
    return "EMI on a loan of " + inr(amt) + " for " + yrs + " years at " + rate + "% is about " + inr(emi) + " a month. You would pay about " + inr(tot) + " in total (" + inr(tot - amt) + " as interest).";
  }
  if (/lumpsum|lump/.test(s)) {
    var fvl = amt * Math.pow(1 + rate / 100, yrs);
    return "A lumpsum of " + inr(amt) + " for " + yrs + " years at " + rate + "% grows to about " + inr(fvl) + ".";
  }
  // No type word at all (no sip / monthly / emi / loan / lumpsum / lump) — the amount,
  // rate and years are there, but we cannot tell whether it is a one-time investment
  // or a monthly SIP. Ask the user to choose (two tappable options) instead of
  // guessing or pointing them to a calculator. This is a two-way conversation, not
  // a one-way deflection. Each option carries the full follow-up question, so tapping
  // it runs the calculation at once.
  var qLump = "lumpsum " + amt + " at " + rate + "% for " + yrs + " years";
  var qSip = "sip " + amt + " a month at " + rate + "% for " + yrs + " years";
  return {
    clarify: true,
    answer: "I can work that out for you — but first, one quick question: is this a <b>one-time</b> investment, or a <b>monthly</b> one?"
      + "<br><br>"
      + '<button type="button" class="sp-opt" data-q="' + qLump + '">One-time (lumpsum)</button> '
      + '<button type="button" class="sp-opt" data-q="' + qSip + '">Monthly SIP</button>'
  };
}

// ---- live data helpers ----
async function getQuotes() {
  try {
    var r = await fetch("https://wealthytrees.online/api/quotes", { cf: { cacheTtl: 60 } });
    if (!r.ok) return {};
    var j = await r.json();
    return j.quotes || {};
  } catch (e) { return {}; }
}
async function getTopHeads(env) {
  try {
    var h = await getHeadlines(null, env);
    return (h || []).slice(0, 12);
  } catch (e) { return []; }
}
function moveOf(quotes, k) {
  var v = quotes && quotes[k];
  if (!v || v.prev == null) return null;
  return { price: v.price, ch: ((v.price - v.prev) / v.prev) * 100 };
}
function fmtMove(m) {
  if (!m) return "";
  return m.price + " (" + (m.ch >= 0 ? "+" : "") + m.ch.toFixed(2) + "%)";
}

// ---- instant answers (evergreen questions, no AI call — they answer at once) ----
// Each ends with a clear "For more on this, visit the learning module →" line.
const MORE = '<br><br>For more on this, visit the learning module → ';
function quickAnswer(q, quotes) {
  var s = q.toLowerCase().trim();
  // Only plain "what is X" questions — anything with why/how-much/will/fall/rise goes to the AI.
  if (/why|how much|how many|will|fall|rise|move|today|yesterday|crash|rally/.test(s)) return null;
  // ---- this website itself: answer at once, always correctly, with a real link ----
  if (/\bheatmap\b/.test(s)) {
    return "A heatmap shows values as colours — green means up, red means down, so you can see at a glance which markets are doing well. And yes, WealthyTrees has one: the Markets heatmap covers 18 Indian and world markets in one picture, and you can tap any box to learn more about it." + MORE + '<a href="/pages/heatmap.html">Markets heatmap</a>. You can also open it from the <a href="/pages/markets.html">Markets page</a>.';
  }
  if (/\bfounder\b|who (founded|started|created|made)\b.{0,20}(wealthytrees|wealthy trees|this (website|site)|it|this)\b/.test(s)) {
    return "WealthyTrees was started by Priyansh, a finance student. He got tired of market news that needs a dictionary, so he built this site on one idea: learn the concept first, then read the headline. It is a learning project, not a tip service." + MORE + '<a href="/pages/about.html">Founder\'s story</a>.';
  }
  if (/live ?wire/.test(s)) {
    return "Live Wire is the real-time news feed on the homepage — the latest market headlines as they come in, in plain English. It sits at the top of the Newsroom, next to THE 9:15." + MORE + '<a href="/#p-live">Live Wire on the homepage</a>.';
  }
  if (/who (is|are) (you|sprout)\b|what is sprout\b/.test(s)) {
    return "I am Sprout, your friendly finance teacher here at WealthyTrees. I explain money, markets and investing in simple, easy-to-understand words — and I can work out sums with you, right here in the chat." + MORE + '<a href="/learn/beginner/module-1.html">Beginner 1: Market basics</a>.';
  }
  if (/\btour\b/.test(s)) {
    return "New here? Take the 2-minute tour — Sprout walks you through the whole website: Live Wire, THE 9:15, Markets, Learn, the calculators and me. Press Play and it plays itself, with music." + MORE + '<a href="https://muse.ai/s/wealthytrees-website-tour-xgi6cxwxixwkxwoxi/GZDl1iozoz4Or9lcZI1Adihh5KW7chf6MMQGg3uaKl4">Take the tour \u2192</a>.';
  }
  if (/\b(guide|navigate|show (me|us) around|tour|how (do i|to) use (this|the) (website|site)|where (is|do i find))\b/.test(s)) {
    return "Happy to show you around. Start on the <a href=\"/\">homepage</a>: Live Wire for the latest news and THE 9:15 for the morning paper. The <a href=\"/pages/markets.html\">Markets page</a> has live prices, charts, the stock screener and the <a href=\"/pages/heatmap.html\">heatmap</a>. The <a href=\"/pages/learn.html\">Learn page</a> has the free Beginner and Intermediate courses, and the <a href=\"/pages/tools.html\">Tools page</a> has all the calculators.";
  }
  if (/wealthy?trees|about (this|the) (website|site)|what (is|do you know about) (this|the) (website|site)/.test(s)) {
    return "WealthyTrees is a learning site for Indian students and beginners. It teaches finance in plain English — free Learn courses from market basics to taxes, live market prices and charts, a daily morning paper called THE 9:15, and calculators for SIPs, lumpsums, EMIs and goals. No noise, no tips — education only." + MORE + '<a href="/pages/learn.html">Learn page</a>. Or see <a href="/pages/the-915.html">THE 9:15</a> and the <a href="/pages/markets.html">Markets page</a>.';
  }
  if (/\bnifty\b/.test(s)) {
    var n = moveOf(quotes, "NIFTY 50");
    var line = n ? " Today, Nifty 50 is at " + fmtMove(n) + "." : "";
    return "Nifty 50 is an index — a basket of the 50 biggest companies on the NSE, tracked together to show how the market is doing. When people say \"the market is up\", they often mean Nifty is up." + line + MORE + '<a href="/learn/beginner/module-1.html">Beginner 1: Market basics</a>.';
  }
  if (/\bsensex\b/.test(s)) {
    var sx = moveOf(quotes, "SENSEX");
    var lx = sx ? " Today, Sensex is at " + fmtMove(sx) + "." : "";
    return "Sensex is the BSE's index — a basket of 30 big companies listed on the Bombay Stock Exchange. It is the older of India's two main indices." + lx + MORE + '<a href="/learn/beginner/module-1.html">Beginner 1: Market basics</a>.';
  }
  if (/\bsip\b/.test(s)) {
    return "A SIP is a fixed amount you invest every month into a mutual fund, on a fixed date — instead of one big lump sum. It builds the habit of investing regularly, and you buy more units when prices are low." + MORE + '<a href="/learn/intermediate/module-4.html">Intermediate 4: Mutual funds, SIPs, ETFs</a>. You can also try it with numbers on the <a href="/pages/sip-calculator.html">SIP calculator</a>.';
  }
  if (/\bemi\b/.test(s)) {
    return "EMI is the fixed amount you pay every month to repay a loan — part of it is interest, part of it pays back the amount you borrowed. A longer loan means a smaller EMI but more total interest." + MORE + '<a href="/learn/beginner/module-5.html">Beginner 5: RBI to your portfolio</a>. Work out your own number on the <a href="/pages/emi-calculator.html">EMI calculator</a>.';
  }
  if (/\bshare\b/.test(s) && !/market share/.test(s)) {
    return "A share is a small slice of a company. When you buy one, you own a tiny part of that business — its profits and its risks. Companies split themselves into shares so many people can own a piece." + MORE + '<a href="/learn/beginner/module-1.html">Beginner 1: Market basics</a>.';
  }
  if (/\bmutual fund\b|\bmf\b/.test(s)) {
    return "A mutual fund pools money from many people and invests it in shares, bonds or both, managed by a professional. You buy units of the fund instead of picking shares yourself." + MORE + '<a href="/learn/intermediate/module-4.html">Intermediate 4: Mutual funds, SIPs, ETFs</a>.';
  }
  if (/\bp\/e\b|price.to.earnings|price earning/.test(s)) {
    return "The P/E ratio tells you how much investors are paying for each rupee of a company's yearly profit. A P/E of 20 means paying ₹20 for ₹1 of profit. It is a way to judge whether a share looks expensive or cheap — never a reason to buy on its own." + MORE + '<a href="/learn/beginner/module-3.html">Beginner 3: Key ratios</a>.';
  }
  if (/\bgold\b/.test(s) && !/price|rate|today/.test(s)) {
    return "Gold is a precious metal people buy as a store of value — in jewellery, coins, bars, and also as gold funds. Its price moves with global demand, the dollar, and how safe investors feel." + MORE + '<a href="/learn/beginner/module-5.html">Beginner 5: RBI to your portfolio</a>.';
  }
  return null;
}

// ---- today's suggested questions (change with the market, day to day) ----
function suggestQuestions(quotes, heads) {
  var out = [];
  function push(q) { if (out.indexOf(q) === -1 && out.length < 5) out.push(q); }
  // The day's biggest mover becomes a "why did it move?" question.
  var movers = [
    ["NIFTY 50", "Nifty"], ["SENSEX", "Sensex"], ["GOLD $/oz", "gold"],
    ["CRUDE WTI", "crude oil"], ["BANK NIFTY", "Bank Nifty"], ["USD/INR", "the rupee"],
  ];
  var best = null, bestAbs = 0.5;
  movers.forEach(function (pair) {
    var m = moveOf(quotes, pair[0]);
    if (m && Math.abs(m.ch) > bestAbs) { bestAbs = Math.abs(m.ch); best = { name: pair[1], ch: m.ch }; }
  });
  if (best) {
    push("Why did " + best.name + (best.ch > 0 ? " rise" : " fall") + " today?");
  } else {
    push("What happened in the market today?");
  }
  push("What is Nifty?");
  push("What is a SIP?");
  // A second market question from the day's top headline, if it names a market.
  var h0 = heads && heads[0] && heads[0].title ? heads[0].title : "";
  if (/gold/i.test(h0)) push("Why is gold moving?");
  else if (/crude|oil/i.test(h0)) push("Why is crude oil moving?");
  else if (/rupee|dollar/i.test(h0)) push("Why is the rupee moving?");
  else if (/rbi|rate/i.test(h0)) push("What did the RBI do?");
  push("How does the SIP calculator work?");
  push("What is EMI?");
  return out.slice(0, 5);
}

// ---- live context: prices + headlines (for the AI) ----
async function context(env) {
  var quotes = await getQuotes();
  var heads = await getTopHeads(env);
  var parts = [];
  var keep = ["NIFTY 50", "SENSEX", "BANK NIFTY", "GOLD $/oz", "CRUDE WTI", "USD/INR"];
  var lines = keep.map(function (k) {
    var m = moveOf(quotes, k);
    return m ? k + " " + fmtMove(m) : null;
  }).filter(Boolean);
  if (lines.length) parts.push("Live prices: " + lines.join(" · ") + ".");
  var best = null, bestAbs = 0;
  keep.forEach(function (k) {
    var m = moveOf(quotes, k);
    if (m && Math.abs(m.ch) > bestAbs) { bestAbs = Math.abs(m.ch); best = k + " " + fmtMove(m); }
  });
  if (best) parts.push("Biggest mover today: " + best + ".");
  var top = heads.map(function (h) { return h.title + " (" + h.source + ")"; });
  if (top.length) parts.push("Today's headlines: " + top.join(" | "));
  parts.push("Calculators: " + CALCS.map(function (c) { return c.name + " (" + c.url + ") — " + c.what; }).join("; "));
  parts.push("Learn: " + LEARN.map(function (l) { return l.name + " (" + l.url + ")"; }).join("; "));
  parts.push("About this website: " + SITE.map(function (f) { return f.name + " (" + f.url + ") — " + f.what; }).join("; "));
  return { text: parts.join("\n"), quotes: quotes, heads: heads };
}

async function viaGemini(env, prompt) {
  const model = modelOf(env);
  const call = async () => {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 16000);
    try {
      return await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent", {
        method: "POST", signal: ctl.signal,
        headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYS }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4 },
        }),
      });
    } finally { clearTimeout(timer); }
  };
  let r = await call();
  if (r.status === 429 || r.status === 503) { await sleep(2500); r = await call(); }
  if (!r.ok) throw new Error("gemini " + r.status);
  const j = await r.json();
  return ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [])
    .map((p) => p.text || "").join("").trim();
}

async function viaCloudflare(env, prompt, ms) {
  const run = env.AI.run(cfModelOf(env), {
    messages: [{ role: "system", content: SYS }, { role: "user", content: prompt }],
    max_tokens: 900, temperature: 0.4,
  });
  const out = await Promise.race([run, sleep(ms).then(() => { throw new Error("workers-ai timed out"); })]);
  const r = out && out.response !== undefined ? out.response : out && out.result && out.result.response !== undefined ? out.result.response : out;
  return (typeof r === "string" ? r : JSON.stringify(r)).trim();
}

const json = (obj, status) => new Response(JSON.stringify(obj), {
  status: status || 200,
  headers: { "content-type": "application/json", "cache-control": "no-store" },
});

// The chat already says hi — strip a leading greeting so answers start with the content.
function stripGreeting(t) {
  var s = t || "";
  for (var i = 0; i < 2; i++) {
    var n = s.replace(/^(hello|hi|hey|namaste|good\s+(morning|afternoon|evening))[!,.]?\s+/i, "");
    if (n === s) break;
    s = n;
  }
  return s.trim() ? s : t;
}

export async function onRequestPost(ctx) {
  const env = ctx.env || {};
  let body = {};
  try { body = await ctx.request.json(); } catch (e) {}
  const q = clip(body.q || "", 500);
  if (!q) return json({ error: "Ask me something about money, markets or the calculators." }, 400);
  if (q.length < 2) return json({ error: "Could you ask that in a few more words?" }, 400);

  // STRICT: tips and predictions are refused before the AI is even called.
  if (TIP.test(q)) return json({ answer: TIP_REFUSAL });

  // Simple rate limit: 30 questions an hour per IP, so one person cannot run up the AI bill.
  // Instant answers and calculations do not count — they cost nothing.
  var instant = null;
  try {
    var quotes0 = await getQuotes();
    // A calculation first (exact number), then a definition — so "SIP of 5000 for
    // 10 years" gets the sum, not the "what is a SIP" definition.
    var calcResult0 = calc(q);
    if (calcResult0) {
      // A clarifying question (amount + rate + years, but no SIP/lumpsum word):
      // ask the user to choose — do not guess, and do not point to a calculator.
      // The options are tappable, so one tap runs the calculation.
      if (calcResult0.clarify) return json({ answer: calcResult0.answer, instant: true });
      // A pure sum: answer at once with the exact number + a Learn-more line.
      // The calculator link is a small line at the end for going deeper — never a
      // replacement for the answer itself.
      var learn = /sip|monthly/.test(q.toLowerCase())
        ? ' <br><br>For more on this, visit the learning module → <a href="/learn/intermediate/module-4.html">Intermediate 4: Mutual funds, SIPs, ETFs</a>. Or try your own numbers on the <a href="/pages/sip-calculator.html">SIP calculator</a> — and see all our calculators on the <a href="/pages/tools.html">Tools</a> page.'
        : /emi|loan/.test(q.toLowerCase())
          ? ' <br><br>For more on this, visit the learning module → <a href="/learn/beginner/module-5.html">Beginner 5: RBI to your portfolio</a>. Or try your own numbers on the <a href="/pages/emi-calculator.html">EMI calculator</a> — and see all our calculators on the <a href="/pages/tools.html">Tools</a> page.'
          : ' <br><br>For more on this, visit the learning module → <a href="/learn/intermediate/module-4.html">Intermediate 4: Mutual funds, SIPs, ETFs</a>. Or try your own numbers on the <a href="/pages/lumpsum-calculator.html">Lumpsum calculator</a> — and see all our calculators on the <a href="/pages/tools.html">Tools</a> page.';
      return json({ answer: calcResult0 + learn, instant: true });
    }
    instant = quickAnswer(q, quotes0);
    if (instant) return json({ answer: instant, instant: true });
  } catch (e) {}
  try {
    var kv = env.PULSE;
    if (kv) {
      var ip = ctx.request.headers.get("cf-connecting-ip") || "unknown";
      var key = "ask:" + ip + ":" + new Date().getUTCHours();
      var n = parseInt((await kv.get(key)) || "0", 10) || 0;
      if (n >= 30) return json({ error: "That's a lot of questions for one hour! Please take a short break and ask again soon." }, 429);
      await kv.put(key, String(n + 1), { expirationTtl: 3600 });
    }
  } catch (e) {}

  var ctxData = await context(env);
  var prompt = "Context (facts only, use these and nothing else for numbers):\n" + ctxData.text
    + "\n\nQuestion: " + q;
  var text = "";
  try {
    if (env.GEMINI_API_KEY) text = await viaGemini(env, prompt);
    else if (env.AI && env.AI.run) text = await viaCloudflare(env, prompt, 12000);
    else throw new Error("no AI available");
  } catch (e) {
    try {
      if (env.AI && env.AI.run) text = await viaCloudflare(env, prompt, 12000);
      else throw e;
    } catch (e2) { text = ""; }
  }
  if (!text) {
    return json({ answer: "Sprout is taking a short break right now. Try one of the quick questions, or come back in a minute — the Learn pages and calculators are always there.", links: LEARN.slice(0, 3) });
  }
  return json({ answer: stripGreeting(text) });
}

export async function onRequestGet(ctx) {
  const env = ctx.env || {};
  var url = new URL(ctx.request.url);
  if (url.searchParams.get("suggest") === "1") {
    // Today's suggested questions — change with the market, day to day.
    var quotes = await getQuotes();
    var heads = await getTopHeads(env);
    return json({ questions: suggestQuestions(quotes, heads) });
  }
  return json({ ok: true, hint: "POST {q} to ask Sprout a finance question. GET ?suggest=1 for today's suggested questions." });
}
