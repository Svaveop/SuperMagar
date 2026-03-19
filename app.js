// ─── UTILITIES ───────────────────────────────────────────────────
function toast(msg, dur = 2800) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), dur);
}

function openModal(id) {
  const ov = document.getElementById(id);
  if (ov) { ov.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const ov = document.getElementById(id);
  if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('ov')) closeModal(e.target.id);
});

function animateBars() {
  document.querySelectorAll('.prog-fill[data-w]').forEach(el => {
    setTimeout(() => { el.style.width = el.dataset.w; }, 300);
  });
}

function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.ni').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
}

// ─── CHAT ─────────────────────────────────────────────────────────
const chatFlow = [
  { bot: "Բարև! 👋 Ես քո ռումիներերի ուղեկիցն եմ։\nՔո անունն ի՞նչ է:" },
  { bot: "Ուրախ եմ ծանոթանալ, {name}! 🎉\nԻ՞նչ նպատակով ես ուզում սովորել ռումիներեն:" },
  { bot: "Հրաշալի ընտրություն! ✨\nՈ՞ր մակարդակից ենք սկսում:" },
  { bot: "Կատարյալ է։ Ես կստեղծեմ քո անձնական ուսուցման ուղին 🗺️\nՊատրա՞ստ ես:", action: 'showStart' },
];
let chatStep = 0, userName = '';

function initChat() {
  if (!document.getElementById('chatWrap')) return;
  setTimeout(() => addBotBubble(chatFlow[0].bot), 600);
  document.getElementById('sendBtn')?.addEventListener('click', sendChat);
  document.getElementById('chatInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') sendChat(); });
}

function sendChat() {
  const inp = document.getElementById('chatInput');
  if (!inp || !inp.value.trim()) return;
  const msg = inp.value.trim(); inp.value = '';
  addUserBubble(msg);
  handleBotReply(msg);
}

function handleBotReply(userMsg) {
  if (chatStep === 0) userName = userMsg.split(' ')[0];
  chatStep++;
  if (chatStep >= chatFlow.length) return;
  showTyping();
  setTimeout(() => {
    removeTyping();
    const text = chatFlow[chatStep].bot.replace('{name}', userName);
    addBotBubble(text);
    if (chatStep === 1) showQuickReplies(['Ճամփորդություն ✈️', 'Ուսումնասիրություն 📚', 'Հաղորդակցություն 💬', 'Աշխատանք 💼']);
    if (chatStep === 2) showQuickReplies(['Հենց նոր սկսում եմ 🌱', 'Մի փոքր գիտեմ 🌿', 'Ունեմ բազա 🌳']);
    if (chatFlow[chatStep].action === 'showStart') showStartBtn();
  }, 1100);
}

function addBotBubble(text) {
  const w = document.getElementById('chatWrap');
  if (!w) return;
  const d = document.createElement('div'); d.className = 'bubble bot';
  d.innerHTML = text.replace(/\n/g, '<br>'); w.appendChild(d); w.scrollTop = w.scrollHeight;
}
function addUserBubble(text) {
  const w = document.getElementById('chatWrap');
  if (!w) return;
  const d = document.createElement('div'); d.className = 'bubble user';
  d.textContent = text; w.appendChild(d); w.scrollTop = w.scrollHeight;
}
function showTyping() {
  const w = document.getElementById('chatWrap');
  if (!w) return;
  const d = document.createElement('div'); d.className = 'bubble bot'; d.id = 'typing';
  d.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  w.appendChild(d); w.scrollTop = w.scrollHeight;
}
function removeTyping() { document.getElementById('typing')?.remove(); }
function showQuickReplies(opts) {
  const w = document.getElementById('chatWrap');
  if (!w) return;
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;padding:4px 0;';
  opts.forEach(o => {
    const btn = document.createElement('button'); btn.className = 'btn btn-g btn-sm'; btn.textContent = o;
    btn.onclick = () => { addUserBubble(o); row.remove(); handleBotReply(o); };
    row.appendChild(btn);
  });
  w.appendChild(row); w.scrollTop = w.scrollHeight;
}
function showStartBtn() {
  const w = document.getElementById('chatWrap');
  if (!w) return;
  const d = document.createElement('div'); d.style.padding = '8px 0';
  d.innerHTML = '<a href="lesson.html" class="btn btn-p btn-full" style="display:flex">Սկսել այսօրվա դասը →</a>';
  w.appendChild(d); w.scrollTop = w.scrollHeight;
}

