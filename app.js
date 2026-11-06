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
 isStudent:true,artist:'Anthony Ha',semester:'Fall 2026',categories:['Visual','3D'],medium:'Max / Jitter',
 coverUrl:'assets/works/torus-render.jpg',imageAspect:'1600 / 1102',
 patchPreview:'assets/works/torus-patching.png',previewCaption:'Patching view, unlocked. Screenshot from Max with the dark theme on.',
 patchFileUrl:'assets/works/3d_rendering_engine.maxpat'
});
// Semester the work was made in. Sample data: a few from last spring, the rest from this fall.
const springWorks=['soft_bodies','eight_directions','grain_garden','raster_weather','collective_pulse','field_notes'];
projects.forEach(p=>{p.semester=p.semester||(springWorks.includes(p.object)?'Spring 2026':'Fall 2026')});
// Short line under each title, shared by the gallery cards, the showcase and the artists list.
function workKind(p,i){return p.isReference?'Reference':p.isStudent?'':i<3?'Sample':'Placeholder'}
function metaLine(p,i){return [workKind(p,i),p.isReference||p.isStudent?p.artist:p.categories[0],p.semester].filter(Boolean).join(' · ')}
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function artMarkup(i){const p=projects[i];if(p.coverUrl){const one=(src,cls,lazy)=>`<img class="cover-image${cls}" src="${esc(src)}" alt="${esc(p.title)}"${lazy?' loading="lazy"':''} style="aspect-ratio:${p.imageAspect}">`;return p.coverUrlDark?one(p.coverUrl,' only-light')+one(p.coverUrlDark,' only-dark'):one(p.coverUrl,'',true)}return i<3?`<div class="art art-${i}" role="img" aria-label="${esc(p.title)} sample artwork"></div>`:`<div class="placeholder-art type-${p.cable}" style="aspect-ratio:${p.imageAspect}" aria-hidden="true"><div class="placeholder-graphic"></div><span class="placeholder-label">${p.categories[0].toUpperCase()} / ARTWORK TO COME</span></div>`}
let filter='All';const gallery=document.querySelector('#gallery'),dialog=document.querySelector('#dialog'),body=document.querySelector('#dialog-body');
let animationFrame=0, generation=0;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function render(){
 gallery.innerHTML=projects.map((p,i)=>({p,i})).filter(({p})=>filter==='All'||p.categories.includes(filter)).map(({p,i})=>`<button class="card" data-project="${i}" aria-label="View ${p.title}"><i class="inlet" aria-hidden="true"></i><div class="object-name"><span>p ${p.object}</span><span aria-hidden="true">↗</span></div>${artMarkup(i)}<h2>${p.title}</h2><p>${esc(metaLine(p,i))}</p></button>`).join('');
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
function cableKind(project){return project.categories.includes('3D')?'spatial':project.cable}
function routes(){
 const svg=document.querySelector('.cords'),root=document.querySelector('.canvas').getBoundingClientRect();
 const title=document.querySelector('.title-object').getBoundingClientRect(),tagline=document.querySelector('.max-intro').getBoundingClientRect(),filters=document.querySelector('.filters').getBoundingClientRect();
 const cards=[...gallery.querySelectorAll('.card')],firstTop=cards[0]?.getBoundingClientRect().top;
 const firstRow=cards.filter(card=>Math.abs(card.getBoundingClientRect().top-firstTop)<2).slice(0,3);
 cards.forEach(card=>card.classList.toggle('connected',firstRow.includes(card)));
 const activeTypes=new Set(firstRow.map(card=>cableKind(projects[Number(card.dataset.project)])));
 document.querySelectorAll('[data-outlet]').forEach(port=>port.classList.toggle('active-port',activeTypes.has(port.dataset.outlet)));
 svg.setAttribute('viewBox',`0 0 ${root.width} ${root.height}`);
 return firstRow.map((card,index)=>{
 const kind=cableKind(projects[Number(card.dataset.project)]);
 const start=document.querySelector(`[data-outlet="${kind}"]`).getBoundingClientRect(),end=card.querySelector('.inlet').getBoundingClientRect();
 const sx=start.left+start.width/2-root.left,ex=end.left+end.width/2-root.left;
 // Short internal lanes live to the right of the hero text, not at the page edge.
 // Keep the cables clear of the showcase: to its right when it sits in the flow (narrower
 // screens), and squeezed into the gap before it when it sits beside the title.
 const sc=document.querySelector('.showcase'),scBox=sc&&sc.getBoundingClientRect(),scBeside=sc&&getComputedStyle(sc).position==='absolute';
 const base=Math.max(title.right,tagline.right,filters.right,sc&&!scBeside?scBox.right:0)-root.left+36;
 const step=scBeside?Math.max(14,Math.min(48,(scBox.left-root.left-28-base)/2)):48;
 const rail=Math.min(root.width-20-index*10,base+index*step);
 return {kind,sx,sy:start.bottom-root.top,ex,ey:end.top-root.top,rail,top:start.bottom-root.top+12+index*16,lane:end.top-root.top-25-index*15};
 });
}
function pathFor(r,bend=0){
 const {sx,sy,ex,ey,rail,top}=r,lane=r.lane+bend,k=7,dir=ex>=rail?1:-1;
 return `M ${sx} ${sy} V ${top-k} Q ${sx} ${top} ${sx+k} ${top} H ${rail-k} Q ${rail} ${top} ${rail} ${top+k} V ${lane-k} Q ${rail} ${lane} ${rail+dir*k} ${lane} H ${ex-dir*k} Q ${ex} ${lane} ${ex} ${lane+k} V ${ey}`;
}
function paintWires(data,bend=0,opacity=1){
 const svg=document.querySelector('.cords'),signature=data.map(r=>r.kind).join(',');
 if(svg.dataset.signature!==signature){svg.dataset.signature=signature;svg.innerHTML=data.map(r=>`<g data-cable="${r.kind}"><path class="cable-base"/><path class="${r.kind==='other'?'cable-flow':'cable-stripe '+r.kind}"/></g>`).join('')}
 [...svg.querySelectorAll('g')].forEach((g,i)=>{g.setAttribute('opacity',opacity);g.querySelectorAll('path').forEach(p=>p.setAttribute('d',pathFor(data[i],bend)))})
}
function wires(){cancelAnimationFrame(animationFrame);generation++;routingActive=false;paintWires(routes())}
function animateWires(){cancelAnimationFrame(animationFrame);const current=++generation;routingActive=true;requestAnimationFrame(()=>{const data=routes();if(reducedMotion.matches){paintWires(data);routingActive=false;return}const started=performance.now();function tick(now){if(current!==generation)return;const t=Math.min(1,(now-started)/700),ease=1-Math.pow(1-t,3);paintWires(data,-16*(1-ease),.25+.75*ease);if(t<1)animationFrame=requestAnimationFrame(tick);else routingActive=false}animationFrame=requestAnimationFrame(tick)})}
let filterGeneration=0;
async function transitionFilter(next){
 const token=++filterGeneration,svg=document.querySelector('.cords');
 gallery.getAnimations().forEach(a=>a.cancel());svg.getAnimations().forEach(a=>a.cancel());
 if(!reducedMotion.matches){const a=gallery.animate([{opacity:1},{opacity:0}],{duration:150,fill:'forwards'});svg.animate([{opacity:1},{opacity:0}],{duration:150,fill:'forwards'});try{await a.finished}catch{}if(token!==filterGeneration)return}
 filter=next;render();gallery.getAnimations().forEach(a=>a.cancel());svg.getAnimations().forEach(a=>a.cancel());
 if(!reducedMotion.matches){gallery.animate([{opacity:0},{opacity:1}],{duration:300,easing:'ease-out'});svg.animate([{opacity:0},{opacity:1}],{duration:300,easing:'ease-out'})}
}
// Semester choices for the form: the last few terms plus the next one, with the current term picked.
function semesterOptions(){
 const terms=['Spring','Summer','Fall'],now=new Date(),current=now.getFullYear()*3+(now.getMonth()<5?0:now.getMonth()<8?1:2),list=[];
 for(let k=current-3;k<=current+1;k++)list.push({label:terms[k%3]+' '+Math.floor(k/3),now:k===current});
 return list.map(t=>`<option${t.now?' selected':''}>${t.label}</option>`).join('');
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
 show('p '+p.object,`<div class="detail-top ${Number(p.imageAspect.split('/')[0])/Number(p.imageAspect.split('/')[1])<1?'portrait-detail':''}"><div class="detail-cover">${artMarkup(i)}<span class="detail-caption">${p.isReference?'Reference example from the Art 103 repository':p.isStudent?'Output from the patch, rendered in Max':'Placeholder · Student details to come'}</span></div><div class="detail-info"><h3>Title</h3><h2 class="detail-title">${esc(p.title)}</h2><div class="detail-meta"><div><h3>Artist</h3><p>${esc(p.artist)}${portfolio?' · '+portfolio:''}</p></div><div><h3>Semester</h3><p>${esc(p.semester)}</p></div></div><h3>Summary</h3><p class="detail-summary">${esc(p.description)}</p></div></div>${previewMarkup(p)}<section class="patch-section"><div class="patch-section-title"><h3>Patcher</h3><span>PATCHING VIEW</span></div>${preview}</section><div class="patch-actions">${action}</div><p id="patch-help" class="patch-help">${deepLink?'Requires Max installed on your computer. Your browser may ask you to allow Max to open. If it does not open, get the .maxpat file and open it in Max.':p.patchFileUrl?'Download the file and open it in Max. Open patcher (straight into Max) will work once the file is hosted online.':'This placeholder does not have a patch file yet. Open patcher will be available when the artist’s file is added.'}</p><p id="launch-status" role="status"></p>`,true);
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
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});transitionFilter(b.dataset.filter)}));
document.querySelector('#view').addEventListener('change',e=>{gallery.classList.toggle('list',e.target.value==='list');layoutGallery();animateWires()});
document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>{const p=b.dataset.panel;if(p==='about')show('p about','<div class="eyebrow">A SPACE FOR EXPERIMENTS</div><h2>Small patches.<br>Open possibilities.</h2><p>Maximalist shows final projects that students built in Max: sound, video, interaction, and the people who made them.</p><p>The gallery takes its visual language from a patch: objects, connections, and ideas flowing between them.</p><p class="notice">This first edition uses sample artworks. It is an independent project in development; no official Cycling ’74 affiliation is claimed.</p>');if(p==='artists')show('p artists','<div class="eyebrow">THE PEOPLE BEHIND THE PATCHES</div><h2>Meet the makers.</h2><p>The artists directory will introduce the students behind each work, with their own words, process, and links.</p>'+projects.map(p=>`<div class="artist-row"><strong>${esc(p.title)}</strong><span>${esc(p.artist)} · ${esc(p.semester)}</span></div>`).join(''));if(p==='submit'){show('p submit',`<h2>Submit your final.</h2><p>Fill this out with links to your files. Every submission gets checked by a reviewer before it shows up in the gallery.</p><p class="notice">Submissions aren’t open yet. For now this saves a draft in your browser, or exports it as a file. Nothing gets sent.</p><p class="guide-link"><a href="submit.html">Read how to submit first ↗</a> It covers file sizes and what to include.</p><form id="draft"><label>Your name<input name="artist" required maxlength="100" autocomplete="name"></label><label>Title of the work<input name="title" required maxlength="150"></label><label>Semester<select name="semester" required>${semesterOptions()}</select></label><fieldset class="tag-options"><legend>Tags <small>Choose all that apply</small></legend><label><input type="checkbox" name="tags" value="sound"> sound</label><label><input type="checkbox" name="tags" value="visual"> visual</label><label><input type="checkbox" name="tags" value="interactive"> interactive</label><label><input type="checkbox" name="tags" value="3d"> 3D</label><label><input type="checkbox" name="tags" value="other"> other</label></fieldset><label>Link to your patch <small>.maxpat or a zipped project folder</small><input name="url" type="url" placeholder="https://" required></label><label>Link to a patching view screenshot <small>unlocked, every object visible</small><input name="patching" type="url" placeholder="https://" required></label><label>Same screenshot with Max in a dark theme <small>optional · used in the site’s dark mode</small><input name="patchingDark" type="url" placeholder="https://"></label><label>Preview video or audio <small>optional · MP4 or MP3</small><input name="preview" type="url" placeholder="https://"></label><label>Your portfolio or website <small>optional</small><input name="portfolio" type="url" placeholder="https://"></label><label>About your patch<textarea name="description" required maxlength="1200" placeholder="What does it do, and how? Name a few of the objects you used."></textarea></label><label>Did you use AI tools anywhere in this work?<select name="ai" required><option value="">Choose one</option><option>No</option><option>Yes, for help with code or debugging</option><option>Yes, generated media is part of the piece</option><option>Yes, something else (I explain it in my description)</option></select></label><button class="primary" type="submit">Save draft locally</button><button type="button" id="export">Export draft ↗</button><div id="saved" role="status"></div></form>`);const form=document.querySelector('#draft');try{const d=JSON.parse(localStorage.getItem('maximalist-draft')||'{}');for(const k of ['artist','title','semester','url','patching','patchingDark','preview','portfolio','description','ai'])if(d[k]!==undefined&&form.elements[k])form.elements[k].value=d[k];const tags=Array.isArray(d.tags)?d.tags:d.tag?[d.tag]:[];form.querySelectorAll('[name=tags]').forEach(x=>x.checked=tags.includes(x.value))}catch{}const data=()=>{const f=new FormData(form),d=Object.fromEntries(f);d.tags=f.getAll('tags');return d};form.onsubmit=e=>{e.preventDefault();try{localStorage.setItem('maximalist-draft',JSON.stringify(data()));document.querySelector('#saved').textContent='Draft saved in this browser. Nothing has been sent.'}catch{document.querySelector('#saved').textContent='Browser storage is unavailable. Use Export draft to keep a copy.'}};document.querySelector('#export').onclick=()=>{if(!form.reportValidity())return;const blob=new Blob([JSON.stringify(data(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='maximalist-project-draft.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#saved').textContent='Draft exported. Nothing has been sent.'}}}));
document.querySelector('#close').onclick=()=>closeDialog();dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog()}});window.addEventListener('resize',refreshLayout);document.fonts.ready.then(refreshLayout);gallery.addEventListener('load',refreshLayout,true);render();


