const characters = [
  {id:'dad',name:'Father',color:'blue',hex:'#496e78',icon:'F',time:'DAWN · 06:00',start:16,object:'Kettle',objectIcon:'♨',target:24,location:'09:00 on the clock',story:'Every morning, Father quietly prepared what the family would need and sometimes helped Grandfather with his routine. Most of the family never saw him do it; they simply woke to find everything ready. His care lived in the things he did before anyone was watching.',clues:[['Sound','A low tremor slowly gathers into a soft, restless murmur.'],['Touch','A smooth surface holds a fading warmth, as if someone has just stepped away.'],['Sight','A pale ring marks the lower edge; beneath it, a faint brown shadow remains.'],['Scent','Warm air carries a distant trace of damp leaves and earth.'],['Sight','One curved edge has been handled so often that its finish has softened.']]},
  {id:'mom',name:'Mother',color:'red',hex:'#a74638',icon:'M',time:'NOON · 12:00',start:0,object:'Spatula',objectIcon:'◒',target:8,location:'03:00 on the clock',story:'Mother always said she had made nothing special, yet she remembered exactly what everyone liked. A faded red thread tied on years ago by the child remained where it was. Ordinary meals carried the details she never forgot.',clues:[['Sound','A bright, repeating note touches another surface, pauses, then begins again.'],['Touch','One side feels polished by a familiar grip; a thin warmth lingers nearby.'],['Sight','Fine silver lines cross the surface, ending at a faded piece of red thread.'],['Taste','Something familiar begins savoury and leaves a small, unexpected sweetness.'],['Scent','A warm, lively aroma rises briefly, then settles into the room.']]},
  {id:'child',name:'Child',color:'yellow',hex:'#d6a92d',icon:'C',time:'NIGHT · 22:00',start:27,object:'Coffee maker',objectIcon:'♜',target:3,location:'01:00 on the clock',story:'Now grown, the child often returned late and worked alone in the kitchen. Mother never quite understood the new routine, but a small plate of cut fruit would appear nearby. The bitterness belonged to growing up; the sweetness still came from home.',clues:[['Sound','A deep mechanical hum breaks the quiet of the late room, then stops at once.'],['Scent','A dark, toasted aroma hangs in the air with a faint nut-like warmth.'],['Sight','A half-written work note rests beside a small circular stain.'],['Touch','A nearby vessel is still warm; one small control has lost its shine.'],['Taste','The first impression is dry and bitter, but it softens after a moment.']]},
  {id:'grandpa',name:'Grandfather',color:'green',hex:'#637b56',icon:'G',time:'AFTERNOON · 16:00',start:11,object:'Herbal medicine pot',objectIcon:'♧',target:19,location:'07:00 on the clock',story:'After Grandfather finished his medicine, someone always handed him a sweet. Long after the old routine ended, sweets remained in the kitchen drawer. A repaired crack remembers the afternoons the family endured together.',clues:[['Scent','A dense, earthy bitterness settles slowly into every corner of the room.'],['Sound','A light piece lifts, falls, and taps an uneven rhythm against an edge.'],['Sight','The rim is darkened by time, and a thin repaired line crosses one side.'],['Touch','The surface is coarse and keeps its warmth longer than expected.'],['Taste','A deep bitterness fills the mouth; memory insists that sweetness follows.']]}
];
const distractors=[
  {name:'Teapot',icon:'♨'},{name:'Rice cooker',icon:'◉'},{name:'Soup ladle',icon:'◒'},
  {name:'Thermos',icon:'▥'},{name:'Mortar and pestle',icon:'♢'},{name:'Toaster',icon:'▦'},
  {name:'Kitchen timer',icon:'◷'},{name:'Ceramic bowl',icon:'◡'}
];
const state={turn:0,rolling:false,extra:false,ended:false,allCluesShown:false};
const senses={Sight:'◉',Sound:'⌁',Touch:'◇',Scent:'≈',Taste:'●'};
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

function resetState(){
  state.turn=0;state.rolling=false;state.extra=false;state.ended=false;state.allCluesShown=false;
  characters.forEach(c=>{c.position=c.start;c.found=[];c.solved=false;c.finished=false;c.missGuess=false;placePiece(c)});
  $$('.space.target').forEach(x=>x.classList.remove('target'));
  $('#centerIcon').textContent='♨';$('#centerLabel').innerHTML='The kitchen still holds<br>the warmth of today';
  $('#dice').dataset.value=1;$('#rollBtn').disabled=false;closeModals();updateUI();showScreen('game');setTimeout(()=>openModal('rulesModal'),250);
}
function showScreen(id){$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active')}
function openModal(id){$('#'+id).classList.add('open')}
function closeModals(){$$('.modal').forEach(x=>x.classList.remove('open'))}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2300)}

