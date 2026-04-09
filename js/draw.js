// ── Panel background ──────────────────────────────────────
function drawAccessoryPanel() {
  const pw=Math.min(W*0.13,72), ph=H*0.44;
  const bs=34; // hanger button size

  // Hanger button — always visible
  const hx=8+bs/2, hy=8+bs/2;
  ctx.save();
  ctx.fillStyle=panelOpen?'rgba(255,200,230,0.95)':'rgba(255,238,248,0.92)';
  ctx.strokeStyle='rgba(255,175,210,0.75)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.roundRect(8,8,bs,bs,10); ctx.fill(); ctx.stroke();
  // draw hanger icon
  ctx.strokeStyle='#CC6699'; ctx.lineWidth=2; ctx.lineCap='round'; ctx.lineJoin='round';
  // Hook: J-shape bezier — tip ends pointing downward
  ctx.beginPath(); ctx.moveTo(hx,hy-bs*0.25);
  ctx.bezierCurveTo(hx,hy-bs*0.45, hx+bs*0.26,hy-bs*0.45, hx+bs*0.26,hy-bs*0.2); ctx.stroke();
  // Neck
  ctx.beginPath(); ctx.moveTo(hx,hy-bs*0.25); ctx.lineTo(hx,hy-bs*0.03); ctx.stroke();
  // Shoulders
  ctx.beginPath(); ctx.moveTo(hx,hy-bs*0.03); ctx.quadraticCurveTo(hx-bs*0.15,hy+bs*0.03,hx-bs*0.26,hy+bs*0.2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx,hy-bs*0.03); ctx.quadraticCurveTo(hx+bs*0.15,hy+bs*0.03,hx+bs*0.26,hy+bs*0.2); ctx.stroke();
  ctx.restore();

  if (panelSlide<=0) return;

  // Sliding panel
  const ox=panelOffsetX();
  ctx.save();
  ctx.translate(ox,0);
  ctx.fillStyle='rgba(255,238,248,0.92)'; ctx.strokeStyle='rgba(255,175,210,0.75)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.roundRect(8,H*0.09,pw,ph,18); ctx.fill(); ctx.stroke();
  if (panelMaxScroll>0) {
    const barH=Math.max(24,ph*ph/(ph+panelMaxScroll));
    const barY=H*0.09+6+(ph-12-barH)*(panelScroll/panelMaxScroll);
    ctx.fillStyle='rgba(220,160,200,0.22)';
    ctx.beginPath(); ctx.roundRect(10,H*0.09+6,4,ph-12,4); ctx.fill();
    ctx.fillStyle='rgba(200,100,170,0.7)';
    ctx.beginPath(); ctx.roundRect(10,barY,4,barH,4); ctx.fill();
    ctx.fillStyle='rgba(255,200,235,0.6)';
    ctx.beginPath(); ctx.roundRect(11,barY+2,2,barH*0.4,2); ctx.fill();
  }
  ctx.restore();
}

