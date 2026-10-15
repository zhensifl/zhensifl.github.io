/* Mergeable daily counters. Each page instance owns its own monotonic stream. */
const ACTIVITY_FIELDS=['completed','reviews','new','spelling','attempts','correct','errors','listening'];
const countValue=value=>Math.max(0,Number(value)||0);
const uniqueIds=ids=>[...new Set(ids.map(String))].sort();
function maxCounts(a={},b={}){
  const out={ratings:{}};
  ACTIVITY_FIELDS.forEach(key=>out[key]=Math.max(countValue(a[key]),countValue(b[key])));
  ['again','hard','good','easy'].forEach(key=>out.ratings[key]=Math.max(countValue(a.ratings?.[key]),countValue(b.ratings?.[key])));
  return out;
}
function activityParts(row={},words={},day){
  if(row.sync)return structuredClone(row.sync);
  return {base:maxCounts(row),baseNewIds:Object.entries(words).filter(([,w])=>w.learnedOn===day).map(([id])=>id),streams:{}};
}
function materializeActivity(sync){
  const result=maxCounts(sync.base),newIds=new Set(sync.baseNewIds||[]);
  const legacyNew=Math.max(result.new,newIds.size);
  result.new=legacyNew;
  result.completed=Math.max(result.completed,result.reviews+legacyNew);
  const initialNew=newIds.size;
  for(const stream of Object.values(sync.streams)){
    ACTIVITY_FIELDS.filter(key=>key!=='new').forEach(key=>result[key]+=countValue(stream[key]));
    Object.keys(result.ratings).forEach(key=>result.ratings[key]+=countValue(stream.ratings?.[key]));
    (stream.newIds||[]).forEach(id=>newIds.add(String(id)));
  }
  result.new+=newIds.size-initialNew;
  return {...result,sync};
}
function mergeActivity(a,b,wordsA,wordsB,day){
  const left=activityParts(a,wordsA,day),right=activityParts(b,wordsB,day);
  const sync={base:maxCounts(left.base,right.base),baseNewIds:uniqueIds([...(left.baseNewIds||[]),...(right.baseNewIds||[])]),streams:{}};
  for(const id of new Set([...Object.keys(left.streams),...Object.keys(right.streams)])){
    const x=left.streams[id]||{},y=right.streams[id]||{};
    sync.streams[id]={...maxCounts(x,y),newIds:uniqueIds([...(x.newIds||[]),...(y.newIds||[])])};
  }
  return materializeActivity(sync);
}
function recordActivity(progress,day,actor,wordId,wasNew,hadError,errors,listening,rating){
  const sync=activityParts(progress.activity[day],progress.words,day);
  const stream=sync.streams[actor]||{...maxCounts(),newIds:[]};
  for(const key of ['completed','spelling','attempts'])stream[key]++;
  stream.reviews+=wasNew?0:1;stream.correct+=hadError?0:1;
  stream.errors+=countValue(errors);stream.listening+=listening?1:0;
  stream.ratings[rating]=(stream.ratings[rating]||0)+1;
  if(wasNew)stream.newIds=uniqueIds([...stream.newIds,wordId]);
  sync.streams[actor]=stream;
  progress.activity[day]=materializeActivity(sync);
}
function mergeSetting(a,b,key,fallback){
  const left=a.settingClocks?.[key],right=b.settingClocks?.[key];
  if(left!==undefined||right!==undefined){
    if(countValue(left)!==countValue(right))return countValue(left)>countValue(right)?a[key]:b[key];
    if(!countValue(left)&&countValue(a.settingsBaselineAt)!==countValue(b.settingsBaselineAt))return countValue(a.settingsBaselineAt)>countValue(b.settingsBaselineAt)?a[key]:b[key];
    return [a[key]??fallback,b[key]??fallback].sort((x,y)=>JSON.stringify(x).localeCompare(JSON.stringify(y)))[1];
  }
  return (countValue(a.updatedAt)>=countValue(b.updatedAt)?a[key]:b[key])??fallback;
}
