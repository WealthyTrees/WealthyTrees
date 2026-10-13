// Cloudflare Pages Function: /api/headlines
// Collects recent market and economy headlines ONLY from established outlets (see TRUSTED),
// removes tips, predictions, price-update cards and live blogs, and caches for 5 minutes.
// getHeadlines() is also used by /api/pulse. No AI is used here.
//
// v17: more reliable. It now reads the publishers' own news feeds AND Google News, gives every
// feed a 7-second limit so one slow feed cannot hang the page, and has a check page:
//   /api/headlines?debug=1  shows which feeds worked, how many headlines each gave, and why any were dropped.
const GN = "https://news.google.com/rss/search?hl=en-IN&gl=IN&ceid=IN:en&q=";
const gn = (cat, q) => ({ cat, url: GN + q + "+when:1d", name: "Google News: " + q.replace(/\+/g, " ") });

const FEEDS = [
  // Google News searches (links go through Google, source name comes from the feed)
  gn("Markets", "Sensex+Nifty"), gn("Markets", "Indian+stock+market+FII"),
  gn("Economy", "RBI+monetary+policy+repo+rate"), gn("Economy", "India+inflation+GDP+economy"),
  gn("Commodities", "crude+oil+OPEC+supply"),
  gn("Global", "Federal+Reserve+interest+rates"), gn("Global", "US+tariffs+trade+India"),
  // Publishers' own feeds (direct links). If one of these ever stops working, the others still carry the page.
  { cat: "Markets", url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", name: "ET Markets" },
  { cat: "Economy", url: "https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms", name: "ET Economy" },
  { cat: "Markets", url: "https://www.livemint.com/rss/markets", name: "Mint Markets" },
  { cat: "Economy", url: "https://www.livemint.com/rss/economy", name: "Mint Economy" },
  { cat: "Markets", url: "https://www.business-standard.com/rss/markets-106.rss", name: "Business Standard Markets" },
  { cat: "Economy", url: "https://www.business-standard.com/rss/economy-policy-102.rss", name: "Business Standard Economy" },
  { cat: "Markets", url: "https://www.thehindubusinessline.com/markets/feeder/default.rss", name: "BusinessLine Markets" },
  { cat: "Economy", url: "https://www.thehindubusinessline.com/economy/feeder/default.rss", name: "BusinessLine Economy" },
  { cat: "Markets", url: "https://www.financialexpress.com/market/feed/", name: "Financial Express Market" },
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

// Name shown for headlines that come straight from a publisher's own feed.
const NAMES = {
  "economictimes.indiatimes.com": "Economic Times", "livemint.com": "Livemint", "business-standard.com": "Business Standard",
  "thehindubusinessline.com": "BusinessLine", "financialexpress.com": "Financial Express", "thehindu.com": "The Hindu",
  "moneycontrol.com": "Moneycontrol", "ndtvprofit.com": "NDTV Profit",
};

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
  const out = [], re = /<item[\s>]([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml))) {
    const b = m[1];
    const g = (t) => { const x = b.match(new RegExp("<" + t + "[^>]*>([\\s\\S]*?)</" + t + ">")); return x ? dec(x[1]) : ""; };
    const sm = b.match(/<source[^>]*?url="([^"]*)"[^>]*>([\s\S]*?)<\/source>/);
    let title = g("title");
    const url = g("link"), t = Date.parse(g("pubDate") || g("dc:date") || g("published"));
    let source, host;
    if (sm) { source = dec(sm[2]); host = hostOf(dec(sm[1])); }          // Google News item
    else { host = hostOf(url); source = NAMES[host] || host || "News"; }   // publisher's own feed
    if (sm && source && title.endsWith(" - " + source)) title = title.slice(0, -(source.length + 3));
    if (title && url && t) out.push({ id: hid(title), title, url, t, source, host, cat });
  }
  return out.slice(0, 15);
}

async function pullFeed(f) {
  const t0 = Date.now(), ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 7000);
  const rep = { feed: f.name, status: 0, items: 0, ms: 0, error: "" };
  let items = [];
  try {
    const r = await fetch(f.url, {
      signal: ctl.signal,
      headers: { "user-agent": "Mozilla/5.0 (compatible; WealthyTreesBot/1.0; +https://wealthytrees.online)", accept: "application/rss+xml, application/xml, text/xml, */*" },
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    rep.status = r.status;
    if (r.ok) { items = parse(await r.text(), f.cat); rep.items = items.length; }
  } catch (e) { rep.error = e && e.name === "AbortError" ? "timed out (7s)" : String((e && e.message) || e).slice(0, 80); }
  finally { clearTimeout(timer); }
  rep.ms = Date.now() - t0;
  return { items, rep };
}

export async function getHeadlines(report) {
  const pulled = await Promise.all(FEEDS.map(pullFeed));
  const all = [];
  pulled.forEach((p) => all.push(...p.items));
  const seen = new Set(), cutoff = Date.now() - 30 * 3600 * 1000;
  const drop = { tooOld: 0, notTrusted: 0, oddCharacters: 0, noise: 0, duplicate: 0 };
  const kept = [];
  for (const x of all.sort((a, b) => b.t - a.t)) {
    if (x.t <= cutoff) { drop.tooOld++; continue; }
    if (!trusted(x.host)) { drop.notTrusted++; continue; }
    if (/[^\u0000-\u024F\u2000-\u20FF]/.test(x.title)) { drop.oddCharacters++; continue; }
    if (NOISE.some((re) => re.test(x.title))) { drop.noise++; continue; }
    const k = x.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").slice(0, 60);
    if (seen.has(k)) { drop.duplicate++; continue; }
    seen.add(k); kept.push(x);
  }
  const list = kept.slice(0, 45).map((x) => Object.assign(x, { score: KEYS.reduce((n, [re, w]) => n + (re.test(x.title) ? w : 0), 0) }));
  if (report) { report.feeds = pulled.map((p) => p.rep); report.readFromFeeds = all.length; report.dropped = drop; report.kept = list.length; report.newest = list[0] ? list[0].title : null; }
  return list;
}

export async function onRequestGet(ctx) {
  const debug = ctx && ctx.request && new URL(ctx.request.url).searchParams.get("debug");
  if (debug) {
    const report = {};
    await getHeadlines(report);
    return new Response(JSON.stringify(report, null, 1), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  const items = (await getHeadlines()).slice(0, 25);
  return new Response(JSON.stringify({ items, fetched: Date.now() }), {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=120, s-maxage=300" },
  });
}
