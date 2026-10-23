"""Daily WealthyTrees brief: fetch headlines + market numbers, summarize with Claude, write JSON."""
import json, os, re, sys, time, gzip, http.cookiejar, urllib.parse, urllib.request, urllib.error, xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta

OUT = "data/brief.json"
MODEL = "claude-haiku-5-5"
UA = {"User-Agent": "Mozilla/5.0 (WealthyTrees daily brief bot)"}
FEEDS = {
    "Economic Times": "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
    "Mint": "https://www.livemint.com/rss/markets",
    "Business Standard": "https://www.business-standard.com/rss/markets-106.rss",
    "RBI": "https://www.rbi.org.in/pressreleases_rss.xml",
}
GN = "https://news.google.com/rss/search?hl=en-IN&gl=IN&ceid=IN:en&q="
GOOGLE_FEEDS = {  # Google News search feeds: headline + publisher, work from servers
    "gn1": GN + "Sensex+Nifty+when:1d",
    "gn2": GN + "Indian+stock+market+when:1d",
    "gn3": GN + "gold+silver+price+India+when:1d",
    "gn4": GN + "crude+oil+rupee+RBI+when:1d",
    "gn5": GN + "Wall+Street+S%26P+500+Nasdaq+when:1d",
    "gn6": GN + "Federal+Reserve+US+economy+markets+when:1d",
}
SYMBOLS = [("NIFTY 50", "^NSEI", "{:,.0f}"), ("SENSEX", "^BSESN", "{:,.0f}"),
           ("GOLD $/oz", "GC=F", "{:,.0f}"), ("CRUDE WTI", "CL=F", "${:,.1f}"),
           ("USD/INR", "USDINR=X", "{:.2f}"),
           ("S&P 500", "^GSPC", "{:,.0f}"), ("NASDAQ", "^IXIC", "{:,.0f}"), ("DOW", "^DJI", "{:,.0f}")]

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=25).read()

def headlines():
    items, seen = [], set()
    allfeeds = [(n, u, False) for n, u in FEEDS.items()] + [(n, u, True) for n, u in GOOGLE_FEEDS.items()]
    for name, url, google in allfeeds:
        count = 0
        try:
            root = ET.fromstring(get(url))
            for it in root.iter("item"):
                t = (it.findtext("title") or "").strip()
                l = (it.findtext("link") or "").strip()
                src = name
                if google:
                    src = (it.findtext("source") or "Google News").strip()
                    t = re.sub(r"\s+-\s+[^-]+$", "", t)
                    d = ""
                else:
                    d = re.sub(r"<[^>]+>", "", it.findtext("description") or "").strip()[:200]
                key = t.lower()[:60]
                if t and l and key not in seen:
                    seen.add(key)
                    items.append({"source": src, "title": t, "desc": d, "url": l})
                    count += 1
                if count >= 8:
                    break
            print(f"feed ok: {name}: {count} items")
        except Exception as e:
            print(f"feed failed: {name}: {e}", file=sys.stderr)
    return items

def old_ticker():
    try:
        return json.load(open(OUT, encoding="utf-8")).get("ticker", [])
    except Exception:
        return []

def ticker():
    out = []
    for name, sym, fmt in SYMBOLS:
        try:
            u = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym.replace('^','%5E')}?range=1d&interval=1d"
            m = json.loads(get(u))["chart"]["result"][0]["meta"]
            p, prev = m["regularMarketPrice"], m["chartPreviousClose"]
            out.append({"name": name, "value": fmt.format(p), "change": round((p - prev) / prev * 100, 2)})
        except Exception as e:
            print(f"quote failed: {name}: {e}", file=sys.stderr)
    return out

PROMPT = """You write the daily brief for WealthyTrees, an educational site on Indian markets for students and new investors.
From the numbered headlines below, pick the 8 to 10 most important for Indian equity, commodity, economy and US market news. Include at least 2 US items when available. Use different sources where possible.
For each, return JSON with: "n" (the headline number), "category" (Equity, Commodity, Economy or US Markets), "title" (your own short rewrite, max 12 words), "summary" (1-2 plain-English sentences in your own words), "why" (one sentence on why it matters or the concept behind it).
Rules: never copy wording from the headlines or descriptions; no buy/sell advice, no tips, no price targets, no predictions; neutral tone; only state facts present in the input.
Return ONLY a JSON array, no other text.

HEADLINES:
"""

