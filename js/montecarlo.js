export function runMonteCarlo(trades, simulations=5000){
  const values=(trades||[]).map(t=>Number(t.profit)).filter(Number.isFinite);
  if(values.length<10) throw new Error('São necessários pelo menos 10 trades para uma simulação Monte Carlo.');
  const base=values.reduce((a,b)=>a+b,0);
  const results=[];
  const drawdowns=[];
  const finals=[];
  for(let s=0;s<simulations;s++){
    let equity=0,peak=0,maxDD=0;
    for(let i=0;i<values.length;i++){
      const v=values[Math.floor(Math.random()*values.length)];
      equity+=v; peak=Math.max(peak,equity); maxDD=Math.min(maxDD,equity-peak);
    }
    finals.push(equity); drawdowns.push(Math.abs(maxDD)); results.push({final:equity,drawdown:Math.abs(maxDD)});
  }
  finals.sort((a,b)=>a-b); drawdowns.sort((a,b)=>a-b);
  const pct=(arr,p)=>arr[Math.min(arr.length-1,Math.max(0,Math.floor((arr.length-1)*p)))];
  return {
    simulations, trades:values.length, originalNet:base,
    final:{p5:pct(finals,.05),p25:pct(finals,.25),median:pct(finals,.5),p75:pct(finals,.75),p95:pct(finals,.95)},
    drawdown:{p5:pct(drawdowns,.05),p25:pct(drawdowns,.25),median:pct(drawdowns,.5),p75:pct(drawdowns,.75),p95:pct(drawdowns,.95)},
    probabilityLoss:finals.filter(v=>v<0).length/simulations*100,
    probabilityDD:(threshold)=>drawdowns.filter(v=>v>=threshold).length/simulations*100,
    samples:results.slice(0,250)
  };
}
