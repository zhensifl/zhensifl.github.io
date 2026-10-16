/* Personal collection. Meanings are a temporary view state, not synced progress. */
(() => {
  const VERSION="20261016-1",PAGE_SIZE=50;
  const byId=new Map(WORDS.map(word=>[String(word.id),word]));
  const byEnglish=new Map(WORDS.map(word=>[word.en.toLowerCase(),word]));
  let visibleLimit=PAGE_SIZE;
  const revealed=new Set();
  state.favorites=normalizeFavorites(state.favorites);

  function isSaved(id){return state.favorites?.[String(id)]?.saved===true}
  function favoriteButton(word,compact=false,study=false){
    const saved=isSaved(word.id),label=saved?"取消收藏":"收藏这个词";
    return `<button type="button" class="favorite-button${compact?" compact":""}${study?" study-favorite-button":""}${saved?" is-saved":""}" data-favorite-id="${word.id}" aria-pressed="${saved}" aria-label="${label}" title="${label}"><span class="favorite-star" aria-hidden="true">${saved?"★":"☆"}</span><span class="favorite-button-label">${saved?"已收藏":"收藏"}</span></button>`;
  }
  function refreshFavoriteControls(){
    document.querySelectorAll("[data-favorite-id]").forEach(button=>{
      const saved=isSaved(button.dataset.favoriteId),label=saved?"取消收藏":"收藏这个词";
      button.classList.toggle("is-saved",saved);button.setAttribute("aria-pressed",String(saved));button.setAttribute("aria-label",label);button.title=label;
      const star=button.querySelector(".favorite-star"),text=button.querySelector(".favorite-button-label");
      if(star)star.textContent=saved?"★":"☆";if(text)text.textContent=saved?"已收藏":"收藏";
    });
  }
  function collectionWords(){
    return WORDS.filter(word=>isSaved(word.id)).sort((a,b)=>(state.favorites[b.id].updatedAt-state.favorites[a.id].updatedAt)||a.id-b.id);
  }
  function renderFavorites(){
    for(const id of revealed)if(!isSaved(id))revealed.delete(id);
    const all=collectionWords(),query=document.querySelector("#favorite-search").value.trim().toLowerCase();
    const filtered=all.filter(word=>!query||word.en.toLowerCase().includes(query)),visible=filtered.slice(0,visibleLimit);
    document.querySelector("#favorite-count").textContent=all.length.toLocaleString("zh-CN");
    document.querySelector("#favorite-result-count").textContent=query?`找到 ${filtered.length} 个收藏`:"每次进入默认隐藏中文；收藏不会改变每日学习计划。";
    document.querySelector("#favorite-list").innerHTML=visible.length?visible.map(word=>{
      const id=String(word.id),open=revealed.has(id),example=exampleFor(word);
      return `<article class="favorite-card" data-word-id="${id}"><div class="favorite-card-header"><button type="button" class="favorite-word" data-reveal-id="${id}" aria-controls="favorite-meaning-${id}" aria-expanded="${open}"><strong>${escapeAttr(word.en)}</strong><small class="phonetic">${escapeAttr(word.phonetic)}</small><span class="favorite-reveal-label">${open?"隐藏中文":"点击显示中文"}</span></button><div class="favorite-card-actions"><button type="button" class="speak-button" data-speak="${escapeAttr(word.en)}" aria-label="朗读 ${escapeAttr(word.en)}" title="播放英语发音">🔊</button>${favoriteButton(word,true)}</div></div><div class="favorite-meaning" id="favorite-meaning-${id}" ${open?"":"hidden"}><p>${escapeAttr(word.zh)}</p><div class="favorite-example"><span>${escapeAttr(example.en)}</span><small>${escapeAttr(example.zh)}</small></div></div></article>`;
    }).join(""):`<div class="favorites-empty"><span aria-hidden="true">☆</span><h2>${all.length?"没有找到这个英文单词":"还没有收藏的单词"}</h2><p>${all.length?"试试更短的英文关键词。":"在词库或学习卡片上点击 ☆，就能加入这里。"}</p>${all.length?"":'<button class="secondary-button" type="button" data-favorites-library>去词库收藏</button>'}</div>`;
    const more=document.querySelector("#favorites-load-more");more.hidden=visible.length>=filtered.length;more.textContent=`再显示 ${Math.min(PAGE_SIZE,filtered.length-visible.length)} 个 · 共 ${filtered.length} 个收藏`;
  }
  function decorateLibrary(){
    document.querySelectorAll("#word-list .word-row").forEach(row=>{
      const word=byEnglish.get(row.querySelector("[data-speak]")?.dataset.speak?.toLowerCase());
      if(!word||row.querySelector("[data-favorite-id]"))return;
      const status=row.querySelector(".status-badge");if(!status)return;
      const actions=document.createElement("div");actions.className="word-row-actions";status.replaceWith(actions);actions.append(status);actions.insertAdjacentHTML("beforeend",favoriteButton(word,true));
    });
    refreshFavoriteControls();
  }
  function decorateStudy(){
    const word=session?.queue?.[session.idx],card=document.querySelector("#study-card");
    if(!word||!card.querySelector(".question-type")||card.querySelector(".study-favorite-button"))return;
    const questionType=card.querySelector(".question-type"),tools=document.createElement("div");tools.className="study-tools";
    questionType.replaceWith(tools);tools.append(questionType);tools.insertAdjacentHTML("beforeend",favoriteButton(word,false,true));
  }
  function updateCollection(){
    refreshFavoriteControls();
    if(document.querySelector("#favorites-view").classList.contains("active"))renderFavorites();
    else document.querySelector("#favorite-count").textContent=collectionWords().length.toLocaleString("zh-CN");
  }
  function toggleFavorite(id){
    const key=String(id);if(!byId.has(key))return false;
    const current=normalizeFavorites(state.favorites),saved=!current[key]?.saved;
    let updatedAt;
    try{updatedAt=nextFavoriteClock(current)}catch{showToast("收藏记录时间异常，请先导出备份后重试");return false}
    state.favorites={...current,[key]:{saved,updatedAt,actor:ACTIVITY_ACTOR}};
    if(!saved)revealed.delete(key);
    saveState();updateCollection();showToast(saved?"已加入收藏词库":"已取消收藏");return saved;
  }

  const baseRenderLibrary=renderLibrary;
  renderLibrary=()=>{baseRenderLibrary();decorateLibrary();updateCollection()};
  const baseRenderQuestion=renderQuestion,baseRenderSpelling=renderSpelling;
  renderQuestion=()=>{baseRenderQuestion();decorateStudy()};
  renderSpelling=()=>{baseRenderSpelling();decorateStudy()};
  const baseSwitchView=switchView;
  switchView=name=>{if(name==="favorites"){revealed.clear();visibleLimit=PAGE_SIZE;document.querySelector("#favorite-search").value=""}baseSwitchView(name);if(name==="favorites")renderFavorites()};
  const baseSaveState=saveState;
  saveState=(options={})=>{baseSaveState(options);updateCollection()};
  const clearReveal=()=>{revealed.clear();visibleLimit=PAGE_SIZE;document.querySelector("#favorite-search").value=""};
  const baseActivateAccount=activateAccount,baseDeactivateAccount=deactivateAccount;
  activateAccount=next=>{clearReveal();baseActivateAccount(next);updateCollection()};
  deactivateAccount=()=>{clearReveal();baseDeactivateAccount();updateCollection()};

  document.addEventListener("click",event=>{
    const favorite=event.target.closest("[data-favorite-id]");
    if(favorite){event.preventDefault();const inCollection=!!favorite.closest("#favorite-list");toggleFavorite(favorite.dataset.favoriteId);if(inCollection)document.querySelector("#favorite-list [data-reveal-id], [data-favorites-library]")?.focus();return}
    const reveal=event.target.closest("[data-reveal-id]");
    if(reveal){event.preventDefault();const id=reveal.dataset.revealId,panel=document.getElementById(`favorite-meaning-${id}`);if(!panel)return;const open=panel.hidden;panel.hidden=!open;reveal.setAttribute("aria-expanded",String(open));reveal.querySelector(".favorite-reveal-label").textContent=open?"隐藏中文":"点击显示中文";if(open)revealed.add(id);else revealed.delete(id);return}
    if(event.target.closest("[data-favorites-library]"))switchView("library");
  });
  document.querySelector("#favorite-search").addEventListener("input",()=>{visibleLimit=PAGE_SIZE;renderFavorites()});
  document.querySelector("#favorites-load-more").addEventListener("click",()=>{visibleLimit+=PAGE_SIZE;renderFavorites()});
  document.querySelector("#reset-progress").onclick=()=>{
    if(!confirm("确定清除学习进度吗？收藏单词会保留。"))return;
    const favorites=normalizeFavorites(state.favorites);state={...structuredClone(defaultState),favorites};saveState({replaceCloud:true});setModalOpen("#settings-modal",false);renderDashboard();renderLibrary();renderProgress();showToast("学习进度已重置，收藏已保留");
  };
  renderLibrary();renderFavorites();
  window.WordStepFavorites={version:VERSION,isSaved,toggle:toggleFavorite,render:renderFavorites};
})();
