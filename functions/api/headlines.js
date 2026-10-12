// Cloudflare Pages Function: /api/headlines
// Collects recent market headlines (title, publisher, link, time) and caches them for 5 minutes.
// Headlines link out to the original publishers. No AI is used here.
// getHeadlines() is also used by /api/pulse.
const GN = "https://news.google.com/rss/search?hl=en-IN&gl=IN&ceid=IN:en&q=";
const FEEDS = [
  ["India", "Sensex+Nifty"], ["India", "Indian+stock+market"],
  ["Commodities", "gold+silver+price+India"], ["Commodities", "crude+oil+MCX"],
  ["Economy", "RBI+rupee+inflation+India"],
  ["US", "Wall+Street+S%26P+500+Nasdaq"], ["US", "Federal+Reserve+US+economy+markets"],
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

function parse(xml, cat) {
  const out = [], re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml))) {
    const b = m[1];
    const g = (t) => { const x = b.match(new RegExp("<" + t + "[^>]*>([\\s\\S]*?)</" + t + ">")); return x ? dec(x[1]) : ""; };
    const title = g("title").replace(/\s+-\s+[^-]+$/, ""), url = g("link"), t = Date.parse(g("pubDate"));
    if (title && url && t) out.push({ id: hid(title), title, url, t, source: g("source") || "Google News", cat });
  }
  return out.slice(0, 12);
}

// Keep the feed true to "no tips, no predictions": drop trading calls, price-target chatter,
// foreign-script items, and cap repetitive city rate-card items.
const TIPS = [
  /\b(buy|sell)\b.{0,40}\b(SL|stop[- ]?loss|TGT|target)\b/i,
  /\b(SL|TGT)\s*\d/i,
  /\b(stocks? to (buy|sell|watch)|top picks?|stock picks?|buy or sell|should you (buy|sell)|multibagger|target price)\b/i,
  /\bpredictions?\b/i,
  /\bkedia advisory\b/i,
  /\b(resistance|support)\s+(near|at|around|zone)\b/i,
];
const RATECARD = /\b(gold|silver)\b.*\b(rates?|prices?)\b.*\btoday\b|\b(rates?|prices?) today\b/i;
function noisy(x) {
  if (/[^\u0000-\u024F\u2000-\u20FF]/.test(x.title)) return true;
  return TIPS.some((re) => re.test(x.title));
}

export async function getHeadlines() {
  const all = [];
  await Promise.all(FEEDS.map(async ([cat, q]) => {
    try {
      const r = await fetch(GN + q + "+when:1d", { cf: { cacheTtl: 300, cacheEverything: true } });
      if (r.ok) all.push(...parse(await r.text(), cat));
    } catch (e) {}
  }));
  const seen = new Set(), cutoff = Date.now() - 36 * 3600 * 1000;
  let rate = 0;
  return all.filter((x) => x.t > cutoff && !noisy(x)).sort((a, b) => b.t - a.t).filter((x) => {
    const k = x.title.toLowerCase().slice(0, 70);
    if (seen.has(k)) return false;
    seen.add(k);
    if (RATECARD.test(x.title) && ++rate > 3) return false;
    return true;
  }).slice(0, 40);
}

export async function onRequestGet() {
  const items = await getHeadlines();
  return new Response(JSON.stringify({ items, fetched: Date.now() }), {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=120, s-maxage=300" },
  });
}
