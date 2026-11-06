/* Lights on / lights off. A small easter egg: the moon (or sun) button in the footer.
   Loaded in <head> so a saved dark theme applies before the page paints. */
(function(){
 const KEY='maximalist-theme',root=document.documentElement;
 try{if(localStorage.getItem(KEY)==='dark')root.dataset.theme='dark'}catch{}
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const isDark=()=>root.dataset.theme==='dark';

 function label(btn){
  btn.setAttribute('aria-pressed',isDark());
  btn.setAttribute('aria-label',isDark()?'Switch to light mode':'Switch to dark mode');
  btn.title=isDark()?'lights on':'lights off';
 }
 function apply(next){
  if(next==='dark')root.dataset.theme='dark';else delete root.dataset.theme;
  try{localStorage.setItem(KEY,next)}catch{}
  document.querySelectorAll('.theme-toggle').forEach(label);
 }
 // The new theme grows out of the button as a circle. Browsers without
 // view transitions get a quick color fade instead.
 function toggle(e){
  const next=isDark()?'light':'dark';
  if(reduce.matches){apply(next);return}
  if(!document.startViewTransition){
   root.classList.add('theme-fading');apply(next);
   setTimeout(()=>root.classList.remove('theme-fading'),450);return;
  }
  const b=e.currentTarget.getBoundingClientRect(),x=b.left+b.width/2,y=b.top+b.height/2;
  const r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  root.classList.add('theme-vt');
  const t=document.startViewTransition(()=>apply(next));
  t.finished.finally(()=>root.classList.remove('theme-vt'));
  t.ready.then(()=>root.animate(
   {clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},
   {duration:650,easing:'cubic-bezier(.45,0,.2,1)',pseudoElement:'::view-transition-new(root)'}
  )).catch(()=>{});
 }
 window.toggleTheme=toggle;
 document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.theme-toggle').forEach(btn=>{label(btn);btn.addEventListener('click',toggle)});
 });
})();
