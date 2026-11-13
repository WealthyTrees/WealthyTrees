"""Build the WealthyTrees daily newsletter HTML — v2 (website-first).
Runs in GitHub Actions after the daily brief is built.
Order: (1) Learn · Grow · Prosper — the website + today's lesson, (2) the paper
(market snapshot + top stories), (3) thank-you + share card.
Also writes the Zomato/Swiggy-style subject line + Gmail preheader to text files
for the workflow to use when sending via the Buttondown API.
Email-safe: tables for layout, inline CSS, web-safe fonts.

Usage: python3 scripts/build_newsletter.py [brief.json] [out_dir]
  brief.json defaults to data/brief.json; out_dir defaults to the current dir.
  Writes newsletter.html, newsletter_subject.txt, newsletter_preheader.txt.
  Exits non-zero if the brief is stale (>1 day old), has <3 good stories, or it
  is a weekend — unless FORCE=1 (manual run).
"""
import json, html, urllib.request, urllib.parse, datetime, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRIEF = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "data", "brief.json")
OUT_DIR = sys.argv[2] if len(sys.argv) > 2 else "."
FORCE = os.environ.get("FORCE") == "1"
BUD_GIF = "https://wealthytrees.online/assets/sprout-bob.gif"
SITE = "https://wealthytrees.online"
PAPER_URL = SITE + "/pages/the-915.html"
TOUR_URL = "https://muse.ai/s/wealthytrees-website-tour-xgi6cxwxixwkxwoxi/GZDl1iozoz4Or9lcZI1Adihh5KW7chf6MMQGg3uaKl4"

WORDS = [
    ("Dividend", "When a company earns a profit, it can share a part of it with its shareholders. That share is called a <b>dividend</b> — money paid to you simply for owning the share."),
    ("Nifty 50", "The <b>Nifty 50</b> is an index of the 50 biggest, most-traded companies on the NSE. When people say \u201cthe market went up\u201d, they often mean the Nifty 50 went up."),
    ("IPO", "An <b>IPO</b> (Initial Public Offering) is when a company sells its shares to the public for the first time. That is how a private company becomes a listed company you can invest in."),
    ("Circuit breaker", "A <b>circuit breaker</b> is a safety switch. If the market falls too fast in a day, trading pauses for a while so panic does not spiral. It gives everyone a moment to breathe."),
    ("Market cap", "<b>Market cap</b> is what a company is worth on the stock market — its share price multiplied by the number of shares. A bigger market cap usually means a bigger company."),
    ("P/E ratio", "The <b>P/E ratio</b> compares a company\u2019s share price to what it earns per share. A high P/E can mean investors expect big growth — or that the share is expensive for what it earns."),
    ("Sensex", "The <b>Sensex</b> is an index of 30 of the biggest companies on the BSE (Bombay Stock Exchange). It is India\u2019s oldest market index — the one your parents probably watched on TV."),
]

def clean(s):
    return html.unescape((s or "").strip())

def get_quotes():
    """Live quotes from the site API; falls back to data/charts.json closes."""
    import time
    d = None
    last_err = None
    for _ in range(3):
        try:
            req = urllib.request.Request(
                SITE + "/api/quotes",
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"},
            )
            with urllib.request.urlopen(req, timeout=15) as r:
                d = json.load(r)
            break
        except Exception as e:
            last_err = e
            time.sleep(2)
    if d is not None:
        q = d.get("quotes", {})
        out = []
        for name in ["NIFTY 50", "SENSEX", "BANK NIFTY", "CRUDE WTI", "USD/INR"]:
            v = q.get(name)
            if not v or not v.get("price") or not v.get("prev"):
                continue
            pct = (v["price"] - v["prev"]) / v["prev"] * 100
            out.append((name, v["price"], pct))
        if out:
            return out
    print("live quotes unavailable (%s); falling back to charts.json closes" % last_err)
    try:
        charts = json.load(open(os.path.join(ROOT, "data", "charts.json")))
        keymap = {"NIFTY 50": "Nifty 50", "SENSEX": "Sensex", "BANK NIFTY": "Bank Nifty",
                  "CRUDE WTI": "Crude WTI", "USD/INR": "USD/INR"}
        out = []
        for name, key in keymap.items():
            bars = charts.get(key)
            if not bars or len(bars) < 2:
                continue
            price, prev = bars[-1][4], bars[-2][4]
            pct = (price - prev) / prev * 100
            out.append((name, price, pct))
        return out
    except Exception as e:
        print("charts.json fallback failed:", e)
        return []

brief = json.load(open(BRIEF))
date_str = clean(brief.get("date", ""))