// ─── LESSON ───────────────────────────────────────────────────────
function initLesson() {
  document.querySelectorAll('.lcard[data-modal]').forEach(c => {
    c.addEventListener('click', () => openModal(c.dataset.modal));
  });
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
  initVocabQuiz(); initGrammarQuiz(); initConvo(); initQuickTest();
  document.getElementById('finishLesson')?.addEventListener('click', () => {
    toast('🎉 Դու ավարտեցիր այսօրվա դասը!');
    setTimeout(() => location.href = 'extra.html', 1400);
  });
}

const vocabWords = [
  { ro:'Bună ziua', hy:'Բարև ձեզ', ipa:'/ˈbu.nə ˈzi.u.a/', em:'👋' },
  { ro:'Mulțumesc', hy:'Շնորհակալություն', ipa:'/mul.t͡suˈmesk/', em:'🙏' },
  { ro:'Familie', hy:'Ընտանիք', ipa:'/faˈmi.li.e/', em:'👨‍👩‍👧' },
  { ro:'Mâncare', hy:'Ուտելիք', ipa:'/mɨnˈka.re/', em:'🍽️' },
  { ro:'Frumos', hy:'Գեղեցիկ', ipa:'/fruˈmos/', em:'✨' },
  { ro:'Iubire', hy:'Սեր', ipa:'/juˈbi.re/', em:'❤️' },
];
let vIdx=0, vocabAnswered=false;

function initVocabQuiz() {
  renderVocabCard();
  document.getElementById('vocabNext')?.addEventListener('click', () => {
    if (!vocabAnswered) { toast('⚠️ Ընտրիր պատասխան'); return; }
    vIdx = (vIdx+1) % vocabWords.length; vocabAnswered=false; renderVocabCard();
  });
}
function renderVocabCard() {
  const w = vocabWords[vIdx];
  const wordEl=document.getElementById('vocabWord'), ipaEl=document.getElementById('vocabIpa'), emEl=document.getElementById('vocabEmoji');
  if (wordEl) wordEl.textContent=w.ro;
  if (ipaEl) ipaEl.textContent=w.ipa;
  if (emEl) emEl.textContent=w.em;
  const cont=document.getElementById('vocabOpts'); if(!cont) return;
  const opts=[w.hy]; const others=vocabWords.filter((_,i)=>i!==vIdx).map(x=>x.hy);
  while(opts.length<4){ const r=others[Math.floor(Math.random()*others.length)]; if(!opts.includes(r)) opts.push(r); }
  opts.sort(()=>Math.random()-.5); cont.innerHTML='';
  opts.forEach(o => {
    const d=document.createElement('div'); d.className='opt'; d.textContent=o;
    d.onclick=()=>{ if(vocabAnswered) return; vocabAnswered=true;
      if(o===w.hy){d.classList.add('correct');toast('✅ Ճիշտ!');}
      else{d.classList.add('wrong');cont.querySelectorAll('.opt').forEach(x=>{if(x.textContent===w.hy)x.classList.add('correct');});toast('❌ Ճիշտ պատասխանն է՝ '+w.hy);}
    };
    cont.appendChild(d);
  });
}

