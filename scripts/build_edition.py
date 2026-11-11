#!/usr/bin/env python3
"""Builds THE 9:15 (mobile pages + desktop broadsheet) from data/brief.json, charts.json, explain.json. No dependencies."""
import json, html, datetime as dt, os, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
now = dt.datetime.now(IST)
TODAY = now.strftime("%Y-%m-%d")
if now.weekday() >= 5 and not os.environ.get("FORCE"):
    print("weekend: edition not rebuilt"); sys.exit(0)
J = lambda f, d=None: json.load(open(f"{R}/data/{f}")) if os.path.exists(f"{R}/data/{f}") else d
brief, explain, charts, quizzes = J("brief.json"), J("explain.json"), J("charts.json", {}), J("quiz.json", [])
e = lambda s: html.escape(str(s))
tk = {t["name"]: t for t in brief["ticker"]}
items = brief["items"]
DH_DATE = "2026-11-06"
DW_DATE = "2026-11-07"  # Diwali weekend special: front page gets Diwali animation + Learn promo
DH_ITEM = {"category": "Equity", "title": "Happy Dhanteras: why India buys gold today",
 "summary": "Dhanteras, also called Dhantrayodashi, falls on the thirteenth day of the waning moon in the month of Kartik, and opens the five days of Diwali. The name joins \u2018dhan\u2019, wealth, with \u2018teras\u2019, thirteen. Families traditionally mark the day by bringing home something new \u2014 often gold, silver or a utensil \u2014 as a sign of prosperity for the year ahead.",
 "why": "Festival days move a lot of gold buying, so the tradition behind the headlines is worth knowing first. A custom is not a market signal, and this paper never treats it as one.",
 "source": "WealthyTrees"}
if TODAY == DH_DATE:
    items.insert(0, DH_ITEM)
by = lambda *c: [i for i in items if i["category"] in c]

def short(s, n=230):
    s = s.strip()
    if len(s) <= n: return s
    cut = s[:n]; m = max(cut.rfind(". "), cut.rfind("; "))
    return cut[:m + 1] if m > 80 else cut.rsplit(" ", 1)[0] + "…"

def lc(n):
    """Last CLOSE only: ignores today's (still moving) row, so the paper never shows intraday prices."""
    rows = [r for r in (charts.get(n) or []) if r["time"] < TODAY]
    if len(rows) < 2: return None
    p, q = rows[-2]["close"], rows[-1]["close"]
    return {"v": q, "c": (q - p) / p * 100, "d": rows[-1]["time"]}
FMT = {"Gold": "${:,.0f}", "Crude WTI": "${:,.2f}", "USD/INR": "{:,.2f}"}
def card(n, label=None):
    t = lc(n)
    if not t: return ""
    cls = "up" if t["c"] >= 0 else "dn"
    return (f'<div class="cd"><small>{e(label or n)}</small><strong>{e(FMT.get(n, "{:,.0f}").format(t["v"]))}</strong>'
            f'<b class="{cls}">{"▲" if t["c"] >= 0 else "▼"} {abs(t["c"]):.2f}%</b></div>')

def glance():
    rows, mx = [], 0.5
    for n, lab in [("Bank Nifty", "Banks"), ("Nifty IT", "IT"), ("Nifty Pharma", "Pharma"), ("Nifty Auto", "Auto"), ("Nifty Metal", "Metals")]:
        t = lc(n)
        if t: rows.append((lab, t)); mx = max(mx, abs(t["c"]))
    if not rows: return ""
    body = "".join(f'<div class="gr"><span class="gl">{lab}</span><span class="gb"><i class="{"up" if t["c"] >= 0 else "dn"}" style="width:{max(6, abs(t["c"]) / mx * 100):.0f}%"></i></span>'
                   f'<b class="{"up" if t["c"] >= 0 else "dn"}">{"▲" if t["c"] >= 0 else "▼"} {abs(t["c"]):.2f}%</b></div>' for lab, t in rows)
    r = lc("USD/INR")
    foot = (f'<p class="gf">USD/INR closed <b>{abs(r["c"]):.2f}%</b> {"lower, a stronger rupee" if r["c"] < 0 else "higher, a weaker rupee"}.</p>') if r else ""
    return f'<article class="sty glance"><small class="tag">AT A GLANCE</small><h3>Sector scoreboard</h3><p class="src">Last close, % change</p><div class="rows">{body}</div>{foot}</article>'

