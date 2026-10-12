// Cloudflare Pages Function: /api/quotes
// Fetches latest index/commodity prices and caches them for about a minute, so many visitors share one upstream call.
// To switch to a licensed data provider later, change only the fetchQuote() function below.
const SYMS = {
  "NIFTY 50": "^NSEI", "SENSEX": "^BSESN", "BANK NIFTY": "^NSEBANK",
  "GOLD $/oz": "GC=F", "CRUDE WTI": "CL=F", "USD/INR": "USDINR=X",
  "S&P 500": "^GSPC", "NASDAQ": "^IXIC", "DOW": "^DJI",
};

async function fetchQuote(sym) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1d&interval=1d`;
  const r = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; WealthyTrees/1.0)" },
    cf: { cacheTtl: 60, cacheEverything: true },
  });
  if (!r.ok) return null;
  const m = (await r.json()).chart.result[0].meta;
  return { price: m.regularMarketPrice, prev: m.chartPreviousClose, high: m.regularMarketDayHigh,
           low: m.regularMarketDayLow, time: m.regularMarketTime, off: m.gmtoffset || 0 };
}

export async function onRequestGet() {
  const quotes = {};
  await Promise.all(Object.entries(SYMS).map(async ([name, sym]) => {
    try { const q = await fetchQuote(sym); if (q && q.price) quotes[name] = q; } catch (e) {}
  }));
  return new Response(JSON.stringify({ quotes, fetched: Date.now() }), {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=30, s-maxage=60" },
  });
}
