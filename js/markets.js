/* WealthyTrees markets.js v1 */
(function(){
var $=function(i){return document.getElementById(i)};
var GROUPS={
"India":[["Broad indices",["Nifty 50","Sensex","Bank Nifty"]],["Sectors",["Nifty IT","Nifty Pharma","Nifty Auto","Nifty Metal"]],["Fear gauge",["India VIX"]]],
"US":[["Stock indices",["S&P 500","Nasdaq","Dow"]]],
"Commodities":[["Metals",["Gold","Silver","Copper"]],["Energy",["Crude WTI","Brent","Natural Gas"]]],
"Currency":[["Currency pair",["USD/INR"]]]};
var EXTRA={"Nifty Financial Services":1,"Nifty Realty":1,"Nifty PSU Bank":1,"Nifty Energy":1,"Nifty Media":1,"Nifty Infra":1,"Nifty Midcap":1,"Nifty Smallcap":1};
var LIVE={"Nifty 50":"NIFTY 50","Sensex":"SENSEX","Bank Nifty":"BANK NIFTY","Nifty IT":"NIFTY IT","Nifty Auto":"NIFTY AUTO","Nifty FMCG":"NIFTY FMCG","Nifty Pharma":"NIFTY PHARMA","Nifty Metal":"NIFTY METAL","India VIX":"INDIA VIX","S&P 500":"S&P 500","Nasdaq":"NASDAQ","Dow":"DOW","Russell 2000":"RUSSELL 2000","VIX":"VIX","Gold":"GOLD $/oz","Silver":"SILVER $/oz","Crude WTI":"CRUDE WTI","Brent":"BRENT","Natural Gas":"NATURAL GAS","Copper":"COPPER","USD/INR":"USD/INR"};
var A={ // about: [flag, country, one-line meaning]
"Nifty 50":["🇮🇳","India","The 50 largest listed companies on the National Stock Exchange (NSE). The most-watched gauge of the Indian stock market."],
"Sensex":["🇮🇳","India","The 30 big, well-established companies on the Bombay Stock Exchange (BSE). India's oldest index."],
"Bank Nifty":["🇮🇳","India","The most traded Indian banks together (HDFC Bank, ICICI Bank, SBI and others). It shows how the banking sector is doing."],
"Nifty Midcap":["🇮🇳","India","Medium-sized Indian companies. Usually moves more than the big Nifty 50 companies."],
"Nifty Smallcap":["🇮🇳","India","Smaller Indian companies. Often rises and falls faster, and carries more risk."],
"Nifty IT":["🇮🇳","India","Indian software and IT services companies such as TCS and Infosys. Sensitive to the US economy and the rupee."],
"Nifty Auto":["🇮🇳","India","Car, two-wheeler and auto-parts makers. Reflects how much people are buying vehicles. (If the index has no history, the chart may use a tracking ETF, so levels can differ.)"],
"Nifty FMCG":["🇮🇳","India","Everyday goods like soap, biscuits and tea (fast-moving consumer goods). Usually steadier than other sectors."],
"Nifty Pharma":["🇮🇳","India","Medicine and healthcare makers. Many earn a large share of their money from exports."],
"Nifty Metal":["🇮🇳","India","Steel, aluminium, copper and mining companies. Follows global metal prices. (If the index has no history, the chart may use a tracking ETF, so levels can differ.)"],
"Nifty Financial Services":["🇮🇳","India","Banks, insurers and other lenders in one index. A broader finance view than Bank Nifty."],
"Nifty Realty":["🇮🇳","India","Real-estate developers. Sensitive to home-loan interest rates."],
"Nifty PSU Bank":["🇮🇳","India","Government-owned banks such as SBI and Bank of Baroda."],
"Nifty Energy":["🇮🇳","India","Oil, gas and power companies."],
"Nifty Media":["🇮🇳","India","TV, film, news and advertising companies."],
"Nifty Infra":["🇮🇳","India","Companies that build or run roads, ports, power and telecom."],
"India VIX":["🇮🇳","India","The market's 'fear gauge'. It shows how much movement traders expect in the Nifty over the next 30 days. High means nervous, low means calm."],
"S&P 500":["🇺🇸","United States","The 500 largest US companies. The main benchmark for the American stock market."],
"Nasdaq":["🇺🇸","United States","Nasdaq Composite: thousands of US companies, heavy on technology (Apple, Microsoft, Nvidia)."],
"Dow":["🇺🇸","United States","Dow Jones Industrial Average: 30 famous large US companies. One of the oldest indices in the world."],
"Russell 2000":["🇺🇸","United States","About 2,000 small US companies. It shows how smaller American businesses are doing, and is more sensitive to the US economy."],
"VIX":["🇺🇸","United States","The US 'fear gauge': expected swings in the S&P 500 over the next 30 days. It tends to jump when markets fall."],
"Gold":["🥇","Global commodity","Priced in US dollars per ounce. Often seen as a safe asset when people are worried."],
"Silver":["🥈","Global commodity","Priced in US dollars per ounce. Used in jewellery and industry (solar panels, electronics)."],
"Copper":["🟠","Global commodity","Widely used in wiring and construction, so its price is read as a clue to economic growth."],
"Crude WTI":["🛢️","Global commodity (US benchmark)","West Texas Intermediate, the US crude oil price, in dollars per barrel."],
"Brent":["🛢️","Global commodity (world benchmark)","The crude oil price most of the world, including India, uses as a reference. Dollars per barrel."],
"Natural Gas":["🔥","Global commodity (US benchmark)","US natural gas price, used for heating and power. Dollars per million BTU."],
"USD/INR":["💱","Currency","How many Indian rupees one US dollar buys. A higher number means a weaker rupee."]};
var INFO={SMA20:"SMA 20 is the average close of the last 20 days. It smooths daily noise.",SMA50:"SMA 50 averages the last 50 days, a medium-term view.",SMA200:"SMA 200 averages roughly the last 10 months. The classic long-term trend line.",EMA20:"EMA 20 is a 20-day average that gives more weight to recent days, so it reacts faster.",BB:"Bollinger Bands sit 2 standard deviations around a 20-day average. Wide means volatile, narrow means calm.",RSI:"RSI (0 to 100) measures the speed of recent moves. Above 70 is often called overbought, below 30 oversold.",VOL:"Volume shows how much traded each day."};
var COL={SMA20:"#2a7de1",SMA50:"#e08a00",SMA200:"#8e44ad",EMA20:"#00a3a3",BB:"#7f8c8d"};
var COUNT={"1M":22,"3M":66,"6M":126,"1Y":252,"2Y":9999};
var TOOLHINT={cursor:"Cursor: drag to move the chart, scroll to zoom.",h:"Horizontal line: click once to mark a support or resistance level.",t:"Trend line: press, drag and release to connect two points.",r:"Zone: press and drag to shade a box, for example a support area.",x:"Eraser: click a drawing to remove it."};
var data=null,key="Nifty 50",group="India",range="1Y",type="Candles",on={SMA50:true,VOL:true},main=null,rsiC=null,mainSeries=null,lastBar=null,guard=false,tried={},liveQ={},tool="cursor",D={},prev=null,sig="";
(function(){var q=new URLSearchParams(location.search).get("i");if(q&&LIVE[q]){key=q;for(var g in GROUPS)GROUPS[g].forEach(function(s){if(s[1].indexOf(q)>-1)group=g})}})();
function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()}
function f(x){return Number(x).toLocaleString("en-IN",{maximumFractionDigits:2})}
function FL(e){return e==="\uD83C\uDDEE\uD83C\uDDF3"?'<i class="fl fl-in"></i>':e==="\uD83C\uDDFA\uD83C\uDDF8"?'<i class="fl fl-us"></i>':e}
function clean(rows,k){if(!rows)return rows;var thr=k==="USD/INR"?.015:/VIX|Gold|Silver|Crude|Brent|Natural|Copper/.test(k)?.12:.035,o=[],pc=null;rows.forEach(function(r){if(Math.min(r.open,r.high,r.low,r.close)<=0)return;var c=Object.assign({},r),lo=Math.min(c.open,c.close,pc||c.close),hi=Math.max(c.open,c.close,pc||c.close);if(c.low<lo*(1-thr))c.low=lo*.998;if(c.high>hi*(1+thr))c.high=hi*1.002;o.push(c);pc=c.close});return o}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")}
function sma(a,n){var o=[],s=0;for(var i=0;i<a.length;i++){s+=a[i].close;if(i>=n)s-=a[i-n].close;if(i>=n-1)o.push({time:a[i].time,value:s/n})}return o}
function ema(a,n){var k=2/(n+1),o=[],e=null;for(var i=0;i<a.length;i++){e=e===null?a[i].close:a[i].close*k+e*(1-k);if(i>=n-1)o.push({time:a[i].time,value:e})}return o}
function bb(a,n,m){var u=[],l=[];for(var i=n-1;i<a.length;i++){var s=0,q=0,j;for(j=i-n+1;j<=i;j++)s+=a[j].close;var mean=s/n;for(j=i-n+1;j<=i;j++)q+=Math.pow(a[j].close-mean,2);var sd=Math.sqrt(q/n);u.push({time:a[i].time,value:mean+m*sd});l.push({time:a[i].time,value:mean-m*sd})}return[u,l]}
function rsi(a,n){var o=[],g=0,l=0;for(var i=1;i<a.length;i++){var d=a[i].close-a[i-1].close,up=d>0?d:0,dn=d<0?-d:0;if(i<=n){g+=up;l+=dn;if(i===n){g/=n;l/=n;o.push({time:a[i].time,value:l===0?100:100-100/(1+g/l)})}}else{g=(g*(n-1)+up)/n;l=(l*(n-1)+dn)/n;o.push({time:a[i].time,value:l===0?100:100-100/(1+g/l)})}}return o}
function base(el,h){return{width:Math.max(200,el.clientWidth),height:h,layout:{background:{color:"transparent"},textColor:css("--mute")},grid:{vertLines:{color:css("--line")},horzLines:{color:css("--line")}},rightPriceScale:{borderColor:css("--line")},timeScale:{borderColor:css("--line")}}}
/* numbers for a key: last price and change % (uses live quote when present) */
function stat(k){var d=data&&data[k];if(!d||d.length<2){var z=liveQ[k];return z&&z.price&&z.prev?{price:z.price,chg:(z.price-z.prev)/z.prev*100}:null}var n=d.length,l=d[n-1],p=d[n-2],price=l.close,pc=p.close,q=liveQ[k];
 if(q&&q.price){price=q.price;if(q.day>l.time)pc=l.close}
 var c=(price-pc)/pc*100;if(q&&q.prev&&Math.abs(c)>20)c=(price-q.prev)/q.prev*100;return{price:price,chg:c}}
/* ---------- tabs and tiles ---------- */
function drawTabs(){var h="";Object.keys(GROUPS).forEach(function(g){h+='<button class="mk-tab" role="tab" data-g="'+g+'" aria-selected="'+(g===group)+'">'+(g==="India"?'<i class="fl fl-in"></i>':g==="US"?'<i class="fl fl-us"></i>':g==="Commodities"?"\uD83D\uDEE2\uFE0F ":"\uD83D\uDCB1 ")+g+'</button>'});$("tabs").innerHTML=h}
function drawTiles(){var h="";GROUPS[group].forEach(function(sec){var t="";sec[1].forEach(function(k){
  if(data&&Object.keys(data).length&&!data[k]&&!liveQ[k])return;var s=stat(k),cls=s?(s.chg>=0?"u":"d"):"",a=s?Math.min(32,10+Math.abs(s.chg)*9):10;
  t+='<button class="mk-tile '+cls+'" data-k="'+esc(k)+'" aria-pressed="'+(k===key)+'" style="--a:'+a.toFixed(0)+'%"><b>'+esc(k)+'</b><span class="p">'+(s?f(s.price):"&mdash;")+'</span><span class="c">'+(s?(s.chg>=0?"▲ +":"▼ ")+s.chg.toFixed(2)+"%":"")+'</span></button>'});
 if(t)h+='<div class="mk-sec">'+sec[0]+'</div><div class="mk-tiles">'+t+'</div>'});$("tiles").innerHTML=h}
function drawHead(){var a=A[key]||["","",""],s=stat(key);
 $("ttl").innerHTML='<span class="mk-flag">'+FL(a[0])+'</span>'+esc(key);
 $("prc").textContent=s?f(s.price):"";var c=$("chg");c.className="mk-chg "+(s&&s.chg>=0?"up":"dn");c.textContent=s?(s.chg>=0?"▲ +":"▼ ")+s.chg.toFixed(2)+"% today":"";
 $("about").innerHTML='<div class="big">'+FL(a[0])+'</div><div><h3>About '+esc(key)+': '+esc(a[1])+'</h3><p>'+esc(a[2])+'</p><p class="note">Charts show the past. They do not predict the future.</p></div>'}
/* ---------- chart ---------- */
function build(){
 if(main){main.remove();main=null}if(rsiC){rsiC.remove();rsiC=null}mainSeries=null;
 var lg=$("legend"),bx=$("chartbox"),rb=$("rsibox");bx.innerHTML="";rb.innerHTML="";rb.hidden=!on.RSI;drawHead();redraw();
 if(!data){lg.textContent="Chart data appears after the next update.";rb.hidden=true;return}
 if(!data[key]){rb.hidden=true;if(!tried[key]){tried[key]=1;lg.textContent="Loading "+key+" chart…";fetch("/api/history?n="+encodeURIComponent(key)).then(function(r){return r.ok?r.json():Promise.reject()}).then(function(rows){if(rows&&rows.length>=30)data[key]=clean(rows,key);drawTiles();build()}).catch(function(){build()})}else lg.textContent="The "+key+" chart is added by the daily data update. Please check again after the next update.";return}
 if(!window.LightweightCharts){lg.textContent="The chart library did not load. Please refresh the page.";rb.hidden=true;return}
 var d=data[key],n=d.length,hasVol=d.some(function(x){return x.volume>0});
 main=LightweightCharts.createChart(bx,base(bx,bx.clientHeight));
 var s,lines={};
 if(type==="Candles"){s=main.addCandlestickSeries({upColor:"#0f8a5f",downColor:"#d64b3a",borderVisible:false,wickUpColor:"#0f8a5f",wickDownColor:"#d64b3a"});s.setData(d)}
 else if(type==="Line"){s=main.addLineSeries({color:css("--ink"),lineWidth:2});s.setData(d.map(function(x){return{time:x.time,value:x.close}}))}
 else{s=main.addAreaSeries({lineColor:css("--up"),topColor:"rgba(15,138,95,.35)",bottomColor:"rgba(15,138,95,0)",lineWidth:2});s.setData(d.map(function(x){return{time:x.time,value:x.close}}))}
 mainSeries=s;lastBar=d[n-1];
 function line(name,arr,dash){var l=main.addLineSeries({color:COL[name.slice(0,2)==="BB"?"BB":name],lineWidth:name==="SMA200"?3:2,lineStyle:dash?2:0,priceLineVisible:false,lastValueVisible:false,crosshairMarkerVisible:false});l.setData(arr);lines[name]=l}
 if(on.SMA20)line("SMA20",sma(d,20));if(on.SMA50)line("SMA50",sma(d,50));if(on.SMA200)line("SMA200",sma(d,200));if(on.EMA20)line("EMA20",ema(d,20));
 if(on.BB){var b=bb(d,20,2);line("BB upper",b[0],true);line("BB lower",b[1],true)}
 var showVol=on.VOL&&hasVol;
 main.priceScale("right").applyOptions({scaleMargins:{top:.08,bottom:showVol?.24:.08}});
 if(showVol){var v=main.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"vol",priceLineVisible:false,lastValueVisible:false});v.setData(d.map(function(x){return{time:x.time,value:x.volume,color:x.close>=x.open?"rgba(15,138,95,.4)":"rgba(214,75,58,.4)"}}));main.priceScale("vol").applyOptions({scaleMargins:{top:.82,bottom:0}})}
 main.timeScale().setVisibleLogicalRange({from:Math.max(0,n-COUNT[range]),to:n+3});
 if(on.RSI){rsiC=LightweightCharts.createChart(rb,base(rb,150));var r=rsiC.addLineSeries({color:"#8e44ad",lineWidth:2,priceLineVisible:false});r.setData(rsi(d,14));
  r.createPriceLine({price:70,color:css("--down"),lineWidth:1,lineStyle:2,axisLabelVisible:true,title:"70"});r.createPriceLine({price:30,color:css("--up"),lineWidth:1,lineStyle:2,axisLabelVisible:true,title:"30"});
  rsiC.priceScale("right").applyOptions({scaleMargins:{top:.1,bottom:.1}});rsiC.timeScale().setVisibleLogicalRange({from:Math.max(0,n-COUNT[range]),to:n+3});
  main.timeScale().subscribeVisibleLogicalRangeChange(function(x){if(guard||!x||!rsiC)return;guard=true;rsiC.timeScale().setVisibleLogicalRange(x);guard=false});
  rsiC.timeScale().subscribeVisibleLogicalRangeChange(function(x){if(guard||!x||!main)return;guard=true;main.timeScale().setVisibleLogicalRange(x);guard=false})}
 function def(){lg.textContent="Hover over the chart for open, high, low and close."+(on.VOL&&!hasVol?" Volume is not available for this index.":"")+" Source may be delayed."}
 def();
 main.subscribeCrosshairMove(function(q){var x=q.time&&q.seriesData.get(s);if(!x){def();return}
  var t=q.time+(x.open!==undefined?"   O "+f(x.open)+"  H "+f(x.high)+"  L "+f(x.low)+"  C "+f(x.close):"   "+f(x.value));
  Object.keys(lines).forEach(function(k){var y=q.seriesData.get(lines[k]);if(y)t+="   "+k+" "+f(y.value)});lg.textContent=t;redraw()});
 main.timeScale().subscribeVisibleLogicalRangeChange(redraw);
 redraw();
}
/* ---------- drawing layer ---------- */
var cv=null,ctx=null;
function px(p){if(!main||!mainSeries)return null;var x=main.timeScale().logicalToCoordinate(p.l),y=mainSeries.priceToCoordinate(p.p);return(x==null||y==null)?null:{x:x,y:y}}
function pt(x,y){if(!main||!mainSeries)return null;var l=main.timeScale().coordinateToLogical(x),p=mainSeries.coordinateToPrice(y);return(l==null||p==null)?null:{l:l,p:p}}
function label(txt,x,y,col){ctx.font="11px Inter,sans-serif";var w=ctx.measureText(txt).width+8;ctx.fillStyle=col;ctx.fillRect(x-w,y-9,w,18);ctx.fillStyle="#fff";ctx.fillText(txt,x-w+4,y+4)}
function shape(s,W,pv){var c={h:"#e08a00",t:"#2a7de1",r:"#8e44ad"}[s.t];ctx.strokeStyle=c;ctx.lineWidth=pv?1.5:2;ctx.setLineDash(pv?[5,4]:[]);
 if(s.t==="h"){var y=mainSeries.priceToCoordinate(s.p);if(y==null)return;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();label(f(s.p),W-4,y,c);return}
 var a=px(s.a),b=px(s.b);if(!a||!b)return;
 if(s.t==="t"){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();[a,b].forEach(function(q){ctx.fillStyle=c;ctx.beginPath();ctx.arc(q.x,q.y,3,0,7);ctx.fill()})}
 else{ctx.fillStyle="rgba(142,68,173,.16)";ctx.fillRect(a.x,a.y,b.x-a.x,b.y-a.y);ctx.strokeRect(a.x,a.y,b.x-a.x,b.y-a.y)}
 ctx.setLineDash([])}