def story(i, w=True):
    src = f'<a href="{e(i["url"])}" rel="noopener">{e(i["source"])}</a>' if i.get("url") else e(i.get("source", ""))
    return (f'<article class="sty"><h3>{e(i["title"])}</h3><p class="s-sm">{e(short(i["summary"], 165))}</p>'
            f'<p class="s-lg">{e(i["summary"])}</p>'
            f'<p class="why{"" if w else " m-off"}"><b>WHY IT MATTERS</b> <span class="w-sm">{e(short(i["why"], 120))}</span><span class="w-lg">{e(i["why"])}</span></p>'
            f'<p class="src">Source: {src}</p></article>')

def page(n, tag, head, body, title):
    return (f'<section class="pg" id="p{n}" data-title="{e(title)}"><div class="bar"><b>THE 9:15</b><span>{e(edno)}</span></div>'
            f'<div class="in"><small class="tag">PAGE {n} · {tag}</small><h2>{head}</h2>{body}</div>'
            f'<footer><span>wealthytrees.online · PAGE {n} OF 5</span><span>EDUCATION ONLY · NOT INVESTMENT ADVICE</span></footer></section>')

d0, d, n, x = dt.date(2026, 10, 27), now.date(), 0, dt.date(2026, 10, 27)
while x <= d:
    n += x.weekday() < 5; x += dt.timedelta(days=1)
edno = f"Edition No. {n} · {now.strftime('%a %d %b %Y')}"
if TODAY == DW_DATE:
    # Weekend special: no weekday number (Monday's run is still No. 10).
    edno = f"Diwali Weekend Special · {now.strftime('%a %d %b %Y')}"
_n = lc("Nifty 50")
_wd = now.date() - dt.timedelta(days=1)
while _wd.weekday() >= 5: _wd -= dt.timedelta(days=1)
if _n and _n["d"] < _wd.isoformat(): print(f"WARNING: latest Nifty close is {_n['d']}, expected {_wd.isoformat()} unless that day was an NSE holiday. Re-run the Daily brief workflow, then this one.")
stamp = "Closing prices · " + (dt.date.fromisoformat(_n["d"]).strftime("%a %d %b") if _n else "last close")
eq, ec, cm, us = by("Equity"), by("Economy"), by("Commodity"), by("US Markets")
lead = eq[0] if eq else items[0]
inside = [(2, "MARKETS", (eq[1:] or [lead])[0]), (3, "INDIA &amp; ECONOMY", (ec or [lead])[0]), (4, "COMMODITIES &amp; WORLD", (cm + us or [lead])[0])]
def _mod(t): return (t.get("learn") or "").split("#")[0].split("?")[0]
_seq, _pool, _last = [], [], None
for _k in range(max(n, 0) + 1):  # replay from Edition 0 so each day is new and never opens the same module two days running
    if not _pool: _pool = list(range(len(explain)))
    _c = [j for j in _pool if _mod(explain[j]) != _last] or _pool
    _j = _c[0]; _pool.remove(_j); _last = _mod(explain[_j]); _seq.append(_j)
ex = explain[_seq[-1]]
if TODAY == DH_DATE:
    ex = next((x for x in explain if x["title"].startswith("Gold as an asset")), ex)

