/* Zone Practice game: draw a box where price kept turning, reveal what happened next. Practice only. */
(function(){
var root=document.getElementById("zg");if(!root)return;
var POOL=["Nifty 50","Sensex","Bank Nifty","Nifty IT","Nifty Pharma","S&P 500","Nasdaq","Dow","Gold"],HIST=70,FUT=20,N=HIST+FUT;
var data=null,rows=null,name="",zone=null,drag=null,revealed=0,locked=false,timer=null,best=0,rounds=0,res=null;
try{best=+localStorage.getItem("wt-zg-best")||0}catch(e){}
root.innerHTML='<h2 class="nbh">Zone Practice</h2><p>Find where price kept turning. <b>Drag a box</b> around that area, then reveal what happened next. The chart name is hidden until you reveal.</p>'+
'<div class="zgc"><canvas id="zgcv" aria-label="Practice chart. Drag to draw a box." style="touch-action:none"></canvas></div>'+
'<div class="zgb"><button type="button" class="tryb plain" id="zgclr">Clear box</button><button type="button" class="tryb" id="zgrev" disabled>Reveal what happened next</button></div>'+
'<div class="zgr" id="zgres" hidden></div><p class="nbn" id="zgst"></p>';
var cv=document.getElementById("zgcv"),cx=cv.getContext("2d"),bClr=document.getElementById("zgclr"),bRev=document.getElementById("zgrev"),out=document.getElementById("zgres"),st=document.getElementById("zgst");
var W=0,H=0,PR=58,PT=14,PB=14;
function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||"#888"}
function fix(a){return a.map(function(r){var b=Math.max(r.open,r.close),l=Math.min(r.open,r.close);return{open:r.open,close:r.close,high:Math.min(r.high,b*1.03),low:Math.max(r.low,l*.97),time:r.time}}).filter(function(r){return r.open>0&&r.close>0})}
function range(){var s=rows.slice(0,HIST+revealed),hi=-1e9,lo=1e9;s.forEach(function(r){hi=Math.max(hi,r.high);lo=Math.min(lo,r.low)});if(zone){hi=Math.max(hi,zone.hi);lo=Math.min(lo,zone.lo)}var p=(hi-lo)*.08;return{hi:hi+p,lo:lo-p}}
var R={hi:1,lo:0};
function y(p){return PT+(R.hi-p)/(R.hi-R.lo)*(H-PT-PB)}
function p2(yy){return R.hi-(yy-PT)/(H-PT-PB)*(R.hi-R.lo)}
function sw(){return (W-PR-8)/N}
function x(i){return 8+sw()*(i+.5)}
function size(){var w=cv.parentNode.clientWidth;if(!w)return;var d=window.devicePixelRatio||1;W=w;H=w<520?250:300;cv.width=w*d;cv.height=H*d;cv.style.width=w+"px";cv.style.height=H+"px";cx.setTransform(d,0,0,d,0,0);draw()}
function draw(){if(!rows)return;R=range();var ink=css("--ink"),up=css("--up"),dn=css("--down"),mu=css("--mute"),ln=css("--line");
cx.clearRect(0,0,W,H);cx.font="700 15px Caveat,'Segoe Print','Comic Sans MS',cursive";cx.textBaseline="middle";
for(var g=0;g<=4;g++){var p=R.lo+(R.hi-R.lo)*g/4,yy=y(p);cx.strokeStyle=ln;cx.lineWidth=1;cx.beginPath();cx.moveTo(8,yy);cx.lineTo(W-PR,yy);cx.stroke();cx.fillStyle=mu;cx.textAlign="left";cx.fillText(Math.round(p).toLocaleString("en-IN"),W-PR+6,yy)}
if(revealed<FUT){cx.fillStyle=ln;cx.globalAlpha=.35;cx.fillRect(x(HIST+revealed)-sw()/2,PT,sw()*(FUT-revealed),H-PT-PB);cx.globalAlpha=1;if(!revealed){cx.fillStyle=mu;cx.textAlign="center";cx.font="700 34px Caveat,'Segoe Print',cursive";cx.fillText("?",x(HIST+FUT/2),H/2);cx.font="700 15px Caveat,'Segoe Print',cursive"}}
var s=Math.max(2,sw()*.62);
for(var i=0;i<HIST+revealed;i++){var r=rows[i],c=r.close>=r.open?up:dn;cx.strokeStyle=c;cx.fillStyle=c;cx.lineWidth=1.4;cx.beginPath();cx.moveTo(x(i),y(r.high));cx.lineTo(x(i),y(r.low));cx.stroke();var t=y(Math.max(r.open,r.close)),h=Math.max(1.5,Math.abs(y(r.open)-y(r.close)));cx.fillRect(x(i)-s/2,t,s,h)}
if(revealed){cx.strokeStyle=ink;cx.lineWidth=1.5;cx.beginPath();cx.moveTo(x(HIST-.5),PT);cx.lineTo(x(HIST-.5),H-PB);cx.stroke()}
if(zone){var x1=Math.min(zone.x1,zone.x2),x2=Math.max(zone.x1,zone.x2),y1=y(zone.hi),y2=y(zone.lo);cx.fillStyle=up;cx.globalAlpha=.2;cx.fillRect(x1,y1,x2-x1,y2-y1);cx.globalAlpha=1;cx.strokeStyle=up;cx.lineWidth=2.5;cx.strokeRect(x1,y1,x2-x1,y2-y1)}}
function pt(e){var b=cv.getBoundingClientRect();return{x:Math.max(0,Math.min(W-PR,e.clientX-b.left)),y:Math.max(PT,Math.min(H-PB,e.clientY-b.top))}}
cv.addEventListener("pointerdown",function(e){if(locked||!rows)return;e.preventDefault();cv.setPointerCapture(e.pointerId);var a=pt(e);drag=a;zone=null;bRev.disabled=true;draw()});
cv.addEventListener("pointermove",function(e){if(!drag)return;var b=pt(e),pa=p2(drag.y),pb=p2(b.y);zone={x1:drag.x,x2:b.x,hi:Math.max(pa,pb),lo:Math.min(pa,pb)};draw()});
function end(){if(!drag)return;drag=null;if(zone&&(Math.abs(y(zone.hi)-y(zone.lo))<6||Math.abs(zone.x1-zone.x2)<10))zone=null;bRev.disabled=!zone;draw()}
cv.addEventListener("pointerup",end);cv.addEventListener("pointercancel",end);
bClr.onclick=function(){if(locked)return;zone=null;bRev.disabled=true;draw()};
function grade(){var lo=zone.lo,hi=zone.hi,mid=(hi+lo)/2,tol=mid*.001,pv=0,i,j;
for(i=3;i<HIST-3;i++){var a=rows.slice(i-3,i+4),mh=Math.max.apply(null,a.map(function(r){return r.high})),ml=Math.min.apply(null,a.map(function(r){return r.low}));if(rows[i].high===mh&&rows[i].high>=lo-tol&&rows[i].high<=hi+tol)pv++;if(rows[i].low===ml&&rows[i].low>=lo-tol&&rows[i].low<=hi+tol)pv++}
var wide=(hi-lo)/mid>.04,atr=0;for(i=HIST-20;i<HIST;i++)atr+=rows[i].high-rows[i].low;atr/=20;
var touch=-1;for(j=0;j<FUT;j++){var f=rows[HIST+j];if(f.low<=hi&&f.high>=lo){touch=j;break}}
var kind="none";if(touch>-1){var pc=touch?rows[HIST+touch-1].close:rows[HIST-1].close,above=pc>=mid;for(j=touch;j<Math.min(FUT,touch+6);j++){var c=rows[HIST+j].close;if(above?c>=hi+.8*atr:c<=lo-.8*atr){kind="bounce";break}if(above?c<=lo-.8*atr:c>=hi+.8*atr){kind="broke";break}}}
return{pv:pv,wide:wide,touch:touch>-1,kind:kind}}
function show(g){var n=(g.pv>=2&&!g.wide?1:0)+(g.touch?1:0)+(g.kind==="bounce"?1:0),m=["Keep practising","Good start","Nice work","Sharp eyes"][n];
var L=[[g.pv>=2&&!g.wide,g.wide?"Your box is too wide. Zones are tight areas.":g.pv>=2?"Your box sits where price turned "+g.pv+" times before.":"Price did not turn much here before. Look for 2 or more bounces in the same area."],
[g.touch,g.touch?"Price came back to your box within 20 days.":"Price never came back to your box. Zones are not always tested."],
[g.kind==="bounce",g.kind==="bounce"?"Price reacted and moved away from your box.":g.kind==="broke"?"Price pushed through the box. Zones can fail, and a broken zone can flip its role.":g.touch?"Price touched the box and drifted. No clear reaction.":"Not tested, so there is no reaction to judge."]];
var stars="";for(var i=0;i<3;i++)stars+=i<n?"\u2605":"\u2606";
out.innerHTML='<h3>'+m+' <span class="zgs">'+stars+'</span></h3><p class="zgn">It was <b>'+name+'</b>, ending '+rows[HIST-1].time+'.</p><ul class="zgl">'+L.map(function(l){return'<li class="'+(l[0]?"ok":"no")+'">'+(l[0]?"\u2713 ":"\u2717 ")+l[1]+'</li>'}).join("")+'</ul><button type="button" class="tryb" id="zgnext">Next round</button>';
out.hidden=false;document.getElementById("zgnext").onclick=round;rounds++;if(n>best){best=n;try{localStorage.setItem("wt-zg-best",best)}catch(e){}}
st.textContent="Rounds played: "+rounds+" | Best: "+best+"/3 stars | Practice only, not advice.";out.scrollIntoView({block:"nearest",behavior:"smooth"})}
bRev.onclick=function(){if(!zone||locked)return;locked=true;bRev.disabled=true;bClr.disabled=true;res=grade();revealed=0;var rm=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(rm){revealed=FUT;draw();show(res);return}
timer=setInterval(function(){revealed++;draw();if(revealed>=FUT){clearInterval(timer);show(res)}},90)};
function round(){clearInterval(timer);var k,a;for(var t=0;t<12;t++){k=POOL[Math.floor(Math.random()*POOL.length)];a=data[k];if(a&&a.length>=N+10)break;a=null}if(!a){root.querySelector("p").textContent="Practice data is loading. Please try again soon.";return}
var s=Math.floor(Math.random()*(a.length-N));rows=fix(a.slice(s,s+N));if(rows.length<N){return round()}name=k;zone=null;revealed=0;locked=false;res=null;out.hidden=true;bRev.disabled=true;bClr.disabled=false;size()}
fetch("/data/charts.json").then(function(r){return r.json()}).then(function(j){data=j;round()}).catch(function(){root.querySelector("p").textContent="Practice data could not load. Refresh to try again."});
window.addEventListener("resize",size);
new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
if(st&&best)st.textContent="Best so far: "+best+"/3 stars";
})();
