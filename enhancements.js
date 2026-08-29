/* WordStep 2026 learning-system upgrade. Loaded after app.js to preserve old progress. */
const WORDSTEP_LEVELS = ["A2","B1","B2"];
const WORDSTEP_SETTINGS = ["dailyGoal","level","track","trainingMode","reviewLimit","placementDone"];
const WORK_CATEGORIES = new Set(["办公沟通","协作反馈"]);
const WORK_TRACK_CATEGORIES = new Set(["办公沟通","协作反馈","社交沟通","基础交流","日常表达","情绪表达"]);
const RATING_LABELS = {again:"忘记",hard:"困难",good:"一般",easy:"简单"};
const ENHANCED_DEFAULTS = {level:"A2",track:"all",trainingMode:"mixed",reviewLimit:50,placementDone:false};
Object.assign(defaultState,ENHANCED_DEFAULTS);
Object.entries(ENHANCED_DEFAULTS).forEach(([key,value])=>{if(state[key]===undefined)state[key]=value});

const MEMORY_MODEL_VERSION = 2;
function migrateLegacyMemoryState(source={}){
  const migrated={...defaultState,...source,words:{},activity:{...(source.activity||{})},memoryModelVersion:MEMORY_MODEL_VERSION};
  let changed=source.memoryModelVersion!==MEMORY_MODEL_VERSION;
  Object.entries(source.words||{}).forEach(([id,value])=>{
    const record={...(value||{})};
    if(record.stage>=0&&!Number.isFinite(record.stability)){
      const stage=Math.max(0,Math.min(STAGE_DAYS.length-1,Number(record.stage)||0));
      const lastReviewAt=Number(record.lastReviewAt)||Number(record.modifiedAt)||Date.parse(record.lastSeen||record.learnedOn||"")||0;
      const scheduledDays=lastReviewAt&&Number(record.due)>lastReviewAt?Math.round((Number(record.due)-dayStart(new Date(lastReviewAt)))/DAY):0;
      const stageStability=STAGE_DAYS[stage]||1;
      record.stability=+(scheduledDays>0?Math.max(.4,Math.min(stageStability,scheduledDays)):stageStability).toFixed(2);
      const attempts=Math.max(1,Number(record.seen)||1),mistakes=(Number(record.errors)||0)+(Number(record.unknowns)||0)*2;
      record.difficulty=+Math.max(1,Math.min(10,5+mistakes/attempts*2.5)).toFixed(2);
      record.lapses=Number(record.lapses)||Number(record.unknowns)||0;
      record.lastReviewAt=lastReviewAt;
      record.lastRating=record.lastRating||null;
      changed=true;
    }
    migrated.words[id]=record;
  });
  return {state:migrated,changed};
}
{
  const migration=migrateLegacyMemoryState(state);
  state=migration.state;
  if(migration.changed){state.updatedAt=Date.now();persistLocalState()}
}

const categoryTotals=WORDS.reduce((totals,word)=>({...totals,[word.category]:(totals[word.category]||0)+1}),{}),categoryPositions={};
WORDS.forEach((word,rank)=>{
  word.rank=rank;const position=categoryPositions[word.category]||0,ratio=position/categoryTotals[word.category];categoryPositions[word.category]=position+1;
  word.level=ratio<.24?"A2":ratio<.64?"B1":"B2";
  word.track=WORK_CATEGORIES.has(word.category)?"work":"daily";
});

function enhancedRecord(id){
  const record=state.words[id]||{};
  return {stage:-1,due:0,errors:0,unknowns:0,correct:0,seen:0,lastSeen:null,learnedOn:null,stability:0.4,difficulty:5,lapses:0,lastReviewAt:0,lastRating:null,...record};
}
ws=id=>enhancedRecord(id);

mergeProgress=(local,cloud)=>{
  const a=migrateLegacyMemoryState(local||{}).state,b=migrateLegacyMemoryState(cloud||{}).state;
  const newer=(b.updatedAt||0)>(a.updatedAt||0)?b:a;
  const merged={...defaultState,words:{},activity:{},memoryModelVersion:MEMORY_MODEL_VERSION,lastStudyDate:[a.lastStudyDate,b.lastStudyDate].filter(Boolean).sort().pop()||null,updatedAt:Math.max(a.updatedAt||0,b.updatedAt||0)};
  WORDSTEP_SETTINGS.forEach(key=>{merged[key]=newer[key]??defaultState[key]});
  new Set([...Object.keys(a.words),...Object.keys(b.words)]).forEach(id=>{const left=a.words[id],right=b.words[id];merged.words[id]=!left?right:!right?left:wordRecordScore(right)>wordRecordScore(left)?right:left});
  new Set([...Object.keys(a.activity),...Object.keys(b.activity)]).forEach(day=>{
    const left=a.activity[day]||{},right=b.activity[day]||{},ratings={};
    Object.keys(RATING_LABELS).forEach(rating=>ratings[rating]=Math.max(left.ratings?.[rating]||0,right.ratings?.[rating]||0));
    merged.activity[day]={completed:Math.max(left.completed||0,right.completed||0),reviews:Math.max(left.reviews||0,right.reviews||0),new:Math.max(left.new||0,right.new||0),spelling:Math.max(left.spelling||0,right.spelling||0),attempts:Math.max(left.attempts||0,right.attempts||0),correct:Math.max(left.correct||0,right.correct||0),errors:Math.max(left.errors||0,right.errors||0),listening:Math.max(left.listening||0,right.listening||0),ratings};
  });
  return merged;
};

