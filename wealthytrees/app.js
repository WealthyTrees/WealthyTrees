fetch('/data/brief.json').then(r=>r.json()).then(d=>{
  document.getElementById('date').textContent=d.date;
  const box=document.getElementById('brief');
  d.items.forEach(i=>{
    const a=document.createElement('article');a.className='item';
    const t=document.createElement('span');t.className='tag '+i.category.toLowerCase();t.textContent=i.category;
    const h=document.createElement('h3');h.textContent=i.title;
    const s=document.createElement('p');s.textContent=i.summary;
    const w=document.createElement('p');w.className='why';w.textContent='Why it matters: '+i.why;
    const l=document.createElement('a');l.className='src';l.href=i.url;l.rel='noopener';l.textContent='Source: '+i.source;
    a.append(t,h,s,w,l);box.append(a);
  });
}).catch(()=>{document.getElementById('date').textContent='Brief unavailable. Please check back soon.'});