def quiz(k):
    if not quizzes: return ""
    if TODAY == DH_DATE and k == 2:
        z = next((x for x in quizzes if x["q"].startswith("Paper gold")), quizzes[(n * 3 + k) % len(quizzes)])
    else:
        z = quizzes[(n * 3 + k) % len(quizzes)]
    opts = "".join(f'<button type="button" data-i="{j}">{e(o)}</button>' for j, o in enumerate(z["o"]))
    return (f'<div class="quiz" data-a="{z["a"]}"><div class="qh"><small>SPROUT QUIZ</small><h4>{e(z["q"])}</h4></div>'
            f'<div class="qo">{opts}</div><p class="qw" hidden>{e(z["w"])}</p></div>')
def closetbl():
    rows = []
    for nm, lab in [("Nifty 50", "Nifty 50"), ("Sensex", "Sensex"), ("Bank Nifty", "Bank Nifty"), ("Nifty IT", "Nifty IT"), ("Gold", "Gold"), ("Crude WTI", "Crude (WTI)"), ("USD/INR", "USD/INR"), ("S&P 500", "S&P 500")]:
        t = lc(nm)
        if t: rows.append(f'<tr><td>{e(lab)}</td><td>{e(FMT.get(nm, "{:,.0f}").format(t["v"]))}</td><td class="{"up" if t["c"] >= 0 else "dn"}">{"▲" if t["c"] >= 0 else "▼"} {abs(t["c"]):.2f}%</td></tr>')
    return "<table class=\"ct\">" + "".join(rows) + "</table>" if rows else ""
BAN = ("predict", "forecast", "outlook", "expected to rise", "expected to fall", "likely to rise", "likely to fall", "price target", "tomorrow", "next session", "buy ", "sell ")
for i in items:
    for fld in ("title", "summary", "why"):
        for w in BAN:
            if w in str(i.get(fld, "")).lower(): print(f"WARNING: forward-looking or advice wording ({w.strip()!r}) in story: {i['title'][:60]}")

watch = []
def lvl(n_, txt):
    t = lc(n_)
    if t: watch.append(txt.format(v=FMT.get(n_, "{:,.0f}").format(t["v"]), c=t["c"]))
lvl("Nifty 50", "Nifty 50 closed at {v} ({c:+.2f}%).")
lvl("Sensex", "Sensex closed at {v} ({c:+.2f}%).")
lvl("Crude WTI", "Crude (WTI) settled at {v} ({c:+.2f}%).")
lvl("S&P 500", "Wall Street’s S&P 500 ended {c:+.2f}%.")
btm = ('<div class="btm dx"><a class="bx" href="#p5" data-go="4"><small>SPROUT’S LESSON</small><h4>'+e(ex['title'])+'</h4><p>'+e(ex['intro'])+'</p><i>Page 5 →</i></a>'
       '<div class="bx"><small>YESTERDAY’S CLOSE</small>'+closetbl()+'</div>'
       '<a class="bx bg" href="#" data-wt-sub><small>GET IT FREE</small><h4>THE 9:15, every weekday at 8:30 AM</h4><p>Get it in your inbox before the bell. Free, learning only, no tips.</p><i>Subscribe free →</i></a></div>')
