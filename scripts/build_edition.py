#!/usr/bin/env python3
"""Builds THE 9:15 from data/brief.json + data/explain.json. No dependencies."""
import json, html, re, datetime as dt, os, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
now = dt.datetime.now(IST)
brief = json.load(open(f"{R}/data/brief.json"))
explain = json.load(open(f"{R}/data/explain.json"))
e = lambda s: html.escape(str(s))
tk = {t["name"]: t for t in brief["ticker"]}
items = brief["items"]
by = lambda *c: [i for i in items if i["category"] in c]

def short(s, n=230):
    s = s.strip()
    if len(s) <= n: return s
    cut = s[:n]
    m = max(cut.rfind(". "), cut.rfind("; "))
    return (cut[:m + 1] if m > 80 else cut.rsplit(" ", 1)[0] + "…")

def chg(c):
    c = float(c); cls = "up" if c >= 0 else "dn"
    return f'<b class="{cls}">{"▲" if c >= 0 else "▼"} {abs(c):.2f}%</b>'

def card(n, label=None):
    t = tk.get(n)
    if not t: return ""
    return f'<div class="cd"><small>{e(label or n)}</small><strong>{e(t["value"])}</strong>{chg(t["change"])}</div>'

def story(i, w=True):
    src = f'<a href="{e(i["url"])}" rel="noopener">{e(i["source"])}</a>' if i.get("url") else e(i.get("source", ""))
    return (f'<h3>{e(i["title"])}</h3><p>{e(short(i["summary"], 165))}</p>'
            + (f'<p class="why"><b>WHY IT MATTERS</b> {e(short(i["why"], 120))}</p>' if w else '')
            + f'<p class="src">Source: {src}</p>')

def page(n, tag, head, body, first=False):
    top = "" if first else f'<div class="bar"><b>THE 9:15</b><span>{e(edno_txt)}</span></div>'
    return (f'<section class="pg">{top}<div class="in"><small class="tag">PAGE {n} · {tag}</small>'
            f'<h2>{head}</h2>{body}</div><footer><span>wealthytrees.online · PAGE {n} OF 6</span>'
            f'<span>EDUCATION ONLY · NOT INVESTMENT ADVICE</span></footer></section>')

# edition number: weekdays since Mon 26 Oct 2026 (Edition 1)
d0 = dt.date(2026, 10, 26); d = now.date(); n = 0
x = d0
while x <= d:
    if x.weekday() < 5: n += 1
    x += dt.timedelta(days=1)
edno_txt = f"Edition No. {n} · {now.strftime('%a %d %b %Y')}"
stamp = f"Prices as of {now.strftime('%I:%M %p').lstrip('0')} IST · last close"

eq, ec, cm, us = by("Equity"), by("Economy"), by("Commodity"), by("US Markets")
lead = eq[0] if eq else items[0]
inside = [(2, (eq[1:] or [lead])[0]), (3, (ec or [lead])[0]), (4, (cm + us or [lead])[0])]

p1 = (f'<div class="strip">{card("NIFTY 50")}{card("SENSEX")}{card("GOLD $/oz","GOLD")}{card("CRUDE WTI","CRUDE")}</div>'
      f'<p class="stamp">{e(stamp)}</p><small class="tag">THE LEAD</small>'
      f'<h1>{e(lead["title"])}</h1><p class="lead">{e(short(lead["summary"], 135))}</p>'
      f'<div class="ins"><b>INSIDE TODAY</b>'
      + "".join(f'<div><i>PAGE {p}</i> {e(i["title"])}</div>' for p, i in inside)
      + f'<div class="ex"><i>PAGE 5 · EXPLAIN ONE THING</i> {e(explain[(n-1) % len(explain)]["title"])}</div></div>')
mast = (f'<header class="mast"><img src="/assets/logo-dark.svg" alt=""><div><small>WEALTHYTREES</small>'
        f'<h1 class="mh">THE 9:15</h1></div><span>{e(edno_txt)}</span></header>'
        f'<p class="tagl">The Morning Paper — Markets, simplified. In 2 minutes.</p>')
pages = [f'<section class="pg first">{mast}<div class="in">{p1}</div><footer><span>wealthytrees.online · PAGE 1 OF 6</span><span>EDUCATION ONLY · NOT INVESTMENT ADVICE</span></footer></section>']
pages.append(page(2, "MARKETS", "Markets", "".join(story(i, k == 0) for k, i in enumerate((eq[1:3] or eq[:1])))))
pages.append(page(3, "INDIA &amp; ECONOMY", "India &amp; Economy", "".join(story(i, k == 0) for k, i in enumerate(ec[:2])) or "<p>No economy stories today.</p>"))
pages.append(page(4, "COMMODITIES &amp; WORLD", "Commodities &amp; World",
    f'<div class="strip">{card("GOLD $/oz","GOLD")}{card("CRUDE WTI","CRUDE")}{card("USD/INR")}{card("S&P 500")}</div>'
    + "".join(story(i, False) for i in (cm[:1] + us[:1]))))
ex = explain[(n - 1) % len(explain)]
steps = "".join(f'<div class="st"><span>{k+1}</span><div><h3>{e(s[0])}</h3><p>{e(s[1])}</p></div></div>' for k, s in enumerate(ex["steps"]))
pages.append(page(5, "EXPLAIN ONE THING", e(ex["title"]), f'<p class="lead">{e(ex["intro"])}</p>{steps}<p class="why"><b>THE ONE-LINE VERSION</b> {e(ex["oneline"])}</p>'))
watch = []
def lvl(n_, txt):
    t = tk.get(n_)
    if t: watch.append(txt.format(v=t["value"], c=float(t["change"])))
lvl("NIFTY 50", "Nifty closed at {v} ({c:+.2f}%). Does it hold or slip at the open?")
lvl("CRUDE WTI", "Crude (WTI) at {v} ({c:+.2f}%). Oil moves India's costs.")
lvl("USD/INR", "Rupee at {v} per dollar ({c:+.2f}%).")
lvl("S&P 500", "Wall Street's S&P 500 ended {c:+.2f}%, which sets our opening tone.")
pages.append(page(6, "TOMORROW &amp; WRAP", "Today at the Bell",
    '<p class="lead">Where to look when the bell rings. Not predictions.</p><ul>' + "".join(f"<li>{e(w)}</li>" for w in watch)
    + '</ul><div class="box">GET THE 9:15 — FREE<br>Every weekday at 8:30 AM. Read it here, or tap “Subscribe” on wealthytrees.online to get it in your inbox.</div>'
    + '<p class="src">Prices are last-close values, stamped with the time they were updated. Always check live prices before acting.</p>'))

CSS = open(f"{R}/scripts/edition.css").read()
out = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
       f'<title>THE 9:15 · {e(edno_txt)} · WealthyTrees</title><meta name="description" content="{e(lead["title"])}. Markets, simplified. In 2 minutes.">'
       f'<link rel="icon" href="/assets/logo.svg"><link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">'
       f'<style>{CSS}</style></head><body><main>{"".join(pages)}</main></body></html>')
os.makedirs(f"{R}/edition", exist_ok=True)
os.makedirs(f"{R}/pages", exist_ok=True)
open(f"{R}/pages/the-915.html", "w").write(out)
open(f"{R}/edition/{now.strftime('%Y-%m-%d')}.html", "w").write(out)
print("built edition", n, now.isoformat())
