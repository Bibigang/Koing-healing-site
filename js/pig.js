// ── Pig ───────────────────────────────────────────────────
class Pig {
  resetAt(x) {
    this.r=Math.min(W,H)*0.16;
    this.cx=x; this.cy=H*0.25;
    this.vcx=0; this.vcy=0;
    this.neighborRest=(2*Math.PI*this.r)/N;
    this.pts=Array.from({length:N},(_,i)=>{
      const a=(i/N)*Math.PI*2-Math.PI/2;
      const ox=Math.cos(a)*this.r, oy=Math.sin(a)*this.r;
      return {x:this.cx+ox,y:this.cy+oy,vx:0,vy:0,ox,oy};
    });
    this.dragIdx=-1; this.active=false;
    this.petLevel=0; this.eatTimer=0;
    this.drunkTimer=0; this.sniffTimer=0;
    this.fatTimer=0; this.cupcakeEatTimes=[];
    this.earPts=[
      {x:this.cx-this.r*0.52,y:this.cy-this.r*0.78,vx:0,vy:0},
      {x:this.cx+this.r*0.52,y:this.cy-this.r*0.78,vx:0,vy:0},
    ];
    this.earDragIdx=-1; this.earPullTimer=0;
    this.faceOffX=0; this.faceOffY=0; this.faceVX=0; this.faceVY=0;
  }
  constructor(x) { this.resetAt(x); }

  stress() {
    return this.pts.reduce((sum,p)=>sum+Math.hypot(p.x-(this.cx+p.ox),p.y-(this.cy+p.oy)),0)/(N*this.r);
  }

  updateCenter() {
    const groundY=H*0.6;
    this.vcy+=0.5;
    const prevCx=this.cx, prevCy=this.cy;
    this.cx+=this.vcx; this.cy+=this.vcy;
    if (this.cy+this.r>=groundY) {
      this.cy=groundY-this.r;
      if (Math.abs(this.vcy)<1.5) { this.vcy=0; }
      else {
        this.vcy*=-0.55;
        for (let i=0;i<N;i++) {
          const p=this.pts[i];
          const sf=Math.abs(p.ox)/this.r;
          p.vx+=(p.ox>0?1:-1)*sf*Math.abs(this.vcy)*0.3;
          p.vy-=Math.abs(this.vcy)*0.15;
        }
      }
      this.vcx*=0.8;
    }
    const dcx=this.cx-prevCx, dcy=this.cy-prevCy;
    for (const p of this.pts) { p.x+=dcx; p.y+=dcy; }
  }

  update() {
    this.petLevel=Math.max(0,this.petLevel-0.012);
    if (this.fatTimer>0) this.fatTimer--;
    if (this.earPullTimer>0) this.earPullTimer--;
    if (stretchSndTimer>0) stretchSndTimer--;
    this.updateCenter();
    for (let i=0;i<N;i++) {
      const p=this.pts[i];
      if (this.active&&i===this.dragIdx) continue;
      const prev=this.pts[(i-1+N)%N], next=this.pts[(i+1)%N];
      let fx=(this.cx+p.ox-p.x)*K_RESTORE;
      let fy=(this.cy+p.oy-p.y)*K_RESTORE;
      for (const nb of [prev,next]) {
        const dx=nb.x-p.x,dy=nb.y-p.y,d=Math.hypot(dx,dy)||0.001;
        const f=(d-this.neighborRest)*K_NEIGHBOR;
        fx+=(dx/d)*f; fy+=(dy/d)*f;
      }
      p.vx=(p.vx+fx)*DAMPING; p.vy=(p.vy+fy)*DAMPING;
      p.x+=p.vx; p.y+=p.vy;
    }
    for (let i=0;i<2;i++) {
      if (this.earDragIdx===i) continue;
      const ep=this.earPts[i];
      const sign=i===0?-1:1;
      const tx=this.cx+sign*this.r*0.52, ty=this.cy-this.r*0.78;
      ep.vx=(ep.vx+(tx-ep.x)*0.22)*0.68;
      ep.vy=(ep.vy+(ty-ep.y)*0.22)*0.68;
      ep.x+=ep.vx; ep.y+=ep.vy;
    }
    // face jelly: springs toward drag displacement, snaps back on release
    if (this.active&&this.dragIdx>=0) {
      const p=this.pts[this.dragIdx];
      const tx=(p.x-(this.cx+p.ox))*0.22;
      const ty=(p.y-(this.cy+p.oy))*0.22;
      this.faceVX=(this.faceVX+(tx-this.faceOffX)*0.18)*0.72;
      this.faceVY=(this.faceVY+(ty-this.faceOffY)*0.18)*0.72;
    } else {
      this.faceVX=(this.faceVX-this.faceOffX*0.24)*0.68;
      this.faceVY=(this.faceVY-this.faceOffY*0.24)*0.68;
    }
    this.faceOffX+=this.faceVX;
    this.faceOffY+=this.faceVY;
  }