LEARN_STRIP = """<a class="learn9" href="/pages/learn.html"><small>NEW TO MARKETS? · LEARN, FREE</small><h4>Start with Learn — 6 beginner modules, 23 short lessons, about 35 minutes</h4><p>Market basics, reading a company, key ratios, charts, RBI to portfolio, risk &amp; behaviour. Plain English, no tips, no predictions.</p><i>Start learning →</i></a>"""
teasers_unused = "".join(f'<a class="tz" href="#p{p}" data-go="{p-1}"><small>{t}</small><h4>{e(i["title"])}</h4><p>{e(short(i["summary"], 120))}</p><i>Page {p} →</i></a>' for p, t, i in inside)
p1 = (f'<div class="strip">{card("Nifty 50","NIFTY 50")}{card("Sensex","SENSEX")}{card("Bank Nifty","BANK NIFTY")}{card("Nifty IT","NIFTY IT")}</div>'
      f'<p class="stamp">{e(stamp)}</p><div class="fwrap"><div class="fmain"><small class="tag">THE LEAD</small>'
      f'<h1>{e(lead["title"])}</h1><p class="lead s-sm">{e(short(lead["summary"], 135))}</p><p class="lead s-lg dc">{e(lead["summary"])}</p>'
      f'<p class="why dx"><b>WHY IT MATTERS</b> {e(lead["why"])}</p></div>'
      f'<aside class="fside"><div class="ins"><b>INSIDE TODAY</b>'
      + "".join(f'<a href="#p{p}" data-go="{p-1}"><i>PAGE {p}</i> {e(i["title"])}</a>' for p, t, i in inside)
      + f'<a class="ex m-only" href="#p5" data-go="4"><i>PAGE 5 · SPROUT’S LESSON</i> {e(ex["title"])}</a></div></aside></div>'
      + btm + (LEARN_STRIP if TODAY == DW_DATE else ""))
