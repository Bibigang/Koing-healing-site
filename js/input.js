// ── Input state ───────────────────────────────────────────
let draggedFood=null, draggedAcc=null, lastPetX=null, draggedEar=-1;

// ── Scene helpers ─────────────────────────────────────────
function rebuildFoods(idx) {
  draggedFood=null;
  foods.length=0;
  SCENES[idx!==undefined?idx:sceneIdx].items.forEach(item=>foods.push(new Food(item.type,W*item.rx,H*item.ry)));
}

function handleSceneInteraction(x,y) {
  const sid=SCENES[sceneIdx].id;
  if (sid==='spring') {
    if (cloudHit(x,y)) { if(rainTimer<=0)initRain(); rainTimer=120; return true; }
  } else if (sid==='rainy') {
    if (Math.hypot(x-LIGHTNING.rx*W,y-LIGHTNING.ry*H)<H*0.07) { lightningFlash=18; return true; }
    for (const p of PUDDLES) {
      if (Math.hypot(x-p.rx*W,y-p.ry*H)<p.rw*W*1.5) {
        ripples.push({x:p.rx*W,y:p.ry*H,t:0,rw:p.rw,rh:p.rh}); return true;
      }
    }
  } else if (sid==='cozy') {
    const gy=H*0.6;
    // sofa: sx=W*0.04, sy=gy-H*0.2, sw=W*0.28, sh=H*0.17
    if (x>W*0.04&&x<W*0.32&&y>gy-H*0.2&&y<gy) { sofaBounce=40; return true; }
  } else if (sid==='study') {
    const gy=H*0.6;
    // laptop screen area
    const lx=W*0.04, lw=W*0.24;
    if (x>lx&&x<lx+lw&&y>gy-H*0.167&&y<gy) { laptopGlow=90; return true; }
  } else if (sid==='night') {
    if (NIGHT_STARS.some(([rx,ry])=>Math.hypot(x-rx*W,y-ry*H)<H*0.028)) { starEyeTimer=90; return true; }
    const mx=W*0.82, my=H*0.1, mr=H*0.07;
    if (Math.hypot(x-mx,y-my)<mr*1.3) { moonWink=80; return true; }
  }
  return false;
}

function onSceneExit(idx) {
  if (SCENES[idx].id==='rainy') { rainTimer=0; rainDrops=[]; }
  starEyeTimer=0; lightningFlash=0; moonWink=0; ripples=[]; sofaBounce=0; laptopGlow=0;
}

function onSceneEnter(idx) {
  rebuildFoods();
  if (SCENES[idx].id==='rainy') {
    if (rainTimer<=0) initRain();
    rainTimer=Math.max(rainTimer,120);
  }
}

// ── Init ──────────────────────────────────────────────────
const pig=new Pig(W/2);
const foods=[];
rebuildFoods();
const accessories=[
  new Accessory('crown',        0),
  new Accessory('ribbon',       1),
  new Accessory('ribbon_purple',2),
  new Accessory('glasses',      3),
  new Accessory('beanie',       4),
  new Accessory('scarf',        5),
];
updatePanelMaxScroll();

function getXY(e) { const t=e.changedTouches?e.changedTouches[0]:e; return [t.clientX,t.clientY]; }

// ── Petting ───────────────────────────────────────────────
function checkPetting(x,y) {
  if (Math.hypot(x-pig.cx,y-(pig.cy-pig.r*0.55))<pig.r*0.45) {
    const moved=lastPetX!==null?Math.abs(x-lastPetX):0;
    if (moved>3) pig.petLevel=Math.min(1,pig.petLevel+0.055);
    lastPetX=x;
  } else { lastPetX=null; }
}

// ── Input handlers ────────────────────────────────────────
function onDown(x,y) {
  swipeStartX=null; swipeLiveX=x;
  if (handleSceneInteraction(x,y)) return;
  for (const a of accessories) { if(a.hitTest(x,y)){draggedAcc=a;a.startDrag();return;} }
  const pw=Math.min(W*0.13,72);
  if (x<8+pw&&y>H*0.04&&y<H*0.04+H*0.44) {
    panelDragging=true; panelDragStartY=y; panelScrollStart=panelScroll; return;
  }
  const eIdx=pig.earHitTest(x,y);
  if (eIdx>=0) { draggedEar=eIdx; pig.startEarDrag(eIdx); return; }
  for (const f of foods) { if(f.hitTest(x,y)){draggedFood=f;f.startDrag();return;} }
  if (pig.pointerDown(x,y)) { playBoing(); return; }
  // Nothing grabbed → track as potential scene swipe
  swipeStartX=x;
}

