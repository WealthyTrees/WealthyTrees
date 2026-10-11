const $=id=>document.getElementById(id);
function spark(v,up){const w=200,h=44,mn=Math.min(...v),mx=Math.max(...v),r=mx-mn||1;
const p=v.map((y,i)=>(i*w/(v.length-1)).toFixed(1)+','+(h-4-(y-mn)/r*(h-8)).toFixed(1)).join(' ');
return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${p}" fill="none" stroke="${up?'#0f8a5f':'#d64b3a'}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`}
fetch('/data/brief.json').then(r=>r.json()).then(d=>{
  $('date').textContent='Latest brief: '+d.date+' (updates 4 times a day)';
  const t=d.ticker.map(x=>`<span><b>${x.name}</b>${x.value} <span class="${x.change>=0?'up':'dn'}">${x.change>=0?'▲':'▼'} ${Math.abs(x.change).toFixed(2)}%</span></span>`).join('');
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