function redraw(){if(!cv)return;var W=cv.clientWidth,H=cv.clientHeight,r=window.devicePixelRatio||1;if(cv.width!==W*r||cv.height!==H*r){cv.width=W*r;cv.height=H*r}
 ctx.setTransform(r,0,0,r,0,0);ctx.clearRect(0,0,W,H);if(!main||!mainSeries)return;
 (D[key]||[]).forEach(function(s){shape(s,W,false)});if(prev)shape(prev,W,true)}
function dist(s,x,y){if(s.t==="h"){var py=mainSeries.priceToCoordinate(s.p);return py==null?1e9:Math.abs(py-y)}
 var a=px(s.a),b=px(s.b);if(!a||!b)return 1e9;
 if(s.t==="r"){var x1=Math.min(a.x,b.x),x2=Math.max(a.x,b.x),y1=Math.min(a.y,b.y),y2=Math.max(a.y,b.y);return(x>=x1&&x<=x2&&y>=y1&&y<=y2)?0:1e9}
 var dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy,t=L?Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/L)):0;return Math.hypot(x-(a.x+t*dx),y-(a.y+t*dy))}
function setTool(t){tool=t;prev=null;document.querySelectorAll("#tools [data-t]").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.t===t)});cv.style.pointerEvents=t==="cursor"?"none":"auto";cv.style.cursor=t==="x"?"pointer":"crosshair";$("hint").textContent=TOOLHINT[t];redraw()}
function initDraw(){cv=$("draw");ctx=cv.getContext("2d");var start=null;
 function xy(e){var r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
 cv.addEventListener("pointerdown",function(e){if(tool==="cursor"||!mainSeries)return;var m=xy(e),p=pt(m.x,m.y);if(!p)return;
  if(tool==="x"){var L=D[key]||[],best=-1,bd=12;L.forEach(function(s,i){var d=dist(s,m.x,m.y);if(d<bd){bd=d;best=i}});if(best>-1){L.splice(best,1);redraw()}return}
  if(tool==="h"){(D[key]=D[key]||[]).push({t:"h",p:p.p});setTool("cursor");return}
  start=p;cv.setPointerCapture(e.pointerId)});
 cv.addEventListener("pointermove",function(e){if(!start)return;var m=xy(e),p=pt(m.x,m.y);if(!p)return;prev={t:tool,a:start,b:p};redraw()});
 cv.addEventListener("pointerup",function(e){if(!start)return;var m=xy(e),p=pt(m.x,m.y),a=start;start=null;prev=null;
  if(p){var A1=px(a),B1=px(p);if(A1&&B1&&Math.hypot(A1.x-B1.x,A1.y-B1.y)>6)(D[key]=D[key]||[]).push({t:tool,a:a,b:p})}setTool("cursor")});
 document.addEventListener("keydown",function(e){if(e.key==="Escape"&&tool!=="cursor"){start=null;setTool("cursor")}});
 /* keep drawings glued to the chart when the price scale moves */
 (function loop(){if(main&&mainSeries&&(D[key]||[]).length){var s2=[mainSeries.priceToCoordinate(1000),mainSeries.priceToCoordinate(1001),main.timeScale().logicalToCoordinate(0)].join("|");if(s2!==sig){sig=s2;redraw()}}requestAnimationFrame(loop)})()}
/* ---------- events ---------- */
function seg(id,cb){$(id).addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;this.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x===b)});cb(b.dataset.v)})}
seg("rng",function(v){range=v;build()});seg("typ",function(v){type=v;build()});
$("tabs").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;group=b.dataset.g;drawTabs();drawTiles()});
$("tiles").addEventListener("click",function(e){var b=e.target.closest(".mk-tile");if(!b)return;key=b.dataset.k;setTool("cursor");drawTiles();build();var c=$("chartcard");if(c.getBoundingClientRect().top>innerHeight*.6)c.scrollIntoView({behavior:"smooth",block:"start"})});
$("tools").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;if(b.id==="clr"){D[key]=[];redraw();return}setTool(b.dataset.t)});
$("inds").addEventListener("change",function(e){var i=e.target;on[i.value]=i.checked;$("ihelp").innerHTML="<h3>"+esc(i.parentNode.textContent.trim())+"</h3><p>"+INFO[i.value]+"</p><p class=\"note\">Indicators describe the past. They are not buy or sell signals.</p>";build()});
document.addEventListener("click",function(e){var d=document.querySelector(".dd[open]");if(d&&!d.contains(e.target))d.removeAttribute("open")});
function screener(){var b=$("scrbox");b.innerHTML='<div class="tradingview-widget-container" style="height:100%;width:100%"><div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div></div>';var s=document.createElement("script");s.src="https://s3.tradingview.com/external-embedding/embed-widget-screener.js";s.async=true;s.text=JSON.stringify({width:"100%",height:560,defaultColumn:"valuation",defaultScreen:"most_capitalized",market:"india",showToolbar:false,colorTheme:document.documentElement.getAttribute("data-theme")==="dark"?"dark":"light",locale:"en"});b.firstChild.appendChild(s)}
window.addEventListener("themechange",function(){build();screener()});
window.addEventListener("resize",function(){if(main)main.applyOptions({width:Math.max(200,$("chartbox").clientWidth)});if(rsiC)rsiC.applyOptions({width:Math.max(200,$("rsibox").clientWidth)});redraw()});
/* inline the toolbar/indicator checkboxes' initial state */
document.querySelectorAll("#inds input").forEach(function(i){i.checked=!!on[i.value]});
/* ---------- live prices ---------- */
function live(){if(document.hidden)return;fetch("/api/quotes").then(function(r){return r.json()}).then(function(j){var Q=j.quotes||{};
 Object.keys(LIVE).forEach(function(k){var q=Q[LIVE[k]];if(!q||!q.price)return;liveQ[k]={price:q.price,prev:q.prev,day:new Date((q.time+(q.off||0))*1000).toISOString().slice(0,10)}});
 Object.keys(liveQ).forEach(function(k){var d=data&&data[k],z=liveQ[k];if(!(d&&d.length&&Math.abs(d[d.length-1].close/z.price-1)>.35))return;var lc=d[d.length-1].close;
  /* chart and live price disagree: if the quote's own previous close matches the chart, the quote is the odd one out, so ignore it and keep the chart; otherwise the chart is stale, so reload it */
  if(z.prev&&Math.abs(lc/z.prev-1)<.35){delete liveQ[k];return}
  delete data[k];if(k===key){mainSeries=null;lastBar=null;build()}});
 var q=Q[LIVE[key]];if(q&&q.price&&mainSeries&&lastBar){var day=liveQ[key].day;
  if(day===lastBar.time){lastBar.close=q.price;lastBar.high=Math.max(lastBar.high,q.high||q.price);lastBar.low=Math.min(lastBar.low,q.low||q.price);mainSeries.update(type==="Candles"?{time:lastBar.time,open:lastBar.open,high:lastBar.high,low:lastBar.low,close:lastBar.close}:{time:lastBar.time,value:lastBar.close})}}
 drawTiles();drawHead()}).catch(function(){})}
