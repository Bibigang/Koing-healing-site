// ── Food ──────────────────────────────────────────────────
class Food {
  constructor(type,rx,ry) {
    this.type=type; this.rx=rx; this.ry=ry;
    this.x=rx; this.y=ry; this.dragging=false; this.eaten=false; this.respawn=0;
  }
  get size() { return Math.min(W,H)*0.21; }
  hitTest(mx,my) { return !this.eaten&&Math.hypot(mx-this.x,my-this.y)<this.size*0.85; }
  update() {
    if (this.eaten) { this.respawn--; if(this.respawn<=0){this.eaten=false;this.x=this.rx;this.y=this.ry;} }
  }
  startDrag() { this.dragging=true; }
  moveTo(x,y) { if(this.dragging){this.x=x;this.y=y;} }
  endDrag() { this.dragging=false; if(!this.eaten){this.x=this.rx;this.y=this.ry;} }
  markEaten() { this.eaten=true; this.dragging=false; this.respawn=45; }

  draw(ctx) {
    if (this.eaten) return;
    const {x,y}=this; const s=this.size;
    const m={
      cupcake: ()=>this._drawCupcake(ctx,x,y,s),
      cocktail:()=>this._drawCocktail(ctx,x,y,s),
      flower:  ()=>this._drawFlower(ctx,x,y,s),
      clover:  ()=>this._drawClover(ctx,x,y,s),
      juice:   ()=>this._drawJuice(ctx,x,y,s),
      hotmilk: ()=>this._drawHotmilk(ctx,x,y,s),
      cookie:  ()=>this._drawCookie(ctx,x,y,s),
      teacup:  ()=>this._drawTeacup(ctx,x,y,s),
      cocoa:   ()=>this._drawCocoa(ctx,x,y,s),
      lollipop:()=>this._drawLollipop(ctx,x,y,s),
      macaron: ()=>this._drawMacaron(ctx,x,y,s),
      camera:   ()=>this._drawCamera(ctx,x,y,s),
      bulgogi:  ()=>this._drawBulgogi(ctx,x,y,s),
      soju:     ()=>this._drawSoju(ctx,x,y,s),
      coffee:   ()=>this._drawCoffee(ctx,x,y,s),
      odeng:      ()=>this._drawOdeng(ctx,x,y,s),
      icecream:   ()=>this._drawIcecream(ctx,x,y,s),
      chicken:    ()=>this._drawChicken(ctx,x,y,s),
      tteokbokki: ()=>this._drawTteokbokki(ctx,x,y,s),
      ramen:      ()=>this._drawRamen(ctx,x,y,s),
      pajeon:     ()=>this._drawPajeon(ctx,x,y,s),
      samgyeopsal:()=>this._drawSamgyeopsal(ctx,x,y,s),
      makgeolli:  ()=>this._drawMakgeolli(ctx,x,y,s),
    };
    (m[this.type]||m.flower)();
  }

