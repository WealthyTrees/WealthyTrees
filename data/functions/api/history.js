// /api/history?n=Nifty IT : two years of daily candles for any index the market bar shows.
// Same row format as data/charts.json. Cached for an hour at Cloudflare's edge.
const SYMS = {
  "Nifty 50": "^NSEI", "Sensex": "^BSESN", "Bank Nifty": "^NSEBANK",
  "Nifty IT": "^CNXIT", "Nifty Auto": "^CNXAUTO", "Nifty FMCG": "^CNXFMCG", "Nifty Pharma": "^CNXPHARMA", "Nifty Metal": "^CNXMETAL", "India VIX": "^INDIAVIX",
  "S&P 500": "^GSPC", "Nasdaq": "^IXIC", "Dow": "^DJI", "Russell 2000": "^RUT", "VIX": "^VIX",
  "Nifty Financial Services": "^CNXFIN", "Nifty Realty": "^CNXREALTY", "Nifty PSU Bank": "^CNXPSUBANK", "Nifty Energy": "^CNXENERGY", "Nifty Media": "^CNXMEDIA", "Nifty Infra": "^CNXINFRA", "Nifty Midcap": "^CNXMIDCAP", "Nifty Smallcap": "^CNXSC", "Gold": "GC=F", "Silver": "SI=F", "Crude WTI": "CL=F", "Brent": "BZ=F", "Natural Gas": "NG=F", "Copper": "HG=F", "USD/INR": "USDINR=X",
};
const J = (body, status = 200, age = 900) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": `public, max-age=${age}` } });

export async function onRequestGet({ request }) {
  const name = new URL(request.url).searchParams.get("n") || "";
  const sym = SYMS[name], debug = new URL(request.url).searchParams.has("debug");
  if (!sym) return J({ error: "unknown index" }, 400, 60);
  try {
    const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=2y&interval=1d`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WealthyTrees/1.0)" },
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (!r.ok) return J({ error: "source unavailable", status: r.status, sym }, 502, 60);
    const res = (await r.json()).chart.result[0], q = res.indicators.quote[0], off = (res.meta && res.meta.gmtoffset) || 0, seen = {}, rows = [];
    res.timestamp.forEach((t, i) => {
      const o = q.open[i], h = q.high[i], l = q.low[i], c = q.close[i];
      if ([o, h, l, c].some((v) => v == null)) return;
      const d = new Date((t + off) * 1000).toISOString().slice(0, 10);
      if (seen[d]) return; seen[d] = 1;
      rows.push({ time: d, open: +o.toFixed(2), high: +h.toFixed(2), low: +l.toFixed(2), close: +c.toFixed(2), volume: Math.round((q.volume && q.volume[i]) || 0) });
    });
    if (rows.length < 30) return J({ error: "not enough data", rows: rows.length, sym }, 502, 60);
    return J(rows);
  } catch (e) {
    return J({ error: "failed", sym, detail: debug ? String(e) : undefined }, 502, 60);
  }
}
