/* c74max deep-link format and reference host from SJSU-CADRE/Art103F26.
   Additional hosts must be confirmed with Cycling '74 before enabling launch. */
(function(root){
 const approvedHosts=new Set(['www.andrewblanton.com','andrewblanton.com','cycling74.com','www.cycling74.com']);
 function maxPatchLink(source){
  try{const u=new URL(source);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||!u.pathname.toLowerCase().endsWith('.maxpat')||!approvedHosts.has(u.hostname))return null;return 'c74max://patcherurl/?src='+u.href}catch{return null}
 }
 root.maxPatchLink=maxPatchLink;
 if(typeof module!=='undefined'&&module.exports)module.exports={maxPatchLink};
})(globalThis);