const grammarQ=[
  {q:'Ռումիներեն «Ես եմ»',opts:['Eu sunt','Tu ești','El este','Noi suntem'],ans:'Eu sunt'},
  {q:'Ռումիներեն «Դու ես»',opts:['Eu sunt','Tu ești','Voi sunteți','Ei sunt'],ans:'Tu ești'},
  {q:'«Bine» նշանակում է',opts:['Լավ','Վատ','Մեծ','Նոր'],ans:'Լավ'},
  {q:'«Nu» նշանակում է',opts:['Ոչ','Այո','Մի','Երբեք'],ans:'Ոչ'},
  {q:'«Bun» նշանակում է',opts:['Լավ/Բարի','Վատ','Նոր','Հին'],ans:'Լավ/Բարի'},
];
let gIdx=0;
function initGrammarQuiz(){renderGrammarQ();}
function renderGrammarQ(){
  const q=grammarQ[gIdx]; const qEl=document.getElementById('grammarQ'); const cont=document.getElementById('grammarOpts');
  if(qEl) qEl.textContent=q.q; if(!cont) return;
  cont.innerHTML=''; let answered=false;
  q.opts.forEach(o=>{
    const d=document.createElement('div');d.className='opt';d.textContent=o;
    d.onclick=()=>{if(answered)return;answered=true;
      if(o===q.ans){d.classList.add('correct');toast('✅ Ճիշտ!');}
      else{d.classList.add('wrong');cont.querySelectorAll('.opt').forEach(x=>{if(x.textContent===q.ans)x.classList.add('correct');});toast('❌ Փորձիր հաջողի!');}
      setTimeout(()=>{gIdx=(gIdx+1)%grammarQ.length;renderGrammarQ();},1200);
    };
    cont.appendChild(d);
  });
}

const convoLines=[
  {bot:'Bună ziua! Ce doriți? 😊\n(Բարև ձեզ! Ի՞նչ եք ուզում:)',replies:['Un meniu, vă rog','Cât costă?','Mulțumesc']},
  {bot:'Avem pizza și paste. ✨\n(Ունենք pizza և pasta.)',replies:['Pizza, vă rog','Paste, vă rog','Ce recomandați?']},
  {bot:'Excelent alegere! 🍕\n(Հիանալի ընտրություն!)',replies:['Mulțumesc!','Cu plăcere!']},
  {bot:'Cu plăcere! Poftă bună! 🎉\n(Ողջ ողջ! Բարի ախորժակ!)',replies:[]},
];
let cIdx=0;
function initConvo(){renderConvo();}
function renderConvo(){
  const s=convoLines[cIdx%convoLines.length];
  const bEl=document.getElementById('convoBotMsg'); const rEl=document.getElementById('convoReplies');
  if(bEl) bEl.innerHTML=s.bot.replace(/\n/g,'<br>'); if(!rEl) return;
  rEl.innerHTML='';
  if(s.replies.length===0){
    const b=document.createElement('button');b.className='btn btn-p btn-sm';b.textContent='🔄 Կրկնել';
    b.onclick=()=>{cIdx=0;renderConvo();};rEl.appendChild(b);return;
  }
  s.replies.forEach(r=>{
    const b=document.createElement('button');b.className='btn btn-g btn-sm';b.textContent=r;
    b.onclick=()=>{cIdx++;renderConvo();};rEl.appendChild(b);
  });
}

const quickQs=[
  {q:'«Casă» նշանակում է:',opts:['Տուն','Ծառ','Ճանապարհ','Ծաղիկ'],ans:'Տուն'},
  {q:'«Apă» նշանակում է:',opts:['Ջուր','Կաթ','Հյութ','Թեյ'],ans:'Ջուր'},
  {q:'«Carte» նշանակում է:',opts:['Գիրք','Տետր','Գրիչ','Դասարան'],ans:'Գիրք'},
  {q:'«Câine» նշանակում է:',opts:['Շուն','Կատու','Ձի','Թռչուն'],ans:'Շուն'},
  {q:'«Soare» նշանակում է:',opts:['Արև','Լուսին','Աստղ','Ամպ'],ans:'Արև'},
];
let qIdx=0,qScore=0;
function initQuickTest(){renderQT();}
function renderQT(){
  const q=quickQs[qIdx]; const qEl=document.getElementById('qtQ'); const cont=document.getElementById('qtOpts');
  const scoreEl=document.getElementById('qtScore'); const progEl=document.getElementById('qtProgFill');
  if(qEl) qEl.textContent=q.q;
  if(scoreEl) scoreEl.textContent=qScore+'/'+quickQs.length;
  if(progEl) progEl.style.width=((qIdx/quickQs.length)*100)+'%';
  if(!cont) return; cont.innerHTML=''; let answered=false;
  q.opts.forEach(o=>{
    const d=document.createElement('div');d.className='opt';d.textContent=o;
    d.onclick=()=>{if(answered)return;answered=true;
      if(o===q.ans){d.classList.add('correct');qScore++;}
      else{d.classList.add('wrong');cont.querySelectorAll('.opt').forEach(x=>{if(x.textContent===q.ans)x.classList.add('correct');});}
      setTimeout(()=>{qIdx++;if(qIdx>=quickQs.length){toast('🏆 '+qScore+'/'+quickQs.length+' ճիշտ!');qIdx=0;qScore=0;}renderQT();},900);
    };
    cont.appendChild(d);
  });
}

