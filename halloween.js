(function(){
'use strict';
const START=Date.parse('2026-10-31T00:00:00-07:00'),END=Date.parse('2026-11-01T00:00:00-07:00');
function isHalloween(now){return now>=START&&now<END;}
if(typeof module!=='undefined'&&module.exports)module.exports={isHalloween,START,END};
if(typeof document==='undefined')return;
const surprise=document.createElement('dialog');surprise.id='halloween-scare';surprise.setAttribute('aria-labelledby','scare-title');
surprise.innerHTML='<button id="scare-close" aria-label="Close Halloween surprise">✕</button><div class="scare-content"><p class="scare-kicker">A BYTE-SIZED HALLOWEEN SURPRISE</p><div id="scare-canvas" class="scare-art"><img src="halloween-vampire-smile.png" width="1254" height="1254" alt="Illustrated vampire Tera with orange glasses, tiny fangs, a red-lined cape and Costco Tera badge, beside a pumpkin beneath the Halloween moon."></div><h2 id="scare-title">BOO! IT’S TERA!</h2><p>Fangs for stopping by. Pick up a free sample on us!</p><small>from BKM Tech Team</small><button id="scare-replay" hidden>REPLAY PREVIEW</button></div>';
document.body.append(surprise);
let shown=false,autoClose=0;
function show(preview=false){clearTimeout(autoClose);document.dispatchEvent(new Event('tera-halloween-opening'));surprise.classList.remove('scare-play');if(!surprise.open)surprise.showModal();document.getElementById('scare-replay').hidden=!preview;void surprise.offsetWidth;surprise.classList.add('scare-play');document.getElementById('scare-close').focus({preventScroll:true});if(!preview)autoClose=setTimeout(()=>surprise.close(),4200);}
surprise.addEventListener('close',()=>{clearTimeout(autoClose);surprise.classList.remove('scare-play');});
document.getElementById('scare-close').addEventListener('click',()=>surprise.close());document.getElementById('scare-replay').addEventListener('click',()=>show(true));
window.TeraHalloween={check(now){if(!shown&&isHalloween(now)){shown=true;show(false);}},preview(){show(true);}};
})();