  _drawCupcake(ctx,x,y,s) {
    ctx.beginPath(); ctx.moveTo(x-s*0.38,y-s*0.05); ctx.lineTo(x-s*0.28,y+s*0.45);
    ctx.lineTo(x+s*0.28,y+s*0.45); ctx.lineTo(x+s*0.38,y-s*0.05); ctx.closePath();
    ctx.fillStyle='#C4854A'; ctx.fill();
    ctx.strokeStyle='#A8683A'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x-s*0.1,y-s*0.05); ctx.lineTo(x-s*0.05,y+s*0.45);
    ctx.moveTo(x+s*0.1,y-s*0.05); ctx.lineTo(x+s*0.05,y+s*0.45); ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y-s*0.18,s*0.4,0,Math.PI*2); ctx.fillStyle='#FFDDEE'; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y-s*0.38,s*0.26,0,Math.PI*2); ctx.fillStyle='#FFB3CC'; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y-s*0.62,s*0.12,0,Math.PI*2); ctx.fillStyle='#EE2244'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(x,y-s*0.5); ctx.quadraticCurveTo(x+s*0.12,y-s*0.6,x+s*0.08,y-s*0.7);
    ctx.strokeStyle='#55AA55'; ctx.lineWidth=2; ctx.stroke();
  }

  _drawCocktail(ctx,x,y,s) {
    ctx.beginPath(); ctx.moveTo(x,y+s*0.12); ctx.lineTo(x,y+s*0.44); ctx.strokeStyle='#BBBBCC'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-s*0.22,y+s*0.44); ctx.lineTo(x+s*0.22,y+s*0.44); ctx.stroke();
    ctx.save();
    ctx.beginPath(); ctx.moveTo(x,y+s*0.12); ctx.lineTo(x-s*0.264,y-s*0.18); ctx.lineTo(x+s*0.264,y-s*0.18); ctx.closePath();
    const g=ctx.createLinearGradient(x,y-s*0.18,x,y+s*0.12);
    g.addColorStop(0,'#FF88BB'); g.addColorStop(1,'#FFCC66');
    ctx.fillStyle=g; ctx.globalAlpha=0.85; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(x-s*0.44,y-s*0.38); ctx.lineTo(x,y+s*0.12); ctx.lineTo(x+s*0.44,y-s*0.38);
    ctx.strokeStyle='#DDEEFF'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-s*0.44,y-s*0.38); ctx.lineTo(x+s*0.44,y-s*0.38); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+s*0.08,y-s*0.38); ctx.lineTo(x+s*0.28,y-s*0.72); ctx.strokeStyle='#AA8844'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(x+s*0.28,y-s*0.72,s*0.16,Math.PI,0); ctx.fillStyle='#FF3388'; ctx.fill(); ctx.strokeStyle='#CC1166'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+s*0.28,y-s*0.72); ctx.lineTo(x+s*0.14,y-s*0.72); ctx.moveTo(x+s*0.28,y-s*0.72); ctx.lineTo(x+s*0.42,y-s*0.72); ctx.stroke();
    ctx.beginPath(); ctx.arc(x-s*0.12,y-s*0.38,s*0.07,0,Math.PI*2); ctx.fillStyle='#EE2244'; ctx.fill();
  }

  _drawFlower(ctx,x,y,s) {
    ctx.beginPath(); ctx.moveTo(x,y+s*0.1); ctx.lineTo(x,y+s*0.44); ctx.strokeStyle='#44AA44'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.ellipse(x+s*0.13,y+s*0.3,s*0.13,s*0.07,-Math.PI/4,0,Math.PI*2); ctx.fillStyle='#55BB55'; ctx.fill(); ctx.restore();
    for (let i=0;i<6;i++) {
      const ang=(i/6)*Math.PI*2, px=x+Math.cos(ang)*s*0.2, py=y+Math.sin(ang)*s*0.2;
      ctx.save(); ctx.beginPath(); ctx.ellipse(px,py,s*0.13,s*0.09,ang,0,Math.PI*2);
      ctx.fillStyle=i%2===0?'#FF88BB':'#FFBBDD'; ctx.fill(); ctx.restore();
    }
    ctx.beginPath(); ctx.arc(x,y,s*0.11,0,Math.PI*2); ctx.fillStyle='#FFDD44'; ctx.fill(); ctx.strokeStyle='#DDAA00'; ctx.lineWidth=1.5; ctx.stroke();
  }

  _drawClover(ctx,x,y,s) {
    ctx.beginPath(); ctx.moveTo(x,y+s*0.1); ctx.lineTo(x,y+s*0.44);
    ctx.strokeStyle='#33AA33'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y+s*0.08,s*0.05,0,Math.PI*2);
    ctx.fillStyle='#33BB33'; ctx.fill();
    const lp=[[x,y-s*0.1],[x-s*0.18,y+s*0.08],[x+s*0.18,y+s*0.08]];
    for (const [lx,ly] of lp) {
      ctx.save(); ctx.translate(lx,ly);
      ctx.beginPath(); ctx.ellipse(0,0,s*0.15,s*0.19,0,0,Math.PI*2);
      ctx.fillStyle='#44CC44'; ctx.fill(); ctx.strokeStyle='#22AA22'; ctx.lineWidth=1; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,s*0.17); ctx.lineTo(0,-s*0.15);
      ctx.strokeStyle='rgba(34,140,34,0.35)'; ctx.lineWidth=1; ctx.stroke();
      ctx.restore();
    }
  }

  _drawJuice(ctx,x,y,s) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x-s*0.22,y-s*0.25); ctx.lineTo(x+s*0.22,y-s*0.25);
    ctx.lineTo(x+s*0.17,y+s*0.44); ctx.lineTo(x-s*0.17,y+s*0.44); ctx.closePath();
    ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.fill();
    ctx.strokeStyle='#AACCFF'; ctx.lineWidth=2; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x-s*0.22,y-s*0.25); ctx.lineTo(x+s*0.22,y-s*0.25);
    ctx.lineTo(x+s*0.17,y+s*0.44); ctx.lineTo(x-s*0.17,y+s*0.44); ctx.closePath(); ctx.clip();
    ctx.fillStyle='#FF9922'; ctx.fillRect(x-s*0.25,y-s*0.07,s*0.5,s*0.55);
    ctx.fillStyle='rgba(255,255,180,0.45)';
    for (const [bx,by,br] of [[x-s*0.06,y+s*0.12,s*0.022],[x+s*0.09,y+s*0.28,s*0.018],[x-s*0.04,y+s*0.38,s*0.025]]) {
      ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(x+s*0.09,y-s*0.25); ctx.lineTo(x+s*0.16,y-s*0.62);
    ctx.strokeStyle='#FF4488'; ctx.lineWidth=3; ctx.lineCap='round'; ctx.stroke();
    ctx.beginPath(); ctx.arc(x-s*0.14,y-s*0.25,s*0.1,Math.PI,0);
    ctx.fillStyle='#FF8800'; ctx.fill(); ctx.strokeStyle='#FF6600'; ctx.lineWidth=1; ctx.stroke();
  }

  _drawHotmilk(ctx,x,y,s) {
    ctx.beginPath(); ctx.roundRect(x-s*0.22,y-s*0.06,s*0.44,s*0.5,s*0.06);
    ctx.fillStyle='#FFF8F0'; ctx.fill(); ctx.strokeStyle='#DDD0C0'; ctx.lineWidth=2; ctx.stroke();
    ctx.beginPath(); ctx.arc(x+s*0.31,y+s*0.12,s*0.15,-Math.PI*0.45,Math.PI*0.45);
    ctx.strokeStyle='#DDD0C0'; ctx.lineWidth=3.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x,y-s*0.06,s*0.2,s*0.06,0,0,Math.PI*2);
    ctx.fillStyle='#FFFDF8'; ctx.fill();
    ctx.lineCap='round';
    for (const [dx,sign] of [[-s*0.1,-1],[0,1],[s*0.1,-1]]) {
      ctx.beginPath();
      ctx.moveTo(x+dx,y-s*0.12);
      ctx.bezierCurveTo(x+dx+sign*s*0.07,y-s*0.28,x+dx-sign*s*0.07,y-s*0.4,x+dx,y-s*0.52);
      ctx.strokeStyle='rgba(180,180,200,0.38)'; ctx.lineWidth=2; ctx.stroke();
    }
  }

  _drawCookie(ctx,x,y,s) {
    ctx.save(); ctx.translate(x,y);
    ctx.beginPath();
    for (let i=0;i<5;i++) {
      const oa=(i/5)*Math.PI*2-Math.PI/2, ia=oa+Math.PI/5;
      i===0?ctx.moveTo(Math.cos(oa)*s*0.3,Math.sin(oa)*s*0.3):ctx.lineTo(Math.cos(oa)*s*0.3,Math.sin(oa)*s*0.3);
      ctx.lineTo(Math.cos(ia)*s*0.13,Math.sin(ia)*s*0.13);
    }
    ctx.closePath(); ctx.fillStyle='#D4A464'; ctx.fill(); ctx.strokeStyle='#A07830'; ctx.lineWidth=1.5; ctx.stroke();
    for (const [dx,dy,c] of [[-s*0.08,-s*0.08,'#FF6688'],[s*0.1,s*0.05,'#44AAFF'],[0,s*0.12,'#FFDD33'],[-s*0.04,s*0.03,'#88DD44']]) {
      ctx.beginPath(); ctx.arc(dx,dy,s*0.03,0,Math.PI*2); ctx.fillStyle=c; ctx.fill();
    }
    ctx.restore();
  }

  _drawTeacup(ctx,x,y,s) {
    ctx.beginPath(); ctx.ellipse(x,y+s*0.38,s*0.32,s*0.08,0,0,Math.PI*2);
    ctx.fillStyle='#FFF0E0'; ctx.fill(); ctx.strokeStyle='#DDCCAA'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x-s*0.22,y-s*0.06);
    ctx.quadraticCurveTo(x-s*0.23,y+s*0.35,x-s*0.14,y+s*0.36);
    ctx.lineTo(x+s*0.14,y+s*0.36);
    ctx.quadraticCurveTo(x+s*0.23,y+s*0.35,x+s*0.22,y-s*0.06);
    ctx.closePath();
    ctx.fillStyle='#FFF0E0'; ctx.fill(); ctx.strokeStyle='#DDCCAA'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x,y-s*0.06,s*0.2,s*0.05,0,0,Math.PI*2);
    ctx.fillStyle='#C07040'; ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*0.28,y+s*0.14,s*0.14,-Math.PI*0.45,Math.PI*0.45);
    ctx.strokeStyle='#DDCCAA'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.lineCap='round';
    for (const [dx,sign] of [[-s*0.06,-1],[s*0.06,1]]) {
      ctx.beginPath();
      ctx.moveTo(x+dx,y-s*0.1);
      ctx.bezierCurveTo(x+dx+sign*s*0.06,y-s*0.26,x+dx-sign*s*0.06,y-s*0.36,x+dx,y-s*0.46);
      ctx.strokeStyle='rgba(180,130,80,0.32)'; ctx.lineWidth=1.5; ctx.stroke();
    }
  }

  _drawCocoa(ctx,x,y,s) {
    // cup body
    const cupG=ctx.createLinearGradient(x-s*0.23,0,x+s*0.23,0);
    cupG.addColorStop(0,'#6A3A24'); cupG.addColorStop(0.45,'#8C5438'); cupG.addColorStop(1,'#5A2E18');
    ctx.beginPath(); ctx.roundRect(x-s*0.23,y-s*0.06,s*0.46,s*0.5,s*0.07);
    ctx.fillStyle=cupG; ctx.fill(); ctx.strokeStyle='#3E1E0A'; ctx.lineWidth=2; ctx.stroke();
    // handle
    ctx.beginPath(); ctx.arc(x+s*0.32,y+s*0.12,s*0.16,-Math.PI*0.45,Math.PI*0.45);
    ctx.strokeStyle='#5A2E18'; ctx.lineWidth=3.5; ctx.stroke();
    // inner liquid (dark cocoa)
    ctx.beginPath(); ctx.ellipse(x,y-s*0.055,s*0.19,s*0.06,0,0,Math.PI*2);
    ctx.fillStyle='#3E1E0A'; ctx.fill();
    // liquid surface (warm brown)
    ctx.beginPath(); ctx.ellipse(x,y-s*0.07,s*0.18,s*0.055,0,0,Math.PI*2);
    ctx.fillStyle='#6B3318'; ctx.fill();
    // cup rim inner shadow
    ctx.beginPath(); ctx.ellipse(x,y-s*0.06,s*0.21,s*0.07,0,0,Math.PI*2);
    ctx.strokeStyle='rgba(30,10,0,0.35)'; ctx.lineWidth=2.5; ctx.stroke();
    // inner wall left/right shadow strips
    ctx.save();
    ctx.beginPath(); ctx.roundRect(x-s*0.23,y-s*0.06,s*0.46,s*0.5,s*0.07); ctx.clip();
    ctx.fillStyle='rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.roundRect(x-s*0.23,y-s*0.06,s*0.06,s*0.5,0); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+s*0.17,y-s*0.06,s*0.06,s*0.5,0); ctx.fill();
    ctx.restore();
    // cocoa powder dusting
    ctx.save();
    ctx.beginPath(); ctx.ellipse(x,y-s*0.065,s*0.18,s*0.055,0,0,Math.PI*2); ctx.clip();
    ctx.fillStyle='rgba(80,30,5,0.28)';
    for (const [dx,dy,r] of [
      [-s*0.06,-s*0.065,s*0.055],[s*0.07,-s*0.055,s*0.04],
      [s*0.01,-s*0.08,s*0.03],[-s*0.1,-s*0.05,s*0.025],[s*0.12,-s*0.07,s*0.03]
    ]) {
      ctx.beginPath(); ctx.ellipse(x+dx,y+dy,r,r*0.6,Math.random()*0.8,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
    // marshmallows (4 pieces, varying size)
    const marsh=[[x-s*0.09,y-s*0.1,s*0.072,s*0.048],[x+s*0.07,y-s*0.115,s*0.058,s*0.038],
                 [x+s*0.01,y-s*0.09,s*0.05,s*0.033],[x-s*0.03,y-s*0.125,s*0.045,s*0.03]];
    for (const [mx,my,rw,rh] of marsh) {
      ctx.beginPath(); ctx.ellipse(mx,my,rw,rh,0,0,Math.PI*2);
      ctx.fillStyle='#FFFAF5'; ctx.fill(); ctx.strokeStyle='rgba(210,185,170,0.5)'; ctx.lineWidth=1; ctx.stroke();
      // marshmallow top highlight
      ctx.beginPath(); ctx.ellipse(mx-rw*0.22,my-rh*0.25,rw*0.35,rh*0.28,0,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.fill();
    }
    // steam lines (3 wavy)
    ctx.lineCap='round'; ctx.strokeStyle='rgba(200,160,130,0.36)'; ctx.lineWidth=1.8;
    for (const [dx,flip] of [[-s*0.1,1],[0,-1],[s*0.09,1]]) {
      ctx.beginPath();
      ctx.moveTo(x+dx,y-s*0.14);
      ctx.bezierCurveTo(x+dx+flip*s*0.07,y-s*0.27,x+dx-flip*s*0.07,y-s*0.38,x+dx+flip*s*0.04,y-s*0.5);
      ctx.stroke();
    }
    // cup shine
    ctx.fillStyle='rgba(255,255,255,0.09)';
    ctx.beginPath(); ctx.roundRect(x-s*0.19,y-s*0.04,s*0.05,s*0.3,3); ctx.fill();
  }

  _drawLollipop(ctx,x,y,s) {
    ctx.beginPath(); ctx.moveTo(x+s*0.06,y+s*0.1); ctx.lineTo(x+s*0.06,y+s*0.5);
    ctx.strokeStyle='#DDBBAA'; ctx.lineWidth=3; ctx.lineCap='round'; ctx.stroke();
    ctx.save();
    ctx.beginPath(); ctx.arc(x,y-s*0.1,s*0.3,0,Math.PI*2);
    ctx.fillStyle='#FF4488'; ctx.fill(); ctx.strokeStyle='#CC2266'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y-s*0.1,s*0.3,0,Math.PI*2); ctx.clip();
    ctx.strokeStyle='rgba(255,255,255,0.46)'; ctx.lineWidth=s*0.072; ctx.lineCap='round';
    ctx.beginPath(); ctx.arc(x,y-s*0.1,s*0.19,0,Math.PI*1.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y-s*0.1,s*0.09,Math.PI*0.4,Math.PI*1.9); ctx.stroke();
    ctx.restore();
  }

  _drawMacaron(ctx,x,y,s) {
    ctx.beginPath(); ctx.ellipse(x,y+s*0.14,s*0.28,s*0.15,0,0,Math.PI*2);
    ctx.fillStyle='#FFAAD0'; ctx.fill(); ctx.strokeStyle='#FF88BB'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x,y+s*0.04,s*0.27,s*0.08,0,0,Math.PI*2);
    ctx.fillStyle='#FFE4F0'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(x,y-s*0.1,s*0.28,s*0.15,0,0,Math.PI*2);
    ctx.fillStyle='#FFAAD0'; ctx.fill(); ctx.strokeStyle='#FF88BB'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x-s*0.08,y-s*0.15,s*0.1,s*0.055,0,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.fill();
  }

  _drawCamera(ctx,x,y,s) {
    // body
    ctx.fillStyle='#2A2A2A'; ctx.strokeStyle='#111'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(x-s*0.34,y-s*0.16,s*0.68,s*0.46,s*0.04); ctx.fill(); ctx.stroke();
    // viewfinder bump
    ctx.beginPath(); ctx.roundRect(x-s*0.14,y-s*0.26,s*0.2,s*0.12,3); ctx.fill(); ctx.stroke();
    // lens outer ring
    ctx.beginPath(); ctx.arc(x-s*0.06,y+s*0.06,s*0.19,0,Math.PI*2);
    ctx.fillStyle='#1A1A1A'; ctx.fill(); ctx.strokeStyle='#555'; ctx.lineWidth=3; ctx.stroke();
    // lens glass
    ctx.beginPath(); ctx.arc(x-s*0.06,y+s*0.06,s*0.13,0,Math.PI*2);
    ctx.fillStyle='#223399'; ctx.fill();
    ctx.beginPath(); ctx.arc(x-s*0.06,y+s*0.06,s*0.07,0,Math.PI*2);
    ctx.fillStyle='#1122BB'; ctx.fill();
    // lens highlight
    ctx.beginPath(); ctx.arc(x-s*0.12,y+s*0.01,s*0.038,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.fill();
    // shutter button
    ctx.beginPath(); ctx.arc(x+s*0.22,y-s*0.19,s*0.042,0,Math.PI*2);
    ctx.fillStyle='#CC3333'; ctx.fill();
    // flash
    ctx.fillStyle='#FFFFCC';
    ctx.beginPath(); ctx.roundRect(x+s*0.08,y-s*0.2,s*0.12,s*0.07,3); ctx.fill();
  }

  _drawBulgogi(ctx,x,y,s) {
    // bowl base
    ctx.fillStyle='#C89A60'; ctx.strokeStyle='#A87A40'; ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(x-s*0.36,y+s*0.06);
    ctx.quadraticCurveTo(x-s*0.4,y+s*0.44,x,y+s*0.5);
    ctx.quadraticCurveTo(x+s*0.4,y+s*0.44,x+s*0.36,y+s*0.06);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // bowl rim
    ctx.beginPath(); ctx.ellipse(x,y+s*0.06,s*0.36,s*0.09,0,0,Math.PI*2);
    ctx.fillStyle='#DEB878'; ctx.fill(); ctx.strokeStyle='#A87A40'; ctx.lineWidth=1.5; ctx.stroke();
    // meat pieces
    ctx.strokeStyle='#6A2010'; ctx.lineWidth=1;
    for (const [dx,dy,rot] of [[-s*0.12,-s*0.06,0.3],[s*0.1,-s*0.1,-0.4],[s*0.22,-s*0.04,0.6],[-s*0.24,-s*0.02,-0.2],[s*0.02,s*0.0,0.2],[-s*0.04,-s*0.13,0.5]]) {
      ctx.save(); ctx.translate(x+dx,y+dy); ctx.rotate(rot);
      ctx.fillStyle='#983010';
      ctx.beginPath(); ctx.ellipse(0,0,s*0.1,s*0.06,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    // green onion
    ctx.strokeStyle='#4A8A20'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x-s*0.06,y-s*0.1); ctx.lineTo(x+s*0.12,y+s*0.02); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+s*0.1,y-s*0.07); ctx.lineTo(x-s*0.06,y+s*0.03); ctx.stroke();
  }

  _drawSoju(ctx,x,y,s) {
    const bx=x, by=y-s*0.06;
    // bottle body
    ctx.fillStyle='#58A845'; ctx.strokeStyle='#38782A'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(bx-s*0.12,by+s*0.5);
    ctx.lineTo(bx-s*0.12,by+s*0.1);
    ctx.quadraticCurveTo(bx-s*0.12,by-s*0.1,bx-s*0.07,by-s*0.2);
    ctx.lineTo(bx-s*0.055,by-s*0.42);
    ctx.lineTo(bx+s*0.055,by-s*0.42);
    ctx.lineTo(bx+s*0.07,by-s*0.2);
    ctx.quadraticCurveTo(bx+s*0.12,by-s*0.1,bx+s*0.12,by+s*0.1);
    ctx.lineTo(bx+s*0.12,by+s*0.5);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // cap
    ctx.fillStyle='#E0E0E0'; ctx.strokeStyle='#AAAAAA'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(bx-s*0.06,by-s*0.52,s*0.12,s*0.12,3); ctx.fill(); ctx.stroke();
    // white label
    ctx.fillStyle='rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.roundRect(bx-s*0.09,by+s*0.04,s*0.18,s*0.28,3); ctx.fill();
    // label accent bar
    ctx.fillStyle='#2A7A2A';
    ctx.beginPath(); ctx.roundRect(bx-s*0.07,by+s*0.07,s*0.14,s*0.08,2); ctx.fill();
    // bottle shine
    ctx.fillStyle='rgba(255,255,255,0.22)';
    ctx.beginPath(); ctx.roundRect(bx-s*0.09,by+s*0.1,s*0.04,s*0.3,2); ctx.fill();
  }

  _drawCoffee(ctx,x,y,s) {
    // cup body (tapered)
    ctx.fillStyle='#F0E4D0'; ctx.strokeStyle='#D4C0A0'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(x-s*0.19,y-s*0.04);
    ctx.lineTo(x-s*0.23,y+s*0.44);
    ctx.lineTo(x+s*0.23,y+s*0.44);
    ctx.lineTo(x+s*0.19,y-s*0.04);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // sleeve
    ctx.fillStyle='#7A4A28'; ctx.strokeStyle='#5A3010'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(x-s*0.21,y+s*0.16);
    ctx.lineTo(x-s*0.225,y+s*0.32);
    ctx.lineTo(x+s*0.225,y+s*0.32);
    ctx.lineTo(x+s*0.21,y+s*0.16);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // dome lid
    ctx.fillStyle='#DDD0B8'; ctx.strokeStyle='#BEA888'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(x-s*0.21,y-s*0.04);
    ctx.bezierCurveTo(x-s*0.21,y-s*0.18,x+s*0.21,y-s*0.18,x+s*0.21,y-s*0.04);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // sip hole
    ctx.fillStyle='#A08060';
    ctx.beginPath(); ctx.roundRect(x-s*0.07,y-s*0.14,s*0.14,s*0.04,2); ctx.fill();
    // steam
    ctx.strokeStyle='rgba(160,130,90,0.35)'; ctx.lineWidth=1.8; ctx.lineCap='round';
    for (const [dx,flip] of [[-s*0.07,1],[s*0.06,-1]]) {
      ctx.beginPath();
      ctx.moveTo(x+dx,y-s*0.2);
      ctx.bezierCurveTo(x+dx+flip*s*0.06,y-s*0.33,x+dx-flip*s*0.06,y-s*0.43,x+dx,y-s*0.54);
      ctx.stroke();
    }
  }

  _drawOdeng(ctx,x,y,s) {
    // skewer stick
    ctx.strokeStyle='#C8A060'; ctx.lineWidth=s*0.038; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x+s*0.06,y+s*0.52); ctx.lineTo(x-s*0.04,y-s*0.48); ctx.stroke();
    // fish cake folds (3 loops on stick)
    ctx.fillStyle='#F5E0A0'; ctx.strokeStyle='#D4B860'; ctx.lineWidth=1.8;
    for (const [dy,w,h] of [[s*0.2,s*0.3,s*0.12],[s*0.02,s*0.32,s*0.13],[-s*0.18,s*0.28,s*0.11]]) {
      ctx.beginPath(); ctx.ellipse(x,y+dy,w,h,0.12,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
    // top edge highlight
    ctx.fillStyle='rgba(255,240,180,0.45)';
    ctx.beginPath(); ctx.ellipse(x-s*0.04,y-s*0.16,s*0.22,s*0.07,-0.1,0,Math.PI*2); ctx.fill();
    // steam
    ctx.strokeStyle='rgba(200,170,100,0.38)'; ctx.lineWidth=1.6; ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(x-s*0.08,y-s*0.34);
    ctx.bezierCurveTo(x-s*0.18,y-s*0.46,x+s*0.02,y-s*0.56,x-s*0.08,y-s*0.66); ctx.stroke();
  }

  _drawIcecream(ctx,x,y,s) {
    // cone
    ctx.fillStyle='#E8C07A'; ctx.strokeStyle='#C89A48'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(x-s*0.22,y+s*0.12);
    ctx.lineTo(x+s*0.22,y+s*0.12);
    ctx.lineTo(x,y+s*0.52);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // cone grid lines
    ctx.strokeStyle='rgba(180,130,50,0.4)'; ctx.lineWidth=1;
    for (const t of [0.28,0.52,0.76]) {
      const w=s*0.22*(1-t*0.8);
      ctx.beginPath(); ctx.moveTo(x-w,y+s*0.12+t*s*0.4); ctx.lineTo(x+w,y+s*0.12+t*s*0.4); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(x,y+s*0.12); ctx.lineTo(x,y+s*0.52); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-s*0.11,y+s*0.12); ctx.lineTo(x-s*0.04,y+s*0.52); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+s*0.11,y+s*0.12); ctx.lineTo(x+s*0.04,y+s*0.52); ctx.stroke();
    // soft serve swirl (3 loops)
    ctx.fillStyle='#FFF5F0'; ctx.strokeStyle='#F0D0C0'; ctx.lineWidth=1.5;
    const sw=s*0.22, sh=s*0.13;
    ctx.beginPath(); ctx.ellipse(x,y+s*0.12,sw,sh,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x+s*0.04,y-s*0.04,sw*0.82,sh,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x,y-s*0.18,sw*0.62,sh*0.9,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x-s*0.02,y-s*0.3,sw*0.4,sh*0.8,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // swirl tip
    ctx.beginPath(); ctx.arc(x,y-s*0.4,sw*0.15,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // drip
    ctx.fillStyle='rgba(255,220,200,0.7)';
    ctx.beginPath(); ctx.moveTo(x+s*0.18,y+s*0.08); ctx.quadraticCurveTo(x+s*0.22,y+s*0.18,x+s*0.16,y+s*0.22); ctx.closePath(); ctx.fill();
  }

  _drawChicken(ctx,x,y,s) {
    ctx.save();
    ctx.translate(x,y); ctx.rotate(0.18); // slight tilt

    // shadow
    ctx.fillStyle='rgba(60,20,0,0.13)';
    ctx.beginPath(); ctx.ellipse(0,s*0.46,s*0.30,s*0.055,0,0,Math.PI*2); ctx.fill();

    // ── bone stick (handle) ──
    ctx.strokeStyle='#E8DDB0'; ctx.lineWidth=s*0.11; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(s*0.04,s*0.50); ctx.lineTo(s*0.06,s*0.15); ctx.stroke();
    // bottom knob (big)
    ctx.fillStyle='#EEE4BC'; ctx.strokeStyle='#C0A858'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(s*0.04,s*0.52,s*0.15,s*0.09,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(255,255,240,0.45)';
    ctx.beginPath(); ctx.ellipse(s*0.00,s*0.49,s*0.07,s*0.04,-0.3,0,Math.PI*2); ctx.fill();
    // top knob (smaller, peeking from meat)
    ctx.fillStyle='#EEE4BC'; ctx.strokeStyle='#C0A858'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.ellipse(s*0.06,s*0.15,s*0.10,s*0.06,0,0,Math.PI*2); ctx.fill(); ctx.stroke();

    // ── piece body — thick irregular chunk ──
    // dark outline
    ctx.fillStyle='#7A2C06'; ctx.strokeStyle='#7A2C06'; ctx.lineWidth=0;
    ctx.beginPath();
    ctx.moveTo(-s*0.28, s*0.18);
    ctx.bezierCurveTo(-s*0.36, s*0.04, -s*0.32,-s*0.22, -s*0.14,-s*0.36);
    ctx.bezierCurveTo( s*0.02,-s*0.48,  s*0.28,-s*0.42,  s*0.32,-s*0.24);
    ctx.bezierCurveTo( s*0.38,-s*0.06,  s*0.26, s*0.18,  s*0.10, s*0.26);
    ctx.bezierCurveTo(-s*0.04, s*0.34, -s*0.20, s*0.30, -s*0.28, s*0.18);
    ctx.closePath(); ctx.fill();

    // main crust — flat golden-orange
    ctx.fillStyle='#C86014'; ctx.strokeStyle='#8A3408'; ctx.lineWidth=2.2;
    ctx.beginPath();
    ctx.moveTo(-s*0.26, s*0.16);
    ctx.bezierCurveTo(-s*0.34, s*0.02, -s*0.30,-s*0.20, -s*0.12,-s*0.33);
    ctx.bezierCurveTo( s*0.02,-s*0.45,  s*0.26,-s*0.39,  s*0.30,-s*0.22);
    ctx.bezierCurveTo( s*0.36,-s*0.05,  s*0.24, s*0.16,  s*0.08, s*0.24);
    ctx.bezierCurveTo(-s*0.04, s*0.32, -s*0.18, s*0.28, -s*0.26, s*0.16);
    ctx.closePath(); ctx.fill(); ctx.stroke();


    // ── crispy bumps on crust ──
    for (const [dx,dy,r,c] of [
      [-s*0.18, s*0.10,s*0.072,'#A83C0C'],[ s*0.18, s*0.06,s*0.068,'#A83C0C'],
      [ s*0.24,-s*0.10,s*0.065,'#B04410'],[-s*0.06, s*0.20,s*0.060,'#A83C0C'],
      [ s*0.04,-s*0.32,s*0.058,'#B04410'],[ s*0.26,-s*0.30,s*0.055,'#A83C0C'],
    ]) { ctx.fillStyle=c; ctx.beginPath(); ctx.arc(dx,dy,r,0,Math.PI*2); ctx.fill(); }
    for (const [dx,dy,r] of [
      [-s*0.18, s*0.09,s*0.050],[ s*0.18, s*0.05,s*0.048],
      [ s*0.24,-s*0.11,s*0.045],[-s*0.06, s*0.19,s*0.042],
    ]) { ctx.fillStyle='#E08020'; ctx.beginPath(); ctx.arc(dx,dy,r,0,Math.PI*2); ctx.fill(); }

    // highlight on crust top
    ctx.fillStyle='rgba(255,245,190,0.35)';
    ctx.beginPath(); ctx.ellipse(s*0.14,-s*0.30,s*0.09,s*0.048,-0.5,0,Math.PI*2); ctx.fill();

    // steam (2 lines)
    ctx.strokeStyle='rgba(200,170,120,0.40)'; ctx.lineWidth=1.8; ctx.lineCap='round';
    for (const [dx,flip] of [[-s*0.05,1],[s*0.12,-1]]) {
      ctx.beginPath();
      ctx.moveTo(dx,-s*0.42);
      ctx.bezierCurveTo(dx+flip*s*0.06,-s*0.52, dx-flip*s*0.06,-s*0.60, dx,-s*0.68);
      ctx.stroke();
    }

    ctx.restore();
  }

  _drawMakgeolli(ctx,x,y,s) {
    ctx.save();
    // bowl shadow
    ctx.fillStyle='rgba(100,80,50,0.18)';
    ctx.beginPath(); ctx.ellipse(x,y+s*0.22,s*0.42,s*0.07,0,0,Math.PI*2); ctx.fill();
    // bowl outer shape (사발 — wide, shallow)
    const bTop=y-s*0.10, bBot=y+s*0.20, bTw=s*0.40, bBw=s*0.28;
    ctx.beginPath();
    ctx.moveTo(x-bTw,bTop);
    ctx.quadraticCurveTo(x-bTw*1.04,bBot-s*0.04,x-bBw,bBot);
    ctx.lineTo(x+bBw,bBot);
    ctx.quadraticCurveTo(x+bTw*1.04,bBot-s*0.04,x+bTw,bTop);
    ctx.closePath();
    ctx.fillStyle='#D8C8A8'; ctx.fill(); ctx.strokeStyle='#A89068'; ctx.lineWidth=2; ctx.stroke();
    // milky white liquid fill
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x-bTw,bTop);
    ctx.quadraticCurveTo(x-bTw*1.04,bBot-s*0.04,x-bBw,bBot);
    ctx.lineTo(x+bBw,bBot);
    ctx.quadraticCurveTo(x+bTw*1.04,bBot-s*0.04,x+bTw,bTop);
    ctx.closePath(); ctx.clip();
    ctx.fillStyle='#F4EDDF'; ctx.fillRect(x-bTw*1.1,bTop,bTw*2.2,(bBot-bTop));
    ctx.restore();
    // liquid surface ellipse
    ctx.beginPath(); ctx.ellipse(x,bTop,bTw,s*0.065,0,0,Math.PI*2);
    ctx.fillStyle='#F8F2E6'; ctx.fill();
    ctx.strokeStyle='rgba(190,170,130,0.45)'; ctx.lineWidth=1.2; ctx.stroke();
    // bubbles on surface
    ctx.fillStyle='rgba(255,255,255,0.88)';
    for (const [dx,dy,r] of [[-bTw*0.5,s*0.015,s*0.038],[bTw*0.28,-s*0.01,s*0.028],[bTw*0.55,s*0.008,s*0.022],[-bTw*0.18,-s*0.005,s*0.018],[bTw*0.08,s*0.02,s*0.015]]) {
      ctx.beginPath(); ctx.arc(x+dx,bTop+dy,r,0,Math.PI*2); ctx.fill();
    }
    // bowl rim highlight
    ctx.fillStyle='rgba(255,255,255,0.28)';
    ctx.beginPath(); ctx.ellipse(x-bTw*0.3,bTop+s*0.03,bTw*0.18,s*0.028,-0.2,0,Math.PI*2); ctx.fill();
    // bowl inner side shadow
    ctx.fillStyle='rgba(120,90,50,0.12)';
    ctx.beginPath(); ctx.roundRect(x-bTw,bTop,bTw*0.12,bBot-bTop,4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+bTw*0.88,bTop,bTw*0.12,bBot-bTop,4); ctx.fill();
    // label stripe (classic makgeolli look)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x-bTw,bTop);
    ctx.quadraticCurveTo(x-bTw*1.04,bBot-s*0.04,x-bBw,bBot);
    ctx.lineTo(x+bBw,bBot);
    ctx.quadraticCurveTo(x+bTw*1.04,bBot-s*0.04,x+bTw,bTop);
    ctx.closePath(); ctx.clip();
    ctx.fillStyle='rgba(180,100,50,0.13)';
    ctx.fillRect(x-bTw*1.1,bTop+(bBot-bTop)*0.55,bTw*2.2,(bBot-bTop)*0.2);
    ctx.restore();
    ctx.restore();
  }

  _drawTteokbokki(ctx,x,y,s) {
    // skewer stick (longer, pokes out top and bottom)
    ctx.strokeStyle='#B8924A'; ctx.lineWidth=s*0.045; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x,y+s*0.58); ctx.lineTo(x,y-s*0.56); ctx.stroke();
    // stick pointed tip
    ctx.fillStyle='#B8924A';
    ctx.beginPath(); ctx.moveTo(x,y-s*0.56); ctx.lineTo(x-s*0.025,y-s*0.46); ctx.lineTo(x+s*0.025,y-s*0.46); ctx.closePath(); ctx.fill();

    // 4 round cylindrical tteok pieces stacked vertically
    const tw=s*0.2, th=s*0.18, gap=s*0.03, ry=s*0.07;
    const startY=y+s*0.34;
    for (let i=0;i<4;i++) {
      const cy=startY-i*(th+gap);
      // tteok body — rounded rect (pill shape = clearly cylindrical rice cake)
      ctx.fillStyle='#FFEEDD'; ctx.strokeStyle='#DDC8A8'; ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.roundRect(x-tw,cy-th,tw*2,th,[ry,ry,ry,ry]); ctx.fill(); ctx.stroke();
      // red sauce coat over body
      ctx.fillStyle='rgba(220,35,0,0.72)';
      ctx.beginPath(); ctx.roundRect(x-tw,cy-th,tw*2,th,[ry,ry,ry,ry]); ctx.fill();
      // white tteok peek-through center stripe (shows it's rice cake inside)
      ctx.fillStyle='rgba(255,245,235,0.55)';
      ctx.beginPath(); ctx.roundRect(x-tw*0.5,cy-th+th*0.25,tw,th*0.5,3); ctx.fill();
      // sauce gloss highlight
      ctx.fillStyle='rgba(255,120,60,0.35)';
      ctx.beginPath(); ctx.ellipse(x-tw*0.25,cy-th+th*0.28,tw*0.45,th*0.18,0,0,Math.PI*2); ctx.fill();
      // bottom rim ellipse (cylindrical depth)
      ctx.fillStyle='rgba(180,20,0,0.5)';
      ctx.beginPath(); ctx.ellipse(x,cy,tw,ry*0.55,0,0,Math.PI*2); ctx.fill();
      // top rim ellipse
      ctx.fillStyle='rgba(255,200,160,0.45)';
      ctx.beginPath(); ctx.ellipse(x,cy-th,tw,ry*0.55,0,0,Math.PI*2); ctx.fill();
    }
    // sauce drip off bottom piece
    ctx.fillStyle='rgba(200,25,0,0.65)';
    ctx.beginPath();
    ctx.moveTo(x+tw*0.5,startY-th*0.5);
    ctx.quadraticCurveTo(x+tw*0.65,startY-th*0.2,x+tw*0.45,startY+th*0.1);
    ctx.closePath(); ctx.fill();
  }

  _drawRamen(ctx,x,y,s) {
    const rimY=y+s*0.07, rimRx=s*0.34, rimRy=s*0.09, btm=y+s*0.51;

    // ── bowl body (flat warm white, clean outline) ──
    ctx.beginPath();
    ctx.moveTo(x-rimRx,rimY);
    ctx.bezierCurveTo(x-rimRx*1.08,rimY+s*0.2, x-rimRx*0.4,btm, x,btm);
    ctx.bezierCurveTo(x+rimRx*0.4,btm, x+rimRx*1.08,rimY+s*0.2, x+rimRx,rimY);
    ctx.fillStyle='#FFF4EC'; ctx.fill();
    ctx.strokeStyle='#E0B06A'; ctx.lineWidth=2; ctx.stroke();
    // very subtle left-side shading only
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x-rimRx,rimY);
    ctx.bezierCurveTo(x-rimRx*1.08,rimY+s*0.2, x-rimRx*0.4,btm, x-rimRx*0.05,btm);
    ctx.lineTo(x-rimRx*0.18,rimY); ctx.closePath();
    ctx.fillStyle='rgba(195,150,70,0.09)'; ctx.fill();
    ctx.restore();

    // ── contents clipped inside rim ──
    ctx.save();
    ctx.beginPath(); ctx.ellipse(x,rimY,rimRx*0.93,rimRy*1.1,0,0,Math.PI*2); ctx.clip();

    // broth — bright flat Korean red
    ctx.fillStyle='#EF2C0E';
    ctx.fillRect(x-rimRx,rimY-rimRy*1.3,rimRx*2,rimRy*2.6);
    // single small highlight on broth (not gradient, just one ellipse)
    ctx.fillStyle='rgba(255,80,50,0.28)';
    ctx.beginPath(); ctx.ellipse(x-rimRx*0.28,rimY-rimRy*0.38,rimRx*0.32,rimRy*0.4,0,0,Math.PI*2); ctx.fill();

    // noodles — 3 clean wavy rows, no shadow, no multi-pass
    const nw=rimRx*1.68; ctx.lineCap='round';
    for (const [rny,amp,col,lw] of [
      [rimY-rimRy*0.1,  s*0.036,'#F4C828',2.6],
      [rimY+rimRy*0.22, s*0.03, '#ECBA20',2.4],
      [rimY-rimRy*0.44, s*0.026,'#F2C430',2.2],
    ]) {
      ctx.strokeStyle=col; ctx.lineWidth=lw;
      ctx.beginPath(); ctx.moveTo(x-nw/2,rny);
      for(let i=0;i<5;i++){
        const sign=i%2===0?1:-1;
        ctx.quadraticCurveTo(x-nw/2+nw*(i+0.5)/5,rny+sign*amp, x-nw/2+nw*(i+1)/5,rny);
      }
      ctx.stroke();
    }

    // egg half — cute, simple
    ctx.fillStyle='#FFFBDE'; ctx.strokeStyle='#D8CC68'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.ellipse(x+s*0.17,rimY-rimRy*0.08,s*0.076,s*0.062,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#F8A400';
    ctx.beginPath(); ctx.arc(x+s*0.17,rimY-rimRy*0.08,s*0.037,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,228,110,0.5)';
    ctx.beginPath(); ctx.arc(x+s*0.158,rimY-rimRy*0.13,s*0.013,0,Math.PI*2); ctx.fill();

    // green onion rings — small, bright, cute
    for (const [dx,dy] of [[-s*0.13,-s*0.01],[-s*0.04,s*0.03],[-s*0.22,s*0.025]]) {
      ctx.fillStyle='#52B030'; ctx.strokeStyle='#2E8018'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.arc(x+dx,rimY+dy,s*0.022,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.45)';
      ctx.beginPath(); ctx.arc(x+dx,rimY+dy,s*0.009,0,Math.PI*2); ctx.fill();
    }

    ctx.restore();

    // ── rim — flat, clean ──
    ctx.beginPath(); ctx.ellipse(x,rimY,rimRx,rimRy,0,0,Math.PI*2);
    ctx.fillStyle='#FFF4EC'; ctx.fill();
    ctx.strokeStyle='#E0B06A'; ctx.lineWidth=2; ctx.stroke();
    // rim inner edge shadow (very light)
    ctx.beginPath(); ctx.ellipse(x,rimY,rimRx*0.86,rimRy*0.65,0,0,Math.PI*2);
    ctx.strokeStyle='rgba(170,110,40,0.12)'; ctx.lineWidth=2; ctx.stroke();

    // ── chopsticks ──
    const t1x=x-s*0.03, t1y=rimY-rimRy*0.1;
    const t2x=x+s*0.06, t2y=rimY-rimRy*0.1;
    const g1x=x+s*0.36,  g1y=y-s*0.43;
    const g2x=x+s*0.46,  g2y=y-s*0.36;
    ctx.lineCap='round';
    for (const [tx,ty,gx,gy] of [[t1x,t1y,g1x,g1y],[t2x,t2y,g2x,g2y]]) {
      // body
      ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(gx,gy);
      ctx.strokeStyle='#C89A2A'; ctx.lineWidth=3; ctx.stroke();
      // tip section (darker)
      const hx=(tx+gx)/2, hy=(ty+gy)/2;
      ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(hx,hy);
      ctx.strokeStyle='#8A6414'; ctx.lineWidth=2; ctx.stroke();
      // shine
      ctx.beginPath(); ctx.moveTo(tx+1,ty-1); ctx.lineTo(gx+1,gy-1);
      ctx.strokeStyle='rgba(255,225,120,0.25)'; ctx.lineWidth=1; ctx.stroke();
    }

    // ── hanging noodle strands ──
    const tipX=(t1x+t2x)/2, tipY=(t1y+t2y)/2;
    ctx.lineWidth=2; ctx.lineCap='round';
    for (const [ox,b,col] of [[-s*0.05,s*0.04,'#F4C828'],[0,-s*0.03,'#F0C020'],[s*0.05,s*0.044,'#ECBC24']]) {
      ctx.strokeStyle=col;
      ctx.beginPath();
      ctx.moveTo(tipX+ox,tipY);
      ctx.quadraticCurveTo(tipX+ox+b,tipY+s*0.07, tipX+ox+b*0.5,tipY+s*0.14);
      ctx.quadraticCurveTo(tipX+ox-b*0.3,tipY+s*0.19, tipX+ox+b*0.2,tipY+s*0.23);
      ctx.stroke();
    }

    // ── steam — warm pinkish, cute ──
    ctx.lineCap='round';
    for (const [dx,f] of [[-s*0.11,1],[s*0.05,-1]]) {
      ctx.beginPath();
      ctx.moveTo(x+dx,rimY-rimRy-s*0.02);
      ctx.bezierCurveTo(x+dx+f*s*0.06,rimY-rimRy-s*0.11, x+dx-f*s*0.06,rimY-rimRy-s*0.2, x+dx,rimY-rimRy-s*0.3);
      ctx.strokeStyle='rgba(255,130,80,0.38)'; ctx.lineWidth=1.8; ctx.stroke();
    }
  }

  _drawPajeon(ctx,x,y,s) {
    // plate
    ctx.fillStyle='#E0C890'; ctx.strokeStyle='#C0A060'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.ellipse(x,y+s*0.36,s*0.38,s*0.09,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // plate shadow under pancake
    ctx.fillStyle='rgba(140,100,20,0.15)';
    ctx.beginPath(); ctx.ellipse(x+s*0.02,y+s*0.32,s*0.3,s*0.07,0,0,Math.PI*2); ctx.fill();
    // pancake base (gradient — center lighter, edge darker golden)
    const pjG=ctx.createRadialGradient(x-s*0.05,y-s*0.04,s*0.05,x,y+s*0.08,s*0.35);
    pjG.addColorStop(0,'#E8C040'); pjG.addColorStop(0.65,'#C89820'); pjG.addColorStop(1,'#A07010');
    ctx.beginPath(); ctx.ellipse(x,y+s*0.08,s*0.34,s*0.28,0,0,Math.PI*2);
    ctx.fillStyle=pjG; ctx.fill(); ctx.strokeStyle='#907010'; ctx.lineWidth=1.5; ctx.stroke();
    // crispy edge ring (darker band)
    ctx.save();
    ctx.beginPath(); ctx.ellipse(x,y+s*0.08,s*0.34,s*0.28,0,0,Math.PI*2);
    ctx.arc(x,y+s*0.08,s*0.25,0,Math.PI*2,true); ctx.fillStyle='rgba(120,72,5,0.32)'; ctx.fill();
    ctx.restore();
    // random brown toasted spots
    const spots=[[-s*0.16,y-s*0.08,s*0.072,s*0.045,0.3],[s*0.14,y+s*0.06,s*0.08,s*0.05,-0.2],
                 [s*0.0,y+s*0.18,s*0.065,s*0.04,0.1],[-s*0.08,y+s*0.14,s*0.055,s*0.035,-0.4],
                 [s*0.18,y-s*0.06,s*0.05,s*0.03,0.5],[-s*0.22,y+s*0.1,s*0.04,s*0.025,-0.1]];
    ctx.fillStyle='rgba(140,82,8,0.3)';
    for (const [dx,sy,rw,rh,ang] of spots) {
      ctx.beginPath(); ctx.ellipse(x+dx,sy,rw,rh,ang,0,Math.PI*2); ctx.fill();
    }
    // green onion leaves — filled ribbon shapes (not lines)
    ctx.save();
    ctx.beginPath(); ctx.ellipse(x,y+s*0.08,s*0.33,s*0.27,0,0,Math.PI*2); ctx.clip();
    const drawLeaf=(sx,sy,ex,ey,hw,bow)=>{
      const dx=ex-sx,dy=ey-sy,len=Math.hypot(dx,dy);
      if(len<1) return;
      const nx=dx/len,ny=dy/len,px=-ny,py=nx;
      const mx=(sx+ex)/2+px*bow, my=(sy+ey)/2+py*bow;
      const s1x=sx+px*hw,s1y=sy+py*hw; // left base
      const e1x=ex+px*hw,e1y=ey+py*hw; // left tip
      const s2x=sx-px*hw,s2y=sy-py*hw; // right base
      const e2x=ex-px*hw,e2y=ey-py*hw; // right tip
      const c1x=mx+px*hw,c1y=my+py*hw;
      const c2x=mx-px*hw,c2y=my-py*hw;
      ctx.beginPath();
      ctx.moveTo(s1x,s1y);
      ctx.quadraticCurveTo(c1x,c1y,e1x,e1y);                          // left edge curved
      ctx.quadraticCurveTo(ex+nx*hw*1.5,ey+ny*hw*1.5,e2x,e2y);        // rounded tip
      ctx.quadraticCurveTo(c2x,c2y,s2x,s2y);                          // right edge curved
      ctx.quadraticCurveTo(sx-nx*hw*1.5,sy-ny*hw*1.5,s1x,s1y);        // rounded base
      ctx.closePath();
      // width-direction gradient for depth
      const g=ctx.createLinearGradient(s1x,s1y,s2x,s2y);
      g.addColorStop(0,'#255815'); g.addColorStop(0.28,'#4EA028');
      g.addColorStop(0.6,'#58B030'); g.addColorStop(1,'#226012');
      ctx.fillStyle=g; ctx.fill();
      // center vein (midrib)
      ctx.beginPath();
      ctx.moveTo(sx+nx*hw*0.4,sy+ny*hw*0.4);
      ctx.quadraticCurveTo(mx,my,ex-nx*hw*0.4,ey-ny*hw*0.4);
      ctx.strokeStyle='rgba(18,65,5,0.28)'; ctx.lineWidth=hw*0.5; ctx.lineCap='round'; ctx.stroke();
    };
    // leaves: [sx, sy, ex, ey, halfWidth, bow]
    drawLeaf(x-s*0.29,y+s*0.14, x+s*0.21,y+s*0.0,  s*0.032,  s*0.048);
    drawLeaf(x-s*0.14,y+s*0.23, x+s*0.29,y+s*0.09, s*0.028, -s*0.05);
    drawLeaf(x-s*0.25,y-s*0.03, x+s*0.17,y-s*0.15, s*0.026,  s*0.04);
    drawLeaf(x-s*0.04,y+s*0.27, x+s*0.22,y+s*0.1,  s*0.029, -s*0.042);
    drawLeaf(x-s*0.31,y+s*0.07, x+s*0.05,y-s*0.02, s*0.022,  s*0.032);
    drawLeaf(x+s*0.01,y-s*0.17, x+s*0.29,y-s*0.04, s*0.025,  s*0.044);
    ctx.restore();
    // oil gloss highlight
    ctx.fillStyle='rgba(255,245,140,0.18)';
    ctx.beginPath(); ctx.ellipse(x-s*0.08,y-s*0.06,s*0.18,s*0.11,-0.35,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,200,0.12)';
    ctx.beginPath(); ctx.ellipse(x+s*0.1,y+s*0.12,s*0.1,s*0.065,0.2,0,Math.PI*2); ctx.fill();
  }

  _drawSamgyeopsal(ctx,x,y,s) {
    // grill plate outer
    const grillG=ctx.createRadialGradient(x,y+s*0.32,s*0.04,x,y+s*0.32,s*0.4);
    grillG.addColorStop(0,'#4A4040'); grillG.addColorStop(1,'#2A2020');
    ctx.beginPath(); ctx.ellipse(x,y+s*0.32,s*0.38,s*0.1,0,0,Math.PI*2);
    ctx.fillStyle=grillG; ctx.fill(); ctx.strokeStyle='#1A1010'; ctx.lineWidth=2; ctx.stroke();
    // grill surface (inner)
    ctx.beginPath(); ctx.ellipse(x,y+s*0.32,s*0.3,s*0.075,0,0,Math.PI*2);
    ctx.fillStyle='#302828'; ctx.fill();
    // grill bars (horizontal ridges)
    ctx.strokeStyle='#1C1414'; ctx.lineWidth=2; ctx.lineCap='round';
    for (const [ox,oy,len] of [[-s*0.22,y+s*0.26,s*0.44],[-s*0.26,y+s*0.32,s*0.52],[-s*0.22,y+s*0.38,s*0.44]]) {
      ctx.beginPath(); ctx.moveTo(x+ox,oy); ctx.lineTo(x+ox+len,oy); ctx.stroke();
    }
    // pork belly slices (3 pieces)
    for (const [dx,dy,rot] of [[-s*0.15,s*0.04,-0.22],[s*0.0,s*0.0,0.08],[s*0.15,s*0.03,0.28]]) {
      ctx.save(); ctx.translate(x+dx,y+dy); ctx.rotate(rot);
      const fw=s*0.12, fh=s*0.22;
      // outer edge shadow
      ctx.fillStyle='rgba(0,0,0,0.18)';
      ctx.beginPath(); ctx.roundRect(-fw+s*0.008,s*0.005,fw*2,fh,5); ctx.fill();
      // fat layer (top, creamy white)
      const fatG=ctx.createLinearGradient(-fw,0,fw,0);
      fatG.addColorStop(0,'#E8D0BC'); fatG.addColorStop(0.5,'#F8EAD8'); fatG.addColorStop(1,'#DEC8B0');
      ctx.beginPath(); ctx.roundRect(-fw,0,fw*2,fh*0.38,4);
      ctx.fillStyle=fatG; ctx.fill();
      ctx.strokeStyle='#C8B0A0'; ctx.lineWidth=0.8; ctx.stroke();
      // thin fat stripe in middle
      ctx.fillStyle='rgba(255,248,235,0.65)';
      ctx.beginPath(); ctx.roundRect(-fw,fh*0.38,fw*2,fh*0.1,0); ctx.fill();
      // meat layer (red/brown gradient)
      const meatG=ctx.createLinearGradient(-fw,0,fw,0);
      meatG.addColorStop(0,'#B04020'); meatG.addColorStop(0.5,'#D05030'); meatG.addColorStop(1,'#A03018');
      ctx.beginPath(); ctx.roundRect(-fw,fh*0.48,fw*2,fh*0.52,{bl:4,br:4,tl:0,tr:0});
      ctx.fillStyle=meatG; ctx.fill();
      ctx.strokeStyle='#8A2810'; ctx.lineWidth=0.8; ctx.stroke();
      // grill marks on meat (dark diagonal lines)
      ctx.save();
      ctx.beginPath(); ctx.roundRect(-fw,fh*0.48,fw*2,fh*0.52,{bl:4,br:4,tl:0,tr:0}); ctx.clip();
      ctx.strokeStyle='rgba(50,10,5,0.45)'; ctx.lineWidth=1.4;
      for (const gx of [-fw*0.5,0,fw*0.5]) {
        ctx.beginPath(); ctx.moveTo(gx-s*0.02,fh*0.48); ctx.lineTo(gx+s*0.02,fh); ctx.stroke();
      }
      ctx.restore();
      // meat surface highlight
      ctx.fillStyle='rgba(255,160,100,0.22)';
      ctx.beginPath(); ctx.ellipse(-fw*0.3,fh*0.65,fw*0.5,fh*0.12,0,0,Math.PI*2); ctx.fill();
      // fat top highlight
      ctx.fillStyle='rgba(255,255,245,0.35)';
      ctx.beginPath(); ctx.ellipse(-fw*0.2,fh*0.12,fw*0.55,fh*0.1,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
    // sizzle smoke (3 wisps)
    ctx.lineCap='round';
    for (const [dx,flip,op] of [[-s*0.12,1,0.32],[s*0.02,-1,0.28],[s*0.14,1,0.22]]) {
      ctx.beginPath();
      ctx.moveTo(x+dx,y-s*0.04);
      ctx.bezierCurveTo(x+dx+flip*s*0.08,y-s*0.16,x+dx-flip*s*0.06,y-s*0.26,x+dx+flip*s*0.04,y-s*0.36);
      ctx.strokeStyle=`rgba(190,170,150,${op})`; ctx.lineWidth=1.5; ctx.stroke();
    }
  }
}