// ─── EXTRA ────────────────────────────────────────────────────────
function initExtra() {
  initWordMatch(); initMemoryGame(); initQuickTranslate();
}

const mRO=['Bun','Mare','Mic','Nou','Vechi'], mHY=['Լավ','Մեծ','Փոքր','Նոր','Հին'];
let mSel=null, mDone=0;
function initWordMatch(){
  const roC=document.getElementById('matchRo'), hyC=document.getElementById('matchHy');
  if(!roC||!hyC) return;
  mSel=null; mDone=0;
  const pairs=mRO.map((r,i)=>({ro:r,hy:mHY[i]})).sort(()=>Math.random()-.5);
  const hySh=[...mHY].sort(()=>Math.random()-.5);
  roC.innerHTML=''; hyC.innerHTML='';
  pairs.forEach(p=>{
    const d=document.createElement('div');d.className='opt';d.style.marginBottom='8px';d.textContent=p.ro;d.dataset.ro=p.ro;
    d.onclick=()=>selectMatch(d,'ro'); roC.appendChild(d);
  });
  hySh.forEach(h=>{
    const d=document.createElement('div');d.className='opt';d.style.marginBottom='8px';d.textContent=h;d.dataset.hy=h;
    d.onclick=()=>selectMatch(d,'hy'); hyC.appendChild(d);
  });
}
function selectMatch(el,type){
  if(el.classList.contains('correct')) return;
  if(mSel&&mSel.type===type){mSel.el.style.borderColor='';mSel=null;}
  if(mSel&&mSel.type!==type){
    const roDom=type==='hy'?mSel.el:el, hyDom=type==='hy'?el:mSel.el;
    const ri=mRO.indexOf(roDom.dataset.ro), hi=mHY.indexOf(hyDom.dataset.hy);
    if(ri===hi){roDom.classList.add('correct');hyDom.classList.add('correct');mDone++;toast('✅ Ճիշտ!');
      if(mDone===mRO.length) setTimeout(()=>{toast('🎊 Բոլոր զույգերը ճիշտ!');mDone=0;initWordMatch();},700);
    }else{roDom.classList.add('wrong');hyDom.classList.add('wrong');toast('❌ Փորձիր նորից');
      setTimeout(()=>{roDom.classList.remove('wrong');hyDom.classList.remove('wrong');},700);}
    mSel=null; return;
  }
  mSel={el,type}; el.style.borderColor='var(--acc)';
}

const memE=['🏠','🌊','🌳','🎵','🦋','🍎','🌙','⭐'];
let memCards=[],memFlipped=[],memMatched=0,memLock=false;
function initMemoryGame(){
  const grid=document.getElementById('memGrid'); if(!grid) return;
  memCards=[];memFlipped=[];memMatched=0;memLock=false;
  const items=[...memE,...memE].sort(()=>Math.random()-.5);
  grid.innerHTML='';
  items.forEach((em,i)=>{
    const c=document.createElement('div');c.className='game-cell';c.dataset.val=em;c.dataset.idx=i;c.textContent='?';
    c.onclick=()=>flipCard(c); grid.appendChild(c); memCards.push(c);
  });
}
function flipCard(c){
  if(memLock||c.classList.contains('flipped')||c.classList.contains('matched')) return;
  c.textContent=c.dataset.val; c.classList.add('flipped'); memFlipped.push(c);
  if(memFlipped.length===2){memLock=true;setTimeout(checkMem,700);}
}
function checkMem(){
  const[a,b]=memFlipped;
  if(a.dataset.val===b.dataset.val){a.classList.add('matched');b.classList.add('matched');memMatched++;
    if(memMatched===memE.length) setTimeout(()=>{toast('🏆 Հաղթեցիր!');initMemoryGame();},600);
  }else{a.textContent='?';b.textContent='?';a.classList.remove('flipped');b.classList.remove('flipped');}
  memFlipped=[];memLock=false;
}