function trackMatches(word){if(state.track==="all")return true;if(state.track==="work")return WORK_TRACK_CATEGORIES.has(word.category);return !WORK_CATEGORIES.has(word.category)}
function retrievability(record,at=Date.now()){
  if(record.stage<0)return 0;
  const stability=Math.max(.2,record.stability||STAGE_DAYS[Math.max(0,record.stage)]||1),last=record.lastReviewAt||Date.parse(record.lastSeen||"")||at,elapsed=Math.max(0,(at-last)/DAY);
  return Math.max(0,Math.min(1,Math.pow(.9,elapsed/stability)));
}
function weakness(record){
  const age=record.lastReviewAt?Math.max(0,(Date.now()-record.lastReviewAt)/DAY):30,recency=Math.exp(-age/45),rating=record.lastRating==="again"?3:record.lastRating==="hard"?1.4:0;
  return rating+(record.unknowns||0)*.7*recency+(record.lapses||0)*.25*recency+Math.max(0,(record.difficulty||5)-5)*.35+(1-retrievability(record));
}
unseenWords=()=>WORDS.filter(word=>ws(word.id).stage<0&&word.level===state.level&&trackMatches(word));
dueWords=()=>WORDS.filter(word=>{const record=ws(word.id);return record.stage>=0&&record.due<=dayStart()}).sort((left,right)=>retrievability(ws(left.id))-retrievability(ws(right.id))||weakness(ws(right.id))-weakness(ws(left.id))||ws(left.id).due-ws(right.id).due);
weakWords=()=>WORDS.filter(word=>ws(word.id).stage>=0&&weakness(ws(word.id))>1.1).sort((left,right)=>weakness(ws(right.id))-weakness(ws(left.id)));
const originalNewAllowance=newAllowance;
newAllowance=()=>{const allowance=originalNewAllowance();return dueWords().length>state.reviewLimit?Math.min(5,allowance):allowance};
todayQueue=()=>[...dueWords().slice(0,state.reviewLimit),...unseenWords().slice(0,newAllowance())];

const originalExampleFor=exampleFor;
exampleFor=word=>{
  if(word.example&&word.exampleZh)return originalExampleFor(word);
  const en=word.en,meaning=primaryMeaning(word),pos=word.pos||"",work=WORK_CATEGORIES.has(word.category),seed=word.id%3;let sentence,translation;
  if(pos.includes("v.")){
    sentence=work?(seed?`We need to ${en} this before the next meeting.`:`Please ${en} the details with the team.`):(seed?`I often ${en} this in daily life.`:`Could you help me ${en} this today?`);
    translation=work?`我们需要在下次会议前“${meaning}”这件事。`:`我在日常生活中经常会“${meaning}”。`;
  }else if(pos.includes("adj.")){
    sentence=work?`This detail is ${en} for our work.`:`It feels ${en} in this situation.`;
    translation=work?`这个细节对我们的工作来说很“${meaning}”。`:`在这种情况下，感觉很“${meaning}”。`;
  }else if(pos.includes("adv.")){
    sentence=`She handled the situation ${en}.`;translation=`她“${meaning}”地处理了这种情况。`;
  }else{
    sentence=work?(seed?`We discussed the ${en} at work today.`:`The ${en} came up during our meeting.`):(seed?`I noticed the ${en} in daily life.`:`We talked about the ${en} this morning.`);
    translation=work?`我们今天在工作中讨论了“${meaning}”。`:`我在日常生活中注意到了“${meaning}”。`;
  }
  return {en:sentence,zh:translation};
};
meaningWithPartOfSpeech=word=>`${word.pos} ${primaryMeaning(word)}`;
distractorWords=word=>{
  const used=new Set([primaryMeaning(word)]),chosen=[];
  const addFrom=pool=>shuffle(pool).forEach(candidate=>{const meaning=primaryMeaning(candidate);if(chosen.length<3&&candidate.id!==word.id&&!used.has(meaning)){used.add(meaning);chosen.push(candidate)}});
  addFrom(WORDS.filter(candidate=>candidate.category===word.category&&candidate.level===word.level&&candidate.pos===word.pos));
  addFrom(WORDS.filter(candidate=>candidate.category===word.category&&candidate.level===word.level));
  addFrom(WORDS.filter(candidate=>candidate.level===word.level));
  return chosen;
};

function nextSchedule(record,rating,wasNew=false){
  let stability=Math.max(.35,record.stability||(record.stage>=0?STAGE_DAYS[Math.max(0,record.stage)]||1:.4)),difficulty=Math.max(1,Math.min(10,record.difficulty||5));
  const recall=retrievability({...record,stability},Date.now());
  if(wasNew)stability=.45;
  if(rating==="again"){stability=Math.max(.35,stability*.5);difficulty=Math.min(10,difficulty+.85)}
  if(rating==="hard"){stability=Math.max(1,stability*(1.18+(1-recall)*.18));difficulty=Math.min(10,difficulty+.25)}
  if(rating==="good"){stability=Math.max(wasNew?2:1.5,stability*(1.82+(1-recall)*.35));difficulty=Math.max(1,difficulty-.18)}
  if(rating==="easy"){stability=Math.max(wasNew?5:4,stability*(2.55+(1-recall)*.55));difficulty=Math.max(1,difficulty-.55)}
  const interval=rating==="again"?1:Math.max(1,Math.min(365,Math.round(stability)));
  return {stability:+stability.toFixed(2),difficulty:+difficulty.toFixed(2),interval};
}
function memoryStage(stability){return stability<1.5?0:stability<4?1:stability<10?2:stability<25?3:stability<60?4:5}