  pointerDown(x,y) {
    if (Math.hypot(x-this.cx,y-this.cy)>this.r*1.5) return false;
    let best=Infinity;
    this.pts.forEach((p,i)=>{const d=Math.hypot(x-p.x,y-p.y);if(d<best){best=d;this.dragIdx=i;}});
    this.active=true; this.downX=x; this.downY=y;
    return true;
  }

  jiggle() {
    this.vcy=-this.r*0.13;
    for (const p of this.pts) {
      const ax=p.ox/(Math.hypot(p.ox,p.oy)||1), ay=p.oy/(Math.hypot(p.ox,p.oy)||1);
      const pw=this.r*0.18;
      p.vx+=ax*pw+(Math.random()-0.5)*pw*0.6;
      p.vy+=ay*pw+(Math.random()-0.5)*pw*0.6;
    }
  }

  eat(type) {
    if (type==='cocktail'||type==='soju') this.drunkTimer=60;
    if (type==='cupcake') {
      const now=Date.now();
      this.cupcakeEatTimes=this.cupcakeEatTimes.filter(t=>now-t<5000);
      this.cupcakeEatTimes.push(now);
      if (this.cupcakeEatTimes.length>=3) { this.fatTimer=120; this.cupcakeEatTimes=[]; }
    }
    this.eatTimer=100; this.jiggle();
  }

  sniff() { this.sniffTimer=120; }

  earHitTest(mx,my) {
    for (let i=0;i<2;i++) {
      const sign=i===0?-1:1;
      const ax=this.cx+sign*this.r*0.52, ay=this.cy-this.r*0.78;
      if (Math.hypot(mx-ax,my-ay)<this.r*0.38) return i;
    }
    return -1;
  }
  startEarDrag(i) { this.earDragIdx=i; this.earPullTimer=60; }
  moveEarDrag(i,mx,my) {
    const ep=this.earPts[i]; ep.x=mx; ep.y=my; ep.vx=0; ep.vy=0;
    this.earPullTimer=60;
  }
  endEarDrag() { this.earDragIdx=-1; }

  pointerMove(x,y) {
    if (!this.active) return;
    const p=this.pts[this.dragIdx];
    const rx=this.cx+p.ox, ry=this.cy+p.oy;
    const dx=x-rx, dy=y-ry, d=Math.hypot(dx,dy);
    const maxD=this.r*MAX_DEFORM;
    if (d>maxD) { x=rx+dx/d*maxD; y=ry+dy/d*maxD; }
    p.x=x; p.y=y; p.vx=0; p.vy=0;
    playStretch();
    const maxSpread=Math.round(1+influenceValue*7);
    const falloff=0.55-influenceValue*0.2;
    for (let spread=1;spread<=maxSpread;spread++) {
      const fac=Math.pow(falloff,spread)*(0.1+influenceValue*0.25);
      for (const sign of [1,-1]) {
        const ni=(this.dragIdx+sign*spread+N)%N;
        this.pts[ni].vx+=(x-this.pts[ni].x)*fac;
        this.pts[ni].vy+=(y-this.pts[ni].y)*fac;
      }
    }
  }

  pointerUp(x,y) {
    if (this.active&&x!==undefined) {
      if (Math.hypot(x-this.downX,y-this.downY)<10) this.jiggle();
    }
    this.active=false; this.dragIdx=-1;
  }

  draw(ctx) {
    const s=this.stress();
    const bodyColor=lerpColor('#FFB3C6','#FF5577',Math.min(s/0.5,1));
    const strokeColor=lerpColor('#E896A8','#CC3355',Math.min(s/0.5,1));
    const fatScale=this.fatTimer>0?1+0.38*Math.sin(Math.PI*(1-this.fatTimer/120)):1;
    if (fatScale!==1) {
      ctx.save();
      ctx.translate(this.cx,this.cy); ctx.scale(fatScale,fatScale); ctx.translate(-this.cx,-this.cy);
    }
    this._drawEar(ctx,this.cx-this.r*0.52,this.cy-this.r*0.78,this.earPts[0].x,this.earPts[0].y);
    this._drawEar(ctx,this.cx+this.r*0.52,this.cy-this.r*0.78,this.earPts[1].x,this.earPts[1].y);
    ctx.save();
    ctx.shadowColor='rgba(80,0,30,0.18)'; ctx.shadowBlur=20; ctx.shadowOffsetY=10;
    ctx.beginPath(); smoothPath(ctx,this.pts); ctx.fillStyle=bodyColor; ctx.fill();
    ctx.restore();
    ctx.beginPath(); smoothPath(ctx,this.pts);
    ctx.strokeStyle=strokeColor; ctx.lineWidth=3; ctx.stroke();
    this._drawFace(ctx,s);
    if (fatScale!==1) ctx.restore();
  }