DH_CSS = """.wt-dh-ep-mast{border-top:3px double #c9a227;padding:6px 12px 4px;text-align:center;background:linear-gradient(90deg,rgba(250,247,240,0) 0%,rgba(255,241,207,0.65) 50%,rgba(250,247,240,0) 100%);font-variant-numeric:lining-nums;opacity:0;animation:wt-dh-ep-fade 0.8s ease-out 0.05s 1 forwards;}
.wt-dh-ep-badge{display:inline-flex;align-items:center;gap:8px;padding:3px 14px;border:1px solid #c9a227;border-radius:999px;background:linear-gradient(90deg,#fff6dc 0%,#ffe3a3 50%,#fff6dc 100%);color:#16241d;}
.wt-dh-ep-orn{width:22px;height:18px;display:inline-block;vertical-align:middle;color:#0f3d2e;flex:none;}
.wt-dh-ep-txt{font-family:'Playfair Display','Inter',serif;font-size:11.5px;font-weight:700;letter-spacing:0.08em;color:#0f3d2e;line-height:1.3;}
.wt-dh-ep-hi{font-family:'Noto Serif Devanagari',serif;font-weight:700;color:#7a1f00;letter-spacing:0.02em;}
.wt-dh-ep-sep{color:#c9a227;margin:0 4px;}
@keyframes wt-dh-ep-fade{0%{opacity:0;}100%{opacity:1;}}
@media (prefers-reduced-motion:reduce){.wt-dh-ep-mast{animation:none;opacity:1;}}
@media print{.wt-dh-ep-mast{animation:none!important;opacity:1!important;background:#faf7f0!important;border-top:3px double #c9a227!important;}.wt-dh-ep-badge{background:#faf7f0!important;border:1px solid #c9a227!important;color:#16241d!important;}}"""
DH_MAST = """<div class="wt-dh-ep-mast" role="region" aria-label="Shubh Dhanteras">
  <span class="wt-dh-ep-badge">
    <svg class="wt-dh-ep-orn" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M2,28 Q10,20 18,28 T34,28 T46,28" stroke="#c9a227" stroke-width="1.2" stroke-linecap="round"/><path d="M12,15 L22,15 L20,18 L14,18 Z" stroke="currentColor" stroke-width="1.2" fill="#c9a227"/><path d="M14,18 C9,20 9,28 15,30 L19,30 C25,28 25,20 20,18 Z" stroke="currentColor" stroke-width="1.3" fill="none"/><circle cx="14" cy="12" r="2" fill="#c9a227"/><circle cx="17" cy="11" r="2.2" fill="#c9a227"/><circle cx="20" cy="12" r="2" fill="#c9a227"/><path d="M29,22 Q35,28 41,22 L39.5,25.5 Q35,27 30.5,25.5 Z" stroke="currentColor" stroke-width="1.3" fill="#c9a227"/><path d="M35,13 C37,16 37,19 35,21 C33,19 33,16 35,13 Z" fill="#c9a227" stroke="currentColor" stroke-width="0.9"/></svg>
    <span class="wt-dh-ep-txt"><span class="wt-dh-ep-hi">शुभ धनतेरस</span><span class="wt-dh-ep-sep">·</span>SHUBH DHANTERAS</span>
  </span>
</div>"""
DW_CSS = """.wt-dw-ep-mast{position:relative;overflow:hidden;border-top:3px double #c9a227;padding:10px 12px 8px;text-align:center;background:linear-gradient(90deg,#fdf6dd 0%,#ffe9a8 50%,#fdf6dd 100%);}
.wt-dw-ep-row{display:flex;align-items:center;justify-content:center;gap:14px;position:relative;z-index:2;}
.wt-dw-ep-diya{width:30px;height:26px;flex:none;}
.wt-dw-ep-flame{transform-box:fill-box;transform-origin:50% 100%;animation:wt-dw-ep-flick 1.6s ease-in-out infinite;}
.wt-dw-ep-diya:nth-child(3) .wt-dw-ep-flame{animation-delay:.5s;}
@keyframes wt-dw-ep-flick{0%,100%{transform:scale(1);opacity:1}30%{transform:scale(1.1,1.18);opacity:.92}60%{transform:scale(.94,1.02);opacity:1}}
.wt-dw-ep-txt{font-family:'Playfair Display',Georgia,serif;font-size:15px;font-weight:800;letter-spacing:.06em;color:#0f3d2e;line-height:1.35;}
.wt-dw-ep-txt span{background:linear-gradient(90deg,#d61f0a,#ff6a00 55%,#c78d00);-webkit-background-clip:text;background-clip:text;color:transparent;}
.wt-dw-ep-sub{display:block;font-family:Inter,sans-serif;font-size:10.5px;font-weight:700;letter-spacing:.14em;color:#7a5b00;}
.wt-dw-ep-petal{position:absolute;top:-8px;width:9px;height:9px;border-radius:85% 0 85% 0;opacity:0;z-index:1;animation:wt-dw-ep-fall 5s ease-in infinite;}
@keyframes wt-dw-ep-fall{0%{transform:translateY(-6px) rotate(0deg);opacity:0}12%{opacity:.9}100%{transform:translateY(64px) rotate(320deg);opacity:0}}
@media (prefers-reduced-motion:reduce){.wt-dw-ep-flame,.wt-dw-ep-petal{animation:none!important}.wt-dw-ep-petal{display:none!important}}
@media print{.wt-dw-ep-flame,.wt-dw-ep-petal{animation:none!important;opacity:1!important;}}
.learn9{display:block;margin-top:1.6rem;background:#e8f1ea;border:1px solid #bcd5c4;border-top:4px solid #0f3d2e;padding:1.1rem 1.4rem;color:inherit;text-decoration:none;}
.learn9 small{display:block;font:700 .68rem Inter,sans-serif;letter-spacing:.16em;color:#0f7b55;}
.learn9 h4{font:800 1.25rem/1.3 "Playfair Display",Georgia,serif;margin:.35rem 0 .3rem;}
.learn9 p{font-size:.95rem;line-height:1.55;color:#33453b;margin:0;}
.learn9 i{display:inline-block;margin-top:.5rem;font:700 .8rem Inter,sans-serif;color:#9a7b12;font-style:normal;}
a.learn9:hover h4{color:#0f7b55;}
@media(max-width:899.98px){.learn9{border-radius:10px;padding:1rem;}}"""
DW_MAST = """<div class="wt-dw-ep-mast" role="region" aria-label="Shubh Diwali">
  <span class="wt-dw-ep-petal" style="left:12%;background:#ff6a00;animation-delay:0s"></span>
  <span class="wt-dw-ep-petal" style="left:28%;background:#ffb400;animation-delay:1.2s"></span>
  <span class="wt-dw-ep-petal" style="left:70%;background:#d61f0a;animation-delay:.6s"></span>
  <span class="wt-dw-ep-petal" style="left:86%;background:#ff8c42;animation-delay:1.8s"></span>
  <div class="wt-dw-ep-row">
    <svg class="wt-dw-ep-diya" viewBox="0 0 24 24" aria-hidden="true"><path class="wt-dw-ep-flame" d="M12 4c1.9 2.4 2.9 4.1 2.9 5.9a2.9 2.9 0 1 1-5.8 0c0-1.8 1-3.5 2.9-5.9z" fill="#ff7a00"/><path class="wt-dw-ep-flame" d="M12 6.6c1 1.3 1.5 2.2 1.5 3a1.5 1.5 0 1 1-3 0c0-.8.5-1.7 1.5-3z" fill="#ffd23e"/><path d="M3.5 12.5h17c0 3.6-3.8 6.2-8.5 6.2s-8.5-2.6-8.5-6.2z" fill="#b34a1a"/><path d="M3.5 12.5h17" stroke="#e8a33d" stroke-width="1.4" fill="none"/></svg>
    <span class="wt-dw-ep-txt"><span>शुभ दीवाली</span> · SHUBH DIWALI<span class="wt-dw-ep-sub">DIWALI WEEKEND SPECIAL · MARKETS CLOSED, LEARNING OPEN</span></span>
    <svg class="wt-dw-ep-diya" viewBox="0 0 24 24" aria-hidden="true"><path class="wt-dw-ep-flame" d="M12 4c1.9 2.4 2.9 4.1 2.9 5.9a2.9 2.9 0 1 1-5.8 0c0-1.8 1-3.5 2.9-5.9z" fill="#ff7a00"/><path class="wt-dw-ep-flame" d="M12 6.6c1 1.3 1.5 2.2 1.5 3a1.5 1.5 0 1 1-3 0c0-.8.5-1.7 1.5-3z" fill="#ffd23e"/><path d="M3.5 12.5h17c0 3.6-3.8 6.2-8.5 6.2s-8.5-2.6-8.5-6.2z" fill="#b34a1a"/><path d="M3.5 12.5h17" stroke="#e8a33d" stroke-width="1.4" fill="none"/></svg>
  </div>
</div>"""
mast = (f'<header class="mast"><div class="m-l"><img src="/assets/logo-dark.svg" alt=""><span class="m-wt">WealthyTrees</span></div>'
        f'<div class="m-c"><small>WEALTHYTREES</small><h1 class="mh">THE 9:15</h1></div><span>{e(edno)}</span></header>'
        + (DH_MAST if TODAY == DH_DATE else "")
        + (DW_MAST if TODAY == DW_DATE else "")
        + f'<p class="tagl">The Morning Paper — Markets, simplified. In 2 minutes.</p>')
