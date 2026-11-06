// Change this single value when the launch date is confirmed.
// Midnight Pacific marks the date only; the party start time is still TBD.
const LAUNCH_DATE = '2026-12-11T00:00:00-08:00';
// Each digit is a little reel of numbers that rolls to the new value, like an odometer.
// Counting down, the next number drops in from above.
const REEL_STEP=1.2; // em, matches the digit height in style.css
function makeDigit(){const w=document.createElement('span');w.className='digit';w.setAttribute('aria-hidden','true');w.innerHTML='<span class="reel"><i></i>'+[0,1,2,3,4,5,6,7,8,9].map(n=>`<i>${n}</i>`).join('')+'</span>';w.d=null;return w}
function place(reel,index,animate){reel.style.transition=animate?'':'none';reel.style.transform=`translateY(${-index*REEL_STEP}em)`}
function setDigit(w,d){
 const reel=w.firstChild;
 if(w.d===null||matchMedia('(prefers-reduced-motion: reduce)').matches){place(reel,d+1,false);w.d=d;return}
 if(d===w.d)return;
 if(d>w.d){ // wrapping around (for example 0 to 9): roll in from the spare slot on top, then jump to the real one
  reel.firstChild.textContent=d;place(reel,0,true);
  const settle=()=>{reel.removeEventListener('transitionend',settle);if(w.d===d)place(reel,d+1,false)};
  reel.addEventListener('transitionend',settle);
 }else place(reel,d+1,true);
 w.d=d;
}
function roll(el,text){
 if(!el.rollers){el.textContent='';el.rollers=[]}
 while(el.rollers.length<text.length){const w=makeDigit();el.prepend(w);el.rollers.unshift(w)}
 while(el.rollers.length>text.length){el.rollers.shift().remove()}
 [...text].forEach((c,k)=>setDigit(el.rollers[k],Number(c)));
}
function updateCountdown(now=Date.now()){
 const remaining=Math.max(0,Math.floor((Date.parse(LAUNCH_DATE)-now)/1000));
 const values={days:Math.floor(remaining/86400),hours:Math.floor(remaining/3600)%24,minutes:Math.floor(remaining/60)%60,seconds:remaining%60};
 for(const [unit,n] of Object.entries(values)){const el=document.querySelector(`[data-unit="${unit}"]`);if(el)roll(el,String(n).padStart(2,'0'))}
 const clock=document.querySelector('.clock');if(clock)clock.setAttribute('aria-label',`${values.days} days, ${values.hours} hours, ${values.minutes} minutes until December 11, 2026, Pacific time. Event time unconfirmed.`);
 if(!remaining){const note=document.querySelector('.launch-note');if(note)note.textContent='The tentative date has arrived. Event details to be confirmed.'}
}
updateCountdown();setInterval(()=>{if(!document.hidden)updateCountdown()},1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateCountdown()});
// Keep the destination in the RSVP anchors until the organizer supplies a registration URL.
const launchBanner=document.querySelector('.launch');
if(launchBanner){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 // The orange accent plus the cable colors from the gallery legend.
 const COLORS=['#ecc882','#e0a24a','#c07a28','#e2d92d','#79a87b','#68b5e9','#a58fd0','#d49bb1'];
 const SHAPES=['','','square','circle','ribbon'];
 const PIECES=64;
 let layer=null,lastBurst=-Infinity;
 function getLayer(){
  if(!layer||!layer.isConnected){layer=document.createElement('div');layer.className='confetti-layer';layer.setAttribute('aria-hidden','true');document.body.append(layer)}
  return layer;
 }
 // Simulate one piece (launch, gravity, air drag, side-to-side sway, tumbling) and bake it into keyframes.
 function flight(){
  const angle=(-90+(Math.random()*2-1)*70)*Math.PI/180,speed=6+Math.random()*9;
  let vx=Math.cos(angle)*speed,vy=Math.sin(angle)*speed,x=0,y=0;
  const g=.3,drag=.955,phase=Math.random()*6.28,sway=.5+Math.random()*1.2,spin=(Math.random()*2-1)*12,tumble=5+Math.random()*9;
  const frames=Math.round(85+Math.random()*45),keyframes=[];
  for(let f=0;f<=frames;f++){
   if(f%3===0||f===frames){
    const t=f/frames;
    keyframes.push({offset:t,opacity:t<.7?1:(1-t)/.3,transform:`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(spin*f).toFixed(0)}deg) rotateX(${(tumble*f).toFixed(0)}deg)`});
   }
   vx*=drag;vy=vy*drag+g;
   x+=vx+Math.sin(phase+f*.13)*sway;y+=vy;
  }
  return {keyframes,duration:frames*16.7};
 }
 function burst(cx,cy){
  const now=performance.now();
  if(reduce.matches||now-lastBurst<1300)return;
  lastBurst=now;const host=getLayer();
  for(let i=0;i<PIECES;i++){
   const piece=document.createElement('i'),{keyframes,duration}=flight();
   piece.className=SHAPES[Math.floor(Math.random()*SHAPES.length)];
   piece.style.cssText=`left:${cx}px;top:${cy}px;background:${COLORS[Math.floor(Math.random()*COLORS.length)]}`;
   host.append(piece);
   // A few pieces leave a beat later so it pops instead of firing all at once.
   piece.animate(keyframes,{duration,delay:i%4===0?90:0,easing:'linear',fill:'both'}).finished.catch(()=>{}).then(()=>piece.remove());
  }
 }
 launchBanner.addEventListener('pointerenter',e=>burst(e.clientX,e.clientY));
 launchBanner.querySelector('.rsvp')?.addEventListener('focus',e=>{const r=e.target.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2)});
}
