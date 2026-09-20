(() => {
  'use strict';
  const MENU_BUTTON_ASSETS = Object.freeze({
    START_GAME:'assets/menu-buttons/button-start-game.png',TUTORIAL:'assets/menu-buttons/button-tutorial.png',STORY_MODE:'assets/menu-buttons/button-story-mode.png',
    BLACK_MOON:'assets/menu-buttons/button-black-moon-trial.png',PET_GALLERY:'assets/menu-buttons/button-pet-gallery.png',SETTINGS:'assets/menu-buttons/button-settings.png'
  });
  const CARDS = [
    {id:'moon',name:'月亮',emoji:'🌙',mark:'月',rarity:'普通',effect:'最安静也最适合伪装的基础牌。'},
    {id:'wolf',name:'狼',emoji:'🐺',mark:'狼',rarity:'普通',effect:'铁牙更容易相信同类的气味。'},
    {id:'owl',name:'猫头鹰',emoji:'🦉',mark:'鸮',rarity:'普通',effect:'鸦策审视这张牌时会更加谨慎。'},
    {id:'hat',name:'礼帽',emoji:'🎩',mark:'帽',rarity:'普通',effect:'红尾喜欢藏在礼帽后的表情。'},
    {id:'cat',name:'黑猫',emoji:'🐈',mark:'猫',rarity:'普通',effect:'夜影使用时，演技带来的影响略微增强。'},
    {id:'bone',name:'黄金骨头',emoji:'🦴',mark:'骨',rarity:'普通',effect:'真话通过时额外获得 5 金币。'},
    {id:'mirror',name:'镜像牌',emoji:'🪞',mark:'镜',rarity:'罕见',effect:'复制宣称牌面，可以冒充任意牌。',wild:true},
    {id:'swap',name:'交换牌',emoji:'🔄',mark:'换',rarity:'罕见',effect:'盖下时交换紧张感，降低 12% 怀疑。'},
    {id:'peek',name:'偷看牌',emoji:'👁',mark:'窥',rarity:'罕见',effect:'提前观察对手反应，降低 18% 怀疑。'},
    {id:'wild',name:'小丑牌',emoji:'🤡',mark:'丑',rarity:'传说',effect:'可以冒充本次宣称的任意牌。',wild:true},
    {id:'blackout',name:'酒馆停电',emoji:'🍺',mark:'暗',rarity:'史诗',effect:'灯灭的一瞬间，对手怀疑降低 10%。'},
    {id:'chicken',name:'鸡腿大战',emoji:'🍗',mark:'腿',rarity:'史诗',effect:'鸡腿制造混乱，随机改变本局怀疑。'},
    {id:'bomb',name:'黑月炸弹',emoji:'💣',mark:'炸',rarity:'史诗',effect:'成功骗局额外让对手失去 1 点生命。'},
    {id:'contract',name:'黑月契约',emoji:'🌑',mark:'契',rarity:'传说',effect:'本局奖励翻倍，但骗局失败会额外受伤。'},
    {id:'dice',name:'命运骰子',emoji:'🎲',mark:'命',rarity:'传说',effect:'让怀疑值随机偏移 -20% 至 +20%。'}
  ];
  const PLAYERS = [
    {id:'shadow',name:'夜影',emoji:'🐱',art:'assets/characters/transparent/cat.png',title:'黑猫酒保',rarity:'传奇',difficulty:4,personality:'灵活多变，擅长用冷静掩饰临场骗局。',tags:['冷静','机会主义','九命'],quote:'我不赌运气，我只赌你会犹豫。',skill:'猫的直觉',desc:'每局第一次受伤有 25% 概率闪避。',color:'#8f75d6',portrait:'assets/characters/transparent/cat.png'},
    {id:'fang',name:'铁牙',emoji:'🐶',art:'assets/characters/transparent/dog.png',title:'铁犬保镖',rarity:'精英',difficulty:3,personality:'强壮可靠却不擅长圆谎，适合正面反骗。',tags:['强壮','直率','压迫感'],quote:'我发誓……等等，发誓是不是骗人的开始？',skill:'反转之王',desc:'质疑成功时额外获得 5 金币。',color:'#a77745',portrait:'assets/characters/transparent/dog.png'},
    {id:'tail',name:'红尾',emoji:'🦊',art:'assets/characters/transparent/fox.png',title:'狐狸赌徒',rarity:'传奇',difficulty:4,personality:'优雅而危险，享受在高风险中操纵怀疑。',tags:['华丽','挑衅','高风险'],quote:'真相只是还没化妆的谎言。',skill:'狐假虎威',desc:'得意表演被怀疑的概率更低。',color:'#d66c3e',portrait:'assets/characters/transparent/fox.png'},
    {id:'snow',name:'雪球',emoji:'🐰',art:'assets/characters/transparent/rabbit.png',title:'危险贵族',rarity:'稀有',difficulty:2,personality:'用无辜和慌张隐藏真正意图，容错率较高。',tags:['无辜','慌张','危险'],quote:'我没有骗人，是鸡腿教我的。',skill:'纯洁眼神',desc:'无辜表演被怀疑的概率更低。',color:'#9fc9d6',portrait:'assets/characters/transparent/rabbit.png'}
  ];
  const AI = [
    {id:'fang',name:'铁牙',emoji:'🐺',art:'assets/characters/transparent/dog.png',portrait:'assets/characters/transparent/dog.png',color:'#a77745',title:'直觉派保镖',personality:'强硬直率',skill:'猎犬嗅觉',trust:45,maxHp:3,hp:3,lie:0.28,doubt:0.38,judgeMode:'impulsive',
      hello:'我闻得出谎话。除了我自己的。', tells:['爪子在桌下数拍子','认真闻了闻牌背','露出一颗很诚实的牙'],
      claims:['凭我的狗格担保。','骨头作证，我没撒谎！','看我真诚的鼻子。']},
    {id:'tail',name:'红尾',emoji:'🦊',title:'华丽诈术师',personality:'狡黠冒险',skill:'双重骗局',trust:34,maxHp:3,hp:3,lie:0.76,doubt:0.64,judgeMode:'probability',
      art:'assets/characters/transparent/fox.png',portrait:'assets/characters/transparent/fox.png',color:'#d66c3e',
      hello:'亲爱的，真相只是没化妆的谎言。',tells:['尾巴优雅地绕了两圈','笑容比牌面还闪亮','故意眨了左眼'],
      claims:['聪明人都该相信我。','这可是贵族级的真话。','不信？那正合我意。']},
    {id:'snow',name:'雪球',emoji:'🐰',title:'惊慌演技派',personality:'紧张敏感',skill:'无辜眼神',trust:68,maxHp:3,hp:3,lie:0.48,doubt:0.50,judgeMode:'random',
      art:'assets/characters/transparent/rabbit.png',portrait:'assets/characters/transparent/rabbit.png',color:'#9fc9d6',
      hello:'我、我只是来吃免费胡萝卜的！',tells:['长耳朵突然打了个结','紧张地啃空气','抱紧了会说话的鸡腿'],
      claims:['绝对是真的……吧？','兔子从来不骗猫！','鸡腿说它们都一样。']},
    {id:'hoot',name:'墨镜教授',emoji:'🦉',title:'概率学骗子',hp:2,lie:0.28,doubt:0.76,
      hello:'根据计算，你撒谎的概率很可爱。',tells:['眼镜反射出一串数字','把羽毛笔咬反了','严肃地推了推不存在的眼镜'],
      claims:['统计学不会说谎，我会。','置信度高达九成。','请尊重专业意见。']},
    {id:'pocket',name:'口袋',emoji:'🦝',title:'垃圾桶怪盗',hp:2,lie:0.82,doubt:0.43,
      hello:'不是我偷的，我只是替它保管。',tells:['口袋里传来勺子碰撞声','两只黑眼圈同时眨眼','悄悄把证据塞进尾巴'],
      claims:['刚从桌底捡的，保真！','骗你是小浣熊。','这牌自己跑进我口袋的。']},
    {id:'crow',name:'鸮策',emoji:'🦉',title:'黑月酒馆老板',personality:'冷静审慎',skill:'洞察谎言',trust:25,maxHp:3,hp:3,lie:0.64,doubt:0.78,judgeMode:'analysis',art:'assets/characters/transparent/owl.png',portrait:'assets/characters/transparent/owl.png',color:'#d1aa61',
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
  const els = Object.fromEntries(['introCinematic','introVideo','skipIntroBtn','menuScreen','selectScreen','battleScreen','endingScreen','startBtn','restartBtn','rulesBtn','storyModeBtn','trialBtn','charactersBtn','collectionBtn','settingsBtn','characterGrid','selectedSkill','confirmCharacterBtn','backToMenuBtn','guideDialog','closeGuide','guideStartBtn','settingsDialog','closeSettings','settingSoundBtn','motionBtn','careerStats','achievementGrid','resetSaveBtn','codexDialog','closeCodex','codexGrid','collectionDialog','closeCollection','collectionGrid','battleSettingsBtn','skipMotionBtn','opponents','roundLabel','progressBar','coinsLabel','streakLabel','turnCallout','soundBtn','tensionMeter','suspicionBar','suspicionLabel','eventBanner','enemySpeech','table','tableFx','centerCard','resultText','playerHp','playerAvatar','playerName','playerTitle','selectionHint','hand','claimSelect','performanceButtons','playBtn','trustBtn','challengeBtn','useItemBtn','itemButtons','log','motionLog','endingIcon','endingTitle','endingText','scoreCard','endingBreakdown','unlockPanel','endingMenuBtn','toast','storyLayer','storyPortrait','storyRole','storyName','storyText','storyProgress','skipStoryBtn','nextStoryBtn','penaltyDialog','penaltyTitle','penaltyText','penaltyChoices','penaltyStage','penaltyProp','penaltyActor','penaltyResult'].map(id=>[id,$(id)]));
  const SAVE_KEY='blackMoonTavern.v2';
  const defaultSave=()=>({games:0,wins:0,bestCoins:0,lies:0,achievements:[],sound:true,reducedMotion:false,selected:'shadow'});
  let state, toastTimer, speechTimer, audio, musicGain, musicStarted=false, storyIndex=0, save=loadSave(), selectedPlayer=save.selected;
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
  const heartMarkup=(value,max)=>Array.from({length:max},(_,index)=>`<i class="heart-icon ${index<value?'full':'empty'}" aria-hidden="true"></i>`).join('');
  const EXPRESSIONS={idle:'待机',confident:'自信',thinking:'思考',suspicious:'怀疑',shocked:'震惊',dejected:'输牌沮丧',triumphant:'骗成功得意',sly:'狡猾笑',nervous:'紧张',embarrassed:'被揭穿尴尬',angry:'愤怒',mocking:'嘲笑',defiant:'输了嘴硬',scared:'害怕',lucky:'幸运开心',cute:'卖萌',insight:'看穿一切',surprised:'失败惊讶',smug:'挑衅',hurt:'受伤',win:'胜利'};
  const EMOTION_MARKS={idle:'◆',confident:'✦',thinking:'…',suspicious:'?',shocked:'!!',dejected:'☂',triumphant:'★',sly:'♠',nervous:'汗',embarrassed:'…',angry:'怒',mocking:'哈',defiant:'哼',scared:'!',lucky:'♣',cute:'♡',insight:'◎',surprised:'?!',smug:'!',hurt:'×',win:'★'};
  const CHARACTER_EMOTIONS={shadow:{idle:'confident',observe:'confident',play:'confident',bluff:'triumphant',suspect:'suspicious',fooled:'shocked',discover:'confident',lose:'dejected',fail:'shocked',collapse:'dejected',penalty:'shocked',win:'triumphant'},tail:{idle:'sly',observe:'sly',play:'sly',bluff:'sly',suspect:'nervous',fooled:'shocked',discover:'sly',lose:'embarrassed',fail:'embarrassed',collapse:'embarrassed',penalty:'embarrassed',win:'sly'},fang:{idle:'confident',observe:'confident',play:'angry',bluff:'mocking',suspect:'angry',fooled:'shocked',discover:'angry',lose:'defiant',fail:'defiant',collapse:'defiant',penalty:'defiant',win:'mocking'},snow:{idle:'cute',observe:'cute',play:'nervous',bluff:'scared',suspect:'scared',fooled:'scared',discover:'lucky',lose:'scared',fail:'scared',collapse:'scared',penalty:'cute',win:'lucky'},crow:{idle:'thinking',observe:'thinking',play:'thinking',bluff:'insight',suspect:'insight',fooled:'surprised',discover:'insight',lose:'surprised',fail:'surprised',collapse:'surprised',penalty:'surprised',win:'insight'}};
  const FAILURE_LINES={tail:'我只是故意输给你的。',fang:'下一次我一定相信你……才怪。',snow:'这一定是骰子的问题。',crow:'根据计算，这次失败概率为100%。',shadow:'刚才那局不算，我的胡须挡住牌了。'};
  const REACTION_LINES={shadow:{observe:['我在听。','继续。'],play:['看我的。','月光作证。'],bluff:['别眨眼。','真相很安静。'],suspect:['有意思。','你在试探我？'],fooled:['居然漏看了。'],discover:['破绽。','到此为止。'],win:['上钩了。','承让。'],collapse:['只是手滑。'],penalty:['帽子歪了。']},tail:{observe:['请继续演。'],play:['当然是真的。'],bluff:['亲爱的，当然。','你会相信的。'],suspect:['你真的觉得我会上当？','演得还不够。'],fooled:['这不可能！'],discover:['抓到你了。'],win:['真乖。','掌声呢？'],collapse:['我是故意的。'],penalty:['这不优雅。']},fang:{observe:['快点出牌。'],play:['看好了。'],bluff:['凭狗格担保！'],suspect:['等等……这牌不对！','我才不信。'],fooled:['你骗狗？！'],discover:['果然有鬼！'],win:['哈！','鼻子不会错。'],collapse:['不算！再来！'],penalty:['谁动了椅子？']},snow:{observe:['我只是看看哦。'],play:['给、给你。'],bluff:['相信我嘛~','很安全哦。'],suspect:['我只是随便猜一下哦~','等等……'],fooled:['欸？！'],discover:['被我猜到啦。'],win:['好耶！','可爱也是实力。'],collapse:['骰子欺负我！'],penalty:['耳朵先投降啦。']},crow:{observe:['正在计算。'],play:['请判断。'],bluff:['概率正常。'],suspect:['你的眼神已经暴露你了。','概率不对。'],fooled:['样本异常。'],discover:['结论成立。'],win:['如我所料。','误差为零。'],collapse:['需要重算。'],penalty:['公式在冒烟。']}};
  const emotionFor=(character,event)=>CHARACTER_EMOTIONS[character?.id]?.[event]||event||'idle';
  function portraitMarkup(character,mood='idle'){
    const source=character.art||character.portrait;const image=source?`<img src="${source}" alt="${character.name}头像" loading="eager" style="opacity:1">`:`<span class="portrait-fallback">${character.emoji}</span>`;
    const ears=['tail','snow'].includes(character.id)?'<i class="ear-twitch ear-left" aria-hidden="true"></i><i class="ear-twitch ear-right" aria-hidden="true"></i>':'';
    return `<span class="portrait-motion">${image}<i class="blink-lid" aria-hidden="true"></i>${ears}</span><i class="expression-mark" title="${EXPRESSIONS[mood]||'冷静'}">${EMOTION_MARKS[mood]||'◆'}</i>`;
  }

  function scheduleBattleBlink(){
    setTimeout(()=>{
      const portraits=[...els.battleScreen.querySelectorAll('.avatar, #playerAvatar')].filter(node=>!node.closest?.('.out'));
      const portrait=portraits[Math.floor(Math.random()*portraits.length)];
      if(portrait&&!els.battleScreen.classList.contains('hidden')&&!save.reducedMotion){
        portrait.classList.add('is-blinking');
        setTimeout(()=>portrait.classList.remove('is-blinking'),150);
      }
      scheduleBattleBlink();
    },2800+Math.random()*4200);
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
    playSfx('card_play');
    const a=from.getBoundingClientRect(),b=els.centerCard.getBoundingClientRect(),sx=a.left+a.width/2,sy=a.top+a.height/2,tx=b.left+b.width/2,ty=b.top+b.height/2,clone=document.createElement('div');clone.className=`flying-card${reverse?' reverse':''}`;clone.textContent='☾';clone.style.cssText=`--sx:${sx}px;--sy:${sy}px;--mx:${(sx+tx)/2}px;--my:${(sy+ty)/2}px;--tx:${tx}px;--ty:${ty}px`;els.table.classList.add('card-in-flight');document.body.append(clone);delay(()=>{clone.remove();els.table.classList.remove('card-in-flight');},720);
  }
  function actionMotion(kind){els.battleScreen.dataset.action=kind;delay(()=>{if(els.battleScreen.dataset.action===kind)delete els.battleScreen.dataset.action;},560);}
  function cameraEffect(kind,target='table'){
    const targetKey=`camera${kind[0].toUpperCase()}${kind.slice(1)}Target`;els.battleScreen.dataset[targetKey]=target;els.battleScreen.classList.remove(`camera-${kind}`);void els.battleScreen.offsetWidth;els.battleScreen.classList.add(`camera-${kind}`);
    delay(()=>{els.battleScreen.classList.remove(`camera-${kind}`);delete els.battleScreen.dataset[targetKey];},kind==='reveal'?620:850);
  }
  function cueReaction(character,event){
    const lines=REACTION_LINES[character.id]?.[event],line=Array.isArray(lines)?rand(lines):lines;if(!line)return;
    const mood=emotionFor(character,event);
    if(character===state.player){state.playerMood=mood;state.playerReaction=event;state.playerQuip=line;}else{character.mood=mood;character.reaction=event;character.quip=line;}
    render();delay(()=>{if(character===state.player){state.playerReaction=null;state.playerQuip='';}else{character.reaction=null;character.quip='';}render();},1150);
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
  }
  function freshState(){const rivals=AI.filter(ai=>['fang','tail','snow'].includes(ai.id)).map(x=>({...x,mood:'idle',reaction:null,quip:'',lastSpeech:'',isSpeaking:false,hand:Array.from({length:5},()=>rand(CARDS))}));return {player:PLAYERS.find(p=>p.id===selectedPlayer)||PLAYERS[0],playerMood:'idle',playerReaction:null,playerQuip:'',playerHp:4,playerTrust:50,rivals,active:0,round:1,maxRounds:8,coins:0,streak:0,suspicion:null,skipMotion:false,hand:[],selected:[],performance:'calm',phase:'player',move:null,lieHistory:[],items:Object.fromEntries(ITEMS.map(x=>[x.id,true])),penalties:{roulette:false,liar:false,accept:false},pendingPenalty:false,penaltyContinue:null,forceTrust:false,boss:false,bossDefeated:false,sound:save.sound,activeEvent:null,dodged:false,honeyUsed:false,roundHistory:[],roundStage:'player',aiQueue:[],aiTurnIndex:-1,gameOver:false};}
  function tone(kind='tap'){
    if(!(state?.sound??save.sound)) return;
    try{audio ||= new (window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.type=kind==='bad'?'sawtooth':'triangle';o.frequency.value={tap:260,good:520,bad:110}[kind];g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.16);o.start();o.stop(audio.currentTime+.17);}catch(_){/* 音效接口在不支持 Web Audio 时静默降级 */}
  }
  function playSfx(name){
    if(!(state?.sound??save.sound))return;
    const preset={button_click:[240,.055,.1,'triangle'],card_hover:[420,.018,.055,'sine'],card_flip:[690,.04,.12,'triangle'],card_play:[330,.045,.15,'triangle'],trust:[540,.05,.2,'sine'],doubt:[125,.055,.18,'sawtooth'],triumph:[760,.06,.32,'triangle'],comic:[92,.06,.3,'square']}[name];
    if(!preset)return;
    try{audio ||= new (window.AudioContext||window.webkitAudioContext)();const [frequency,volume,duration,type]=preset,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(frequency,audio.currentTime);if(name==='card_flip')o.frequency.exponentialRampToValueAtTime(920,audio.currentTime+duration);g.gain.setValueAtTime(volume,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}catch(_){/* 占位音效接口在无 Web Audio 环境静默降级 */}
  }
  function fadeVideoIn(){
    let step=0;const timer=setInterval(()=>{step++;els.introVideo.volume=Math.min(.55,.04+step*.035);if(step>=15)clearInterval(timer);},80);
  }
  function startMusic(){
    if(!save.sound)return;
    try{
      audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume?.();if(musicStarted)return;musicGain=audio.createGain();musicGain.gain.setValueAtTime(.0001,audio.currentTime);musicGain.gain.exponentialRampToValueAtTime(.018,audio.currentTime+2.8);musicGain.connect(audio.destination);
      [110,164.81,220].forEach((frequency,index)=>{const oscillator=audio.createOscillator(),level=audio.createGain();oscillator.type=index===0?'sine':'triangle';oscillator.frequency.value=frequency;level.gain.value=index===0?.34:.12;oscillator.connect(level);level.connect(musicGain);oscillator.start();});musicStarted=true;
    }catch(_){/* 浏览器禁用 Web Audio 时保留无音乐玩法 */}
  }
  function say(name,text){
    els.enemySpeech.innerHTML='';
    const speakerIndex=state?.rivals?.findIndex(rival=>rival.name===name)??-1;
    const speaker=state?.rivals?.[speakerIndex];state?.rivals?.forEach(rival=>{rival.isSpeaking=rival===speaker;});if(speaker)speaker.lastSpeech=text;
    els.enemySpeech.dataset.speaker=String(Math.max(0,speakerIndex));
    els.battleScreen.dataset.speaker=String(Math.max(0,speakerIndex));
    const b=document.createElement('b'),s=document.createElement('span');
    b.textContent=name;s.textContent=text;els.enemySpeech.append(b,s);[...els.opponents.children].forEach((node,index)=>{const dialogue=node.querySelector?.('.opponent-dialogue');if(!dialogue)return;dialogue.classList.toggle('is-visible',index===speakerIndex);dialogue.setAttribute('aria-hidden',String(index!==speakerIndex));if(index===speakerIndex)dialogue.textContent=text;});clearTimeout(speechTimer);speechTimer=setTimeout(()=>{if(speaker){speaker.isSpeaking=false;render();}},3200);
    els.enemySpeech.style.setProperty('--speech-chars',Math.max(8,[...text].length));
    els.enemySpeech.style.setProperty('--speech-duration',`${({fang:.9,tail:.62,snow:1.08,crow:.76}[speaker?.id]||.82)}s`);
    els.enemySpeech.classList.remove('speech-typing');
    void els.enemySpeech.offsetWidth;
    els.enemySpeech.classList.add('speech-typing');
  }
  function decisionEffect(kind){
    playSfx(kind==='trust'?'trust':'doubt');
    els.battleScreen.dataset.decision=kind;
    const effect=document.createElement('div');effect.className=`decision-fx ${kind}`;
    effect.innerHTML=kind==='trust'?Array.from({length:5},(_,i)=>`<i style="--i:${i};--x:${(i-2)*18}px">♥</i>`).join(''):'<b>!</b>';
    els.tableFx.append(effect);delay(()=>{effect.remove();delete els.battleScreen.dataset.decision;},620);
  }
  function floatingFeedback(anchor,text,kind='good'){
    if(!anchor)return;const node=document.createElement('i');node.className=`hud-delta ${kind}`;node.textContent=text;anchor.append(node);delay(()=>node.remove(),900);
  }
  function failureReaction(character,event='fail'){
    character.mood=emotionFor(character,event);say(character.name,FAILURE_LINES[character.id]||'这局一定是月亮偷偷换了牌。');
    const index=state.rivals.indexOf(character),anchor=index>=0?els.opponents.children[index]:els.battleScreen.querySelector('.player-strip');
    floatingFeedback(anchor,EXPRESSIONS[character.mood],'reaction');
  }
  function log(text){const p=document.createElement('p');p.textContent=text;els.log.prepend(p);}
  function toast(text){clearTimeout(toastTimer);els.toast.textContent=text;els.toast.classList.add('show');toastTimer=setTimeout(()=>els.toast.classList.remove('show'),1600);}
  function animate(outcome){els.table.classList.remove('shake','win');void els.table.offsetWidth;els.table.classList.add(outcome==='good'?'win':'shake');tone(outcome);}
  function aiChallengeChance(ai,{cardCount=1,claim='moon',recentLies=0,performance='calm'}={}){
    const base=ai.doubt??.5,claimPressure=claim==='wild'?0:.03*(cardCount-1),historyPressure=Math.min(.16,recentLies*.05),performanceRead={calm:-.08,cute:-.04,smug:.05,taunt:.12}[performance]||0;
    if(ai.judgeMode==='impulsive')return clamp(base+(Math.random()<.28?.24:-.1)+performanceRead,.08,.9);
    if(ai.judgeMode==='probability')return clamp(base+claimPressure+historyPressure+performanceRead,.12,.9);
    if(ai.judgeMode==='random')return clamp(.18+Math.random()*.64,.08,.9);
    if(ai.judgeMode==='analysis')return clamp(base+claimPressure*1.5+historyPressure*1.35+performanceRead*.7,.18,.95);
    return clamp(base,.08,.92);
  }
  function drawHand(){state.hand=Array.from({length:5},()=>rand(CARDS));state.selected=[];renderHand();}
  function renderHand(){els.hand.innerHTML='';const limit=state.activeEvent?.maxCards||3;state.hand.forEach((card,i)=>{const b=document.createElement('button');b.dataset.cardIndex=i;b.className=`card-btn card-${card.id}${state.selected.includes(i)?' selected':''}`;b.disabled=state.phase!=='player';b.setAttribute('aria-pressed',state.selected.includes(i));b.innerHTML=`<span class="card-art" aria-hidden="true"></span><span class="gold-frame" aria-hidden="true"></span><span class="corner">${card.mark}</span><span class="card-rarity">${card.rarity}</span><span class="card-suit">BLACK MOON</span><span class="card-sigil" aria-hidden="true"></span><span class="emoji">${card.emoji}</span><span class="name">${card.name}</span><span class="select-sparks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>`;b.onmouseenter=()=>playSfx('card_hover');b.onclick=()=>{const at=state.selected.indexOf(i);if(at>=0)state.selected.splice(at,1);else if(state.selected.length<limit)state.selected.push(i);else return toast(`本局最多盖 ${limit} 张！`);state.playerMood=state.selected.length?'thinking':'idle';motion(state.selected.length?`${state.player.name}挑起牌角，观察全桌视线。`:`${state.player.name}把牌放回手中。`);tone();renderHand();render();};els.hand.append(b);});els.selectionHint.textContent=state.selected.length?`已选 ${state.selected.length} 张`:`选择 1–${limit} 张`;}
  function renderOpponents(){els.opponents.innerHTML='';state.rivals.forEach((ai,i)=>{const div=document.createElement('div');div.className=`opponent character-${ai.id} mood-${ai.mood}${ai.reaction?` reaction-${ai.reaction}`:''}${i===state.active&&ai.hp>0?' active':''}${ai.hp<=0?' out':''}`;div.style.setProperty('--hero-color',ai.color||'#a47b56');const status=ai.hp<=0?'离桌':i===state.active?EXPRESSIONS[ai.mood]:'旁观',trust=clamp(ai.trust??Math.round((1-ai.doubt)*100),0,100);div.innerHTML=`<span class="avatar">${portraitMarkup(ai,ai.mood)}${ai.quip?`<q class="reaction-bubble">${ai.quip}</q>`:''}</span><span class="ai-hand-backs" aria-label="${ai.name}有${ai.hand?.length||0}张隐藏手牌">${(ai.hand||[]).slice(0,5).map(()=>'<i></i>').join('')}</span><div class="opponent-info"><strong class="opponent-name">${ai.name}</strong><q class="opponent-dialogue${ai.isSpeaking?' is-visible':''}" aria-hidden="${!ai.isSpeaking}">${ai.isSpeaking?ai.lastSpeech:''}</q><span class="opponent-hearts hp" aria-label="${Math.max(0,ai.hp)} 点生命">${heartMarkup(Math.max(0,ai.hp),ai.maxHp||3)}</span><small class="opponent-trust">可信度：${trust}%</small><span class="pet-status" aria-label="当前状态：${status}">${status}</span></div>`;els.opponents.append(div);});}
  function renderItems(){els.itemButtons.innerHTML='';ITEMS.forEach(item=>{const available=state.items[item.id],b=document.createElement('button');b.className=`item-${item.id}`;b.disabled=!available||state.phase==='resolving';b.title=item.desc;b.innerHTML=`<b class="item-icon" aria-hidden="true"></b><span>${item.name}</span><small>x${available?1:0}</small>`;b.onclick=()=>useItem(item.id);els.itemButtons.append(b);});}
  function render(){renderOpponents();els.playerHp.innerHTML=heartMarkup(Math.max(0,state.playerHp),4);els.playerHp.setAttribute('aria-label',`${Math.max(0,state.playerHp)} 点生命，信任 ${state.playerTrust}`);els.playerAvatar.innerHTML=`${portraitMarkup(state.player,state.playerMood)}${state.playerQuip?`<q class="reaction-bubble">${state.playerQuip}</q>`:''}`;els.playerAvatar.className=`character-${state.player.id} mood-${state.playerMood}${state.playerReaction?` reaction-${state.playerReaction}`:''}`;els.playerName.textContent=state.player.name;els.playerTitle.textContent=`${state.player.title} · 信任 ${state.playerTrust} · ${EXPRESSIONS[state.playerMood]}`;els.playerAvatar.style.setProperty('--hero-color',state.player.color);els.roundLabel.textContent=state.boss?'终局 BOSS':`第 ${Math.min(state.round,state.maxRounds)} / ${state.maxRounds} 局`;els.progressBar.style.width=`${state.boss?100:Math.min(100,state.round,state.maxRounds)/state.maxRounds*100}%`;els.coinsLabel.innerHTML=`<i class="coin-icon" aria-hidden="true"></i><span>${state.coins}</span>`;els.streakLabel.textContent=`🔥 ${state.streak}`;els.streakLabel.classList.toggle('hot',state.streak>=3);els.turnCallout.textContent=state.boss?'黑月决战':state.phase==='judge'?`判断 ${activeAI()?.name||'对手'}`:state.phase==='ai-thinking'?`${activeAI()?.name||'AI'} 思考中…`:state.phase==='player'?'你的回合':'揭晓中';els.suspicionBar.style.width=`${state.suspicion===null?0:Math.round(state.suspicion*100)}%`;els.suspicionLabel.textContent=state.suspicion===null?'尚未出牌':state.suspicion<.35?'放松':state.suspicion<.65?'留意':'高度警觉';els.tensionMeter.classList.toggle('danger-zone',state.suspicion>=.65);els.soundBtn.textContent=state.sound?'🔊':'🔇';els.battleScreen.querySelectorAll?.('.round-progress-step').forEach(step=>step.classList.toggle('active',state.round>=Number(step.dataset.round)));renderItems();}
  function setPhase(phase){state.phase=phase;const judge=phase==='judge';els.playBtn.classList.toggle('hidden',judge);els.trustBtn.classList.toggle('hidden',!judge);els.challengeBtn.classList.toggle('hidden',!judge);els.playBtn.disabled=phase!=='player';els.claimSelect.disabled=phase!=='player';[...els.performanceButtons.children].forEach(b=>b.disabled=phase!=='player');renderHand();renderItems();}
  function reveal(card){cameraEffect('reveal');els.centerCard.classList.remove('flip');delete els.centerCard.dataset.card;delete els.centerCard.dataset.count;els.centerCard.innerHTML='<span>☾</span>';const flip=()=>requestAnimationFrame(()=>{els.centerCard.dataset.card=card.id;playSfx('card_flip');els.centerCard.classList.add('flip');els.centerCard.innerHTML=`<span>${card.emoji}</span>`;});els.table.classList.contains('card-in-flight')?delay(flip,520):flip();}
  function nextLiving(from=state.active){for(let n=1;n<=state.rivals.length;n++){const i=(from+n)%state.rivals.length;if(state.rivals[i].hp>0)return i;}return -1;}
  function startBoss(){const boss=AI.find(ai=>ai.id==='crow');state.boss=true;state.round=state.maxRounds+1;state.rivals=[{...boss,hp:4,maxHp:4,doubt:.8,lie:.72,mood:'thinking',lastSpeech:'',isSpeaking:false,hand:Array.from({length:5},()=>rand(CARDS)),title:'终局 Boss · 黑月老板'}];state.active=0;state.activeEvent={id:'boss',emoji:'🌑',name:'老板亲自下场',text:'鸦策每次判断都更敏锐；击败他才能带走奖赏。',suspicion:.08};tableEffect('BOSS 入 席','bad');log('🌑 八局钟声敲响。鸦策锁上酒馆大门，亲自坐到了牌桌前。');beginRound();}
  function beginRound(){if(state.playerHp<=0)return finishGame();if(state.boss&&activeAI()?.hp<=0){state.bossDefeated=true;state.penalties={roulette:false,liar:false,accept:false};return finishGame();}if(!state.boss&&state.round>state.maxRounds)return startBoss();if(!state.boss&&state.rivals.every(a=>a.hp<=0)){state.active=state.round%state.rivals.length;state.rivals[state.active].hp=1;log(`🎭 ${state.rivals[state.active].name}被老板从桌底捞回，带着最后 1 心完成八局。`);}state.active=state.rivals[state.active].hp>0?state.active:nextLiving(state.active);state.rivals.forEach((a,i)=>{a.mood=emotionFor(a,i===state.active?'observe':'idle');a.reaction=i===state.active?'observe':null;a.quip='';});state.playerMood=emotionFor(state.player,'idle');state.roundStage='player';state.aiQueue=[];state.aiTurnIndex=-1;state.suspicion=null;state.forceTrust=false;state.move=null;state.activeEvent=state.boss?state.activeEvent:(state.round%2===0?rand(EVENTS):null);drawHand();els.centerCard.classList.remove('flip');delete els.centerCard.dataset.card;els.centerCard.innerHTML='<span>☾</span>';els.resultText.textContent=state.boss?'终局：挑战鸦策':`轮到${state.player.name}出牌`;say(activeAI().name,state.boss?'八局只是入场费。现在，让我看看你真正的谎言。':activeAI().hello);motion(state.boss?'黑月老板正在逐字审视你的声明。':`${activeAI().name}正在观察${state.player.name}的手牌。`);els.eventBanner.classList.toggle('hidden',!state.activeEvent);if(state.activeEvent){els.eventBanner.innerHTML=`<b>${state.activeEvent.emoji} ${state.activeEvent.name}</b><span>${state.activeEvent.text}</span>`;log(`🎲 特殊事件：${state.activeEvent.name}——${state.activeEvent.text}`);}setPhase('player');render();}
  function continueRound(){state.round++;delay(beginRound,700);}
  function startAISequence(){state.roundStage='ai';state.aiQueue=state.rivals.map((ai,index)=>ai.hp>0?index:-1).filter(index=>index>=0);state.aiTurnIndex=0;if(!state.aiQueue.length)return continueRound();state.active=state.aiQueue[0];setPhase('ai-thinking');render();motion(`${activeAI().name}思考中……`);delay(enemyTurn,520);}
  function advanceAISequence(){state.aiTurnIndex++;if(state.aiTurnIndex>=state.aiQueue.length)return continueRound();state.active=state.aiQueue[state.aiTurnIndex];setPhase('ai-thinking');render();motion(`${activeAI().name}思考中……`);delay(enemyTurn,520);}
  function showPenalty(){const available=Object.keys(state.penalties).filter(id=>!state.penalties[id]);if(!available.length){log('🌑 所有逃债手段都用光了，黑月只留下一阵尴尬的沉默。');const resume=state.penaltyContinue;state.penaltyContinue=null;return (resume||continueRound)();}setPhase('resolving');[...els.penaltyChoices.children].forEach(button=>{button.disabled=state.penalties[button.dataset.penalty];button.classList.toggle('used',button.disabled);});els.penaltyTitle.textContent=state.boss?'Boss 的黑月惩罚':'黑月正在讨债';document.body.classList.add('penalty-vignette');openDialog(els.penaltyDialog);}
  function playPenaltyAnimation(id,result){
    cueReaction(state.player,'penalty');playSfx('comic');
    els.penaltyStage.className=`penalty-stage penalty-${id}`;els.penaltyProp.innerHTML=`<span>${id==='roulette'?'🎡':id==='liar'?'🍷':'🪶'}</span>`;
    els.penaltyActor.innerHTML=portraitMarkup(state.player,id==='accept'?emotionFor(state.player,'fail'):emotionFor(state.player,id==='liar'?'bluff':'suspect'));
    els.penaltyResult.textContent=id==='roulette'?'命运轮盘疯狂加速……':id==='liar'?'黑月酒杯正在鉴定谎话……':'接受惩罚：尊严正在离家出走……';
    [...els.penaltyChoices.children].forEach(button=>button.disabled=true);
    delay(()=>{els.penaltyStage.classList.add('result-revealed');els.penaltyResult.textContent=result;},900);
    delay(()=>{closeDialog(els.penaltyDialog);document.body.classList.remove('penalty-vignette');els.penaltyStage.className='penalty-stage';render();const resume=state.penaltyContinue;state.penaltyContinue=null;(resume||continueRound)();},1900);
  }
  function resolvePenalty(id){if(!state.pendingPenalty||state.penalties[id])return;state.penalties[id]=true;state.pendingPenalty=false;let result='黑月满意地点了点头。';if(id==='roulette'){const lucky=Math.random()<.5;if(lucky&&state.playerHp<4){state.playerHp++;result='月光格！生命 +1，尊严也勉强 +0.5';log('🎡 轮盘停在月光格：找回 1 点生命。');toast('命运轮盘：+1❤️');}else{state.coins+=15;result='鸡毛格！尊严清零，金币 +15';log('🎡 轮盘停在鸡毛格：尊严没了，但捡到 15 金币。');toast('鸡毛安慰奖 +15');}}if(id==='liar'){state.nextBluffShield=true;result='酒杯没炸！下一回合怀疑 −20%';log('🍷 你完成骗子挑战：下一回合怀疑度 -20%，奖励减半。');}if(id==='accept'){state.coins+=10;result=`${FAILURE_LINES[state.player.id]}　安慰金币 +10`;log('😔 你礼貌接受惩罚，老板被成熟吓到并赔了 10 金币。');}render();playPenaltyAnimation(id,result);}
  function advance(){const next=state.roundStage==='player'?startAISequence:advanceAISequence;if(state.pendingPenalty){state.penaltyContinue=next;return showPenalty();}next();}
  function damage(target,reason){const rivalIndex=state.rivals.indexOf(target);target.hp!==undefined?target.hp--:state.playerHp--;if(target.hp!==undefined)target.mood=emotionFor(target,'lose');log(reason);render();floatingFeedback(rivalIndex>=0?els.opponents.children[rivalIndex]:els.battleScreen.querySelector('.player-strip'),'−1 心','bad');}
  function reward(amount){const contractBoost=state.currentCards?.some(c=>c.id==='contract')?2:1,challengeCut=state.nextBluffShield?.5:1,gained=Math.round(amount*(state.activeEvent?.coin||1)*contractBoost*challengeCut);state.coins+=gained;floatingFeedback(els.coinsLabel,`+${gained}`,'coin');}
  function cardReward(cards,kind){if(kind==='truth'&&cards.some(c=>c.id==='bone')){state.coins+=5;log('🦴 黄金骨头闪光：诚实奖金 +5。');}if(kind==='bluff'&&cards.some(c=>c.id==='bomb')){const ai=activeAI();ai.hp=Math.max(0,ai.hp-1);log('💣 黑月炸弹在笑声里炸开：对手额外失去 1 心！');}}
  function healFromHoney(){/* 第一版牌库不含治疗牌；保留结算钩子供后续遗物扩展。 */}
  function hurtPlayer(reason){if(state.player.id==='shadow'&&!state.dodged&&Math.random()<.25){state.dodged=true;state.playerMood='smug';log('🐾 猫的直觉发动：夜影贴着伤害滑走了！');toast('闪避！');return false;}state.playerHp--;state.playerTrust=clamp(state.playerTrust-8,0,100);state.streak=0;state.playerMood=emotionFor(state.player,'lose');state.pendingPenalty=state.playerHp>0;floatingFeedback(els.battleScreen.querySelector('.player-strip'),'−1 心 · 信任 −8','bad');log(reason);return true;}
  function playerPlay(){if(state.phase!=='player')return;if(!state.selected.length)return toast('先选至少 1 张牌');actionMotion('player-play');state.selected.forEach(i=>flyCard(els.hand.querySelector?.(`[data-card-index="${i}"]`)));const ai=activeAI(),cards=state.selected.map(i=>state.hand[i]),claim=els.claimSelect.value,truth=claimTrue(cards,claim);state.currentCards=cards;els.centerCard.dataset.count=String(cards.length);state.lieHistory.push(!truth);let suspicion=aiChallengeChance(ai,{cardCount:cards.length,claim,recentLies:state.lieHistory.slice(-3).filter(Boolean).length,performance:state.performance})+(state.activeEvent?.suspicion||0);if(cards.some(c=>c.id==='swap'))suspicion-=.12;if(cards.some(c=>c.id==='peek'))suspicion-=.18;if(cards.some(c=>c.id==='blackout'))suspicion-=.1;if(cards.some(c=>c.id==='chicken'))suspicion+=(Math.random()-.5)*.3;if(cards.some(c=>c.id==='dice'))suspicion+=(Math.random()-.5)*.4;if(state.nextBluffShield){suspicion-=.2;state.nextBluffShield=false;}if(state.player.id==='tail'&&state.performance==='smug')suspicion-=.15;if(state.player.id==='snow'&&state.performance==='cute')suspicion-=.15;if(state.player.id==='shadow'&&cards.some(c=>c.id==='cat'))suspicion-=.08;state.suspicion=clamp(suspicion,.08,.94);state.playerMood=emotionFor(state.player,truth?'play':'bluff');ai.mood=emotionFor(ai,state.suspicion>=.6?'suspect':'idle');cueReaction(state.player,truth?'play':'bluff');if(state.suspicion>=.6)cueReaction(ai,'suspect');setPhase('resolving');render();floatingFeedback(els.tensionMeter,`${Math.round(state.suspicion*100)}% 怀疑`,'doubt');motion(`${ai.name}的怀疑正在变化，视线锁定牌背。`);const challenge=!state.forceTrust&&Math.random()<state.suspicion;log(`${state.player.emoji} ${state.player.name}盖下 ${cards.length} 张，宣称全是「${cardBy(claim).name}」。`);if(challenge){ai.mood=emotionFor(ai,'suspect');cueReaction(state.player,'suspect');say(ai.name,rand(['你刚才眨眼了。抓现行！','这味道不对——开牌！','慢着！我的胡须在报警！']));reveal(cards.find(c=>!c.wild&&c.id!==claim)||cards[0]);if(truth){damage(ai,`✅ ${ai.name}质疑错了，撞上货真价实！ -1❤️`);cueReaction(ai,'collapse');cueReaction(state.player,'win');ai.trust=clamp((ai.trust??40)+8,0,100);state.playerTrust=clamp(state.playerTrust+5,0,100);reward(15);cardReward(cards,'truth');state.streak++;els.resultText.textContent='真话反杀！';tableEffect('反 将 一 军','good');animate('good');}else{cueReaction(ai,'discover');hurtPlayer(`💥 谎言露馅！${ai.name}笑到钻进桌底。${state.player.name} -1❤️`);if(cards.some(c=>c.id==='contract')){state.playerHp--;state.pendingPenalty=state.playerHp>0;log('🌑 黑月契约追债：额外失去 1 心。');}ai.trust=clamp((ai.trust??40)-10,0,100);els.resultText.textContent='大型社死现场';tableEffect('谎 言 破 裂','bad');cameraEffect('caught','player');cueReaction(state.player,'collapse');playSfx('comic');animate('bad');}advance();}else{say(ai.name,state.forceTrust?'好臭！我什么都信！':rand(['……这次放你过去。','我信，但我的尾巴不信。','听起来居然像真的。']));ai.trust=clamp((ai.trust??40)+(truth?4:-5),0,100);if(!truth){damage(ai,`😏 ${ai.name}吞下了整套谎言！ -1❤️`);cueReaction(ai,'fooled');reward(25);cardReward(cards,'bluff');state.streak++;state.playerMood=emotionFor(state.player,'win');els.resultText.textContent='骗术大成功！';motion(`${state.player.name}的谎言完美落桌。`);tableEffect('BLUFF 成 功','good');cameraEffect('success','player');cueReaction(state.player,'win');playSfx('triumph');animate('good');}else{reward(5);cardReward(cards,'truth');state.playerTrust=clamp(state.playerTrust+3,0,100);log(`😇 ${ai.name}相信了真话。安全，但不够坏。`);els.resultText.textContent='诚实得令人可疑';tone('tap');}delay(startAISequence,650);}render();}
  function enemyTurn(){
    state.currentCards=null;
    if(state.playerHp<=0||activeAI().hp<=0)return advance();
    const ai=activeAI(),wantsLie=Math.random()<ai.lie,claims=CARDS.filter(c=>!c.wild),claim=rand(claims).id;actionMotion('enemy-play');
    ai.mood=emotionFor(ai,wantsLie?'bluff':'play');state.playerMood=emotionFor(state.player,'suspect');cueReaction(ai,wantsLie?'bluff':'play');state.suspicion=null;flyCard(els.opponents.querySelector?.('.opponent.active .avatar'));motion(`${ai.name}把牌推向桌心，观察你的眼睛。`);
    let cards;
    if(wantsLie){cards=ai.hand.filter(card=>!card.wild&&card.id!==claim).slice(0,2);while(cards.length<2)cards.push(rand(CARDS));if(claimTrue(cards,claim))cards[0]=CARDS.find(card=>!card.wild&&card.id!==claim);}
    else{cards=ai.hand.filter(card=>card.wild||card.id===claim).slice(0,2);while(cards.length<2)cards.push(Math.random()<.2?cardBy('wild'):cardBy(claim));}
    cards.forEach(card=>{const index=ai.hand.indexOf(card);if(index>=0)ai.hand.splice(index,1);});while(ai.hand.length<5)ai.hand.push(rand(CARDS));
    const truth=claimTrue(cards,claim),reliableTell=Math.random()<(state.player.id==='crow'?.8:.68);
    const honestTell=rand(['呼吸平稳得像睡着了','牌放得干脆利落','目光没有躲闪']),lyingTell=rand(ai.tells);
    const tell=state.activeEvent?.fakeTell?rand([...ai.tells,'表情完美得毫无意义']):((truth===reliableTell)?honestTell:lyingTell);
    state.move={cards,claim,truth};els.centerCard.dataset.count=String(cards.length);say(ai.name,`${rand(ai.claims)} 两张「${cardBy(claim).name}」。（${tell}）`);
    els.resultText.textContent=`判断 ${ai.name} 的话`;els.centerCard.classList.remove('flip');els.centerCard.innerHTML='<span>☾</span>';
    log(`${ai.emoji} ${ai.name}宣称两张「${cardBy(claim).name}」。`);setPhase('judge');render();
  }
  function judge(challenge){if(state.phase!=='judge')return;setPhase('resolving');const ai=activeAI(),m=state.move;reveal(m.cards.find(c=>!c.wild&&c.id!==m.claim)||m.cards[0]);if(challenge&&!m.truth){damage(ai,`🕵️ 抓到了！${ai.name}的演技当场漏气。 -1❤️`);reward(state.player.id==='fang'?25:20);state.streak++;state.playerMood=emotionFor(state.player,'win');failureReaction(ai,'fail');healFromHoney();els.resultText.textContent='骗子现形！';motion(`${ai.name}被识破，表情管理彻底失控。`);tableEffect('识 破！','good');cameraEffect('caught','opponent');cueReaction(ai,'collapse');cueReaction(state.player,'discover');playSfx('triumph');animate('good');}else if(challenge&&m.truth){ai.mood=emotionFor(ai,'win');hurtPlayer(`😵 怀疑错了！${ai.name}难得诚实一次。${state.player.name} -1❤️`);els.resultText.textContent='疑心翻车';motion(`${ai.name}得意靠回椅背，你付出了怀疑的代价。`);tableEffect('判 断 失 误','bad');cameraEffect('success','opponent');cueReaction(ai,'win');cueReaction(state.player,'collapse');animate('bad');}else if(!challenge&&!m.truth){ai.mood=emotionFor(ai,'win');hurtPlayer(`🎪 你信了！${ai.name}笑得从椅子上滚下来。${state.player.name} -1❤️`);els.resultText.textContent='被骗得很有风度';motion(ai.id==='snow'?'雪球甜甜一笑，王冠后的危险终于显形。':`${ai.name}的骗局得手，紧张气氛炸开。`);tableEffect('BLUFF 得 手','bad');cameraEffect('success','opponent');cueReaction(ai,'win');cueReaction(state.player,'fooled');playSfx('comic');animate('bad');}else{reward(5);state.streak++;state.playerMood=emotionFor(state.player,'confident');healFromHoney();log(`😇 判断正确，${ai.name}这次没有搞事。`);els.resultText.textContent='眼光精准';motion('你没有被虚张声势带偏。');tone('good');}render();advance();}
  function useItem(id){if(!state.items[id])return;const ai=activeAI();if(id==='sock'){if(state.phase!=='player')return toast('要在自己出牌前扔袜子');state.forceTrust=true;say(ai.name,'呕——谁把地窖的空气做成武器了？！');toast('本次出牌，对手必定相信');}
    if(id==='hat'){if(state.phase!=='player'||!state.selected.length)return toast('先选一张要变的牌');state.hand[state.selected[0]]=cardBy('wild');renderHand();toast('帽子里钻出一张幻影牌！');}
    if(id==='leg'){if(state.phase!=='judge')return toast('等对手宣称后再问鸡腿');const clue=state.move.truth?(Math.random()<.75?'它闻起来很诚实。':'它滋滋地喊：可疑！'):(Math.random()<.75?'鸡腿尖叫：他在撒谎！':'它说：大概是真的？');toast(`🍗「${clue}」`);}
    state.items[id]=false;log(`${ITEMS.find(x=>x.id===id).emoji} 使用了「${ITEMS.find(x=>x.id===id).name}」！`);tone();renderItems();}
  function finishGame(){state.gameOver=true;els.battleScreen.classList.add('hidden');els.endingScreen.classList.remove('hidden');const won=state.bossDefeated,feedback={shadow:{win:'夜影擦亮酒杯：酒局归我，账单归你。',lose:'夜影躲进吧台：这是酒保的战术休息。'},fang:{win:'铁牙放下骨头：看吧，直觉也是一种证据。',lose:'铁牙挠挠耳朵：我只是战略性地相信错了。'},crow:{win:'鸦策合上笔记：每一步，都在计算之中。',lose:'鸦策拔下一根羽毛：显然是样本量不足。'},tail:{win:'红尾甩开大衣：掌声可以再狡猾一点。',lose:'红尾微笑退场：输牌，不等于输掉魅力。'},snow:{win:'雪球摘下王冠：可爱，才是最危险的武器。',lose:'雪球钻进餐巾：贵族从不承认这是逃跑。'}}[state.player.id];if(won){els.endingIcon.innerHTML=portraitMarkup(state.player,'win');els.endingTitle.textContent='击败鸦策 · 黑月酒桌的新传说';els.endingText.textContent=`${feedback.win} 三种黑月逃债手段已恢复。`;state.coins+=150;}else{els.endingIcon.innerHTML=portraitMarkup(state.player,'hurt');els.endingTitle.textContent=state.playerHp<=0?'今晚最大的受害者':'差一点就骗完了';els.endingText.textContent=feedback.lose;}els.endingScreen.classList.toggle('victory',won);els.endingScreen.classList.toggle('defeat',!won);save.games++;save.wins+=won?1:0;save.bestCoins=Math.max(save.bestCoins,state.coins);save.lies+=state.lieHistory.filter(Boolean).length;const before=new Set(save.achievements);ACHIEVEMENTS.forEach(a=>{if(a.test(save)&&!before.has(a.id))save.achievements.push(a.id);});persist();const unlocked=save.achievements.filter(id=>!before.has(id));els.unlockPanel.innerHTML=`${won?'<b>Boss 奖励</b><span>🌑 黑月徽记</span><span>🪙 终局奖金 +150</span>':''}${unlocked.length?`<b>新成就解锁</b>${unlocked.map(id=>{const a=ACHIEVEMENTS.find(x=>x.id===id);return `<span>${a.icon} ${a.name}</span>`;}).join('')}`:''}`;els.scoreCard.textContent=`${won?'Boss 通关奖励':'安慰奖金'} · 🪙 ${state.coins}　|　最高连胜 ${state.streak}`;els.endingBreakdown.innerHTML=`<span><b>${Math.min(state.round-1,state.maxRounds)}</b>完成回合</span><span><b>${state.lieHistory.filter(Boolean).length}</b>次谎言</span><span><b>${won?'已击败':'未击败'}</b>鸦策 Boss</span>`;tone(won?'good':'bad');}
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
  els.skipIntroBtn.onclick=()=>{startMusic();endIntro();};els.introVideo.addEventListener('ended',endIntro);els.introVideo.addEventListener('error',endIntro);els.startBtn.onclick=openSelection;els.rulesBtn.onclick=()=>openDialog(els.guideDialog);els.storyModeBtn.onclick=openSelection;els.trialBtn.onclick=openSelection;els.charactersBtn.onclick=openCodex;els.collectionBtn.onclick=openCollection;els.closeCodex.onclick=()=>closeDialog(els.codexDialog);els.closeCollection.onclick=()=>closeDialog(els.collectionDialog);els.settingsBtn.onclick=openSettings;els.battleSettingsBtn.onclick=openSettings;els.skipMotionBtn.onclick=()=>{state.skipMotion=true;toast('已跳过本局等待动画');motion('快速结算已开启。');};els.closeSettings.onclick=()=>closeDialog(els.settingsDialog);els.settingSoundBtn.onclick=()=>{save.sound=!save.sound;if(state)state.sound=save.sound;if(musicGain)musicGain.gain.value=save.sound ? .018 : 0;if(save.sound)startMusic();persist();openSettings();};els.motionBtn.onclick=()=>{save.reducedMotion=!save.reducedMotion;document.body.classList.toggle('reduced-motion',save.reducedMotion);persist();openSettings();};els.resetSaveBtn.onclick=()=>{save=defaultSave();persist();selectedPlayer=save.selected;openSettings();};els.closeGuide.onclick=()=>closeDialog(els.guideDialog);els.guideStartBtn.onclick=()=>{closeDialog(els.guideDialog);openSelection();};els.confirmCharacterBtn.onclick=startGame;els.nextStoryBtn.onclick=nextStory;els.skipStoryBtn.onclick=closeStory;els.backToMenuBtn.onclick=()=>showOnly(els.menuScreen);els.restartBtn.onclick=openSelection;els.endingMenuBtn.onclick=()=>showOnly(els.menuScreen);els.playBtn.onclick=playerPlay;els.trustBtn.onclick=()=>{decisionEffect('trust');judge(false);};els.challengeBtn.onclick=()=>{decisionEffect('challenge');judge(true);};els.soundBtn.onclick=()=>{state.sound=!state.sound;save.sound=state.sound;if(musicGain)musicGain.gain.value=save.sound ? .018 : 0;if(save.sound)startMusic();persist();render();tone();};els.performanceButtons.onclick=e=>{const b=e.target.closest('[data-performance]');if(!b||state.phase!=='player')return;state.performance=b.dataset.performance;state.playerMood=b.dataset.performance==='taunt'||b.dataset.performance==='smug'?'smug':b.dataset.performance==='cute'?'thinking':'idle';motion(`${state.player.name}换上了「${b.textContent.trim()}」的表情。`);render();[...els.performanceButtons.children].forEach(x=>x.classList.toggle('active',x===b));tone();};
  els.useItemBtn.onclick=()=>{els.itemButtons.querySelector('button:not(:disabled)')?.focus();toast('从右下角选择一件诡计道具');};
  els.penaltyChoices.onclick=event=>{const button=event.target.closest?.('[data-penalty]');if(button&&!button.disabled)resolvePenalty(button.dataset.penalty);};
  els.battleScreen.addEventListener('click',event=>{if(event.target.closest?.('button'))playSfx('button_click');});
  els.menuScreen.addEventListener('click',event=>{if(event.target.closest?.('.menu-button-image,button')){startMusic();tone();}});
  scheduleBattleBlink();
  if('serviceWorker' in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  playIntro();
  window.__BLACK_MOON__={CARDS,AI,PLAYERS,EVENTS,ACHIEVEMENTS,MENU_BUTTON_ASSETS,claimTrue,freshState,endIntro,debug:{getState:()=>state,startBoss,beginRound,startAISequence,advanceAISequence,advance,resolvePenalty,cueReaction,cameraEffect,aiChallengeChance}};
})();
