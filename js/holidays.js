/* WealthyTrees holidays.js v1: NSE equity trading holidays 2026 (from nseindia.com/resources/exchange-communication-holidays). Update each December. */
(function () {
  var T = { "2026-01-26": "Republic Day", "2026-03-03": "Holi", "2026-03-26": "Shri Ram Navami", "2026-03-31": "Shri Mahavir Jayanti", "2026-04-03": "Good Friday", "2026-04-14": "Dr. Baba Saheb Ambedkar Jayanti", "2026-05-01": "Maharashtra Day", "2026-05-28": "Bakri Id", "2026-06-26": "Muharram", "2026-09-14": "Ganesh Chaturthi", "2026-10-02": "Mahatma Gandhi Jayanti", "2026-10-20": "Dussehra", "2026-11-10": "Diwali-Balipratipada", "2026-11-24": "Prakash Gurpurb Sri Guru Nanak Dev", "2026-12-25": "Christmas" };
  var W = { "2026-02-15": "Mahashivratri", "2026-03-21": "Id-Ul-Fitr (Ramadan Eid)", "2026-08-15": "Independence Day", "2026-11-08": "Diwali Laxmi Pujan" };
  var C = { "2026-03-19": "Gudi Padwa" }; /* clearing-only holidays: trading open, settlement closed */
  function ist(d) { var p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(d || new Date()); return p; }
  window.WT_HOL = { trading: T, weekend: W, clearing: C, muhurat: "2026-11-08", ist: ist,
    today: function () { var k = ist(); return T[k] ? { name: T[k], kind: "closed" } : k === "2026-11-08" ? { name: W[k], kind: "muhurat" } : C[k] ? { name: C[k], kind: "clearing" } : null; },
    next: function () { var k = ist(), a = Object.keys(T).filter(function (d) { return d > k; }).sort()[0]; return a ? { date: a, name: T[a] } : null; } };
  try { window.dispatchEvent(new Event("wt-holidays")); } catch (e) {}
})();