// index.html#submit opens the submit form directly (linked from the How to submit page).
function openFromHash(){if(location.hash==='#submit')document.querySelector('[data-panel="submit"]')?.click()}
window.addEventListener('hashchange',openFromHash);openFromHash();

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

// Card to window: the clicked card grows into the artwork window and its image flies into
// place. Closing plays it in reverse, back into the card (or the showcase) it came from.
// Uses the browser's view transitions; browsers without them just open the window.
let openedFrom=null;
const visible=el=>el&&el.isConnected&&el.offsetParent!==null;
const inView=el=>{if(!visible(el))return false;const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.width>0};
const artIn=el=>el&&[...el.querySelectorAll(':scope .art,:scope .placeholder-art,:scope .cover-image,:scope .sc-layer')].filter(visible).pop();
function coverEl(){return [...body.querySelectorAll('.detail-cover>:is(img,.art,.placeholder-art)')].find(visible)}
function nameIt(el,n){if(el)el.style.viewTransitionName=n}
function clearNames(){document.querySelectorAll('[style*="view-transition-name"]').forEach(el=>el.style.viewTransitionName='')}
function morph(update){
 if(!document.startViewTransition||reducedMotion.matches){update();return}
 const root=document.documentElement;root.classList.add('work-vt');
 const t=document.startViewTransition(update);
 t.finished.finally(()=>{clearNames();root.classList.remove('work-vt')});
}
function openWork(i,src){
 const box=src&&(src.closest('.sc-window')||src.closest('.card')||src);
 openedFrom={i,box,art:src&&src.classList.contains('sc-stage')?artIn(src):artIn(box)};
 if(dialog.open||!inView(box)){openProject(i);return}
 nameIt(box,'work-window');nameIt(openedFrom.art,'work-art');
 morph(()=>{nameIt(box,'');nameIt(openedFrom.art,'');openProject(i);nameIt(dialog,'work-window');nameIt(coverEl(),'work-art')});
}
function closeDialog(){
 if(!dialog.open)return;
 const artwork=dialog.classList.contains('artwork-dialog');
 // Where should it shrink back to? The showcase if it still shows this work, else its card.
 let box=null,art=null;
 if(artwork){
  if(openedFrom&&openedFrom.i===currentProject&&inView(openedFrom.box)&&openedFrom.box.classList.contains('sc-window')){box=openedFrom.box;art=artIn(box.querySelector('.sc-stage'))}
  else{const card=gallery.querySelector(`.card[data-project="${currentProject}"]`);if(inView(card)){box=card;art=artIn(card)}}
 }
 if(!box){
  if(!reducedMotion.matches)dialog.animate([{opacity:1,transform:'none'},{opacity:0,transform:'scale(.98)'}],{duration:160,easing:'ease-in'}).finished.then(()=>dialog.close(),()=>dialog.close());
  else dialog.close();
  return;
 }
 nameIt(dialog,'work-window');nameIt(coverEl(),'work-art');
 morph(()=>{nameIt(dialog,'');nameIt(coverEl(),'');dialog.close();nameIt(box,'work-window');nameIt(art,'work-art')});
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