let placement={index:0,score:0,answers:[]};
const placementRanks=[80,260,560,900,1260,1650,2200,2850,3300,3750,4300,4820];
function placementWords(){return placementRanks.map(rank=>WORDS[Math.min(rank,WORDS.length-1)])}
function openPlacement(intro=true){
  setModalOpen("#settings-modal",false);setModalOpen("#placement-modal",true);
  const content=document.querySelector("#placement-content");
  if(intro){content.innerHTML=`<span class="eyebrow">PLACEMENT TEST · 水平测试</span><h2>从合适的难度开始</h2><p class="auth-lead">共 12 题，不需要猜。认识就选择含义，不认识直接跳过，系统会推荐 A2、B1 或 B2。</p><div class="setting-note"><span>◎</span><div><strong>测试不会清除已有进度</strong><p>结果只决定后续新词从哪个等级开始。</p></div></div><button class="primary-button full" id="begin-placement">开始测试</button><button class="text-button" id="skip-placement">暂不测试，从 A2 开始</button>`;document.querySelector("#begin-placement").onclick=()=>{placement={index:0,score:0,answers:[]};renderPlacementQuestion()};document.querySelector("#skip-placement").onclick=()=>finishPlacement("A2");return}
  renderPlacementQuestion();
}
function renderPlacementQuestion(){
  const words=placementWords();if(placement.index>=words.length){const level=placement.score<=4?"A2":placement.score<=8?"B1":"B2";renderPlacementResult(level);return}
  const word=words[placement.index],options=shuffle([word,...distractorWords(word)]),content=document.querySelector("#placement-content");
  content.innerHTML=`<span class="eyebrow">第 ${placement.index+1} / ${words.length} 题</span><div class="placement-progress"><span style="width:${placement.index/words.length*100}%"></span></div><h2 class="placement-word">${escapeAttr(word.en)}</h2><div class="placement-phonetic">${escapeAttr(word.phonetic)}</div><div class="placement-options">${options.map(option=>`<button class="choice meaning-choice" data-placement-answer="${option.id}"><span class="choice-pos">${escapeAttr(option.pos)}</span><span>${escapeAttr(primaryMeaning(option))}</span></button>`).join("")}</div><button class="unknown-button full" id="placement-unknown">不认识这个词</button>`;
  content.querySelectorAll("[data-placement-answer]").forEach(button=>button.onclick=()=>answerPlacement(Number(button.dataset.placementAnswer)===word.id));document.querySelector("#placement-unknown").onclick=()=>answerPlacement(false);
}
function answerPlacement(correct){placement.score+=correct?1:0;placement.answers.push(correct);placement.index++;renderPlacementQuestion()}
function renderPlacementResult(level){
  const content=document.querySelector("#placement-content"),copy={A2:"适合从日常基础交流开始",B1:"适合从独立生活与工作交流开始",B2:"适合进入更丰富的职场与生活表达"}[level];
  content.innerHTML=`<div class="placement-result"><span class="eyebrow">YOUR STARTING LEVEL</span><div class="placement-level">${level}</div><h2>${copy}</h2><p class="auth-lead">答对 ${placement.score} / ${placementWords().length} 题。你随时可以在学习设置中调整等级。</p><button class="primary-button" id="accept-placement">使用 ${level} 开始学习</button></div>`;document.querySelector("#accept-placement").onclick=()=>finishPlacement(level);
}
function finishPlacement(level){state.level=level;state.placementDone=true;saveState();setModalOpen("#placement-modal",false);populateEnhancedSettings();renderDashboard();renderLibrary();renderProgress();showToast(`已切换到 ${level} 词汇等级`)}

function modeForQuestion(){if(state.trainingMode==="mixed")return session.idx%3===1?"listening":"reading";return state.trainingMode}
openSession=()=>{
  if(!state.placementDone&&!Object.keys(state.words).length){openPlacement(true);return}
  let queue=todayQueue(),isExtra=false;if(!queue.length){queue=weakWords().slice(0,Math.max(5,Math.min(state.reviewLimit,state.dailyGoal)));isExtra=true}if(!queue.length){showToast("当前等级已完成，可以在设置中切换下一个等级");return}
  session={queue,idx:0,phase:"choice",correct:0,errors:0,unknowns:0,listening:0,isExtra,currentHadError:false,currentErrorCount:0,currentUnknown:false,forceCorrection:false,currentQuestionType:null};
  document.querySelector("#session-overlay").classList.add("active");document.querySelector("#session-overlay").setAttribute("aria-hidden","false");renderQuestion();
};
document.querySelector("#start-session").onclick=openSession;

