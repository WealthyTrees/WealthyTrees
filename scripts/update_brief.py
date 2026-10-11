"""Daily WealthyTrees brief: fetch headlines + market numbers, summarize with Claude, write JSON."""
import json, os, re, sys, urllib.request, urllib.error, xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta

OUT = "wealthytrees/data/brief.json"
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
}
SYMBOLS = [("NIFTY 50", "^NSEI", "{:,.0f}"), ("SENSEX", "^BSESN", "{:,.0f}"),
           ("GOLD $/oz", "GC=F", "{:,.0f}"), ("CRUDE WTI", "CL=F", "${:,.1f}"),
           ("USD/INR", "USDINR=X", "{:.2f}")]

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
                    d = re.sub(r"<[^>]+>", "", it.findtext("description") or "").strip()[:300]
                key = t.lower()[:60]
                if t and l and key not in seen:
                    seen.add(key)
                    items.append({"source": src, "title": t, "desc": d, "url": l})
                    count += 1
                if count >= 10:
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
            u = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym.replace('^','%5E')}?range=5d&interval=1d"
            m = json.loads(get(u))["chart"]["result"][0]["meta"]
            p, prev = m["regularMarketPrice"], m["chartPreviousClose"]
            out.append({"name": name, "value": fmt.format(p), "change": round((p - prev) / prev * 100, 2)})
        except Exception as e:
            print(f"quote failed: {name}: {e}", file=sys.stderr)
    return out

PROMPT = """You write the daily brief for WealthyTrees, an educational site on Indian markets for students and new investors.
From the numbered headlines below, pick the 6 to 8 most important for Indian equity, commodity or economy news. Use different sources where possible.
For each, return JSON with: "n" (the headline number), "category" (Equity, Commodity or Economy), "title" (your own short rewrite, max 12 words), "summary" (1-2 plain-English sentences in your own words), "why" (one sentence on why it matters or the concept behind it).
Rules: never copy wording from the headlines or descriptions; no buy/sell advice, no tips, no price targets, no predictions; neutral tone; only state facts present in the input.
Return ONLY a JSON array, no other text.

HEADLINES:
"""

GEMINI_MODEL = "gemini-3.8-flash"

def ask_llm(prompt):
    gkey = os.environ.get("GEMINI_API_KEY", "").strip()
    if gkey:  # free option: Google Gemini
        req = urllib.request.Request(
            f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent",
            method="POST",
            data=json.dumps({"contents": [{"parts": [{"text": prompt}]}],
                             "generationConfig": {"responseMimeType": "application/json"}}).encode(),
            headers={"x-goog-api-key": gkey, "content-type": "application/json"})
        return json.loads(urllib.request.urlopen(req, timeout=120).read())["candidates"][0]["content"]["parts"][0]["text"]
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", method="POST",
        data=json.dumps({"model": MODEL, "max_tokens": 2500,
                         "messages": [{"role": "user", "content": prompt}]}).encode(),
        headers={"x-api-key": os.environ.get("ANTHROPIC_API_KEY", ""), "anthropic-version": "2023-06-01",
                 "content-type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=120).read())["content"][0]["text"]

def summarize(items):
    body = "\n".join(f"{i}. [{x['source']}] {x['title']} | {x['desc']}" for i, x in enumerate(items))
    text = ask_llm(PROMPT + body)
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    return json.loads(text)

def main():
    items = headlines()
    if len(items) < 5:
        sys.exit("Too few headlines fetched; keeping the previous brief.")
    print(f"Fetched {len(items)} headlines; asking Claude to summarize...")
    try:
        picked = summarize(items)
    except urllib.error.HTTPError as e:
        sys.exit(f"AI API error {e.code}: {e.read().decode()[:400]}")
    out = []
    for p in picked:
        n = int(p["n"])
        if 0 <= n < len(items) and p.get("category") in ("Equity", "Commodity", "Economy"):
            out.append({"category": p["category"], "title": p["title"], "summary": p["summary"],
                        "why": p["why"], "source": items[n]["source"], "url": items[n]["url"]})
    if len(out) < 3:
        sys.exit("Too few valid items; keeping the previous brief.")
    ist = datetime.now(timezone(timedelta(hours=5, minutes=30)))
    data = {"date": ist.strftime("%A, %d %B %Y"), "ticker": ticker() or old_ticker(), "items": out}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"Wrote {len(out)} items, {len(data['ticker'])} ticker entries.")

if __name__ == "__main__":
    main()
