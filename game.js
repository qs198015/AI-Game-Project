(() => {
  const CARD_POOL = [
    { id: 'bone', name: '黄金骨头', emoji: '🍖' },
    { id: 'fish', name: '臭鱼', emoji: '🐟' },
    { id: 'cheese', name: '贵族奶酪', emoji: '🧀' },
    { id: 'wild', name: '幻影牌', emoji: '🃏', wild: true }
  ];

  const els = Object.fromEntries([
    'menuScreen','battleScreen','endingScreen','startBtn','restartBtn','hand','claimSelect',
    'performanceButtons','playBtn','skillBtn','trustBtn','challengeBtn','enemySpeech','enemyHp',
    'playerHp','roundLabel','coinsLabel','centerCard','resultText','log','endingIcon','endingTitle','endingText'
  ].map(id => [id, document.getElementById(id)]));

  let state;

  function freshState() {
    return {
      playerHp: 3,
      enemyHp: 3,
      round: 1,
      coins: 0,
      skillUses: 1,
      hand: [],
      selected: [],
      performance: 'calm',
      playerLieHistory: [],
      phase: 'player',
      enemyMove: null,
      gameOver: false
    };
  }

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function cardCounts(cards) {
    const counts = { bone: 0, fish: 0, cheese: 0, wild: 0 };
    cards.forEach(c => counts[c.id]++);
    return counts;
  }
  function isClaimTrue(cards, claimId) {
    const counts = cardCounts(cards);
    return counts[claimId] + counts.wild === cards.length;
  }
  function log(text) {
    const p = document.createElement('p');
    p.textContent = text;
    els.log.appendChild(p);
    els.log.scrollTop = els.log.scrollHeight;
  }
  function drawHand() {
    state.hand = Array.from({length: 5}, () => rand(CARD_POOL));
    state.selected = [];
    renderHand();
  }
  function renderHand() {
    els.hand.innerHTML = '';
    state.hand.forEach((card, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'card-btn' + (state.selected.includes(idx) ? ' selected' : '');
      b.innerHTML = `<span class="emoji">${card.emoji}</span><span class="name">${card.name}</span>`;
      b.addEventListener('click', () => {
        if (state.phase !== 'player' || state.gameOver) return;
        const pos = state.selected.indexOf(idx);
        if (pos >= 0) state.selected.splice(pos, 1);
        else if (state.selected.length < 3) state.selected.push(idx);
        renderHand();
      });
      els.hand.appendChild(b);
    });
  }
  function renderStatus() {
    els.playerHp.textContent = '❤️'.repeat(Math.max(0, state.playerHp));
    els.enemyHp.textContent = '❤️'.repeat(Math.max(0, state.enemyHp));
    els.roundLabel.textContent = `第 ${state.round} 回合`;
    els.coinsLabel.textContent = `🪙 ${state.coins}`;
    els.skillBtn.textContent = `🐾 猫爪偷牌（${state.skillUses}）`;
    els.skillBtn.disabled = state.skillUses <= 0 || state.phase !== 'player';
  }
  function setPhase(phase) {
    state.phase = phase;
    const enemyTurn = phase === 'enemy-decision';
    els.playBtn.disabled = phase !== 'player';
    els.trustBtn.disabled = !enemyTurn;
    els.challengeBtn.disabled = !enemyTurn;
    [...els.hand.querySelectorAll('button')].forEach(b => b.disabled = phase !== 'player');
    [...els.performanceButtons.querySelectorAll('button')].forEach(b => b.disabled = phase !== 'player');
    renderStatus();
  }
  function reveal(card) {
    els.centerCard.classList.remove('flip');
    requestAnimationFrame(() => {
      els.centerCard.classList.add('flip');
      els.centerCard.textContent = card.emoji;
    });
  }
  function nextRound() {
    if (state.playerHp <= 0 || state.enemyHp <= 0) return finishGame();
    state.round += 1;
    drawHand();
    els.centerCard.textContent = '🂠';
    els.resultText.textContent = '轮到你出牌';
    els.enemySpeech.textContent = '🐶 铁牙：我今天真的很老实。大概。';
    setPhase('player');
  }

  function startGame() {
    state = freshState();
    els.menuScreen.classList.add('hidden');
    els.endingScreen.classList.add('hidden');
    els.battleScreen.classList.remove('hidden');
    els.log.innerHTML = '';
    drawHand();
    [...els.performanceButtons.querySelectorAll('button')].forEach(b => b.classList.toggle('active', b.dataset.performance === 'calm'));
    renderStatus();
    setPhase('player');
    log('乌鸦老板：欢迎来到黑月酒桌。骗过它，或者被它骗。');
    log('夜影坐下。铁牙盯着你手里的牌。');
  }

  function playerPlay() {
    if (state.phase !== 'player') return;
    if (state.selected.length === 0) { log('先选至少 1 张牌。'); return; }
    const cards = state.selected.map(i => state.hand[i]);
    const claim = els.claimSelect.value;
    const truthful = isClaimTrue(cards, claim);
    state.playerLieHistory.push(!truthful);

    let suspicion = 0.48;
    if (state.performance === 'calm') suspicion -= 0.10;
    if (state.performance === 'cute') suspicion -= 0.06;
    if (state.performance === 'smug') suspicion += 0.08;
    if (state.performance === 'taunt') suspicion += 0.16;
    const recentLies = state.playerLieHistory.slice(-3).filter(Boolean).length;
    suspicion += recentLies * 0.06;
    suspicion = clamp(suspicion, 0.12, 0.88);
    const aiChallenges = Math.random() < suspicion;

    const claimName = CARD_POOL.find(c => c.id === claim)?.name || '神秘牌';
    log(`🐱 夜影：我出了 ${cards.length} 张「${claimName}」。`);
    log(`🎭 你的表演：${({calm:'冷静',cute:'无辜',smug:'得意',taunt:'挑衅'})[state.performance]}`);

    if (aiChallenges) {
      els.enemySpeech.textContent = '🐶 铁牙：不对。你这只猫的耳朵刚刚动了——我怀疑！';
      const revealCard = cards.find(c => !c.wild && c.id !== claim) || cards[0];
      reveal(revealCard);
      if (truthful) {
        state.enemyHp -= 1;
        state.coins += 15;
        els.resultText.textContent = '铁牙质疑失败！';
        log('✅ 你说的是真的。铁牙质疑失败，铁牙 -1❤️。');
      } else {
        state.playerHp -= 1;
        els.resultText.textContent = '你被抓包了！';
        log('🐟 牌翻开了：你在骗人！夜影 -1❤️。');
        log('🐱 夜影：这是……战略性失误。');
      }
      renderStatus();
      setTimeout(nextRound, 650);
    } else {
      els.enemySpeech.textContent = '🐶 铁牙：……行，我信你一次。';
      if (truthful) {
        state.coins += 5;
        els.resultText.textContent = '铁牙相信了真话';
        log('😇 铁牙相信了，而你这次真的没有骗人。');
      } else {
        state.enemyHp -= 1;
        state.coins += 20;
        els.resultText.textContent = '骗术成功！';
        log('😏 铁牙相信了谎言！铁牙 -1❤️，骗子积分 +20。');
      }
      renderStatus();
      setTimeout(enemyTurn, 650);
    }
  }

  function enemyTurn() {
    if (state.playerHp <= 0 || state.enemyHp <= 0) return finishGame();
    const enemyCards = [rand(CARD_POOL), rand(CARD_POOL)];
    const claimChoices = ['bone','fish','cheese'];
    const truthBias = state.enemyHp === 1 ? 0.30 : 0.58;
    let claim;
    let truthful;
    if (Math.random() < truthBias) {
      const usable = enemyCards.find(c => !c.wild);
      claim = usable ? usable.id : rand(claimChoices);
      truthful = isClaimTrue(enemyCards, claim);
    } else {
      do { claim = rand(claimChoices); } while (isClaimTrue(enemyCards, claim));
      truthful = false;
    }
    const tells = truthful ? ['尾巴很放松', '眼神异常坦然', '连骨头都不啃了'] : ['鼻子抽了一下', '耳朵突然竖起来', '说完立刻喝水'];
    state.enemyMove = { cards: enemyCards, claim, truthful };
    els.enemySpeech.textContent = `🐶 铁牙：我出了 2 张「${CARD_POOL.find(c=>c.id===claim).name}」。（${rand(tells)}）`;
    els.resultText.textContent = '轮到你判断铁牙';
    els.centerCard.textContent = '🂠';
    log(`🐶 铁牙宣称：2 张「${CARD_POOL.find(c=>c.id===claim).name}」。`);
    setPhase('enemy-decision');
  }

  function judgeEnemy(challenge) {
    if (state.phase !== 'enemy-decision' || !state.enemyMove) return;
    const move = state.enemyMove;
    const revealCard = move.cards.find(c => !c.wild && c.id !== move.claim) || move.cards[0];
    reveal(revealCard);
    if (challenge) {
      if (move.truthful) {
        state.playerHp -= 1;
        els.resultText.textContent = '你怀疑错了！';
        log('😵 你怀疑铁牙，但它这次说的是真的。夜影 -1❤️。');
      } else {
        state.enemyHp -= 1;
        state.coins += 20;
        els.resultText.textContent = '抓到骗子！';
        log('🤨 你抓到铁牙骗人！铁牙 -1❤️。');
      }
    } else {
      if (move.truthful) {
        state.coins += 5;
        els.resultText.textContent = '你判断正确';
        log('😇 你选择相信。铁牙这次确实说了真话。');
      } else {
        state.playerHp -= 1;
        els.resultText.textContent = '你被骗了！';
        log('💥 你相信了铁牙的谎言。夜影 -1❤️。');
      }
    }
    renderStatus();
    setTimeout(nextRound, 650);
  }

  function useSkill() {
    if (state.phase !== 'player' || state.skillUses <= 0) return;
    if (state.selected.length === 0) { log('先选一张你准备出的牌，再使用猫爪偷牌。'); return; }
    const claim = els.claimSelect.value;
    const targetIndex = state.selected.find(idx => !state.hand[idx].wild && state.hand[idx].id !== claim);
    if (targetIndex === undefined) {
      log('🐾 夜影看了一眼牌：这次好像不用偷换。');
      return;
    }
    const replacement = CARD_POOL.find(c => c.id === claim) || CARD_POOL[0];
    state.hand[targetIndex] = replacement;
    state.skillUses -= 1;
    renderHand();
    renderStatus();
    log(`🐾 猫爪一闪：夜影偷偷把一张牌换成了「${replacement.name}」。`);
  }

  function finishGame() {
    state.gameOver = true;
    els.battleScreen.classList.add('hidden');
    els.endingScreen.classList.remove('hidden');
    if (state.enemyHp <= 0) {
      els.endingIcon.textContent = '🏆';
      els.endingTitle.textContent = '黑月新人骗子';
      els.endingText.textContent = `你击败了铁牙，带走 ${state.coins + 100} 枚黑月金币。夜影：骗术，是一种艺术。`;
    } else {
      els.endingIcon.textContent = '🐟';
      els.endingTitle.textContent = '今晚最大的受害者';
      els.endingText.textContent = '铁牙把你骗出了酒馆。夜影：我只是战略性撤退。';
    }
  }

  els.startBtn.addEventListener('click', startGame);
  els.restartBtn.addEventListener('click', startGame);
  els.playBtn.addEventListener('click', playerPlay);
  els.trustBtn.addEventListener('click', () => judgeEnemy(false));
  els.challengeBtn.addEventListener('click', () => judgeEnemy(true));
  els.skillBtn.addEventListener('click', useSkill);
  els.performanceButtons.addEventListener('click', e => {
    const b = e.target.closest('button[data-performance]');
    if (!b || state?.phase !== 'player') return;
    state.performance = b.dataset.performance;
    [...els.performanceButtons.querySelectorAll('button')].forEach(x => x.classList.toggle('active', x === b));
  });
})();