renderQuestion=()=>{
  const word=currentWord(),progress=session.idx/session.queue.length*100;document.querySelector("#session-progress-bar").style.width=`${progress}%`;document.querySelector("#session-step").textContent=`${session.idx+1} / ${session.queue.length}`;
  if(session.phase!=="choice"){renderSpelling();return}
  const mode=modeForQuestion();session.currentQuestionType=mode;
  if(mode==="dictation"){session.phase="spelling";renderSpelling();return}
  if(mode==="listening"){
    const options=shuffle([word,...distractorWords(word)]);document.querySelector("#study-card").innerHTML=`<span class="question-type">LISTENING · 听音辨义</span><div class="listening-prompt"><button class="speak-button large" data-speak="${escapeAttr(word.en)}" aria-label="播放单词发音">🔊</button><span class="mode-chip">听发音，选择正确中文</span></div><div class="choice-grid">${options.map(option=>`<button class="choice meaning-choice" data-answer="${option.id}"><span class="choice-pos">${escapeAttr(option.pos)}</span><span>${escapeAttr(primaryMeaning(option))}</span></button>`).join("")}</div><div class="choice-unknown-wrap"><button class="unknown-button" id="choice-unknown" type="button">没听出来</button></div><div id="choice-feedback"></div>`;
    document.querySelectorAll(".choice").forEach(button=>button.addEventListener("click",()=>answerChoice(button,String(word.id),`${word.en} · ${meaningWithPartOfSpeech(word)}`,word.en,word.phonetic)));document.querySelector("#choice-unknown").onclick=()=>markChoiceUnknown(String(word.id),`${word.en} · ${meaningWithPartOfSpeech(word)}`,word.en,word.phonetic);session.listening++;setTimeout(()=>speakWord(word.en),100);return;
  }
  const reverse=(word.id+session.idx)%2===0,field=reverse?"en":"zh",question=reverse?meaningWithPartOfSpeech(word):word.en,options=shuffle([word,...distractorWords(word)]),correctLabel=field==="zh"?meaningWithPartOfSpeech(word):word.en;
  document.querySelector("#study-card").innerHTML=`<span class="question-type">${reverse?"中文 → 英文":"英文 → 中文"}</span><div class="question-word-row"><h2 class="question-main ${reverse?"chinese":""}">${escapeAttr(question)}</h2>${reverse?"":`<button class="speak-button large" data-speak="${escapeAttr(word.en)}" aria-label="朗读 ${escapeAttr(word.en)}">🔊</button>`}</div>${reverse?"":`<span class="phonetic">${escapeAttr(word.phonetic)}</span>`}<p class="question-note">选择正确含义，然后完成拼写</p><div class="choice-grid">${options.map(option=>field==="zh"?`<button class="choice meaning-choice" data-answer="${option.id}"><span class="choice-pos">${escapeAttr(option.pos)}</span><span>${escapeAttr(primaryMeaning(option))}</span></button>`:`<button class="choice" data-answer="${option.id}">${escapeAttr(option.en)}</button>`).join("")}</div><div class="choice-unknown-wrap"><button class="unknown-button" id="choice-unknown" type="button">不认识这个词</button></div><div id="choice-feedback"></div>`;
  document.querySelectorAll(".choice").forEach(button=>button.addEventListener("click",()=>answerChoice(button,String(word.id),correctLabel,field==="en"?word.en:"",word.phonetic)));document.querySelector("#choice-unknown").onclick=()=>markChoiceUnknown(String(word.id),correctLabel,field==="en"?word.en:"",word.phonetic);
};

choiceFeedback=({correct,answer,speakText,phonetic,unknown=false})=>{
  const example=exampleFor(currentWord());document.querySelector("#choice-feedback").innerHTML=`<div class="choice-example"><p>${escapeAttr(example.en)}</p><small>${escapeAttr(example.zh)}</small></div><div class="feedback ${correct?"success":"error"}"><div><strong>${unknown?"已标记为不认识，正确答案：":correct?"答对了！":"记一下正确答案："} ${escapeAttr(answer)}</strong>${speakText?`<span class="phonetic feedback-phonetic">${escapeAttr(phonetic)}</span>`:""}</div><div class="feedback-actions">${speakText?`<button class="speak-button" data-speak="${escapeAttr(speakText)}" aria-label="朗读 ${escapeAttr(speakText)}">🔊</button>`:""}<button class="continue-button" id="to-spelling">继续拼写 →</button></div></div>`;document.querySelector("#to-spelling").onclick=()=>{session.phase="spelling";renderQuestion()};
};

renderSpelling=()=>{
  const word=currentWord(),example=clozeExample(word),dictation=session.currentQuestionType==="dictation";
  document.querySelector("#study-card").innerHTML=`<span class="question-type">${dictation?"DICTATION · 听写强化":"拼写练习 · 必须拼对才能继续"}</span>${dictation?`<div class="listening-prompt"><button class="speak-button large" data-speak="${escapeAttr(word.en)}" aria-label="播放单词发音">🔊</button><span class="mode-chip">听发音并拼写</span></div>`:`<h2 class="question-main chinese">${escapeAttr(primaryMeaning(word))}</h2><span class="phonetic">${escapeAttr(word.phonetic)}</span>`}<div class="spelling-example"><span>例句</span><p>${escapeAttr(example.en)}</p><small>${escapeAttr(example.zh)}</small></div><form class="spell-form" id="spell-form"><input class="spell-input" id="spell-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="输入英文单词" aria-label="输入英文拼写"><div class="spell-actions"><button class="primary-button" type="submit">检查拼写</button><button class="unknown-button" id="spell-unknown" type="button">不认识</button></div><div id="spell-feedback" aria-live="polite"></div></form>`;
  const input=document.querySelector("#spell-input");input.focus();document.querySelector("#spell-form").onsubmit=event=>{event.preventDefault();checkSpelling(input.value)};document.querySelector("#spell-unknown").onclick=markSpellingUnknown;if(dictation){session.listening++;setTimeout(()=>speakWord(word.en),100)}
};

