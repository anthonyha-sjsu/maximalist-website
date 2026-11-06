/* The submission form on submit.html.
   Order: title, name, description, artist statement, tags (they set the card's glow), thumbnail, Max project.
   Files are picked from the visitor's computer (click or drag and drop) and previewed here, but
   nothing is uploaded yet: there's no server. When a backend exists, send the FormData from
   collect() to it in the submit handler. */
(function(){
 const slot=document.querySelector('#form-slot');if(!slot)return;
 const TAGS=[['sound','Sound'],['visual','Visual'],['interactive','Interactive'],['3d','3D'],['other','Other']];
 const MB=1024*1024;
 const UPLOAD_ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg>';
 const drop=(name,label,hint,accept,help,required)=>`
<div class="field"><span class="field-label" id="${name}-label">${label}${required?'':' <small>optional</small>'}</span>
 <div class="dropzone" data-name="${name}" data-accept="${accept}">
  <input type="file" id="${name}" name="${name}" accept="${accept}" ${required?'required':''} aria-labelledby="${name}-label" aria-describedby="${name}-help">
  <div class="dz-empty">${UPLOAD_ICON}<span class="dz-title">Drag a file here, or <u>choose from your computer</u></span><span class="dz-hint">${hint}</span></div>
  <div class="dz-file" hidden><span class="dz-thumb"></span><span class="dz-info"><span class="dz-name"></span><span class="dz-size"></span></span><button type="button" class="dz-remove sc-msg" aria-label="Remove file">remove</button></div>
 </div><small class="field-help" id="${name}-help">${help}</small></div>`;

 slot.innerHTML=`<div class="submit-layout"><form id="draft" novalidate>
<label class="field">Title of project<input name="title" required maxlength="150" placeholder="What is it called?"></label>
<label class="field">Name of artist<input name="artist" required maxlength="100" autocomplete="name" placeholder="How you want to be credited"></label>
<label class="field">Description <small>how it works</small><textarea name="description" required maxlength="1200" placeholder="What does it do, and how? Name a few of the objects you used."></textarea><small class="field-help"><span class="count" data-for="description">0</span> / 1200</small></label>
<label class="field">Artist statement <small>what it’s about and why you made it</small><textarea name="statement" required maxlength="1500" placeholder="What were you exploring? What should someone feel or notice when they see it?"></textarea><small class="field-help"><span class="count" data-for="statement">0</span> / 1500</small></label>
<fieldset class="field tag-picker"><legend>Tags <small>choose all that apply · they set your card’s glow</small></legend>
 <div class="tag-row">${TAGS.map(([k,l])=>`<label class="tag-pill" style="--cat:var(--c-${k})"><input type="checkbox" name="tags" value="${k}"><i></i>${l}</label>`).join('')}</div>
</fieldset>
${drop('thumbnail','Thumbnail','JPG, PNG or GIF · at least 1600px wide · up to 20 MB','image/*','A still of the piece running. This is the image on your gallery card.',true)}
${drop('project','Max project','.maxpat, .maxproj, .amxd, or a .zip of the project folder · up to 200 MB','.maxpat,.maxproj,.amxd,.zip','If it uses samples, videos or abstractions, zip the whole folder.',true)}
<details class="extras"><summary>More (optional)</summary>
${drop('patching','Patching view screenshot','PNG · unlocked, every object visible','image/*','Shown in the Patcher section of your artwork window.',false)}
${drop('preview','Preview video or audio','MP4 under 50 MB, or MP3 under 10 MB','video/mp4,audio/mpeg,.mp4,.mp3','A short recording of the patch running.',false)}
<label class="field">Portfolio or website<input name="portfolio" type="url" placeholder="https://"></label>
<label class="field">Did you use AI tools anywhere in this work?<select name="ai"><option value="">Choose one</option><option>No</option><option>Yes, for help with code or debugging</option><option>Yes, generated media is part of the piece</option><option>Yes, something else (I explain it in my description)</option></select></label>
</details>
<div class="form-actions"><button class="primary" type="submit">Submit ↑</button><button type="button" id="save">Save draft</button></div>
<div id="saved" role="status"></div>
</form>
<aside class="live-preview" aria-label="Preview of your gallery card"><span class="lp-label">Preview</span>
 <div class="lp-card"><div class="lp-glow" aria-hidden="true"></div><div class="lp-box"><i class="lp-inlet" aria-hidden="true"></i>
  <div class="lp-head">p <span class="lp-object">untitled</span></div>
  <div class="lp-image"><span>Your thumbnail</span></div>
  <h3 class="lp-title">Title of project</h3>
  <p class="lp-meta"><span class="lp-tags"></span><span class="lp-artist">Your name</span></p>
 </div></div>
 <p class="lp-note">Hover the card to see the glow spread. Its colors come from the tags you pick.</p>
</aside></div>`;

 const form=slot.querySelector('#draft'),saved=slot.querySelector('#saved'),files={};
 const lp=k=>slot.querySelector('.lp-'+k);
 const fmt=n=>n<MB?Math.max(1,Math.round(n/1024))+' KB':(n/MB).toFixed(n<10*MB?1:0)+' MB';
 const LIMITS={project:200*MB,thumbnail:20*MB,patching:20*MB,preview:50*MB};

 // ---- Drop zones: click to choose, or drag a file onto them
 slot.querySelectorAll('.dropzone').forEach(dz=>{
  const name=dz.dataset.name,input=dz.querySelector('input'),empty=dz.querySelector('.dz-empty'),full=dz.querySelector('.dz-file');
  const okType=f=>{const exts=dz.dataset.accept.split(',').map(s=>s.trim().toLowerCase());const n=f.name.toLowerCase();return exts.some(x=>x.endsWith('/*')?f.type.startsWith(x.slice(0,-1)):x.startsWith('.')?n.endsWith(x):f.type===x)};
  function set(f){
   dz.classList.remove('error');
   if(f&&!okType(f)){dz.classList.add('error');say(`“${f.name}” isn’t the right kind of file for ${dz.closest('.field').querySelector('.field-label').firstChild.textContent.trim()}.`);input.value='';return}
   if(f&&f.size>LIMITS[name]){dz.classList.add('error');say(`“${f.name}” is ${fmt(f.size)}. The limit here is ${fmt(LIMITS[name])}.`);input.value='';return}
   if(files[name]?.url)URL.revokeObjectURL(files[name].url);
   if(!f){delete files[name];input.value='';empty.hidden=false;full.hidden=true;dz.classList.remove('has-file');if(name==='thumbnail')thumbPreview(null);return}
   const url=f.type.startsWith('image/')?URL.createObjectURL(f):null;files[name]={file:f,url};
   empty.hidden=true;full.hidden=false;dz.classList.add('has-file');
   full.querySelector('.dz-name').textContent=f.name;full.querySelector('.dz-size').textContent=fmt(f.size);
   full.querySelector('.dz-thumb').innerHTML=url?`<img src="${url}" alt="">`:`<b>${(f.name.split('.').pop()||'file').slice(0,6)}</b>`;
   if(name==='thumbnail')thumbPreview(url);
   if(name==='project'&&!form.elements.title.value){/* suggest a title from the file name */form.elements.title.placeholder=f.name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ')}
   if(!reduce.matches)full.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:250,easing:'ease-out'});
  }
  input.addEventListener('change',()=>set(input.files[0]||null));
  full.querySelector('.dz-remove').addEventListener('click',e=>{e.preventDefault();set(null);input.focus()});
  ['dragenter','dragover'].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.add('over')}));
  ['dragleave','drop'].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();if(t==='dragleave'&&dz.contains(e.relatedTarget))return;dz.classList.remove('over')}));
  dz.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)set(f)});
 });
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 // Stop a file dropped outside a zone from opening in the browser and leaving the page.
 ['dragover','drop'].forEach(t=>addEventListener(t,e=>{if(!e.target.closest?.('.dropzone'))e.preventDefault()}));

 // ---- Live preview card
 function thumbPreview(url){const box=lp('image');box.innerHTML=url?`<img src="${url}" alt="">`:'<span>Your thumbnail</span>';box.classList.toggle('filled',!!url)}
 function updatePreview(){
  const title=form.elements.title.value.trim(),artist=form.elements.artist.value.trim();
  const tags=[...form.querySelectorAll('[name=tags]:checked')].map(x=>x.value);
  lp('title').textContent=title||'Title of project';lp('title').classList.toggle('ph',!title);
  lp('artist').textContent=artist||'Your name';lp('artist').classList.toggle('ph',!artist);
  lp('object').textContent=title?title.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')||'untitled':'untitled';
  lp('tags').innerHTML=tags.map(k=>`<span style="--c:var(--c-${k})">${TAGS.find(t=>t[0]===k)[1]}</span>`).join('');
  // The glow blends the colors of every tag picked. With no tags it stays a soft neutral.
  const cols=tags.length?tags.map(k=>`var(--c-${k})`):['#c9c6bb'];
  const glow=lp('glow');
  glow.style.background=cols.length===1?cols[0]:`conic-gradient(from 200deg,${[...cols,cols[0]].join(',')})`;
  slot.querySelector('.lp-card').style.setProperty('--cat',cols[0]);
  slot.querySelector('.lp-card').classList.toggle('tagged',tags.length>0);
  form.querySelectorAll('.count[data-for]').forEach(c=>c.textContent=form.elements[c.dataset.for].value.length);
 }
 form.addEventListener('input',updatePreview);form.addEventListener('change',updatePreview);
 // Once a missing field gets filled in, drop its red outline right away.
 form.addEventListener('input',e=>e.target.classList.remove('missing'));
 form.addEventListener('change',e=>{e.target.closest('.dropzone,.tag-picker')?.classList.remove('missing');e.target.classList.remove('missing')});
 form.addEventListener('drop',e=>e.target.closest('.dropzone')?.classList.remove('missing'));

 // ---- Drafts (text only; browsers can't keep the files themselves between visits)
 const KEYS=['title','artist','description','statement','portfolio','ai'];
 try{const d=JSON.parse(localStorage.getItem('maximalist-draft')||'{}');KEYS.forEach(k=>{if(typeof d[k]==='string'&&form.elements[k])form.elements[k].value=d[k]});const t=Array.isArray(d.tags)?d.tags:[];form.querySelectorAll('[name=tags]').forEach(x=>x.checked=t.includes(x.value))}catch{}
 function say(msg){saved.textContent=msg;if(!reduce.matches)saved.animate([{opacity:0},{opacity:1}],{duration:200})}
 slot.querySelector('#save').addEventListener('click',()=>{
  const d={};KEYS.forEach(k=>d[k]=form.elements[k].value);d.tags=[...form.querySelectorAll('[name=tags]:checked')].map(x=>x.value);
  try{localStorage.setItem('maximalist-draft',JSON.stringify(d));say('Draft saved in this browser. Your files aren’t saved with it, so you’ll need to pick them again next time.')}catch{say('This browser won’t let the page save a draft.')}
 });

 // ---- Submit: checks everything, then explains that uploads aren't switched on yet.
 function collect(){const fd=new FormData();KEYS.forEach(k=>fd.append(k,form.elements[k].value));form.querySelectorAll('[name=tags]:checked').forEach(x=>fd.append('tags',x.value));Object.entries(files).forEach(([k,v])=>fd.append(k,v.file));return fd}
 form.addEventListener('submit',e=>{
  e.preventDefault();
  const problems=[];
  if(!form.elements.title.value.trim())problems.push(['title','a title']);
  if(!form.elements.artist.value.trim())problems.push(['artist','your name']);
  if(!form.elements.description.value.trim())problems.push(['description','a description']);
  if(!form.elements.statement.value.trim())problems.push(['statement','an artist statement']);
  if(!form.querySelector('[name=tags]:checked'))problems.push(['tags','at least one tag']);
  if(!files.thumbnail)problems.push(['thumbnail','a thumbnail']);
  if(!files.project)problems.push(['project','your Max project file']);
  slot.querySelectorAll('.missing').forEach(x=>x.classList.remove('missing'));
  if(problems.length){
   problems.forEach(([k])=>{const el=k==='tags'?form.querySelector('.tag-picker'):form.querySelector(`.dropzone[data-name="${k}"]`)||form.elements[k];el.classList.add('missing')});
   say('Still needed: '+problems.map(p=>p[1]).join(', ')+'.');
   const first=problems[0][0],target=first==='tags'?form.querySelector('[name=tags]'):form.elements[first];target?.focus();return;
  }
  const total=Object.values(files).reduce((n,v)=>n+v.file.size,0);
  void collect(); // ready for a real upload once there's a server
  say(`Everything’s ready: ${Object.keys(files).length} file${Object.keys(files).length>1?'s':''}, ${fmt(total)} in all. Uploads aren’t switched on yet, so nothing left your computer. Once the review system is live, this button will send it.`);
 });
 updatePreview();
})();
