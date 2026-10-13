// Cloudflare Pages Function: /api/headlines
// Collects recent market and economy headlines ONLY from established outlets (see TRUSTED),
// removes tips, predictions, price-update cards and live blogs, and caches for 5 minutes.
// getHeadlines() is also used by /api/pulse. No AI is used here.
const GN = "https://news.google.com/rss/search?hl=en-IN&gl=IN&ceid=IN:en&q=";
const FEEDS = [
  ["Markets", "Sensex+Nifty"], ["Markets", "Indian+stock+market+FII"],
  ["Economy", "RBI+monetary+policy+repo+rate"], ["Economy", "India+inflation+GDP+economy"],
  ["Economy", "India+budget+tax+policy"],
  ["Commodities", "crude+oil+OPEC+supply"], ["Commodities", "gold+demand+central+banks"],
  ["Global", "Federal+Reserve+interest+rates"], ["Global", "Wall+Street+stocks"],
  ["Global", "US+tariffs+trade+India"],
];

// Only these publishers are shown. Edit this list to add or remove an outlet.
// This keeps out unknown sites and re-posters; it does not guarantee that any story is accurate.
const TRUSTED = [
  "reuters.com", "bloomberg.com", "apnews.com", "bbc.com", "bbc.co.uk", "ft.com", "wsj.com", "cnbc.com", "marketwatch.com", "barrons.com",
  "economictimes.indiatimes.com", "timesofindia.indiatimes.com", "livemint.com", "business-standard.com", "moneycontrol.com",
  "cnbctv18.com", "ndtvprofit.com", "ndtv.com", "thehindubusinessline.com", "thehindu.com", "financialexpress.com",
  "indianexpress.com", "hindustantimes.com", "businesstoday.in", "indiatoday.in", "news18.com", "ddnews.gov.in",
  "pib.gov.in", "rbi.org.in", "sebi.gov.in", "nseindia.com", "bseindia.com",
];

// Not news we want: trading calls, predictions, daily price/rate cards, live blogs, stock-tip lists.
const NOISE = [
  /\b(buy|sell)\b.{0,40}\b(SL|stop[- ]?loss|TGT|target)\b/i,
  /\b(SL|TGT)\s*\d/i,
  /\b(stocks? to (buy|sell|watch)|stocks? in news|top picks?|stock picks?|buy or sell|should you (buy|sell)|multibagger|target price|top gainers|top losers)\b/i,
  /\bpredictions?\b/i, /\bkedia advisory\b/i, /\b(resistance|support)\s+(near|at|around|zone)\b/i,
  /\b(rates?|prices?)\s+today\b/i, /\b(gold|silver)\b.{0,30}\b(rates?|prices?)\b.{0,40}\b(today|live|delhi|mumbai|kolkata|chennai)\b/i,
  /\blive\b/i, /\bhoroscope\b/i,
];

// Used only when the AI is off: a rough "does this matter" score.
const KEYS = [
  [/\b(RBI|repo rate|monetary policy|MPC|inflation|CPI|GDP|fiscal|budget|GST|tariffs?|trade deal|Federal Reserve|Fed|rate (cut|hike)|OPEC|recession|FII|FPI|SEBI|bond yield|rupee)\b/i, 3],
  [/\b(Sensex|Nifty)\b.*\b(crash|plunge|tumble|surge|rally|slump|record|falls?|jumps?)\b/i, 2],
  [/\b(why|explained|factors|reasons)\b/i, 1],
];

function dec(s) {
  return s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&").trim();
}

// short stable id from the headline text (same headline = same id)
function hid(title) {
  const s = title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 70);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}

function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, "").toLowerCase(); } catch (e) { return ""; } }
const trusted = (host) => !!host && TRUSTED.some((d) => host === d || host.endsWith("." + d));

function parse(xml, cat) {
  const out = [], re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml))) {
    const b = m[1];
    const g = (t) => { const x = b.match(new RegExp("<" + t + "[^>]*>([\\s\\S]*?)</" + t + ">")); return x ? dec(x[1]) : ""; };
    const sm = b.match(/<source[^>]*?url="([^"]*)"[^>]*>([\s\S]*?)<\/source>/);
    const source = sm ? dec(sm[2]) : "Google News", host = sm ? hostOf(dec(sm[1])) : "";
    let title = g("title");
    if (source && title.endsWith(" - " + source)) title = title.slice(0, -(source.length + 3));
    const url = g("link"), t = Date.parse(g("pubDate"));
    if (title && url && t) out.push({ id: hid(title), title, url, t, source, host, cat });
  }
  return out.slice(0, 15);
}

export async function getHeadlines() {
  const all = [];
  await Promise.all(FEEDS.map(async ([cat, q]) => {
    try {
      const r = await fetch(GN + q + "+when:1d", { cf: { cacheTtl: 300, cacheEverything: true } });
      if (r.ok) all.push(...parse(await r.text(), cat));
    } catch (e) {}
  }));
  const seen = new Set(), cutoff = Date.now() - 30 * 3600 * 1000;
  return all
    .filter((x) => x.t > cutoff && trusted(x.host) && !/[^\u0000-\u024F\u2000-\u20FF]/.test(x.title) && !NOISE.some((re) => re.test(x.title)))
    .sort((a, b) => b.t - a.t)
    .filter((x) => { const k = x.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").slice(0, 60); if (seen.has(k)) return false; seen.add(k); return true; })
    .slice(0, 45)
    .map((x) => Object.assign(x, { score: KEYS.reduce((n, [re, w]) => n + (re.test(x.title) ? w : 0), 0) }));
}

export async function onRequestGet() {
  const items = (await getHeadlines()).slice(0, 25);
  return new Response(JSON.stringify({ items, fetched: Date.now() }), {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=120, s-maxage=300" },
  });
}
