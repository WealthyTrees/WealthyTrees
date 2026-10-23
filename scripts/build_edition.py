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
brief, explain, charts = J("brief.json"), J("explain.json"), J("charts.json", {})
e = lambda s: html.escape(str(s))
tk = {t["name"]: t for t in brief["ticker"]}
items = brief["items"]
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

d0, d, n, x = dt.date(2026, 10, 26), now.date(), 0, dt.date(2026, 10, 26)
while x <= d:
    n += x.weekday() < 5; x += dt.timedelta(days=1)
edno = f"Edition No. {n} · {now.strftime('%a %d %b %Y')}"
_n = lc("Nifty 50")
stamp = "Closing prices · " + (dt.date.fromisoformat(_n["d"]).strftime("%a %d %b") if _n else "last close")
eq, ec, cm, us = by("Equity"), by("Economy"), by("Commodity"), by("US Markets")
lead = eq[0] if eq else items[0]
inside = [(2, "MARKETS", (eq[1:] or [lead])[0]), (3, "INDIA &amp; ECONOMY", (ec or [lead])[0]), (4, "COMMODITIES &amp; WORLD", (cm + us or [lead])[0])]
ex = explain[(n - 1) % len(explain)] if n > 0 else explain[0]

watch = []
def lvl(n_, txt):
    t = lc(n_)
    if t: watch.append(txt.format(v=FMT.get(n_, "{:,.0f}").format(t["v"]), c=t["c"]))
lvl("Nifty 50", "Nifty 50 closed at {v} ({c:+.2f}%).")
lvl("Sensex", "Sensex closed at {v} ({c:+.2f}%).")
lvl("Crude WTI", "Crude (WTI) settled at {v} ({c:+.2f}%).")
lvl("S&P 500", "Wall Street’s S&P 500 ended {c:+.2f}%.")
btm = ('<div class="btm dx"><a class="bx" href="#p5" data-go="4"><small>EXPLAIN ONE THING</small><h4>'+e(ex['title'])+'</h4><p>'+e(ex['intro'])+'</p><i>Page 5 →</i></a>'
       '<div class="bx"><small>AT THE CLOSE</small><ul>'+''.join('<li>'+e(w)+'</li>' for w in watch[:3])+'</ul></div>'
       '<a class="bx bg" href="#" data-wt-sub><small>GET IT FREE</small><h4>THE 9:15, every weekday at 8:30 AM</h4><p>Get it in your inbox before the bell. Free, learning only, no tips.</p><i>Subscribe free →</i></a></div>')
teasers_unused = "".join(f'<a class="tz" href="#p{p}" data-go="{p-1}"><small>{t}</small><h4>{e(i["title"])}</h4><p>{e(short(i["summary"], 120))}</p><i>Page {p} →</i></a>' for p, t, i in inside)
p1 = (f'<div class="strip">{card("Nifty 50","NIFTY 50")}{card("Sensex","SENSEX")}{card("Bank Nifty","BANK NIFTY")}{card("Nifty IT","NIFTY IT")}</div>'
      f'<p class="stamp">{e(stamp)}</p><div class="fwrap"><div class="fmain"><small class="tag">THE LEAD</small>'
      f'<h1>{e(lead["title"])}</h1><p class="lead s-sm">{e(short(lead["summary"], 135))}</p><p class="lead s-lg dc">{e(lead["summary"])}</p>'
      f'<p class="why dx"><b>WHY IT MATTERS</b> {e(lead["why"])}</p></div>'
      f'<aside class="fside"><div class="ins"><b>INSIDE TODAY</b>'
      + "".join(f'<a href="#p{p}" data-go="{p-1}"><i>PAGE {p}</i> {e(i["title"])}</a>' for p, t, i in inside)
      + f'<a class="ex m-only" href="#p5" data-go="4"><i>PAGE 5 · EXPLAIN ONE THING</i> {e(ex["title"])}</a></div></aside></div>'
      + btm)