function ratingButtons(word){
  const record=ws(word.id),wasNew=record.stage<0,defaultRating=session.currentUnknown?"again":session.currentHadError?"hard":"good";
  return `<div class="rating-panel"><span class="rating-label">这次记得怎么样？系统会据此安排下次复习</span><div class="rating-grid">${Object.keys(RATING_LABELS).map(rating=>{const preview=nextSchedule(record,rating,wasNew);return `<button type="button" class="rating-button ${rating===defaultRating?"default":""}" ${rating===defaultRating?'id="next-word"':""} data-rating="${rating}"><strong>${RATING_LABELS[rating]}</strong><small>${preview.interval} 天后</small></button>`}).join("")}</div></div>`;
}
checkSpelling=value=>{
  const word=currentWord(),input=document.querySelector("#spell-input"),normalized=value.trim().toLowerCase();
  if(normalized===word.en.toLowerCase()){
    input.classList.add("success");input.disabled=true;document.querySelector(".spell-actions").hidden=true;session.correct++;const label=session.forceCorrection?"重新拼对了，这次会记得更牢。":"拼写正确！";document.querySelector("#spell-feedback").innerHTML=`<div class="feedback success has-rating"><div><strong>✓ ${label}</strong><span class="phonetic feedback-phonetic">${escapeAttr(word.phonetic)}</span>${ratingButtons(word)}</div><div class="feedback-actions"><button type="button" class="speak-button" data-speak="${escapeAttr(word.en)}" aria-label="朗读 ${escapeAttr(word.en)}">🔊</button></div></div>`;document.querySelectorAll("[data-rating]").forEach(button=>button.onclick=()=>finishWord(button.dataset.rating));
  }else{session.errors++;session.currentErrorCount++;session.currentHadError=true;session.forceCorrection=true;showSpellingCorrection()}
};

finishWord=(rating="good")=>{
  const word=currentWord(),record=ws(word.id),wasNew=record.stage<0,schedule=nextSchedule(record,rating,wasNew),unknownTotal=session.currentUnknown?(record.unknowns||0)+1:Math.max(0,(record.unknowns||0)-(session.currentHadError?0:1));
  state.words[word.id]={...record,stage:memoryStage(schedule.stability),due:dayStart()+schedule.interval*DAY,errors:(record.errors||0)+session.currentErrorCount,unknowns:unknownTotal,correct:(record.correct||0)+(!session.currentHadError?1:0),seen:(record.seen||0)+1,lastSeen:localDate(),learnedOn:record.learnedOn||(wasNew?localDate():null),stability:schedule.stability,difficulty:schedule.difficulty,lapses:(record.lapses||0)+(rating==="again"?1:0),lastReviewAt:Date.now(),lastRating:rating,modifiedAt:Date.now()};
  const key=localDate(),activity=state.activity[key]||{},ratings={...(activity.ratings||{})};ratings[rating]=(ratings[rating]||0)+1;state.activity[key]={...activity,completed:(activity.completed||0)+1,reviews:(activity.reviews||0)+(wasNew?0:1),new:(activity.new||0)+(wasNew?1:0),spelling:(activity.spelling||0)+1,attempts:(activity.attempts||0)+1,correct:(activity.correct||0)+(!session.currentHadError?1:0),errors:(activity.errors||0)+session.currentErrorCount,listening:(activity.listening||0)+(["listening","dictation"].includes(session.currentQuestionType)?1:0),ratings};state.lastStudyDate=key;saveState();
  session.idx++;session.phase="choice";session.currentHadError=false;session.currentErrorCount=0;session.currentUnknown=false;session.forceCorrection=false;session.currentQuestionType=null;if(session.idx>=session.queue.length)renderComplete();else renderQuestion();
};

renderComplete=()=>{const accuracy=session.queue.length?Math.round((session.queue.length-Math.min(session.queue.length,session.errors))/session.queue.length*100):100;document.querySelector("#session-progress-bar").style.width="100%";document.querySelector("#session-step").textContent="完成";document.querySelector("#study-card").innerHTML=`<div class="completion-icon">✓</div><span class="question-type">TODAY COMPLETE</span><h2 class="question-main chinese">今天的训练完成了！</h2><p class="question-note">动态记忆模型已经根据你的反馈安排好下一次复习。</p><div class="completion-stats"><div><strong>${session.queue.length}</strong><span>完成词数</span></div><div><strong>${accuracy}%</strong><span>本组准确率</span></div><div><strong>${session.listening}</strong><span>听力练习</span></div></div><button class="primary-button" id="finish-session">返回首页</button>`;document.querySelector("#finish-session").onclick=closeSession};