const qTransW=[
  {ro:'Casă',hy:'Տուն'},{ro:'Apă',hy:'Ջուր'},{ro:'Soare',hy:'Արև'},{ro:'Câine',hy:'Շուն'},
  {ro:'Carte',hy:'Գիրք'},{ro:'Fericire',hy:'Երջանկություն'},{ro:'Frumos',hy:'Գեղեցիկ'},{ro:'Familie',hy:'Ընտանիք'},
  {ro:'Iubire',hy:'Սեր'},{ro:'Cer',hy:'Երկինք'}
];
let qtTmr=null,qtTimeLeft=0,qtWIdx=0,qtWScore=0,qtRunning=false;
function initQuickTranslate(){
  document.getElementById('qtStart2')?.addEventListener('click',startQT2);
  document.querySelectorAll('.qt-btn').forEach(b=>b.onclick=()=>checkQT2(b.dataset.ans));
}
function startQT2(){
  qtRunning=true;qtWIdx=0;qtWScore=0;qtTimeLeft=30;
  const sb=document.getElementById('qtStart2'); if(sb) sb.style.display='none';
  const sc=document.getElementById('qtContainer2'); if(sc) sc.style.display='block';
  renderQT2();
  qtTmr=setInterval(()=>{qtTimeLeft--;
    const te=document.getElementById('qtTimer2'); if(te) te.textContent=qtTimeLeft+'վ';
    if(qtTimeLeft<=0) endQT2();
  },1000);
}
function renderQT2(){
  const w=qTransW[qtWIdx%qTransW.length];
  const we=document.getElementById('qtWord2'); if(we) we.textContent=w.ro;
  const others=qTransW.filter((_,i)=>i!==qtWIdx%qTransW.length).map(x=>x.hy);
  const opts=[w.hy]; while(opts.length<2){const r=others[Math.floor(Math.random()*others.length)];if(!opts.includes(r))opts.push(r);}
  opts.sort(()=>Math.random()-.5);
  const btns=document.querySelectorAll('.qt-btn');
  btns.forEach((b,i)=>{b.textContent=opts[i];b.dataset.ans=opts[i];b.className='btn btn-g btn-full';});
}
function checkQT2(ans){
  if(!qtRunning) return;
  const w=qTransW[qtWIdx%qTransW.length];
  if(ans===w.hy){qtWScore++;toast('✅ +1');} else toast('❌ '+w.hy);
  qtWIdx++;renderQT2();
  const sc=document.getElementById('qtWScore2'); if(sc) sc.textContent=qtWScore;
}
function endQT2(){
  clearInterval(qtTmr);qtRunning=false;
  const sb=document.getElementById('qtStart2'); if(sb){sb.style.display='';sb.textContent='🔄 Կրկնել';}
  const co=document.getElementById('qtContainer2'); if(co) co.style.display='none';
  toast('⏱ Ժամ վերջ! '+qtWScore+' բառ');
}

// ─── PROFILE ──────────────────────────────────────────────────────
function initProfile(){
  animateBars();
  const heights=[18,42,28,68,52,82,58];
  document.querySelectorAll('.wbar').forEach((b,i)=>{
    setTimeout(()=>{b.style.height=heights[i]+'px';},300+i*80);
  });
  document.querySelectorAll('.stat-v[data-target]').forEach(el=>{
    const tgt=parseInt(el.dataset.target); let cur=0;
    const step=Math.ceil(tgt/40);
    const t=setInterval(()=>{cur=Math.min(cur+step,tgt);el.textContent=cur+(el.dataset.suffix||'');if(cur>=tgt)clearInterval(t);},28);
  });
}

// ─── INIT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  setActiveNav(); animateBars();
  const page=location.pathname.split('/').pop()||'index.html';
  if(page==='index.html'||page==='') initChat();
  if(page==='lesson.html') initLesson();
  if(page==='extra.html') initExtra();
  if(page==='profile.html') initProfile();
});
