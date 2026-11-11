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
const SYS = `You are Sprout, the friendly finance teacher at WealthyTrees, a learning site for Indian students and beginners. Answer the user's question in plain, simple English — short sentences, no jargon, and define any finance word you use. Use ONLY the facts in the context given (live prices, today's headlines, the calculator list, the Learn modules). Never invent a number, a cause, a name or an event that is not in the context. If the context does not have the answer, say so plainly and point to the closest page below instead of guessing.
STRICT — NEVER BREAK THESE:
1. NEVER give a tip, a stock/fund pick, or a buy/sell recommendation of any kind.
2. NEVER predict where a price, an index or the market will go. Never say what will happen. If asked, explain that no one can know and offer to teach the concept instead.
3. Educational only. No investment advice. No hype, no fear-mongering. No guaranteed returns.
4. Keep it short: 2–4 short sentences, answered right here in the chat. Then add a clear "For more on this, visit the learning module →" line with the matching Learn module or calculator link when one fits — the link is only for going deeper, never a replacement for the answer.
5. Money amounts in ₹. Percentages as %.
6. If the user asks for a calculation, use the "Calculated result" in the context exactly — do not recompute it.
7. Reply in the same language as the question (Hindi questions get a simple Hindi-English mix is fine, but keep it simple).
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
  return null;
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
    return (h || []).slice(0, 8);
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
  var top = heads.map(function (h) { return h.title + " (" + h.source + ")"; });
  if (top.length) parts.push("Today's headlines: " + top.join(" | "));
  parts.push("Calculators: " + CALCS.map(function (c) { return c.name + " (" + c.url + ") — " + c.what; }).join("; "));
  parts.push("Learn: " + LEARN.map(function (l) { return l.name + " (" + l.url + ")"; }).join("; "));
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
      // A pure sum: answer at once with the exact number + a Learn-more line.
      var learn = /sip|monthly/.test(q.toLowerCase())
        ? ' <br><br>For more on this, visit the learning module → <a href="/learn/intermediate/module-4.html">Intermediate 4: Mutual funds, SIPs, ETFs</a>. Or try your own numbers on the <a href="/pages/sip-calculator.html">SIP calculator</a>.'
        : /emi|loan/.test(q.toLowerCase())
          ? ' <br><br>For more on this, visit the learning module → <a href="/learn/beginner/module-5.html">Beginner 5: RBI to your portfolio</a>. Or try your own numbers on the <a href="/pages/emi-calculator.html">EMI calculator</a>.'
          : ' <br><br>For more on this, visit the learning module → <a href="/learn/intermediate/module-4.html">Intermediate 4: Mutual funds, SIPs, ETFs</a>.';
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
  return json({ answer: text });
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