function buildBoard(){
  const board=$('#board');
  for(let i=0;i<32;i++){
    const a=(i/32)*Math.PI*2-Math.PI/2,r=45,el=document.createElement('div');el.className='space';el.dataset.index=i;
    el.style.left=`${50+Math.cos(a)*r}%`;el.style.top=`${50+Math.sin(a)*r}%`;
    const owner=characters.find(c=>((i-c.start+32)%32)%6===3);
    if(owner){const clueIndex=Math.floor(((i-owner.start+32)%32)/6)%5;el.classList.add('sense',owner.color);el.textContent=senses[owner.clues[clueIndex][0]]||'✦'}
    else el.textContent=i%4===0?`${Math.round(i/32*12)||12}`:'·';
    board.appendChild(el);
  }
  characters.forEach(c=>{const p=document.createElement('div');p.className='piece';p.id='piece-'+c.id;p.style.background=c.hex;p.title=c.name;board.appendChild(p);placePiece(c)});
}
function placePiece(c){const p=$('#piece-'+c.id);if(!p)return;const a=(c.position/32)*Math.PI*2-Math.PI/2,r=45;p.style.left=`${50+Math.cos(a)*r}%`;p.style.top=`${50+Math.sin(a)*r}%`}
function buildPlayers(){
  $('#playerList').innerHTML=characters.map((c,i)=>`<div class="player-card ${i===state.turn&&!state.ended?'active':''}"><div class="avatar" style="background:${c.hex}">${c.icon}</div><div class="player-meta"><b>${c.name}${c.finished?' · Object returned':''}</b><small>${c.time}</small></div><span class="player-clues">${c.found.length}/5</span></div>`).join('');
}
function updateUI(){
  const c=characters[state.turn];buildPlayers();$('#turnName').textContent=c.name;$('#turnName').style.color=c.hex;$('#turnBadge').textContent=c.time;$('#turnBadge').style.color=c.hex;
  $('#clueCount').textContent=`${Math.min(c.found.length,3)} / 3`;$('#guessBtn').disabled=c.found.length<3||c.solved||c.missGuess||state.ended;
  $('#guessBtn').innerHTML=c.solved?'Object revealed <span>✓</span>':'Guess the object <span>→</span>';
  const total=characters.reduce((n,x)=>n+x.found.length,0);$('#totalClues').textContent=`${total} / 20`;$('#journalCount').textContent=total;$('#progressBar').style.width=`${total/20*100}%`;
  if(c.found.length){const q=c.clues[c.found[c.found.length-1]];$('#latestClue').className='clue-reveal';$('#latestClue').innerHTML=`<b>${senses[q[0]]} ${q[0]}</b><p>${q[1]}</p>`}
  else{$('#latestClue').className='clue-empty';$('#latestClue').innerHTML='<span class="sense-symbol">⌁</span><p>Roll the die and search the clock<br>for this person\'s sensory traces.</p>'}
  $$('.space.target').forEach(x=>x.classList.remove('target'));characters.filter(x=>x.solved&&!x.finished).forEach(x=>document.querySelector(`.space[data-index="${x.target}"]`).classList.add('target'));
  if(total===20&&!state.allCluesShown&&!state.ended){state.allCluesShown=true;setTimeout(()=>showEnding('clues'),500)}
}
function moveCharacter(c,steps){let moved=0;const timer=setInterval(()=>{c.position=(c.position+1)%32;placePiece(c);if(++moved===steps){clearInterval(timer);setTimeout(()=>land(c),350)}},190)}
function land(c){
  if(c.solved&&c.position===c.target){c.finished=true;toast(`${c.name}'s object has been returned to its place.`);$('#centerIcon').textContent='⌂';$('#centerLabel').innerHTML=`${c.name}'s object<br>is back where it belongs`;updateUI();setTimeout(()=>{if(!checkLastPlayer())nextTurn()},1200);return}
  const dist=(c.position-c.start+32)%32;
  if(dist%6===3&&c.found.length<5){const next=[0,1,2,3,4].find(i=>!c.found.includes(i));c.found.push(next);const clue=c.clues[next];$('#centerIcon').textContent=senses[clue[0]];$('#centerLabel').innerHTML=`A ${clue[0].toLowerCase()} memory<br>has surfaced`;toast(`${c.name} found a ${clue[0].toLowerCase()} trace.`);updateUI()}
  else toast('This space is quiet. No new trace appears.');
  state.rolling=false;if(state.extra){state.extra=false;$('#rollBtn').disabled=false;$('#diceHint').textContent='You rolled a 6—roll once more.';toast('A six gives you one more roll.')}else setTimeout(nextTurn,900);
}
function checkLastPlayer(){
  const unfinished=characters.filter(c=>!c.finished);
  if(unfinished.length!==1)return false;
  const last=unfinished[0];state.allCluesShown=true;last.solved=true;last.finished=true;last.position=last.target;
  while(last.found.length<5)last.found.push(last.found.length);placePiece(last);updateUI();toast('Only one memory remained. It returns without another roll.');setTimeout(()=>showEnding('family'),900);return true;
}
function nextTurn(){
  if(state.ended)return;let tries=0;do{state.turn=(state.turn+1)%characters.length;tries++}while(characters[state.turn].finished&&tries<5);
  const c=characters[state.turn];if(c.missGuess)c.missGuess=false;state.rolling=false;$('#rollBtn').disabled=false;$('#diceHint').textContent='Roll a 6 to move again';updateUI();
}
function roll(){
  if(state.rolling||state.ended)return;state.rolling=true;$('#rollBtn').disabled=true;const dice=$('#dice');dice.classList.add('rolling');let n=0;
  const flick=setInterval(()=>{dice.dataset.value=1+Math.floor(Math.random()*6);if(++n>7){clearInterval(flick);const value=1+Math.floor(Math.random()*6);dice.dataset.value=value;dice.classList.remove('rolling');state.extra=value===6;$('#diceHint').textContent=`You rolled ${value}. Move ${value} space${value>1?'s':''}.`;moveCharacter(characters[state.turn],value)}},70);
}
function shuffled(items){return [...items].sort(()=>Math.random()-.5)}
function openGuess(){
  const c=characters[state.turn];$('#guessRole').textContent=c.name;
  const correct={name:c.object,icon:c.objectIcon};const options=shuffled([correct,...shuffled(distractors.filter(x=>x.name!==c.object)).slice(0,7)]);
  $('#guessOptions').innerHTML=options.map(x=>`<button class="object-option" data-object="${x.name}"><span>${x.icon}</span>${x.name}</button>`).join('');openModal('guessModal');$$('.object-option').forEach(btn=>btn.onclick=()=>guess(btn.dataset.object));
}
function guess(obj){
  const c=characters[state.turn];closeModals();
  if(obj===c.object){c.solved=true;c.position=(c.position+3)%32;placePiece(c);$('#storyTime').textContent=c.time;$('#storyObject').textContent=c.objectIcon;$('#storyTitle').textContent=`${c.name}'s ${c.object.toLowerCase()}`;$('#storyText').textContent=c.story;$('#storyLocation').textContent=c.location;updateUI();setTimeout(()=>openModal('storyModal'),350)}
  else{c.missGuess=true;toast('That object cannot explain every trace. Try again next turn.');updateUI()}
}
function openJournal(){
  $('#journalTabs').innerHTML=characters.map((c,i)=>`<button class="journal-tab ${i===state.turn?'active':''}" data-tab="${i}">${c.name} ${c.found.length}/5</button>`).join('');renderJournal(state.turn);openModal('journalModal');
  $$('.journal-tab').forEach(b=>b.onclick=()=>{$$('.journal-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderJournal(+b.dataset.tab)});
}
function renderJournal(i){const c=characters[i];$('#journalContent').innerHTML=c.found.length?c.found.map(n=>`<div class="journal-entry"><b>${senses[c.clues[n][0]]} ${c.clues[n][0]}</b><p>${c.clues[n][1]}</p></div>`).join(''):'<div class="journal-empty">This page is still blank. Walk around the clock to find a trace.</div>'}
function showEnding(type){
  state.ended=true;$('#rollBtn').disabled=true;
  if(type==='clues'){$('#endingTitle').textContent='Every sensory memory is yours';$('#endingLead').textContent='Congratulations—you gathered all twenty traces held by the kitchen. The small details now form one complete family memory.'}
  else{$('#endingTitle').textContent='Every object has returned home';$('#endingLead').textContent='With only one memory left, the kitchen completes the final journey for you. Every object is now where it belongs, and every story can be told.'}
  $('#endingStories').innerHTML=characters.map(c=>`<article class="ending-memory"><b>${c.name} · ${c.object}</b><span>${c.time}</span><p>${c.story}</p></article>`).join('');openModal('endingModal');updateUI();
}

$('#startBtn').onclick=resetState;$('#rulesBtn').onclick=()=>openModal('rulesModal');$('#homeBtn').onclick=e=>{e.preventDefault();showScreen('intro')};$('#rollBtn').onclick=roll;$('#guessBtn').onclick=openGuess;$('#journalBtn').onclick=openJournal;$('#storyContinue').onclick=closeModals;$('#restartBtn').onclick=resetState;
$('#soundBtn').onclick=()=>toast('Ambient audio placeholder: quiet water, light rhythm, afternoon room tone, and a late-night hum.');
$$('[data-close]').forEach(x=>x.onclick=closeModals);$$('.modal').forEach(x=>x.addEventListener('click',e=>{if(e.target===x&&x.id!=='endingModal')closeModals()}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#endingModal').classList.contains('open'))closeModals()});
buildBoard();buildPlayers();updateUI();
