function finite(v){return Number.isFinite(Number(v))?Number(v):0}
function mean(a){return a.length?a.reduce((s,x)=>s+x,0)/a.length:0}
function sd(a){if(a.length<2)return 0;const m=mean(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1))}
function corr(a,b){const n=Math.min(a.length,b.length);if(n<2)return null;const x=a.slice(-n).map(finite),y=b.slice(-n).map(finite),mx=mean(x),my=mean(y);let c=0,dx=0,dy=0;for(let i=0;i<n;i++){const u=x[i]-mx,v=y[i]-my;c+=u*v;dx+=u*u;dy+=v*v}return dx&&dy?c/Math.sqrt(dx*dy):null}
function score(r){const s=finite(r.score);return s>0?s:50}
export function equalWeights(robots){const n=(robots||[]).length;return n?robots.map(()=>1/n):[]}
export function inverseRiskWeights(robots){const r=robots||[];const raw=r.map(x=>1/Math.max(1,Math.abs(finite(x.maxDDPct))));const sum=raw.reduce((a,b)=>a+b,0);return sum?raw.map(x=>x/sum):equalWeights(r)}
export function scoreWeights(robots){const r=robots||[];const raw=r.map(score);const sum=raw.reduce((a,b)=>a+b,0);return sum?raw.map(x=>x/sum):equalWeights(r)}
export function optimizePortfolio(robots,mode='score'){
 const r=(robots||[]).filter(x=>Number.isFinite(Number(x.net)));if(!r.length)return{robots:[],weights:[],net:0,avgDD:0,score:0,correlation:null,concentration:0};
 const weights=mode==='inverseRisk'?inverseRiskWeights(r):mode==='equal'?equalWeights(r):scoreWeights(r);
 const net=r.reduce((s,x,i)=>s+finite(x.net)*weights[i],0);
 const avgDD=r.reduce((s,x,i)=>s+Math.abs(finite(x.maxDDPct))*weights[i],0);
 const avgScore=r.reduce((s,x,i)=>s+score(x)*weights[i],0);
 const concentration=Math.round(Math.max(...weights)*100);
 const pairs=[];for(let i=0;i<r.length;i++)for(let j=i+1;j<r.length;j++){const a=(r[i].tradeRows||[]).map(x=>finite(x.profit)),b=(r[j].tradeRows||[]).map(x=>finite(x.profit));const c=corr(a,b);if(c!==null)pairs.push(c)}
 const avgCorr=pairs.length?mean(pairs):null;
 return{robots:r,weights,net,avgDD,score:Math.round(avgScore),avgCorrelation:avgCorr,concentration}
}
export function bestPortfolio(robots){const modes=['score','inverseRisk','equal'];const candidates=modes.map(mode=>({mode,...optimizePortfolio(robots,mode)}));return candidates.sort((a,b)=>b.score-a.score||b.net-a.net)[0]||null}
