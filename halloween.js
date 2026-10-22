(function(){
'use strict';
const START=Date.parse('2026-10-31T00:00:00-07:00'),END=Date.parse('2026-11-01T00:00:00-07:00');
function isHalloween(now){return now>=START&&now<END;}
if(typeof module!=='undefined'&&module.exports)module.exports={isHalloween,START,END};
if(typeof document==='undefined')return;
const surprise=document.createElement('dialog');surprise.id='halloween-scare';surprise.setAttribute('aria-labelledby','scare-title');
surprise.innerHTML='<button id="scare-close" aria-label="Close Halloween surprise">✕</button><div class="scare-content"><p class="scare-kicker">A BYTE-SIZED HALLOWEEN SURPRISE</p><canvas id="scare-canvas" width="800" height="480" role="img" aria-label="Tera the friendly tech vampire pops forward with bat wings and tiny fangs."></canvas><h2 id="scare-title">BOO! IT’S TERA!</h2><p>Fangs for stopping by. Pick up a free sample on us!</p><small>from BKM Tech Team</small><button id="scare-replay" hidden>REPLAY PREVIEW</button></div>';
document.body.append(surprise);
const canvas=document.getElementById('scare-canvas'),paint=canvas.getContext('2d');paint.imageSmoothingEnabled=false;
function block(x,y,w,h,color){paint.fillStyle=color;paint.fillRect(x,y,w,h);}
paint.translate(400,330);
for(const side of [-1,1]){paint.fillStyle='#57287f';paint.beginPath();paint.moveTo(side*90,-110);paint.lineTo(side*315,-260);paint.lineTo(side*290,-85);paint.lineTo(side*232,-121);paint.lineTo(side*180,-25);paint.lineTo(side*110,-80);paint.closePath();paint.fill();paint.strokeStyle='#ba7dff';paint.lineWidth=5;paint.stroke();}
paint.fillStyle='#c43150';paint.beginPath();paint.moveTo(-115,-110);paint.lineTo(-170,-195);paint.lineTo(-145,15);paint.lineTo(145,15);paint.lineTo(170,-195);paint.lineTo(115,-110);paint.fill();
block(-135,-200,270,220,'#142349');block(-119,-184,238,170,'#b0edff');block(-162,15,324,40,'#244f90');block(-136,21,272,12,'#7098cf');block(-33,40,66,10,'#8bb7e3');
for(const x of [-96,12]){block(x,-137,86,68,'#ff9d31');block(x+12,-125,62,44,'#f9ffff');block(x+29,-121,25,35,'#11244b');block(x+34,-119,10,9,'#fff');}block(-12,-120,27,13,'#ff9d31');
block(-32,-52,64,9,'#182446');block(-32,-43,11,23,'#fff8e7');block(21,-43,11,23,'#fff8e7');block(-20,-20,40,9,'#e84f77');block(95,3,46,35,'#fff3cf');paint.font='bold 18px monospace';paint.fillStyle='#13274d';paint.textAlign='center';paint.fillText('T',118,27);
let shown=false,autoClose=0;
function show(preview=false){clearTimeout(autoClose);document.dispatchEvent(new Event('tera-halloween-opening'));surprise.classList.remove('scare-play');if(!surprise.open)surprise.showModal();document.getElementById('scare-replay').hidden=!preview;void surprise.offsetWidth;surprise.classList.add('scare-play');document.getElementById('scare-close').focus({preventScroll:true});if(!preview)autoClose=setTimeout(()=>surprise.close(),4200);}
surprise.addEventListener('close',()=>{clearTimeout(autoClose);surprise.classList.remove('scare-play');});
document.getElementById('scare-close').addEventListener('click',()=>surprise.close());document.getElementById('scare-replay').addEventListener('click',()=>show(true));
window.TeraHalloween={check(now){if(!shown&&isHalloween(now)){shown=true;show(false);}},preview(){show(true);}};
})();
