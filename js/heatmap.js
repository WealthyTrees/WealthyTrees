/* WealthyTrees Sprout's Heatmap — TradingView-style gamified market heatmap.
   One IIFE. No window exposure. No dependencies. Facts only, no predictions. */
(function(){
"use strict";
/* ---------- helpers ---------- */
function $(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function fmt(n){return Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}
function sgn(p){return (p>=0?"+":"")+p.toFixed(2)+"%"}
function pctWord(p){return (p>=0?"up ":"down ")+Math.abs(p).toFixed(2)+" percent"}
function clamp(v,a,b){return v<a?a:v>b?b:v}
var REDUCED=false; try{REDUCED=window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
var HOVER=false; try{HOVER=window.matchMedia("(hover: hover)").matches}catch(e){}
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function txt(tag,cls,s){var e=document.createElement(tag);if(cls)e.className=cls;e.textContent=s;return e}
/* ---------- colour scale (8 steps, all WCAG AA >= 4.5:1) ---------- */
var STEPS=[
 {min:3,   bg:"#084d27", fg:"#ffffff", label:"+3% or more"},
 {min:2,   bg:"#0d6e33", fg:"#ffffff", label:"+2%"},
 {min:1,   bg:"#127a3c", fg:"#ffffff", label:"+1%"},
 {min:0.3, bg:"#a8dba8", fg:"#0b2e22", label:"+0.3%"},
 {min:-0.3,bg:"#eef0ea", fg:"#0b2e22", label:"Flat"},
 {min:-1,  bg:"#f9c5b0", fg:"#0b2e22", label:"−1%"},
 {min:-2,  bg:"#c93a2b", fg:"#ffffff", label:"−2%"},
 {min:-99, bg:"#8f1d12", fg:"#ffffff", label:"−3% or more"}
];
function colorFor(p){for(var i=0;i<STEPS.length;i++){if(p>=STEPS[i].min)return STEPS[i]}return STEPS[STEPS.length-1]}
/* ---------- state ---------- */
var TILES=[], MOOD=0, FETCHED="", SPROUT=null, GROUPS=["India","Sectors","US Markets","Commodities & Currency"];
var played=false, revealed=false, tourStep=0, lastFocus=null, chartsCache=null;
var XP=0, STREAK=0;
try{XP=parseInt(localStorage.getItem("wt-hm-xp")||"0",10)||0;STREAK=parseInt(localStorage.getItem("wt-hm-streak")||"0",10)||0}catch(e){}
try{played=sessionStorage.getItem("wt-hm-played")==="1"}catch(e){}
/* ---------- squarified treemap ---------- */
function squarify(items,x,y,w,h){
 var out=[];
 if(!items.length||w<=0||h<=0)return out;
 var sorted=items.slice().sort(function(a,b){return b.weight-a.weight});
 var total=0;sorted.forEach(function(it){total+=it.weight});
 var scale=(w*h)/total, rx=x, ry=y, rw=w, rh=h, row=[], rowArea=0;
 function worst(row,rowArea,side){
  var thick=rowArea/side, worstA=0;
  for(var i=0;i<row.length;i++){
   var len=(row[i].weight*scale)/thick;
   var a=len>thick?len/thick:thick/len;
   if(a>worstA)worstA=a;
  }
  return worstA;
 }
 function flush(){
  if(!row.length)return;
  var horizontal=rw<rh, side=horizontal?rw:rh, thick=rowArea/side, pos=0;
  row.forEach(function(it){
   var len=(it.weight*scale)/thick;
   if(horizontal){out.push({item:it,x:rx+pos,y:ry,w:len,h:thick});pos+=len}
   else{out.push({item:it,x:rx,y:ry+pos,w:thick,h:len});pos+=len}
  });
  if(horizontal){ry+=thick;rh-=thick}else{rx+=thick;rw-=thick}
  row=[];rowArea=0;
 }
 sorted.forEach(function(it){
  var area=it.weight*scale;
  if(row.length){
   var side=rw<rh?rw:rh;
   if(worst(row.concat([it]),rowArea+area,side)>worst(row,rowArea,side))flush();
  }
  row.push(it);rowArea+=area;
 });
 flush();
 return out;
}
/* ---------- build ---------- */
function groupOf(name){var t=null;TILES.forEach(function(x){if(x.name===name)t=x});return t}
function groupTiles(g){return TILES.filter(function(t){return t.group===g})}
function groupAvg(g){
 var ts=groupTiles(g), w=0, s=0;
 ts.forEach(function(t){w+=t.weight;s+=t.weight*t.pct});
 return w>0?s/w:0;
}
function greenestGroup(){
 var best=null, bestV=-Infinity;
 GROUPS.forEach(function(g){var v=groupAvg(g);if(v>bestV){bestV=v;best=g}});
 return best;
}
/* the game is Indian markets only: the Indian tile with the highest day change */
var INDIAN=["Nifty 50","Sensex","Bank Nifty","Nifty IT","Nifty Pharma","Nifty Auto","Nifty Metal"];
function bestIndian(){
 var best=null, bestV=-Infinity;
 TILES.forEach(function(t){
  if(INDIAN.indexOf(t.name)<0)return;
  if(t.pct>bestV){bestV=t.pct;best=t}
 });
 return best;
}
function biggestMover(){
 var best=null, bestV=-1;
 TILES.forEach(function(t){var v=Math.abs(t.pct);if(v>bestV){bestV=v;best=t}});
 return best;
}
/* ---------- legend ---------- */
function buildLegend(){
 var L=$("hm-legend"); if(!L)return; L.innerHTML="";
 L.appendChild(txt("span","hm-leg-t","Greener = rose more · redder = fell more"));
 STEPS.forEach(function(s){
  var chip=el("span","hm-leg");
  chip.appendChild(el("i","hm-sw")); chip.firstChild.style.background=s.bg;
  chip.appendChild(document.createTextNode(s.label));
  L.appendChild(chip);
 });
 var b=el("button","hm-tour-btn","🌱 Take the tour");
 b.type="button"; b.addEventListener("click",function(){startTour()});
 L.appendChild(b);
}
/* ---------- mood meter: an animated Market Weather ---------- */
function moodEntry(){
 if(!SPROUT||!SPROUT.mood)return null;
 var best=null;
 SPROUT.mood.forEach(function(m){if(MOOD>=m.min&&(!best||m.min>best.min))best=m});
 return best||SPROUT.mood[SPROUT.mood.length-1];
}
function weatherKind(){
 var w=(moodEntry()||{}).weather||"";
 if(/Sunny/i.test(w))return "sun";
 if(/Bright/i.test(w))return "sun";
 if(/Partly/i.test(w))return "partly";
 if(/Rainy/i.test(w))return "rain";
 return "cloud";
}
function weatherSVG(kind){
 if(kind==="sun")return '<svg viewBox="0 0 64 64" width="58" height="58" role="img" aria-label="Sunny"><g class="hm-rays" stroke="#e0b04f" stroke-width="3" stroke-linecap="round"><line x1="32" y1="4" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="60"/><line x1="4" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="60" y2="32"/><line x1="12" y1="12" x2="18" y2="18"/><line x1="46" y1="46" x2="52" y2="52"/><line x1="52" y1="12" x2="46" y2="18"/><line x1="18" y1="46" x2="12" y2="52"/></g><circle cx="32" cy="32" r="15" fill="#e0b04f"/></svg>';
 if(kind==="partly")return '<svg viewBox="0 0 64 64" width="58" height="58" role="img" aria-label="Partly cloudy"><g class="hm-rays" style="transform-origin:24px 24px" stroke="#e0b04f" stroke-width="3" stroke-linecap="round"><line x1="24" y1="6" x2="24" y2="12"/><line x1="24" y1="36" x2="24" y2="42"/><line x1="6" y1="24" x2="12" y2="24"/><line x1="36" y1="24" x2="42" y2="24"/><line x1="11" y1="11" x2="15" y2="15"/><line x1="33" y1="33" x2="37" y2="37"/><line x1="37" y1="11" x2="33" y2="15"/><line x1="15" y1="33" x2="11" y2="37"/></g><circle cx="24" cy="24" r="11" fill="#e0b04f"/><g class="hm-cloud" fill="#dfe5dc"><ellipse cx="40" cy="46" rx="20" ry="12"/><ellipse cx="28" cy="42" rx="12" ry="9"/><ellipse cx="50" cy="42" rx="11" ry="8"/></g></svg>';
 if(kind==="rain")return '<svg viewBox="0 0 64 64" width="58" height="58" role="img" aria-label="Rainy"><g class="hm-cloud" fill="#b9c4bb"><ellipse cx="32" cy="28" rx="22" ry="13"/><ellipse cx="20" cy="24" rx="12" ry="9"/><ellipse cx="44" cy="24" rx="11" ry="8"/></g><g class="hm-rain" stroke="#5b8db8" stroke-width="3" stroke-linecap="round"><line x1="22" y1="46" x2="20" y2="54"/><line x1="32" y1="46" x2="30" y2="54"/><line x1="42" y1="46" x2="40" y2="54"/></g></svg>';
 return '<svg viewBox="0 0 64 64" width="58" height="58" role="img" aria-label="Cloudy"><g class="hm-cloud" fill="#dfe5dc"><ellipse cx="32" cy="34" rx="22" ry="13"/><ellipse cx="20" cy="30" rx="12" ry="9"/><ellipse cx="44" cy="30" rx="11" ry="8"/></g></svg>';
}
function greetText(){
 if(!SPROUT||!SPROUT.greet)return "";
 var b=biggestMover(); if(!b)return "";
 return SPROUT.greet.replace("{mover}",b.name).replace("{pct}",sgn(b.pct));
}
function buildMood(){
 var M=$("hm-mood"); if(!M)return; M.innerHTML="";
 var e=moodEntry();
 var box=el("div","hm-mood-box");
 var moodCol=MOOD>=0.5?"#1a9850":MOOD>=-0.5?"#c9a227":"#d73027";
 box.style.setProperty("--mood",moodCol);
 /* weather visual */
 var kind=weatherKind();
 var wx=el("div","hm-weather");
 wx.innerHTML=weatherSVG(kind);
 wx.appendChild(txt("div","hm-weather-t",(e&&e.weather)||""));
 box.appendChild(wx);
 /* gauge: needle sweeps in, then sways gently */
 var ang=clamp((MOOD+3)/6,-0,1)*180-90;
 var svg='<svg class="hm-gauge" viewBox="0 0 200 110" role="img" aria-label="Market mood: '+(e?esc(e.text):"")+'">'
  +'<path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--line)" stroke-width="10" stroke-linecap="round"/>'
  +'<path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--mood)" stroke-width="10" stroke-linecap="round" stroke-dasharray="126 252" opacity=".55"/>'
  +'<g class="hm-needle" style="--ang:'+ang+'deg;transform-origin:100px 100px;transform:rotate(-90deg)"><line x1="100" y1="100" x2="100" y2="30" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="var(--ink)"/></g></svg>';
 var gw=el("div","hm-gauge-wrap"); gw.innerHTML=svg; box.appendChild(gw);
 /* Sprout's face stays the same green bud in every mood — never another face */
 var face=el("div","hm-mood-face");
 face.innerHTML=sproutSVG();
 var text=el("div","hm-mood-text");
 text.appendChild(txt("b","","Market mood: "));
 text.appendChild(document.createTextNode(e?e.text:""));
 text.appendChild(el("span","hm-mood-n","  Weighted average "+sgn(MOOD)+"."));
 box.appendChild(face); box.appendChild(text);
 /* Sprout's greeting */
 var greet=greetText();
 if(greet)box.appendChild(txt("p","hm-greet","🌱 "+greet));
 /* floating particles in the mood colour */
 if(!REDUCED){
  var parts=el("div","hm-particles");
  for(var i=0;i<14;i++){
   var p=document.createElement("i");
   p.style.left=(5+Math.random()*90)+"%";
   p.style.setProperty("--pd",(2.5+Math.random()*3)+"s");
   p.style.setProperty("--pl",(Math.random()*1.2)+"s");
   p.style.background=moodCol;
   parts.appendChild(p);
  }
  box.appendChild(parts);
 }
 M.appendChild(box);
 /* sweep the needle in, then let it sway */
 var needle=box.querySelector(".hm-needle");
 if(needle&&!REDUCED){
  setTimeout(function(){needle.style.transform="rotate("+ang+"deg)"},120);
  setTimeout(function(){needle.classList.add("hm-sway")},1400);
 }
}
/* ---------- hero: the day in one line ---------- */
function buildHero(){
 var app=$("hm-app"); if(!app)return;
 var old=$("hm-hero"); if(old)old.parentNode.removeChild(old);
 var e=moodEntry(); if(!e||!e.hero)return;
 var h=el("h2","hm-hero"); h.id="hm-hero";
 /* stagger the words in; the space lives in its own text node so inline-block
    spans keep a real gap between words */
 e.hero.split(" ").forEach(function(w,i){
  var s=el("span","hm-hero-w",w);
  s.style.animationDelay=(i*0.09)+"s";
  h.appendChild(s);
  h.appendChild(document.createTextNode(" "));
 });
 app.insertBefore(h,app.firstChild);
}
/* ---------- treemap render ---------- */
var mapW=0, mapH=0;
function layoutMap(){
 var map=$("hm-map"); if(!map||!TILES.length)return;
 var W=map.clientWidth; if(!W)return;
 var mobile=W<=520;
 mapW=W;
 var cats=GROUPS.filter(function(g){return groupTiles(g).length});
 if(mobile){
  map.style.height="auto"; map.innerHTML="";
  cats.forEach(function(g){
   var gb=el("div","hm-gblock");
   gb.appendChild(txt("div","hm-glabel",g));
   var row=el("div","hm-gtiles");
   groupTiles(g).forEach(function(t){
    row.appendChild(tileButton(t,0,0,0,0,true));
   });
   gb.appendChild(row); map.appendChild(gb);
  });
  mapH=map.offsetHeight;
  return;
 }
 /* desktop: squarify groups, then tiles inside each group */
 var totalW=0; cats.forEach(function(g){totalW+=groupTiles(g).reduce(function(s,t){return s+t.weight},0)});
 var gItems=cats.map(function(g){return {name:g,weight:groupTiles(g).reduce(function(s,t){return s+t.weight},0)}});
 /* estimate height from width: aim for a ~16:10 map */
 var H=Math.round(W*0.62); map.style.height=H+"px"; mapH=H;
 map.innerHTML="";
 var gRects=squarify(gItems,0,0,W,H);
 gRects.forEach(function(gr){
  var g=gr.item.name, ts=groupTiles(g);
  var labelH=22, pad=2;
  var tileArea={x:gr.x+pad,y:gr.y+labelH,w:gr.w-pad*2,h:gr.h-labelH-pad};
  var lb=el("div","hm-glabel hm-glabel-abs",g);
  lb.style.left=gr.x+"px"; lb.style.top=gr.y+"px"; lb.style.width=gr.w+"px";
  map.appendChild(lb);
  var rects=squarify(ts,tileArea.x,tileArea.y,tileArea.w,tileArea.h);
  rects.forEach(function(r){
   map.appendChild(tileButton(r.item,r.x,r.y,r.w,r.h,false));
  });
 });
}
function tileButton(t,x,y,w,h,isMobile){
 var c=revealed?colorFor(t.pct):{bg:"var(--hm-neutral)",fg:"var(--ink)"};
 var b=el("button","hm-tile");
 b.type="button"; b.dataset.id=t.id; b.dataset.name=t.name;
 b.setAttribute("aria-label",t.name+", "+pctWord(t.pct));
 b.style.background=c.bg; b.style.color=c.fg;
 if(!isMobile){
  b.style.left=x+"px"; b.style.top=y+"px"; b.style.width=Math.max(0,w-2)+"px"; b.style.height=Math.max(0,h-2)+"px";
  b.style.position="absolute";
  var sizeCls=(w>=100&&h>=64)?"full":(w>=76&&h>=48)?"compact":"tiny";
  b.classList.add(sizeCls);
 }else{
  b.style.flexGrow=t.weight; b.style.flexBasis="0"; b.style.minWidth="96px"; b.style.minHeight="64px";
  b.classList.add("full");
 }
 b.appendChild(txt("b","hm-tn",t.name));
 b.appendChild(txt("span","hm-tc",(t.pct>=0?"▲ ":"▼ ")+sgn(t.pct)));
 b.appendChild(txt("span","hm-tp",fmt(t.price)));
 b.addEventListener("click",function(){openSprout(t,b)});
 if(HOVER){
  b.addEventListener("mouseenter",function(){showTip(b,t)});
  b.addEventListener("mouseleave",hideTip);
  b.addEventListener("focus",function(){showTip(b,t)});
  b.addEventListener("blur",hideTip);
 }
 return b;
}
var tipEl=null;
function showTip(b,t){
 hideTip();
 tipEl=el("div","hm-tip",esc(t.name)+" · "+(t.pct>=0?"▲ ":"▼ ")+sgn(t.pct));
 document.body.appendChild(tipEl);
 var r=b.getBoundingClientRect();
 tipEl.style.left=clamp(r.left+window.scrollX,8,window.innerWidth-tipEl.offsetWidth-8)+"px";
 tipEl.style.top=(r.top+window.scrollY-tipEl.offsetHeight-6)+"px";
}
function hideTip(){if(tipEl&&tipEl.parentNode)tipEl.parentNode.removeChild(tipEl);tipEl=null}
/* ---------- reveal (after the game) ---------- */
function revealMap(){
 revealed=true;
 var map=$("hm-map");
 map.querySelectorAll(".hm-tile").forEach(function(b,i){
  var t=groupOf(b.dataset.name); if(!t)return;
  var c=colorFor(t.pct);
  if(REDUCED){b.style.background=c.bg;b.style.color=c.fg;return}
  b.style.transitionDelay=(i*45)+"ms";
  b.classList.add("hm-flip");
  setTimeout(function(){b.style.background=c.bg;b.style.color=c.fg},40);
  setTimeout(function(){b.classList.remove("hm-flip");b.style.transitionDelay=""},700+i*45);
 });
 /* draw the eye to the biggest mover with a gentle pulse */
 var bm=biggestMover();
 if(bm&&!REDUCED){
  var tile=document.querySelector('.hm-tile[data-id="'+bm.id+'"]');
  if(tile)setTimeout(function(){tile.classList.add("hm-pulse")},900);
 }
}
/* ---------- predict game ---------- */
function buildGame(){
 var G=$("hm-game"); if(!G)return; G.innerHTML="";
 if(played){revealed=true;return}
 if(!SPROUT||!SPROUT.game){revealed=true;return}
 var g=SPROUT.game;
 var box=el("div","hm-game-box");
 box.appendChild(txt("h3","","🎮 "+(g.ask||"Which group is the greenest today?")));
 var opts=el("div","hm-game-opts");
 (g.options||GROUPS).forEach(function(name){
  var b=el("button","hm-game-opt",esc(name));
  b.type="button";
  b.addEventListener("click",function(){pickGroup(name,box)});
  opts.appendChild(b);
 });
 box.appendChild(opts);
 var chips=el("div","hm-chips");
 chips.appendChild(txt("span","hm-chip","⭐ XP: "+XP));
 chips.appendChild(txt("span","hm-chip","🔥 Streak: "+STREAK));
 box.appendChild(chips);
 box.appendChild(txt("p","hm-game-note","One guess per visit. The map colours reveal after you pick."));
 G.appendChild(box);
 revealed=false;
}
function pickGroup(name,box){
 if(played)return;
 played=true; try{sessionStorage.setItem("wt-hm-played","1")}catch(e){}
 /* Indian markets only: the winner is the Indian tile with the highest day change */
 var win=bestIndian(), bestName=win?win.name:"", right=name===bestName, g=SPROUT.game;
 var gain=right?10:2; XP+=gain;
 if(right)STREAK+=1; else STREAK=0;
 try{localStorage.setItem(g.xpKey||"wt-hm-xp",String(XP));localStorage.setItem(g.streakKey||"wt-hm-streak",String(STREAK))}catch(e){}
 box.querySelectorAll(".hm-game-opt").forEach(function(b){
  b.disabled=true;
  if(b.textContent===bestName)b.classList.add("hm-winner");
  if(b.textContent===name&&!right)b.classList.add("hm-wrong");
 });
 /* mark the winning tile in gold on the map */
 if(win){
  var tile=document.querySelector('.hm-tile[data-id="'+win.id+'"]');
  if(tile)tile.classList.add("hm-winner-tile");
 }
 var tmpl=right?g.right:g.wrong;
 var res=el("p","hm-game-res", (tmpl||"").replace("{winner}",bestName));
 box.appendChild(res);
 var chips=box.querySelector(".hm-chips");
 if(chips)chips.innerHTML="";
 if(chips){
  chips.appendChild(txt("span","hm-chip","⭐ XP: "+XP+" (+"+gain+")"));
  chips.appendChild(txt("span","hm-chip","🔥 Streak: "+STREAK));
 }
 if(right)confetti(box);
 revealMap();
}
/* a small burst of gold confetti (CSS-only dots) when the guess is right */
function confetti(box){
 if(REDUCED)return;
 var layer=el("div","hm-confetti");
 for(var i=0;i<16;i++){
  var d=document.createElement("i");
  var ang=Math.random()*Math.PI*2, dist=50+Math.random()*70;
  d.style.setProperty("--dx",Math.cos(ang)*dist+"px");
  d.style.setProperty("--dy",Math.sin(ang)*dist-30+"px");
  d.style.setProperty("--dl",(Math.random()*0.25)+"s");
  d.style.background=["#e0b04f","#1a9850","#0f7b55","#f5c26b"][i%4];
  layer.appendChild(d);
 }
 box.appendChild(layer);
 setTimeout(function(){if(layer.parentNode)layer.parentNode.removeChild(layer)},1400);
}
/* ---------- Sprout takeover ---------- */
var sproutOpen=false;
function sproutSVG(){
 return '<svg class="hm-sprout-svg" viewBox="0 0 64 64" width="52" height="52" role="img" aria-label="Sprout"><path d="M32 62 C30 52 30 44 32 36" stroke="#58a34a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M32 38 C18 38 8 30 6 14 C18 14 28 24 32 38 Z" fill="#7cc46a"/><path d="M29 34 C24 29 19 23 14 17" stroke="#d9f0b4" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M32 38 C46 38 56 30 58 14 C46 14 36 24 32 38 Z" fill="#8fd07a"/><path d="M35 34 C40 29 45 23 50 17" stroke="#e2f4bd" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
}
function sparkSVG(name,pct){
 if(!chartsCache||!chartsCache[name])return "";
 var rows=chartsCache[name].slice(-30);
 if(rows.length<2)return "";
 var closes=rows.map(function(r){return r.close});
 var mn=Math.min.apply(null,closes), mx=Math.max.apply(null,closes), rg=(mx-mn)||1;
 var pts=closes.map(function(v,i){return (i/(closes.length-1)*200).toFixed(1)+","+(46-((v-mn)/rg)*38).toFixed(1)}).join(" ");
 var col=pct>=0?"#1a9850":"#d73027";
 return '<svg class="hm-spark" viewBox="0 0 200 52" width="200" height="52" role="img" aria-label="Price chart, last 30 closes"><polyline points="'+pts+'" fill="none" stroke="'+col+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
}
function openSprout(t,btn){
 if(sproutOpen)return; sproutOpen=true;
 /* the pulse has done its job — stop drawing the eye once the user taps a tile */
 document.querySelectorAll(".hm-tile.hm-pulse").forEach(function(b){b.classList.remove("hm-pulse")});
 lastFocus=document.activeElement;
 if(btn)btn.classList.add("hm-spot");
 var wrap=$("hm-sprout"); wrap.innerHTML="";
 var back=el("div","hm-back");
 var dlg=el("div","hm-dialog"); dlg.setAttribute("role","dialog"); dlg.setAttribute("aria-modal","true"); dlg.setAttribute("aria-label",t.name);
 var x=el("button","hm-x","✕"); x.type="button"; x.setAttribute("aria-label","Close");
 x.addEventListener("click",closeSprout);
 dlg.appendChild(x);
 var head=el("div","hm-dlg-head");
 head.innerHTML=sproutSVG();
 head.appendChild(txt("b","",t.name));
 dlg.appendChild(head);
 var meta=el("p","hm-dlg-meta",fmt(t.price)+"  ·  "+(t.pct>=0?"▲ ":"▼ ")+sgn(t.pct)+" today  ·  "+t.group);
 dlg.appendChild(meta);
 var line=el("p","hm-dlg-line");
 dlg.appendChild(line);
 var sparkBox=el("div","hm-dlg-spark");
 dlg.appendChild(sparkBox);
 var learn=el("a","hm-dlg-learn","Learn more →");
 learn.href="/pages/learn.html";
 dlg.appendChild(learn);
 wrap.appendChild(back); wrap.appendChild(dlg);
 wrap.classList.add("on");
 /* type the line */
 var text=(SPROUT&&SPROUT.tiles&&SPROUT.tiles[t.name])||t.name+" moved "+sgn(t.pct)+" today.";
 if(REDUCED){line.textContent=text}
 else{
  var i=0; line.textContent="";
  var iv=setInterval(function(){
   i++; line.textContent=text.slice(0,i);
   if(i>=text.length)clearInterval(iv);
  },16);
  dlg._iv=iv;
 }
 /* lazy sparkline */
 if(!chartsCache){
  fetch("/data/charts.json").then(function(r){return r.json()}).then(function(j){
   chartsCache=j; sparkBox.innerHTML=sparkSVG(t.name,t.pct);
  }).catch(function(){ /* hide only the sparkline */ });
 }else{ sparkBox.innerHTML=sparkSVG(t.name,t.pct); }
 back.addEventListener("click",closeSprout);
 dlg.addEventListener("keydown",function(e){
  if(e.key==="Tab"){
   var f=dlg.querySelectorAll("button,a"); if(!f.length)return;
   var first=f[0], last=f[f.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
 });
 x.focus();
}
function closeSprout(){
 var wrap=$("hm-sprout");
 var dlg=wrap.querySelector(".hm-dialog");
 if(dlg&&dlg._iv)clearInterval(dlg._iv);
 wrap.classList.remove("on"); wrap.innerHTML="";
 document.querySelectorAll(".hm-tile.hm-spot").forEach(function(b){b.classList.remove("hm-spot")});
 sproutOpen=false;
 if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
/* ---------- guided tour ---------- */
function tourTargets(step){
 if(!step)return [];
 if(step.target==="all")return Array.prototype.slice.call(document.querySelectorAll(".hm-tile"));
 if(step.target==="biggest-mover"){var b=biggestMover();return b?[document.querySelector('.hm-tile[data-id="'+b.id+'"]')].filter(Boolean):[]}
 var one=document.querySelector('.hm-tile[data-id="'+step.target+'"]');
 return one?[one]:[];
}
function startTour(){
 if(!SPROUT||!SPROUT.tour||!SPROUT.tour.length)return;
 tourStep=0; showTourStep();
}
function showTourStep(){
 var steps=SPROUT.tour, s=steps[tourStep];
 document.querySelectorAll(".hm-tile.hm-glow").forEach(function(b){b.classList.remove("hm-glow")});
 tourTargets(s).forEach(function(b){if(b)b.classList.add("hm-glow")});
 var old=$("hm-tour"); if(old)old.parentNode.removeChild(old);
 var bubble=el("div","hm-tour"); bubble.id="hm-tour";
 bubble.appendChild(el("div","hm-tour-face","🌱"));
 var body=el("div","hm-tour-body");
 body.appendChild(txt("b","","Sprout · Step "+(tourStep+1)+" of "+steps.length));
 body.appendChild(txt("p","",s.text));
 var btns=el("div","hm-tour-btns");
 var skip=el("button","hm-tour-skip","Skip"); skip.type="button";
 skip.addEventListener("click",endTour);
 var next=el("button","hm-tour-next",tourStep===steps.length-1?"Got it ✓":"Next →"); next.type="button";
 next.addEventListener("click",function(){
  if(tourStep<steps.length-1){tourStep++;showTourStep()}else endTour();
 });
 btns.appendChild(skip); btns.appendChild(next);
 body.appendChild(btns); bubble.appendChild(body);
 document.body.appendChild(bubble);
 next.focus();
}
function endTour(){
 var b=$("hm-tour"); if(b)b.parentNode.removeChild(b);
 document.querySelectorAll(".hm-tile.hm-glow").forEach(function(x){x.classList.remove("hm-glow")});
 try{localStorage.setItem("wt-hm-tour","1")}catch(e){}
}
/* ---------- loading intro ---------- */
function runIntro(done){
 var I=$("hm-intro"); if(!I){done();return}
 /* ?intro=1 forces the intro (the Markets-page button links here) so it is
    always visible when you arrive from the Markets page, even if you have
    already seen it once this visit */
 var force=false; try{force=/[?&]intro=1/.test(location.search)}catch(e){}
 var seen=false; try{seen=sessionStorage.getItem("wt-hm-intro")==="1"}catch(e){}
 if((seen&&!force)||REDUCED){I.innerHTML="";done();return}
 var lines=(SPROUT&&SPROUT.intro&&SPROUT.intro.length)?SPROUT.intro:["Warming up the heatmap…"];
 var card=el("div","hm-intro-card");
 card.innerHTML='<div class="hm-intro-sprout">'+sproutSVG()+'</div>';
 var lineEl=txt("p","hm-intro-line",lines[0]);
 card.appendChild(lineEl);
 var grid=el("div","hm-intro-grid");
 for(var i=0;i<18;i++){var c=el("i","hm-intro-cell");c.style.background=colorFor([-2.5,-1.5,-0.5,0,0.5,1.5,2.5,3.5][i%8]).bg;grid.appendChild(c)}
 card.appendChild(grid);
 card.appendChild(txt("p","hm-intro-skip","Tap anywhere or press Esc to skip"));
 I.appendChild(card); I.classList.add("on");
 var li=0, iv=setInterval(function(){li=(li+1)%lines.length;lineEl.textContent=lines[li]},900);
 var finished=false;
 function finish(){
  if(finished)return; finished=true;
  clearInterval(iv);
  I.classList.add("hm-fade");
  setTimeout(function(){I.innerHTML="";I.classList.remove("on","hm-fade");done()},REDUCED?0:450);
  try{sessionStorage.setItem("wt-hm-intro","1")}catch(e){}
  /* strip ?intro=1 so a refresh does not replay the intro; the Markets
     button sets it fresh each time it is clicked */
  try{
   if(force&&window.history&&history.replaceState){
    var u=new URL(location.href); u.searchParams.delete("intro");
    history.replaceState(null,"",u.pathname+u.search+u.hash);
   }
  }catch(e){}
 }
 var to=setTimeout(finish,2100);
 function skip(e){if(e&&e.key&&e.key!=="Escape")return;clearTimeout(to);finish()}
 card.addEventListener("click",function(){clearTimeout(to);finish()});
 document.addEventListener("keydown",function h(e){if(e.key==="Escape"){document.removeEventListener("keydown",h);skip(e)}});
}
/* ---------- notes ---------- */
function buildNotes(){
 var N=$("hm-notes"); if(!N)return; N.innerHTML="";
 if(!SPROUT||!SPROUT.notes||!SPROUT.notes.length)return;
 N.appendChild(txt("h2","hm-notes-h","Sprout's notes"));
 var wrap=el("div","hm-notes-wrap");
 SPROUT.notes.forEach(function(n,i){
  var c=el("div","hm-note");
  c.style.setProperty("--rot",((i%2===0?-1:1)*(1.2+ (i%3)*0.5))+"deg");
  c.appendChild(txt("p","",n));
  wrap.appendChild(c);
 });
 N.appendChild(wrap);
 if("IntersectionObserver" in window&&!REDUCED){
  /* Observe the WRAPPER, not the cards: a card's own clip-path would keep its
     intersection ratio at 0 forever, so the observer would never fire. */
  var io=new IntersectionObserver(function(entries){
   entries.forEach(function(en){
    if(!en.isIntersecting)return;
    io.unobserve(en.target);
    wrap.querySelectorAll(".hm-note").forEach(function(c,i){
     setTimeout(function(){c.classList.add("hm-write")},i*100);
    });
   });
  },{threshold:0.2});
  io.observe(wrap);
 }else{
  wrap.querySelectorAll(".hm-note").forEach(function(c){c.classList.add("hm-write")});
 }
}
/* ---------- guide: How to read a heatmap, led by Sprout ---------- */
function buildGuide(){
 var app=$("hm-app"); if(!app)return;
 var old=$("hm-guide"); if(old)old.parentNode.removeChild(old);
 if(!SPROUT||!SPROUT.tour||!SPROUT.tour.length)return;
 var sec=el("section","hm-guide"); sec.id="hm-guide";
 var head=el("div","hm-guide-head");
 head.innerHTML=sproutSVG();
 var ht=el("div","hm-guide-title");
 ht.appendChild(txt("h2","hm-guide-h","How to read a heatmap"));
 ht.appendChild(txt("p","hm-guide-sub","Sprout walks you through it — four things to look for."));
 head.appendChild(ht);
 sec.appendChild(head);
 var list=el("ol","hm-guide-list");
 SPROUT.tour.forEach(function(step,i){
  var li=el("li","hm-guide-step");
  li.appendChild(txt("span","hm-guide-n",String(i+1)));
  li.appendChild(txt("p","",step.text));
  list.appendChild(li);
 });
 sec.appendChild(list);
 var notes=$("hm-notes");
 if(notes)app.insertBefore(sec,notes); else app.appendChild(sec);
}
/* ---------- foot ---------- */
function buildFoot(){
 var F=$("hm-foot"); if(!F)return;
 var disc=(SPROUT&&SPROUT.disclaimer)||"Educational only. Not investment advice.";
 var asOf=TILES.length?TILES[0].asOf:"";
 var src=TILES.length?TILES[0].source:"close";
 var srcLabel=src==="live"?"live prices":"closing prices";
 var dateStr="";
 try{
  if(asOf)dateStr=new Date(asOf+"T12:00:00+05:30").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Kolkata"});
 }catch(e){}
 var timeStr="";
 try{
  if(FETCHED)timeStr=new Date(FETCHED).toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit",hour12:true,timeZone:"Asia/Kolkata"});
 }catch(e){}
 F.textContent=disc+"  ·  As of "+(dateStr||"today")+", "+srcLabel+(timeStr?" · Updated "+timeStr+" IST":"");
}
/* ---------- error state ---------- */
function showError(){
 var app=$("hm-app"); if(app)app.hidden=false;
 var map=$("hm-map"); if(map)map.innerHTML="";
 var msg=el("div","hm-error");
 msg.appendChild(txt("p","","Sprout could not load the heatmap right now — the market data did not arrive."));
 var a=el("a","","See the Markets page instead →"); a.href="/pages/markets.html";
 msg.appendChild(a);
 (map||document.querySelector("main")).appendChild(msg);
}
/* ---------- init ---------- */
function init(){
 var sproutP=fetch("/data/heatmap-sprout.json").then(function(r){return r.json()}).then(function(j){SPROUT=j}).catch(function(){SPROUT=null});
 var dataP=null;
 try{dataP=window.WTHM.load()}catch(e){dataP=Promise.reject(e)}
 Promise.all([sproutP,dataP]).then(function(parts){
  var d=parts[1];
  if(!d||!d.tiles||d.tiles.length<6){showError();return}
  TILES=d.tiles; MOOD=d.mood||0; FETCHED=d.fetched||"";
  runIntro(function(){
   var app=$("hm-app"); if(app)app.hidden=false;
   buildHero(); buildLegend(); buildMood(); buildGame(); layoutMap(); buildGuide(); buildNotes(); buildFoot();
   if(revealed){/* game already played this session: colours are on */}
   var first=false; try{first=!localStorage.getItem("wt-hm-tour")}catch(e){}
   if(first)setTimeout(function(){startTour()},600);
  });
 }).catch(function(){showError()});
 document.addEventListener("keydown",function(e){if(e.key==="Escape"&&sproutOpen)closeSprout()});
 var ro=null;
 if("ResizeObserver" in window){
  var deb=null;
  ro=new ResizeObserver(function(){
   clearTimeout(deb); deb=setTimeout(function(){layoutMap()},150);
  });
  var m=$("hm-map"); if(m)ro.observe(m);
 }else{
  window.addEventListener("resize",function(){layoutMap()});
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