renderDashboard=()=>{
  const allDue=dueWords(),scheduled=allDue.slice(0,state.reviewLimit),fresh=Math.min(newAllowance(),unseenWords().length),weak=weakWords().length,total=scheduled.length+fresh,backlog=Math.max(0,allDue.length-scheduled.length);
  document.querySelector("#today-date").textContent=new Intl.DateTimeFormat("zh-CN",{month:"long",day:"numeric",weekday:"long"}).format(new Date());document.querySelector("#streak-number").textContent=streak();document.querySelector("#profile-streak").textContent=`连续学习 ${streak()} 天`;document.querySelector("#review-count").textContent=scheduled.length;document.querySelector("#new-count").textContent=fresh;document.querySelector("#weak-count").textContent=weak;document.querySelector("#task-total").textContent=`${total} 个待完成${backlog?` · ${backlog} 个积压已分批`:""}`;document.querySelector("#plan-summary").textContent=total?`先复习 ${scheduled.length} 词，再学习 ${fresh} 个 ${state.level} 新词，约需 ${Math.max(3,Math.ceil(total*.75))} 分钟。${backlog?`其余 ${backlog} 个复习会分批安排。`:""}`:"今天的计划已经完成。可以练习易错词或切换词汇等级。";const button=document.querySelector("#start-session");button.innerHTML=total?"开始今日学习 <span>→</span>":"再练一组易错词 <span>→</span>";const next=unseenWords()[0];document.querySelector("#today-scene").textContent=`${state.level} · ${next?.category||"当前等级已完成"}`;const activity=state.activity[localDate()]||{};document.querySelector("#review-progress").style.width=`${scheduled.length?Math.min(100,(activity.reviews||0)/(scheduled.length+(activity.reviews||0))*100):100}%`;document.querySelector("#new-progress").style.width=`${state.dailyGoal?learnedToday()/state.dailyGoal*100:0}%`;document.querySelector("#weak-progress").style.width=`${weak?Math.min(100,(activity.spelling||0)/weak*100):100}%`;document.querySelector("#placement-banner").hidden=state.placementDone;renderWeek();updateConnectionStatus();
};

let activeLevelFilter="全部";
renderLibrary=()=>{
  document.querySelector("#category-filters").innerHTML=["全部",...categoryNames].map(category=>`<button class="filter-button ${category===activeCategory?"active":""}" data-category="${category}">${category}</button>`).join("");const learned=WORDS.filter(word=>ws(word.id).stage>=0).length,mastered=WORDS.filter(word=>ws(word.id).stability>=30).length;document.querySelector("#library-stats").innerHTML=`<span class="small-stat"><strong>${WORDS.length}</strong> 总词汇</span>${WORDSTEP_LEVELS.map(level=>`<span class="small-stat"><strong>${WORDS.filter(word=>word.level===level).length}</strong> ${level}</span>`).join("")}<span class="small-stat"><strong>${learned}</strong> 已学习</span><span class="small-stat"><strong>${mastered}</strong> 稳定掌握</span>`;const search=document.querySelector("#word-search").value.trim().toLowerCase(),filtered=WORDS.filter(word=>(activeCategory==="全部"||word.category===activeCategory)&&(activeLevelFilter==="全部"||word.level===activeLevelFilter)&&(!search||word.en.includes(search)||word.zh.includes(search))),visible=filtered.slice(0,libraryLimit);document.querySelector("#word-list").innerHTML=filtered.length?visible.map(word=>{const record=ws(word.id),example=exampleFor(word),status=record.stage<0?["未学习",""]:record.stability>=30?["已掌握","mastered"]:["学习中","learning"];return `<div class="word-row"><div class="word-en"><div class="word-title"><strong>${escapeAttr(word.en)}</strong><span class="level-badge">${word.level}</span><button class="speak-button" data-speak="${escapeAttr(word.en)}" aria-label="朗读 ${escapeAttr(word.en)}">🔊</button></div><small>${escapeAttr(word.phonetic)}</small></div><div class="word-zh">${escapeAttr(word.zh)}</div><div class="word-example">${escapeAttr(example.en)}<br><small>${escapeAttr(example.zh)}</small></div><span class="status-badge ${status[1]}">${status[0]}</span></div>`}).join("")+`${visible.length<filtered.length?`<button class="load-more" id="load-more">再显示 ${Math.min(100,filtered.length-visible.length)} 个 · 共 ${filtered.length} 个</button>`:""}`:`<div class="empty-state">没有找到匹配的单词</div>`;
};

