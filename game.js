(() => {
  'use strict';
  const CARDS = [
    {id:'bone',name:'黄金骨头',emoji:'🍖',mark:'骨'}, {id:'fish',name:'臭鱼',emoji:'🐟',mark:'鱼'},
    {id:'cheese',name:'贵族奶酪',emoji:'🧀',mark:'酪'}, {id:'honey',name:'午夜蜂蜜',emoji:'🍯',mark:'蜜'},
    {id:'gem',name:'龙泪宝石',emoji:'💎',mark:'泪'}, {id:'wild',name:'幻影牌',emoji:'🃏',mark:'幻',wild:true}
  ];
  const PLAYERS = [
    {id:'shadow',name:'夜影',emoji:'🐱',title:'黑猫酒保',skill:'猫的直觉',desc:'每局第一次受伤有 25% 概率闪避。',color:'#8f75d6',portrait:'assets/portraits/black-cat.svg'},
    {id:'crow',name:'鸦策',emoji:'🐦‍⬛',title:'心理战大师',skill:'读心术',desc:'对手动作线索的可靠率略微提高。',color:'#597f9e',portrait:'assets/portraits/crow.svg'},
    {id:'tail',name:'红尾',emoji:'🦊',title:'狐狸赌徒',skill:'狐假虎威',desc:'得意表演被怀疑的概率更低。',color:'#d66c3e',portrait:'assets/portraits/fox.svg'},
    {id:'snow',name:'雪球',emoji:'🐰',title:'危险贵族',skill:'纯洁眼神',desc:'无辜表演被怀疑的概率更低。',color:'#9fc9d6',portrait:'assets/portraits/rabbit.svg'}
  ];
  const AI = [
    {id:'fang',name:'铁牙',emoji:'🐶',title:'直觉派保镖',hp:2,lie:0.38,doubt:0.55,
      hello:'我闻得出谎话。除了我自己的。', tells:['爪子在桌下数拍子','认真闻了闻牌背','露出一颗很诚实的牙'],
      claims:['凭我的狗格担保。','骨头作证，我没撒谎！','看我真诚的鼻子。']},
    {id:'tail',name:'红尾',emoji:'🦊',title:'华丽诈术师',hp:2,lie:0.72,doubt:0.68,
      portrait:'assets/portraits/fox.svg',color:'#d66c3e',
      hello:'亲爱的，真相只是没化妆的谎言。',tells:['尾巴优雅地绕了两圈','笑容比牌面还闪亮','故意眨了左眼'],
      claims:['聪明人都该相信我。','这可是贵族级的真话。','不信？那正合我意。']},
    {id:'snow',name:'雪球',emoji:'🐰',title:'惊慌演技派',hp:2,lie:0.52,doubt:0.34,
      portrait:'assets/portraits/rabbit.svg',color:'#9fc9d6',
      hello:'我、我只是来吃免费胡萝卜的！',tells:['长耳朵突然打了个结','紧张地啃空气','抱紧了会说话的鸡腿'],
      claims:['绝对是真的……吧？','兔子从来不骗猫！','鸡腿说它们都一样。']},
    {id:'hoot',name:'墨镜教授',emoji:'🦉',title:'概率学骗子',hp:2,lie:0.28,doubt:0.76,
      hello:'根据计算，你撒谎的概率很可爱。',tells:['眼镜反射出一串数字','把羽毛笔咬反了','严肃地推了推不存在的眼镜'],
      claims:['统计学不会说谎，我会。','置信度高达九成。','请尊重专业意见。']},
    {id:'pocket',name:'口袋',emoji:'🦝',title:'垃圾桶怪盗',hp:2,lie:0.82,doubt:0.43,
      hello:'不是我偷的，我只是替它保管。',tells:['口袋里传来勺子碰撞声','两只黑眼圈同时眨眼','悄悄把证据塞进尾巴'],
      claims:['刚从桌底捡的，保真！','骗你是小浣熊。','这牌自己跑进我口袋的。']},
    {id:'crow',name:'鸦策',emoji:'🐦‍⬛',title:'心理战大师',hp:2,lie:0.64,doubt:0.72,portrait:'assets/portraits/crow.svg',color:'#597f9e',
      hello:'我不需要看牌，只需要看你。',tells:['单片眼镜闪过冷光','慢慢敲了三下桌面','把问题原封不动丢回来'],
      claims:['你怀疑，正说明我赢了。','先猜猜我希望你怎么猜。','真相通常藏在第二层谎言里。']}
  ];
  const EVENTS = [
    {id:'moon',emoji:'🌑',name:'黑月低语',text:'本局所有角色更容易产生怀疑。',suspicion:.12},
    {id:'happy',emoji:'🍺',name:'老板请客',text:'本局成功判断获得双倍金币。',coin:2},
    {id:'fog',emoji:'🌫️',name:'幻影浓雾',text:'本局动作线索可能完全是烟雾弹。',fakeTell:true},
    {id:'crow',emoji:'🐦‍⬛',name:'乌鸦查桌',text:'本局只能盖一张牌。',maxCards:1}
  ];
  const ACHIEVEMENTS = [
    {id:'first_game',icon:'🚪',name:'推门入局',test:s=>s.games>=1},
    {id:'first_win',icon:'🏆',name:'黑月新星',test:s=>s.wins>=1},
    {id:'rich',icon:'🪙',name:'毛茸富翁',test:s=>s.bestCoins>=150},
    {id:'liar',icon:'🤥',name:'面不改色',test:s=>s.lies>=10}
  ];
  const ITEMS = [
    {id:'sock',emoji:'🧦',name:'臭袜子炸弹',desc:'熏晕当前对手，本次必定相信'},
    {id:'hat',emoji:'🎩',name:'魔术帽',desc:'把一张选中牌变成幻影牌'},
    {id:'leg',emoji:'🍗',name:'会说话的鸡腿',desc:'透露对手宣称的真假倾向'}
  ];
  const $ = id => document.getElementById(id);
  const els = Object.fromEntries(['introCinematic','skipIntroBtn','menuScreen','selectScreen','battleScreen','endingScreen','startBtn','restartBtn','rulesBtn','charactersBtn','collectionBtn','settingsBtn','characterGrid','selectedSkill','confirmCharacterBtn','backToMenuBtn','guideDialog','closeGuide','guideStartBtn','settingsDialog','closeSettings','settingSoundBtn','motionBtn','careerStats','achievementGrid','resetSaveBtn','codexDialog','closeCodex','codexGrid','collectionDialog','closeCollection','collectionGrid','battleSettingsBtn','skipMotionBtn','opponents','roundLabel','progressBar','coinsLabel','streakLabel','turnCallout','soundBtn','tensionMeter','suspicionBar','suspicionLabel','eventBanner','enemySpeech','table','tableFx','centerCard','resultText','playerHp','playerAvatar','playerName','playerTitle','selectionHint','hand','claimSelect','performanceButtons','playBtn','trustBtn','challengeBtn','itemButtons','log','motionLog','endingIcon','endingTitle','endingText','scoreCard','unlockPanel','endingMenuBtn','toast'].map(id=>[id,$(id)]));
  const SAVE_KEY='blackMoonTavern.v2';
  const defaultSave=()=>({games:0,wins:0,bestCoins:0,lies:0,achievements:[],sound:true,reducedMotion:false,selected:'shadow'});
  let state, toastTimer, audio, introAudio, introTimers=[], save=loadSave(), selectedPlayer=save.selected;
  const rand = a => a[Math.floor(Math.random()*a.length)];
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const cardBy = id => CARDS.find(c=>c.id===id);
  const activeAI = () => state.rivals[state.active];
  const claimTrue = (cards,id) => cards.every(c=>c.wild||c.id===id);
  const EXPRESSIONS={idle:'冷静',thinking:'思考',smug:'挑衅',hurt:'震惊',win:'得意'};
  function portraitMarkup(character,mood='idle'){
    const image=character.portrait?`<img src="${character.portrait}" alt="${character.name}头像" loading="eager">`:`<span class="portrait-fallback">${character.emoji}</span>`;
    return `${image}<i class="expression-mark" title="${EXPRESSIONS[mood]||'冷静'}">${{idle:'◆',thinking:'…',smug:'!',hurt:'×',win:'★'}[mood]||'◆'}</i>`;
  }

  function loadSave(){try{return {...defaultSave(),...JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')};}catch(_){return defaultSave();}}
  function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch(_){/* 私密浏览模式下继续单局游玩 */}}
  function introSound(){
    if(!save.sound||introAudio)return;
    try{introAudio=new (window.AudioContext||window.webkitAudioContext)();const master=introAudio.createGain(),drone=introAudio.createOscillator(),shimmer=introAudio.createOscillator();master.gain.value=.018;drone.type='sine';drone.frequency.value=55;shimmer.type='triangle';shimmer.frequency.value=164.8;drone.connect(master);shimmer.connect(master);master.connect(introAudio.destination);drone.start();shimmer.start();master.gain.exponentialRampToValueAtTime(.001,introAudio.currentTime+20);drone.stop(introAudio.currentTime+20);shimmer.stop(introAudio.currentTime+20);}catch(_){/* 浏览器阻止自动播放时保持无声 */}
  }
  function delay(fn,ms){return setTimeout(fn,state?.skipMotion?30:ms);}
  function openDialog(dialog){if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}
  function closeDialog(dialog){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}
  function motion(text){els.motionLog.textContent=text;els.motionLog.classList.remove('pulse');void els.motionLog.offsetWidth;els.motionLog.classList.add('pulse');}
  function tableEffect(text,kind='good'){
    const burst=document.createElement('div');burst.className=`fx-burst ${kind}`;burst.innerHTML=`<b>${text}</b>${Array.from({length:8},(_,i)=>`<i style="--i:${i}"></i>`).join('')}`;els.tableFx.append(burst);delay(()=>burst.remove(),1000);
  }
  function flyCard(from,reverse=false){
    if(state?.skipMotion||save.reducedMotion||!from?.getBoundingClientRect)return;
    const a=from.getBoundingClientRect(),b=els.centerCard.getBoundingClientRect(),clone=document.createElement('div');clone.className=`flying-card${reverse?' reverse':''}`;clone.textContent='☾';clone.style.cssText=`--sx:${a.left+a.width/2}px;--sy:${a.top+a.height/2}px;--tx:${b.left+b.width/2}px;--ty:${b.top+b.height/2}px`;document.body.append(clone);delay(()=>clone.remove(),720);
  }
  function setIntroStage(stage){els.introCinematic.dataset.stage=stage;}
  function endIntro(){introTimers.forEach(clearTimeout);introTimers=[];els.introCinematic.classList.add('closing');document.body.classList.remove('intro-playing');setTimeout(()=>{els.introCinematic.classList.add('hidden');els.introCinematic.classList.remove('closing');},save.reducedMotion?20:700);}
  function playIntro(){
    document.body.classList.add('intro-playing');els.introCinematic.classList.remove('hidden','closing');setIntroStage('dark');
    if(save.reducedMotion){introTimers.push(setTimeout(endIntro,350));return;}
    [['moon',700],['logo',2300],['street',4800],['door',6900],['tavern',7900],['cat',8800],['fox',10800],['crow',12800],['rabbit',14800],['final',16900]].forEach(([stage,delay])=>introTimers.push(setTimeout(()=>setIntroStage(stage),delay)));
    introTimers.push(setTimeout(endIntro,19000));
  }
  function freshState(){const rivals=AI.filter(ai=>ai.id!==selectedPlayer).sort(()=>Math.random()-.5).slice(0,3).map(x=>({...x,mood:'idle'}));return {player:PLAYERS.find(p=>p.id===selectedPlayer)||PLAYERS[0],playerMood:'idle',playerHp:4,rivals,active:0,round:1,maxRounds:8,coins:0,streak:0,suspicion:null,skipMotion:false,hand:[],selected:[],performance:'calm',phase:'player',move:null,lieHistory:[],items:Object.fromEntries(ITEMS.map(x=>[x.id,true])),forceTrust:false,sound:save.sound,activeEvent:null,dodged:false,gameOver:false};}
  function tone(kind='tap'){
    if(!state?.sound) return;
    try{audio ||= new (window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.type=kind==='bad'?'sawtooth':'triangle';o.frequency.value={tap:260,good:520,bad:110}[kind];g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.16);o.start();o.stop(audio.currentTime+.17);}catch(_){/* 音效接口在不支持 Web Audio 时静默降级 */}
  }
  function say(name,text){els.enemySpeech.innerHTML='';const b=document.createElement('b'),s=document.createElement('span');b.textContent=name;s.textContent=text;els.enemySpeech.append(b,s);}
  function log(text){const p=document.createElement('p');p.textContent=text;els.log.prepend(p);}
  function toast(text){clearTimeout(toastTimer);els.toast.textContent=text;els.toast.classList.add('show');toastTimer=setTimeout(()=>els.toast.classList.remove('show'),1600);}
  function animate(outcome){els.table.classList.remove('shake','win');void els.table.offsetWidth;els.table.classList.add(outcome==='good'?'win':'shake');tone(outcome);}
  function drawHand(){state.hand=Array.from({length:5},()=>rand(CARDS));state.selected=[];renderHand();}
  function renderHand(){els.hand.innerHTML='';const limit=state.activeEvent?.maxCards||3;state.hand.forEach((card,i)=>{const b=document.createElement('button');b.dataset.cardIndex=i;b.className=`card-btn card-${card.id}${state.selected.includes(i)?' selected':''}`;b.disabled=state.phase!=='player';b.setAttribute('aria-pressed',state.selected.includes(i));b.innerHTML=`<span class="corner">${card.mark}</span><span class="card-suit">BLACK MOON</span><span class="emoji">${card.emoji}</span><span class="name">${card.name}</span>`;b.onclick=()=>{const at=state.selected.indexOf(i);if(at>=0)state.selected.splice(at,1);else if(state.selected.length<limit)state.selected.push(i);else return toast(`本局最多盖 ${limit} 张！`);state.playerMood=state.selected.length?'thinking':'idle';motion(state.selected.length?`${state.player.name}挑起牌角，观察全桌视线。`:`${state.player.name}把牌放回手中。`);tone();renderHand();render();};els.hand.append(b);});els.selectionHint.textContent=state.selected.length?`已选 ${state.selected.length} 张`:`选择 1–${limit} 张`;}
  function renderOpponents(){els.opponents.innerHTML='';state.rivals.forEach((ai,i)=>{const div=document.createElement('div');div.className=`opponent character-${ai.id} mood-${ai.mood}${i===state.active&&ai.hp>0?' active':''}${ai.hp<=0?' out':''}`;div.style.setProperty('--hero-color',ai.color||'#a47b56');const status=ai.hp<=0?'离桌':i===state.active?EXPRESSIONS[ai.mood]:'旁观';div.innerHTML=`<span class="avatar">${portraitMarkup(ai,ai.mood)}</span><div><strong>${ai.name}</strong><small>${ai.title}</small><span class="pet-status">${status}</span><span class="hp">${ai.hp>0?'❤️'.repeat(ai.hp):'💫 出局'}</span></div>`;els.opponents.append(div);});}
  function renderItems(){els.itemButtons.innerHTML='';ITEMS.forEach(item=>{const b=document.createElement('button');b.disabled=!state.items[item.id]||state.phase==='resolving';b.title=item.desc;b.innerHTML=`<b>${item.emoji}</b>${item.name}`;b.onclick=()=>useItem(item.id);els.itemButtons.append(b);});}
  function render(){renderOpponents();els.playerHp.textContent='❤️'.repeat(Math.max(0,state.playerHp));els.playerAvatar.innerHTML=portraitMarkup(state.player,state.playerMood);els.playerAvatar.className=`character-${state.player.id} mood-${state.playerMood}`;els.playerName.textContent=state.player.name;els.playerTitle.textContent=`${state.player.title} · 你 · ${EXPRESSIONS[state.playerMood]}`;els.playerAvatar.style.setProperty('--hero-color',state.player.color);els.roundLabel.textContent=`第 ${Math.min(state.round,state.maxRounds)} / ${state.maxRounds} 局`;els.progressBar.style.width=`${Math.min(100,state.round,state.maxRounds)/state.maxRounds*100}%`;els.coinsLabel.textContent=`🪙 ${state.coins}`;els.streakLabel.textContent=`🔥 ${state.streak}`;els.streakLabel.classList.toggle('hot',state.streak>=3);els.turnCallout.textContent=state.phase==='judge'?'判断回合':state.phase==='player'?'你的回合':'揭晓中';els.suspicionBar.style.width=`${state.suspicion===null?0:Math.round(state.suspicion*100)}%`;els.suspicionLabel.textContent=state.suspicion===null?'尚未出牌':state.suspicion<.35?'放松':state.suspicion<.65?'留意':'高度警觉';els.tensionMeter.classList.toggle('danger-zone',state.suspicion>=.65);els.soundBtn.textContent=state.sound?'🔊':'🔇';renderItems();}
  function setPhase(phase){state.phase=phase;const judge=phase==='judge';els.playBtn.classList.toggle('hidden',judge);els.trustBtn.classList.toggle('hidden',!judge);els.challengeBtn.classList.toggle('hidden',!judge);els.playBtn.disabled=phase!=='player';els.claimSelect.disabled=phase!=='player';[...els.performanceButtons.children].forEach(b=>b.disabled=phase!=='player');renderHand();renderItems();}
  function reveal(card){els.centerCard.classList.remove('flip');els.centerCard.innerHTML='<span>☾</span>';requestAnimationFrame(()=>{els.centerCard.classList.add('flip');els.centerCard.innerHTML=`<span>${card.emoji}</span>`;});}
  function nextLiving(from=state.active){for(let n=1;n<=state.rivals.length;n++){const i=(from+n)%state.rivals.length;if(state.rivals[i].hp>0)return i;}return -1;}
  function beginRound(){if(state.playerHp<=0||state.rivals.every(a=>a.hp<=0)||state.round>state.maxRounds)return finishGame();state.active=state.rivals[state.active].hp>0?state.active:nextLiving(state.active);state.rivals.forEach((a,i)=>a.mood=i===state.active?'thinking':'idle');state.playerMood='idle';state.suspicion=null;state.forceTrust=false;state.move=null;state.activeEvent=state.round%2===0?rand(EVENTS):null;drawHand();els.centerCard.classList.remove('flip');els.centerCard.innerHTML='<span>☾</span>';els.resultText.textContent=`轮到${state.player.name}出牌`;say(activeAI().name,activeAI().hello);motion(`${activeAI().name}正在观察${state.player.name}的手牌。`);els.eventBanner.classList.toggle('hidden',!state.activeEvent);if(state.activeEvent){els.eventBanner.innerHTML=`<b>${state.activeEvent.emoji} ${state.activeEvent.name}</b><span>${state.activeEvent.text}</span>`;log(`🎲 特殊事件：${state.activeEvent.name}——${state.activeEvent.text}`);}setPhase('player');render();}
  function advance(){state.round++;const next=nextLiving(state.active);if(next>=0)state.active=next;delay(beginRound,700);}
  function damage(target,reason){target.hp!==undefined?target.hp--:state.playerHp--;if(target.hp!==undefined)target.mood='hurt';log(reason);render();}
  function reward(amount){state.coins+=amount*(state.activeEvent?.coin||1);}
  function hurtPlayer(reason){if(state.player.id==='shadow'&&!state.dodged&&Math.random()<.25){state.dodged=true;state.playerMood='smug';log('🐾 猫的直觉发动：夜影贴着伤害滑走了！');toast('闪避！');return false;}state.playerHp--;state.streak=0;state.playerMood='hurt';log(reason);return true;}
  function playerPlay(){if(state.phase!=='player')return;if(!state.selected.length)return toast('先选至少 1 张牌');state.selected.forEach(i=>flyCard(els.hand.querySelector?.(`[data-card-index="${i}"]`)));const ai=activeAI(),cards=state.selected.map(i=>state.hand[i]),claim=els.claimSelect.value,truth=claimTrue(cards,claim);state.lieHistory.push(!truth);let suspicion=ai.doubt+({calm:-.12,cute:-.07,smug:.06,taunt:.15})[state.performance]+state.lieHistory.slice(-3).filter(Boolean).length*.04+(state.activeEvent?.suspicion||0);if(state.player.id==='tail'&&state.performance==='smug')suspicion-=.15;if(state.player.id==='snow'&&state.performance==='cute')suspicion-=.15;state.suspicion=clamp(suspicion,.12,.9);state.playerMood='smug';ai.mood='thinking';setPhase('resolving');render();motion(`${ai.name}的怀疑正在上升，视线锁定牌背。`);const challenge=!state.forceTrust&&Math.random()<state.suspicion;log(`${state.player.emoji} ${state.player.name}盖下 ${cards.length} 张，宣称全是「${cardBy(claim).name}」。`);if(challenge){ai.mood='smug';say(ai.name,rand(['你刚才眨眼了。抓现行！','这味道不对——开牌！','慢着！我的胡须在报警！']));reveal(cards.find(c=>!c.wild&&c.id!==claim)||cards[0]);if(truth){damage(ai,`✅ ${ai.name}质疑错了，撞上货真价实！ -1❤️`);reward(15);state.streak++;els.resultText.textContent='真话反杀！';tableEffect('反 将 一 军','good');animate('good');}else{hurtPlayer(`💥 谎言露馅！${ai.name}笑到钻进桌底。${state.player.name} -1❤️`);els.resultText.textContent='大型社死现场';tableEffect('谎 言 破 裂','bad');animate('bad');}advance();}else{say(ai.name,state.forceTrust?'好臭！我什么都信！':rand(['……这次放你过去。','我信，但我的尾巴不信。','听起来居然像真的。']));if(!truth){damage(ai,`😏 ${ai.name}吞下了整套谎言！ -1❤️`);reward(25);state.streak++;state.playerMood='win';els.resultText.textContent='骗术大成功！';motion(`${state.player.name}的谎言完美落桌。`);tableEffect('BLUFF 成 功','good');animate('good');}else{reward(5);log(`😇 ${ai.name}相信了真话。安全，但不够坏。`);els.resultText.textContent='诚实得令人可疑';tone('tap');}delay(enemyTurn,650);}render();}
  function enemyTurn(){
    if(state.playerHp<=0||activeAI().hp<=0)return advance();
    const ai=activeAI(),wantsLie=Math.random()<ai.lie,claims=CARDS.filter(c=>!c.wild),claim=rand(claims).id;
    ai.mood=wantsLie?'smug':'thinking';state.playerMood='thinking';state.suspicion=null;flyCard(els.opponents.querySelector?.('.opponent.active .avatar'));motion(`${ai.name}把牌推向桌心，观察你的眼睛。`);
    let cards;
    if(wantsLie){do{cards=[rand(CARDS),rand(CARDS)];}while(claimTrue(cards,claim));}
    else cards=[Math.random()<.2?cardBy('wild'):cardBy(claim),Math.random()<.2?cardBy('wild'):cardBy(claim)];
    const truth=claimTrue(cards,claim),reliableTell=Math.random()<(state.player.id==='crow'?.8:.68);
    const honestTell=rand(['呼吸平稳得像睡着了','牌放得干脆利落','目光没有躲闪']),lyingTell=rand(ai.tells);
    const tell=state.activeEvent?.fakeTell?rand([...ai.tells,'表情完美得毫无意义']):((truth===reliableTell)?honestTell:lyingTell);
    state.move={cards,claim,truth};say(ai.name,`${rand(ai.claims)} 两张「${cardBy(claim).name}」。（${tell}）`);
    els.resultText.textContent=`判断 ${ai.name} 的话`;els.centerCard.classList.remove('flip');els.centerCard.innerHTML='<span>☾</span>';
    log(`${ai.emoji} ${ai.name}宣称两张「${cardBy(claim).name}」。`);setPhase('judge');render();
  }
  function judge(challenge){if(state.phase!=='judge')return;setPhase('resolving');const ai=activeAI(),m=state.move;reveal(m.cards.find(c=>!c.wild&&c.id!==m.claim)||m.cards[0]);if(challenge&&!m.truth){damage(ai,`🕵️ 抓到了！${ai.name}的演技当场漏气。 -1❤️`);reward(state.player.id==='fang'?25:20);state.streak++;state.playerMood='win';els.resultText.textContent='骗子现形！';motion(`${ai.name}被识破，表情管理彻底失控。`);tableEffect('识 破！','good');animate('good');}else if(challenge&&m.truth){ai.mood='win';hurtPlayer(`😵 怀疑错了！${ai.name}难得诚实一次。${state.player.name} -1❤️`);els.resultText.textContent='疑心翻车';motion(`${ai.name}得意靠回椅背，你付出了怀疑的代价。`);tableEffect('判 断 失 误','bad');animate('bad');}else if(!challenge&&!m.truth){ai.mood='win';hurtPlayer(`🎪 你信了！${ai.name}笑得从椅子上滚下来。${state.player.name} -1❤️`);els.resultText.textContent='被骗得很有风度';motion(ai.id==='snow'?'雪球甜甜一笑，王冠后的危险终于显形。':`${ai.name}的骗局得手，紧张气氛炸开。`);tableEffect('BLUFF 得 手','bad');animate('bad');}else{reward(5);state.streak++;state.playerMood='smug';log(`😇 判断正确，${ai.name}这次没有搞事。`);els.resultText.textContent='眼光精准';motion('你没有被虚张声势带偏。');tone('good');}render();advance();}
  function useItem(id){if(!state.items[id])return;const ai=activeAI();if(id==='sock'){if(state.phase!=='player')return toast('要在自己出牌前扔袜子');state.forceTrust=true;say(ai.name,'呕——谁把地窖的空气做成武器了？！');toast('本次出牌，对手必定相信');}
    if(id==='hat'){if(state.phase!=='player'||!state.selected.length)return toast('先选一张要变的牌');state.hand[state.selected[0]]=cardBy('wild');renderHand();toast('帽子里钻出一张幻影牌！');}
    if(id==='leg'){if(state.phase!=='judge')return toast('等对手宣称后再问鸡腿');const clue=state.move.truth?(Math.random()<.75?'它闻起来很诚实。':'它滋滋地喊：可疑！'):(Math.random()<.75?'鸡腿尖叫：他在撒谎！':'它说：大概是真的？');toast(`🍗「${clue}」`);}
    state.items[id]=false;log(`${ITEMS.find(x=>x.id===id).emoji} 使用了「${ITEMS.find(x=>x.id===id).name}」！`);tone();renderItems();}
  function finishGame(){state.gameOver=true;els.battleScreen.classList.add('hidden');els.endingScreen.classList.remove('hidden');const won=state.rivals.every(a=>a.hp<=0),feedback={shadow:{win:'夜影擦亮酒杯：酒局归我，账单归你。',lose:'夜影躲进吧台：这是酒保的战术休息。'},crow:{win:'鸦策合上笔记：每一步，都在计算之中。',lose:'鸦策拔下一根羽毛：显然是样本量不足。'},tail:{win:'红尾甩开大衣：掌声可以再狡猾一点。',lose:'红尾微笑退场：输牌，不等于输掉魅力。'},snow:{win:'雪球摘下王冠：可爱，才是最危险的武器。',lose:'雪球钻进餐巾：贵族从不承认这是逃跑。'}}[state.player.id];if(won){els.endingIcon.innerHTML=portraitMarkup(state.player,'win');els.endingTitle.textContent='黑月酒桌的新传说';els.endingText.textContent=feedback.win;state.coins+=100;}else{els.endingIcon.innerHTML=portraitMarkup(state.player,'hurt');els.endingTitle.textContent=state.playerHp<=0?'今晚最大的受害者':'差一点就骗完了';els.endingText.textContent=feedback.lose;}els.endingScreen.classList.toggle('victory',won);els.endingScreen.classList.toggle('defeat',!won);save.games++;save.wins+=won?1:0;save.bestCoins=Math.max(save.bestCoins,state.coins);save.lies+=state.lieHistory.filter(Boolean).length;const before=new Set(save.achievements);ACHIEVEMENTS.forEach(a=>{if(a.test(save)&&!before.has(a.id))save.achievements.push(a.id);});persist();const unlocked=save.achievements.filter(id=>!before.has(id));els.unlockPanel.innerHTML=unlocked.length?`<b>新成就解锁</b>${unlocked.map(id=>{const a=ACHIEVEMENTS.find(x=>x.id===id);return `<span>${a.icon} ${a.name}</span>`;}).join('')}`:'';els.scoreCard.textContent=`${won?'通关奖励':'安慰奖金'} · 🪙 ${state.coins}　|　最高连胜 ${state.streak}`;tone(won?'good':'bad');}
  function showOnly(screen){[els.menuScreen,els.selectScreen,els.battleScreen,els.endingScreen].forEach(x=>x.classList.toggle('hidden',x!==screen));}
  function renderCharacters(){els.characterGrid.innerHTML='';PLAYERS.forEach(p=>{const b=document.createElement('button');b.className=`character-choice${p.id===selectedPlayer?' selected':''}`;b.style.setProperty('--hero-color',p.color);b.innerHTML=`<span class="choice-portrait">${portraitMarkup(p,p.id===selectedPlayer?'smug':'idle')}</span><b>${p.name}</b><small>${p.title}</small>`;b.onclick=()=>{selectedPlayer=p.id;renderCharacters();renderSelectedSkill();tone();};els.characterGrid.append(b);});}
  function renderSelectedSkill(){const p=PLAYERS.find(x=>x.id===selectedPlayer);els.selectedSkill.innerHTML=`<b>✦ ${p.skill}</b><span>${p.desc}</span>`;}
  function openSelection(){showOnly(els.selectScreen);renderCharacters();renderSelectedSkill();}
  function startGame(){save.selected=selectedPlayer;persist();state=freshState();showOnly(els.battleScreen);document.body.classList.toggle('reduced-motion',save.reducedMotion);els.log.innerHTML='';els.claimSelect.innerHTML=CARDS.filter(c=>!c.wild).map(c=>`<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('');[...els.performanceButtons.children].forEach(b=>b.classList.toggle('active',b.dataset.performance==='calm'));log('🐦‍⬛ 乌鸦老板：撑过八局，放倒整桌，第一杯算我的。');beginRound();}
  function openSettings(){els.settingSoundBtn.textContent=save.sound?'🔊 已开启':'🔇 已关闭';els.motionBtn.textContent=save.reducedMotion?'🌙 精简':'✨ 完整';els.careerStats.innerHTML=`<b>酒馆生涯</b><span>入局 ${save.games} 次</span><span>胜利 ${save.wins} 次</span><span>最高金币 ${save.bestCoins}</span><span>累计谎言 ${save.lies}</span>`;els.achievementGrid.innerHTML=ACHIEVEMENTS.map(a=>`<div class="achievement ${save.achievements.includes(a.id)?'earned':'locked'}"><span>${save.achievements.includes(a.id)?a.icon:'🔒'}</span><b>${a.name}</b></div>`).join('');if(!els.settingsDialog.open)openDialog(els.settingsDialog);}
  function openCodex(){els.codexGrid.innerHTML=PLAYERS.map(p=>`<article style="--hero-color:${p.color}"><div class="codex-portrait">${portraitMarkup(p,'smug')}</div><div><small>${p.title}</small><h3>${p.name}</h3><b>✦ ${p.skill}</b><p>${p.desc}</p></div></article>`).join('');openDialog(els.codexDialog);}
  function openCollection(){els.collectionGrid.innerHTML=CARDS.map(card=>{const rarity=card.wild?'传说':card.id==='gem'?'珍稀':card.id==='honey'?'罕见':'普通';return `<article class="collection-card card-${card.id}"><small>${rarity}</small><span>${card.emoji}</span><b>${card.name}</b><p>${card.wild?'可冒充任意宣称牌。':'基础宣称牌，可真可假。'}</p></article>`;}).join('');openDialog(els.collectionDialog);}
  els.skipIntroBtn.onclick=endIntro;els.introCinematic.addEventListener('pointerdown',e=>{if(e.target!==els.skipIntroBtn)introSound();},{once:true});els.startBtn.onclick=openSelection;els.rulesBtn.onclick=()=>openDialog(els.guideDialog);els.charactersBtn.onclick=openCodex;els.collectionBtn.onclick=openCollection;els.closeCodex.onclick=()=>closeDialog(els.codexDialog);els.closeCollection.onclick=()=>closeDialog(els.collectionDialog);els.settingsBtn.onclick=openSettings;els.battleSettingsBtn.onclick=openSettings;els.skipMotionBtn.onclick=()=>{state.skipMotion=true;toast('已跳过本局等待动画');motion('快速结算已开启。');};els.closeSettings.onclick=()=>closeDialog(els.settingsDialog);els.settingSoundBtn.onclick=()=>{save.sound=!save.sound;if(state)state.sound=save.sound;persist();openSettings();};els.motionBtn.onclick=()=>{save.reducedMotion=!save.reducedMotion;document.body.classList.toggle('reduced-motion',save.reducedMotion);persist();openSettings();};els.resetSaveBtn.onclick=()=>{save=defaultSave();persist();selectedPlayer=save.selected;openSettings();};els.closeGuide.onclick=()=>closeDialog(els.guideDialog);els.guideStartBtn.onclick=()=>{closeDialog(els.guideDialog);openSelection();};els.confirmCharacterBtn.onclick=startGame;els.backToMenuBtn.onclick=()=>showOnly(els.menuScreen);els.restartBtn.onclick=openSelection;els.endingMenuBtn.onclick=()=>showOnly(els.menuScreen);els.playBtn.onclick=playerPlay;els.trustBtn.onclick=()=>judge(false);els.challengeBtn.onclick=()=>judge(true);els.soundBtn.onclick=()=>{state.sound=!state.sound;save.sound=state.sound;persist();render();tone();};els.performanceButtons.onclick=e=>{const b=e.target.closest('[data-performance]');if(!b||state.phase!=='player')return;state.performance=b.dataset.performance;state.playerMood=b.dataset.performance==='taunt'||b.dataset.performance==='smug'?'smug':b.dataset.performance==='cute'?'thinking':'idle';motion(`${state.player.name}换上了「${b.textContent.trim()}」的表情。`);render();[...els.performanceButtons.children].forEach(x=>x.classList.toggle('active',x===b));tone();};
  if('serviceWorker' in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  playIntro();
  window.__BLACK_MOON__={CARDS,AI,PLAYERS,EVENTS,ACHIEVEMENTS,claimTrue,freshState,setIntroStage,endIntro};
})();