# ---- guards: never send a stale or thin newsletter ----
today = datetime.date.today()
if today.weekday() >= 5 and not FORCE:
    print("weekend — newsletter is weekday-only (use FORCE=1 to override)")
    sys.exit(1)
try:
    brief_date = datetime.datetime.strptime(date_str, "%A, %d %B %Y").date()
    if (today - brief_date).days > 1 and not FORCE:
        print("stale brief: %s (today %s) — refusing to build" % (brief_date, today))
        sys.exit(1)
except ValueError:
    print("could not parse brief date %r — continuing" % date_str)

items = [it for it in brief.get("items", []) if (it.get("summary") or "") != (it.get("title") or "")]
stories = items[:6]
if len(stories) < 3 and not FORCE:
    print("only %d good stories — refusing to build" % len(stories))
    sys.exit(1)
quotes = get_quotes()

# ---- today's lesson word (rotates daily) ----
word, word_def = WORDS[today.timetuple().tm_yday % len(WORDS)]

# ---- subject line + preheader (Zomato/Swiggy-style, 2-minute hook) ----
idx = [q for q in quotes if q[0] in ("NIFTY 50", "SENSEX", "BANK NIFTY")]
biggest = max(idx, key=lambda x: abs(x[2])) if idx else (max(quotes, key=lambda x: abs(x[2])) if quotes else None)
if biggest:
    bname = {"NIFTY 50": "Nifty", "SENSEX": "Sensex", "BANK NIFTY": "Bank Nifty"}.get(biggest[0], biggest[0].title())
    direction = "slipped" if biggest[2] < 0 else "climbed"
    subject = f"\u2615 {bname} {direction} \u2014 your 2-minute market coffee is ready"
else:
    subject = "\u2615 Your 2-minute market coffee is ready"
preheader = f"Hey — grab your coffee. {len(stories)} stories, 1 new word, zero jargon. The market, in 2 minutes."

# ---- share links (pre-filled summary for forwarding) ----
share_text = (
    "THE 9:15 by WealthyTrees \u2615 — the whole market in 2 minutes, in plain English. "
    "No tips, no jargon. Free every weekday: " + PAPER_URL
)
wa_url = "https://wa.me/?text=" + urllib.parse.quote(share_text)
mail_url = ("mailto:?subject=" + urllib.parse.quote("THE 9:15 — the market in 2 minutes") +
            "&body=" + urllib.parse.quote(share_text))
x_url = ("https://twitter.com/intent/tweet?text=" +
         urllib.parse.quote("THE 9:15 by WealthyTrees — the whole market in 2 minutes, in plain English. Free every weekday.") +
         "&url=" + urllib.parse.quote(PAPER_URL))

def fmt_price(name, price):
    if name == "USD/INR":
        return f"\u20b9{price:,.2f}"
    if name == "CRUDE WTI":
        return f"${price:,.2f}"
    return f"{price:,.2f}"

def market_cells():
    cells = []
    for name, price, pct in quotes:
        up = pct >= 0
        color = "#1a7a3c" if up else "#c0392b"
        arrow = "\u25b2" if up else "\u25bc"
        cells.append(
            f'<td style="padding:10px 6px;text-align:center;border:1px solid #e8ddc0;background:#fffdf4;">'
            f'<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#6b7a72;text-transform:uppercase;">{html.escape(name)}</div>'
            f'<div style="font-family:Georgia,serif;font-size:17px;font-weight:bold;color:#0e2a20;margin:3px 0 1px;">{fmt_price(name, price)}</div>'
            f'<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:{color};">{arrow} {abs(pct):.2f}%</div></td>'
        )
    return "".join(cells)

def tidy_summary(s):
    raw = clean(s)
    if raw and raw[-1] not in ".!?":
        raw = raw.rsplit(" ", 1)[0] + "…"
    if len(raw) > 230:
        raw = raw[:230].rsplit(" ", 1)[0] + "…"
    return html.escape(raw)

def story_rows():
    rows = []
    for it in stories:
        cat = html.escape(clean(it.get("category", "Markets")).upper())
        title = html.escape(clean(it.get("title", "")))
        summary = tidy_summary(it.get("summary", ""))
        why = html.escape(clean(it.get("why", "")))
        source = html.escape(clean(it.get("source", "")))
        url = html.escape(it.get("url", SITE))
        rows.append(
            f'<tr><td style="padding:16px 24px 4px;">'
            f'<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#b98a2e;text-transform:uppercase;">{cat}</div>'
            f'<div style="font-family:Georgia,serif;font-size:19px;font-weight:bold;line-height:1.3;color:#0e2a20;margin:5px 0 6px;">'
            f'<a href="{url}" style="color:#0e2a20;text-decoration:none;">{title}</a></div>'
            f'<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#3d4a44;">{summary}</div>'
            f'<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#3d4a44;margin-top:6px;"><b style="color:#0e2a20;">Why it matters:</b> {why}</div>'
            f'<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8a9a92;margin-top:8px;">Source: {source} &nbsp;·&nbsp; <a href="{url}" style="color:#14532d;font-weight:bold;text-decoration:none;">Read more →</a></div>'
            f'</td></tr>'
            f'<tr><td style="padding:0 24px;"><div style="border-top:1px solid #eadfc3;"></div></td></tr>'
        )
    return "".join(rows)

