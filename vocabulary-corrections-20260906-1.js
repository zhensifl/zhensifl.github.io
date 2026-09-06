/* Reviewed senses applied before word IDs and study cards are constructed. */
(() => {
  const corrections={
    hospice:['n. 临终关怀机构','She works as a nurse at a hospice.','她在一家临终关怀机构担任护士。','/ˈhɒspɪs/'],
    headquarters:['n. 总部；总公司','Our company moved its headquarters to a larger building.','我们公司把总部搬到了一栋更大的楼里。','/ˌhedˈkwɔːtəz/'],
    shank:['n. 小腿','The shank is the part of the leg between the knee and the ankle.','小腿是膝盖和脚踝之间的腿部。','/ʃæŋk/'],
    curl:['v. 卷曲；卷起','She uses a small brush to curl her hair.','她用一把小刷子把头发卷起来。','/kɜːl/'],
    booty:['n. 战利品','The pirates divided the booty among themselves.','海盗们把战利品分了。','/ˈbuːti/'],
    contrast:['n. 差异；对比','There is a clear contrast between the two proposals.','这两个方案之间有明显的差异。','/ˈkɒntrɑːst/']
  };
  for(const word of window.WORD_DATA||[]){
    if(!Object.hasOwn(corrections,word.en))continue;
    const fix=corrections[word.en];
    [word.zh,word.example,word.exampleZh,word.phonetic]=fix;
    Object.assign(word,{exampleType:'sentence',exampleSource:'WordStep curated',qualityReady:true,editorialVersion:'20260906-1'});
  }
})();
