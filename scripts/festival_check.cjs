/* WealthyTrees festival-day check. Pretends it is the festival day (India time) and checks that
   everything prepared plays, and that nothing festive shows on a normal day.
   Run: BASE=https://wealthytrees.online node scripts/festival_check.cjs   (SKIP_PLAY=1 skips video playback checks) */
const { chromium } = require(process.env.PW_PATH || 'playwright');
const BASE = (process.env.BASE || 'https://wealthytrees.online').replace(/\/$/, '');
const SKIP_PLAY = process.env.SKIP_PLAY === '1';
const FEST = process.env.FEST_TIME || '2026-10-20T05:00:00Z';   // 10:30 am India time, festival day
const NORMAL = process.env.NORMAL_TIME || '2026-10-21T05:00:00Z'; // the next day
const clock = iso => `(()=>{const T=new Date('${iso}').getTime(),R=Date,O=T-R.now();class D extends R{constructor(...a){a.length?super(...a):super(R.now()+O)}static now(){return R.now()+O}}window.Date=D})();`;
const results = [];
async function check(name, fn) {
  try { await fn(); results.push({ name, ok: true }); console.log('PASS  ' + name); }
  catch (e) { results.push({ name, ok: false, why: String(e.message || e).split('\n')[0] }); console.log('FAIL  ' + name + '  ->  ' + String(e.message || e).split('\n')[0]); }
}
async function open(browser, iso, opts, path) {
  const ctx = await browser.newContext(opts);
  await ctx.addInitScript(clock(iso));
  if (process.env.MOCK_API) await ctx.route('**/api/pulse*', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ ai: true, lead: '', stories: [{ topic: 'Markets', title: 'Test story', hook: 'Test hook', summary: 'Test summary' }] }) })); /* local testing only */
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(BASE + (path || '/'), { waitUntil: 'domcontentloaded', timeout: 45000 });
  return { ctx, page, errors };
}
async function skipIntro(page) {
  await page.locator('#wt-dussehra-intro').waitFor({ state: 'visible', timeout: 20000 });
  await page.locator('#wt-dussehra-intro .wt-skip').click({ timeout: 20000 });
  await page.locator('#wt-dussehra-intro').waitFor({ state: 'detached', timeout: 8000 });
}
async function editionChecks(page, label) {
  await page.locator('#t-ed').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('#t-ed').click();
  const first = page.locator('#p-ed .sl').first();
  await first.waitFor({ state: 'attached', timeout: 15000 });
  if (!(await first.getAttribute('class')).includes('sfestival')) throw new Error(label + ': festival video is not the first Daily Edition slide');
  const v = page.locator('#p-ed .ed-greeting-video'); await v.waitFor({ state: 'visible', timeout: 30000 });
  const m = await page.evaluate(() => { const c = document.querySelector('#p-ed .story').getBoundingClientRect(), v = document.querySelector('#p-ed .ed-greeting-video').getBoundingClientRect(); return { cw: c.width, ch: c.height, vw: v.width, vh: v.height }; });
  if (Math.abs(m.cw / m.ch - 9 / 16) > 0.03) throw new Error(label + ': card is not phone-shaped (9:16): ' + JSON.stringify(m));
  if (Math.abs(m.vw - m.cw) > 3 || Math.abs(m.vh - m.ch) > 3) throw new Error(label + ': video does not fill the card: ' + JSON.stringify(m));
  if (!SKIP_PLAY) await page.waitForFunction(() => { const x = document.querySelector('#p-ed .ed-greeting-video'); return x && !x.paused && x.currentTime > 2 && x.videoWidth > 0; }, null, { timeout: 30000 }).catch(() => { throw new Error(label + ': greeting video does not play'); });
  if (await v.evaluate(x => x.controls)) throw new Error(label + ': video shows native controls');
  const b = page.locator('#p-ed .festival-edition-badge'); await b.waitFor({ state: 'visible', timeout: 5000 });
  const hb = await page.locator('#p-ed .shead.is-festival').boundingBox(), bb = await b.boundingBox();
  if (bb.x < hb.x - 1 || bb.x + bb.width > hb.x + hb.width + 1) throw new Error(label + ': festival badge spills out of the header');
}
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [label, opts] of [['Desktop', { viewport: { width: 1440, height: 900 } }], ['Phone', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }]]) {
      const { ctx, page, errors } = await open(browser, FEST, opts);
      await check(`${label}: intro curtain appears on festival day and can be skipped`, () => skipIntro(page));
      await check(`${label}: festive ticker stays on the page`, async () => { await page.locator('.wt-dussehra-sequence').first().waitFor({ state: 'attached', timeout: 10000 }); });
      await check(`${label}: Live Wire Sprout says Happy Dussehra`, async () => { await page.waitForFunction(() => /Happy Dussehra/.test((document.querySelector('.sp-say') || {}).textContent || ''), null, { timeout: 25000 }); });
      await check(`${label}: Daily Edition greeting video fits, plays and tap works`, () => editionChecks(page, label));
      await check(`${label}: no browser errors on the home page`, async () => { if (errors.length) throw new Error(errors.slice(0, 2).join(' | ')); });
      await ctx.close();
    }
    for (const p of ['/markets.html', '/learn.html', '/about.html']) {
      const { ctx, page, errors } = await open(browser, FEST, { viewport: { width: 390, height: 844 } }, p);
      await check(`Festival day: ${p} loads without errors or a blocking intro`, async () => { await page.waitForTimeout(3500); if (await page.locator('#wt-dussehra-intro').count()) throw new Error('intro covers this page'); if (errors.length) throw new Error(errors.slice(0, 2).join(' | ')); });
      await ctx.close();
    }
    { const { ctx, page, errors } = await open(browser, NORMAL, { viewport: { width: 1280, height: 800 } });
      await check('Normal day: no festival intro, ticker or festival edition', async () => {
        await page.waitForTimeout(5000);
        if (await page.locator('#wt-dussehra-intro').count()) throw new Error('festival intro shows on a normal day');
        if (await page.locator('.wt-dussehra-sequence').count()) throw new Error('festival ticker shows on a normal day');
        if (await page.locator('.sl.sfestival').count()) throw new Error('festival edition slide shows on a normal day');
        const say = await page.locator('.sp-say').first().textContent().catch(() => '');
        if (/Dussehra/.test(say || '')) throw new Error('Dussehra wish shows on a normal day');
        if (errors.length) throw new Error(errors.slice(0, 2).join(' | '));
      });
      await ctx.close(); }
    await check('Festival video files are online', async () => {
      const ctx = await browser.newContext();
      for (const f of ['dussehra-intro.mp4', 'dussehra-greeting.mp4', 'dussehra-greeting-poster.svg']) { const r = await ctx.request.get(`${BASE}/assets/${f}`); if (r.status() !== 200) throw new Error(f + ' returned ' + r.status()); }
      await ctx.close(); });
  } finally { await browser.close(); }
  const bad = results.filter(r => !r.ok);
  console.log(`\n${results.length - bad.length} of ${results.length} festival checks passed.`);
  if (bad.length) { console.log('PROBLEMS TO FIX:'); bad.forEach(b => console.log(' - ' + b.name + ': ' + b.why)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
