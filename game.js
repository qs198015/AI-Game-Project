(() => {
  'use strict';
  const CARDS = [
    {id:'bone',name:'黄金骨头',emoji:'🍖',mark:'骨',rarity:'普通',effect:'真话通过时额外获得 5 金币。'},
    {id:'fish',name:'臭鱼',emoji:'🐟',mark:'鱼',rarity:'普通',effect:'盖下时用气味扰乱观察，怀疑度 -8%。'},
    {id:'cheese',name:'贵族奶酪',emoji:'🧀',mark:'酪',rarity:'普通',effect:'成功骗过对手时额外获得 5 金币。'},
    {id:'honey',name:'午夜蜂蜜',emoji:'🍯',mark:'蜜',rarity:'罕见',effect:'每局首次成功判断后恢复 1 点生命。'},
    {id:'gem',name:'龙泪宝石',emoji:'💎',mark:'泪',rarity:'珍稀',effect:'本次心理战获得的金币翻倍。'},
    {id:'wild',name:'幻影牌',emoji:'🃏',mark:'幻',rarity:'传说',effect:'可以冒充本次宣称的任意牌。',wild:true}
  ];
  const PLAYERS = [
    {id:'shadow',name:'夜影',emoji:'🐱',art:'assets/portraits/full/shadow.png',title:'黑猫酒保',rarity:'传奇',difficulty:4,personality:'灵活多变，擅长用冷静掩饰临场骗局。',tags:['冷静','机会主义','九命'],quote:'我不赌运气，我只赌你会犹豫。',skill:'猫的直觉',desc:'每局第一次受伤有 25% 概率闪避。',color:'#8f75d6',portrait:'assets/portraits/full/shadow.png'},
    {id:'fang',name:'铁牙',emoji:'🐶',art:'assets/portraits/full/fang.png',title:'铁犬保镖',rarity:'精英',difficulty:3,personality:'强壮可靠却不擅长圆谎，适合正面反骗。',tags:['强壮','直率','压迫感'],quote:'我发誓……等等，发誓是不是骗人的开始？',skill:'反转之王',desc:'质疑成功时额外获得 5 金币。',color:'#a77745',portrait:'assets/portraits/full/fang.png'},
    {id:'tail',name:'红尾',emoji:'🦊',art:'assets/portraits/full/tail.png',title:'狐狸赌徒',rarity:'传奇',difficulty:4,personality:'优雅而危险，享受在高风险中操纵怀疑。',tags:['华丽','挑衅','高风险'],quote:'真相只是还没化妆的谎言。',skill:'狐假虎威',desc:'得意表演被怀疑的概率更低。',color:'#d66c3e',portrait:'assets/portraits/full/tail.png'},
    {id:'snow',name:'雪球',emoji:'🐰',art:'assets/portraits/full/snow.png',title:'危险贵族',rarity:'稀有',difficulty:2,personality:'用无辜和慌张隐藏真正意图，容错率较高。',tags:['无辜','慌张','危险'],quote:'我没有骗人，是鸡腿教我的。',skill:'纯洁眼神',desc:'无辜表演被怀疑的概率更低。',color:'#9fc9d6',portrait:'assets/portraits/full/snow.png'}
  ];
  const AI = [
    {id:'fang',name:'铁牙',emoji:'🐶',art:'assets/portraits/full/fang.png',portrait:'assets/portraits/full/fang.png',color:'#a77745',title:'直觉派保镖',hp:2,lie:0.38,doubt:0.55,
      hello:'我闻得出谎话。除了我自己的。', tells:['爪子在桌下数拍子','认真闻了闻牌背','露出一颗很诚实的牙'],
      claims:['凭我的狗格担保。','骨头作证，我没撒谎！','看我真诚的鼻子。']},
    {id:'tail',name:'红尾',emoji:'🦊',title:'华丽诈术师',hp:2,lie:0.72,doubt:0.68,
      art:'assets/portraits/full/tail.png',portrait:'assets/portraits/full/tail.png',color:'#d66c3e',
      hello:'亲爱的，真相只是没化妆的谎言。',tells:['尾巴优雅地绕了两圈','笑容比牌面还闪亮','故意眨了左眼'],
      claims:['聪明人都该相信我。','这可是贵族级的真话。','不信？那正合我意。']},
    {id:'snow',name:'雪球',emoji:'🐰',title:'惊慌演技派',hp:2,lie:0.52,doubt:0.34,
      art:'assets/portraits/full/snow.png',portrait:'assets/portraits/full/snow.png',color:'#9fc9d6',
      hello:'我、我只是来吃免费胡萝卜的！',tells:['长耳朵突然打了个结','紧张地啃空气','抱紧了会说话的鸡腿'],
      claims:['绝对是真的……吧？','兔子从来不骗猫！','鸡腿说它们都一样。']},
    {id:'hoot',name:'墨镜教授',emoji:'🦉',title:'概率学骗子',hp:2,lie:0.28,doubt:0.76,
      hello:'根据计算，你撒谎的概率很可爱。',tells:['眼镜反射出一串数字','把羽毛笔咬反了','严肃地推了推不存在的眼镜'],
      claims:['统计学不会说谎，我会。','置信度高达九成。','请尊重专业意见。']},
    {id:'pocket',name:'口袋',emoji:'🦝',title:'垃圾桶怪盗',hp:2,lie:0.82,doubt:0.43,
      hello:'不是我偷的，我只是替它保管。',tells:['口袋里传来勺子碰撞声','两只黑眼圈同时眨眼','悄悄把证据塞进尾巴'],
      claims:['刚从桌底捡的，保真！','骗你是小浣熊。','这牌自己跑进我口袋的。']},
    {id:'crow',name:'鸮策',emoji:'🦉',title:'黑月酒馆老板',hp:2,lie:0.64,doubt:0.72,art:'assets/portraits/owl-chief.png',portrait:'assets/portraits/owl-chief.png',color:'#d1aa61',
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
  const els = Object.fromEntries(['introCinematic','introVideo','skipIntroBtn','menuScreen','selectScreen','battleScreen','endingScreen','startBtn','restartBtn','rulesBtn','storyModeBtn','trialBtn','charactersBtn','collectionBtn','settingsBtn','characterGrid','selectedSkill','confirmCharacterBtn','backToMenuBtn','guideDialog','closeGuide','guideStartBtn','settingsDialog','closeSettings','settingSoundBtn','motionBtn','careerStats','achievementGrid','resetSaveBtn','codexDialog','closeCodex','codexGrid','collectionDialog','closeCollection','collectionGrid','battleSettingsBtn','skipMotionBtn','opponents','roundLabel','progressBar','coinsLabel','streakLabel','turnCallout','soundBtn','tensionMeter','suspicionBar','suspicionLabel','eventBanner','enemySpeech','table','tableFx','centerCard','resultText','playerHp','playerAvatar','playerName','playerTitle','selectionHint','hand','claimSelect','performanceButtons','playBtn','trustBtn','challengeBtn','itemButtons','log','motionLog','endingIcon','endingTitle','endingText','scoreCard','endingBreakdown','unlockPanel','endingMenuBtn','toast','storyLayer','storyPortrait','storyRole','storyName','storyText','storyProgress','skipStoryBtn','nextStoryBtn'].map(id=>[id,$(id)]));
  const SAVE_KEY='blackMoonTavern.v2';
  const defaultSave=()=>({games:0,wins:0,bestCoins:0,lies:0,achievements:[],sound:true,reducedMotion:false,selected:'shadow'});
  let state, toastTimer, audio, musicGain, musicStarted=false, storyIndex=0, save=loadSave(), selectedPlayer=save.selected;
  const STORY=[
    {speaker:'鸮策',role:'黑月酒馆老板',portrait:'crow',text:'欢迎来到旧钟街最后一间还收谎话的酒馆。今晚的规矩很简单：别先眨眼。'},
    {speaker:'PLAYER',role:'挑战者',portrait:'PLAYER',text:'三位对手，一叠盖住的牌。只要他们开始相信自己，我就已经赢了一半。'},
    {speaker:'红尾',role:'华丽诈术师',portrait:'tail',text:'说得真漂亮。可惜在黑月酒桌，最像真话的那一句——通常最贵。'}
  ];
  const rand = a => a[Math.floor(Math.random()*a.length)];
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const cardBy = id => CARDS.find(c=>c.id===id);
  const activeAI = () => state.rivals[state.active];
  const claimTrue = (cards,id) => cards.every(c=>c.wild||c.id===id);
  const EXPRESSIONS={idle:'待机',thinking:'思考',suspicious:'怀疑',smug:'挑衅',hurt:'受伤',win:'胜利'};
  function portraitMarkup(character,mood='idle'){
    const source=character.art||character.portrait;const image=source?`<img src="${source}" alt="${character.name}头像" loading="eager">`:`<span class="portrait-fallback">${character.emoji}</span>`;
    return `${image}<i class="expression-mark" title="${EXPRESSIONS[mood]||'冷静'}">${{idle:'◆',thinking:'…',suspicious:'?',smug:'!',hurt:'×',win:'★'}[mood]||'◆'}</i>`;
  }

  function loadSave(){try{return {...defaultSave(),...JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')};}catch(_){return defaultSave();}}
  function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch(_){/* 私密浏览模式下继续单局游玩 */}}
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
  function endIntro(){
    els.introVideo.pause?.();
    els.introCinematic.classList.add('closing');
    document.body.classList.remove('intro-playing');
    setTimeout(()=>{els.introCinematic.classList.add('hidden');els.introCinematic.classList.remove('closing');},save.reducedMotion?20:350);
  }
  function playIntro(){
    document.body.classList.add('intro-playing');
    els.introCinematic.classList.remove('hidden','closing');
    if(save.reducedMotion){endIntro();return;}
    els.introVideo.muted=false;
    els.introVideo.volume=.04;
    const playback=els.introVideo.play?.();
    playback?.then?.(()=>fadeVideoIn()).catch?.(()=>{els.introVideo.muted=true;els.introVideo.play?.().catch?.(()=>{});});
    startMusic();
  }
  function freshState(){const rivals=AI.filter(ai=>ai.id!==selectedPlayer&&['fang','tail','snow','crow'].includes(ai.id)).sort(()=>Math.random()-.5).slice(0,3).map(x=>({...x,mood:'idle'}));return {player:PLAYERS.find(p=>p.id===selectedPlayer)||PLAYERS[0],playerMood:'idle',playerHp:4,rivals,active:0,round:1,maxRounds:8,coins:0,streak:0,suspicion:null,skipMotion:false,hand:[],selected:[],performance:'calm',phase:'player',move:null,lieHistory:[],items:Object.fromEntries(ITEMS.map(x=>[x.id,true])),forceTrust:false,sound:save.sound,activeEvent:null,dodged:false,honeyUsed:false,roundHistory:[],gameOver:false};}
  function tone(kind='tap'){
    if(!(state?.sound??save.sound)) return;
    try{audio ||= new (window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.type=kind==='bad'?'sawtooth':'triangle';o.frequency.value={tap:260,good:520,bad:110}[kind];g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.16);o.start();o.stop(audio.currentTime+.17);}catch(_){/* 音效接口在不支持 Web Audio 时静默降级 */}
  }
  function fadeVideoIn(){
    let step=0;const timer=setInterval(()=>{step++;els.introVideo.volume=Math.min(.55,.04+step*.035);if(step>=15)clearInterval(timer);},80);
  }
  function startMusic(){
    if(musicStarted||!save.sound)return;
    try{
      audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume?.();musicGain=audio.createGain();musicGain.gain.setValueAtTime(.0001,audio.currentTime);musicGain.gain.exponentialRampToValueAtTime(.018,audio.currentTime+2.8);musicGain.connect(audio.destination);
      [110,164.81,220].forEach((frequency,index)=>{const oscillator=audio.createOscillator(),level=audio.createGain();oscillator.type=index===0?'sine':'triangle';oscillator.frequency.value=frequency;level.gain.value=index===0?.34:.12;oscillator.connect(level);level.connect(musicGain);oscillator.start();});musicStarted=true;
    }catch(_){/* 浏览器禁用 Web Audio 时保留无音乐玩法 */}
  }
  function say(name,text){els.enemySpeech.innerHTML='';const b=document.createElement('b'),s=document.createElement('span');b.textContent=name;s.textContent=text;els.enemySpeech.append(b,s);}
  function log(text){const p=document.createElement('p');p.textContent=text;els.log.prepend(p);}
  function toast(text){clearTimeout(toastTimer);els.toast.textContent=text;els.toast.classList.add('show');toastTimer=setTimeout(()=>els.toast.classList.remove('show'),1600);}
  function animate(outcome){els.table.classList.remove('shake','win');void els.table.offsetWidth;els.table.classList.add(outcome==='good'?'win':'shake');tone(outcome);}
  function drawHand(){state.hand=Array.from({length:5},()=>rand(CARDS));state.selected=[];renderHand();}
  function renderHand(){els.hand.innerHTML='';const limit=state.activeEvent?.maxCards||3;state.hand.forEach((card,i)=>{const b=document.createElement('button');b.dataset.cardIndex=i;b.className=`card-btn card-${card.id}${state.selected.includes(i)?' selected':''}`;b.disabled=state.phase!=='player';b.setAttribute('aria-pressed',state.selected.includes(i));b.innerHTML=`<span class="corner">${card.mark}</span><span class="card-rarity">${card.rarity}</span><span class="card-suit">BLACK MOON</span><span class="card-sigil" aria-hidden="true"></span><span class="emoji">${card.emoji}</span><span class="name">${card.name}</span>`;b.onclick=()=>{const at=state.selected.indexOf(i);if(at>=0)state.selected.splice(at,1);else if(state.selected.length<limit)state.selected.push(i);else return toast(`本局最多盖 ${limit} 张！`);state.playerMood=state.selected.length?'thinking':'idle';motion(state.selected.length?`${state.player.name}挑起牌角，观察全桌视线。`:`${state.player.name}把牌放回手中。`);tone();renderHand();render();};els.hand.append(b);});els.selectionHint.textContent=state.selected.length?`已选 ${state.selected.length} 张`:`选择 1–${limit} 张`;}
  function renderOpponents(){els.opponents.innerHTML='';state.rivals.forEach((ai,i)=>{const div=document.createElement('div');div.className=`opponent character-${ai.id} mood-${ai.mood}${i===state.active&&ai.hp>0?' active':''}${ai.hp<=0?' out':''}`;div.style.setProperty('--hero-color',ai.color||'#a47b56');const status=ai.hp<=0?'离桌':i===state.active?EXPRESSIONS[ai.mood]:'旁观';div.innerHTML=`<span class="avatar">${portraitMarkup(ai,ai.mood)}</span><div><strong>${ai.name}</strong><small>${ai.title}</small><span class="pet-status">${status}</span><span class="hp">${ai.hp>0?'❤️'.repeat(ai.hp):'💫 出局'}</span><span class="affinity"><i style="width:${Math.round((1-ai.doubt)*100)}%"></i></span><small class="affinity-label">好感 ${Math.round((1-ai.doubt)*100)}%</small></div>`;els.opponents.append(div);});}
  function renderItems(){els.itemButtons.innerHTML='';ITEMS.forEach(item=>{const b=document.createElement('button');b.disabled=!state.items[item.id]||state.phase==='resolving';b.title=item.desc;b.innerHTML=`<b>${item.emoji}</b>${item.name}`;b.onclick=()=>useItem(item.id);els.itemButtons.append(b);});}
  function render(){renderOpponents();els.playerHp.textContent='❤️'.repeat(Math.max(0,state.playerHp));els.playerAvatar.innerHTML=portraitMarkup(state.player,state.playerMood);els.playerAvatar.className=`character-${state.player.id} mood-${state.playerMood}`;els.playerName.textContent=state.player.name;els.playerTitle.textContent=`${state.player.title} · 你 · ${EXPRESSIONS[state.playerMood]}`;els.playerAvatar.style.setProperty('--hero-color',state.player.color);els.roundLabel.textContent=`第 ${Math.min(state.round,state.maxRounds)} / ${state.maxRounds} 局`;els.progressBar.style.width=`${Math.min(100,state.round,state.maxRounds)/state.maxRounds*100}%`;els.coinsLabel.textContent=`🪙 ${state.coins}`;els.streakLabel.textContent=`🔥 ${state.streak}`;els.streakLabel.classList.toggle('hot',state.streak>=3);els.turnCallout.textContent=state.phase==='judge'?'判断回合':state.phase==='player'?'你的回合':'揭晓中';els.suspicionBar.style.width=`${state.suspicion===null?0:Math.round(state.suspicion*100)}%`;els.suspicionLabel.textContent=state.suspicion===null?'尚未出牌':state.suspicion<.35?'放松':state.suspicion<.65?'留意':'高度警觉';els.tensionMeter.classList.toggle('danger-zone',state.suspicion>=.65);els.soundBtn.textContent=state.sound?'🔊':'🔇';els.battleScreen.querySelectorAll?.('.round-progress-step').forEach(step=>step.classList.toggle('active',state.round>=Number(step.dataset.round)));renderItems();}
  function setPhase(phase){state.phase=phase;const judge=phase==='judge';els.playBtn.classList.toggle('hidden',judge);els.trustBtn.classList.toggle('hidden',!judge);els.challengeBtn.classList.toggle('hidden',!judge);els.playBtn.disabled=phase!=='player';els.claimSelect.disabled=phase!=='player';[...els.performanceButtons.children].forEach(b=>b.disabled=phase!=='player');renderHand();renderItems();}
  function reveal(card){els.centerCard.classList.remove('flip');els.centerCard.innerHTML='<span>☾</span>';requestAnimationFrame(()=>{els.centerCard.classList.add('flip');els.centerCard.innerHTML=`<span>${card.emoji}</span>`;});}
  function nextLiving(from=state.active){for(let n=1;n<=state.rivals.length;n++){const i=(from+n)%state.rivals.length;if(state.rivals[i].hp>0)return i;}return -1;}
  function beginRound(){if(state.playerHp<=0||state.rivals.every(a=>a.hp<=0)||state.round>state.maxRounds)return finishGame();state.active=state.rivals[state.active].hp>0?state.active:nextLiving(state.active);state.rivals.forEach((a,i)=>a.mood=i===state.active?'thinking':'idle');state.playerMood='idle';state.suspicion=null;state.forceTrust=false;state.move=null;state.activeEvent=state.round%2===0?rand(EVENTS):null;drawHand();els.centerCard.classList.remove('flip');els.centerCard.innerHTML='<span>☾</span>';els.resultText.textContent=`轮到${state.player.name}出牌`;say(activeAI().name,activeAI().hello);motion(`${activeAI().name}正在观察${state.player.name}的手牌。`);els.eventBanner.classList.toggle('hidden',!state.activeEvent);if(state.activeEvent){els.eventBanner.innerHTML=`<b>${state.activeEvent.emoji} ${state.activeEvent.name}</b><span>${state.activeEvent.text}</span>`;log(`🎲 特殊事件：${state.activeEvent.name}——${state.activeEvent.text}`);}setPhase('player');render();}
  function advance(){state.round++;const next=nextLiving(state.active);if(next>=0)state.active=next;delay(beginRound,700);}
  function damage(target,reason){target.hp!==undefined?target.hp--:state.playerHp--;if(target.hp!==undefined)target.mood='hurt';log(reason);render();}
  function reward(amount){const gemBoost=state.currentCards?.some(c=>c.id==='gem')?2:1;state.coins+=amount*(state.activeEvent?.coin||1)*gemBoost;}
  function cardReward(cards,kind){if(kind==='truth'&&cards.some(c=>c.id==='bone')){state.coins+=5;log('🍖 黄金骨头闪光：诚实奖金 +5。');}if(kind==='bluff'&&cards.some(c=>c.id==='cheese')){state.coins+=5;log('🧀 贵族奶酪发酵：骗术奖金 +5。');}}
  function healFromHoney(){if(state.honeyUsed||!state.hand.some(c=>c.id==='honey')||state.playerHp>=4)return;state.honeyUsed=true;state.playerHp++;log('🍯 午夜蜂蜜生效：判断精准，恢复 1❤️。');toast('午夜蜂蜜恢复生命！');}
  function hurtPlayer(reason){if(state.player.id==='shadow'&&!state.dodged&&Math.random()<.25){state.dodged=true;state.playerMood='smug';log('🐾 猫的直觉发动：夜影贴着伤害滑走了！');toast('闪避！');return false;}state.playerHp--;state.streak=0;state.playerMood='hurt';log(reason);return true;}
  function playerPlay(){if(state.phase!=='player')return;if(!state.selected.length)return toast('先选至少 1 张牌');state.selected.forEach(i=>flyCard(els.hand.querySelector?.(`[data-card-index="${i}"]`)));const ai=activeAI(),cards=state.selected.map(i=>state.hand[i]),claim=els.claimSelect.value,truth=claimTrue(cards,claim);state.currentCards=cards;state.lieHistory.push(!truth);let suspicion=ai.doubt+({calm:-.12,cute:-.07,smug:.06,taunt:.15})[state.performance]+state.lieHistory.slice(-3).filter(Boolean).length*.04+(state.activeEvent?.suspicion||0)-(cards.some(c=>c.id==='fish')?.08:0);if(state.player.id==='tail'&&state.performance==='smug')suspicion-=.15;if(state.player.id==='snow'&&state.performance==='cute')suspicion-=.15;state.suspicion=clamp(suspicion,.12,.9);state.playerMood='smug';ai.mood=state.suspicion>=.6?'suspicious':'thinking';setPhase('resolving');render();motion(`${ai.name}的怀疑正在上升，视线锁定牌背。`);const challenge=!state.forceTrust&&Math.random()<state.suspicion;log(`${state.player.emoji} ${state.player.name}盖下 ${cards.length} 张，宣称全是「${cardBy(claim).name}」。`);if(challenge){ai.mood='smug';say(ai.name,rand(['你刚才眨眼了。抓现行！','这味道不对——开牌！','慢着！我的胡须在报警！']));reveal(cards.find(c=>!c.wild&&c.id!==claim)||cards[0]);if(truth){damage(ai,`✅ ${ai.name}质疑错了，撞上货真价实！ -1❤️`);reward(15);cardReward(cards,'truth');state.streak++;els.resultText.textContent='真话反杀！';tableEffect('反 将 一 军','good');animate('good');}else{hurtPlayer(`💥 谎言露馅！${ai.name}笑到钻进桌底。${state.player.name} -1❤️`);els.resultText.textContent='大型社死现场';tableEffect('谎 言 破 裂','bad');animate('bad');}advance();}else{say(ai.name,state.forceTrust?'好臭！我什么都信！':rand(['……这次放你过去。','我信，但我的尾巴不信。','听起来居然像真的。']));if(!truth){damage(ai,`😏 ${ai.name}吞下了整套谎言！ -1❤️`);reward(25);cardReward(cards,'bluff');state.streak++;state.playerMood='win';els.resultText.textContent='骗术大成功！';motion(`${state.player.name}的谎言完美落桌。`);tableEffect('BLUFF 成 功','good');animate('good');}else{reward(5);cardReward(cards,'truth');log(`😇 ${ai.name}相信了真话。安全，但不够坏。`);els.resultText.textContent='诚实得令人可疑';tone('tap');}delay(enemyTurn,650);}render();}
  function enemyTurn(){
    state.currentCards=null;
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
  function judge(challenge){if(state.phase!=='judge')return;setPhase('resolving');const ai=activeAI(),m=state.move;reveal(m.cards.find(c=>!c.wild&&c.id!==m.claim)||m.cards[0]);if(challenge&&!m.truth){damage(ai,`🕵️ 抓到了！${ai.name}的演技当场漏气。 -1❤️`);reward(state.player.id==='fang'?25:20);state.streak++;state.playerMood='win';healFromHoney();els.resultText.textContent='骗子现形！';motion(`${ai.name}被识破，表情管理彻底失控。`);tableEffect('识 破！','good');animate('good');}else if(challenge&&m.truth){ai.mood='win';hurtPlayer(`😵 怀疑错了！${ai.name}难得诚实一次。${state.player.name} -1❤️`);els.resultText.textContent='疑心翻车';motion(`${ai.name}得意靠回椅背，你付出了怀疑的代价。`);tableEffect('判 断 失 误','bad');animate('bad');}else if(!challenge&&!m.truth){ai.mood='win';hurtPlayer(`🎪 你信了！${ai.name}笑得从椅子上滚下来。${state.player.name} -1❤️`);els.resultText.textContent='被骗得很有风度';motion(ai.id==='snow'?'雪球甜甜一笑，王冠后的危险终于显形。':`${ai.name}的骗局得手，紧张气氛炸开。`);tableEffect('BLUFF 得 手','bad');animate('bad');}else{reward(5);state.streak++;state.playerMood='smug';healFromHoney();log(`😇 判断正确，${ai.name}这次没有搞事。`);els.resultText.textContent='眼光精准';motion('你没有被虚张声势带偏。');tone('good');}render();advance();}
  function useItem(id){if(!state.items[id])return;const ai=activeAI();if(id==='sock'){if(state.phase!=='player')return toast('要在自己出牌前扔袜子');state.forceTrust=true;say(ai.name,'呕——谁把地窖的空气做成武器了？！');toast('本次出牌，对手必定相信');}
    if(id==='hat'){if(state.phase!=='player'||!state.selected.length)return toast('先选一张要变的牌');state.hand[state.selected[0]]=cardBy('wild');renderHand();toast('帽子里钻出一张幻影牌！');}
    if(id==='leg'){if(state.phase!=='judge')return toast('等对手宣称后再问鸡腿');const clue=state.move.truth?(Math.random()<.75?'它闻起来很诚实。':'它滋滋地喊：可疑！'):(Math.random()<.75?'鸡腿尖叫：他在撒谎！':'它说：大概是真的？');toast(`🍗「${clue}」`);}
    state.items[id]=false;log(`${ITEMS.find(x=>x.id===id).emoji} 使用了「${ITEMS.find(x=>x.id===id).name}」！`);tone();renderItems();}
  function finishGame(){state.gameOver=true;els.battleScreen.classList.add('hidden');els.endingScreen.classList.remove('hidden');const won=state.rivals.every(a=>a.hp<=0),feedback={shadow:{win:'夜影擦亮酒杯：酒局归我，账单归你。',lose:'夜影躲进吧台：这是酒保的战术休息。'},fang:{win:'铁牙放下骨头：看吧，直觉也是一种证据。',lose:'铁牙挠挠耳朵：我只是战略性地相信错了。'},crow:{win:'鸦策合上笔记：每一步，都在计算之中。',lose:'鸦策拔下一根羽毛：显然是样本量不足。'},tail:{win:'红尾甩开大衣：掌声可以再狡猾一点。',lose:'红尾微笑退场：输牌，不等于输掉魅力。'},snow:{win:'雪球摘下王冠：可爱，才是最危险的武器。',lose:'雪球钻进餐巾：贵族从不承认这是逃跑。'}}[state.player.id];if(won){els.endingIcon.innerHTML=portraitMarkup(state.player,'win');els.endingTitle.textContent='黑月酒桌的新传说';els.endingText.textContent=feedback.win;state.coins+=100;}else{els.endingIcon.innerHTML=portraitMarkup(state.player,'hurt');els.endingTitle.textContent=state.playerHp<=0?'今晚最大的受害者':'差一点就骗完了';els.endingText.textContent=feedback.lose;}els.endingScreen.classList.toggle('victory',won);els.endingScreen.classList.toggle('defeat',!won);save.games++;save.wins+=won?1:0;save.bestCoins=Math.max(save.bestCoins,state.coins);save.lies+=state.lieHistory.filter(Boolean).length;const before=new Set(save.achievements);ACHIEVEMENTS.forEach(a=>{if(a.test(save)&&!before.has(a.id))save.achievements.push(a.id);});persist();const unlocked=save.achievements.filter(id=>!before.has(id));els.unlockPanel.innerHTML=unlocked.length?`<b>新成就解锁</b>${unlocked.map(id=>{const a=ACHIEVEMENTS.find(x=>x.id===id);return `<span>${a.icon} ${a.name}</span>`;}).join('')}`:'';els.scoreCard.textContent=`${won?'通关奖励':'安慰奖金'} · 🪙 ${state.coins}　|　最高连胜 ${state.streak}`;els.endingBreakdown.innerHTML=`<span><b>${Math.min(state.round-1,state.maxRounds)}</b>完成回合</span><span><b>${state.lieHistory.filter(Boolean).length}</b>次谎言</span><span><b>${state.rivals.filter(a=>a.hp<=0).length}</b>名对手离桌</span>`;tone(won?'good':'bad');}
  function showOnly(screen){[els.menuScreen,els.selectScreen,els.battleScreen,els.endingScreen].forEach(x=>x.classList.toggle('hidden',x!==screen));}
  function renderCharacters(){els.characterGrid.innerHTML='';PLAYERS.forEach(p=>{const b=document.createElement('button');b.className=`character-choice${p.id===selectedPlayer?' selected':''}`;b.style.setProperty('--hero-color',p.color);b.innerHTML=`<span class="choice-portrait">${portraitMarkup(p,p.id===selectedPlayer?'smug':'idle')}</span><b>${p.name}</b><small>${p.title}</small><span class="character-rarity">✦ ${p.rarity}</span><span class="personality-tags">${p.tags.map(tag=>`<i>${tag}</i>`).join('')}</span><span class="difficulty"><em>难度</em>${'◆'.repeat(p.difficulty)}${'◇'.repeat(5-p.difficulty)}</span>`;b.onclick=()=>{selectedPlayer=p.id;renderCharacters();renderSelectedSkill();tone();};els.characterGrid.append(b);});}
  function renderSelectedSkill(){const p=PLAYERS.find(x=>x.id===selectedPlayer);els.selectedSkill.innerHTML=`<div><small>${p.personality}</small><b>✦ ${p.skill}</b><span>${p.desc}</span></div><q>${p.quote}</q>`;}
  function openSelection(){showOnly(els.selectScreen);renderCharacters();renderSelectedSkill();}
  function renderStory(){const beat=STORY[storyIndex],character=beat.portrait==='PLAYER'?state.player:[...PLAYERS,...AI].find(x=>x.id===beat.portrait);els.storyName.textContent=beat.speaker==='PLAYER'?state.player.name:beat.speaker;els.storyRole.textContent=beat.role;els.storyText.textContent=beat.text;els.storyProgress.textContent=`${storyIndex+1} / ${STORY.length}`;els.storyPortrait.innerHTML=portraitMarkup(character,'smug');els.storyPortrait.style.setProperty('--story-color',character.color||'#d1aa61');els.nextStoryBtn.textContent=storyIndex===STORY.length-1?'入席开局　›':'继续　›';}
  function closeStory(){els.storyLayer.classList.add('hidden');tone('good');}
  function openStory(){storyIndex=0;els.storyLayer.classList.remove('hidden');renderStory();}
  function nextStory(){if(storyIndex>=STORY.length-1)return closeStory();storyIndex++;renderStory();tone();}
  function startGame(){save.selected=selectedPlayer;persist();state=freshState();showOnly(els.battleScreen);document.body.classList.toggle('reduced-motion',save.reducedMotion);els.log.innerHTML='';els.claimSelect.innerHTML=CARDS.filter(c=>!c.wild).map(c=>`<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('');[...els.performanceButtons.children].forEach(b=>b.classList.toggle('active',b.dataset.performance==='calm'));log('🐦‍⬛ 乌鸦老板：撑过八局，放倒整桌，第一杯算我的。');beginRound();openStory();}
  function openSettings(){els.settingSoundBtn.textContent=save.sound?'🔊 已开启':'🔇 已关闭';els.motionBtn.textContent=save.reducedMotion?'🌙 精简':'✨ 完整';els.careerStats.innerHTML=`<b>酒馆生涯</b><span>入局 ${save.games} 次</span><span>胜利 ${save.wins} 次</span><span>最高金币 ${save.bestCoins}</span><span>累计谎言 ${save.lies}</span>`;els.achievementGrid.innerHTML=ACHIEVEMENTS.map(a=>`<div class="achievement ${save.achievements.includes(a.id)?'earned':'locked'}"><span>${save.achievements.includes(a.id)?a.icon:'🔒'}</span><b>${a.name}</b></div>`).join('');if(!els.settingsDialog.open)openDialog(els.settingsDialog);}
  function openCodex(){els.codexGrid.innerHTML=PLAYERS.map(p=>`<article style="--hero-color:${p.color}"><div class="codex-portrait">${portraitMarkup(p,'smug')}</div><div><small>${p.title}</small><h3>${p.name}</h3><span class="personality-tags">${p.tags.map(tag=>`<i>${tag}</i>`).join('')}</span><b>✦ ${p.skill}</b><p>${p.desc}</p><q>${p.quote}</q></div></article>`).join('');openDialog(els.codexDialog);}
  function openCollection(){els.collectionGrid.innerHTML=CARDS.map(card=>{return `<article class="collection-card card-${card.id}" data-rarity="${card.rarity}"><small>${card.rarity}</small><span>${card.emoji}</span><b>${card.name}</b><p>${card.effect}</p></article>`;}).join('');openDialog(els.collectionDialog);}
  els.skipIntroBtn.onclick=endIntro;els.introVideo.addEventListener('ended',endIntro);els.introVideo.addEventListener('error',endIntro);els.startBtn.onclick=openSelection;els.rulesBtn.onclick=()=>openDialog(els.guideDialog);els.storyModeBtn.onclick=openSelection;els.trialBtn.onclick=openSelection;els.charactersBtn.onclick=openCodex;els.collectionBtn.onclick=openCollection;els.closeCodex.onclick=()=>closeDialog(els.codexDialog);els.closeCollection.onclick=()=>closeDialog(els.collectionDialog);els.settingsBtn.onclick=openSettings;els.battleSettingsBtn.onclick=openSettings;els.skipMotionBtn.onclick=()=>{state.skipMotion=true;toast('已跳过本局等待动画');motion('快速结算已开启。');};els.closeSettings.onclick=()=>closeDialog(els.settingsDialog);els.settingSoundBtn.onclick=()=>{save.sound=!save.sound;if(state)state.sound=save.sound;if(musicGain)musicGain.gain.value=save.sound ? .018 : 0;if(save.sound)startMusic();persist();openSettings();};els.motionBtn.onclick=()=>{save.reducedMotion=!save.reducedMotion;document.body.classList.toggle('reduced-motion',save.reducedMotion);persist();openSettings();};els.resetSaveBtn.onclick=()=>{save=defaultSave();persist();selectedPlayer=save.selected;openSettings();};els.closeGuide.onclick=()=>closeDialog(els.guideDialog);els.guideStartBtn.onclick=()=>{closeDialog(els.guideDialog);openSelection();};els.confirmCharacterBtn.onclick=startGame;els.nextStoryBtn.onclick=nextStory;els.skipStoryBtn.onclick=closeStory;els.backToMenuBtn.onclick=()=>showOnly(els.menuScreen);els.restartBtn.onclick=openSelection;els.endingMenuBtn.onclick=()=>showOnly(els.menuScreen);els.playBtn.onclick=playerPlay;els.trustBtn.onclick=()=>judge(false);els.challengeBtn.onclick=()=>judge(true);els.soundBtn.onclick=()=>{state.sound=!state.sound;save.sound=state.sound;if(musicGain)musicGain.gain.value=save.sound ? .018 : 0;if(save.sound)startMusic();persist();render();tone();};els.performanceButtons.onclick=e=>{const b=e.target.closest('[data-performance]');if(!b||state.phase!=='player')return;state.performance=b.dataset.performance;state.playerMood=b.dataset.performance==='taunt'||b.dataset.performance==='smug'?'smug':b.dataset.performance==='cute'?'thinking':'idle';motion(`${state.player.name}换上了「${b.textContent.trim()}」的表情。`);render();[...els.performanceButtons.children].forEach(x=>x.classList.toggle('active',x===b));tone();};
  els.menuScreen.addEventListener('click',event=>{if(event.target.closest?.('button')){startMusic();tone();}});
  document.addEventListener?.('pointerdown',startMusic,{once:true});document.addEventListener?.('keydown',startMusic,{once:true});
  if('serviceWorker' in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  playIntro();
  window.__BLACK_MOON__={CARDS,AI,PLAYERS,EVENTS,ACHIEVEMENTS,claimTrue,freshState,endIntro};
})();
