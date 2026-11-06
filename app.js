const projects=[
 // Placeholder descriptions say what the patch does and which objects it uses. Keep real ones that concrete too.
 {title:'Signal Bloom',object:'signal_bloom',categories:['Sound','Visual'],description:'Placeholder image from the design mockup. The idea: a mic goes into pfft~, and the loudness of each frequency band sets the size and color of points in a jit.gl.mesh.',medium:'Max / Jitter',previewVideo:'assets/signal-bloom-preview.mp4',previewPoster:'assets/signal-bloom-poster.jpg',previewNote:'Sample preview: a slow pan over the mockup image, just to show how video previews look. Real previews will be screen recordings of the patch running.'},
 {title:'Soft Bodies',object:'soft_bodies',categories:['Interactive','Visual'],description:'Placeholder image from the design mockup. The idea: a jit.gl.nurbs surface you bend with the mouse, with jit.anim.drive smoothing the motion so it moves like fabric.',medium:'Max / Jitter'},
 {title:'Feedback Studies',object:'feedback_studies',categories:['Visual'],description:'Placeholder image from the design mockup. The idea: jit.grab feeds a jit.gl.slab that blends each frame with the last one, so the image keeps eating itself.',medium:'Max / Jitter'}
];
const extraProjects = [
 ['Room Tone','Sound','signal','Placeholder. A recording of an empty room, slowed down with groove~ and stacked until the hum turns into a chord.'],
 ['3D Rendering Engine','Visual','matrix','Two tori built with jit.gl.gridshape, rendered in a jit.window in front of a noise-textured skybox (jit.noise into jit.gl.cubemap and jit.gl.skybox). Number boxes set each torus’s position and color, jit.anim.drive keeps one turning and moves the other, and jit.gl.handle lets you spin the whole scene with the mouse.'],
 ['Touch / Response','Interactive','event','Placeholder. A touch board sends serial data into Max and each pad triggers a different sample.'],
 ['Eight Directions','Sound','mc','Placeholder. An 8-speaker piece that moves sounds around the room with mc.pan~.'],
 ['Afterimage','Visual','matrix','Placeholder. jit.slide smears the webcam feed so anything that moves leaves a trail.'],
 ['Chance Operations','Interactive','event','Placeholder. urn and drunk pick the notes, rhythm and colors, so it never plays the same way twice.'],
 ['Grain Garden','Sound','signal','Placeholder. A granular sampler built around groove~ that chops a field recording into tiny grains.'],
 ['Raster Weather','Visual','matrix','Placeholder. Pixels drift and clump like clouds, driven by jit.bfg noise.'],
 ['Body Language','Interactive','event','Placeholder. Webcam hand tracking moves the camera around a jit.gl scene.'],
 ['Orbit / 16','Sound','mc','Placeholder. Sixteen mc.cycle~ voices, each one circling the listener at a different speed.'],
 ['Liquid Memory','Visual','matrix','Placeholder. Feedback through jit.gl.slab with a slow blur, so old frames fade out instead of cutting off.'],
 ['Collective Pulse','Interactive','event','Placeholder. Phones send taps to Max over OSC (udpreceive) and everyone’s taps add up to one beat.'],
 ['Resonant Objects','Sound','signal','Placeholder. Contact mics on kitchen objects run through reson~ filters tuned to a scale.'],
 ['Field Notes','Visual','matrix','Placeholder. A drawing patch where random walks sketch grids in jit.lcd that slowly fall apart.'],
 ['Open Circuit','Interactive','event','Placeholder. Visitors clip wires between metal pads and Max hears which circuits are closed.']
];
projects.forEach((p,i)=>p.cable=['signal','event','matrix'][i]);
extraProjects.forEach(([title,category,cable,description])=>projects.push({title,object:title.toLowerCase().replace(/[^a-z0-9]+/g,'_'),categories:[category],cable,description,medium:'Max'}));
projects.find(p=>p.object==='room_tone').previewAudio='assets/room-tone-preview.mp3';
projects.find(p=>p.object==='room_tone').previewNote='Sample preview: synthesized room hum, just to show how audio previews work. Real previews will be recorded from the patch.';
// Gallery categories intentionally combine single- and multichannel audio.
projects.forEach(p=>{if(p.cable==='mc')p.cable='signal'});
// Real reference example from the class repository; not a student submission.
projects.push({title:'Metro 01',object:'metro_01',categories:['Other'],cable:'other',artist:'Andrew Blanton',description:'The 1 message starts a metro that sends a bang every 250 milliseconds; 0 stops it. The button flashes on each bang, making the timing visible.',medium:'Reference example · Max',isReference:true,portfolioUrl:'https://www.andrewblanton.com',patchFileUrl:'https://www.andrewblanton.com/20_Objects/_downloads/metro_01.maxpat',patchPreview:'assets/metro-01-patching.svg',patchPreviewDark:'assets/metro-01-patching-dark.svg',previewCaption:'Patching layout rendered from the original .maxpat file. Not presentation mode.',coverUrl:'assets/metro-01-patching.svg',coverUrlDark:'assets/metro-01-patching-dark.svg',imageAspect:'200 / 210'});
projects.forEach((p,i)=>{p.artist=p.artist||'Artist to be announced';if(!p.imageAspect)p.imageAspect=i>=3&&i%4===0?'3 / 4':i>=3&&i%4===2?'1 / 1':'451 / 254'});
projects.forEach(p=>{if(['soft_bodies','orbit_16','resonant_objects'].includes(p.object))p.categories.push('3D')});
// First real student work: Anthony Ha's torus patch from class.
Object.assign(projects.find(p=>p.object==='3d_rendering_engine'),{
 isStudent:true,artist:'Anthony Ha',categories:['Visual','3D'],medium:'Max / Jitter',
 coverUrl:'assets/works/torus-render.jpg',imageAspect:'1600 / 1102',
 patchPreview:'assets/works/torus-patching.png',previewCaption:'Patching view, unlocked. Screenshot from Max with the dark theme on.',
 patchFileUrl:'assets/works/3d_rendering_engine.maxpat'
});
// Short line under each title, shared by the gallery cards, the showcase and the artists list.
function workKind(p,i){return p.isReference?'Reference':p.isStudent?'':i<3?'Sample':'Placeholder'}
function metaLine(p,i){return [p.categories[0],p.isReference||p.isStudent?p.artist:''].filter(Boolean).join(' · ')}
// Card caption: the work's categories as colored dots, plus the artist once it's a real work.
function cardMeta(p){return `<span class="card-tags">${p.categories.map(c=>`<span class="ct" style="--c:var(--c-${catKey(c)})">${esc(c)}</span>`).join('')}</span>${p.isReference||p.isStudent?`<span class="by">${esc(p.artist)}</span>`:''}`}
// Patch of the week: the object name of the work the homepage showcase features.
const PATCH_OF_THE_WEEK='3d_rendering_engine';
// Category colors live in style.css as --c-sound, --c-visual, --c-interactive, --c-3d, --c-other.
const catKey=c=>String(c).toLowerCase();
// The color a card (and its cable) uses: the active filter's color, or else the work's main category.
const cardCat=p=>catKey(filter!=='All'?filter:p.categories[0]);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function artMarkup(i){const p=projects[i];if(p.coverUrl){const one=(src,cls,lazy)=>`<img class="cover-image${cls}" src="${esc(src)}" alt="${esc(p.title)}"${lazy?' loading="lazy"':''} style="aspect-ratio:${p.imageAspect}">`;return p.coverUrlDark?one(p.coverUrl,' only-light')+one(p.coverUrlDark,' only-dark'):one(p.coverUrl,'',true)}return i<3?`<div class="art art-${i}" role="img" aria-label="${esc(p.title)} sample artwork"></div>`:`<div class="placeholder-art type-${p.cable}" style="aspect-ratio:${p.imageAspect}" aria-hidden="true"><div class="placeholder-graphic"></div><span class="placeholder-label">${p.categories[0].toUpperCase()} / ARTWORK TO COME</span></div>`}
let filter='All';const gallery=document.querySelector('#gallery'),dialog=document.querySelector('#dialog'),body=document.querySelector('#dialog-body');
let animationFrame=0, generation=0;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function render(){
 gallery.innerHTML=projects.map((p,i)=>({p,i})).filter(({p})=>filter==='All'||p.categories.includes(filter)).map(({p,i})=>`<button class="card" data-project="${i}" data-cat="${cardCat(p)}" aria-label="View ${p.title}"><i class="inlet" aria-hidden="true"></i><div class="object-name"><span>p ${p.object}</span>${p.object===PATCH_OF_THE_WEEK?'<span class="potw-chip">patch of the week</span>':''}<span aria-hidden="true">↗</span></div>${artMarkup(i)}<h2>${esc(p.title)}</h2><p class="card-meta">${cardMeta(p)}</p></button>`).join('');
 document.querySelector('#count').textContent=gallery.children.length+' '+(gallery.children.length===1?'work':'works');
 layoutGallery();animateWires();
}
function layoutGallery(){
 const items=[...gallery.querySelectorAll('.card')];
 if(gallery.classList.contains('list')){items.forEach(card=>card.style.gridRowEnd='');return}
 const style=getComputedStyle(gallery),row=parseFloat(style.gridAutoRows)||8,gap=parseFloat(style.rowGap)||24;
 items.forEach(card=>{card.style.gridRowEnd='span '+Math.ceil((card.getBoundingClientRect().height+gap)/(row+gap))});
}
let routingActive=false;
function refreshLayout(){layoutGallery();if(!routingActive)wires()}
// Cables run from the filter object's outlets (one per category) down into the first row of cards.
function routes(){
 const svg=document.querySelector('.cords'),root=document.querySelector('.canvas').getBoundingClientRect();
 const cards=[...gallery.querySelectorAll('.card')],firstTop=cards[0]?.getBoundingClientRect().top;
 const firstRow=cards.filter(card=>Math.abs(card.getBoundingClientRect().top-firstTop)<2).slice(0,3);
 cards.forEach(card=>card.classList.toggle('connected',firstRow.includes(card)));
 const kinds=firstRow.map(card=>card.dataset.cat);
 // Slide the filter's outlets so the first one sits right above the first card's inlet,
 // so that cable drops straight down.
 const fo=document.querySelector('.fo-outlets'),firstInlet=cards[0]?.querySelector('.inlet');
 if(fo&&firstInlet){fo.style.left='';const o=fo.querySelector('[data-outlet]').getBoundingClientRect(),z=firstInlet.getBoundingClientRect(),base=parseFloat(getComputedStyle(fo).left)||0;fo.style.left=Math.max(0,base+(z.left+z.width/2)-(o.left+o.width/2))+'px'}
 document.querySelectorAll('.fo-outlets [data-outlet]').forEach(port=>port.classList.toggle('active-port',kinds.includes(port.dataset.outlet)));
 svg.setAttribute('viewBox',`0 0 ${root.width} ${root.height}`);
 const ends=firstRow.map((card,index)=>{
  const out=document.querySelector(`.fo-outlets [data-outlet="${kinds[index]}"]`)||document.querySelector('.fo-outlets [data-outlet]');
  const a=out.getBoundingClientRect(),z=card.querySelector('.inlet').getBoundingClientRect();
  return {kind:kinds[index],sx:a.left+a.width/2-root.left,sy:a.bottom-root.top,ex:z.left+z.width/2-root.left,ey:z.top-root.top};
 });
 // Each cable turns at its own height so they don't sit on top of each other.
 // When the showcase sits beside the title, turn below it so no cable runs underneath.
 const sc=document.querySelector('.showcase'),scBottom=sc&&getComputedStyle(sc).position==='absolute'?sc.getBoundingClientRect().bottom-root.top+6:0;
 const top=Math.max(scBottom,...ends.map(r=>r.sy)),bottom=Math.min(...ends.map(r=>r.ey)),gap=Math.min(16,(bottom-top-14)/(ends.length+1));
 const first=ends.map((r,index)=>({...r,lane:top+gap*(index+1)}));
 // Then the cable keeps running straight down each column, behind the cards, into the inlet of
 // every card below. The cards sit on top of it, so it only shows in the gaps between them.
 const columns=new Map();
 cards.forEach(card=>{const x=Math.round(card.getBoundingClientRect().left);if(!columns.has(x))columns.set(x,[]);columns.get(x).push(card)});
 const chain=[];
 columns.forEach(list=>{
  list.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);
  for(let k=0;k<list.length-1;k++){
   const n=list[k+1];n.classList.add('connected');
   const a=list[k].getBoundingClientRect(),z=n.querySelector('.inlet').getBoundingClientRect(),x=z.left+z.width/2-root.left;
   chain.push({kind:n.dataset.cat,sx:x,sy:a.bottom-root.top-12,ex:z.left+z.width/2-root.left,ey:z.top-root.top,straight:true});
  }
 });
 return first.concat(chain);
}
function pathFor(r,bend=0){
 const {sx,sy,ex,ey}=r,dx=ex-sx;
 if(r.straight||Math.abs(dx)<.5)return `M ${sx} ${sy} L ${ex} ${ey}`;
 // Small offsets get small corners, so the cable always lands in the middle of the inlet.
 const k=Math.min(7,Math.abs(dx)/2),lane=Math.max(sy+k+2,Math.min(ey-k-2,r.lane+bend)),dir=dx>0?1:-1;
 return `M ${sx} ${sy} V ${lane-k} Q ${sx} ${lane} ${sx+dir*k} ${lane} H ${ex-dir*k} Q ${ex} ${lane} ${ex} ${lane+k} V ${ey}`;
}
function paintWires(data,bend=0,opacity=1){
 const svg=document.querySelector('.cords'),signature=data.map(r=>r.kind).join(',');
 if(svg.dataset.signature!==signature){svg.dataset.signature=signature;svg.innerHTML=data.map(r=>`<g data-cable="${r.kind}" style="--cat:var(--c-${r.kind})"><path class="cable-base"/><path class="cable-stripe"/></g>`).join('')}
 [...svg.querySelectorAll('g')].forEach((g,i)=>{g.setAttribute('opacity',opacity);g.querySelectorAll('path').forEach(p=>p.setAttribute('d',pathFor(data[i],bend)))})
}
function wires(){cancelAnimationFrame(animationFrame);generation++;routingActive=false;paintWires(routes())}
// Draws the cables in. Positions are measured again every frame, so if the cards move while it
// plays (switching views, images loading), the cables follow them instead of being left behind.
function animateWires(){cancelAnimationFrame(animationFrame);const current=++generation;routingActive=true;requestAnimationFrame(()=>{if(reducedMotion.matches){paintWires(routes());routingActive=false;return}const started=performance.now();function tick(now){if(current!==generation)return;const t=Math.min(1,(now-started)/700),ease=1-Math.pow(1-t,3);paintWires(routes(),-16*(1-ease),.25+.75*ease);if(t<1)animationFrame=requestAnimationFrame(tick);else{routingActive=false;wires()}}animationFrame=requestAnimationFrame(tick)})}
// Whenever the gallery changes size or shape, redraw the cables once it has settled.
let settleFrame=0;
new ResizeObserver(()=>{cancelAnimationFrame(settleFrame);settleFrame=requestAnimationFrame(()=>{if(!routingActive)wires()})}).observe(gallery);
let filterGeneration=0;
async function transitionFilter(next){
 const token=++filterGeneration,svg=document.querySelector('.cords');
 gallery.getAnimations().forEach(a=>a.cancel());svg.getAnimations().forEach(a=>a.cancel());
 if(!reducedMotion.matches){const a=gallery.animate([{opacity:1},{opacity:0}],{duration:150,fill:'forwards'});svg.animate([{opacity:1},{opacity:0}],{duration:150,fill:'forwards'});try{await a.finished}catch{}if(token!==filterGeneration)return}
 filter=next;render();gallery.getAnimations().forEach(a=>a.cancel());svg.getAnimations().forEach(a=>a.cancel());
 if(!reducedMotion.matches){gallery.animate([{opacity:0},{opacity:1}],{duration:300,easing:'ease-out'});svg.animate([{opacity:0},{opacity:1}],{duration:300,easing:'ease-out'})}
}
function show(label,html,artwork=false){dialog.classList.toggle('artwork-dialog',artwork);document.querySelector('#dialog-label').textContent=label;dialog.setAttribute('aria-labelledby','dialog-label');body.innerHTML=html;if(!dialog.open)dialog.showModal();body.scrollTop=0}
gallery.addEventListener('click',e=>{const card=e.target.closest('[data-project]');if(card)openWork(Number(card.dataset.project),card)});
// Shared by the gallery cards and the homepage showcase.
function openProject(i,dir=0){
 currentProject=i;
 const p=projects[i],deepLink=p.patchFileUrl?maxPatchLink(p.patchFileUrl):null;
 const preview=p.patchPreview?`<figure class="patch-preview"><div class="zoom-pane" title="Double-click to zoom, drag to look around"><div class="zoom-inner"><img${p.patchPreviewDark?' class="only-light"':''} src="${esc(p.patchPreview)}" alt="${esc(p.title)} patching view showing object boxes and their connections" draggable="false">${p.patchPreviewDark?`<img class="only-dark" src="${esc(p.patchPreviewDark)}" alt="${esc(p.title)} patching view, dark theme" draggable="false">`:''}</div><div class="zoom-ui"><span class="zoom-level" aria-live="polite">100%</span><button type="button" class="sc-msg" data-z="out" aria-label="Zoom out">−</button><button type="button" class="sc-msg" data-z="in" aria-label="Zoom in">+</button><button type="button" class="sc-msg" data-z="fit" aria-label="Fit to window">fit</button></div></div><figcaption>${esc(p.previewCaption||'Patching view: object boxes and connections, outside presentation mode.')}</figcaption></figure>`:`<div class="patch-empty"><span class="empty-object">p ${esc(p.object)}</span><strong>Patching view to be added</strong><p>The artist’s screenshot will show the object boxes and connections outside presentation mode.</p></div>`;
 const action=deepLink?`<a class="open-patcher primary" href="${esc(deepLink)}" id="open-patcher">Open patcher <span aria-hidden="true">↗</span></a><a class="patch-file-link" href="${esc(p.patchFileUrl)}" target="_blank" rel="noopener">Get .maxpat file ↗</a>`:p.patchFileUrl?`<a class="open-patcher primary" href="${esc(p.patchFileUrl)}" download target="_blank" rel="noopener">Download .maxpat <span aria-hidden="true">↓</span></a>`:`<button class="open-patcher" disabled aria-describedby="patch-help">Open patcher <span aria-hidden="true">↗</span></button>`;
 const portfolio=p.portfolioUrl?`<a class="portfolio-link" href="${esc(p.portfolioUrl)}" target="_blank" rel="noopener">Portfolio <span aria-hidden="true">↗</span></a>`:'';
 show('p '+p.object,`<div class="detail-top ${Number(p.imageAspect.split('/')[0])/Number(p.imageAspect.split('/')[1])<1?'portrait-detail':''}"><div class="detail-cover">${artMarkup(i)}<span class="detail-caption">${p.isReference?'Reference example from the Art 103 repository':p.isStudent?'Output from the patch, rendered in Max':'Placeholder · Student details to come'}</span></div><div class="detail-info"><h3>Title</h3><h2 class="detail-title">${esc(p.title)}</h2><div class="detail-meta"><div><h3>Artist</h3><p>${esc(p.artist)}${portfolio?' · '+portfolio:''}</p></div><div><h3>Tags</h3><p class="tag-chips">${p.categories.map(c=>`<span class="chip" style="--cat:var(--c-${catKey(c)})">${esc(c)}</span>`).join('')}</p></div></div><h3>Summary</h3><p class="detail-summary">${esc(p.description)}</p></div></div>${previewMarkup(p)}<section class="patch-section"><div class="patch-section-title"><h3>Patcher</h3><span>PATCHING VIEW</span></div>${preview}</section><div class="patch-actions">${action}</div><p id="patch-help" class="patch-help">${deepLink?'Requires Max installed on your computer. Your browser may ask you to allow Max to open. If it does not open, get the .maxpat file and open it in Max.':p.patchFileUrl?'Download the file and open it in Max. Open patcher (straight into Max) will work once the file is hosted online.':'This placeholder does not have a patch file yet. Open patcher will be available when the artist’s file is added.'}</p><p id="launch-status" role="status"></p>`,true);
 document.querySelector('#open-patcher')?.addEventListener('click',()=>{document.querySelector('#launch-status').textContent='If your browser asks, choose Open Max. The website cannot confirm whether Max opened.'});
 wireAudio(body);wireZoom(body);
 // Slide the new work in from the side it came from when flipping with the arrows.
 if(dir&&!reducedMotion.matches)body.animate([{opacity:0,transform:`translateX(${dir*14}px)`},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'});
}
// Video or audio preview of the work running. Only shows up when the artist sent one.
function previewMarkup(p){
 if(!p.previewVideo&&!p.previewAudio)return '';
 const note=p.previewNote?`<p class="preview-note">${esc(p.previewNote)}</p>`:'';
 if(p.previewVideo)return `<section class="patch-section preview-section"><div class="patch-section-title"><h3>Preview</h3><span>VIDEO</span></div><video class="preview-video" src="${esc(p.previewVideo)}"${p.previewPoster?` poster="${esc(p.previewPoster)}"`:''} controls muted loop playsinline preload="metadata"${reducedMotion.matches?'':' autoplay'}></video>${note}</section>`;
 return `<section class="patch-section preview-section"><div class="patch-section-title"><h3>Preview</h3><span>AUDIO</span></div><div class="audio-player"><audio src="${esc(p.previewAudio)}" preload="metadata"></audio><button type="button" class="sc-msg ap-toggle" aria-label="Play audio preview"><svg class="ap-icon" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.8 10.2 6 3 10.2Z"/></svg></button><input class="ap-scrub" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek"><span class="ap-time">0:00</span></div>${note}</section>`;
}
// A small Max-style audio player: a play/pause message box, a slider and a time readout.
function wireAudio(scope){
 const player=scope.querySelector('.audio-player');if(!player)return;
 const audio=player.querySelector('audio'),btn=player.querySelector('.ap-toggle'),scrub=player.querySelector('.ap-scrub'),time=player.querySelector('.ap-time');
 const fmt=t=>Number.isFinite(t)?Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0'):'0:00';
 const paint=()=>{const d=audio.duration||0;scrub.value=d?Math.round(audio.currentTime/d*1000):0;scrub.style.setProperty('--fill',(scrub.value/10)+'%');time.textContent=fmt(audio.currentTime)+' / '+fmt(d)};
 btn.addEventListener('click',()=>{audio.paused?audio.play().catch(()=>{}):audio.pause()});
 audio.addEventListener('play',()=>{btn.innerHTML='<svg class="ap-icon" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.6 1.8h2.4v8.4H2.6zM7 1.8h2.4v8.4H7z"/></svg>';btn.setAttribute('aria-label','Pause audio preview');player.classList.add('playing')});
 audio.addEventListener('pause',()=>{btn.innerHTML='<svg class="ap-icon" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.8 10.2 6 3 10.2Z"/></svg>';btn.setAttribute('aria-label','Play audio preview');player.classList.remove('playing')});
 ['timeupdate','loadedmetadata','ended'].forEach(e=>audio.addEventListener(e,paint));
 scrub.addEventListener('input',()=>{if(audio.duration)audio.currentTime=scrub.value/1000*audio.duration;paint()});
 paint();
}
// Stop any preview when the window closes.
dialog.addEventListener('close',()=>body.querySelectorAll('video,audio').forEach(m=>m.pause()));
// Filter: a Max-style menu object. Click it to open the list of categories.
const filterObj=document.querySelector('.filter-object'),filterBtn=document.querySelector('#filter-button'),filterMenu=document.querySelector('#filter-menu');
const filterItems=[...filterMenu.querySelectorAll('[data-filter]')];
filterItems.forEach(item=>{const f=item.dataset.filter;item.querySelector('.n').textContent=f==='All'?projects.length:projects.filter(p=>p.categories.includes(f)).length});
const menuOpen=()=>filterBtn.getAttribute('aria-expanded')==='true';
function openMenu(){
 if(menuOpen())return;
 filterMenu.getAnimations().forEach(a=>a.cancel());
 filterMenu.hidden=false;filterBtn.setAttribute('aria-expanded','true');filterObj.classList.add('open');
 if(!reducedMotion.matches)filterMenu.animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'none'}],{duration:180,easing:'cubic-bezier(.2,.8,.2,1)'});
 (filterItems.find(x=>x.getAttribute('aria-checked')==='true')||filterItems[0]).focus();
}
function closeMenu(returnFocus){
 if(!menuOpen())return;
 filterBtn.setAttribute('aria-expanded','false');filterObj.classList.remove('open');
 const done=()=>{if(!menuOpen())filterMenu.hidden=true};
 if(reducedMotion.matches)done();else filterMenu.animate([{opacity:1},{opacity:0,transform:'translateY(-4px)'}],{duration:120,easing:'ease-in'}).finished.then(done,done);
 if(returnFocus)filterBtn.focus();
}
function chooseFilter(f){
 filterItems.forEach(x=>x.setAttribute('aria-checked',x.dataset.filter===f?'true':'false'));
 filterObj.dataset.cat=f==='All'?'all':catKey(f);
 filterBtn.querySelector('.fb-text').textContent=f==='All'?'All works':f;
 closeMenu(true);
 if(f!==filter)transitionFilter(f);
}
filterBtn.addEventListener('click',()=>menuOpen()?closeMenu(false):openMenu());
filterBtn.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();openMenu()}});
filterItems.forEach(item=>item.addEventListener('click',()=>chooseFilter(item.dataset.filter)));
filterMenu.addEventListener('keydown',e=>{
 const all=[...filterMenu.querySelectorAll('[role=menuitemradio]')],k=all.indexOf(document.activeElement);
 if(e.key==='ArrowDown'){e.preventDefault();all[(k+1)%all.length].focus()}
 else if(e.key==='ArrowUp'){e.preventDefault();all[(k-1+all.length)%all.length].focus()}
 else if(e.key==='Home'){e.preventDefault();all[0].focus()}
 else if(e.key==='End'){e.preventDefault();all[all.length-1].focus()}
 else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeMenu(true)}
 else if(e.key==='Tab')closeMenu(false);
});
document.addEventListener('pointerdown',e=>{if(!filterObj.contains(e.target))closeMenu(false)});
// Gallery / List switch, tucked at the bottom of the filter menu. The choice is remembered in this browser.
const viewButtons=[...document.querySelectorAll('.view-toggle [data-view]')];
function setView(v,animate=true){
 viewButtons.forEach(b=>b.setAttribute('aria-checked',b.dataset.view===v?'true':'false'));
 const apply=()=>{gallery.classList.toggle('list',v==='list');layoutGallery();animateWires()};
 if(animate&&!reducedMotion.matches){gallery.getAnimations().forEach(a=>a.cancel());gallery.animate([{opacity:1},{opacity:0}],{duration:120,fill:'forwards'}).finished.then(()=>{apply();gallery.getAnimations().forEach(a=>a.cancel());gallery.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:260,easing:'ease-out'}).finished.then(()=>{if(!routingActive)wires()},()=>{})},()=>{})}else apply();
 try{localStorage.setItem('maximalist-view',v)}catch{}
}
viewButtons.forEach(b=>b.addEventListener('click',()=>{closeMenu(true);if(b.getAttribute('aria-checked')!=='true')setView(b.dataset.view)}));
try{if(localStorage.getItem('maximalist-view')==='list')setView('list',false)}catch{}
document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>{const p=b.dataset.panel;if(p==='about')show('p about','<div class="eyebrow">A SPACE FOR EXPERIMENTS</div><h2>Small patches.<br>Open possibilities.</h2><p>Maximalist shows final projects that students built in Max: sound, video, interaction, and the people who made them.</p><p>The gallery takes its visual language from a patch: objects, connections, and ideas flowing between them.</p><p class="notice">This first edition uses sample artworks. It is an independent project in development; no official Cycling ’74 affiliation is claimed.</p>');if(p==='artists')show('p artists','<div class="eyebrow">THE PEOPLE BEHIND THE PATCHES</div><h2>Meet the makers.</h2><p>The artists directory will introduce the students behind each work, with their own words, process, and links.</p>'+projects.map(p=>`<div class="artist-row"><strong>${esc(p.title)}</strong><span>${esc(p.artist)} · ${esc(p.categories.join(', '))}</span></div>`).join(''));}));
document.querySelector('#close').onclick=()=>closeDialog();dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog()}});window.addEventListener('resize',refreshLayout);document.fonts.ready.then(refreshLayout);gallery.addEventListener('load',refreshLayout,true);render();