setInterval(live,60000);setTimeout(live,3000);document.addEventListener("visibilitychange",function(){if(!document.hidden)live()});window.addEventListener("online",live);
/* ---------- start ---------- */
drawTabs();initDraw();
fetch("/data/charts.json?t="+Date.now()).then(function(r){return r.json()}).then(function(j){data=j;Object.keys(data).forEach(function(k){data[k]=clean(data[k],k)})}).catch(function(){data={}}).then(function(){drawTiles();build()});
/* ---------- tooltips and indicator explanations ---------- */
(function(){
 var TIPS={cursor:"Cursor: move and zoom the chart.",h:"Horizontal line: marks support (below the price) or resistance (above it). Click once on the chart.",t:"Trend line: click a start point, then an end point.",r:"Zone: click two corners to shade a price area.",x:"Eraser: click a drawing to delete it."},LAB={cursor:"Cursor",h:"Line",t:"Trend",r:"Zone",x:"Erase",clr:"Clear"};
 document.querySelectorAll("#tools button").forEach(function(b){var k=b.dataset.t||b.id;b.dataset.tip=TIPS[k]||"Clear all drawings on this chart.";b.removeAttribute("title");b.insertAdjacentHTML("beforeend",'<span class="tl">'+(LAB[k]||"Clear")+"</span>")});
 document.querySelectorAll("#chartcard .mk-bar [title]").forEach(function(b){b.dataset.tip=b.getAttribute("title");b.removeAttribute("title")});
 var m=$("inds");m.insertAdjacentHTML("beforeend",'<div class="ind-tip" id="indtip">Hover or tap an indicator to see what it means.</div>');
 m.querySelectorAll("label").forEach(function(l){var show=function(){$("indtip").innerHTML="<b>"+esc(l.textContent.trim())+"</b> "+esc(INFO[l.querySelector("input").value]||"")};l.addEventListener("mouseenter",show);l.addEventListener("focusin",show);l.addEventListener("click",show)});
 document.addEventListener("click",function(e){var t=e.target.closest("[data-tip]");if(!t)return;t.classList.add("tip-on");setTimeout(function(){t.classList.remove("tip-on")},2600)});
})();
screener();
})();