CHARTS = {
    "Nifty 50": "^NSEI", "Sensex": "^BSESN", "Bank Nifty": "^NSEBANK",
    "Nifty IT": "^CNXIT", "Nifty Pharma": "^CNXPHARMA", "Nifty Auto": "^CNXAUTO", "Nifty Metal": "^CNXMETAL",
    "India VIX": "^INDIAVIX",
    "S&P 500": "^GSPC", "Nasdaq": "^IXIC", "Dow": "^DJI",
    "Gold": "GC=F", "Silver": "SI=F", "Crude WTI": "CL=F", "Brent": "BZ=F", "Natural Gas": "NG=F", "Copper": "HG=F",
    "USD/INR": "USDINR=X",
}
# Yahoo has no history for some Nifty sectors and NSE blocks GitHub servers, so fall back to a tracking ETF (first that works).
ETF_FALLBACK = {"Nifty Auto": ["AUTOBEES.NS", "AUTOIETF.NS"], "Nifty Metal": ["METALIETF.NS", "METALBEES.NS"]}
CHARTS_OUT = "data/charts.json"

NIFTY_IDX = {"Nifty Auto": "NIFTY AUTO", "Nifty Metal": "NIFTY METAL"}

def live_price(sym):
    u = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym.replace('^','%5E')}?range=1d&interval=1d"
    return float(json.loads(get(u))["chart"]["result"][0]["meta"]["regularMarketPrice"])

def scale_to_index(rows, sym):
    """ETF prices are on a different scale from the index, so rescale them to the index level (shape stays the same)."""
    last = rows[max(rows)]["close"]
    f = live_price(sym) / last
    for r in rows.values():
        for k in ("open", "high", "low", "close"):
            r[k] = round(r[k] * f, 2)
    return rows

def clean_rows(rows, name):
    """Drop impossible rows and clamp wicks that Yahoo sometimes reports far outside the real range."""
    thr = 0.015 if name == "USD/INR" else (0.12 if name in ("India VIX", "VIX", "Gold", "Silver", "Crude WTI", "Brent", "Natural Gas", "Copper") else 0.035)
    out, pc = [], None
    for r in rows:
        if min(r["open"], r["high"], r["low"], r["close"]) <= 0:
            continue
        lo_ref = min(r["open"], r["close"], pc if pc else r["close"])
        hi_ref = max(r["open"], r["close"], pc if pc else r["close"])
        if r["low"] < lo_ref * (1 - thr):
            r["low"] = round(lo_ref * 0.998, 2)
        if r["high"] > hi_ref * (1 + thr):
            r["high"] = round(hi_ref * 1.002, 2)
        out.append(r)
        pc = r["close"]
    return out

def yahoo_rows(sym):
    last = None
    for host, rg in (("query1", "2y"), ("query2", "2y"), ("query1", "1y")):
        try:
            u = f"https://{host}.finance.yahoo.com/v8/finance/chart/{sym.replace('^','%5E')}?range={rg}&interval=1d"
            r = json.loads(get(u))["chart"]["result"][0]
            q, off, rows = r["indicators"]["quote"][0], r["meta"].get("gmtoffset", 0), {}
            for t, o, h, l, c, vol in zip(r["timestamp"], q["open"], q["high"], q["low"], q["close"], q.get("volume") or [0] * len(r["timestamp"])):
                if None in (o, h, l, c):
                    continue
                d = datetime.fromtimestamp(t + off, timezone.utc).strftime("%Y-%m-%d")
                rows[d] = {"time": d, "open": round(o, 2), "high": round(h, 2), "low": round(l, 2), "close": round(c, 2), "volume": int(vol or 0)}
            try:  # Yahoo often leaves the latest finished session out of the daily list; fill it from meta once that session is over
                mt, cp = r["meta"], r["meta"].get("currentTradingPeriod", {}).get("regular", {})
                sd = datetime.fromtimestamp(mt["regularMarketTime"] + off, timezone.utc).strftime("%Y-%m-%d")
                if sd not in rows and rows and cp.get("end") and time.time() >= cp["end"] and mt["regularMarketTime"] >= cp.get("start", 0):
                    c = float(mt["regularMarketPrice"]); pc = rows[max(rows)]["close"]
                    if sd > max(rows) and 0 < c and abs(c / pc - 1) < 0.12:
                        hi, lo = float(mt.get("regularMarketDayHigh") or c), float(mt.get("regularMarketDayLow") or c)
                        rows[sd] = {"time": sd, "open": round(pc, 2), "high": round(max(hi, c, pc), 2), "low": round(min(lo, c, pc), 2), "close": round(c, 2), "volume": int(mt.get("regularMarketVolume") or 0)}
            except Exception:
                pass
            if len(rows) > 20:
                return rows
            last = f"only {len(rows)} rows"
        except Exception as e:
            last = e
    raise RuntimeError(last)