// index.html#submit opens the submit form directly (linked from the How to submit page).
// Old links to index.html#submit now go to the submit page's form.
if(location.hash==='#submit')location.replace('submit.html#form');

// Keyboard shortcuts. In an artwork window: ← → flip through the works in the order the
// gallery shows them (respects the filter). Esc closes (built into the dialog).
// Anywhere else: ? lists the shortcuts, B bangs the showcase.
let currentProject=-1;
function browseOrder(){const order=[...gallery.querySelectorAll('.card')].map(c=>Number(c.dataset.project));return order.includes(currentProject)?order:projects.map((_,i)=>i)}
function stepProject(dir){const order=browseOrder(),k=order.indexOf(currentProject);openProject(order[(k+dir+order.length)%order.length],dir)}
document.querySelectorAll('.dialog-nav [data-step]').forEach(b=>b.addEventListener('click',()=>stepProject(Number(b.dataset.step))));
function showShortcuts(){show('p shortcuts','<h2>Keyboard shortcuts</h2><dl class="keys"><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Previous or next work, while one is open</dd><dt><kbd>Esc</kbd></dt><dd>Close the window</dd><dt><kbd>B</kbd></dt><dd>Bang the showcase</dd><dt><kbd>?</kbd></dt><dd>Show this list</dd></dl>')}
document.addEventListener('keydown',e=>{
 if(e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.target.closest&&e.target.closest('input,textarea,select,video,audio,[contenteditable]'))return;
 if(dialog.open){
  if(!dialog.classList.contains('artwork-dialog'))return;
  if(e.key==='ArrowRight'){e.preventDefault();stepProject(1)}
  if(e.key==='ArrowLeft'){e.preventDefault();stepProject(-1)}
  return;
 }
 if(e.key==='?'){e.preventDefault();showShortcuts()}
 if(e.key==='b'||e.key==='B')document.querySelector('.sc-bang')?.click();
});

