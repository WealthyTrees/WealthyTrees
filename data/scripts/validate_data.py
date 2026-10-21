"""Safety check for data/charts.json. Run after update_brief.py. Exit 1 = bad data (the workflow then keeps the last good file)."""
import json, sys, datetime as dt
NEED = ["Nifty 50","Sensex","Bank Nifty","Nifty IT","Nifty Pharma","Nifty Auto","Nifty Metal","India VIX",
        "S&P 500","Nasdaq","Dow","Gold","Silver","Crude WTI","Brent","Natural Gas","Copper","USD/INR"]
MAX_JUMP = {"USD/INR": .05, "India VIX": .6, "VIX": .6}   # biggest believable one-day close change; default .40
d = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "data/charts.json", encoding="utf-8"))
bad = []
for k in NEED:
    r = d.get(k)
    if not r or len(r) < 300: bad.append(f"{k}: missing or under 300 rows"); continue
    if min(min(x["open"], x["high"], x["low"], x["close"]) for x in r) <= 0: bad.append(f"{k}: zero or negative price")
    if any(x["high"] < max(x["open"], x["close"]) * .995 or x["low"] > min(x["open"], x["close"]) * 1.005 for x in r): bad.append(f"{k}: high/low far outside open/close")
    if [x["time"] for x in r] != sorted({x["time"] for x in r}): bad.append(f"{k}: dates not in order or repeated")
    lim = MAX_JUMP.get(k, .40)
    j = max(abs(r[i]["close"] / r[i-1]["close"] - 1) for i in range(len(r) - 5, len(r)))
    if j > lim: bad.append(f"{k}: last 5 days jump {j:.0%} (limit {lim:.0%})")
    age = (dt.date.today() - dt.date.fromisoformat(r[-1]["time"])).days
    if age > 7: bad.append(f"{k}: newest candle is {age} days old")
print("\n".join(bad) if bad else f"charts.json OK ({len(NEED)} charts)")
sys.exit(1 if bad else 0)
