function stdev(values){if(values.length<2)return null;const mean=values.reduce((a,b)=>a+b,0)/values.length;const variance=values.reduce((s,x)=>s+(x-mean)**2,0)/(values.length-1);return Math.sqrt(variance)}
function downsideDeviation(values){const negatives=values.filter(x=>x<0);if(negatives.length<2)return null;return Math.sqrt(negatives.reduce((s,x)=>s+x*x,0)/(negatives.length-1))}
export function calculateMetrics(d){
 const eq=d.equity||[]; const ts=d.tradeRows||[];
 const wins=ts.filter(t=>Number(t.profit)>0).map(t=>Number(t.profit));
 const losses=ts.filter(t=>Number(t.profit)<0).map(t=>Number(t.profit));
 let peak=eq[0]??d.initial??0,maxDD=0,maxDDPct=0;const dd=[];
 for(const v of eq){if(v>peak)peak=v;const x=v-peak;dd.push(x);if(x<maxDD)maxDD=x;if(peak>0)maxDDPct=Math.min(maxDDPct,x/peak*100)}
 const net=d.net??(eq.length?eq.at(-1)-eq[0]:0); const n=ts.length;
 const mean=n?ts.reduce((s,t)=>s+Number(t.profit||0),0)/n:null;
 const sd=n?stdev(ts.map(t=>Number(t.profit||0))):null;
 const downside=n?downsideDeviation(ts.map(t=>Number(t.profit||0))):null;
 const sharpe=sd&&sd>0?mean/sd*Math.sqrt(n):null;
 const sortino=downside&&downside>0?mean/downside*Math.sqrt(n):null;
 const avgWin=wins.length?wins.reduce((a,b)=>a+b,0)/wins.length:null;
 const avgLoss=losses.length?losses.reduce((a,b)=>a+b,0)/losses.length:null;
 const winRate=n?wins.length/n*100:null;
 const expectancy=n?net/n:null;
 const grossProfit=wins.reduce((a,b)=>a+b,0), grossLoss=Math.abs(losses.reduce((a,b)=>a+b,0));
 const pf=d.pf??(grossLoss?grossProfit/grossLoss:null);
 const recovery=Math.abs(maxDD)>0?net/Math.abs(maxDD):null;
 const initial=d.initial??(eq[0]??null);
 const returnPct=initial&&initial>0?net/initial*100:null;
 const calmar=returnPct!==null&&maxDDPct<0?returnPct/Math.abs(maxDDPct):null;
 const sqn=n>=2&&sd>0?Math.sqrt(n)*mean/sd:null;
 const volatility=initial&&sd!==null?sd/initial*100:null;
 let maxWinStreak=0,maxLossStreak=0,w=0,l=0;
 for(const t of ts){if(t.profit>0){w++;l=0;maxWinStreak=Math.max(maxWinStreak,w)}else if(t.profit<0){l++;w=0;maxLossStreak=Math.max(maxLossStreak,l)}}
 const lossRate=n?wins.length?losses.length/n:0:0;
 const riskOfRuin=lossRate>0&&winRate!==null?Math.min(100,Math.max(0,Math.pow(lossRate,10)*100)):null;
 return {...d,maxDD,maxDDPct,sharpe:d.sharpe??sharpe,sortino,pf,trades:d.trades??n,winRate:d.winRate??winRate,avgWin,avgLoss,expectancy,recovery,maxWinStreak,maxLossStreak,returnPct,calmar,sqn,volatility,riskOfRuin,grossProfit,grossLoss,ddSeries:eq.map((v,i)=>({value:v,dd:dd[i]}))};
}
export function qualityScore(m){
 let score=0;if((m.pf??0)>1.5)score+=22;else if((m.pf??0)>1.2)score+=17;else if((m.pf??0)>1)score+=10;
 if((m.sharpe??0)>1.5)score+=20;else if((m.sharpe??0)>1)score+=16;else if((m.sharpe??0)>.5)score+=9;
 if((m.sortino??0)>1.5)score+=12;else if((m.sortino??0)>1)score+=9;else if((m.sortino??0)>.5)score+=5;
 if((m.trades??0)>=500)score+=16;else if((m.trades??0)>=300)score+=13;else if((m.trades??0)>=100)score+=8;else if((m.trades??0)>=30)score+=4;
 if((m.maxDDPct??0)>-10)score+=12;else if((m.maxDDPct??0)>-20)score+=7;else if((m.maxDDPct??0)>-30)score+=3;
 if((m.recovery??0)>3)score+=10;else if((m.recovery??0)>2)score+=8;else if((m.recovery??0)>1)score+=4;
 return Math.max(0,Math.min(100,Math.round(score)));
}