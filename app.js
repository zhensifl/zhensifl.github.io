const CURATED_WORDS = [
  // 居家生活
  ["morning","早晨","Good morning! Did you sleep well?","早上好！你睡得好吗？","居家生活","/ˈmɔːrnɪŋ/"],
  ["breakfast","早餐","I usually have breakfast at seven.","我通常七点吃早餐。","居家生活","/ˈbrekfəst/"],
  ["kitchen","厨房","The cups are in the kitchen.","杯子在厨房里。","居家生活","/ˈkɪtʃɪn/"],
  ["clean","打扫；干净的","I need to clean the room.","我需要打扫房间。","居家生活","/kliːn/"],
  ["laundry","待洗衣物；洗衣服","I do the laundry on Sunday.","我星期日洗衣服。","居家生活","/ˈlɔːndri/"],
  ["neighbor","邻居","Our new neighbor is very friendly.","我们的新邻居很友好。","居家生活","/ˈneɪbər/"],
  ["comfortable","舒服的","This chair is very comfortable.","这把椅子很舒服。","居家生活","/ˈkʌmftəbl/"],
  ["prepare","准备","I need to prepare dinner.","我需要准备晚餐。","居家生活","/prɪˈper/"],
  ["repair","修理","Can you repair the door?","你能修一下门吗？","居家生活","/rɪˈper/"],
  ["quiet","安静的","It is quiet here at night.","这里晚上很安静。","居家生活","/ˈkwaɪət/"],
  ["towel","毛巾","Could you bring me a towel?","你能给我拿条毛巾吗？","居家生活","/ˈtaʊəl/"],
  ["blanket","毯子","The blanket is warm and soft.","这条毯子温暖又柔软。","居家生活","/ˈblæŋkɪt/"],
  // 饮食购物
  ["order","点餐；订购","Are you ready to order?","您准备好点餐了吗？","饮食购物","/ˈɔːrdər/"],
  ["menu","菜单","Could I see the menu, please?","请给我看一下菜单好吗？","饮食购物","/ˈmenjuː/"],
  ["delicious","美味的","The soup is delicious.","这汤很美味。","饮食购物","/dɪˈlɪʃəs/"],
  ["hungry","饿的","I'm hungry. Let's get some food.","我饿了。我们去吃点东西吧。","饮食购物","/ˈhʌŋɡri/"],
  ["bill","账单","Could we have the bill, please?","请把账单给我们好吗？","饮食购物","/bɪl/"],
  ["cash","现金","Can I pay in cash?","我能用现金支付吗？","饮食购物","/kæʃ/"],
  ["price","价格","What is the price of this shirt?","这件衬衫多少钱？","饮食购物","/praɪs/"],
  ["cheap","便宜的","This store is quite cheap.","这家店很便宜。","饮食购物","/tʃiːp/"],
  ["expensive","昂贵的","That restaurant is too expensive.","那家餐厅太贵了。","饮食购物","/ɪkˈspensɪv/"],
  ["receipt","收据","Please keep your receipt.","请保留您的收据。","饮食购物","/rɪˈsiːt/"],
  ["change","零钱；改变","Keep the change.","不用找零了。","饮食购物","/tʃeɪndʒ/"],
  ["available","有货的；可用的","Is this size available?","这个尺码有货吗？","饮食购物","/əˈveɪləbl/"],
  // 出行问路
  ["station","车站","How far is the train station?","火车站有多远？","出行问路","/ˈsteɪʃn/"],
  ["ticket","票","I need a ticket to Shanghai.","我需要一张去上海的票。","出行问路","/ˈtɪkɪt/"],
  ["direction","方向；路线","Could you give me directions?","你能给我指路吗？","出行问路","/dəˈrekʃn/"],
  ["straight","直的；径直","Go straight for two blocks.","直走两个街区。","出行问路","/streɪt/"],
  ["corner","拐角","Turn left at the corner.","在拐角处左转。","出行问路","/ˈkɔːrnər/"],
  ["traffic","交通","There is a lot of traffic today.","今天交通很拥堵。","出行问路","/ˈtræfɪk/"],
  ["arrive","到达","What time will we arrive?","我们几点到？","出行问路","/əˈraɪv/"],
  ["leave","离开","I have to leave now.","我现在得走了。","出行问路","/liːv/"],
  ["nearby","附近的","Is there a bank nearby?","附近有银行吗？","出行问路","/ˌnɪrˈbaɪ/"],
  ["entrance","入口","The entrance is on your right.","入口在你的右边。","出行问路","/ˈentrəns/"],
  ["delay","延误","The flight has a short delay.","航班短暂延误。","出行问路","/dɪˈleɪ/"],
  ["platform","站台","The train leaves from platform six.","火车从六号站台发车。","出行问路","/ˈplætfɔːrm/"],
  // 社交沟通
  ["introduce","介绍","Let me introduce myself.","让我自我介绍一下。","社交沟通","/ˌɪntrəˈduːs/"],
  ["hobby","爱好","What do you do as a hobby?","你有什么爱好？","社交沟通","/ˈhɑːbi/"],
  ["weekend","周末","What are you doing this weekend?","你这周末做什么？","社交沟通","/ˌwiːkˈend/"],
  ["invite","邀请","I'd like to invite you to dinner.","我想邀请你吃晚饭。","社交沟通","/ɪnˈvaɪt/"],
  ["agree","同意","I agree with you.","我同意你的看法。","社交沟通","/əˈɡriː/"],
  ["probably","大概；可能","I'll probably stay at home.","我可能会待在家里。","社交沟通","/ˈprɑːbəbli/"],
  ["interesting","有趣的","That sounds interesting.","那听起来很有趣。","社交沟通","/ˈɪntrəstɪŋ/"],
  ["together","一起","Let's have lunch together.","我们一起吃午饭吧。","社交沟通","/təˈɡeðər/"],
  ["message","消息","I'll send you a message.","我会给你发消息。","社交沟通","/ˈmesɪdʒ/"],
  ["remember","记得","Do you remember his name?","你记得他的名字吗？","社交沟通","/rɪˈmembər/"],
  ["understand","理解","Sorry, I don't understand.","抱歉，我没听懂。","社交沟通","/ˌʌndərˈstænd/"],
  ["explain","解释","Could you explain that again?","你能再解释一下吗？","社交沟通","/ɪkˈspleɪn/"],
  // 办公沟通
  ["meeting","会议","We have a meeting at ten.","我们十点有个会。","办公沟通","/ˈmiːtɪŋ/"],
  ["schedule","日程；安排","Let me check my schedule.","让我看一下日程。","办公沟通","/ˈskedʒuːl/"],
  ["project","项目","The project is going well.","项目进展顺利。","办公沟通","/ˈprɑːdʒekt/"],
  ["deadline","截止日期","The deadline is next Friday.","截止日期是下周五。","办公沟通","/ˈdedlaɪn/"],
  ["report","报告；汇报","I'll send the report today.","我今天会发送报告。","办公沟通","/rɪˈpɔːrt/"],
  ["task","任务","I finished the task this morning.","我今天早上完成了任务。","办公沟通","/tæsk/"],
  ["update","更新；最新消息","Can you give me an update?","你能告诉我最新进展吗？","办公沟通","/ˈʌpdeɪt/"],
  ["discuss","讨论","Let's discuss this tomorrow.","我们明天讨论这个吧。","办公沟通","/dɪˈskʌs/"],
  ["suggest","建议","I suggest a different plan.","我建议换一个方案。","办公沟通","/səˈdʒest/"],
  ["confirm","确认","Please confirm the meeting time.","请确认会议时间。","办公沟通","/kənˈfɜːrm/"],
  ["forward","转发；向前","Could you forward the email?","你能转发这封邮件吗？","办公沟通","/ˈfɔːrwərd/"],
  ["attach","附上；连接","I've attached the document.","我已附上文件。","办公沟通","/əˈtætʃ/"],
  // 协作反馈
  ["progress","进展","We are making good progress.","我们进展得很好。","协作反馈","/ˈprɑːɡres/"],
  ["problem","问题","We need to solve this problem.","我们需要解决这个问题。","协作反馈","/ˈprɑːbləm/"],
  ["solution","解决方案","Do you have a solution?","你有解决方案吗？","协作反馈","/səˈluːʃn/"],
  ["support","支持","Thank you for your support.","谢谢你的支持。","协作反馈","/səˈpɔːrt/"],
  ["improve","改进","How can we improve this?","我们怎样改进这个？","协作反馈","/ɪmˈpruːv/"],
  ["feedback","反馈","I'd like to hear your feedback.","我想听听你的反馈。","协作反馈","/ˈfiːdbæk/"],
  ["responsible","负责的","Who is responsible for this task?","谁负责这项任务？","协作反馈","/rɪˈspɑːnsəbl/"],
  ["priority","优先事项","This is our top priority.","这是我们的首要任务。","协作反馈","/praɪˈɔːrəti/"],
  ["complete","完成；完整的","We need to complete it today.","我们需要今天完成它。","协作反馈","/kəmˈpliːt/"],
  ["expect","预期；期待","What result do you expect?","你预期什么结果？","协作反馈","/ɪkˈspekt/"],
  ["decision","决定","We need to make a decision.","我们需要做决定。","协作反馈","/dɪˈsɪʒn/"],
  ["opportunity","机会","This is a great opportunity.","这是一个很好的机会。","协作反馈","/ˌɑːpərˈtuːnəti/"],
].map(w=>({en:w[0],zh:w[1],example:w[2],exampleZh:w[3],category:w[4],phonetic:w[5]}));

