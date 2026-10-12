// Cloudflare Pages Function: /api/headlines
// Collects recent market headlines (title, publisher, link, time) and caches them for 5 minutes.
// Headlines link out to the original publishers. No AI is used here.
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

function parse(xml, cat) {
  const out = [], re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml))) {
    const b = m[1];
    const g = (t) => { const x = b.match(new RegExp("<" + t + "[^>]*>([\\s\\S]*?)</" + t + ">")); return x ? dec(x[1]) : ""; };
    const title = g("title").replace(/\s+-\s+[^-]+$/, ""), url = g("link"), t = Date.parse(g("pubDate"));
    if (title && url && t) out.push({ title, url, t, source: g("source") || "Google News", cat });
  }
  return out.slice(0, 12);
}

export async function onRequestGet() {
  const all = [];
  await Promise.all(FEEDS.map(async ([cat, q]) => {
    try {
      const r = await fetch(GN + q + "+when:1d", { cf: { cacheTtl: 300, cacheEverything: true } });
      if (r.ok) all.push(...parse(await r.text(), cat));
    } catch (e) {}
  }));
  const seen = new Set(), cutoff = Date.now() - 36 * 3600 * 1000;
  const items = all.filter((x) => x.t > cutoff).sort((a, b) => b.t - a.t).filter((x) => {
    const k = x.title.toLowerCase().slice(0, 70);
    if (seen.has(k)) return false;
    seen.add(k); return true;
  }).slice(0, 40);
  return new Response(JSON.stringify({ items, fetched: Date.now() }), {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=120, s-maxage=300" },
  });
}
