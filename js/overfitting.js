export function overfitDiagnostics(m){
  const warnings=[]; const t=m.trades||0;
  if(t<100) warnings.push('Poucos trades: a amostra pode ser estatisticamente fraca.');
  if((m.pf||0)>3) warnings.push('Profit Factor muito alto: investigue overfitting e condições específicas do backtest.');
  if((m.sharpe||0)>3) warnings.push('Sharpe excepcionalmente alto: valide em período fora da amostra.');
  if((m.maxDDPct||0)>-5 && (m.pf||0)>2) warnings.push('Retorno alto com drawdown muito baixo merece validação adicional.');
  const score=100-Math.min(100,warnings.length*20);
  return {warnings,score,label:score>=80?'Baixo alerta':score>=50?'Atenção':'Alto alerta'};
}