const WORDS = [...CURATED_WORDS,...(window.WORD_DATA||[])].map((word,index)=>({...word,id:index+1}));

const STORAGE_KEY = "wordstep-state-v1";
const AUTH_STORAGE_KEY = "wordstep-auth-v1";
const SUPABASE_URL = "https://wgvxdzwrvgktcidmofit.supabase.co";
const SUPABASE_KEY = "sb_publishable_O2PaZM-nTJKAaeUYKiXbBw_r4WmllMx";
const DAY = 86400000;
const STAGE_DAYS = [1,2,4,7,15,30,60];
const categoryNames = [...new Set(WORDS.map(w=>w.category))];
const defaultState = {dailyGoal:10, words:{}, activity:{}, lastStudyDate:null, updatedAt:0};
let state = loadState();
let activeCategory = "全部";
let libraryLimit = 100;
let session = null;
let authSession = loadAuthSession();
let authMode = "login";
let syncTimer = null;
let syncBusy = false;
let syncQueued = false;
let replaceCloudOnNextSync = false;
let syncStatus = "未登录 · 进度仅保存在当前设备";
let authMessage = "";

function localDate(d=new Date()){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${day}`}
function dayStart(d=new Date()){return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()}
function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")}}catch{return structuredClone(defaultState)}}
function persistLocalState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function saveState({replaceCloud=false}={}){state.updatedAt=Date.now();persistLocalState();if(replaceCloud)replaceCloudOnNextSync=true;scheduleCloudSync()}
function loadAuthSession(){try{return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)||"null")}catch{return null}}
function setAuthSession(next){authSession=next;if(next)localStorage.setItem(AUTH_STORAGE_KEY,JSON.stringify(next));else localStorage.removeItem(AUTH_STORAGE_KEY);renderAccountUI()}
function authHeaders(token=authSession?.access_token){const headers={apikey:SUPABASE_KEY,"Content-Type":"application/json"};if(token)headers.Authorization=`Bearer ${token}`;return headers}
async function supabaseRequest(path,{method="GET",body,token,headers={}}={}){const response=await fetch(`${SUPABASE_URL}${path}`,{method,headers:{...authHeaders(token),...headers},body:body===undefined?undefined:JSON.stringify(body)});if(!response.ok){let detail={};try{detail=await response.json()}catch{}throw new Error(detail.msg||detail.message||detail.error_description||detail.error||`请求失败（${response.status}）`)}if(response.status===204)return null;const text=await response.text();return text?JSON.parse(text):null}
function normalizeSession(data){if(!data?.access_token)return null;return {...data,expires_at:data.expires_at||Math.floor(Date.now()/1000)+(data.expires_in||3600)}}
async function ensureSession(){if(!authSession)return null;if((authSession.expires_at||0)>Math.floor(Date.now()/1000)+60)return authSession;try{const data=await supabaseRequest("/auth/v1/token?grant_type=refresh_token",{method:"POST",body:{refresh_token:authSession.refresh_token},token:null});setAuthSession(normalizeSession(data));return authSession}catch{setAuthSession(null);syncStatus="登录已过期，请重新登录";return null}}
function wordRecordScore(record={}){return +(record.modifiedAt||0)||Date.parse(record.lastSeen||"")||+(record.seen||0)}
function mergeProgress(local,cloud){
  const a={...defaultState,...(local||{}),words:{...(local?.words||{})},activity:{...(local?.activity||{})}},b={...defaultState,...(cloud||{})};
  const merged={...defaultState,dailyGoal:(b.updatedAt||0)>(a.updatedAt||0)?b.dailyGoal:a.dailyGoal,words:{},activity:{},lastStudyDate:[a.lastStudyDate,b.lastStudyDate].filter(Boolean).sort().pop()||null,updatedAt:Math.max(a.updatedAt||0,b.updatedAt||0)};
  new Set([...Object.keys(a.words||{}),...Object.keys(b.words||{})]).forEach(id=>{const left=a.words?.[id],right=b.words?.[id];merged.words[id]=!left?right:!right?left:wordRecordScore(right)>wordRecordScore(left)?right:left});
  new Set([...Object.keys(a.activity||{}),...Object.keys(b.activity||{})]).forEach(day=>{const left=a.activity?.[day]||{},right=b.activity?.[day]||{};merged.activity[day]={completed:Math.max(left.completed||0,right.completed||0),reviews:Math.max(left.reviews||0,right.reviews||0),new:Math.max(left.new||0,right.new||0),spelling:Math.max(left.spelling||0,right.spelling||0)}});
  return merged;
}
function scheduleCloudSync(){if(!authSession)return;clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncProgress(),900)}
async function syncProgress(notify=false){
  if(!authSession)return false;if(syncBusy){syncQueued=true;return false}syncBusy=true;const replaceCloud=replaceCloudOnNextSync;replaceCloudOnNextSync=false;syncStatus="正在同步…";renderAccountUI();
  try{const valid=await ensureSession();if(!valid)throw new Error("登录已过期");const rows=await supabaseRequest(`/rest/v1/user_progress?select=state&user_id=eq.${encodeURIComponent(valid.user.id)}`);if(!replaceCloud)state=mergeProgress(state,rows?.[0]?.state);persistLocalState();await supabaseRequest("/rest/v1/user_progress?on_conflict=user_id",{method:"POST",body:{user_id:valid.user.id,state},token:valid.access_token,headers:{Prefer:"resolution=merge-duplicates"}});syncStatus=`已同步 · ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`;renderDashboard();renderLibrary();renderProgress();if(notify)showToast("学习进度已同步")}
  catch(error){if(replaceCloud)replaceCloudOnNextSync=true;syncStatus="同步失败，稍后会自动重试";clearTimeout(syncTimer);if(authSession)syncTimer=setTimeout(()=>syncProgress(),15000);if(notify)showToast(authErrorText(error.message))}
  finally{syncBusy=false;renderAccountUI();if(syncQueued){syncQueued=false;scheduleCloudSync()}}
  return true;
}
function ws(id){return state.words[id]||{stage:-1,due:0,errors:0,unknowns:0,correct:0,seen:0,lastSeen:null,learnedOn:null}}
function learnedToday(){const t=localDate();return Object.values(state.words).filter(x=>x.learnedOn===t).length}
function dueWords(){const now=dayStart();return WORDS.filter(w=>{const s=ws(w.id);return s.stage>=0&&s.due<=now}).sort((a,b)=>(ws(b.id).unknowns||0)-(ws(a.id).unknowns||0)||(ws(b.id).errors||0)-(ws(a.id).errors||0)||ws(a.id).due-ws(b.id).due)}
function unseenWords(){return WORDS.filter(w=>ws(w.id).stage<0)}
function weakWords(){return WORDS.filter(w=>ws(w.id).errors>0||(ws(w.id).unknowns||0)>0).sort((a,b)=>(ws(b.id).unknowns||0)-(ws(a.id).unknowns||0)||ws(b.id).errors-ws(a.id).errors)}
function newAllowance(){return Math.max(0,state.dailyGoal-learnedToday())}
function todayQueue(){return [...dueWords(),...unseenWords().slice(0,newAllowance())]}
function streak(){const days=Object.keys(state.activity).filter(k=>state.activity[k]?.completed>0).sort().reverse();if(!days.length)return 0;let cursor=dayStart(),count=0;const today=localDate();if(days[0]!==today)cursor-=DAY;while(days.includes(localDate(new Date(cursor)))){count++;cursor-=DAY}return count}
function showToast(text){const el=document.querySelector("#toast");el.textContent=text;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function speakWord(text){
  if(!("speechSynthesis" in window)){showToast("当前浏览器不支持语音播放");return}
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);utterance.lang="en-US";utterance.rate=.78;utterance.pitch=1;
  const voices=window.speechSynthesis.getVoices();utterance.voice=voices.find(v=>v.lang==="en-US")||voices.find(v=>v.lang.startsWith("en"))||null;
  window.speechSynthesis.speak(utterance);
}

function authErrorText(message=""){
  const text=message.toLowerCase();
  if(text.includes("invalid login credentials"))return "邮箱或密码不正确";
  if(text.includes("email not confirmed"))return "请先打开验证邮件完成邮箱确认";
  if(text.includes("user already registered"))return "这个邮箱已经注册，请直接登录";
  if(text.includes("password should be"))return "密码至少需要 6 位";
  if(text.includes("unable to validate")||text.includes("expired"))return "登录已过期，请重新登录";
  if(text.includes("failed to fetch")||text.includes("network"))return "网络连接失败，请稍后重试";
  return message||"操作失败，请稍后重试";
}
function accountLabel(){return authSession?.user?.email?.split("@")[0]||"登录并同步"}
function renderAccountUI(){
  const signedIn=!!authSession?.user, name=document.querySelector("#profile-name"),avatar=document.querySelector("#profile-avatar"),icon=document.querySelector(".account-icon");
  if(name)name.textContent=signedIn?accountLabel():"登录并同步";
  if(avatar)avatar.textContent=signedIn?accountLabel().slice(0,2).toUpperCase():"Hi";
  if(icon){icon.textContent=signedIn?"✓":"☁";icon.classList.toggle("synced",signedIn)}
  const modal=document.querySelector("#auth-modal");if(modal?.classList.contains("active"))renderAuthModal();
}
function renderAuthModal(){
  const content=document.querySelector("#auth-content");if(!content)return;
  if(authSession?.user){
    content.innerHTML=`<span class="eyebrow">CLOUD SYNC · 云端同步</span><h2>进度已连接</h2><p class="auth-lead">同一账号登录手机、平板或电脑，学习记录会自动合并。</p><div class="account-summary"><div class="avatar">${escapeAttr(accountLabel().slice(0,2).toUpperCase())}</div><div><strong>${escapeAttr(authSession.user.email||"")}</strong><small id="sync-status-text">${escapeAttr(syncStatus)}</small></div></div><button class="primary-button full" id="sync-now" ${syncBusy?"disabled":""}>${syncBusy?"正在同步…":"立即同步"}</button><button class="text-button danger" id="logout-account">退出登录</button>`;
    document.querySelector("#sync-now").onclick=()=>syncProgress(true);
    document.querySelector("#logout-account").onclick=logoutAccount;
    return;
  }
  const isLogin=authMode==="login";
  content.innerHTML=`<span class="eyebrow">CLOUD SYNC · 云端同步</span><h2>${isLogin?"登录同步进度":"创建学习账号"}</h2><p class="auth-lead">${isLogin?"在所有设备上使用同一个邮箱和密码。":"注册后，当前设备已有的学习记录会自动上传。"}</p><div class="auth-tabs"><button class="${isLogin?"active":""}" data-auth-mode="login">登录</button><button class="${!isLogin?"active":""}" data-auth-mode="signup">注册</button></div><form class="auth-form" id="auth-form"><label>邮箱<input id="auth-email" type="email" autocomplete="email" placeholder="name@example.com" required></label><label>密码<input id="auth-password" type="password" autocomplete="${isLogin?"current-password":"new-password"}" minlength="6" placeholder="至少 6 位" required></label>${authMessage?`<p class="auth-message">${escapeAttr(authMessage)}</p>`:""}<button class="primary-button full" type="submit">${isLogin?"登录并同步":"注册账号"}</button></form><p class="privacy-note">密码由 Supabase 安全处理，WordStep 不会读取或保存明文密码。</p>`;
  content.querySelectorAll("[data-auth-mode]").forEach(button=>button.onclick=()=>{authMode=button.dataset.authMode;authMessage="";renderAuthModal()});
  document.querySelector("#auth-form").onsubmit=handleAuthSubmit;
}
async function handleAuthSubmit(event){
  event.preventDefault();const email=document.querySelector("#auth-email").value.trim(),password=document.querySelector("#auth-password").value,button=event.submitter||event.currentTarget.querySelector("button[type=submit]");button.disabled=true;button.textContent=authMode==="login"?"正在登录…":"正在注册…";authMessage="";
  try{
    if(authMode==="signup"){
      const redirect=encodeURIComponent(`${location.origin}${location.pathname}`),data=await supabaseRequest(`/auth/v1/signup?redirect_to=${redirect}`,{method:"POST",body:{email,password}}),next=normalizeSession(data);
      if(next){setAuthSession(next);syncStatus="正在合并本机与云端进度…";await syncProgress(true);document.querySelector("#auth-modal").classList.remove("active")}
      else{authMode="login";authMessage="注册成功！请打开邮箱中的验证邮件，验证后再回来登录。";renderAuthModal()}
    }else{
      const data=await supabaseRequest("/auth/v1/token?grant_type=password",{method:"POST",body:{email,password},token:null});setAuthSession(normalizeSession(data));syncStatus="正在合并本机与云端进度…";await syncProgress(true);document.querySelector("#auth-modal").classList.remove("active")
    }
  }catch(error){authMessage=authErrorText(error.message);renderAuthModal()}
}
async function logoutAccount(){
  const current=authSession;try{await syncProgress();if(current)await supabaseRequest("/auth/v1/logout",{method:"POST",token:current.access_token})}catch{}setAuthSession(null);syncStatus="未登录 · 进度仅保存在当前设备";authMessage="";renderAuthModal();showToast("已退出登录，本机进度仍会保留")
}
async function initAuth(){
  renderAccountUI();if(!authSession)return;syncStatus="正在连接云端…";renderAccountUI();const valid=await ensureSession();if(valid)await syncProgress();else renderAccountUI()
}

function renderDashboard(){
  const due=dueWords().length, fresh=Math.min(newAllowance(),unseenWords().length), weak=weakWords().length, total=due+fresh;
  document.querySelector("#today-date").textContent=new Intl.DateTimeFormat("zh-CN",{month:"long",day:"numeric",weekday:"long"}).format(new Date());
  document.querySelector("#streak-number").textContent=streak();document.querySelector("#profile-streak").textContent=`连续学习 ${streak()} 天`;
  document.querySelector("#review-count").textContent=due;document.querySelector("#new-count").textContent=fresh;document.querySelector("#weak-count").textContent=weak;
  document.querySelector("#task-total").textContent=`${total} 个待完成`;
  document.querySelector("#plan-summary").textContent= total ? `先复习 ${due} 词，再学习 ${fresh} 个新词，约需 ${Math.max(3,Math.ceil(total*0.7))} 分钟。` : "今天的计划已经完成。轻松一下，明天继续。";
  const btn=document.querySelector("#start-session");btn.innerHTML=total?"开始今日学习 <span>→</span>":"再练一组易错词 <span>→</span>";
  const next=unseenWords()[0];document.querySelector("#today-scene").textContent=`场景 · ${next?.category||"已完成全部词库"}`;
  const activity=state.activity[localDate()]||{};document.querySelector("#review-progress").style.width=`${due?Math.min(100,(activity.reviews||0)/(due+(activity.reviews||0))*100):100}%`;
  document.querySelector("#new-progress").style.width=`${state.dailyGoal?learnedToday()/state.dailyGoal*100:0}%`;document.querySelector("#weak-progress").style.width=`${weak?Math.min(100,(activity.spelling||0)/weak*100):100}%`;
  renderWeek();
}
function renderWeek(){const box=document.querySelector("#week-chart");box.innerHTML="";let total=0;const labels=["日","一","二","三","四","五","六"];for(let i=6;i>=0;i--){const d=new Date(dayStart()-i*DAY),key=localDate(d),n=state.activity[key]?.completed||0;total+=n;box.insertAdjacentHTML("beforeend",`<div class="day-bar ${i===0?"today":""}"><div class="bar-track"><span class="bar-fill" style="height:${Math.min(100,Math.max(n?8:3,n*5))}%"></span></div><small>周${labels[d.getDay()]}</small></div>`)}document.querySelector("#week-total").textContent=`已练习 ${total} 词`}

function renderLibrary(){
  document.querySelector("#category-filters").innerHTML=["全部",...categoryNames].map(c=>`<button class="filter-button ${c===activeCategory?"active":""}" data-category="${c}">${c}</button>`).join("");
  const learned=WORDS.filter(w=>ws(w.id).stage>=0).length, mastered=WORDS.filter(w=>ws(w.id).stage>=5).length;
  document.querySelector("#library-stats").innerHTML=`<span class="small-stat"><strong>${WORDS.length}</strong> 总词汇</span><span class="small-stat"><strong>${learned}</strong> 已学习</span><span class="small-stat"><strong>${mastered}</strong> 已掌握</span>`;
  const q=document.querySelector("#word-search").value.trim().toLowerCase();const filtered=WORDS.filter(w=>(activeCategory==="全部"||w.category===activeCategory)&&(!q||w.en.includes(q)||w.zh.includes(q)));
  const visible=filtered.slice(0,libraryLimit);
  document.querySelector("#word-list").innerHTML=filtered.length?visible.map(w=>{const s=ws(w.id);const status=s.stage<0?["未学习",""]:s.stage>=5?["已掌握","mastered"]:["学习中","learning"];return `<div class="word-row"><div class="word-en"><div class="word-title"><strong>${w.en}</strong><button class="speak-button" data-speak="${escapeAttr(w.en)}" aria-label="朗读 ${escapeAttr(w.en)}" title="点击发音">🔊</button></div><small>${w.phonetic}</small></div><div class="word-zh">${w.zh}</div><div class="word-example">${w.example||`场景 · ${w.category}`}<br><small>${w.exampleZh||"点击扬声器听发音"}</small></div><span class="status-badge ${status[1]}">${status[0]}</span></div>`}).join("")+`${visible.length<filtered.length?`<button class="load-more" id="load-more">再显示 ${Math.min(100,filtered.length-visible.length)} 个 · 共 ${filtered.length} 个</button>`:""}`:`<div class="empty-state">没有找到匹配的单词</div>`;
}
function renderProgress(){
  const learned=WORDS.filter(w=>ws(w.id).stage>=0), mastered=learned.filter(w=>ws(w.id).stage>=5), errors=Object.values(state.words).reduce((n,s)=>n+(s.errors||0),0), practiced=Object.values(state.activity).reduce((n,a)=>n+(a.completed||0),0);
  document.querySelector("#progress-stats").innerHTML=[[learned.length,"已学习词汇","持续积累中"],[mastered.length,"长期掌握","间隔 ≥ 30 天"],[streak(),"连续学习","天"],[practiced,"累计练习","次"]].map(x=>`<article class="big-stat"><span>${x[1]}</span><strong>${x[0]}</strong><small>${x[2]}</small></article>`).join("");
  const stages=[{n:"新认识",min:0,max:1},{n:"短期记忆",min:2,max:3},{n:"正在巩固",min:4,max:4},{n:"长期掌握",min:5,max:99}],counts=[];stages.forEach(x=>counts.push(learned.filter(w=>ws(w.id).stage>=x.min&&ws(w.id).stage<=x.max).length));const max=Math.max(1,...counts);
  document.querySelector("#stage-list").innerHTML=stages.map((x,i)=>`<div class="stage-row"><span>${x.n}</span><div class="stage-track"><div class="stage-fill" style="width:${counts[i]/max*100}%;opacity:${.55+i*.15}"></div></div><strong>${counts[i]}</strong></div>`).join("");
}

function switchView(name){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===`${name}-view`));document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===name));if(name==="library")renderLibrary();if(name==="progress")renderProgress();window.scrollTo(0,0)}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function distractors(word, field){return shuffle(WORDS.filter(w=>w.id!==word.id&&w.category===word.category)).slice(0,3).map(w=>w[field])}
function openSession(){
  let queue=todayQueue(),isExtra=false;if(!queue.length){queue=weakWords().slice(0,Math.max(5,state.dailyGoal));isExtra=true}if(!queue.length){showToast("全部词汇都完成了，太棒了！");return}
  session={queue,idx:0,phase:"choice",correct:0,errors:0,unknowns:0,isExtra,currentHadError:false,currentErrorCount:0,currentUnknown:false,forceCorrection:false};
  document.querySelector("#session-overlay").classList.add("active");document.querySelector("#session-overlay").setAttribute("aria-hidden","false");renderQuestion();
}
function currentWord(){return session.queue[session.idx]}
function renderQuestion(){
  const w=currentWord(),progress=(session.idx/session.queue.length)*100;document.querySelector("#session-progress-bar").style.width=`${progress}%`;document.querySelector("#session-step").textContent=`${session.idx+1} / ${session.queue.length}`;
  if(session.phase==="choice"){
    const reverse=(w.id+session.idx)%2===0,field=reverse?"en":"zh",question=reverse?w.zh:w.en,answers=shuffle([w[field],...distractors(w,field)]);
    document.querySelector("#study-card").innerHTML=`<span class="question-type">${reverse?"中文 → 英文":"英文 → 中文"}</span><div class="question-word-row"><h2 class="question-main ${reverse?"chinese":""}">${question}</h2>${reverse?"":`<button class="speak-button large" data-speak="${escapeAttr(w.en)}" aria-label="朗读 ${escapeAttr(w.en)}">🔊</button>`}</div>${reverse?"":`<span class="phonetic">${w.phonetic}</span>`}<p class="question-note">选择正确含义，然后完成拼写</p><div class="choice-grid">${answers.map(a=>`<button class="choice" data-answer="${escapeAttr(a)}">${a}</button>`).join("")}</div><div class="choice-unknown-wrap"><button class="unknown-button" id="choice-unknown" type="button">不认识这个词</button></div><div id="choice-feedback"></div>`;
    document.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>answerChoice(btn,w[field],field==="en"?w.en:"")));
    document.querySelector("#choice-unknown").onclick=()=>markChoiceUnknown(w[field],field==="en"?w.en:"");
  }else renderSpelling();
}
function lockChoice(answer){document.querySelectorAll(".choice").forEach(b=>{b.disabled=true;if(b.dataset.answer===answer)b.classList.add("correct")});const unknown=document.querySelector("#choice-unknown");if(unknown)unknown.disabled=true}
function choiceFeedback({correct,answer,speakText,unknown=false}){document.querySelector("#choice-feedback").innerHTML=`<div class="feedback ${correct?"success":"error"}"><strong>${unknown?"已标记为不认识，正确答案：":correct?"答对了！":"记一下正确答案："} ${answer}</strong><div class="feedback-actions">${speakText?`<button class="speak-button" data-speak="${escapeAttr(speakText)}" aria-label="朗读 ${escapeAttr(speakText)}">🔊</button>`:""}<button class="continue-button" id="to-spelling">继续拼写 →</button></div></div>`;document.querySelector("#to-spelling").onclick=()=>{session.phase="spelling";renderQuestion()}}
function answerChoice(btn,answer,speakText){const correct=btn.dataset.answer===answer;lockChoice(answer);if(!correct){btn.classList.add("wrong");session.errors++;session.currentErrorCount++;session.currentHadError=true}choiceFeedback({correct,answer,speakText})}
function markChoiceUnknown(answer,speakText){lockChoice(answer);session.errors++;session.unknowns++;session.currentErrorCount+=2;session.currentHadError=true;session.currentUnknown=true;session.forceCorrection=true;choiceFeedback({correct:false,answer,speakText,unknown:true})}
function renderSpelling(){const w=currentWord(),clue=w.example?w.example.replace(new RegExp(w.en,"i"),"______"):`场景 · ${w.category}　根据中文含义拼写英文`;document.querySelector("#study-card").innerHTML=`<span class="question-type">拼写练习 · 必须拼对才能继续</span><h2 class="question-main chinese">${w.zh}</h2><p class="question-note">${clue}</p><form class="spell-form" id="spell-form"><input class="spell-input" id="spell-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="输入英文单词" aria-label="输入英文拼写"><div class="spell-actions"><button class="primary-button" type="submit">检查拼写</button><button class="unknown-button" id="spell-unknown" type="button">不认识</button></div><div id="spell-feedback" aria-live="polite"></div></form>`;const input=document.querySelector("#spell-input");input.focus();document.querySelector("#spell-form").onsubmit=e=>{e.preventDefault();checkSpelling(input.value)};document.querySelector("#spell-unknown").onclick=markSpellingUnknown }
function showSpellingCorrection(){const w=currentWord(),input=document.querySelector("#spell-input");input.classList.add("error");input.value="";input.placeholder="看一遍答案，再重新输入";document.querySelector("#spell-feedback").innerHTML=`<div class="correction-box">正确拼写是<div class="correction-word"><strong>${w.en}</strong><button type="button" class="speak-button" data-speak="${escapeAttr(w.en)}" aria-label="朗读 ${escapeAttr(w.en)}">🔊</button></div>请重新完整输入一次，拼对后才能继续。</div>`;input.focus()}
function markSpellingUnknown(){if(!session.currentUnknown){session.errors++;session.unknowns++;session.currentErrorCount+=2;session.currentHadError=true;session.currentUnknown=true}session.forceCorrection=true;const button=document.querySelector("#spell-unknown");if(button)button.disabled=true;showSpellingCorrection()}
function checkSpelling(value){const w=currentWord(),input=document.querySelector("#spell-input"),normalized=value.trim().toLowerCase();if(normalized===w.en.toLowerCase()){
    input.classList.add("success");input.disabled=true;document.querySelector(".spell-actions").hidden=true;session.correct++;const label=session.forceCorrection?"重新拼对了，这次会记得更牢。":"拼写正确！";document.querySelector("#spell-feedback").innerHTML=`<div class="feedback success"><strong>✓ ${label}</strong><div class="feedback-actions"><button type="button" class="speak-button" data-speak="${escapeAttr(w.en)}" aria-label="朗读 ${escapeAttr(w.en)}">🔊</button><button type="button" class="continue-button" id="next-word">继续 →</button></div></div>`;document.querySelector("#next-word").onclick=finishWord;
  }else{
    session.errors++;session.currentErrorCount++;session.currentHadError=true;session.forceCorrection=true;showSpellingCorrection();
  }}
function finishWord(){
  const w=currentWord(),s=ws(w.id),wasNew=s.stage<0;let stage=s.stage;
  if(session.currentUnknown)stage=0;else if(session.currentHadError)stage=Math.max(0,stage-1);else stage=Math.min(STAGE_DAYS.length-1,stage+1);
  if(wasNew)stage=0;const unknownTotal=session.currentUnknown?(s.unknowns||0)+1:Math.max(0,(s.unknowns||0)-(session.currentHadError?0:1)),errorPenalty=Math.min(0.75,(s.errors+session.currentErrorCount)*.08+unknownTotal*.1),interval=Math.max(1,Math.round(STAGE_DAYS[stage]*(1-errorPenalty)));
  state.words[w.id]={...s,stage,due:dayStart()+interval*DAY,errors:s.errors+session.currentErrorCount,unknowns:unknownTotal,correct:s.correct+(!session.currentHadError?1:0),seen:s.seen+1,lastSeen:localDate(),learnedOn:s.learnedOn||(wasNew?localDate():null),modifiedAt:Date.now()};
  const key=localDate(),a=state.activity[key]||{};state.activity[key]={completed:(a.completed||0)+1,reviews:(a.reviews||0)+(wasNew?0:1),new:(a.new||0)+(wasNew?1:0),spelling:(a.spelling||0)+1};state.lastStudyDate=key;saveState();
  session.idx++;session.phase="choice";session.currentHadError=false;session.currentErrorCount=0;session.currentUnknown=false;session.forceCorrection=false;if(session.idx>=session.queue.length)renderComplete();else renderQuestion();
}
function renderComplete(){document.querySelector("#session-progress-bar").style.width="100%";document.querySelector("#session-step").textContent="完成";document.querySelector("#study-card").innerHTML=`<div class="completion-icon">✓</div><span class="question-type">TODAY COMPLETE</span><h2 class="question-main chinese">今天的训练完成了！</h2><p class="question-note">记忆不靠一次记住，而靠每次及时回来。</p><div class="completion-stats"><div><strong>${session.queue.length}</strong><span>完成词数</span></div><div><strong>${session.correct}</strong><span>正确拼写</span></div><div><strong>${session.errors}</strong><span>纠正次数</span></div></div><button class="primary-button" id="finish-session">返回首页</button>`;document.querySelector("#finish-session").onclick=closeSession}
function closeSession(){document.querySelector("#session-overlay").classList.remove("active");document.querySelector("#session-overlay").setAttribute("aria-hidden","true");session=null;renderDashboard();renderProgress()}
function escapeAttr(s){return String(s).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;")}

document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
document.querySelectorAll('[data-action="open-settings"]').forEach(b=>b.addEventListener("click",()=>{document.querySelector("#daily-range").value=state.dailyGoal;updateRange();document.querySelector("#settings-modal").classList.add("active")}));
document.querySelectorAll('[data-action="close-settings"]').forEach(b=>b.addEventListener("click",()=>document.querySelector("#settings-modal").classList.remove("active")));
document.querySelectorAll('[data-action="open-auth"]').forEach(b=>b.addEventListener("click",()=>{authMessage="";renderAuthModal();document.querySelector("#auth-modal").classList.add("active")}));
document.querySelectorAll('[data-action="close-auth"]').forEach(b=>b.addEventListener("click",()=>document.querySelector("#auth-modal").classList.remove("active")));
document.querySelector("#daily-range").addEventListener("input",updateRange);function updateRange(){const n=+document.querySelector("#daily-range").value;document.querySelector("#daily-value").textContent=n;document.querySelector("#estimated-time").textContent=Math.ceil(n*.75)}
document.querySelector("#save-settings").onclick=()=>{state.dailyGoal=+document.querySelector("#daily-range").value;saveState();document.querySelector("#settings-modal").classList.remove("active");renderDashboard();showToast("学习计划已更新")};
document.querySelector("#reset-progress").onclick=()=>{if(confirm("确定要清除全部学习记录吗？此操作无法撤销。")){state=structuredClone(defaultState);saveState({replaceCloud:true});document.querySelector("#settings-modal").classList.remove("active");renderDashboard();showToast("学习记录已重置")}};
document.querySelector("#start-session").onclick=openSession;document.querySelector("#close-session").onclick=()=>{if(confirm("要先退出吗？已经完成的单词会保留进度。"))closeSession()};
document.querySelector("#word-search").addEventListener("input",()=>{libraryLimit=100;renderLibrary()});document.querySelector("#category-filters").addEventListener("click",e=>{if(e.target.dataset.category){activeCategory=e.target.dataset.category;libraryLimit=100;renderLibrary()}});
document.querySelector("#word-list").addEventListener("click",e=>{if(e.target.id==="load-more"){libraryLimit+=100;renderLibrary()}});
document.addEventListener("click",e=>{const button=e.target.closest("[data-speak]");if(button){e.preventDefault();e.stopPropagation();speakWord(button.dataset.speak)}});
document.addEventListener("keydown",e=>{if(e.key!=="Enter"||e.repeat||!session||!document.querySelector("#session-overlay").classList.contains("active"))return;const next=document.querySelector("#next-word")||document.querySelector("#to-spelling")||document.querySelector("#finish-session");if(next){e.preventDefault();next.click()}});
document.querySelector("#settings-modal").addEventListener("click",e=>{if(e.target.id==="settings-modal")e.currentTarget.classList.remove("active")});
document.querySelector("#auth-modal").addEventListener("click",e=>{if(e.target.id==="auth-modal")e.currentTarget.classList.remove("active")});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&authSession)syncProgress()});
window.addEventListener("online",()=>{if(authSession)syncProgress()});

renderDashboard();renderLibrary();renderProgress();initAuth();
