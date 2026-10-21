# WealthyTrees

WealthyTrees brings you the day's stock and commodity market news in short, clear summaries. No noise, no tips, no speculation. Built for students and new investors who want to understand the markets, not chase them.

Live site: https://wealthytrees.online (Cloudflare Pages, deployed from this repo).

## Folder guide: where each file goes
| Folder | What lives here |
|---|---|
| `/` (top level) | Only `index.html` and `404.html`, plus `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, `README.md` |
| `pages/` | All other site pages (markets, learn, beginner, intermediate, about, contact, disclaimer, privacy, terms, tools, 6 calculators) |
| `learn/beginner/`, `learn/intermediate/` | Course modules: `module-1.html` to `module-6.html` in each level |
| `css/` | All stylesheets (`style.css` is the base; `notebook.css` is the Learn look) |
| `js/` | All browser scripts (`site.js`, `quiz.js`, `notebook.js`, ...) |
| `assets/` | Logos and images |
| `data/` | Daily brief and chart data. Written by a bot: do not edit by hand |
| `functions/api/` | Cloudflare backend: `pulse.js` (Sprout AI), `headlines.js`, `quotes.js`, `health.js` |
| `scripts/` | `update_brief.py`, run daily by GitHub Actions |
| `.github/workflows/` | Automation: `daily.yml`, `keepwarm.yml`, `sitecheck.yml`, `dussehra-video-smoke.yml` |

## Contributing
1. Fork, then add or change files inside the folder that matches the table above.
2. New Learn module: copy `learn/beginner/module-6.html`, then add its card to `pages/learn.html`.
3. No financial advice. Keep content educational, with made-up example numbers, and keep one disclaimer at the end of each module.
4. Open a pull request with a short description of what changed.

## Festivals
NSE holidays live in `js/holidays.js` (update each December). Greetings live in `js/festival.js`. Preview any day with `?fest=YYYY-MM-DD`. Dussehra (20 Oct 2026) also has its own intro, ticker and rail scripts.