pages = [f'<section class="pg first" id="p1" data-title="Front Page">{mast}<div class="in">{p1}</div>'
         f'<footer><span>wealthytrees.online · PAGE 1 OF 5</span><span>EDUCATION ONLY · NOT INVESTMENT ADVICE</span></footer></section>']
def stories(lst, k_show=2, first_w=True, glance_html=""):
    items = "".join(story(i, first_w and k == 0).replace('class="sty"', 'class="sty%s"' % (" dx" if k >= k_show else ""), 1) for k, i in enumerate(lst))
    total = len(lst) + (1 if glance_html else 0)
    if total == 2:
        items += filler()
    return '<div class="stories">' + items + glance_html + '</div>'
WORDS = [
 ("Circuit breaker", "A pause button for the market. If an index falls too far, too fast, trading stops for a while so everyone can calm down.", "/learn/beginner/module-1.html"),
 ("Market cap", "A company\u2019s total value on the stock market. One share\u2019s price, times all the shares. It tells you the size of a company, not the quality.", "/learn/beginner/module-2.html"),
 ("P/E ratio", "Price divided by earnings per share. It tells you how much you pay for every \u20b91 the company earns.", "/learn/beginner/module-3.html"),
 ("Sensex", "Thirty big, well-established companies on the Bombay Stock Exchange. India\u2019s oldest index.", "/learn/beginner/module-1.html"),
 ("Dividend", "A share of a company\u2019s profit, paid out to shareholders. It is usually paid in cash, per share. Not every company pays one.", "/learn/beginner/module-2.html"),
 ("Nifty 50", "The fifty largest companies on the National Stock Exchange. The most-watched gauge of the Indian market.", "/learn/beginner/module-1.html"),
 ("IPO", "Initial Public Offering: the first time a company sells its shares to the public. That is when it lists on the exchange.", "/learn/beginner/module-1.html"),
]
def filler():
    t, d, u = WORDS[n % len(WORDS)]
    return (f'<article class="sty fill"><small class="tag">SPROUT\u2019S MARKET WORD</small><h3>{e(t)}</h3>'
            f'<p class="s-lg">{e(d)}</p><p class="src"><a href="{e(u)}">Learn \u2192</a></p></article>')
