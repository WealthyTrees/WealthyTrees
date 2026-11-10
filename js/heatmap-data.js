/* WealthyTrees heatmap-data.js — loads the 18 heatmap tiles from the site's own data.
   WTHM.load() returns a Promise of {tiles, mood, fetched}.
   tiles: [{id,name,group,weight,price,prev,pct,asOf,source}]
   Never invents prices: a market with no data is left out. */
(function(){
"use strict";
/* id, display name, group, treemap weight, quote symbol for /api/quotes */
var DEFS=[
 ["nifty50","Nifty 50","India",30,"NIFTY 50"],
 ["sensex","Sensex","India",26,"SENSEX"],
 ["banknifty","Bank Nifty","India",18,"BANK NIFTY"],
 ["niftyit","Nifty IT","Sectors",12,"NIFTY IT"],
 ["niftypharma","Nifty Pharma","Sectors",9,"NIFTY PHARMA"],
 ["niftyauto","Nifty Auto","Sectors",8,"NIFTY AUTO"],
 ["niftymetal","Nifty Metal","Sectors",6,"NIFTY METAL"],
 ["sp500","S&P 500","US Markets",22,"S&P 500"],
 ["nasdaq","Nasdaq","US Markets",18,"NASDAQ"],
 ["dow","Dow","US Markets",16,"DOW"],
 ["gold","Gold","Commodities & Currency",10,"GOLD $/oz"],
 ["silver","Silver","Commodities & Currency",5,"SILVER $/oz"],
 ["crudewti","Crude WTI","Commodities & Currency",7,"CRUDE WTI"],
 ["brent","Brent","Commodities & Currency",6,"BRENT"],
 ["copper","Copper","Commodities & Currency",4,"COPPER"],
 ["natgas","Natural Gas","Commodities & Currency",3,"NATURAL GAS"],
 ["usdinr","USD/INR","Commodities & Currency",4,"USD/INR"],
 ["indiavix","India VIX","Commodities & Currency",3,"INDIA VIX"]
];
function fetchJSON(url){return fetch(url).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json()})}
function load(){
 var chartsP=fetchJSON("/data/charts.json");
 var quotesP=fetchJSON("/api/quotes").then(function(j){return j.quotes||{}}).catch(function(){return {}});
 return Promise.all([chartsP,quotesP]).then(function(parts){
  var data=parts[0], Q=parts[1], tiles=[], wSum=0, wPct=0;
  DEFS.forEach(function(d){
   var rows=data[d[1]];
   if(!rows||rows.length<2)return;
   var last=rows[rows.length-1], prev=rows[rows.length-2];
   if(!(last.close>0&&prev.close>0))return;
   var price=last.close, pc=prev.close, source="close", asOf=last.time;
   var q=Q[d[4]];
   if(q&&q.price>0&&q.prev>0){
    /* live quote: use it only if it is sane against the chart's own previous close */
    if(Math.abs(last.close/q.price-1)<0.35&&Math.abs(q.prev/pc-1)<0.35){
     price=q.price; pc=q.prev; source="live";
     if(q.time)asOf=new Date((q.time+(q.off||0))*1000).toISOString().slice(0,10);
    }
   }
   var pct=(price-pc)/pc*100;
   if(!isFinite(pct))return;
   tiles.push({id:d[0],name:d[1],group:d[2],weight:d[3],price:price,prev:pc,pct:pct,asOf:asOf,source:source});
   wSum+=d[3]; wPct+=d[3]*pct;
  });
  var mood=wSum>0?wPct/wSum:0;
  return {tiles:tiles,mood:mood,fetched:new Date().toISOString()};
 });
}
window.WTHM={load:load};
})();
