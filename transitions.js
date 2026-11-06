/* Smooth page changes. Clicking a link to another page on the site fades the page content
   out first; the next page fades in on its own (see page-in in style.css). The header stays
   still the whole time, so it feels like one site instead of separate pages. */
(function(){
 const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)');
 document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||reduce.matches)return;
  const a=e.target.closest('a[href]');if(!a||a.target||a.hasAttribute('download'))return;
  const url=new URL(a.href,location.href);
  if(url.protocol!==location.protocol||url.host!==location.host)return;
  if(!/\.html?$/i.test(url.pathname)&&!url.pathname.endsWith('/'))return;
  if(url.pathname===location.pathname)return;   // same page, maybe just a #link
  e.preventDefault();
  root.classList.add('page-leave');
  setTimeout(()=>{location.href=url.href},220);
 });
 // Coming back with the browser's back button can restore the faded-out page; undo that.
 addEventListener('pageshow',()=>root.classList.remove('page-leave'));
})();
