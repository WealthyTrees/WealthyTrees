(function(){
var BD='arorapriyansh',K='wt915:'+((document.title.split('·')[1])||'').trim(),S={};
try{S=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
var pgs=[].slice.call(document.querySelectorAll('.pg')),tool='',col='#1d4ed8',H={},dm=matchMedia('(min-width:900px)');
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
function draw(p){var c=p._c,W=p.offsetWidth,h=p.offsetHeight;if(!W||!h)return;var r=Math.min(window.devicePixelRatio||1,2);
if(c.width!==Math.round(W*r)||c.height!==Math.round(h*r)){c.width=Math.round(W*r);c.height=Math.round(h*r)}
var x=c.getContext('2d');x.setTransform(r,0,0,r,0,0);x.clearRect(0,0,W,h);x.lineCap=x.lineJoin='round';
(S[p.id]||[]).forEach(function(s){x.beginPath();s.p.forEach(function(q,i){var X=q[0]*W,Y=q[1]*h;if(!i)x.moveTo(X,Y);else x.lineTo(X,Y)});
if(s.p.length==1)x.lineTo(s.p[0][0]*W+.01,s.p[0][1]*h);x.strokeStyle=s.c;x.lineWidth=s.w;x.globalAlpha=s.t=='h'?.38:1;x.stroke()});x.globalAlpha=1}
function snap(p){(H[p.id]=H[p.id]||[]).push(JSON.stringify(S[p.id]||[]));if(H[p.id].length>40)H[p.id].shift()}
pgs.forEach(function(p){var c=document.createElement('canvas');c.className='ink';p.appendChild(c);p._c=c;
if(window.ResizeObserver)new ResizeObserver(function(){draw(p)}).observe(p);
var cur=null,er=false;
function pt(e){var b=c.getBoundingClientRect();return[(e.clientX-b.left)/b.width,(e.clientY-b.top)/b.height]}
function erase(e){var b=c.getBoundingClientRect(),q=pt(e),a=S[p.id]||[],n=a.filter(function(s){return!s.p.some(function(z){var dx=(z[0]-q[0])*b.width,dy=(z[1]-q[1])*b.height;return dx*dx+dy*dy<300})});if(n.length!==a.length){S[p.id]=n;draw(p)}}
c.addEventListener('pointerdown',function(e){if(!tool)return;e.preventDefault();c.setPointerCapture(e.pointerId);snap(p);
if(tool=='e'){er=true;erase(e);return}
cur={t:tool,c:tool=='h'?'#ffd400':col,w:tool=='h'?18:2.4,p:[pt(e)]};(S[p.id]=S[p.id]||[]).push(cur);draw(p)});
var q=0;function sc(){if(q)return;q=requestAnimationFrame(function(){q=0;draw(p)})}
c.addEventListener('pointermove',function(e){if(er){erase(e);return}if(!cur)return;cur.p.push(pt(e));sc()});
function up(){if(cur||er){save()}cur=null;er=false}
c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up)});
function all(){pgs.forEach(draw)}
window.addEventListener('resize',all);window.addEventListener('load',all);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(all);
function act(){if(dm.matches)return document.querySelector('.pg.on')||pgs[0];var m=innerHeight/2,r=null;pgs.forEach(function(p){var b=p.getBoundingClientRect();if(b.top<=m&&b.bottom>=m)r=p});return r||pgs[0]}
var T=document.createElement('div');T.className='tools';T.id='tl';
T.innerHTML='<button class="tl-m" data-a="m">\u270e Mark</button><button class="tl-d on" data-t="">Read</button><button class="tl-x" data-t="h">Highlight</button><button class="tl-x" data-t="p">Pen</button>'+
'<button class="sw tl-d on" data-c="#1d4ed8" style="background:#1d4ed8" aria-label="Blue ink"></button><button class="sw tl-d" data-c="#dc2626" style="background:#dc2626" aria-label="Red ink"></button><button class="sw tl-d" data-c="#111111" style="background:#111" aria-label="Black ink"></button>'+
'<button class="tl-x" data-t="e">Eraser</button><i class="tl-d"></i><button class="tl-x" data-a="u">Undo</button><button class="tl-d" data-a="c">Clear page</button><button class="tl-d" data-a="p">Print</button>';
var u=document.querySelector('.util'),ar=u.querySelector('.arr');u.insertBefore(T,ar);
T.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
if(b.hasAttribute('data-t')){tool=b.getAttribute('data-t');document.body.classList.toggle('tool',!!tool);[].forEach.call(T.querySelectorAll('[data-t]'),function(x){x.classList.toggle('on',x===b)});if(tool=='p'||tool=='')return;return}
if(b.hasAttribute('data-c')){col=b.getAttribute('data-c');[].forEach.call(T.querySelectorAll('.sw'),function(x){x.classList.toggle('on',x===b)});var pb=T.querySelector('[data-t="p"]');pb.click();return}
var a=b.getAttribute('data-a'),p=act();
if(a=='m'){var o=!T.classList.contains('open');T.classList.toggle('open',o);b.textContent=o?'Done':'\u270e Mark';tool=o?'h':'';document.body.classList.toggle('tool',o);[].forEach.call(T.querySelectorAll('[data-t]'),function(x){x.classList.toggle('on',x.getAttribute('data-t')===tool)});return}
if(a=='u'){var h=H[p.id];if(h&&h.length){S[p.id]=JSON.parse(h.pop());save();draw(p)}}
if(a=='c'){snap(p);S[p.id]=[];save();draw(p)}
if(a=='p')window.print()});
function sub(){if(document.getElementById('wt-sub'))return;var u=encodeURIComponent(BD),d=document.createElement('div');d.id='wt-sub';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
d.innerHTML='<div class="b"><button class="x" type="button" aria-label="Close">\u00d7</button><div style="font-size:2rem">\ud83c\udf31</div><h2>Get THE 9:15 free</h2><p>One short, clear email every weekday at 8:30 AM: what moved the markets and the concept behind it. Learning only, no tips.</p><form action="https://buttondown.com/api/emails/embed-subscribe/'+u+'" method="post" target="popupwindow"><input type="email" name="email" placeholder="Your email" aria-label="Email address" required><button class="go" type="submit">Subscribe</button></form><small>Free. Unsubscribe anytime. Education only, not investment advice.</small></div>';
function close(){d.remove();document.removeEventListener('keydown',esc)}function esc(e){if(e.key==='Escape')close()}
d.addEventListener('click',function(e){if(e.target===d||e.target.className==='x')close()});
d.querySelector('form').addEventListener('submit',function(){window.open('https://buttondown.com/'+u,'popupwindow');setTimeout(close,400)});
document.addEventListener('keydown',esc);document.body.appendChild(d)}
document.addEventListener('click',function(e){var t=e.target.closest('[data-wt-sub]');if(t){e.preventDefault();sub()}});
var nv=document.querySelector('.tabs9'),cb=[].slice.call(nv.querySelectorAll('button'));
nv.addEventListener('click',function(e){var b=e.target.closest('button[data-go]');if(!b||dm.matches)return;pgs[+b.getAttribute('data-go')].scrollIntoView({behavior:'smooth',block:'start'})});
if(window.IntersectionObserver){var io=new IntersectionObserver(function(es){if(dm.matches)return;es.forEach(function(en){if(!en.isIntersecting)return;var k=pgs.indexOf(en.target);cb.forEach(function(x,i){x.classList.toggle('on',i===k)});var b=cb[k];nv.scrollTo({left:Math.max(0,nv.scrollLeft+b.getBoundingClientRect().left-nv.getBoundingClientRect().left-(nv.clientWidth-b.offsetWidth)/2),behavior:'smooth'})})},{rootMargin:'-45% 0px -50% 0px'});pgs.forEach(function(p){io.observe(p)})}
var L=document.querySelector('a.cta9');if(L){var pf=function(){if(L._d)return;L._d=1;var l=document.createElement('link');l.rel='prefetch';l.href=L.getAttribute('href');document.head.appendChild(l)};setTimeout(pf,800);L.addEventListener('pointerenter',pf);L.addEventListener('touchstart',pf,{passive:true})}
})();