def niftyindices_rows(idx):
    """Fallback: NSE's own index history (niftyindices.com), two one-year requests."""
    rows, end = {}, datetime.now().date()
    for k in range(2):
        e = end - timedelta(days=365 * k)
        st = e - timedelta(days=364)
        cinfo = json.dumps({"name": idx, "startDate": st.strftime("%d-%b-%Y"), "endDate": e.strftime("%d-%b-%Y"), "indexName": idx})
        req = urllib.request.Request("https://www.niftyindices.com/Backpage.aspx/getHistoricaldatatabletoString",
            data=json.dumps({"cinfo": cinfo}).encode(),
            headers={"Content-Type": "application/json; charset=UTF-8", "User-Agent": "Mozilla/5.0", "Referer": "https://www.niftyindices.com/reports/historical-data", "X-Requested-With": "XMLHttpRequest"})
        res = json.loads(json.loads(urllib.request.urlopen(req, timeout=40).read())["d"])
        for x in res:
            try:
                d = datetime.strptime(x["HistoricalDate"].strip(), "%d %b %Y").strftime("%Y-%m-%d")
                o, h, l, c = [float(str(x[f]).replace(",", "")) for f in ("OPEN", "HIGH", "LOW", "CLOSE")]
                rows[d] = {"time": d, "open": o, "high": h, "low": l, "close": c, "volume": 0}
            except Exception:
                continue
    if len(rows) <= 20:
        raise RuntimeError(f"only {len(rows)} rows")
    return rows

def nse_open():
    """A browser-like session for nseindia.com (it needs the cookies from its own pages first)."""
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    op.addheaders = [("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"), ("Accept-Language", "en-US,en;q=0.9"), ("Accept-Encoding", "gzip")]
    for u in ("https://www.nseindia.com/", "https://www.nseindia.com/reports-indices-historical-index-data"):
        op.open(u, timeout=30).read()
    return op

def nse_json(op, url):
    req = urllib.request.Request(url, headers={"Accept": "application/json, text/plain, */*", "Referer": "https://www.nseindia.com/reports-indices-historical-index-data", "X-Requested-With": "XMLHttpRequest"})
    r = op.open(req, timeout=40)
    b = r.read()
    if r.headers.get("Content-Encoding") == "gzip":
        b = gzip.decompress(b)
    return json.loads(b)

def nse_rows(op, idx):
    """NSE's own index history API, two one-year requests."""
    rows, end = {}, datetime.now().date()
    for k in range(2):
        e = end - timedelta(days=365 * k)
        st = e - timedelta(days=364)
        j = nse_json(op, "https://www.nseindia.com/api/historical/indicesHistory?indexType=" + urllib.parse.quote(idx) + "&from=" + st.strftime("%d-%m-%Y") + "&to=" + e.strftime("%d-%m-%Y"))
        for x in j["data"]["indexCloseOnlineRecords"]:
            try:
                d = (x.get("TIMESTAMP") or "")[:10] or datetime.strptime(x["EOD_TIMESTAMP"], "%d-%b-%Y").strftime("%Y-%m-%d")
                o, h, l, c = [float(x[f]) for f in ("EOD_OPEN_INDEX_VAL", "EOD_HIGH_INDEX_VAL", "EOD_LOW_INDEX_VAL", "EOD_CLOSE_INDEX_VAL")]
                rows[d] = {"time": d, "open": o, "high": h, "low": l, "close": c, "volume": 0}
            except Exception:
                continue
    if len(rows) <= 20:
        raise RuntimeError(f"only {len(rows)} rows")
    return rows

