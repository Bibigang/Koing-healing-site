// ── Constants ─────────────────────────────────────────────
const influenceValue=0.4;
const N=24, K_RESTORE=0.15, K_NEIGHBOR=0.07, DAMPING=0.74, MAX_DEFORM=1.7;

// ── Helpers ───────────────────────────────────────────────
function lerpColor(c1,c2,t) {
  t=Math.max(0,Math.min(1,t));
  const p=(c,s)=>parseInt(c.slice(s,s+2),16);
  const mix=(a,b)=>Math.round(a+(b-a)*t).toString(16).padStart(2,'0');
  return `#${mix(p(c1,1),p(c2,1))}${mix(p(c1,3),p(c2,3))}${mix(p(c1,5),p(c2,5))}`;
}
function smoothPath(ctx,pts) {
  const n=pts.length;
  ctx.moveTo((pts[n-1].x+pts[0].x)/2,(pts[n-1].y+pts[0].y)/2);
  for (let i=0;i<n;i++) {
    const c=pts[i], nx=pts[(i+1)%n];
    ctx.quadraticCurveTo(c.x,c.y,(c.x+nx.x)/2,(c.y+nx.y)/2);
  }
  ctx.closePath();
}

// ── Rain ──────────────────────────────────────────────────
let rainTimer=0, rainDrops=[];
function initRain() {
  rainDrops=Array.from({length:70},()=>({
    x:Math.random()*W, y:Math.random()*H*0.6,
    speed:2+Math.random()*2, len:10+Math.random()*8,
  }));
}
const CLOUDS=[{rx:0.25,ry:0.07,rs:0.07},{rx:0.65,ry:0.04,rs:0.085},{rx:0.83,ry:0.11,rs:0.055}];
function cloudHit(mx,my) {
  return CLOUDS.some(c=>Math.hypot(mx-c.rx*W,my-c.ry*H)<c.rs*Math.min(W,H)*1.7);
}
const NIGHT_STARS=[[0.1,0.08],[0.25,0.04],[0.4,0.12],[0.55,0.05],[0.7,0.1],
                   [0.85,0.06],[0.15,0.22],[0.6,0.2],[0.9,0.18],[0.35,0.3],
                   [0.75,0.28],[0.05,0.33],[0.48,0.08],[0.92,0.3],[0.62,0.35]];
const LIGHTNING={rx:0.55,ry:0.18};
// Puddles: rx,ry = center (relative), rw,rh = half-axes (relative) — small/large/medium
const PUDDLES=[{rx:0.2,ry:0.63,rw:0.032,rh:0.009},{rx:0.55,ry:0.65,rw:0.072,rh:0.018},{rx:0.78,ry:0.62,rw:0.05,rh:0.013}];

// ── Scene state ───────────────────────────────────────────
let sceneIdx=0;
let sceneOffsetPx=0, sceneOffsetTarget=0; // horizontal slide animation
let swipeStartX=null, swipeLiveX=0;       // live swipe tracking
let starEyeTimer=0, starPulse=0, lightningFlash=0;
let moonWink=0;        // >0: moon is winking (counts down)
let ripples=[];        // [{x,y,t}] water ripple effects
let sofaBounce=0;      // >0: sofa cushion bouncing (counts down)
let laptopGlow=0;      // >0: laptop screen lit up (counts down)

// ── Panel scroll ──────────────────────────────────────────
let panelScroll=0, panelMaxScroll=0;
let panelDragging=false, panelDragStartY=0, panelScrollStart=0;
function updatePanelMaxScroll() {
  const ph=H*0.44;
  const lastY=H*0.09+(accessories.length-1)*H*0.10+H*0.09;
  panelMaxScroll=Math.max(0,lastY-H*0.04-ph);
  panelScroll=Math.min(panelScroll,panelMaxScroll);
}
