const KEY='hajaquant.robots.v2';
const MAX_TRADES=10000;
export function loadRobots(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
export function saveRobot(robot){const list=loadRobots();const trades=Array.isArray(robot.tradeRows)?robot.tradeRows.slice(-MAX_TRADES).map(t=>({label:t.label,profit:Number(t.profit)})).filter(t=>Number.isFinite(t.profit)):[];const item={...robot,tradeRows:trades,id:robot.id||crypto.randomUUID(),savedAt:new Date().toISOString()};const next=[item,...list.filter(r=>r.id!==item.id)].slice(0,100);try{localStorage.setItem(KEY,JSON.stringify(next))}catch(e){item.tradeRows=[];localStorage.setItem(KEY,JSON.stringify([item,...list.filter(r=>r.id!==item.id)].slice(0,100)))}return item}
export function removeRobot(id){localStorage.setItem(KEY,JSON.stringify(loadRobots().filter(r=>r.id!==id)))}
export function clearRobots(){localStorage.removeItem(KEY)}