function recentActivity(days=7){const rows=[];for(let index=0;index<days;index++){const date=new Date(dayStart()-index*DAY);rows.push(state.activity[localDate(date)]||{})}return rows}
renderProgress=()=>{
  const learned=WORDS.filter(word=>ws(word.id).stage>=0),mastered=learned.filter(word=>ws(word.id).stability>=30),practiced=Object.values(state.activity).reduce((sum,item)=>sum+(item.completed||0),0),known=learned.filter(word=>ws(word.id).stability>=7&&retrievability(ws(word.id))>=.8).length,tomorrow=dayStart()+DAY,dueTomorrow=learned.filter(word=>ws(word.id).due>dayStart()&&ws(word.id).due<=tomorrow).length,recent=recentActivity(),measured=recent.filter(item=>Number(item.attempts)>0&&Number.isFinite(Number(item.correct))),attempts=measured.reduce((sum,item)=>sum+Number(item.attempts),0),correct=measured.reduce((sum,item)=>sum+Math.min(Number(item.attempts),Math.max(0,Number(item.correct))),0),accuracy=attempts?Math.round(correct/attempts*100):null;
  document.querySelector("#progress-stats").innerHTML=[[learned.length,"已学习词汇",`${state.level} 当前等级`],[mastered.length,"长期掌握","稳定度 ≥ 30 天"],[streak(),"连续学习","天"],[practiced,"累计练习","次"]].map(item=>`<article class="big-stat"><span>${item[1]}</span><strong>${item[0]}</strong><small>${item[2]}</small></article>`).join("");document.querySelector("#insight-grid").innerHTML=`<article class="insight-card"><span>预计可用词汇量</span><strong>${known}</strong><small>当前记忆概率 ≥ 80%</small></article><article class="insight-card"><span>近 7 天正确率</span><strong>${accuracy===null?"—":`${accuracy}%`}</strong><small>${accuracy===null?"旧记录未保存正确次数，将从新版练习开始统计":`${attempts} 次有效练习`}</small></article><article class="insight-card"><span>明日预计复习</span><strong>${dueTomorrow}</strong><small>会根据今天表现动态变化</small></article>`;
  const stages=[{name:"初次接触",min:0,max:1.49},{name:"正在记住",min:1.5,max:6.99},{name:"逐渐稳定",min:7,max:29.99},{name:"长期掌握",min:30,max:Infinity}],counts=stages.map(stage=>learned.filter(word=>{const value=ws(word.id).stability||0;return value>=stage.min&&value<=stage.max}).length),max=Math.max(1,...counts);document.querySelector("#stage-list").innerHTML=stages.map((stage,index)=>`<div class="stage-row"><span>${stage.name}</span><div class="stage-track"><div class="stage-fill" style="width:${counts[index]/max*100}%;opacity:${.6+index*.12}"></div></div><strong>${counts[index]}</strong></div>`).join("");
  const scenes=categoryNames.map(category=>{const words=WORDS.filter(word=>word.category===category),done=words.filter(word=>ws(word.id).stage>=0).length;return {category,percent:Math.round(done/words.length*100)}}).sort((a,b)=>b.percent-a.percent);document.querySelector("#scene-mastery").innerHTML=scenes.map(scene=>`<div class="scene-row"><span>${scene.category}</span><div class="scene-track"><span style="width:${scene.percent}%"></span></div><strong>${scene.percent}%</strong></div>`).join("");const weak=weakWords().slice(0,8);document.querySelector("#weak-word-list").innerHTML=weak.length?weak.map(word=>`<div class="weak-word"><strong>${escapeAttr(word.en)}</strong><span>${RATING_LABELS[ws(word.id).lastRating]||"需要巩固"} · ${Math.round(retrievability(ws(word.id))*100)}%</span></div>`).join(""):`<div class="empty-state">暂时没有易错词</div>`;
};

function populateEnhancedSettings(){document.querySelector("#daily-range").value=state.dailyGoal;document.querySelector("#level-select").value=state.level;document.querySelector("#track-select").value=state.track;document.querySelector("#mode-select").value=state.trainingMode;document.querySelector("#review-limit-select").value=String(state.reviewLimit);updateRange()}
updateRange=()=>{const count=+document.querySelector("#daily-range").value;document.querySelector("#daily-value").textContent=count;document.querySelector("#estimated-time").textContent=Math.ceil((count+Math.min(state.reviewLimit,dueWords().length))*.72)};
document.querySelectorAll('[data-action="open-settings"]').forEach(button=>button.addEventListener("click",populateEnhancedSettings));
document.querySelector("#save-settings").onclick=()=>{state.dailyGoal=+document.querySelector("#daily-range").value;state.level=document.querySelector("#level-select").value;state.track=document.querySelector("#track-select").value;state.trainingMode=document.querySelector("#mode-select").value;state.reviewLimit=+document.querySelector("#review-limit-select").value;saveState();setModalOpen("#settings-modal",false);renderDashboard();renderLibrary();renderProgress();showToast("学习计划与训练模式已更新")};
document.querySelector("#retake-placement").onclick=()=>openPlacement(true);document.querySelector("#start-placement").onclick=()=>openPlacement(true);document.querySelectorAll('[data-action="close-placement"]').forEach(button=>button.onclick=()=>setModalOpen("#placement-modal",false));document.querySelector("#placement-modal").addEventListener("click",event=>{if(event.target.id==="placement-modal")setModalOpen("#placement-modal",false)});
document.querySelector("#library-level-filter").addEventListener("change",event=>{activeLevelFilter=event.target.value;libraryLimit=100;renderLibrary()});

function exportProgress(){const payload={app:"WordStep",formatVersion:2,exportedAt:new Date().toISOString(),state};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),anchor=document.createElement("a");anchor.href=url;anchor.download=`wordstep-backup-${localDate()}.json`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),500);showToast("学习记录已导出")}
async function importProgressFile(file){try{const payload=JSON.parse(await file.text()),incoming=payload.state||payload;if(!incoming||typeof incoming!=="object"||typeof incoming.words!=="object"||typeof incoming.activity!=="object")throw new Error("文件格式不正确");if(!confirm("导入会用备份中的设置和学习记录替换当前设备数据，是否继续？"))return;state=migrateLegacyMemoryState({...defaultState,...incoming,words:{...incoming.words},activity:{...incoming.activity},updatedAt:Date.now()}).state;saveState({replaceCloud:true});populateEnhancedSettings();renderDashboard();renderLibrary();renderProgress();setModalOpen("#settings-modal",false);showToast("学习记录已恢复并准备同步")}catch(error){showToast(`导入失败：${error.message}`)}}
document.querySelector("#export-progress").onclick=exportProgress;document.querySelector("#import-progress").onclick=()=>document.querySelector("#import-file").click();document.querySelector("#import-file").onchange=event=>{const file=event.target.files?.[0];if(file)importProgressFile(file);event.target.value=""};

