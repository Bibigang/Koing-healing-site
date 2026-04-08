// ── Audio ─────────────────────────────────────────────────
let audioCtx = null;
function getAC() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playBoing() {
  try {
    const ac=getAC(), t=ac.currentTime;
    // main oscillator
    const o=ac.createOscillator(), g=ac.createGain();
    // wobble LFO (gives the rubbery 꼬잉 shimmer)
    const lfo=ac.createOscillator(), lfoG=ac.createGain();
    lfo.frequency.value=22; lfoG.gain.value=38;
    lfo.connect(lfoG); lfoG.connect(o.frequency);
    o.connect(g); g.connect(ac.destination);
    o.type='sine';
    // pitch: swoops up quickly then falls — "꼬↑잉↓"
    o.frequency.setValueAtTime(260,t);
    o.frequency.linearRampToValueAtTime(720,t+0.07);
    o.frequency.exponentialRampToValueAtTime(170,t+0.38);
    // volume: snappy attack, soft tail
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(0.3,t+0.018);
    g.gain.exponentialRampToValueAtTime(0.001,t+0.42);
    lfo.start(t); lfo.stop(t+0.42);
    o.start(t); o.stop(t+0.42);
  } catch(e) {}
}
let stretchSndTimer=0;
function playStretch() {
  if (stretchSndTimer>0) return;
  stretchSndTimer=14;
  try {
    const ac=getAC(), o=ac.createOscillator(), g=ac.createGain();
    o.connect(g); g.connect(ac.destination); o.type='sawtooth';
    o.frequency.setValueAtTime(70,ac.currentTime);
    o.frequency.linearRampToValueAtTime(220,ac.currentTime+0.2);
    g.gain.setValueAtTime(0.07,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.2);
    o.start(); o.stop(ac.currentTime+0.2);
  } catch(e) {}
}