// Card to window: the artwork window zooms out of the card you clicked (or the showcase) and
// zooms back into it when it closes. The page behind dims and brightens with it.
let openedFrom=null,closing=false;
const visible=el=>el&&el.isConnected&&el.offsetParent!==null;
const inView=el=>{if(!visible(el))return false;const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.width>0};
// The transform that makes the window sit over a given box: same center, scaled down evenly
// (never squashed, so the text inside doesn't stretch).
function overBox(box){
 const d=dialog.getBoundingClientRect(),c=box.getBoundingClientRect();
 const sc=Math.max(.25,Math.min(c.width/d.width,c.height/d.height));
 return `translate(${(c.left+c.width/2)-(d.left+d.width/2)}px,${(c.top+c.height/2)-(d.top+d.height/2)}px) scale(${sc})`;
}
function backdrop(from,to,duration){try{dialog.animate({opacity:[from,to]},{duration,easing:'ease-out',fill:'forwards',pseudoElement:'::backdrop'})}catch{}}
function openWork(i,src){
 const box=src&&(src.closest('.sc-window')||src.closest('.card')||src);
 const wasOpen=dialog.open;
 openedFrom={i,box};
 openProject(i);
 if(wasOpen||reducedMotion.matches)return;
 dialog.getAnimations().forEach(a=>a.cancel());
 const start=inView(box)?overBox(box):'translateY(14px) scale(.97)';
 dialog.animate([{transform:start,opacity:0},{opacity:1,offset:.35},{transform:'none',opacity:1}],{duration:440,easing:'cubic-bezier(.2,.8,.2,1)'});
 body.animate([{opacity:0},{opacity:0,offset:.3},{opacity:1}],{duration:440,easing:'ease-out'});
 backdrop(0,1,320);
}
function closeDialog(){
 if(!dialog.open||closing)return;
 const finish=()=>{closing=false;dialog.getAnimations({subtree:true}).forEach(a=>a.cancel());dialog.close()};
 if(reducedMotion.matches){finish();return}
 // Shrink back into the showcase if it still shows this work, otherwise into the work's card.
 let box=null;
 if(dialog.classList.contains('artwork-dialog')){
  if(openedFrom&&openedFrom.i===currentProject&&openedFrom.box?.classList.contains('sc-window')&&inView(openedFrom.box))box=openedFrom.box;
  else{const card=gallery.querySelector(`.card[data-project="${currentProject}"]`);if(inView(card))box=card}
 }
 closing=true;
 const end=box?overBox(box):'translateY(10px) scale(.97)';
 body.animate([{opacity:1},{opacity:0,offset:.5},{opacity:0}],{duration:300,fill:'forwards'});
 backdrop(1,0,300);
 dialog.animate([{transform:'none',opacity:1},{opacity:1,offset:.6},{transform:end,opacity:0}],{duration:320,easing:'cubic-bezier(.5,0,.75,0)',fill:'forwards'}).finished.then(finish,finish);
}
window.openWork=openWork;

