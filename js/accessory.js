// ── Accessory ─────────────────────────────────────────────
class Accessory {
  constructor(type,idx) {
    this.type=type; this.idx=idx;
    this.worn=false; this.wornSide='right'; this.dragging=false;
    this.x=0; this.y=0; this._syncPanel();
  }
  _syncPanel() {
    const pw=Math.min(W*0.13,72);
    this.panelX=8+pw/2; this.panelY=H*0.12+this.idx*H*0.075;
    if (!this.worn&&!this.dragging) { this.x=this.panelX; this.y=this.panelY; }
  }
  get _panelS() { return Math.min(W*0.08,50); }
  get _wornS() {
    const r=pig.r;
    if (this.type==='crown') return r*0.65;
    if (this.type==='ribbon'||this.type==='ribbon_purple') return r*0.42;
    if (this.type==='beanie') return r*0.65;
    if (this.type==='scarf') return r*0.68;
    return r*0.82;
  }
  _wornPos() {
    const {cx,cy,r}=pig;
    if (this.type==='crown') return {x:cx,y:cy-r*1.18};
    if (this.type==='ribbon'||this.type==='ribbon_purple') {
      const sign=this.wornSide==='left'?-1:1;
      return {x:cx+sign*r*0.42,y:cy-r*0.72};
    }
    if (this.type==='beanie') return {x:cx,y:cy-r*1.02};
    if (this.type==='scarf') return {x:cx,y:cy+r*0.82};
    return {x:cx,y:cy-r*0.1};
  }
  hitTest(mx,my) {
    let hx,hy;
    if (this.worn) { const p=this._wornPos(); hx=p.x; hy=p.y; }
    else if (this.dragging) { hx=this.x; hy=this.y; }
    else {
      if (panelSlide<0.5) return false;
      const ox=panelOffsetX();
      hx=this.panelX+ox; hy=this.panelY-panelScroll;
      const pw=Math.min(W*0.13,72);
      if (mx<8+ox||mx>8+ox+pw||my<H*0.09||my>H*0.09+H*0.44) return false;
    }
    const s=this.worn?this._wornS:this._panelS;
    return Math.hypot(mx-hx,my-hy)<s*0.85;
  }
  startDrag() {
    if (this.worn) { const p=this._wornPos(); this.x=p.x; this.y=p.y; this.worn=false; }
    this.dragging=true;
  }
  moveTo(x,y) { if(this.dragging){this.x=x;this.y=y;} }
  endDrag() {
    this.dragging=false;
    if (Math.hypot(this.x-pig.cx,this.y-pig.cy)<pig.r*1.8) {
      this.worn=true;
      if (this.type==='ribbon'||this.type==='ribbon_purple') {
        const dl=Math.hypot(this.x-(pig.cx-pig.r*0.42),this.y-(pig.cy-pig.r*0.72));
        const dr=Math.hypot(this.x-(pig.cx+pig.r*0.42),this.y-(pig.cy-pig.r*0.72));
        this.wornSide=dl<dr?'left':'right';
      }
    } else { this.worn=false; this.x=this.panelX; this.y=this.panelY; }
  }
  draw(ctx) {
    const {x,y}=this.worn?this._wornPos():this;
    const s=this.worn?this._wornS:this._panelS;
    if (this.type==='crown')              this._crown(ctx,x,y,s);
    else if (this.type==='ribbon')        this._ribbon(ctx,x,y,s,'#FF1493','#CC0066','#FF55AA');
    else if (this.type==='ribbon_purple') this._ribbon(ctx,x,y,s,'#9933CC','#6611AA','#BB55EE');
    else if (this.type==='beanie')        this._beanie(ctx,x,y,s);
    else if (this.type==='scarf')         this._scarf(ctx,x,y,s);
    else                                  this._glasses(ctx,x,y,s);
  }
  _crown(ctx,x,y,s) {
    ctx.save();
    ctx.beginPath(); ctx.moveTo(x-s*0.5,y+s*0.35); ctx.lineTo(x-s*0.5,y+s*0.05); ctx.lineTo(x-s*0.15,y-s*0.38);
    ctx.lineTo(x,y-s*0.62); ctx.lineTo(x+s*0.15,y-s*0.38); ctx.lineTo(x+s*0.5,y+s*0.05); ctx.lineTo(x+s*0.5,y+s*0.35); ctx.closePath();
    ctx.fillStyle='#FFD700'; ctx.fill(); ctx.strokeStyle='#BF9B00'; ctx.lineWidth=Math.max(1.5,s*0.04); ctx.stroke();
    for (const [gx,gy,gc] of [[x,y-s*0.57,'#FF99CC'],[x-s*0.28,y,'#99DDFF'],[x+s*0.28,y,'#AAFFAA']]) {
      ctx.beginPath(); ctx.arc(gx,gy,Math.max(2,s*0.1),0,Math.PI*2); ctx.fillStyle=gc; ctx.fill();
    }
    ctx.restore();
  }
  _ribbon(ctx,x,y,s,c1,c2,c3) {
    ctx.save(); ctx.lineWidth=Math.max(1.5,s*0.04);
    for (const sign of [-1,1]) {
      ctx.beginPath(); ctx.moveTo(x,y);
      ctx.bezierCurveTo(x+sign*s*0.15,y-s*0.45,x+sign*s*0.6,y-s*0.3,x+sign*s*0.55,y);
      ctx.bezierCurveTo(x+sign*s*0.6,y+s*0.3,x+sign*s*0.15,y+s*0.45,x,y);
      ctx.fillStyle=c1; ctx.fill(); ctx.strokeStyle=c2; ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(x,y,s*0.13,0,Math.PI*2); ctx.fillStyle=c3; ctx.fill(); ctx.strokeStyle=c2; ctx.stroke();
    ctx.restore();
  }
  _glasses(ctx,x,y,s) {
    ctx.save();
    const fw=s*0.42,fh=s*0.32,gap=s*0.12,rad=Math.max(2,s*0.06);
    ctx.lineWidth=Math.max(2,s*0.06); ctx.strokeStyle='#55AADD'; ctx.fillStyle='rgba(135,206,235,0.28)';
    ctx.beginPath(); ctx.roundRect(x-gap-fw,y-fh/2,fw,fh,rad); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(x+gap,y-fh/2,fw,fh,rad); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-gap,y+fh*0.05); ctx.lineTo(x+gap,y+fh*0.05); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x-gap-fw,y+fh*0.05); ctx.lineTo(x-gap-fw-s*0.22,y+fh*0.18);
    ctx.moveTo(x+gap+fw,y+fh*0.05); ctx.lineTo(x+gap+fw+s*0.22,y+fh*0.18);
    ctx.stroke(); ctx.restore();
  }
  _beanie(ctx,x,y,s) {
    ctx.save();
    ctx.beginPath(); ctx.arc(x,y+s*0.1,s*0.5,Math.PI,0); ctx.closePath();
    ctx.fillStyle='#FF6633'; ctx.fill();
    for (const yo of [s*0.04,-s*0.09]) {
      ctx.save(); ctx.beginPath(); ctx.arc(x,y+s*0.1,s*0.5,Math.PI,0); ctx.closePath(); ctx.clip();
      ctx.fillStyle='rgba(255,255,255,0.33)'; ctx.fillRect(x-s*0.55,y+yo,s*1.1,s*0.1); ctx.restore();
    }
    ctx.beginPath(); ctx.roundRect(x-s*0.52,y+s*0.1,s*1.04,s*0.2,3);
    ctx.fillStyle='#CC4411'; ctx.fill(); ctx.strokeStyle='#AA2200'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y-s*0.4,s*0.14,0,Math.PI*2);
    ctx.fillStyle='#FFEECC'; ctx.fill(); ctx.strokeStyle='#DDCCAA'; ctx.lineWidth=1; ctx.stroke();
    ctx.restore();
  }
  _scarf(ctx,x,y,s) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x-s*0.09,y+s*0.13); ctx.lineTo(x+s*0.09,y+s*0.13);
    ctx.lineTo(x+s*0.20,y+s*0.58); ctx.lineTo(x,y+s*0.74); ctx.lineTo(x-s*0.20,y+s*0.58);
    ctx.closePath();
    ctx.fillStyle='#2299BB'; ctx.fill(); ctx.strokeStyle='#0077AA'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x-s*0.09,y+s*0.13); ctx.lineTo(x+s*0.09,y+s*0.13);
    ctx.lineTo(x+s*0.20,y+s*0.58); ctx.lineTo(x,y+s*0.74); ctx.lineTo(x-s*0.20,y+s*0.58);
    ctx.closePath(); ctx.clip();
    for (let i=0;i<=5;i++) {
      ctx.fillStyle='rgba(255,255,255,0.28)';
      ctx.fillRect(x-s*0.24,y+s*0.16+i*s*0.10,s*0.48,s*0.05);
    }
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(x,y-s*0.16); ctx.lineTo(x+s*0.17,y); ctx.lineTo(x,y+s*0.16); ctx.lineTo(x-s*0.17,y);
    ctx.closePath();
    ctx.fillStyle='#2299BB'; ctx.fill(); ctx.strokeStyle='#0077AA'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x,y-s*0.16); ctx.lineTo(x+s*0.17,y); ctx.lineTo(x,y+s*0.16); ctx.lineTo(x-s*0.17,y);
    ctx.closePath(); ctx.clip();
    for (let i=-1;i<=1;i++) {
      ctx.fillStyle='rgba(255,255,255,0.28)';
      ctx.fillRect(x+i*s*0.10-s*0.03,y-s*0.2,s*0.06,s*0.4);
    }
    ctx.restore();
    ctx.restore();
  }
}
