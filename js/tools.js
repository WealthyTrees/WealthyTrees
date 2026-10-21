window.TH={fv:function(a,r,y,s){var i=r/1200,val=0,pay=a;for(var m=1;m<=y*12;m++){if(m>1&&(m-1)%12==0)pay*=1+(s||0)/100;val=(val+pay)*(1+i)}return val},
req:function(g,r,y){var i=r/1200,n=y*12;return g/(((Math.pow(1+i,n)-1)/i)*(1+i))},
yrsTo:function(a,r,g){var i=r/1200,val=0,m=0;while(val<g&&m<960){val=(val+a)*(1+i);m++}return m/12},
emi:function(P,r,y){var i=r/1200,n=y*12;return P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1)}};
(function(){
var T=window.TOOL,app=document.getElementById('app');if(!T||!app)return;
var F={inr:function(n){n=Math.round(n);var a=Math.abs(n),s=n<0?'-':'';if(a>=1e7)return s+'\u20B9'+(a/1e7).toFixed(2)+' Cr';if(a>=1e5)return s+'\u20B9'+(a/1e5).toFixed(2)+' L';return s+'\u20B9'+a.toLocaleString('en-IN')},
 pct:function(n){return(+n.toFixed(2))+'%'},yr:function(n){n=+n.toFixed(1);return n+(n==1?' yr':' yrs')},x:function(n){return n.toFixed(1)+'x'}};
T.F=F;var v={},q=new URLSearchParams(location.search);
T.inputs.forEach(function(d){var x=parseFloat(q.get(d.k));v[d.k]=isFinite(x)&&x>=d.min&&x<=d.max?x:d.val});
var h='<div class="tt-hero"><div class="tt-sprout" id="sp">\uD83C\uDF31</div><div class="tt-bubble" id="bub"></div></div><div class="tt-grid"><div class="tt-card" id="in"><h2 class="hw">Play with the sliders</h2>';
T.inputs.forEach(function(d){h+='<div class="tt-f"><label for="i_'+d.k+'">'+d.label+' <output id="o_'+d.k+'"></output></label><input id="i_'+d.k+'" type="range" min="'+d.min+'" max="'+d.max+'" step="'+d.step+'" value="'+v[d.k]+'"></div>'});
h+='</div><div class="tt-card" aria-live="polite"><div id="ml"></div><div class="tt-big" id="mv"></div><div id="rows"></div><div class="tt-btns"><button class="tt-btn" id="wa">Share on WhatsApp</button><button class="tt-btn ghost" id="cp">Copy my link</button></div></div></div>';
h+='<div class="tt-card"><h2 class="hw">Watch it grow</h2><div class="tt-tip" id="bt"></div><div class="tt-bars" id="bars"></div><div class="tt-axis"><span>Year 1</span><span id="ax"></span><span id="ay"></span></div><div class="tt-leg" id="lg"></div></div>';
h+='<div class="tt-card"><h2 class="hw">Play with the formula</h2><p style="margin:.1rem 0 .4rem;color:var(--mute);font-size:.9rem">Tap the dashed boxes to see what each part means.</p><div class="tt-fm" id="fm"></div><div class="tt-plug" id="pl"></div><div class="tt-exp" id="ex"></div></div>';
h+='<div class="tt-card tt-q"><h2 class="hw">Questions investors ask</h2><div id="qa"></div></div>';
h+='<div class="tt-note"><h2 class="hw">Sprout\'s notebook</h2><ul>'+T.notes.map(function(n){return'<li>'+n+'</li>'}).join('')+'</ul></div>';
app.innerHTML=h;
function $(i){return document.getElementById(i)}
var cur=null,r=null,act=null;
function fmtv(k,x){return(F[k]||F.inr)(x)}
function fm(){var s=T.formula.replace(/\{(\w+)\}/g,function(m,k){return'<button class="chip'+(act==k?' on':'')+'" data-k="'+k+'">'+k+'</button>'});$('fm').innerHTML=s;
 $('pl').innerHTML='Your numbers: '+T.formula.replace(/\{(\w+)\}/g,function(m,k){return'<em>'+T.terms[k].g(v,r)+'</em>'});
 var t=act&&T.terms[act];$('ex').innerHTML=t?'<b>'+act+' = '+t.n+'</b> \u2192 now <b>'+t.g(v,r)+'</b>. '+t.tip:'Tap any letter above \u261D'}
function bars(){var s=r.series,mx=0;s.forEach(function(a){mx=Math.max(mx,a[1])});var o='';
 s.forEach(function(a,i){var hh=a[1]/mx*100,p=a[1]>0?a[0]/a[1]*100:0;o+='<div data-i="'+i+'" style="height:'+hh+'%"><b style="height:'+(100-p)+'%"></b><i style="height:'+p+'%"></i></div>'});
 $('bars').innerHTML=o;$('ax').textContent='Year '+Math.ceil(s.length/2);$('ay').textContent='Year '+s.length;tip(s.length-1)}
function tip(i){var a=r.series[i];$('bt').textContent='Year '+(i+1)+': '+T.legend[0]+' '+F.inr(a[0])+' \u00B7 '+T.legend[1]+' '+F.inr(a[1]-a[0])+' \u00B7 total '+F.inr(a[1]);
 var c=$('bars').children;for(var j=0;j<c.length;j++)c[j].className=j==i?'on':''}
function qa(){var o=$('qa'),open={};[].forEach.call(o.querySelectorAll('details'),function(d,i){if(d.open)open[i]=1});
 o.innerHTML=T.qa.map(function(x,i){return'<details'+(open[i]?' open':'')+'><summary>'+x.q+'</summary><div class="a">'+x.a(v,r)+(x.set?'<div><button class="tt-btn ghost try" data-i="'+i+'">Try it in the sliders</button></div>':'')+'</div></details>'}).join('')}
function run(){T.inputs.forEach(function(d){$('o_'+d.k).textContent=fmtv(d.f,v[d.k])});
 r=T.compute(v);var m=T.main(r);$('ml').textContent=m[0];$('mv').textContent=fmtv(m[2],m[1]);
 $('rows').innerHTML=r.rows.map(function(x){return'<div class="tt-row"><span>'+x[0]+'</span><b>'+fmtv(x[2],x[1])+'</b></div>'}).join('');
 $('bub').textContent=r.story;var st=r.ratio<1.6?0:r.ratio<2.6?1:r.ratio<4.5?2:3;$('sp').textContent=['\uD83C\uDF31','\uD83C\uDF3F','\uD83C\uDF33','\uD83C\uDF34'][st];
 bars();fm();qa();var p=new URLSearchParams();T.inputs.forEach(function(d){p.set(d.k,v[d.k])});try{history.replaceState(null,'','?'+p)}catch(e){}}
T.inputs.forEach(function(d){$('i_'+d.k).addEventListener('input',function(e){v[d.k]=+e.target.value;run()})});
$('lg').innerHTML='<span>'+T.legend[0]+'</span><span>'+T.legend[1]+'</span>';
$('bars').addEventListener('click',function(e){var t=e.target.closest('[data-i]');if(t)tip(+t.getAttribute('data-i'))});
$('fm').addEventListener('click',function(e){var c=e.target.closest('.chip');if(c){act=c.getAttribute('data-k');fm()}});
$('qa').addEventListener('click',function(e){var b=e.target.closest('.try');if(!b)return;var s=T.qa[+b.getAttribute('data-i')].set;Object.keys(s).forEach(function(k){v[k]=s[k];$('i_'+k).value=s[k]});run();window.scrollTo({top:app.offsetTop,behavior:'smooth'})});
$('wa').addEventListener('click',function(){var t=r.share+' Try yours: '+location.href;if(navigator.share){navigator.share({text:t}).catch(function(){})}else window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank')});
$('cp').addEventListener('click',function(){var b=this;try{navigator.clipboard.writeText(location.href);b.textContent='Copied!'}catch(e){b.textContent='Copy from address bar'}setTimeout(function(){b.textContent='Copy my link'},1800)});
run();
})();