pages.append(page(2, "MARKETS", "Markets", stories((eq[1:5] or eq[:1])) + quiz(0), "Markets"))
pages.append(page(3, "INDIA &amp; ECONOMY", "India &amp; Economy", (stories(ec[:3], glance_html=glance()) if ec else "<p>No economy stories today.</p>") + quiz(1), "India & Economy"))
pages.append(page(4, "COMMODITIES &amp; WORLD", "Commodities &amp; World",
    f'<div class="strip">{card("Gold","GOLD")}{card("Crude WTI","CRUDE")}{card("USD/INR")}{card("S&P 500")}</div>'
    + stories((cm[:2] + us[:2]), 2, False) + quiz(2), "Commodities & World"))
wa = "https://wa.me/?text=" + html.escape("THE 9:15 — The Morning Paper. Markets, simplified. In 2 minutes. https://wealthytrees.online/the915", quote=True).replace(" ", "%20")
steps = "".join(f'<div class="st"><span>{k+1}</span><div><h3>{e(s[0])}</h3><p>{e(s[1])}</p></div></div>' for k, s in enumerate(ex["steps"]))
pages.append(page(5, "SPROUT’S LESSON", e(ex["title"]),
    f'<div class="xwrap"><div class="xl"><p class="lead">{e(ex["intro"])}</p><p class="why one"><b>THE ONE-LINE VERSION</b> {e(ex["oneline"])}</p><a class="share cta9" href="{e(ex.get("learn", "/pages/learn.html"))}">Learn this properly, free →</a> <a class="share" style="margin-top:.9rem" href="{wa}" rel="noopener">Share this paper on WhatsApp</a></div><div class="xr">{steps}</div></div>', "Sprout’s Lesson"))
CSS = open(f"{R}/scripts/edition.css").read() + open(f"{R}/scripts/edition-desk.css").read() + open(f"{R}/scripts/tools.css").read() + open(f"{R}/scripts/mobile.css").read() + open(f"{R}/scripts/quiz.css").read() + (DH_CSS if TODAY == DH_DATE else "") + (DW_CSS if TODAY == DW_DATE else "")
titles = ["Front Page", "Markets", "India & Economy", "Commodities & World", "Sprout’s Lesson"]
util = ('<div class="util"><a href="/" aria-label="WealthyTrees home">←<span class="ut"> WealthyTrees</span></a><nav class="tabs9">'
        + "".join(f'<button data-go="{k}">{e(t)}</button>' for k, t in enumerate(titles))
        + '</nav><span class="arr"><button id="pv" aria-label="Previous page">←</button><button id="nx" aria-label="Next page">→</button></span></div>')
