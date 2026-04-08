// ── Loop ──────────────────────────────────────────────────
(function loop() {
  requestAnimationFrame(loop);
  ctx.clearRect(0,0,W,H);

  // Animate scene offset
  if (sceneOffsetPx!==sceneOffsetTarget) {
    const diff=sceneOffsetTarget-sceneOffsetPx;
    sceneOffsetPx+=diff*0.16;
    if (Math.abs(diff)<1) {
      sceneOffsetPx=sceneOffsetTarget;
      if (sceneOffsetTarget!==0) {
        sceneIdx=sceneOffsetTarget<0?(sceneIdx+1)%SCENES.length:(sceneIdx-1+SCENES.length)%SCENES.length;
        sceneOffsetPx=0; sceneOffsetTarget=0;
        onSceneEnter(sceneIdx);
      }
    }
  }

  // Live swipe delta (while finger is held)
  const liveSwipe=swipeStartX!==null?(swipeLiveX-swipeStartX):0;
  const disp=sceneOffsetPx+liveSwipe;

  // Draw scenes (prev / current / next) as horizontal strip
  const prev=SCENES[(sceneIdx-1+SCENES.length)%SCENES.length];
  const curr=SCENES[sceneIdx];
  const next=SCENES[(sceneIdx+1)%SCENES.length];
  // Fill full canvas first so body background never bleeds through during transitions
  const baseColor=curr.sky[curr.sky.length-1];
  ctx.fillStyle=baseColor; ctx.fillRect(0,0,W,H);
  if (disp>0)  drawSceneBackground(prev,disp-W);
  drawSceneBackground(curr,disp);
  if (disp<0) drawSceneBackground(next,disp+W);

  // Rain overlay (global)
  drawRain();
  drawRipples();
  drawAccessoryPanel();

  // Rain update
  if (rainTimer>0) {
    rainTimer--;
    for (const d of rainDrops) {
      d.y+=d.speed;
      if (d.y>H*0.65) { d.y=-d.len; d.x=Math.random()*W; }
    }
  }
  // Rainy scene: keep rain going (only while still on rainy, not during swipe-away)
  if (SCENES[sceneIdx].id==='rainy' && sceneOffsetTarget===0) {
    if (rainTimer<=0) initRain();
    rainTimer=Math.max(rainTimer,60);
  }

  starPulse++;
  if (curtainClose>0&&curtainClose<30) curtainClose++;
  else if (curtainClose<0) { curtainClose++; if(curtainClose===0) curtainClose=0; }

  // Lightning flash overlay
  if (lightningFlash>0) {
    lightningFlash--;
    ctx.save();
    ctx.globalAlpha=lightningFlash/18*0.65;
    ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,W,H);
    ctx.restore();
  }

  foods.forEach(f=>f.update());
  pig.update();

  // Panel items (clipped + scrolled)
  const pw=Math.min(W*0.13,72), ph=H*0.44;
  ctx.save();
  ctx.beginPath(); ctx.roundRect(8,H*0.04,pw,ph,18); ctx.clip();
  ctx.translate(0,-panelScroll);
  accessories.forEach(a=>{ if(!a.worn&&!a.dragging) a.draw(ctx); });
  ctx.restore();

  foods.forEach(f=>{ if(f!==draggedFood) f.draw(ctx); });
  pig.draw(ctx);
  accessories.forEach(a=>{ if(a.worn&&!a.dragging) a.draw(ctx); });
  if(draggedFood) draggedFood.draw(ctx);
  if(draggedAcc)  draggedAcc.draw(ctx);

  drawSceneIndicator();
})();

