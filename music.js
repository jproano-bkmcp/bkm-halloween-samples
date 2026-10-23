(function(){
'use strict';
// Original C-minor chiptune, synthesized locally. No recordings or external audio.
const MELODY=[72,75,79,75,74,72,67,null,72,75,79,82,79,75,74,null,68,72,75,72,70,68,67,null,67,71,74,77,74,71,67,null,72,79,75,79,82,79,75,null,74,77,81,77,79,77,74,null,68,75,72,75,79,75,72,null,67,74,71,74,77,74,71,67];
const BASS=[36,39,41,43];const STEP=60/116/2;
class Chiptune{
 constructor(makeContext){this.makeContext=makeContext;this.ctx=null;this.master=null;this.enabled=false;this.playing=false;this.volume=.25;this.timer=0;this.step=0;this.next=0;this.voices=new Set();}
 ensure(){if(!this.ctx){this.ctx=this.makeContext();this.master=this.ctx.createGain();this.master.gain.value=0;this.master.connect(this.ctx.destination);}return this.ctx;}
 tone(midi,start,length,type,level){if(midi===null)return;const oscillator=this.ctx.createOscillator(),envelope=this.ctx.createGain();oscillator.type=type;oscillator.frequency.value=440*Math.pow(2,(midi-69)/12);envelope.gain.setValueAtTime(0,start);envelope.gain.linearRampToValueAtTime(level,start+.008);envelope.gain.setValueAtTime(level*.65,start+length*.55);envelope.gain.linearRampToValueAtTime(0,start+length);oscillator.connect(envelope);envelope.connect(this.master);this.voices.add(oscillator);oscillator.onended=()=>{this.voices.delete(oscillator);oscillator.disconnect();envelope.disconnect();};oscillator.start(start);oscillator.stop(start+length+.01);}
 schedule(){while(this.next<this.ctx.currentTime+.15){const n=this.step%MELODY.length;this.tone(MELODY[n],this.next,STEP*.82,'square',.16);if(n%4===0)this.tone(BASS[Math.floor(n/16)],this.next,STEP*3.6,'triangle',.36);if(n%2===0)this.tone((MELODY[n]??72)-12,this.next,STEP*.32,'square',.045);this.next+=STEP;this.step++;}}
 async start(){if(!this.enabled||!this.playing||this.timer)return;const ctx=this.ensure();await ctx.resume();if(!this.enabled||!this.playing||this.timer)return;this.master.gain.setTargetAtTime(this.volume,ctx.currentTime,.04);this.next=ctx.currentTime+.04;this.schedule();this.timer=setInterval(()=>this.schedule(),80);}
 stop(){clearInterval(this.timer);this.timer=0;if(this.ctx){this.master.gain.cancelScheduledValues(this.ctx.currentTime);this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.02);for(const voice of [...this.voices]){try{voice.stop();}catch(error){}}this.voices.clear();}}
 setVolume(value){this.volume=Math.max(0,Math.min(1,Number(value)||0));if(this.ctx)this.master.gain.setTargetAtTime(this.enabled&&this.playing?this.volume:0,this.ctx.currentTime,.03);}
 setPlaying(value){this.playing=!!value;if(this.playing&&this.enabled)return this.start().catch(()=>{this.enabled=false;this.stop();});else this.stop();}
}
if(typeof module!=='undefined'&&module.exports)module.exports={Chiptune,MELODY,BASS,STEP};
if(typeof document==='undefined')return;
const controls=document.getElementById('game-audio'),toggle=document.getElementById('music-toggle'),volume=document.getElementById('music-volume'),output=document.getElementById('music-volume-value');
const Context=window.AudioContext||window.webkitAudioContext;const tune=new Chiptune(()=>new Context());
function update(){toggle.textContent=tune.enabled?'MUSIC ON':'MUSIC OFF';toggle.setAttribute('aria-pressed',String(tune.enabled));toggle.setAttribute('aria-label',tune.enabled?'Turn music off':'Turn music on');controls.dataset.playback=tune.enabled?(tune.playing&&!document.hidden?'playing':'paused'):'off';}
if(!Context){toggle.disabled=true;toggle.title='Audio is unavailable in this browser.';}
toggle.addEventListener('click',async()=>{tune.enabled=!tune.enabled;try{if(tune.enabled&&tune.playing&&!document.hidden)await tune.start();else tune.stop();}catch(error){tune.enabled=false;tune.stop();toggle.title='Tap again to enable audio.';}update();});
volume.addEventListener('input',()=>{tune.setVolume(Number(volume.value)/100);output.value=volume.value+'%';});
window.TeraMusic={setPlaying(value){const result=tune.setPlaying(!!value&&!document.hidden);update();Promise.resolve(result).then(update);}};
document.addEventListener('visibilitychange',()=>{if(document.hidden){tune.setPlaying(false);update();}});window.addEventListener('pagehide',()=>tune.stop());update();
})();