  _drawEar(ctx,ax,ay,tx,ty) {
    const baseR=this.r*0.22;
    const dx=tx-ax, dy=ty-ay, dist=Math.hypot(dx,dy);
    if (dist<baseR*0.25) {
      ctx.beginPath(); ctx.arc(ax,ay,baseR,0,Math.PI*2); ctx.fillStyle='#FFAAC4'; ctx.fill();
      ctx.strokeStyle='#E896A8'; ctx.lineWidth=2.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(ax,ay,baseR*0.5,0,Math.PI*2); ctx.fillStyle='#FF8FAE'; ctx.fill();
      return;
    }
    const angle=Math.atan2(dy,dx), perp=angle+Math.PI/2;
    const cosP=Math.cos(perp), sinP=Math.sin(perp);
    const tipR=Math.max(baseR*0.28,baseR*(1-dist/(this.r*1.2)));
    ctx.beginPath();
    ctx.moveTo(ax+cosP*baseR,ay+sinP*baseR);
    ctx.lineTo(tx+cosP*tipR,ty+sinP*tipR);
    ctx.arc(tx,ty,tipR,perp,perp+Math.PI);
    ctx.lineTo(ax-cosP*baseR,ay-sinP*baseR);
    ctx.arc(ax,ay,baseR,perp+Math.PI,perp+Math.PI*2);
    ctx.closePath();
    ctx.fillStyle='#FFAAC4'; ctx.fill();
    ctx.strokeStyle='#E896A8'; ctx.lineWidth=2.5; ctx.stroke();
    const midX=ax+dx*0.6, midY=ay+dy*0.6;
    ctx.beginPath(); ctx.arc(midX,midY,Math.min(tipR*0.85,baseR*0.5),0,Math.PI*2);
    ctx.fillStyle='#FF8FAE'; ctx.fill();
  }

