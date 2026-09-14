const KEY='hajaquant.robots.v1';
export function loadRobots(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
export function saveRobot(robot){const list=loadRobots();const item={...robot,id:robot.id||crypto.randomUUID(),savedAt:new Date().toISOString()};const next=[item,...list.filter(r=>r.id!==item.id)].slice(0,100);localStorage.setItem(KEY,JSON.stringify(next));return item}
export function removeRobot(id){localStorage.setItem(KEY,JSON.stringify(loadRobots().filter(r=>r.id!==id)))}
export function clearRobots(){localStorage.removeItem(KEY)}
