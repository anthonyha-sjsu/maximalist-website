/* Showcase: toggle -> metro -> urn -> p student_showcase.
   It opens on the Patch of the Week (PATCH_OF_THE_WEEK in app.js) and holds it a little longer.
   Then urn (Max's "random without repeats") picks other works, and every few picks the Patch of
   the Week comes back, with its label lighting up. The rotation follows the gallery filter.
   The number box feeds the metro's right inlet: drag it, or click and type, to set the speed (ms). */
(function(){
 const root=document.querySelector('.showcase');
 if(!root||typeof projects==='undefined')return;
 const MIN=250,MAX=10000,START=4500;
 const $=s=>root.querySelector(s);
 const patch=$('.sc-patch'),svg=$('.sc-cords'),toggle=$('.sc-toggle'),numBox=$('.sc-number'),numInput=$('.sc-num-input'),metro=$('.sc-metro'),bang=$('.sc-bang'),urn=$('.sc-counter'),inlet=$('.sc-window>.inlet');
 const stage=$('.sc-stage'),chip=$('.sc-potw'),bar=$('.sc-progress i'),text=$('.sc-text'),title=$('.sc-title'),meta=$('.sc-meta'),metroNote=$('.c-metro');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');

 const EVERY=5;        // the Patch of the Week comes back after this many other works
 const HOLD=1.6;       // and stays up this many times longer than the others
 const WIDE_ENOUGH=1.3;// narrower images are shown whole on the patcher grid instead of cropped
 const featured=Math.max(0,projects.findIndex(p=>p.object===(typeof PATCH_OF_THE_WEEK==='string'?PATCH_OF_THE_WEEK:'')));

 let interval=START,elapsed=0,last=0,frame=0,current=-1,since=0,pool=[],bag=[],history=[];
 let on=!reduce.matches,hover=false,focused=false;

 // Patch cords, drawn from the real box positions so they always line up.
 const box=el=>{const r=el.getBoundingClientRect(),b=patch.getBoundingClientRect();return{l:r.left-b.left,r:r.right-b.left,t:r.top-b.top,b:r.bottom-b.top}};
 const outlet=el=>{const q=box(el);return{x:q.l+7.5,y:q.b+1}};
 const inletL=el=>{const q=box(el);return{x:q.l+7.5,y:q.t-1}};
 const inletR=el=>{const q=box(el);return{x:q.r-7.5,y:q.t-1}};
 function cord(a,z){
  if(Math.abs(a.x-z.x)<2)return `M ${a.x} ${a.y} V ${z.y}`;
  const mid=(a.y+z.y)/2,k=5,dir=z.x>a.x?1:-1;
  return `M ${a.x} ${a.y} V ${mid-k} Q ${a.x} ${mid} ${a.x+dir*k} ${mid} H ${z.x-dir*k} Q ${z.x} ${mid} ${z.x} ${mid+k} V ${z.y}`;
 }
 function drawCords(){
  // Line the window's inlet up under urn's outlet so the last cord drops straight.
  const w=$('.sc-window').getBoundingClientRect();
  inlet.style.left=(urn.getBoundingClientRect().left-w.left-1+7.5)+'px';
  const b=patch.getBoundingClientRect(),r=inlet.getBoundingClientRect();
  const win={x:r.left-b.left+r.width/2,y:r.top-b.top};
  svg.innerHTML=[
   ['metro',cord(outlet(toggle),inletL(metro))],
   ['number',cord(outlet(numBox),inletR(metro))],
   ['metro',cord(outlet(metro),inletL(bang))],
   ['metro',cord(outlet(metro),inletL(urn))],
   ['metro',cord(outlet(urn),win)]
  ].map(([k,d])=>`<path data-from="${k}" d="${d}"/>`).join('');
 }
 function flash(el){el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit')}
 function glow(which){const paths=svg.querySelectorAll(which?`path[data-from="${which}"]`:'path');paths.forEach(p=>p.classList.add('hot'));setTimeout(()=>paths.forEach(p=>p.classList.remove('hot')),200)}

 // The works urn picks from: whatever the gallery filter shows, minus the Patch of the Week.
 function poolFor(){const f=typeof filter==='string'?filter:'All';return projects.map((_,i)=>i).filter(i=>i!==featured&&(f==='All'||projects[i].categories.includes(f)))}
 function fromUrn(){
  if(!pool.length)return featured;
  if(!bag.length){bag=pool.filter(i=>i!==current);for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}}
  return bag.pop()??pool[0];
 }
 function nextWork(){
  if(current!==featured&&(since>=EVERY||!pool.length)){since=0;return featured}
  since++;return fromUrn();
 }
 const holdFor=()=>current===featured?interval*HOLD:interval;
 function fit(layer,ratio){layer.classList.toggle('framed',ratio<WIDE_ENOUGH);layer.style.setProperty('--ar',ratio)}
 function show(i,{remember=true,animate=true}={}){
  if(i===undefined||i<0||i===current)return;
  if(remember&&current>=0){history.push(current);if(history.length>40)history.shift()}
  current=i;const p=projects[i];
  const layer=document.createElement('div');layer.className='sc-layer';layer.innerHTML=artMarkup(i).replace(' loading="lazy"','');
  const [w,h]=p.imageAspect.split('/').map(Number);fit(layer,w/h);
  const img=layer.querySelector('img');
  if(img){const measure=()=>{if(img.naturalWidth&&img.naturalHeight)fit(layer,img.naturalWidth/img.naturalHeight)};img.complete?measure():img.addEventListener('load',measure,{once:true})}
  const old=[...stage.querySelectorAll('.sc-layer')];
  stage.append(layer);
  if(animate&&!reduce.matches){
   layer.animate([{opacity:0,transform:'scale(1.03)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'}).finished.catch(()=>{}).then(()=>old.forEach(o=>o.remove()));
   text.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:350,easing:'ease-out'});
  }else old.forEach(o=>o.remove());
  title.textContent=p.title;
  meta.textContent=typeof metaLine==='function'?metaLine(p,i):'';
  stage.setAttribute('aria-label','View '+p.title);
  // The "patch of the week" label only shows for the featured work, and lights up when it arrives.
  const isFeatured=i===featured;
  root.classList.toggle('is-potw',isFeatured);
  if(isFeatured&&animate&&!reduce.matches){chip.classList.remove('arrive');void chip.offsetWidth;chip.classList.add('arrive')}
  elapsed=0;bar.style.transform='scaleX(0)';
 }
 function fire(){flash(bang);flash(urn);glow('metro');show(nextWork())}
 function syncPool(){
  const next=poolFor();if(next.join()===pool.join())return;
  pool=next;bag=[];history=history.filter(i=>i===featured||pool.includes(i));
  urn.textContent='urn '+Math.max(1,pool.length);drawCords();
  if(current!==featured&&!pool.includes(current)){since=0;show(featured,{remember:false})}
 }

 // Number box -> metro right inlet.
 const fmt=ms=>ms<1000?`every ${ms} ms`:`every ${+(ms/1000).toFixed(2)} sec`;
 function setInterval_(ms,{flashIt=true}={}){
  ms=Math.round(Math.min(MAX,Math.max(MIN,Number(ms)||interval)));
  if(ms!==interval&&flashIt){flash(numBox);glow('number')}
  interval=ms;numInput.value=ms;metroNote.textContent=fmt(ms);
  if(elapsed>=holdFor())elapsed=holdFor();
 }
 let drag=null;
 numBox.addEventListener('pointerdown',e=>{
  if(document.activeElement===numInput)return;   // already typing: let the cursor work normally
  e.preventDefault();
  drag={y:e.clientY,v:interval,moved:false,id:e.pointerId};numBox.setPointerCapture(e.pointerId);numBox.classList.add('dragging');
 });
 numBox.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const dy=drag.y-e.clientY;if(Math.abs(dy)>3)drag.moved=true;
  if(drag.moved)setInterval_(drag.v+Math.round(dy/2)*(e.shiftKey?10:50));
 });
 const endDrag=e=>{
  if(!drag)return;const moved=drag.moved;drag=null;numBox.classList.remove('dragging');
  if(!moved){numInput.focus();numInput.select()}   // a plain click: type a number instead
 };
 numBox.addEventListener('pointerup',endDrag);numBox.addEventListener('pointercancel',endDrag);
 numInput.addEventListener('input',()=>{numInput.value=numInput.value.replace(/\D/g,'').slice(0,5)});
 numInput.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();setInterval_(numInput.value);numInput.blur()}
  else if(e.key==='Escape'){e.preventDefault();numInput.value=interval;numInput.blur()}
  else if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();setInterval_(interval+(e.key==='ArrowUp'?1:-1)*(e.shiftKey?500:50))}
 });
 numInput.addEventListener('blur',()=>setInterval_(numInput.value));
 numInput.addEventListener('wheel',e=>{if(document.activeElement!==numInput)return;e.preventDefault();setInterval_(interval+(e.deltaY<0?50:-50))},{passive:false});

 // The metro only runs while nobody is reading the work and the tab is visible.
 const playing=()=>on&&!hover&&!focused&&!document.hidden&&!dialog.open;
 function loop(now){
  if(!playing()){frame=0;update();return}
  elapsed+=Math.min(now-last,100);last=now;
  if(elapsed>=holdFor())fire();
  bar.style.transform=`scaleX(${Math.min(1,elapsed/holdFor())})`;
  frame=requestAnimationFrame(loop);
 }
 function update(){
  const live=playing();
  root.classList.toggle('paused',!live);
  if(live&&!frame){last=performance.now();frame=requestAnimationFrame(loop)}
 }

 toggle.addEventListener('click',()=>{
  on=!on;toggle.setAttribute('aria-pressed',on);toggle.setAttribute('aria-label',on?'Pause showcase':'Play showcase');update();
 });
 root.querySelectorAll('[data-sc]').forEach(b=>b.addEventListener('click',()=>{
  flash(b);
  if(b.dataset.sc==='next')show(nextWork());
  else if(history.length)show(history.pop(),{remember:false});
 }));
 stage.addEventListener('click',()=>(window.openWork||openProject)(current,stage));
 bang.addEventListener('click',fire);
 const win=$('.sc-window');
 win.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;update()}});
 win.addEventListener('pointerleave',()=>{hover=false;update()});
 win.addEventListener('focusin',e=>{focused=e.target.matches(':focus-visible');update()});
 win.addEventListener('focusout',e=>{if(!win.contains(e.relatedTarget)){focused=false;update()}});
 dialog.addEventListener('close',update);
 document.addEventListener('visibilitychange',update);
 window.addEventListener('resize',drawCords);
 document.fonts.ready.then(drawCords);

 // Hover hints, like Max's hint bubbles, so the patch makes sense to people who don't use Max.
 const hint=document.createElement('div');hint.className='sc-hint';hint.setAttribute('role','tooltip');patch.append(hint);
 let hintTimer=0;
 function showHint(el){
  clearTimeout(hintTimer);
  hintTimer=setTimeout(()=>{
   if(numBox.classList.contains('dragging'))return;
   hint.textContent=el.dataset.hint;
   const q=box(el),w=patch.clientWidth;
   hint.style.left=Math.max(0,Math.min(q.l,w-230))+'px';hint.style.top=(q.b+9)+'px';
   hint.classList.add('show');
  },el.matches(':focus-visible')?0:350);
 }
 function hideHint(){clearTimeout(hintTimer);hint.classList.remove('show')}
 patch.querySelectorAll('[data-hint]').forEach(el=>{
  el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')showHint(el)});
  el.addEventListener('pointerleave',hideHint);
  el.addEventListener('pointerdown',hideHint);
  el.addEventListener('focusin',()=>{if(el.matches(':focus-visible')||el.contains(document.activeElement))showHint(el)});
  el.addEventListener('focusout',hideHint);
 });

 // Make sure the cards start below the showcase on wide screens, so no cable runs under it.
 const beside=matchMedia('(min-width:1280px)'),filterbar=document.querySelector('.filterbar');
 function clearShowcase(){
  if(!filterbar)return;
  filterbar.style.marginBottom='';filterbar.style.paddingTop='';
  if(beside.matches){
   // Line the filter up with the bottom of the showcase window, so the gallery follows right after.
   const drop=$('.sc-window').getBoundingClientRect().bottom-filterbar.querySelector('.filter-object').getBoundingClientRect().bottom;
   if(drop>0)filterbar.style.paddingTop=Math.round(drop)+'px';
   const base=parseFloat(getComputedStyle(filterbar).marginBottom)||0,need=root.getBoundingClientRect().bottom+78-filterbar.getBoundingClientRect().bottom;
   if(need>base)filterbar.style.marginBottom=Math.round(need)+'px';
  }
  if(typeof layoutGallery==='function')layoutGallery();
  if(typeof wires==='function')wires();
 }
 window.addEventListener('resize',clearShowcase);document.fonts.ready.then(clearShowcase);beside.addEventListener('change',clearShowcase);

 toggle.setAttribute('aria-pressed',on);toggle.setAttribute('aria-label',on?'Pause showcase':'Play showcase');
 setInterval_(START,{flashIt:false});
 // The gallery rewrites its count whenever the filter changes: that's the cue to refilter urn.
 const countEl=document.querySelector('#count');
 if(countEl)new MutationObserver(syncPool).observe(countEl,{childList:true,characterData:true,subtree:true});
 pool=poolFor();urn.textContent='urn '+pool.length;
 show(featured,{remember:false,animate:false});
 clearShowcase();drawCords();update();
})();
