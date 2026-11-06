/* Rotating showcase: toggle -> metro -> urn -> p showcase.
   urn is Max's "random without repeats", so every work shows once before any repeat.
   It follows the gallery filter, so picking "Sound" only rotates through sound works.
   Change INTERVAL to speed it up or slow it down (milliseconds). */
(function(){
 const root=document.querySelector('.showcase');
 if(!root||typeof projects==='undefined')return;
 const INTERVAL=4500;
 // Anything narrower than this (width / height) gets framed whole instead of cropped to fill.
 const WIDE_ENOUGH=1.3;
 const $=s=>root.querySelector(s);
 const patch=$('.sc-patch'),svg=$('.sc-cords'),toggle=$('.sc-toggle'),metro=$('.sc-metro'),bang=$('.sc-bang'),urn=$('.sc-urn'),inlet=$('.sc-window>.inlet');
 const stage=$('.sc-stage'),bar=$('.sc-progress i'),text=$('.sc-text'),title=$('.sc-title'),meta=$('.sc-meta');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 metro.textContent='metro '+INTERVAL;
 $('.c-metro').textContent='every '+(INTERVAL/1000)+' sec';

 let pool=[],bag=[],history=[],current=-1,elapsed=0,last=0,frame=0;
 let on=!reduce.matches,hover=false,focused=false;

 // Patch cords, drawn from the real box positions so they always line up.
 function port(el,side){const r=el.getBoundingClientRect(),b=patch.getBoundingClientRect();return{x:r.left-b.left+7.5,y:side==='out'?r.bottom-b.top+1:r.top-b.top-1}}
 function cord(a,z){
  if(Math.abs(a.x-z.x)<2)return `M ${a.x} ${a.y} V ${z.y}`;
  const mid=(a.y+z.y)/2,k=5,dir=z.x>a.x?1:-1;
  return `M ${a.x} ${a.y} V ${mid-k} Q ${a.x} ${mid} ${a.x+dir*k} ${mid} H ${z.x-dir*k} Q ${z.x} ${mid} ${z.x} ${mid+k} V ${z.y}`;
 }
 function drawCords(){
  // Line the window's inlet up exactly under the urn outlet so the last cord drops straight.
  const w=$('.sc-window').getBoundingClientRect();
  inlet.style.left=(urn.getBoundingClientRect().left-w.left-1+7.5)+'px';
  const b=patch.getBoundingClientRect(),r=inlet.getBoundingClientRect();
  const win={x:r.left-b.left+r.width/2,y:r.top-b.top};
  svg.innerHTML=[cord(port(toggle,'out'),port(metro,'in')),cord(port(metro,'out'),port(bang,'in')),cord(port(metro,'out'),port(urn,'in')),cord(port(urn,'out'),win)].map(d=>`<path d="${d}"/>`).join('');
 }

 // The pool is whatever the gallery filter currently shows.
 function poolFor(){const f=typeof filter==='string'?filter:'All';return projects.map((_,i)=>i).filter(i=>f==='All'||projects[i].categories.includes(f))}
 function fromUrn(){
  if(pool.length<2)return pool[0]??current;
  if(!bag.length){
   bag=pool.filter(i=>i!==current);
   for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}
  }
  return bag.pop();
 }
  function syncPool(){
  const next=poolFor();if(next.join()===pool.join())return;
  pool=next;bag=[];history=history.filter(i=>pool.includes(i));
  urn.textContent='urn '+pool.length;drawCords();
  if(!pool.includes(current))show(fromUrn(),{remember:false});
 }
 function metaFor(p,i){return typeof metaLine==='function'?metaLine(p,i):p.title}

 // Wide work fills the stage. Vertical or square work sits whole on the patcher grid,
 // so the window never changes size between pieces.
 function fit(layer,ratio){
  layer.classList.toggle('framed',ratio<WIDE_ENOUGH);
  layer.style.setProperty('--ar',ratio);
 }
 function show(i,{remember=true,animate=true}={}){
  if(i===undefined||i<0)return;
  if(remember&&current>=0&&current!==i){history.push(current);if(history.length>40)history.shift()}
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
  meta.textContent=metaFor(p,i);
  stage.setAttribute('aria-label','View '+p.title);
  elapsed=0;bar.style.transform='scaleX(0)';
 }
 function flash(el){el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit')}
 function fire(){
  flash(bang);
  const paths=svg.querySelectorAll('path');paths.forEach(p=>p.classList.add('hot'));
  setTimeout(()=>paths.forEach(p=>p.classList.remove('hot')),200);
  const next=fromUrn();
  if(next===current){elapsed=0;return}
  show(next);
 }

 // The metro only runs when nobody is reading a work and the tab is visible.
 const playing=()=>on&&!hover&&!focused&&!document.hidden&&!dialog.open;
 function loop(now){
  if(!playing()){frame=0;update();return}
  elapsed+=Math.min(now-last,100);last=now;
  if(elapsed>=INTERVAL)fire();
  bar.style.transform=`scaleX(${Math.min(1,elapsed/INTERVAL)})`;
  frame=requestAnimationFrame(loop);
 }
 function update(){
  const live=playing();
  root.classList.toggle('paused',!live);
  text.setAttribute('aria-live',live?'off':'polite');
  if(live&&!frame){last=performance.now();frame=requestAnimationFrame(loop)}
 }

 // On wide screens the gallery's "19 works" count sits under the showcase window.
 const countEl=document.querySelector('#count'),countHome=countEl&&countEl.parentNode,foot=$('.sc-foot'),beside=matchMedia('(min-width:1280px)');
 function placeCount(){
  if(!countEl)return;
  const target=beside.matches?foot:countHome;
  if(countEl.parentNode!==target){target.append(countEl);if(typeof refreshLayout==='function')refreshLayout()}
 }

 toggle.addEventListener('click',()=>{
  on=!on;toggle.setAttribute('aria-pressed',on);toggle.setAttribute('aria-label',on?'Pause showcase':'Play showcase');update();
 });
 root.querySelectorAll('[data-sc]').forEach(b=>b.addEventListener('click',()=>{
  flash(b);const action=b.dataset.sc;
  if(action==='next')show(fromUrn());
  if(action==='prev'&&history.length)show(history.pop(),{remember:false});
  if(action==='open')(window.openWork||openProject)(current,stage);
 }));
 stage.addEventListener('click',()=>(window.openWork||openProject)(current,stage));
 // Easter egg: clicking the bang does exactly what the metro does.
 bang.addEventListener('click',fire);
 const win=$('.sc-window');
 win.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;update()}});
 win.addEventListener('pointerleave',()=>{hover=false;update()});
 root.addEventListener('focusin',e=>{focused=e.target.matches(':focus-visible');update()});
 root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget)){focused=false;update()}});
 dialog.addEventListener('close',update);
 document.addEventListener('visibilitychange',update);
 window.addEventListener('resize',drawCords);
 document.fonts.ready.then(drawCords);
 beside.addEventListener('change',placeCount);
 // The space between the filters and the cards is where the title cords turn and drop into the cards.
 // On wide screens, also make sure the cards start below the showcase so no cord runs under it.
 const filterbar=document.querySelector('.filterbar');
 function clearShowcase(){
  if(!filterbar)return;
  filterbar.style.marginBottom='';
  if(beside.matches){
   const base=parseFloat(getComputedStyle(filterbar).marginBottom)||0,need=root.getBoundingClientRect().bottom+78-filterbar.getBoundingClientRect().bottom;
   if(need>base)filterbar.style.marginBottom=Math.round(need)+'px';
  }
  if(typeof layoutGallery==='function')layoutGallery();
  if(typeof wires==='function')wires();
 }
 window.addEventListener('resize',clearShowcase);document.fonts.ready.then(clearShowcase);beside.addEventListener('change',clearShowcase);
 // The gallery rewrites its count every time the filter changes, so that is our cue to refilter.
 if(countEl)new MutationObserver(syncPool).observe(countEl,{childList:true,characterData:true,subtree:true});

 toggle.setAttribute('aria-pressed',on);toggle.setAttribute('aria-label',on?'Pause showcase':'Play showcase');
 pool=poolFor();urn.textContent='urn '+pool.length;
 // Open on a work that has real imagery, then let the urn take over.
 const pictured=pool.filter(i=>i<3||projects[i].coverUrl);
 show(pictured[Math.floor(Math.random()*pictured.length)],{remember:false,animate:false});
 placeCount();clearShowcase();drawCords();update();
})();