JS = """(function(){var p=[].slice.call(document.querySelectorAll('.pg')),m=document.querySelector('main'),q=matchMedia('(min-width:900px)'),b=[].slice.call(document.querySelectorAll('.tabs9 button')),i=0;
function show(n,w){i=Math.max(0,Math.min(4,n));p.forEach(function(s,k){s.classList.toggle('on',k===i)});b.forEach(function(x,k){x.classList.toggle('on',k===i)});if(w)history.replaceState(null,'','#p'+(i+1));window.scrollTo(0,0)}
function init(){m.classList.toggle('flip',q.matches);if(q.matches){var h=/^#p([1-5])$/.exec(location.hash);show(h?h[1]-1:i,0)}}
document.addEventListener('click',function(ev){var g=ev.target.closest('[data-go]');if(g&&q.matches){ev.preventDefault();show(+g.getAttribute('data-go'),1)}});
document.getElementById('pv').onclick=function(){show(i-1,1)};document.getElementById('nx').onclick=function(){show(i+1,1)};
document.addEventListener('keydown',function(ev){if(!q.matches)return;if(ev.key==='ArrowRight')show(i+1,1);if(ev.key==='ArrowLeft')show(i-1,1)});
q.addEventListener?q.addEventListener('change',init):0;init()})();"""
JS += open(f"{R}/scripts/tools.js").read()
JS += """document.addEventListener('click',function(ev){var b=ev.target.closest('.quiz .qo button');if(!b)return;var q=b.closest('.quiz');if(q.classList.contains('done'))return;q.classList.add('done');var a=+q.getAttribute('data-a'),i=+b.getAttribute('data-i');[].forEach.call(q.querySelectorAll('.qo button'),function(x,k){if(k===a)x.classList.add('ok');else if(k===i)x.classList.add('no')});var w=q.querySelector('.qw');w.hidden=false;w.insertAdjacentText('afterbegin',(i===a?'Correct. ':'Not quite. '))});"""
GA_TAG = '<!-- Google tag (gtag.js) --><script async src="https://www.googletagmanager.com/gtag/js?id=G-4YSB382RQ0"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-4YSB382RQ0");</script>'
out = (f'<!doctype html><html lang="en"><head>' + GA_TAG + f'<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
       f'<title>THE 9:15 · {e(edno)} · WealthyTrees</title><meta name="description" content="{e(lead["title"])}. Markets, simplified. In 2 minutes.">'
       f'<link rel="icon" href="/assets/logo.svg"><link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Noto+Serif:wght@600;700&family=Playfair+Display:wght@800;900&family=Inter:wght@400;600&display=swap" rel="stylesheet">'
       '<link rel="canonical" href="https://wealthytrees.online/pages/the-915.html"><meta property="og:type" content="website"><meta property="og:site_name" content="WealthyTrees">'
       '<meta property="og:title" content="THE 9:15 · The Morning Paper by WealthyTrees"><meta property="og:description" content="Yesterday’s closing prices, short market stories and a daily lesson. Free every weekday. Education only.">'
       '<meta property="og:url" content="https://wealthytrees.online/pages/the-915.html"><meta property="og:image" content="https://wealthytrees.online/assets/logo.svg"><meta name="twitter:card" content="summary">'
       f'<style>{CSS}</style><link rel="stylesheet" href="/css/sprout-ai.css?v=4"></head><body>{util}<main>{"".join(pages)}</main><script>{JS}</script><script src="/js/sprout-ai.js?v=4" defer></script></body></html>')
os.makedirs(f"{R}/pages", exist_ok=True); os.makedirs(f"{R}/edition", exist_ok=True)
open(f"{R}/pages/the-915.html", "w").write(out)
open(f"{R}/edition/{now.strftime('%Y-%m-%d')}.html", "w").write(out)
print("built edition", n, now.isoformat())