  _drawFace(ctx,s) {
    ctx.save();
    ctx.translate(this.faceOffX, this.faceOffY);
    // squash-stretch: scale along drag direction
    const fd=Math.hypot(this.faceOffX,this.faceOffY);
    if (fd>0.5) {
      const nx=this.faceOffX/fd, ny=this.faceOffY/fd;
      const str=Math.min(fd/(this.r*0.6),1);
      const sx=1+str*0.28, sy=1-str*0.18;
      ctx.translate(this.cx, this.cy);
      ctx.transform(1+(sx-1)*nx*nx, (sx-1)*nx*ny, (sx-1)*nx*ny, 1+(sx-1)*ny*ny, 0, 0);
      ctx.scale(1,sy+(sx-1)*Math.abs(ny));
      ctx.translate(-this.cx, -this.cy);
    }
    const {cx,cy,r}=this;
    ctx.save();
    ctx.globalAlpha=0.28+this.petLevel*0.38; ctx.fillStyle='#FF4477';
    ctx.beginPath(); ctx.ellipse(cx-r*0.5,cy+r*0.06,r*0.13,r*0.09,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+r*0.5,cy+r*0.06,r*0.13,r*0.09,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.ellipse(cx,cy+r*0.2,r*0.33,r*0.23,0,0,Math.PI*2);
    ctx.fillStyle='#FFB3C6'; ctx.fill(); ctx.strokeStyle='#E896A8'; ctx.lineWidth=2; ctx.stroke();
    if (this.sniffTimer>0) this.sniffTimer--;
    const ss=this.sniffTimer>0?1+0.7*Math.abs(Math.sin(this.sniffTimer*0.25)):1;
    ctx.fillStyle='#BB5570';
    for (const nx of [cx-r*0.12,cx+r*0.12]) {
      const ny=cy+r*0.2, hw=r*0.038*ss, hh=r*0.1*ss;
      ctx.beginPath();
      ctx.moveTo(nx,ny+hh*0.6);
      ctx.bezierCurveTo(nx-hw*2,ny+hh*0.1,nx-hw*2,ny-hh*0.9,nx,ny-hh*0.35);
      ctx.bezierCurveTo(nx+hw*2,ny-hh*0.9,nx+hw*2,ny+hh*0.1,nx,ny+hh*0.6);
      ctx.fill();
    }
    this._drawEyes(ctx,s);
    this._drawMouth(ctx,s);
    ctx.restore(); // end face translate
  }

  _drawEyes(ctx,s) {
    const {cx,cy,r}=this;
    const ey=cy-r*0.1, ex=r*0.27, er=r*0.1;
    ctx.save();
    ctx.lineWidth=Math.max(2.5,r*0.038); ctx.lineCap='round';
    if (this.eatTimer>0) { this.eatTimer--; s=0; }
    if (this.earDragIdx>=0||this.earPullTimer>0) {
      ctx.strokeStyle='#442233';
      for (const sign of [-1,1]) {
        const ex2=cx+sign*ex;
        ctx.beginPath();
        ctx.moveTo(ex2-er,ey-er*0.5); ctx.lineTo(ex2+er,ey+er*0.5);
        ctx.moveTo(ex2+er,ey-er*0.5); ctx.lineTo(ex2-er,ey+er*0.5);
        ctx.stroke();
      }
    } else if (starEyeTimer>0) {
      starEyeTimer--;
      ctx.fillStyle='#FFCC00';
      for (const sign of [-1,1]) { _starShape(cx+sign*ex,ey,er*1.1); }
    } else if (rainTimer>0) {
      ctx.strokeStyle='#3366AA';
      for (const sign of [-1,1]) {
        ctx.beginPath(); ctx.arc(cx+sign*ex,ey-er*0.3,er,0.25,Math.PI-0.25,false); ctx.stroke();
      }
    } else if (this.drunkTimer>0) {
      this.drunkTimer--;
      ctx.strokeStyle='#442233';
      for (const sign of [-1,1]) {
        const ex2=cx+sign*ex;
        ctx.beginPath();
        ctx.moveTo(ex2-er,ey);
        ctx.bezierCurveTo(ex2-er*0.3,ey-er*0.9,ex2+er*0.3,ey+er*0.9,ex2+er,ey);
        ctx.stroke();
      }
    } else if (this.petLevel>0.3) {
      ctx.strokeStyle='#442233';
      for (const sign of [-1,1]) {
        const ex2=cx+sign*ex;
        ctx.beginPath(); ctx.arc(ex2,ey-er*0.5,er,0.25,Math.PI-0.25,false); ctx.stroke();
        for (const pos of [-1,0,1]) {
          const ang=Math.PI*0.5+pos*0.55;
          const bx=ex2+Math.cos(ang)*er, by=ey-er*0.5+Math.sin(ang)*er;
          ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+Math.cos(ang)*er*0.5,by+Math.sin(ang)*er*0.5); ctx.stroke();
        }
      }
    } else if (s<0.08) {
      ctx.strokeStyle='#442233';
      for (const sign of [-1,1]) {
        ctx.beginPath(); ctx.arc(cx+sign*ex,ey+er*0.5,er,Math.PI+0.25,-0.25,false); ctx.stroke();
      }
    } else if (s<0.35) {
      for (const sign of [-1,1]) {
        ctx.fillStyle='#442233'; ctx.beginPath(); ctx.arc(cx+sign*ex,ey,er,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(cx+sign*ex+er*0.3,ey-er*0.3,er*0.35,0,Math.PI*2); ctx.fill();
      }
    } else {
      ctx.strokeStyle='#442233';
      for (const sign of [-1,1]) {
        ctx.beginPath();
        ctx.moveTo(cx+sign*ex-er,ey-er*0.5); ctx.lineTo(cx+sign*ex+er,ey+er*0.5);
        ctx.moveTo(cx+sign*ex+er,ey-er*0.5); ctx.lineTo(cx+sign*ex-er,ey+er*0.5);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  _drawMouth(ctx,s) {
    const {cx,cy,r}=this;
    const my=cy+r*0.44;
    ctx.save();
    ctx.lineWidth=Math.max(2,r*0.03); ctx.lineCap='round';
    if (rainTimer>0) {
      ctx.strokeStyle='#3366AA';
      ctx.beginPath(); ctx.arc(cx,my-r*0.04,r*0.1,0.15,Math.PI-0.15,true); ctx.stroke();
    } else if (this.eatTimer>0) {
      ctx.fillStyle='#882244';
      ctx.beginPath(); ctx.ellipse(cx,my,r*0.22,r*0.13,0,0,Math.PI*2); ctx.fill();
    } else if (s<0.08) {
      ctx.strokeStyle='#BB5570';
      ctx.beginPath(); ctx.arc(cx,my-r*0.02,r*0.1,0.15,Math.PI-0.15); ctx.stroke();
    } else if (s<0.35) {
      ctx.fillStyle='#BB5570';
      ctx.beginPath(); ctx.arc(cx,my,r*0.065,0,Math.PI*2); ctx.fill();
    } else {
      ctx.strokeStyle='#BB5570';
      ctx.beginPath();
      ctx.moveTo(cx-r*0.1,my);
      ctx.quadraticCurveTo(cx-r*0.03,my+r*0.06,cx,my-r*0.01);
      ctx.quadraticCurveTo(cx+r*0.03,my-r*0.07,cx+r*0.1,my+r*0.01);
      ctx.stroke();
    }
    ctx.restore();
  }
}