html_doc = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>THE 9:15 — by WealthyTrees · {html.escape(date_str)}</title>
<!-- SUBJECT (use as the email subject when sending): {html.escape(subject)} -->
<!-- PREHEADER (the first line Gmail shows after the subject): {html.escape(preheader)} -->
<style>
@media only screen and (max-width:620px){{.wt-wrap{{width:100%!important}}.wt-pad{{padding-left:16px!important;padding-right:16px!important}}.wt-h1{{font-size:30px!important}}}}
@keyframes wtShimmer{{0%{{background-position:-200% 0}}100%{{background-position:200% 0}}}}
.wt-goldrule{{background:linear-gradient(90deg,#e0b04f,#f5c26b,#e0b04f);background-size:200% 100%;animation:wtShimmer 5s linear infinite}}
</style></head>
<body style="margin:0;padding:0;background:#f4efe4;">
<!-- Preheader: hidden preview text shown by Gmail/Apple Mail after the subject -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">{html.escape(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe4;"><tr><td align="center" style="padding:20px 10px;">
<table role="presentation" class="wt-wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#fffdf6;border:1px solid #e8ddc0;">

<!-- MASTHEAD -->
<tr><td style="background:#0e2a20;padding:26px 24px 20px;text-align:center;">
<img src="{BUD_GIF}" width="52" height="52" alt="Sprout" style="display:block;margin:0 auto 8px;border:0;">
<div class="wt-h1" style="font-family:Georgia,serif;font-size:36px;font-weight:bold;letter-spacing:1px;color:#ffffff;line-height:1.1;">THE 9:15</div>
<div style="font-family:Georgia,serif;font-size:14px;color:#f5c26b;margin-top:4px;">by WealthyTrees</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#b8c8bf;margin-top:10px;">The Morning Paper — Markets, simplified. In 2 minutes. &nbsp;·&nbsp; {html.escape(date_str)}</div>
</td></tr>
<tr><td class="wt-goldrule" style="height:4px;font-size:0;line-height:0;background:#e0b04f;">&nbsp;</td></tr>

<!-- 1 · THE WEBSITE FIRST : LEARN · GROW · PROSPER -->
<tr><td class="wt-pad" style="padding:22px 24px 4px;text-align:center;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:3px;color:#b98a2e;">LEARN &nbsp;·&nbsp; GROW &nbsp;·&nbsp; PROSPER</div>
<div style="font-family:Georgia,serif;font-size:24px;font-weight:bold;line-height:1.3;color:#0e2a20;margin:8px 0 6px;">The market, in plain English.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#3d4a44;max-width:480px;margin:0 auto;">WealthyTrees is a free classroom for the Indian markets — learn the concept first, then read the headline. No tips. No noise. Just understanding, one small step a day.</div>
</td></tr>
<tr><td class="wt-pad" style="padding:14px 24px 6px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#fdf6dd;border:2px solid #e0b04f;border-radius:12px;padding:16px 18px;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#b98a2e;text-transform:uppercase;">🌱 Today&rsquo;s lesson · Sprout&rsquo;s Market Word</div>
<div style="font-family:Georgia,serif;font-size:19px;font-weight:bold;color:#0e2a20;margin:6px 0 4px;">{html.escape(word)}</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#3d4a44;">{word_def}</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;margin-top:10px;"><a href="{SITE}/pages/learn.html" style="display:inline-block;background:#0e2a20;color:#ffffff;font-weight:bold;text-decoration:none;padding:10px 20px;border-radius:999px;">Start learning →</a> <a href="{TOUR_URL}" style="display:inline-block;background:#fdf6dd;color:#0e2a20;font-weight:bold;text-decoration:none;padding:10px 20px;border-radius:999px;border:2px solid #e0b04f;">🌱 Take the tour →</a></div>
</td></tr></table></td></tr>
<tr><td style="padding:6px 24px 0;"><div style="border-top:2px solid #0e2a20;"></div></td></tr>

<!-- 2 · THE PAPER -->
<tr><td class="wt-pad" style="padding:16px 24px 6px;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#b98a2e;text-transform:uppercase;">Market snapshot</div></td></tr>
<tr><td class="wt-pad" style="padding:8px 24px 4px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>{market_cells()}</tr></table></td></tr>
<tr><td class="wt-pad" style="padding:4px 24px 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8a9a92;">Prices from the latest close. For education only — not investment advice.</td></tr>
<tr><td class="wt-pad" style="padding:10px 24px 2px;">
<div style="font-family:Georgia,serif;font-size:21px;font-weight:bold;color:#0e2a20;">Today&rsquo;s top stories</div></td></tr>
{story_rows()}
<tr><td style="text-align:center;padding:14px 24px 20px;">
<a href="{PAPER_URL}" style="display:inline-block;background:#0e2a20;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;padding:13px 28px;border-radius:999px;">Read the full paper →</a>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7a72;margin-top:12px;">Also inside: Live Wire, the heatmap, and today&rsquo;s Learn lesson.</div>
</td></tr>
<tr><td style="padding:0 24px;"><div style="border-top:1px solid #eadfc3;"></div></td></tr>

<!-- 3 · THANK YOU + SHARE -->
<tr><td class="wt-pad" style="padding:20px 24px 6px;text-align:center;">
<div style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#0e2a20;">Thanks for reading ☕</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#3d4a44;margin-top:6px;">That was 2 minutes — about as long as your coffee takes to cool. If it made the market feel a little less confusing, pass it on.</div>
</td></tr>
<tr><td class="wt-pad" style="padding:10px 24px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#0e2a20;border-radius:14px;padding:18px;text-align:center;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#f5c26b;text-transform:uppercase;">Liked it? Share THE 9:15</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#b8c8bf;margin:6px 0 12px;">One tap sends a friend the 2-minute version of the market.</div>
<a href="{wa_url}" style="display:inline-block;background:#25d366;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:11px 18px;border-radius:999px;margin:2px;">💬 Share on WhatsApp</a>
<a href="{mail_url}" style="display:inline-block;background:#f5c26b;color:#0e1f1a;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:11px 18px;border-radius:999px;margin:2px;">✉️ Forward by email</a>
<a href="{x_url}" style="display:inline-block;background:#ffffff;color:#0e2a20;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:11px 18px;border-radius:999px;margin:2px;">𝕏 Post on X</a>
</td></tr></table></td></tr>

<!-- FOOTER -->
<tr><td style="background:#0e2a20;padding:22px 24px;text-align:center;">
<div style="font-family:Georgia,serif;font-size:17px;font-weight:bold;color:#ffffff;">WealthyTrees</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#b8c8bf;margin-top:6px;line-height:1.7;">Markets, simplified. Daily.<br>
<a href="{SITE}" style="color:#f5c26b;text-decoration:none;">wealthytrees.online</a> &nbsp;·&nbsp; <a href="{SITE}/pages/learn.html" style="color:#f5c26b;text-decoration:none;">Learn</a> &nbsp;·&nbsp; <a href="{SITE}/pages/markets.html" style="color:#f5c26b;text-decoration:none;">Markets</a> &nbsp;·&nbsp; <a href="{PAPER_URL}" style="color:#f5c26b;text-decoration:none;">THE 9:15</a></div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#93a89c;margin-top:12px;line-height:1.7;">For education only. Not investment advice. We are not SEBI-registered advisors.<br>
You are receiving this because you subscribed to the WealthyTrees daily brief.<br>
<a href="{{{{ unsubscribe_url }}}}" style="color:#93a89c;text-decoration:underline;">Unsubscribe</a></div>
</td></tr>

</table>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8a9a92;text-align:center;padding:12px;">© {date_str.split(",")[-1].strip() if date_str else ""} WealthyTrees · Indian stock and commodity news in plain language.</div>
</td></tr></table></body></html>
"""

os.makedirs(OUT_DIR, exist_ok=True)
with open(os.path.join(OUT_DIR, "newsletter.html"), "w", encoding="utf-8") as f:
    f.write(html_doc)
with open(os.path.join(OUT_DIR, "newsletter_subject.txt"), "w", encoding="utf-8") as f:
    f.write(subject)
with open(os.path.join(OUT_DIR, "newsletter_preheader.txt"), "w", encoding="utf-8") as f:
    f.write(preheader)
print("wrote newsletter.html", len(html_doc), "bytes")
print("stories:", len(stories), "| markets:", len(quotes), "| date:", date_str)
print("lesson word:", word)
print("SUBJECT:", subject)
print("PREHEADER:", preheader)
