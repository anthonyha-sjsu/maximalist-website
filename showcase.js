/* Patch of the week: toggle -> metro -> counter -> p student_showcase.
   The showcase features one work (PATCH_OF_THE_WEEK in app.js) and steps through its views:
   the output, the patching view, and the preview video if there is one.
   The number box feeds the metro's right inlet, like in Max: drag it up or down, or click and
   type, to change how often the view changes (in milliseconds). */
(function(){
 const root=document.querySelector('.showcase');
 if(!root||typeof projects==='undefined')return;
 const MIN=250,MAX=10000,START=4500;
 const $=s=>root.querySelector(s);
 const patch=$('.sc-patch'),svg=$('.sc-cords'),toggle=$('.sc-toggle'),numBox=$('.sc-number'),numInput=$('.sc-num-input'),metro=$('.sc-metro'),bang=$('.sc-bang'),counter=$('.sc-counter'),inlet=$('.sc-window>.inlet');
 const stage=$('.sc-stage'),viewLabel=$('.sc-view-label'),bar=$('.sc-progress i'),text=$('.sc-text'),title=$('.sc-title'),meta=$('.sc-meta'),metroNote=$('.c-metro');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');

 // The featured work and its views.
 const index=Math.max(0,projects.findIndex(p=>p.object===(typeof PATCH_OF_THE_WEEK==='string'?PATCH_OF_THE_WEEK:'')));
 const work=projects[index];
 const img=(src,cls='')=>`<img class="cover-image${cls}" src="${esc(src)}" alt="${esc(work.title)}" draggable="false">`;
 const views=[];
 if(work.coverUrl||index<3)views.push({label:'output',html:artMarkup(index).replace(' loading="lazy"',''),fill:true});
 if(work.patchPreview)views.push({label:'patching view',html:work.patchPreviewDark?img(work.patchPreview,' only-light')+img(work.patchPreviewDark,' only-dark'):img(work.patchPreview),fill:false});
 if(work.previewVideo)views.push({label:'preview',html:`<video src="${esc(work.previewVideo)}" muted loop playsinline autoplay></video>`,fill:true});
 if(!views.length)views.push({label:'output',html:artMarkup(index),fill:true});

 let view=-1,interval=START,elapsed=0,last=0,frame=0;
 let on=!reduce.matches,hover=false,focused=false;
 counter.textContent=`counter 0 ${views.length-1}`;

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
  // Line the window's inlet up under the counter's outlet so the last cord drops straight.
  const w=$('.sc-window').getBoundingClientRect();
  inlet.style.left=(counter.getBoundingClientRect().left-w.left-1+7.5)+'px';
  const b=patch.getBoundingClientRect(),r=inlet.getBoundingClientRect();
  const win={x:r.left-b.left+r.width/2,y:r.top-b.top};
  svg.innerHTML=[
   ['metro',cord(outlet(toggle),inletL(metro))],
   ['number',cord(outlet(numBox),inletR(metro))],
   ['metro',cord(outlet(metro),inletL(bang))],
   ['metro',cord(outlet(metro),inletL(counter))],
   ['metro',cord(outlet(counter),win)]
  ].map(([k,d])=>`<path data-from="${k}" d="${d}"/>`).join('');
 }
 function flash(el){el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit')}
 function glow(which){const paths=svg.querySelectorAll(which?`path[data-from="${which}"]`:'path');paths.forEach(p=>p.classList.add('hot'));setTimeout(()=>paths.forEach(p=>p.classList.remove('hot')),200)}

 function showView(k,animate=true){
  k=(k+views.length)%views.length;if(k===view)return;view=k;
  const v=views[k];
  const layer=document.createElement('div');layer.className='sc-layer'+(v.fill?'':' fit');layer.innerHTML=v.html;
  const old=[...stage.querySelectorAll('.sc-layer')];
  stage.insertBefore(layer,viewLabel);
  if(animate&&!reduce.matches){
   layer.animate([{opacity:0,transform:'scale(1.03)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'}).finished.catch(()=>{}).then(()=>old.forEach(o=>o.remove()));
   viewLabel.animate([{opacity:0},{opacity:1}],{duration:350});
  }else old.forEach(o=>o.remove());
  viewLabel.textContent=v.label;
  elapsed=0;bar.style.transform='scaleX(0)';
 }
 function fire(){flash(bang);flash(counter);glow('metro');showView(view+1)}

 // Number box -> metro right inlet.
 const fmt=ms=>ms<1000?`every ${ms} ms`:`every ${+(ms/1000).toFixed(2)} sec`;
 function setInterval_(ms,{flashIt=true}={}){
  ms=Math.round(Math.min(MAX,Math.max(MIN,Number(ms)||interval)));
  if(ms!==interval&&flashIt){flash(numBox);glow('number')}
  interval=ms;numInput.value=ms;metroNote.textContent=fmt(ms);
  if(elapsed>=interval)elapsed=interval;
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
  if(elapsed>=interval)fire();
  bar.style.transform=`scaleX(${Math.min(1,elapsed/interval)})`;
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
 root.querySelectorAll('[data-sc]').forEach(b=>b.addEventListener('click',()=>{flash(b);showView(view+(b.dataset.sc==='next'?1:-1))}));
 stage.addEventListener('click',()=>(window.openWork||openProject)(index,stage));
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

 title.textContent=work.title;
 meta.textContent=typeof metaLine==='function'?metaLine(work,index):'';
 stage.setAttribute('aria-label','View '+work.title);
 toggle.setAttribute('aria-pressed',on);toggle.setAttribute('aria-label',on?'Pause showcase':'Play showcase');
 setInterval_(START,{flashIt:false});
 showView(0,false);
 clearShowcase();drawCords();update();
})();
