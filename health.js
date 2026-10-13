// Cloudflare Pages Function: /api/health
// One page that tells you if the news side of the site is healthy. Open it, read the first line.
// Shows no keys or secrets.
import { getHeadlines } from "./headlines.js";

export async function onRequestGet(ctx) {
  const env = ctx.env || {}, kv = env.PULSE;
  const out = { overall: "CHECK", problems: [] };
  let book = null, err = null;
  try { book = kv ? JSON.parse((await kv.get("pulse:v2")) || "null") : null; } catch (e) {}
  try { err = kv ? JSON.parse((await kv.get("pulse:lasterr")) || "null") : null; } catch (e) {}
  const age = book && book.at ? Math.round((Date.now() - book.at) / 60000) : null;
  out.sprout = { storedStories: book && book.stories ? book.stories.length : 0, ageMinutes: age, writtenBy: book && book.engine ? book.engine : "unknown",
    lastError: err ? err.m + " (" + Math.round((Date.now() - err.at) / 60000) + " min ago)" : "none since last success" };
  let n = 0;
  try { n = (await getHeadlines(null, env)).length; } catch (e) {}
  out.headlinesAvailable = n;
  if (!kv) out.problems.push("Storage (PULSE) is not connected");
  if (!env.GEMINI_API_KEY && !(env.AI && env.AI.run)) out.problems.push("No AI is connected (need GEMINI_API_KEY or the AI binding)");
  if (age === null) out.problems.push("Sprout has no stored stories yet");
  else if (age > 90) out.problems.push("Sprout's stories are " + age + " minutes old (should be under about 50)");
  if (n < 5) out.problems.push("Only " + n + " headlines are coming in");
  if (!out.problems.length) out.overall = "ALL GOOD";
  out.checkedAt = new Date().toISOString();
  return new Response(JSON.stringify(out, null, 1), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
}
