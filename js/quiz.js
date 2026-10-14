/* WealthyTrees quiz.js v1: interactive 3-question quiz with confetti and score */
(function(){var box=document.getElementById("quiz"),d=document.getElementById("qdata");if(!box||!d)return;
var Q=JSON.parse(d.textContent),i=0,sc=0,res=[],mod=(location.pathname.match(/module-(\d+)/)||[])[1],rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function boom(n){if(rm)return;var c=document.createElement("canvas"),x=c.getContext("2d"),w=c.width=innerWidth,h=c.height=innerHeight,k=["#0f8a5f","#e0a82e","#c8452f","#2f6fdb","#9b59b6"],P=[],t=0;
c.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:9999";document.body.appendChild(c);
for(var j=0;j<n;j++)P.push({x:w/2,y:h*.6,vx:(Math.random()-.5)*14,vy:-Math.random()*14-4,s:5+Math.random()*6,c:k[j%5],r:Math.random()*6});
(function f(){t++;x.clearRect(0,0,w,h);P.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.vy+=.35;p.r+=.2;x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillRect(-p.s/2,-p.s/3,p.s,p.s*.6);x.restore()});t<110?requestAnimationFrame(f):c.remove()})()}
function dots(){return'<div class="qdots">'+Q.map(function(_,n){return'<i class="'+(res[n]||(n==i?"on":""))+'"></i>'}).join("")+"</div>"}
function show(){var q=Q[i];box.innerHTML="<h3>Quick quiz</h3>"+dots()+'<p class="qq">'+(i+1)+". "+q.q+"</p>"+q.o.map(function(o,n){return'<button type="button" class="qopt" data-n="'+n+'">'+o+"</button>"}).join("")+'<div class="qfb" aria-live="polite"></div>';
box.querySelectorAll(".qopt").forEach(function(b){b.onclick=function(){pick(+b.dataset.n)}})}
function pick(n){var q=Q[i],bs=box.querySelectorAll(".qopt"),ok=n==q.a,fb=box.querySelector(".qfb");bs.forEach(function(b){b.disabled=true});
bs[q.a].classList.add("ok");if(!ok)bs[n].classList.add("bad");res[i]=ok?"ok":"bad";if(ok){sc++;boom(70)}
fb.textContent=(ok?"Correct! ":"Not quite. The answer is: "+q.o[q.a]+". ")+q.e;box.querySelector(".qdots").outerHTML=dots();
var b=document.createElement("button");b.type="button";b.className="btn";b.textContent=i<Q.length-1?"Next question \u2192":"See my score";b.onclick=function(){i++;i<Q.length?show():end()};box.appendChild(b)}
function end(){var best=0;try{best=+localStorage.getItem("wt-quiz-"+mod)||0;if(sc>best){best=sc;localStorage.setItem("wt-quiz-"+mod,String(sc))}}catch(e){}
var m=sc==Q.length?"Perfect! You nailed it.":sc>=2?"Great work. Almost there.":"Good start. Read the lessons again and retry.";if(sc>=2)boom(sc==Q.length?220:100);
box.innerHTML="<h3>Quick quiz</h3>"+dots()+'<div class="qres"><b>'+sc+" / "+Q.length+"</b>"+m+"<br><small>Best score: "+best+" / "+Q.length+"</small></div>";
var b=document.createElement("button");b.type="button";b.className="btn";b.textContent="Try again";b.onclick=function(){i=0;sc=0;res=[];show()};box.appendChild(b)}
show()})();