def chart_data():
    """Two years of daily candles per index, saved for the site's own chart. Also writes data/chart_status.json (why each chart worked or failed)."""
    try:
        out = json.load(open(CHARTS_OUT, encoding="utf-8"))
    except Exception:
        out = {}
    status, op = {}, None
    for name, sym in CHARTS.items():
        rows, st = None, {}
        try:
            rows = yahoo_rows(sym); st["yahoo"] = "ok"
        except Exception as e:
            st["yahoo"] = str(e)[:120]
            print(f"chart failed (yahoo): {name}: {e}", file=sys.stderr)
        for etf in ([] if rows else ETF_FALLBACK.get(name, [])):
            try:
                rows = scale_to_index(yahoo_rows(etf), sym); st["etf"] = etf + " ok (scaled)"; break
            except Exception as e:
                st["etf"] = (etf + ": " + str(e))[:120]
        if rows:
            out[name] = clean_rows([rows[k] for k in sorted(rows)], name)
            print(f"chart ok: {name}: {len(rows)} days")
        elif name in out:
            try:  # drop old rows whose level is far from the live index (for example old unscaled ETF data)
                if name in ETF_FALLBACK and abs(out[name][-1]["close"] / live_price(sym) - 1) > 0.35:
                    del out[name]; st["dropped"] = "old data far from live level"
            except Exception:
                pass
            if name in out:
                out[name] = clean_rows(out[name], name)
        st["rows"] = len(out.get(name, []))
        status[name] = st
    if out:
        with open(CHARTS_OUT, "w", encoding="utf-8") as f:
            json.dump(out, f, separators=(",", ":"))
    with open("data/chart_status.json", "w", encoding="utf-8") as f:
        json.dump({"updated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "charts": status}, f, indent=1)

GEMINI_MODELS = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"]  # each model has its own free quota

def ask_gemini(prompt, model, gkey):
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        method="POST",
        data=json.dumps({"contents": [{"parts": [{"text": prompt}]}],
                         "generationConfig": {"responseMimeType": "application/json"}}).encode(),
        headers={"x-goog-api-key": gkey, "content-type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=180).read())["candidates"][0]["content"]["parts"][0]["text"]

def ask_llm(prompt):
    gkey = os.environ.get("GEMINI_API_KEY", "").strip()
    last = None
    if gkey:
        for model in GEMINI_MODELS:  # quota hit (429) or model missing (404): try the next model at once
            try:
                return ask_gemini(prompt, model, gkey)
            except urllib.error.HTTPError as e:
                last = e
                print(f"Gemini {model} failed: HTTP {e.code}", file=sys.stderr)
                if e.code not in (404, 429, 500, 502, 503, 504):
                    raise
        if not os.environ.get("ANTHROPIC_API_KEY", "").strip():
            raise last
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", method="POST",
        data=json.dumps({"model": MODEL, "max_tokens": 2500,
                         "messages": [{"role": "user", "content": prompt}]}).encode(),
        headers={"x-api-key": os.environ.get("ANTHROPIC_API_KEY", ""), "anthropic-version": "2023-06-01",
                 "content-type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=180).read())["content"][0]["text"]

def summarize(items):
    body = "\n".join(f"{i}. [{x['source']}] {x['title']} | {x['desc']}" for i, x in enumerate(items))
    text = None
    for attempt in range(2):  # retry on timeouts and busy-service errors
        try:
            text = ask_llm(PROMPT + body)
            break
        except Exception as e:
            code = getattr(e, "code", None)
            retryable = code in (500, 502, 503, 504) or (code is None and isinstance(e, OSError))
            if retryable and attempt < 1:
                wait = 20
                print(f"AI call failed ({code or type(e).__name__}); retrying in {wait}s...", file=sys.stderr)
                time.sleep(wait)
            else:
                raise
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    return json.loads(text)

def keep_old(msg):
    print(msg + " Keeping the previous brief.", file=sys.stderr)  # job still passes; charts and ticker were already saved

def main():
    chart_data()
    try:
        d = json.load(open(OUT, encoding="utf-8"))
    except Exception:
        d = {"items": []}
    d["ticker"] = ticker() or d.get("ticker", [])
    def save():
        with open(OUT, "w", encoding="utf-8") as f:
            json.dump(d, f, ensure_ascii=False, indent=1)
    save()
    items = headlines()
    if len(items) < 5:
        return keep_old("Too few headlines.")
    print(f"Fetched {len(items)} headlines; asking AI to summarize...")
    try:
        picked = summarize(items)
    except Exception as e:
        return keep_old(f"AI summary failed ({type(e).__name__}: {str(e)[:200]}).")
    out = []
    for p in picked:
        try:
            n = int(p["n"])
            if 0 <= n < len(items) and p.get("category") in ("Equity", "Commodity", "Economy", "US Markets"):
                out.append({"category": p["category"], "title": p["title"], "summary": p["summary"],
                            "why": p["why"], "source": items[n]["source"], "url": items[n]["url"]})
        except Exception:
            continue
    if len(out) < 3:
        return keep_old("Too few valid items.")
    ist = datetime.now(timezone(timedelta(hours=5, minutes=30)))
    d["date"] = ist.strftime("%A, %d %B %Y"); d["items"] = out
    save()
    print(f"Wrote {len(out)} items, {len(d['ticker'])} ticker entries.")

if __name__ == "__main__":
    main()
