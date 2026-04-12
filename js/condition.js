// ── Pig Condition ─────────────────────────────────────────
// 0~100: 0=지침, 100=행복
let pigCondition = 70;
let conditionPetBonusGiven = false; // 세션당 쓰다듬기 보너스 1회

function loadCondition() {
  const saved    = localStorage.getItem('pigCondition');
  const lastVisit= localStorage.getItem('pigLastVisit');

  if (saved !== null) pigCondition = parseInt(saved);

  if (lastVisit) {
    const hours  = (Date.now() - parseInt(lastVisit)) / 3600000;
    const decay  = Math.min(70, Math.floor(hours * 7));
    pigCondition = Math.max(0, pigCondition - decay);
  }

  _saveCondition();
  localStorage.setItem('pigLastVisit', Date.now().toString());

  // 진입 말풍선
  if (pigCondition <= 19) {
    setTimeout(() => showBubble('_cond_low'),  900);
  } else if (pigCondition >= 85) {
    setTimeout(() => showBubble('_cond_high'), 900);
  }
}

function improveCondition(amount) {
  pigCondition = Math.min(100, pigCondition + amount);
  _saveCondition();
}

function _saveCondition() {
  localStorage.setItem('pigCondition', pigCondition.toString());
}