mast = (f'<header class="mast"><div class="m-l"><img src="/assets/logo-dark.svg" alt=""><span class="m-wt">WealthyTrees</span></div>'
        f'<div class="m-c"><small>WEALTHYTREES</small><h1 class="mh">THE 9:15</h1></div><span>{e(edno)}</span></header>'
        f'<p class="tagl">The Morning Paper — Markets, simplified. In 2 minutes.</p>')
pages = [f'<section class="pg first" id="p1" data-title="Front Page">{mast}<div class="in">{p1}</div>'
         f'<footer><span>wealthytrees.online · PAGE 1 OF 5</span><span>EDUCATION ONLY · NOT INVESTMENT ADVICE</span></footer></section>']
def stories(lst, k_show=2, first_w=True, glance_html=""):
    return '<div class="stories">' + "".join(story(i, first_w and k == 0).replace('class="sty"', 'class="sty%s"' % (" dx" if k >= k_show else ""), 1) for k, i in enumerate(lst)) + glance_html + '</div>'
pages.append(page(2, "MARKETS", "Markets", stories((eq[1:5] or eq[:1])), "Markets"))
pages.append(page(3, "INDIA &amp; ECONOMY", "India &amp; Economy", stories(ec[:3], glance_html=glance()) if ec else "<p>No economy stories today.</p>", "India & Economy"))
pages.append(page(4, "COMMODITIES &amp; WORLD", "Commodities &amp; World",
    f'<div class="strip">{card("Gold","GOLD")}{card("Crude WTI","CRUDE")}{card("USD/INR")}{card("S&P 500")}</div>'
    + stories((cm[:2] + us[:2]), 2, False), "Commodities & World"))
wa = "https://wa.me/?text=" + html.escape("THE 9:15 — The Morning Paper. Markets, simplified. In 2 minutes. https://wealthytrees.online/the915", quote=True).replace(" ", "%20")
steps = "".join(f'<div class="st"><span>{k+1}</span><div><h3>{e(s[0])}</h3><p>{e(s[1])}</p></div></div>' for k, s in enumerate(ex["steps"]))
pages.append(page(5, "EXPLAIN ONE THING", e(ex["title"]),
    f'<div class="xwrap"><div class="xl"><p class="lead">{e(ex["intro"])}</p><p class="why one"><b>THE ONE-LINE VERSION</b> {e(ex["oneline"])}</p><a class="share cta9" href="{e(ex.get("learn", "/pages/learn.html"))}">Learn this properly, free →</a> <a class="share" style="margin-top:.9rem" href="{wa}" rel="noopener">Share this paper on WhatsApp</a></div><div class="xr">{steps}</div></div>', "Explain One Thing"))
CSS = open(f"{R}/scripts/edition.css").read() + open(f"{R}/scripts/edition-desk.css").read() + open(f"{R}/scripts/tools.css").read() + open(f"{R}/scripts/mobile.css").read()
titles = ["Front Page", "Markets", "India & Economy", "Commodities & World", "Explain One Thing"]
util = ('<div class="util"><a href="/">← WealthyTrees</a><nav class="tabs9">'
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
out = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
       f'<title>THE 9:15 · {e(edno)} · WealthyTrees</title><meta name="description" content="{e(lead["title"])}. Markets, simplified. In 2 minutes.">'
       f'<link rel="icon" href="/assets/logo.svg"><link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Noto+Serif:wght@600;700&family=Playfair+Display:wght@800;900&family=Inter:wght@400;600&display=swap" rel="stylesheet">'
       f'<style>{CSS}</style></head><body>{util}<main>{"".join(pages)}</main><script>{JS}</script></body></html>')
os.makedirs(f"{R}/pages", exist_ok=True); os.makedirs(f"{R}/edition", exist_ok=True)
open(f"{R}/pages/the-915.html", "w").write(out)
open(f"{R}/edition/{now.strftime('%Y-%m-%d')}.html", "w").write(out)
print("built edition", n, now.isoformat())
