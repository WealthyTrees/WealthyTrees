const $=id=>document.getElementById(id);
function spark(v,up){const w=200,h=44,mn=Math.min(...v),mx=Math.max(...v),r=mx-mn||1;
const p=v.map((y,i)=>(i*w/(v.length-1)).toFixed(1)+','+(h-4-(y-mn)/r*(h-8)).toFixed(1)).join(' ');
return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${p}" fill="none" stroke="${up?'#0f8a5f':'#d64b3a'}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`}
fetch('/data/brief.json').then(r=>r.json()).then(d=>{
  $('date').textContent=d.date.replace(/,\s*\d{1,2}:\d{2}\s*[AP]M IST$/,'');
  const t=d.ticker.map(x=>`<span data-n="${x.name}"><b>${x.name}</b><i class="v">${x.value}</i> <span class="c ${x.change>=0?'up':'dn'}">${x.change>=0?'▲':'▼'} ${Math.abs(x.change).toFixed(2)}%</span></span>`).join('');
  $('track').innerHTML=t+t;
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

const FMT={'CRUDE WTI':v=>'$'+v.toFixed(1),'USD/INR':v=>v.toFixed(2)};
const fmt=(n,v)=>(FMT[n]||(x=>x.toLocaleString('en-US',{maximumFractionDigits:0})))(v);
function refresh(){if(document.hidden)return;
  fetch('/api/quotes').then(r=>r.json()).then(j=>{Object.entries(j.quotes||{}).forEach(([n,q])=>{
    if(!q.price||!q.prev)return;const ch=(q.price-q.prev)/q.prev*100;
    document.querySelectorAll('#track [data-n]').forEach(e=>{if(e.dataset.n!==n)return;
      e.querySelector('.v').textContent=fmt(n,q.price);const c=e.querySelector('.c');
      c.className='c '+(ch>=0?'up':'dn');c.textContent=(ch>=0?'▲ ':'▼ ')+Math.abs(ch).toFixed(2)+'%'})})}).catch(()=>{})}
setInterval(refresh,60000);setTimeout(refresh,2500);
