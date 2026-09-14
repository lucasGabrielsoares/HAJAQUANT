export function analyzePortfolio(robots){
  const valid=(robots||[]).filter(r=>Number.isFinite(r.net));
  if(!valid.length) return {robots:[],net:0,dd:0,weightedScore:0};
  const net=valid.reduce((s,r)=>s+r.net,0);
  const dd=valid.reduce((s,r)=>s+Math.abs(r.maxDD||0),0);
  const weightedScore=valid.reduce((s,r)=>s+(r.score||0),0)/valid.length;
  const totalTrades=valid.reduce((s,r)=>s+(r.trades||0),0);
  const pfGrossProfit=valid.reduce((s,r)=>s+(r.grossProfit||0),0);
  const pfGrossLoss=valid.reduce((s,r)=>s+Math.abs(r.grossLoss||0),0);
  return {robots:valid,net,dd,weightedScore:Math.round(weightedScore),totalTrades,profitFactor:pfGrossLoss?pfGrossProfit/pfGrossLoss:null};
}

export function correlation(a,b){
  const n=Math.min(a.length,b.length); if(n<2)return null;
  const x=a.slice(-n),y=b.slice(-n); const ax=x.reduce((s,v)=>s+v,0)/n,ay=y.reduce((s,v)=>s+v,0)/n;
  let num=0,dx=0,dy=0; for(let i=0;i<n;i++){const u=x[i]-ax,v=y[i]-ay;num+=u*v;dx+=u*u;dy+=v*v;}
  return dx&&dy?num/Math.sqrt(dx*dy):null;
}