let deferredInstallPrompt=null;
function updateConnectionStatus(){const element=document.querySelector("#connection-status");if(!element)return;const offline=navigator.onLine?"网络已连接":"当前离线，可继续学习",worker="serviceWorker" in navigator?(navigator.serviceWorker.controller?"离线缓存已启用":"正在准备离线缓存"):"浏览器不支持离线安装";element.textContent=`${offline} · ${worker}${authSession?` · ${syncStatus}`:""}`}
window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();deferredInstallPrompt=event;document.querySelector("#install-app").hidden=false});document.querySelector("#install-app").onclick=async()=>{if(!deferredInstallPrompt){showToast("如果浏览器支持，请在菜单中选择“添加到主屏幕”");return}deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;document.querySelector("#install-app").hidden=true};window.addEventListener("online",updateConnectionStatus);window.addEventListener("offline",updateConnectionStatus);if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").then(updateConnectionStatus).catch(()=>updateConnectionStatus());

const baseRenderAuthModal=renderAuthModal;
renderAuthModal=()=>{
  const content=document.querySelector("#auth-content");
  if(authMode==="recovery"){
    content.innerHTML=`<span class="eyebrow">RESET PASSWORD</span><h2>设置新密码</h2><p class="auth-lead">请输入至少 6 位的新密码。</p><form class="auth-form" id="recovery-form"><label>新密码<input id="recovery-password" type="password" autocomplete="new-password" minlength="6" required></label>${authMessage?`<p class="auth-message">${escapeAttr(authMessage)}</p>`:""}<button class="primary-button full" type="submit">更新密码</button></form>`;document.querySelector("#recovery-form").onsubmit=updateRecoveredPassword;return;
  }
  baseRenderAuthModal();if(!authSession&&authMode==="login"){const form=document.querySelector("#auth-form");if(form){const button=document.createElement("button");button.type="button";button.className="text-button";button.textContent="忘记密码？发送重置邮件";button.onclick=requestPasswordReset;form.after(button)}}
};
async function requestPasswordReset(){const email=document.querySelector("#auth-email")?.value.trim()||prompt("请输入注册邮箱：")?.trim();if(!email)return;try{const redirect=encodeURIComponent(`${location.origin}${location.pathname}`);await supabaseRequest(`/auth/v1/recover?redirect_to=${redirect}`,{method:"POST",body:{email},token:null});authMessage="重置邮件已经发送，请检查收件箱和垃圾邮件。";renderAuthModal()}catch(error){authMessage=authErrorText(error.message);renderAuthModal()}}
async function consumeRecoveryLink(){const params=new URLSearchParams(location.hash.slice(1));if(params.get("type")!=="recovery"||!params.get("access_token"))return false;try{const user=await supabaseRequest("/auth/v1/user",{token:params.get("access_token")});setAuthSession({access_token:params.get("access_token"),refresh_token:params.get("refresh_token"),expires_at:Math.floor(Date.now()/1000)+Number(params.get("expires_in")||3600),user});authMode="recovery";history.replaceState(null,"",location.pathname+location.search);renderAuthModal();setModalOpen("#auth-modal",true);return true}catch(error){authMessage=authErrorText(error.message);return false}}
async function updateRecoveredPassword(event){event.preventDefault();const password=document.querySelector("#recovery-password").value,button=event.submitter;button.disabled=true;try{await supabaseRequest("/auth/v1/user",{method:"PUT",body:{password},token:authSession.access_token});authMode="login";authMessage="密码已经更新，下次可以使用新密码登录。";renderAuthModal()}catch(error){authMessage=authErrorText(error.message);renderAuthModal()}}

let lastSyncError="";
syncProgress=async(notify=false)=>{
  if(!authSession)return false;if(syncBusy){syncQueued=true;return false}syncBusy=true;const replaceCloud=replaceCloudOnNextSync;replaceCloudOnNextSync=false;syncStatus="正在同步…";renderAccountUI();
  try{const valid=await ensureSession();if(!valid)throw new Error("登录已过期");const rows=await supabaseRequest(`/rest/v1/user_progress?select=state&user_id=eq.${encodeURIComponent(valid.user.id)}`);if(!replaceCloud)state=mergeProgress(state,rows?.[0]?.state);persistLocalState();await supabaseRequest("/rest/v1/user_progress?on_conflict=user_id",{method:"POST",body:{user_id:valid.user.id,state},token:valid.access_token,headers:{Prefer:"resolution=merge-duplicates"}});lastSyncError="";syncStatus=`已同步 · ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`;renderDashboard();renderLibrary();renderProgress();if(notify)showToast("学习进度已同步")}
  catch(error){if(replaceCloud)replaceCloudOnNextSync=true;lastSyncError=authErrorText(error.message);syncStatus=`同步失败 · ${lastSyncError}`;clearTimeout(syncTimer);if(authSession)syncTimer=setTimeout(()=>syncProgress(),15000);if(notify)showToast(syncStatus)}finally{syncBusy=false;renderAccountUI();updateConnectionStatus();if(syncQueued){syncQueued=false;scheduleCloudSync()}}return !lastSyncError;
};

document.addEventListener("keydown",event=>{if(event.key==="Escape"&&document.querySelector("#placement-modal").classList.contains("active"))setModalOpen("#placement-modal",false)});
populateEnhancedSettings();renderDashboard();renderLibrary();renderProgress();consumeRecoveryLink();setTimeout(()=>{if(!state.placementDone&&!Object.keys(state.words).length)openPlacement(true)},700);
window.WordStepEnhancements={version:"20260829-5",retrievability,nextSchedule,openPlacement,exportProgress,migrateLegacyMemoryState};
