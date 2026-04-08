// ── Panel background ──────────────────────────────────────
function drawAccessoryPanel() {
  const pw=Math.min(W*0.13,72), ph=H*0.44;
  ctx.save();
  ctx.fillStyle='rgba(255,240,250,0.62)'; ctx.strokeStyle='rgba(255,175,210,0.7)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(8,H*0.04,pw,ph,18); ctx.fill(); ctx.stroke();
  if (panelMaxScroll>0) {
    const barH=Math.max(18,ph*ph/(ph+panelMaxScroll));
    const barY=H*0.04+(ph-barH)*(panelScroll/panelMaxScroll);
    ctx.fillStyle='rgba(220,160,200,0.35)';
    ctx.beginPath(); ctx.roundRect(8+pw-5,H*0.04+3,3,ph-6,2); ctx.fill();
    ctx.fillStyle='rgba(180,80,160,0.62)';
    ctx.beginPath(); ctx.roundRect(8+pw-5,barY,3,barH,2); ctx.fill();
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
    for (const [rx,ry] of [[0.1,0.64],[0.28,0.66],[0.55,0.63],[0.72,0.65],[0.88,0.62]])
      _bgFlower(ox+rx*W,ry*H,H*0.022);
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
    ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.fillStyle='#FFFFCC'; ctx.fill();
    if (moonWink>0) {
      // winking face: eyes as arcs, small smile
      ctx.strokeStyle='#8A9060'; ctx.lineWidth=mr*0.12; ctx.lineCap='round';
      // left eye (wink — closed arc)
      ctx.beginPath(); ctx.arc(mx-mr*0.28,my-mr*0.1,mr*0.13,Math.PI,0); ctx.stroke();
      // right eye (normal dot)
      ctx.beginPath(); ctx.arc(mx+mr*0.28,my-mr*0.1,mr*0.08,0,Math.PI*2); ctx.fillStyle='#8A9060'; ctx.fill();
      // smile
      ctx.beginPath(); ctx.arc(mx,my+mr*0.15,mr*0.22,0.2,Math.PI-0.2); ctx.stroke();
      moonWink--;
    } else {
      ctx.beginPath(); ctx.arc(mx+mr*0.42,my-mr*0.08,mr*0.82,0,Math.PI*2);
      ctx.fillStyle='#152850'; ctx.fill();
    }
    ctx.restore();
  }
  else if (scene.id==='rainy') {
    ctx.save();
    for (const [rx,ry] of [[0.2,0.63],[0.55,0.65],[0.78,0.62]]) {
      ctx.globalAlpha=0.32;
      ctx.beginPath(); ctx.ellipse(ox+rx*W,ry*H,W*0.055,H*0.013,0,0,Math.PI*2);
      ctx.fillStyle='#7AAABB'; ctx.fill();
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
    ctx.beginPath(); ctx.moveTo(wx-ww*0.1,wy-H*0.008); ctx.lineTo(wx+ww+ww*0.1,wy-H*0.008); ctx.stroke();
    ctx.fillStyle='#A08060';
    ctx.beginPath(); ctx.arc(wx-ww*0.1,wy-H*0.008,H*0.008,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(wx+ww+ww*0.1,wy-H*0.008,H*0.008,0,Math.PI*2); ctx.fill();
    // left curtain panel with folds
    { const cx0=wx-ww*0.08, cy0=wy-H*0.012, cpw=ww*0.38, cph=wh+H*0.035;
      ctx.fillStyle='rgba(170,115,130,0.82)';
      ctx.beginPath();
      ctx.moveTo(cx0,cy0);
      ctx.bezierCurveTo(cx0+cpw*0.55,cy0+cph*0.15, cx0+cpw*0.3,cy0+cph*0.45, cx0+cpw*0.45,cy0+cph);
      ctx.lineTo(cx0,cy0+cph); ctx.closePath(); ctx.fill();
      // fold highlight
      ctx.strokeStyle='rgba(210,160,175,0.55)'; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(cx0+cpw*0.14,cy0+cph*0.08);
      ctx.bezierCurveTo(cx0+cpw*0.3,cy0+cph*0.25, cx0+cpw*0.18,cy0+cph*0.55, cx0+cpw*0.28,cy0+cph*0.88);
      ctx.stroke();
    }
    // right curtain panel with folds
    { const cx0=wx+ww+ww*0.08, cy0=wy-H*0.012, cpw=ww*0.38, cph=wh+H*0.035;
      ctx.fillStyle='rgba(170,115,130,0.82)';
      ctx.beginPath();
      ctx.moveTo(cx0,cy0);
      ctx.bezierCurveTo(cx0-cpw*0.55,cy0+cph*0.15, cx0-cpw*0.3,cy0+cph*0.45, cx0-cpw*0.45,cy0+cph);
      ctx.lineTo(cx0,cy0+cph); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(210,160,175,0.55)'; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(cx0-cpw*0.14,cy0+cph*0.08);
      ctx.bezierCurveTo(cx0-cpw*0.3,cy0+cph*0.25, cx0-cpw*0.18,cy0+cph*0.55, cx0-cpw*0.28,cy0+cph*0.88);
      ctx.stroke();
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
    // desk surface edge highlight + front panel
    ctx.fillStyle='rgba(220,175,90,0.3)';
    ctx.fillRect(ox,gy-H*0.01,W,H*0.01);
    ctx.fillStyle='rgba(55,30,5,0.22)';
    ctx.fillRect(ox,gy,W,H*0.007);
    // wall frame / poster
    { const px=ox+W*0.36, py=H*0.07, pw=W*0.13, ph=H*0.19;
      ctx.fillStyle='#F8F2E8'; ctx.strokeStyle='#C8AE80'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.roundRect(px,py,pw,ph,4); ctx.fill(); ctx.stroke();
      ctx.strokeStyle='#B09060'; ctx.lineWidth=1.5;
      // simple mountain sketch inside poster
      ctx.fillStyle='#E0D5C0';
      ctx.beginPath(); ctx.moveTo(px+pw*0.1,py+ph*0.85);
      ctx.lineTo(px+pw*0.38,py+ph*0.38); ctx.lineTo(px+pw*0.55,py+ph*0.55);
      ctx.lineTo(px+pw*0.72,py+ph*0.28); ctx.lineTo(px+pw*0.9,py+ph*0.85);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#C8D4E0';
      ctx.beginPath(); ctx.arc(px+pw*0.22,py+ph*0.22,pw*0.14,0,Math.PI*2); ctx.fill(); ctx.stroke();
    }
    // sticky notes on wall
    for (const [dx,col,rot] of [
      [0,'#FFEE88',0.04],[0.08,'#FFB5C8',-0.03],[0.155,'#B8E8A0',0.02]
    ]) {
      ctx.save(); ctx.globalAlpha=0.88;
      ctx.translate(ox+W*0.55+dx*W, H*0.12);
      ctx.rotate(rot);
      ctx.fillStyle=col; ctx.shadowColor='rgba(0,0,0,0.1)'; ctx.shadowBlur=4;
      ctx.beginPath(); ctx.rect(0,0,W*0.055,H*0.058); ctx.fill();
      ctx.restore();
    }
    // open laptop (left side)
    { const lx=ox+W*0.16, ly=gy, lw=W*0.24;
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
      if (laptopGlow>0) {
        // lit up: warm white glow with cute message
        const glowAlpha=Math.min(1,laptopGlow/20);
        ctx.fillStyle=`rgba(255,245,220,${glowAlpha})`;
        ctx.beginPath(); ctx.roundRect(lx+lw*0.07,ly-H*0.022-H*0.132,lw*0.86,H*0.112,[5,5,1,1]); ctx.fill();
        ctx.save();
        ctx.font=`bold ${H*0.028}px 'Jua',sans-serif`;
        ctx.fillStyle=`rgba(80,50,20,${glowAlpha})`;
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('잠깐 쉬어가꼬잉🐷', lx+lw*0.5, ly-H*0.022-H*0.076);
        ctx.restore();
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
      // laptop hinge shadow
      ctx.fillStyle='rgba(0,0,0,0.12)';
      ctx.beginPath(); ctx.roundRect(lx+lw*0.04,ly-H*0.023,lw*0.92,H*0.004,1); ctx.fill();
    }
    // coffee mug
    { const mx=ox+W*0.585, my=gy, mw=W*0.052, mh=H*0.072;
      // body
      ctx.fillStyle='#E8D8C8'; ctx.strokeStyle='#C8A888'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.roundRect(mx,my-mh,mw,mh,[7,7,4,4]); ctx.fill(); ctx.stroke();
      // stripe decoration
      ctx.fillStyle='rgba(150,90,70,0.4)';
      ctx.beginPath(); ctx.roundRect(mx+mw*0.12,my-mh*0.62,mw*0.76,mh*0.28,2); ctx.fill();
      // handle
      ctx.strokeStyle='#C8A888'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(mx+mw+mw*0.08,my-mh*0.44,mh*0.21,-0.65,0.65); ctx.stroke();
      // rim / top
      ctx.fillStyle='rgba(220,185,155,0.6)';
      ctx.beginPath(); ctx.ellipse(mx+mw*0.5,my-mh,mw*0.5,mh*0.07,0,0,Math.PI*2); ctx.fill();
      // steam
      ctx.strokeStyle='rgba(210,190,170,0.5)'; ctx.lineWidth=1.8; ctx.lineCap='round';
      for (const [dx,flip] of [[-mw*0.08,1],[mw*0.1,-1]]) {
        ctx.beginPath();
        ctx.moveTo(mx+mw*0.5+dx, my-mh-H*0.004);
        ctx.bezierCurveTo(mx+mw*0.5+dx+flip*mw*0.12,my-mh-H*0.022,
                          mx+mw*0.5+dx-flip*mw*0.12,my-mh-H*0.044,
                          mx+mw*0.5+dx,my-mh-H*0.062); ctx.stroke();
      }
    }
    // desk lamp (right side)
    { const lx=ox+W*0.85, ly=gy, s=H*0.19;
      // warm glow pool on desk
      const glow=ctx.createRadialGradient(lx-s*0.22,ly-H*0.01,0,lx-s*0.22,ly-H*0.01,s*0.38);
      glow.addColorStop(0,'rgba(255,210,100,0.2)'); glow.addColorStop(1,'rgba(255,190,60,0)');
      ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(lx-s*0.22,ly-H*0.01,s*0.38,0,Math.PI*2); ctx.fill();
      // base disc
      ctx.fillStyle='#707480'; ctx.strokeStyle='#545660'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.ellipse(lx,ly-s*0.03,s*0.08,s*0.025,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      // pole
      ctx.strokeStyle='#808490'; ctx.lineWidth=s*0.042; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(lx,ly-s*0.05); ctx.lineTo(lx-s*0.05,ly-s*0.5); ctx.stroke();
      // arm
      ctx.beginPath(); ctx.moveTo(lx-s*0.05,ly-s*0.5); ctx.lineTo(lx-s*0.3,ly-s*0.58); ctx.stroke();
      // shade (trapezoid)
      ctx.fillStyle='#D4A828'; ctx.strokeStyle='#B48818'; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(lx-s*0.3-s*0.07,ly-s*0.55);
      ctx.lineTo(lx-s*0.3+s*0.07,ly-s*0.55);
      ctx.lineTo(lx-s*0.3+s*0.15,ly-s*0.42);
      ctx.lineTo(lx-s*0.3-s*0.15,ly-s*0.42);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // shade inner highlight
      ctx.fillStyle='rgba(255,235,140,0.38)';
      ctx.beginPath();
      ctx.moveTo(lx-s*0.3-s*0.045,ly-s*0.54);
      ctx.lineTo(lx-s*0.3+s*0.045,ly-s*0.54);
      ctx.lineTo(lx-s*0.3+s*0.09, ly-s*0.46);
      ctx.lineTo(lx-s*0.3-s*0.09, ly-s*0.46);
      ctx.closePath(); ctx.fill();
      // bulb
      ctx.fillStyle='#FFFACC';
      ctx.beginPath(); ctx.arc(lx-s*0.3,ly-s*0.42,s*0.03,0,Math.PI*2); ctx.fill();
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


function _bgFlower(x,y,r) {
  // small tulip — clearly distinct from the 6-petal pink foreground flower item
  // stem
  ctx.strokeStyle='#4A8828'; ctx.lineWidth=r*0.3; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+r*2.6); ctx.stroke();
  // leaf
  ctx.beginPath();
  ctx.moveTo(x,y+r*1.5);
  ctx.quadraticCurveTo(x+r*1.3,y+r*0.7, x+r*0.9,y+r*0.1);
  ctx.quadraticCurveTo(x+r*0.45,y+r*0.8, x,y+r*1.5);
  ctx.fillStyle='#5AAA2C'; ctx.fill();
  // tulip head (color varies by position)
  const ci=Math.round((x+y)*0.08)%3;
  const cols=[['#FF3355','#FF7799'],['#FF6820','#FFAA60'],['#CC22AA','#FF66CC']];
  ctx.beginPath();
  ctx.moveTo(x,y-r*1.5);
  ctx.bezierCurveTo(x-r*0.85,y-r*1.05, x-r*0.8,y-r*0.1, x-r*0.08,y);
  ctx.lineTo(x+r*0.08,y);
  ctx.bezierCurveTo(x+r*0.8,y-r*0.1, x+r*0.85,y-r*1.05, x,y-r*1.5);
  ctx.fillStyle=cols[ci][0]; ctx.fill();
  // inner highlight
  ctx.beginPath();
  ctx.moveTo(x,y-r*1.42);
  ctx.bezierCurveTo(x-r*0.32,y-r*1.05, x-r*0.28,y-r*0.42, x,y-r*0.32);
  ctx.bezierCurveTo(x+r*0.28,y-r*0.42, x+r*0.32,y-r*1.05, x,y-r*1.42);
  ctx.fillStyle=cols[ci][1]; ctx.fill();
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
      ctx.ellipse(r.x,r.y,W*0.04*rp,H*0.01*rp,0,0,Math.PI*2);
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