// Patching screenshots: double-click, pinch, or the + / − buttons to zoom; drag to look around.
function wireZoom(scope){
 const pane=scope.querySelector('.zoom-pane');if(!pane)return;
 const inner=pane.querySelector('.zoom-inner'),level=pane.querySelector('.zoom-level');
 let s=1,x=0,y=0;const MAX=5,pts=new Map();let pinch=null,dragFrom=null;
 const clamp=()=>{const w=pane.clientWidth,h=pane.clientHeight;x=Math.min(0,Math.max(w*(1-s),x));y=Math.min(0,Math.max(h*(1-s),y))};
 const paint=()=>{clamp();inner.style.transform=`translate(${x}px,${y}px) scale(${s})`;pane.classList.toggle('zoomed',s>1.01);level.textContent=Math.round(s*100)+'%'};
 const zoomAt=(ns,px,py)=>{ns=Math.min(MAX,Math.max(1,ns));x=px-(px-x)*(ns/s);y=py-(py-y)*(ns/s);s=ns;paint()};
 const local=e=>{const r=pane.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 const center=()=>({x:pane.clientWidth/2,y:pane.clientHeight/2});
 pane.querySelectorAll('[data-z]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const c=center(),z=b.dataset.z;if(z==='in')zoomAt(s*1.6,c.x,c.y);if(z==='out')zoomAt(s/1.6,c.x,c.y);if(z==='fit'){s=1;x=0;y=0;paint()}}));
 pane.addEventListener('dblclick',e=>{if(e.target.closest('.zoom-ui'))return;const p=local(e);if(s>1.01){s=1;x=0;y=0;paint()}else zoomAt(2.5,p.x,p.y)});
 pane.addEventListener('wheel',e=>{if(!e.ctrlKey&&s<=1.01)return;e.preventDefault();const p=local(e);if(e.ctrlKey)zoomAt(s*Math.exp(-e.deltaY*.01),p.x,p.y);else{x-=e.deltaX;y-=e.deltaY;paint()}},{passive:false});
 pane.addEventListener('pointerdown',e=>{if(e.target.closest('.zoom-ui'))return;pts.set(e.pointerId,local(e));pane.setPointerCapture(e.pointerId);
  if(pts.size===2){const [a,b]=[...pts.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),s};dragFrom=null}
  else if(s>1.01){const p=local(e);dragFrom={px:p.x,py:p.y,x,y};pane.classList.add('dragging')}});
 pane.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,local(e));
  if(pinch&&pts.size===2){const [a,b]=[...pts.values()];pane.classList.add('dragging');zoomAt(pinch.s*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d,(a.x+b.x)/2,(a.y+b.y)/2);return}
  if(dragFrom){const p=local(e);x=dragFrom.x+p.x-dragFrom.px;y=dragFrom.y+p.y-dragFrom.py;paint()}});
 const end=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;if(!pts.size){dragFrom=null;pane.classList.remove('dragging')}};
 pane.addEventListener('pointerup',end);pane.addEventListener('pointercancel',end);
 paint();
}
