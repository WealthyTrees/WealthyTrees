const $=id=>document.getElementById(id);
function spark(v,up){const w=200,h=44,mn=Math.min(...v),mx=Math.max(...v),r=mx-mn||1;
const p=v.map((y,i)=>(i*w/(v.length-1)).toFixed(1)+','+(h-4-(y-mn)/r*(h-8)).toFixed(1)).join(' ');
return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${p}" fill="none" stroke="${up?'#0f8a5f':'#d64b3a'}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`}
fetch('/data/brief.json').then(r=>r.json()).then(d=>{
  $('date').textContent=d.date.replace(/,\s*\d{1,2}:\d{2}\s*[AP]M IST$/,'');
  window.__tkBrief=d.ticker;tkFallback();if(false){const t=d.ticker.map(x=>`<span class="tk"><b>${x.name}</b><i class="v">${x.value}</i><span class="c ${x.change>=0?'up':'dn'}">${x.change>=0?'▲':'▼'} ${Math.abs(x.change).toFixed(2)}%</span></span>`).join('');$('track').innerHTML=t+t;}
  const cats=['All',...new Set(d.items.map(i=>i.category))];
  if(cats.length>2){const bar=document.createElement('div');bar.className='chips';bar.setAttribute('role','group');
    cats.forEach(c=>{const b=document.createElement('button');b.className='chip';b.textContent=c;b.setAttribute('aria-pressed',c==='All');
      b.onclick=()=>{bar.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
        document.querySelectorAll('#grid .item').forEach(a=>{a.hidden=!(c==='All'||a.dataset.cat===c)})};bar.append(b)});
    $('grid').before(bar)}
  d.items.forEach(i=>{
    const a=document.createElement('article');a.className='item';a.dataset.cat=i.category;
    const s=i.spark?spark(i.spark,i.spark[i.spark.length-1]>=i.spark[0]):'';
    a.innerHTML=`<span class="tag ${i.category.toLowerCase()}"></span><h3></h3><p></p><p class="why"></p>${s}<a class="src" rel="noopener"></a>`;
    a.querySelector('.tag').textContent=i.category;a.querySelector('h3').textContent=i.title;
    a.querySelector('p').textContent=i.summary;a.querySelector('.why').textContent='Why it matters: '+i.why;
    const l=a.querySelector('.src');l.href=i.url;l.textContent='Source: '+i.source;$('grid').append(a);
  });
}).catch(()=>{$('date').textContent='Brief unavailable. Please check back soon.'});

/* Market bar (NSE style). Shows one group by time of day, in IST:
   India indices 6:00 AM to 3:30 PM, commodities from 3:30 PM until the US market opens, US indices from the US open until 6:00 AM. */
const GRP={IN:['NIFTY 50','SENSEX','BANK NIFTY','NIFTY IT','NIFTY PHARMA','NIFTY AUTO','NIFTY METAL','INDIA VIX'],
  CM:['GOLD $/oz','SILVER $/oz','CRUDE WTI','BRENT','NATURAL GAS','COPPER','USD/INR'],
  US:['S&P 500','NASDAQ','DOW']};
function tzp(tz){const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:tz,weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
  return{wk:p.weekday==='Sat'||p.weekday==='Sun',m:(+p.hour)*60+(+p.minute)}}
function phase(){const i=tzp('Asia/Kolkata'),e=tzp('America/New_York');
  if(!e.wk&&e.m>=570&&e.m<960)return{g:'US',n:'US markets',s:'LIVE',live:1};
  if(i.wk)return{g:'IN',n:'India · Weekend',s:'MARKETS CLOSED · LAST CLOSE'};
  if(i.m>=360&&i.m<930)return i.m>=555?{g:'IN',n:'India',s:'LIVE',live:1}:{g:'IN',n:'India',s:'PRE-OPEN'};
  if(i.m>=930)return{g:'CM',n:'Commodities',s:'FUTURES',live:1};
  return{g:'US',n:'US markets',s:'LAST CLOSE'}}
const CMAP={'NIFTY 50':'Nifty 50','SENSEX':'Sensex','BANK NIFTY':'Bank Nifty','NIFTY IT':'Nifty IT','NIFTY AUTO':'Nifty Auto','NIFTY FMCG':'Nifty FMCG','NIFTY PHARMA':'Nifty Pharma','NIFTY METAL':'Nifty Metal','INDIA VIX':'India VIX','S&P 500':'S&P 500','NASDAQ':'Nasdaq','DOW':'Dow','RUSSELL 2000':'Russell 2000','VIX':'VIX','GOLD $/oz':'Gold','SILVER $/oz':'Silver','CRUDE WTI':'Crude WTI','BRENT':'Brent','NATURAL GAS':'Natural Gas','COPPER':'Copper','USD/INR':'USD/INR'};
const FM={'CRUDE WTI':2,'BRENT':2,'GOLD $/oz':2,'SILVER $/oz':2,'NATURAL GAS':3,'COPPER':3,'USD/INR':2};
const fmt=(n,v,g)=>v.toLocaleString(g==='IN'?'en-IN':'en-US',{minimumFractionDigits:FM[n]||2,maximumFractionDigits:FM[n]||2});
let QS={};
function tkRender(){const tkr=$('ticker');if(tkr&&tkr.classList.contains('wt-dussehra-festival'))return;const ph=phase();if(ph.g==='IN'&&window.WT_HOL){const H=WT_HOL.today();if(H&&H.kind==='closed'){ph.s='HOLIDAY · '+H.name;ph.live=0}else if(H&&H.kind==='muhurat'){ph.s='MUHURAT DAY';ph.live=0}}const names=GRP[ph.g].filter(n=>QS[n]&&QS[n].price&&QS[n].prev);if(!names.length)return;
  window.__tkLive=1;const tk=$('ticker');tk.classList.toggle('live',!!ph.live);$('tkname').textContent=ph.n;$('tkstat').textContent=ph.s;
  const h=names.map(n=>{const q=QS[n],d=q.price-q.prev,p=d/q.prev*100,up=d>=0;
    const ck=CMAP[n],tg=ck?'a':'span',hr=ck?` href="/markets.html?i=${encodeURIComponent(ck)}#charts" title="Open ${ck} chart"`:'';return `<${tg} class="tk ${up?'u':'d'}" data-n="${n}"${hr} style="color:inherit;text-decoration:none"><b>${n}</b><i class="v">${fmt(n,q.price,ph.g)}</i><span class="c ${up?'up':'dn'}">${up?'▲':'▼'} ${Math.abs(d).toFixed(2)} (${Math.abs(p).toFixed(2)}%)</span></${tg}>`}).join('');
  const t=$('track'),sig=ph.g+names.join('|');
  if(t.dataset.sig===sig){const rows=[...t.children];rows.forEach((el,i)=>{const n=names[i%names.length],q=QS[n],d=q.price-q.prev,p=d/q.prev*100,up=d>=0;el.className='tk '+(up?'u':'d');el.querySelector('.v').textContent=fmt(n,q.price,ph.g);const c=el.querySelector('.c');c.className='c '+(up?'up':'dn');c.textContent=`${up?'▲':'▼'} ${Math.abs(d).toFixed(2)} (${Math.abs(p).toFixed(2)}%)`})}
  else{t.innerHTML=h+h;t.dataset.sig=sig;t.style.setProperty('--dur',Math.max(32,names.length*7)+'s')}}
function tkFallback(){const tkr=$('ticker');if(tkr&&tkr.classList.contains('wt-dussehra-festival'))return;if(window.__tkLive||!window.__tkBrief||!window.__tkDone)return;const d=window.__tkBrief,t=d.map(x=>`<span class="tk"><b>${x.name}</b><i class="v">${x.value}</i><span class="c ${x.change>=0?'up':'dn'}">${x.change>=0?'▲':'▼'} ${Math.abs(x.change).toFixed(2)}%</span></span>`).join('');$('track').innerHTML=t+t;$('track').dataset.sig='brief'}
function refresh(){if(document.hidden&&window.__tkLive)return;
  fetch('/api/quotes').then(r=>r.json()).then(j=>{QS=j.quotes||{};tkRender();window.__tkDone=1;tkFallback()}).catch(()=>{window.__tkDone=1;tkFallback()})}
setTimeout(()=>{window.__tkDone=1;tkFallback()},4000);
setInterval(refresh,60000);refresh();window.addEventListener('wt-holidays',()=>{if(Object.keys(QS).length)tkRender()});

/* Newsroom: tabs (Live Wire lives in wire.js) */
const tabs=[['t-live','p-live'],['t-brief','p-brief']];
tabs.forEach(([t,p])=>$(t).addEventListener('click',()=>{tabs.forEach(([t2,p2])=>{const on=t2===t;$(t2).setAttribute('aria-selected',on);$(p2).hidden=!on})}));
