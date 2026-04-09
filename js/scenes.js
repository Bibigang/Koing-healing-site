// ── SCENES ────────────────────────────────────────────────
// Add new scenes here. Each scene: id, label, sky[], ground[], groundY,
// shadowColor, cloudFill (null=no clouds), cloudShadow, items[]
//
// items: scene-specific item tray (to be defined per-scene later).
// Until then, all scenes share DEFAULT_ITEMS — the original item set.
const DEFAULT_ITEMS = [
  {type:'cupcake',  rx:0.18, ry:0.78},
  {type:'cocktail', rx:0.82, ry:0.78},
  {type:'flower',   rx:0.5,  ry:0.84},
];

const SCENES = [
  {
    id:'spring', label:'봄 들판',
    sky:['#87CEEB','#C5E8F5'], ground:['#88C34A','#4E8A20'], groundY:0.6,
    shadowColor:'rgba(42,80,0,0.22)',
    cloudFill:'rgba(255,255,255,0.92)', cloudShadow:'rgba(100,140,200,0.2)',
    items: DEFAULT_ITEMS, // TODO: define spring-specific items
  },
  {
    id:'night', label:'밤',
    sky:['#0D1B3E','#152850'], ground:['#1A3A1A','#0D2010'], groundY:0.6,
    shadowColor:'rgba(0,20,0,0.35)',
    cloudFill:null,
    items: [{type:'chicken',rx:0.18,ry:0.78},{type:'tteokbokki',rx:0.5,ry:0.82},{type:'ramen',rx:0.82,ry:0.78}],
  },
  {
    id:'rainy', label:'비오는 날',
    sky:['#6A8A9A','#8AAABB'], ground:['#527830','#325018'], groundY:0.6,
    shadowColor:'rgba(20,50,0,0.22)',
    cloudFill:'rgba(160,175,185,0.95)', cloudShadow:'rgba(60,90,120,0.25)',
    items: [{type:'makgeolli',rx:0.18,ry:0.78},{type:'pajeon',rx:0.5,ry:0.82},{type:'samgyeopsal',rx:0.82,ry:0.78}],
  },
  {
    id:'cozy', label:'아늑한 방',
    sky:['#F5E0C8','#EDDCC0'], ground:['#C8906A','#A07040'], groundY:0.6,
    shadowColor:'rgba(80,40,0,0.2)',
    cloudFill:null,
    items: [{type:'cocoa',rx:0.18,ry:0.78},{type:'macaron',rx:0.5,ry:0.84},{type:'teacup',rx:0.82,ry:0.78}],
  },
  {
    id:'study', label:'공부 책상',
    sky:['#EDE4D8','#D8CDB8'], ground:['#C8A870','#9A7840'], groundY:0.6,
    shadowColor:'rgba(70,40,0,0.2)',
    cloudFill:null,
    items: [{type:'coffee',rx:0.18,ry:0.78},{type:'cookie',rx:0.5,ry:0.84},{type:'macaron',rx:0.82,ry:0.78}],
  },
];