// ── Speech Bubble ─────────────────────────────────────────
const MSGS = {
  flower: [
    '오늘도 버텼꼬잉','충분히 잘하고 있꼬잉','쉬어가도 되꼬잉','넌 원래 잘하고 있었꼬잉',
    '살아있는 거 자체가 성과꼬잉','이 정도면 잘한 거 맞꼬잉','숨만 쉬어도 잘하는 중꼬잉',
    '내일의 내가 알아서 하겠꼬잉','그래 힘들었겠꼬잉','오늘은 그냥 넘어가꼬잉',
    '뭐 어쩌겠꼬잉','됐고 수고했꼬잉',
  ],
  cupcake: [
    '칼로리는 내일의 내가 책임지꼬잉','먹어야 힘이 나꼬잉','이 정도는 당연꼬잉',
    '먹으면 다 해결됩꼬잉','잘 먹었으니 잘 할 거꼬잉','기분 좀 나아졌꼬잉',
    '먹는 게 남는 거꼬잉','단 거 없으면 못 버티꼬잉','컵케이크 먹을 자격 충분꼬잉','달면 그냥 삼키꼬잉',
  ],
  cocktail: [
    '생각은 나중에 하꼬잉','오늘 일은 오늘로 끝이꼬잉','그냥 마시꼬잉',
    '원래 이런 거 있꼬잉','스트레스는 희석이 답꼬잉','감정은 음료로 처리 가능꼬잉','한 잔이면 충분꼬잉',
    '어쩌겠꼬잉','뭐 다 그렇꼬잉','그래봤자 내일 또 출근이꼬잉','취하면 다 잊혀지꼬잉',
  ],
  odeng: [
    '따뜻하꼬잉','포장마차 감성꼬잉','국물이 진리꼬잉',
    '어묵 하나면 충분꼬잉','노을 보며 먹으면 최고꼬잉','뜨끈뜨끈꼬잉',
  ],
  icecream: [
    '달달하꼬잉','한 입에 행복꼬잉','녹기 전에 먹어야 하꼬잉',
    '아이스크림엔 이유가 없꼬잉','노을이랑 잘 어울리꼬잉','오늘의 보상이꼬잉',
  ],
  soju: [
    '오늘 하루 수고했꼬잉','소주 한 잔에 다 털꼬잉','취해도 괜찮꼬잉',
    '이게 다 퇴근의 맛이꼬잉','한 잔이면 충분꼬잉','다 잊고 마시꼬잉',
  ],
  coffee: [
    '카페인이 곧 의지꼬잉','한 모금에 각성꼬잉','졸려도 해야 하꼬잉',
    '커피 없인 못 살꼬잉','오늘도 버티꼬잉','향부터 힐링꼬잉',
  ],
  chicken: [
    '치킨이 최고꼬잉','야식의 왕이꼬잉','살 찌는 소리가 들리꼬잉',
    '먹고 후회는 내일꼬잉','치킨 앞에 장사 없꼬잉','이건 참을 수 없꼬잉',
  ],
  tteokbokki: [
    '맵고 달콤하꼬잉','떡볶이는 국민 간식꼬잉','한 입에 힐링꼬잉',
    '매운 거 먹으면 스트레스 풀리꼬잉','오늘도 떡볶이꼬잉','떡 하나 더 달라꼬잉',
  ],
  ramen: [
    '야식은 라면이지꼬잉','끓이는 것도 귀찮꼬잉','컵라면도 맛있꼬잉',
    '밤에 먹으면 더 맛있꼬잉','후루룩꼬잉','국물이 진리꼬잉',
  ],
  pajeon: [
    '비 오는 날엔 파전이지꼬잉','노릇노릇하꼬잉','막걸리랑 먹고 싶꼬잉',
    '부침개 소리 들리꼬잉','오늘 기분 이 정도꼬잉','바삭하꼬잉',
  ],
  samgyeopsal: [
    '삼겹살이 최고꼬잉','지글지글꼬잉','쌈 싸 먹으면 완벽꼬잉',
    '비 오는 날엔 고기꼬잉','다 구워지꼬잉','먹고 살꼬잉',
  ],
};
const _bubbleEl=document.getElementById('bubble');
const _bubbleText=document.getElementById('bubble-text');
let _bubbleTimer=null;
function showBubble(category) {
  const list=MSGS[category];
  if (!list) return;
  _bubbleText.textContent=list[Math.floor(Math.random()*list.length)];
  const bx=pig.cx, by=pig.cy-pig.r*1.5;
  _bubbleEl.style.left=bx+'px'; _bubbleEl.style.top=by+'px';
  _bubbleEl.style.transform='translateX(-50%) translateY(-100%)';
  _bubbleEl.classList.remove('visible');
  void _bubbleEl.offsetWidth;
  _bubbleEl.classList.add('visible');
  if (_bubbleTimer) clearTimeout(_bubbleTimer);
  _bubbleTimer=setTimeout(()=>_bubbleEl.classList.remove('visible'),2600);
}