function onMove(x,y) {
  if (panelDragging) {
    panelScroll=Math.max(0,Math.min(panelMaxScroll,panelScrollStart-(y-panelDragStartY))); return;
  }
  checkPetting(x,y);
  swipeLiveX=x;
  if (draggedAcc) { draggedAcc.moveTo(x,y); }
  else if (draggedEar>=0) { pig.moveEarDrag(draggedEar,x,y); }
  else if (draggedFood) {
    draggedFood.moveTo(x,y);
    if (draggedFood.type==='flower') {
      if (Math.hypot(x-pig.cx,y-(pig.cy+pig.r*0.2))<pig.r*0.48) {
        pig.sniff(); showBubble('flower'); draggedFood.endDrag(); draggedFood=null;
      }
    } else {
      if (Math.hypot(x-pig.cx,y-(pig.cy+pig.r*0.2))<pig.r*0.5) {
        const _t=draggedFood.type; draggedFood.markEaten(); pig.eat(_t);
        if (MSGS[_t]) showBubble(_t); draggedFood=null;
      }
    }
  } else { pig.pointerMove(x,y); }
}

function onUp(x,y) {
  if (panelDragging) { panelDragging=false; return; }
  if (draggedAcc)      { draggedAcc.endDrag(); draggedAcc=null; }
  else if (draggedEar>=0) { pig.endEarDrag(); draggedEar=-1; }
  else if (draggedFood){ draggedFood.endDrag(); draggedFood=null; }
  else if (pig.active) { pig.pointerUp(x,y); }
  else if (swipeStartX!==null) {
    const delta=x-swipeStartX;
    swipeStartX=null;
    // Commit scene switch if past threshold, else spring back
    if (Math.abs(delta)>W*0.22) {
      onSceneExit(sceneIdx);
      const nextIdx=delta<0?(sceneIdx+1)%SCENES.length:(sceneIdx-1+SCENES.length)%SCENES.length;
      rebuildFoods(nextIdx);
      sceneOffsetPx=delta;
      sceneOffsetTarget=delta<0?-W:W;
    } else {
      sceneOffsetPx=delta;
      sceneOffsetTarget=0;
    }
  }
}

// ── Events ────────────────────────────────────────────────
canvas.addEventListener('mousedown', e=>onDown(...getXY(e)));
canvas.addEventListener('mousemove', e=>onMove(...getXY(e)));
canvas.addEventListener('mouseup',   e=>onUp(...getXY(e)));
canvas.addEventListener('mouseleave',()=>{
  swipeStartX=null;
  if (sceneOffsetPx!==0) sceneOffsetTarget=0;
  panelDragging=false;
  if(draggedAcc){draggedAcc.endDrag();draggedAcc=null;}
  if(draggedEar>=0){pig.endEarDrag();draggedEar=-1;}
  if(draggedFood){draggedFood.endDrag();draggedFood=null;}
  pig.pointerUp();
});
canvas.addEventListener('touchstart',e=>{e.preventDefault();onDown(...getXY(e));},{passive:false});
canvas.addEventListener('touchmove', e=>{e.preventDefault();onMove(...getXY(e));},{passive:false});
canvas.addEventListener('touchend',  e=>{e.preventDefault();onUp(...getXY(e));},{passive:false});
canvas.addEventListener('wheel',e=>{
  const pw=Math.min(W*0.13,72);
  if(e.clientX<8+pw&&e.clientY>H*0.04&&e.clientY<H*0.04+H*0.44){
    panelScroll=Math.max(0,Math.min(panelMaxScroll,panelScroll+e.deltaY*0.4));
    e.preventDefault();
  }
},{passive:false});

window.addEventListener('resize',()=>{
  resize();
  pig.resetAt(W/2);
  rebuildFoods();
  accessories.forEach(a=>a._syncPanel());
  updatePanelMaxScroll();
});