// ── Cloud ─────────────────────────────────────────────────
function drawCloud(cx,cy,cr,fill,shadow) {
  ctx.save();
  ctx.fillStyle=fill; ctx.shadowColor=shadow; ctx.shadowBlur=8;
  for (const [dx,dy,dr] of [[0,0,1],[-0.65,0.25,0.72],[0.65,0.25,0.72],[0.28,-0.38,0.65],[-0.28,-0.38,0.65]]) {
    ctx.beginPath(); ctx.arc(cx+dx*cr,cy+dy*cr,cr*dr,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

// ── Scene Background ──────────────────────────────────────
function drawSceneBackground(scene,ox) {
  const gy=H*scene.groundY;
  ctx.save();
  ctx.beginPath(); ctx.rect(ox,0,W,H); ctx.clip();

  // Sky
  const sky=ctx.createLinearGradient(ox,0,ox,gy);
  scene.sky.forEach((c,i,a)=>sky.addColorStop(i/(a.length-1),c));
  ctx.fillStyle=sky; ctx.fillRect(ox,0,W,gy);

  // Ground
  const grd=ctx.createLinearGradient(ox,gy,ox,H);
  scene.ground.forEach((c,i,a)=>grd.addColorStop(i/(a.length-1),c));
  ctx.fillStyle=grd; ctx.fillRect(ox,gy,W,H-gy);

  // Decorations
  drawSceneDecorations(scene,ox);

  // Pig shadow
  ctx.fillStyle=scene.shadowColor;
  ctx.beginPath(); ctx.ellipse(ox+W/2,gy+H*0.015,W*0.11,H*0.018,0,0,Math.PI*2); ctx.fill();

  // Clouds
  if (scene.cloudFill) {
    for (const c of CLOUDS)
      drawCloud(ox+c.rx*W,c.ry*H,c.rs*Math.min(W,H),scene.cloudFill,scene.cloudShadow||'rgba(100,140,200,0.2)');
  }

  ctx.restore();
}

// ── Scene Decorations ─────────────────────────────────────
function drawSceneDecorations(scene,ox) {
  const gy=H*scene.groundY;
  if (scene.id==='spring') {
    const bBloom=tulipBloom>=60?1:tulipBloom/60;
  SPRING_FLOWERS.forEach(([rx,ry],i)=>
    _bgFlower(ox+rx*W,ry*H,H*0.022,rx*W+ry*H,bBloom,i));
  }
  else if (scene.id==='night') {
    ctx.save();
    for (let si=0;si<NIGHT_STARS.length;si++) {
      const [rx,ry]=NIGHT_STARS[si];
      const pulse=0.55+0.45*Math.sin(starPulse*0.04+si*1.3);
      const baseR=H*0.005+Math.sin(rx*37)*H*0.003;
      ctx.globalAlpha=0.45+0.55*pulse;
      ctx.fillStyle='rgba(255,255,220,1)';
      ctx.beginPath(); ctx.arc(ox+rx*W,ry*H,baseR*(0.7+0.5*pulse),0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
    const mx=ox+W*0.82, my=H*0.1, mr=H*0.07;
    ctx.save();
    // full moon base
    ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.fillStyle='#FFFFCC'; ctx.fill();
    if (moonWink>0) {
      // draw face first (on full circle), then shadow covers the non-crescent part
      // face is shifted left so it sits naturally on the crescent
      const fx=mx-mr*0.2, fy=my;
      ctx.strokeStyle='#8A9060'; ctx.lineWidth=mr*0.11; ctx.lineCap='round';
      // left eye — wink (closed arc ∪)
      ctx.beginPath(); ctx.arc(fx-mr*0.2,fy-mr*0.1,mr*0.12,Math.PI,0); ctx.stroke();
      // right eye — dot
      ctx.beginPath(); ctx.arc(fx+mr*0.18,fy-mr*0.1,mr*0.07,0,Math.PI*2);
      ctx.fillStyle='#8A9060'; ctx.fill();
      // smile
      ctx.beginPath(); ctx.arc(fx,fy+mr*0.12,mr*0.2,0.25,Math.PI-0.25); ctx.stroke();
      moonWink--;
    }
    // shadow circle — creates crescent (covers right side, naturally hides any face drawn there)
    ctx.beginPath(); ctx.arc(mx+mr*0.42,my-mr*0.08,mr*0.82,0,Math.PI*2);
    ctx.fillStyle='#152850'; ctx.fill();
    ctx.restore();
  }
  else if (scene.id==='rainy') {
    ctx.save();
    for (const p of PUDDLES) {
      ctx.globalAlpha=0.32;
      ctx.beginPath(); ctx.ellipse(ox+p.rx*W,p.ry*H,p.rw*W,p.rh*H,0,0,Math.PI*2);
      ctx.fillStyle='#7AAABB'; ctx.fill();
      ctx.globalAlpha=0.15;
      ctx.strokeStyle='#AACCDD'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.ellipse(ox+p.rx*W,p.ry*H,p.rw*W*0.6,p.rh*H*0.5,0,0,Math.PI*2);
      ctx.stroke();
    }
    ctx.restore();
    _drawLightningBolt(ox+LIGHTNING.rx*W, LIGHTNING.ry*H);
  }
  else if (scene.id==='cozy') {
    ctx.fillStyle='rgba(100,65,30,0.42)';
    ctx.fillRect(ox,gy-H*0.012,W,H*0.012);
    const wx=ox+W*0.68, wy=H*0.08, ww=W*0.22, wh=H*0.28;
    // window glass
    ctx.fillStyle='#C8E8F8'; ctx.fillRect(wx,wy,ww,wh);
    // window cross divider
    ctx.strokeStyle='#D4C4A8'; ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(wx+ww/2,wy); ctx.lineTo(wx+ww/2,wy+wh);
    ctx.moveTo(wx,wy+wh*0.48); ctx.lineTo(wx+ww,wy+wh*0.48);
    ctx.stroke();
    // window frame
    ctx.strokeStyle='#C4A880'; ctx.lineWidth=5; ctx.strokeRect(wx,wy,ww,wh);
    // curtain rod
    ctx.strokeStyle='#A08060'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(wx-ww*0.15,wy-H*0.008); ctx.lineTo(wx+ww+ww*0.15,wy-H*0.008); ctx.stroke();
    ctx.fillStyle='#A08060';
    ctx.beginPath(); ctx.arc(wx-ww*0.15,wy-H*0.008,H*0.009,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(wx+ww+ww*0.15,wy-H*0.008,H*0.009,0,Math.PI*2); ctx.fill();

    // curtain close progress (0=open, 1=closed)
    const cp=curtainClose/30;
    const cy0=wy-H*0.014, cbot=wy+wh+H*0.05;
    const tieY=wy+wh*0.45;
    const cCol='rgba(175,112,128,0.92)', cShad='rgba(130,75,90,0.6)', cHi='rgba(220,165,180,0.55)';
    const knotAlpha=Math.max(0,1-cp*3); // knot fades quickly as curtain closes

    // ── left curtain ──
    // outer anchor: left of rod (fixed). inner edge: slides RIGHT to cover window fully
    { const anchor=wx-ww*0.15;
      const innerOpen=wx+ww*0.04;       // inner edge when open (just inside window left)
      const innerClosed=wx+ww+ww*0.05;  // inner edge when closed (past window right edge)
      const inner=innerOpen+(innerClosed-innerOpen)*cp;

      ctx.fillStyle=cCol;
      // main panel body
      ctx.beginPath();
      ctx.moveTo(anchor,cy0);
      ctx.bezierCurveTo(anchor-ww*0.08*(1-cp),cy0+wh*0.25, anchor-ww*0.1*(1-cp),tieY-wh*0.08, anchor,tieY);
      ctx.bezierCurveTo(anchor-ww*0.1*(1-cp),tieY+wh*0.1, anchor-ww*0.08*(1-cp),cbot-wh*0.12, anchor,cbot);
      ctx.lineTo(inner,cbot);
      ctx.bezierCurveTo(inner+ww*0.04*(1-cp),cbot-wh*0.1, inner+ww*0.02*(1-cp),cy0+wh*0.15, inner,cy0);
      ctx.closePath(); ctx.fill();
      // fold highlight
      ctx.strokeStyle=cHi; ctx.lineWidth=2; ctx.lineCap='round';
      ctx.beginPath();
      ctx.moveTo(anchor+(inner-anchor)*0.3,cy0+wh*0.04);
      ctx.bezierCurveTo(anchor+(inner-anchor)*0.28,cy0+wh*0.35, anchor+(inner-anchor)*0.3,cy0+wh*0.65, anchor+(inner-anchor)*0.26,cbot-wh*0.04);
      ctx.stroke();
      // fold shadow
      ctx.strokeStyle=cShad; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(anchor+(inner-anchor)*0.6,cy0+wh*0.08);
      ctx.bezierCurveTo(anchor+(inner-anchor)*0.58,cy0+wh*0.4, anchor+(inner-anchor)*0.6,cy0+wh*0.7, anchor+(inner-anchor)*0.56,cbot-wh*0.06);
      ctx.stroke();
      // tie knot (fades as closes)
      if (knotAlpha>0) {
        ctx.save(); ctx.globalAlpha=knotAlpha;
        const kx=anchor+(inner-anchor)*0.78;
        ctx.fillStyle='rgba(140,80,100,0.9)';
        ctx.beginPath(); ctx.ellipse(kx,tieY,ww*0.07,H*0.018,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(200,140,155,0.6)';
        ctx.beginPath(); ctx.ellipse(kx,tieY,ww*0.04,H*0.009,0,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }

    // ── right curtain (mirror) ──
    { const anchor=wx+ww+ww*0.15;
      const innerOpen=wx+ww-ww*0.04;    // inner edge when open
      const innerClosed=wx-ww*0.05;     // inner edge when closed (past window left edge)
      const inner=innerOpen+(innerClosed-innerOpen)*cp;

      ctx.fillStyle=cCol;
      ctx.beginPath();
      ctx.moveTo(anchor,cy0);
      ctx.bezierCurveTo(anchor+ww*0.08*(1-cp),cy0+wh*0.25, anchor+ww*0.1*(1-cp),tieY-wh*0.08, anchor,tieY);
      ctx.bezierCurveTo(anchor+ww*0.1*(1-cp),tieY+wh*0.1, anchor+ww*0.08*(1-cp),cbot-wh*0.12, anchor,cbot);
      ctx.lineTo(inner,cbot);
      ctx.bezierCurveTo(inner-ww*0.04*(1-cp),cbot-wh*0.1, inner-ww*0.02*(1-cp),cy0+wh*0.15, inner,cy0);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle=cHi; ctx.lineWidth=2; ctx.lineCap='round';
      ctx.beginPath();
      ctx.moveTo(anchor-(anchor-inner)*0.3,cy0+wh*0.04);
      ctx.bezierCurveTo(anchor-(anchor-inner)*0.28,cy0+wh*0.35, anchor-(anchor-inner)*0.3,cy0+wh*0.65, anchor-(anchor-inner)*0.26,cbot-wh*0.04);
      ctx.stroke();
      ctx.strokeStyle=cShad; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(anchor-(anchor-inner)*0.6,cy0+wh*0.08);
      ctx.bezierCurveTo(anchor-(anchor-inner)*0.58,cy0+wh*0.4, anchor-(anchor-inner)*0.6,cy0+wh*0.7, anchor-(anchor-inner)*0.56,cbot-wh*0.06);
      ctx.stroke();
      if (knotAlpha>0) {
        ctx.save(); ctx.globalAlpha=knotAlpha;
        const kx=anchor-(anchor-inner)*0.78;
        ctx.fillStyle='rgba(140,80,100,0.9)';
        ctx.beginPath(); ctx.ellipse(kx,tieY,ww*0.07,H*0.018,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(200,140,155,0.6)';
        ctx.beginPath(); ctx.ellipse(kx,tieY,ww*0.04,H*0.009,0,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }
    ctx.save(); ctx.globalAlpha=0.68;
    ctx.beginPath(); ctx.ellipse(ox+W*0.5,gy+H*0.04,W*0.26,H*0.05,0,0,Math.PI*2);
    ctx.fillStyle='#CC7744'; ctx.fill(); ctx.strokeStyle='#AA5522'; ctx.lineWidth=2; ctx.stroke();
    ctx.globalAlpha=0.45;
    ctx.beginPath(); ctx.ellipse(ox+W*0.5,gy+H*0.04,W*0.2,H*0.036,0,0,Math.PI*2);
    ctx.strokeStyle='#FFAA66'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.restore();
    // 1인용 카우치 소파 (와인 컬러)
    { const bounceDy=sofaBounce>0?Math.sin(sofaBounce*0.38)*(sofaBounce/40)*H*0.022:0;
      if(sofaBounce>0) sofaBounce--;
      const sx=ox+W*0.04, sy=gy-H*0.2-bounceDy, sw=W*0.28, sh=H*0.17;
      const cDark='#4A1828', cMid='#6B2440', cLight='#8C3458', cHighlight='#A84870';
      const legH=H*0.022, legW=W*0.016;
      // legs
      ctx.fillStyle='#2E1008';
      ctx.beginPath(); ctx.roundRect(sx+sw*0.1,sy+sh,legW,legH,3); ctx.fill();
      ctx.beginPath(); ctx.roundRect(sx+sw*0.86,sy+sh,legW,legH,3); ctx.fill();
      // body frame (outer shadow)
      ctx.fillStyle=cDark;
      ctx.beginPath(); ctx.roundRect(sx,sy+sh*0.22,sw,sh*0.78,[6,6,10,10]); ctx.fill();
      // backrest
      ctx.fillStyle=cDark;
      ctx.beginPath(); ctx.roundRect(sx+sw*0.1,sy,sw*0.8,sh*0.7,[14,14,4,4]); ctx.fill();
      ctx.fillStyle=cMid;
      ctx.beginPath(); ctx.roundRect(sx+sw*0.12,sy+sh*0.04,sw*0.76,sh*0.56,[12,12,4,4]); ctx.fill();
      // backrest top highlight strip
      ctx.fillStyle=cLight;
      ctx.beginPath(); ctx.roundRect(sx+sw*0.14,sy+sh*0.05,sw*0.72,sh*0.14,[10,10,2,2]); ctx.fill();
      // seat cushion
      ctx.fillStyle=cMid;
      ctx.beginPath(); ctx.roundRect(sx+sw*0.1,sy+sh*0.52,sw*0.8,sh*0.46,[4,4,8,8]); ctx.fill();
      ctx.fillStyle=cLight;
      ctx.beginPath(); ctx.roundRect(sx+sw*0.12,sy+sh*0.54,sw*0.76,sh*0.22,[6,6,2,2]); ctx.fill();
      // cushion crease line
      ctx.strokeStyle=cDark; ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.moveTo(sx+sw*0.5,sy+sh*0.54); ctx.lineTo(sx+sw*0.5,sy+sh*0.98); ctx.stroke();
      // left armrest
      ctx.fillStyle=cDark;
      ctx.beginPath(); ctx.roundRect(sx,sy+sh*0.2,sw*0.12,sh*0.8,[8,4,6,8]); ctx.fill();
      ctx.fillStyle=cLight;
      ctx.beginPath(); ctx.roundRect(sx-sw*0.005,sy+sh*0.18,sw*0.13,sh*0.12,[6,6,2,2]); ctx.fill();
      // right armrest
      ctx.fillStyle=cDark;
      ctx.beginPath(); ctx.roundRect(sx+sw*0.88,sy+sh*0.2,sw*0.12,sh*0.8,[4,8,8,6]); ctx.fill();
      ctx.fillStyle=cLight;
      ctx.beginPath(); ctx.roundRect(sx+sw*0.875,sy+sh*0.18,sw*0.13,sh*0.12,[6,6,2,2]); ctx.fill();
    }
    // wall shelf
    { const shx=ox+W*0.12, shy=H*0.25, shw=W*0.24, shth=H*0.018;
      ctx.fillStyle='#B8825A'; ctx.beginPath();
      ctx.roundRect(shx,shy,shw,shth,4); ctx.fill();
      ctx.strokeStyle='#8B5530'; ctx.lineWidth=1; ctx.stroke();
      // tiny items on shelf
      ctx.fillStyle='#E87060'; ctx.beginPath();
      ctx.arc(shx+shw*0.18,shy-H*0.028,H*0.018,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#70A860'; ctx.beginPath();
      ctx.arc(shx+shw*0.42,shy-H*0.032,H*0.022,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#6888C8';
      ctx.beginPath(); ctx.roundRect(shx+shw*0.62,shy-H*0.055,H*0.022,H*0.055,3); ctx.fill();
      ctx.beginPath(); ctx.roundRect(shx+shw*0.72,shy-H*0.06,H*0.022,H*0.06,3); ctx.fill();
    }
  }
  else if (scene.id==='study') {
    // ── wall clock (upper right) ──────────────────────────
    { const ccx=ox+W*0.84, ccy=H*0.15, cr=Math.min(W*0.062,H*0.072);
      // outer ring
      ctx.fillStyle='#F5EFE0'; ctx.strokeStyle='#A88860'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(ccx,ccy,cr,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle='#C8AE80'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.arc(ccx,ccy,cr*0.9,0,Math.PI*2); ctx.stroke();
      // hour marks
      for (let i=0;i<12;i++) {
        const a=i/12*Math.PI*2-Math.PI/2;
        ctx.strokeStyle='#6B4E30'; ctx.lineWidth=i%3===0?2.5:1.2;
        ctx.beginPath();
        ctx.moveTo(ccx+Math.cos(a)*cr*0.74,ccy+Math.sin(a)*cr*0.74);
        ctx.lineTo(ccx+Math.cos(a)*cr*0.88,ccy+Math.sin(a)*cr*0.88);
        ctx.stroke();
      }
      // hands
      const now=new Date();
      const hh=now.getHours()%12+now.getMinutes()/60;
      const mm=now.getMinutes()+now.getSeconds()/60;
      const ss=now.getSeconds()+(clockTick>0?(120-clockTick)*3:0);
      ctx.lineCap='round';
      for (const [ang,len,lw,col] of [
        [hh/12*Math.PI*2-Math.PI/2, cr*0.48, 3.5,'#3A2010'],
        [mm/60*Math.PI*2-Math.PI/2, cr*0.68, 2.5,'#3A2010'],
        [ss/60*Math.PI*2-Math.PI/2, cr*0.76, 1.2,'#CC3322'],
      ]) {
        ctx.strokeStyle=col; ctx.lineWidth=lw;
        ctx.beginPath(); ctx.moveTo(ccx,ccy);
        ctx.lineTo(ccx+Math.cos(ang)*len,ccy+Math.sin(ang)*len); ctx.stroke();
      }
      ctx.fillStyle='#3A2010'; ctx.beginPath(); ctx.arc(ccx,ccy,cr*0.05,0,Math.PI*2); ctx.fill();
    }
    // ── cork board (upper left) ───────────────────────────
    { const MSGS=['오늘도\n수고했꼬잉 🐷','할 수\n있꼬잉 ✨','쉬어도\n괜찮꼬잉 💤','잘하고\n있꼬잉 🌸','집중\n모드꼬잉 📚'];
      const bx=ox+W*0.08, by=H*0.06, bw=W*0.21, bh=H*0.24;
      // board body
      ctx.fillStyle='#C8905A'; ctx.strokeStyle='#8A6030'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,6); ctx.fill(); ctx.stroke();
      // cork texture blobs
      ctx.fillStyle='rgba(210,155,90,0.5)';
      for (const [dx,dy,dr] of [[0.18,0.18,0.07],[0.62,0.28,0.055],[0.38,0.55,0.065],[0.72,0.68,0.075],[0.1,0.72,0.06]]) {
        ctx.beginPath(); ctx.ellipse(bx+bw*dx,by+bh*dy,bw*dr,bw*dr*0.7,0,0,Math.PI*2); ctx.fill();
      }
      // wooden frame border
      ctx.strokeStyle='#7A5020'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.roundRect(bx+3,by+3,bw-6,bh-6,4); ctx.stroke();
      // main note (clickable message)
      ctx.save(); ctx.translate(bx+bw*0.1,by+bh*0.08); ctx.rotate(-0.04);
      ctx.fillStyle='#FFFDE0'; ctx.shadowColor='rgba(0,0,0,0.18)'; ctx.shadowBlur=5;
      ctx.beginPath(); ctx.rect(0,0,bw*0.56,bh*0.44); ctx.fill(); ctx.shadowBlur=0;
      ctx.fillStyle='#DD3333'; ctx.beginPath(); ctx.arc(bw*0.28,0,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#554433'; ctx.font=`bold ${H*0.021}px sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      MSGS[corkMsgIdx].split('\n').forEach((ln,i)=>ctx.fillText(ln,bw*0.28,bh*0.13+i*H*0.028));
      ctx.restore();
      // deco note (fixed)
      ctx.save(); ctx.translate(bx+bw*0.46,by+bh*0.48); ctx.rotate(0.07);
      ctx.fillStyle='#FFD5E8'; ctx.shadowColor='rgba(0,0,0,0.13)'; ctx.shadowBlur=4;
      ctx.beginPath(); ctx.rect(0,0,bw*0.44,bh*0.32); ctx.fill(); ctx.shadowBlur=0;
      ctx.fillStyle='#CC4466'; ctx.beginPath(); ctx.arc(bw*0.22,0,3.5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#774455'; ctx.font=`${H*0.028}px sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('🐷✨',bw*0.22,bh*0.16);
      ctx.restore();
    }
    // desk surface edge highlight + front panel
    ctx.fillStyle='rgba(220,175,90,0.3)';
    ctx.fillRect(ox,gy-H*0.01,W,H*0.01);
    ctx.fillStyle='rgba(55,30,5,0.22)';
    ctx.fillRect(ox,gy,W,H*0.007);
    // open laptop (left side)
    { const lx=ox+W*0.04, ly=gy, lw=W*0.24;
      // base / keyboard
      ctx.fillStyle='#CACAC5'; ctx.strokeStyle='#A5A5A0'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.roundRect(lx,ly-H*0.022,lw,H*0.022,[3,3,7,7]); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#B0B0AA';
      ctx.beginPath(); ctx.roundRect(lx+lw*0.33,ly-H*0.016,lw*0.26,H*0.011,3); ctx.fill();
      // screen
      ctx.fillStyle='#222230'; ctx.strokeStyle='#18181E'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.roundRect(lx+lw*0.04,ly-H*0.022-H*0.145,lw*0.92,H*0.145,[8,8,2,2]);
      ctx.fill(); ctx.stroke();
      // screen display
      // clip all screen content inside screen rect
      ctx.save();
      ctx.beginPath(); ctx.roundRect(lx+lw*0.07,ly-H*0.022-H*0.132,lw*0.86,H*0.112,[5,5,1,1]); ctx.clip();
      if (laptopGlow>0) {
        const glowAlpha=Math.min(1,laptopGlow/20);
        // warm glow bg
        ctx.fillStyle=`rgba(255,245,220,${glowAlpha*0.95})`;
        ctx.fillRect(lx,ly-H*0.16,lw,H*0.16);
        // code-like lines with text
        const lines=['while(true){','  쉬어가꼬잉🐷','  잠깐멈춰꼬잉','  // 괜찮꼬잉','}'];
        ctx.font=`${H*0.018}px monospace`;
        ctx.textAlign='left'; ctx.textBaseline='top';
        const colors=['#A0704A','#6B3A2A','#8A5530','#999','#A0704A'];
        lines.forEach((ln,i)=>{
          ctx.fillStyle=`rgba(${i===1?'100,50,10':'80,60,40'},${glowAlpha})`;
          ctx.fillStyle=colors[i].replace(')',`,${glowAlpha})`).replace('rgb','rgba').replace('#','');
          ctx.fillStyle=`rgba(80,50,20,${glowAlpha})`;
          if(i===1) ctx.fillStyle=`rgba(160,80,30,${glowAlpha})`;
          ctx.fillText(ln, lx+lw*0.1, ly-H*0.022-H*0.118+i*H*0.022);
        });
        laptopGlow--;
      } else {
        const sg=ctx.createLinearGradient(lx+lw*0.06,ly-H*0.155,lx+lw*0.94,ly-H*0.032);
        sg.addColorStop(0,'#5898B8'); sg.addColorStop(1,'#306880');
        ctx.fillStyle=sg;
        ctx.beginPath(); ctx.roundRect(lx+lw*0.07,ly-H*0.022-H*0.132,lw*0.86,H*0.112,[5,5,1,1]); ctx.fill();
        // screen content lines
        ctx.fillStyle='rgba(255,255,255,0.2)';
        for (const [i,w] of [[0,0.52],[1,0.68],[2,0.38],[3,0.58]]) {
          ctx.beginPath(); ctx.roundRect(lx+lw*0.1,ly-H*0.022-H*0.105+i*H*0.024,lw*w,H*0.011,2); ctx.fill();
        }
      }
      ctx.restore();
      // laptop hinge shadow
      ctx.fillStyle='rgba(0,0,0,0.12)';
      ctx.beginPath(); ctx.roundRect(lx+lw*0.04,ly-H*0.023,lw*0.92,H*0.004,1); ctx.fill();
    }
    // desk lamp — long pole, shade over pig's head, on/off toggle
    { const bx=ox+W*0.73, sx=ox+W*0.60, sy=gy-H*0.30;
      if (lampOn) {
        // light beam (downward cone)
        ctx.save();
        const beam=ctx.createLinearGradient(sx,sy+H*0.05,sx,gy);
        beam.addColorStop(0,'rgba(255,220,100,0.22)'); beam.addColorStop(1,'rgba(255,200,80,0)');
        ctx.fillStyle=beam;
        ctx.beginPath();
        ctx.moveTo(sx-W*0.022,sy+H*0.05);
        ctx.lineTo(sx+W*0.022,sy+H*0.05);
        ctx.lineTo(sx+W*0.075,gy-H*0.015);
        ctx.lineTo(sx-W*0.075,gy-H*0.015);
        ctx.closePath(); ctx.fill();
        // glow pool on desk
        const pool=ctx.createRadialGradient(sx,gy-H*0.01,0,sx,gy-H*0.01,W*0.1);
        pool.addColorStop(0,'rgba(255,215,90,0.28)'); pool.addColorStop(1,'rgba(255,200,60,0)');
        ctx.fillStyle=pool; ctx.beginPath(); ctx.arc(sx,gy-H*0.01,W*0.1,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
      // base disc
      ctx.fillStyle='#707480'; ctx.strokeStyle='#545660'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.ellipse(bx,gy-H*0.012,W*0.038,H*0.011,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      // long vertical pole
      ctx.strokeStyle='#808490'; ctx.lineWidth=H*0.008; ctx.lineCap='round'; ctx.lineJoin='round';
      ctx.beginPath(); ctx.moveTo(bx,gy-H*0.015); ctx.lineTo(bx,gy-H*0.40); ctx.stroke();
      // arm from pole top to shade
      ctx.beginPath(); ctx.moveTo(bx,gy-H*0.40); ctx.lineTo(sx,sy); ctx.stroke();
      // shade (trapezoid, pointing downward)
      const sw=W*0.052;
      ctx.fillStyle=lampOn?'#D4A828':'#907020'; ctx.strokeStyle='#B48818'; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(sx-sw*0.42,sy); ctx.lineTo(sx+sw*0.42,sy);
      ctx.lineTo(sx+sw*0.78,sy+H*0.075); ctx.lineTo(sx-sw*0.78,sy+H*0.075);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      if (lampOn) {
        ctx.fillStyle='rgba(255,240,150,0.55)';
        ctx.beginPath();
        ctx.moveTo(sx-sw*0.28,sy+H*0.006); ctx.lineTo(sx+sw*0.28,sy+H*0.006);
        ctx.lineTo(sx+sw*0.55,sy+H*0.065); ctx.lineTo(sx-sw*0.55,sy+H*0.065);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle='#FFFACC';
        ctx.beginPath(); ctx.arc(sx,sy+H*0.04,H*0.013,0,Math.PI*2); ctx.fill();
      }
    }
    // mini plant pot (far right corner)
    { const px=ox+W*0.93, py=gy, pr=W*0.028;
      // pot
      ctx.fillStyle='#B07858'; ctx.strokeStyle='#8A5838'; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(px-pr*0.8,py); ctx.lineTo(px+pr*0.8,py);
      ctx.lineTo(px+pr*0.6,py-H*0.042); ctx.lineTo(px-pr*0.6,py-H*0.042);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // soil
      ctx.fillStyle='#5A3820';
      ctx.beginPath(); ctx.ellipse(px,py-H*0.042,pr*0.6,H*0.01,0,0,Math.PI*2); ctx.fill();
      // leaves (simple succulent)
      for (const [a,r,col] of [
        [-0.5,H*0.04,'#6AA858'],[-0.1,H*0.048,'#82C068'],[0.35,H*0.042,'#6AA858'],
        [-0.9,H*0.036,'#82C068'],[0.7,H*0.038,'#6AA858']
      ]) {
        ctx.fillStyle=col;
        ctx.beginPath();
        ctx.ellipse(px+Math.cos(a)*pr*0.3,py-H*0.042-r*0.5+H*0.004,pr*0.28,r*0.55,a,0,Math.PI*2);
        ctx.fill();
      }
    }
  }
}


function _bgFlower(x,y,r,seed,bloom=0,idx=-1) {
  // stem
  ctx.strokeStyle='#4A8828'; ctx.lineWidth=r*0.3; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+r*2.6); ctx.stroke();
  // leaf
  ctx.beginPath();
  ctx.moveTo(x,y+r*1.5);
  ctx.quadraticCurveTo(x+r*1.3,y+r*0.7, x+r*0.9,y+r*0.1);
  ctx.quadraticCurveTo(x+r*0.45,y+r*0.8, x,y+r*1.5);
  ctx.fillStyle='#5AAA2C'; ctx.fill();

  const cols=[['#FFD700','#FFF176'],['#FF3311','#FF7755'],['#F5F0E8','#EDE6D2'],['#4488FF','#99CCFF'],['#FF7700','#FFBB55']];
  const ci=idx===3?3:idx===4?4:Math.round((seed??x+y)*0.08)%3;

  if (bloom<0.05) {
    // closed bud
    ctx.beginPath();
    ctx.moveTo(x,y-r*1.5);
    ctx.bezierCurveTo(x-r*0.85,y-r*1.05, x-r*0.8,y-r*0.1, x-r*0.08,y);
    ctx.lineTo(x+r*0.08,y);
    ctx.bezierCurveTo(x+r*0.8,y-r*0.1, x+r*0.85,y-r*1.05, x,y-r*1.5);
    ctx.fillStyle=cols[ci][0]; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x,y-r*1.42);
    ctx.bezierCurveTo(x-r*0.32,y-r*1.05, x-r*0.28,y-r*0.42, x,y-r*0.32);
    ctx.bezierCurveTo(x+r*0.28,y-r*0.42, x+r*0.32,y-r*1.05, x,y-r*1.42);
    ctx.fillStyle=cols[ci][1]; ctx.fill();
  } else {
    // blooming: same tulip DNA, petals fan open from base
    const t=bloom;
    const col0=cols[ci][0], col1=cols[ci][1];

    // back side petals — split left/right from base as bloom increases
    for (const side of [-1,1]) {
      const tipX=x+side*r*(0.2+0.85*t);
      const tipY=y-r*(1.45+0.35*t);
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.bezierCurveTo(x+side*r*(0.75+0.4*t), y-r*1.0, x+side*r*(0.5+0.2*t), y-r*0.1, x+side*r*0.07, y);
      ctx.lineTo(x+side*r*0.07, y);
      ctx.bezierCurveTo(x+side*r*(0.08+0.05*t), y-r*0.3, x+side*r*(0.1+0.4*t), y-r*1.1, tipX, tipY);
      ctx.fillStyle=col0; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(tipX, tipY+r*0.08);
      ctx.bezierCurveTo(x+side*r*(0.42+0.2*t), y-r*0.9, x+side*r*(0.28+0.1*t), y-r*0.35, x+side*r*0.07, y-r*0.1);
      ctx.bezierCurveTo(x+side*r*(0.06+0.08*t), y-r*0.5, x+side*r*(0.15+0.25*t), y-r*1.0, tipX, tipY+r*0.08);
      ctx.fillStyle=col1; ctx.fill();
    }

    // back center petal — original teardrop pointing straight up
    ctx.beginPath();
    ctx.moveTo(x, y-r*(1.5+0.35*t));
    ctx.bezierCurveTo(x-r*(0.85+0.4*t), y-r*1.05, x-r*(0.8+0.45*t), y-r*0.1, x-r*(0.08+0.18*t), y);
    ctx.lineTo(x+r*(0.08+0.18*t), y);
    ctx.bezierCurveTo(x+r*(0.8+0.45*t), y-r*0.1, x+r*(0.85+0.4*t), y-r*1.05, x, y-r*(1.5+0.35*t));
    ctx.fillStyle=col0; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y-r*(1.42+0.3*t));
    ctx.bezierCurveTo(x-r*(0.32+0.1*t), y-r*1.05, x-r*(0.28+0.1*t), y-r*0.42, x, y-r*0.32);
    ctx.bezierCurveTo(x+r*(0.28+0.1*t), y-r*0.42, x+r*(0.32+0.1*t), y-r*1.05, x, y-r*(1.42+0.3*t));
    ctx.fillStyle=col1; ctx.fill();

    // left outer petal — fans outward to the left
    { const ltx=x-r*1.25*t, lty=y-r*(1.15-0.05*t);
      ctx.beginPath();
      ctx.moveTo(ltx, lty);
      ctx.bezierCurveTo(x-r*(0.95+0.15*t), lty-r*0.25, x-r*(0.35+0.5*t), y-r*0.12, x-r*0.06, y);
      ctx.lineTo(x+r*0.06, y);
      ctx.bezierCurveTo(x-r*0.05*t, y-r*0.18, x-r*(0.25+0.45*t), lty-r*0.18, ltx, lty);
      ctx.fillStyle=col1; ctx.fill();
    }

    // right outer petal — mirror of left
    { const rtx=x+r*1.25*t, rty=y-r*(1.15-0.05*t);
      ctx.beginPath();
      ctx.moveTo(rtx, rty);
      ctx.bezierCurveTo(x+r*(0.95+0.15*t), rty-r*0.25, x+r*(0.35+0.5*t), y-r*0.12, x+r*0.06, y);
      ctx.lineTo(x-r*0.06, y);
      ctx.bezierCurveTo(x+r*0.05*t, y-r*0.18, x+r*(0.25+0.45*t), rty-r*0.18, rtx, rty);
      ctx.fillStyle=col1; ctx.fill();
    }

  }
}

function drawFallingPetals() {
  if (!fallingPetals.length) return;
  for (const p of fallingPetals) {
    ctx.save();
    ctx.globalAlpha=p.alpha;
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rot);
    ctx.beginPath(); ctx.ellipse(0,0,p.r*0.38,p.r*0.72,0,0,Math.PI*2);
    ctx.fillStyle=p.col; ctx.fill();
    ctx.restore();
  }
}

function _candyCane(x,y) {
  const s=H*0.2;
  ctx.save(); ctx.lineCap='round';
  ctx.strokeStyle='#FFF5F5'; ctx.lineWidth=s*0.13;
  ctx.beginPath(); ctx.moveTo(x,y+s*0.5); ctx.lineTo(x,y-s*0.2);
  ctx.arc(x,y-s*0.2,s*0.22,Math.PI,0,false); ctx.stroke();
  ctx.strokeStyle='#FF3355'; ctx.lineWidth=s*0.045;
  ctx.setLineDash([s*0.09,s*0.1]);
  ctx.beginPath(); ctx.moveTo(x,y+s*0.5); ctx.lineTo(x,y-s*0.2);
  ctx.arc(x,y-s*0.2,s*0.22,Math.PI,0,false); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();
}

function _starShape(x,y,r) {
  ctx.beginPath();
  for (let i=0;i<5;i++) {
    const oa=(i/5)*Math.PI*2-Math.PI/2, ia=oa+Math.PI/5;
    i===0?ctx.moveTo(x+Math.cos(oa)*r,y+Math.sin(oa)*r):ctx.lineTo(x+Math.cos(oa)*r,y+Math.sin(oa)*r);
    ctx.lineTo(x+Math.cos(ia)*r*0.42,y+Math.sin(ia)*r*0.42);
  }
  ctx.closePath(); ctx.fill();
}

function _drawLightningBolt(x,y) {
  const s=H*0.09;
  ctx.save();
  ctx.fillStyle='rgba(255,240,80,0.9)';
  ctx.strokeStyle='rgba(255,220,20,1)';
  ctx.lineWidth=1.5;
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x-s*0.22,y+s*0.44);
  ctx.lineTo(x+s*0.04,y+s*0.42);
  ctx.lineTo(x-s*0.24,y+s*0.92);
  ctx.lineTo(x+s*0.3,y+s*0.4);
  ctx.lineTo(x+s*0.04,y+s*0.42);
  ctx.lineTo(x+s*0.22,y);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

// ── Ripples ───────────────────────────────────────────────
function drawRipples() {
  if (!ripples.length) return;
  ctx.save();
  for (let i=ripples.length-1;i>=0;i--) {
    const r=ripples[i];
    r.t++;
    const maxT=40, progress=r.t/maxT;
    if (r.t>maxT) { ripples.splice(i,1); continue; }
    for (let ring=0;ring<3;ring++) {
      const delay=ring*8;
      if (r.t<delay) continue;
      const rp=Math.min(1,(r.t-delay)/(maxT-delay));
      ctx.globalAlpha=(1-rp)*0.55;
      ctx.strokeStyle='rgba(130,190,220,1)';
      ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.ellipse(r.x,r.y,(r.rw||0.04)*W*1.4*rp,(r.rh||0.01)*H*1.4*rp,0,0,Math.PI*2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ── Rain ──────────────────────────────────────────────────
function drawRain() {
  if (rainTimer<=0) return;
  ctx.save();
  ctx.fillStyle='rgba(80,120,180,0.07)'; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(130,180,240,0.62)'; ctx.lineWidth=1.5; ctx.lineCap='round';
  for (const d of rainDrops) {
    ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x-2,d.y+d.len); ctx.stroke();
  }
  ctx.restore();
}

// ── Scene indicator dots ──────────────────────────────────
function drawSceneIndicator() {
  const n=SCENES.length;
  const r=Math.max(3,H*0.006);
  const sp=r*3.5;
  const cy=H*0.945;
  for (let i=0;i<n;i++) {
    ctx.beginPath(); ctx.arc(W/2-(n-1)*sp/2+i*sp,cy,r,0,Math.PI*2);
    ctx.fillStyle=i===sceneIdx?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.3)';
    ctx.fill();
  }
}
