(function(){
'use strict';
// Original chiptunes synthesized locally; no recordings or external audio.
const TRACKS=[
 {name:'Treat Cache',bpm:116,division:2,bassEvery:4,echoEvery:2,drums:false,
 melody:[72,75,79,75,74,72,67,null,72,75,79,82,79,75,74,null,68,72,75,72,70,68,67,null,67,71,74,77,74,71,67,null,72,79,75,79,82,79,75,null,74,77,81,77,79,77,74,null,68,75,72,75,79,75,72,null,67,74,71,74,77,74,71,67],bass:[36,39,41,43]},
 {name:'Firewall Frenzy',bpm:128,division:2,bassEvery:2,echoEvery:2,drums:true,
 melody:[74,null,77,81,74,77,72,74,69,null,72,76,79,76,72,null,70,74,77,82,81,77,74,70,69,73,76,81,79,76,73,null,86,81,77,74,81,77,74,72,84,79,76,72,79,76,72,null,82,77,74,70,77,74,70,74,81,76,73,69,73,76,81,null],bass:[38,36,34,33]},
 {name:'The Haunted Core',bpm:138,division:2,bassEvery:2,echoEvery:1,drums:true,
 melody:[76,83,79,78,76,null,74,78,79,83,86,83,79,null,78,74,72,79,76,74,72,null,71,74,75,78,83,78,75,71,66,null,88,86,83,79,78,76,74,null,86,83,79,78,76,74,71,null,84,83,79,76,74,72,71,74,83,78,75,71,78,75,71,null],bass:[40,43,36,35]},
 {name:'Trojan Overload',bpm:164,division:4,bassEvery:2,echoEvery:1,drums:true,
 melody:[72,79,84,79,75,79,84,87,74,81,86,81,77,81,86,89,71,78,83,78,74,78,83,86,67,74,79,74,71,74,79,83,84,83,79,75,84,87,86,83,86,84,81,77,86,89,87,86,83,81,78,74,83,86,84,83,79,78,74,71,79,83,86,83],bass:[36,38,35,31]}
];
const MELODY=TRACKS[0].melody,BASS=TRACKS[0].bass,STEP=60/TRACKS[0].bpm/2;
class Chiptune{
 constructor(makeContext){this.makeContext=makeContext;this.ctx=null;this.master=null;this.enabled=false;this.playing=false;this.volume=.25;this.timer=0;this.step=0;this.next=0;this.voices=new Set();this.track=TRACKS[0];}
 ensure(){if(!this.ctx){this.ctx=this.makeContext();this.master=this.ctx.createGain();this.master.gain.value=0;this.master.connect(this.ctx.destination);}return this.ctx;}
 tone(midi,start,length,type,level){if(midi===null)return;const oscillator=this.ctx.createOscillator(),envelope=this.ctx.createGain();oscillator.type=type;oscillator.frequency.value=440*Math.pow(2,(midi-69)/12);envelope.gain.setValueAtTime(0,start);envelope.gain.linearRampToValueAtTime(level,start+.008);envelope.gain.setValueAtTime(level*.65,start+length*.55);envelope.gain.linearRampToValueAtTime(0,start+length);oscillator.connect(envelope);envelope.connect(this.master);this.voices.add(oscillator);oscillator.onended=()=>{this.voices.delete(oscillator);oscillator.disconnect();envelope.disconnect();};oscillator.start(start);oscillator.stop(start+length+.01);}
 setLevel(level,mode='arcade'){
  const track=TRACKS[mode==='worm'?2:Math.max(0,Math.min(3,(Number(level)||1)-1))];
  if(track===this.track)return;
  this.stop();this.track=track;this.step=0;
  if(this.enabled&&this.playing)return this.start().catch(()=>{this.enabled=false;this.stop();});
 }
 schedule(){
  const track=this.track,step=60/track.bpm/track.division;
  while(this.next<this.ctx.currentTime+.15){
   const n=this.step%track.melody.length,bass=track.bass[Math.floor(n/16)];
   this.tone(track.melody[n],this.next,step*.76,'square',track.division===4?.105:.14);
   if(n%track.bassEvery===0)this.tone(bass+(n%4===2?12:0),this.next,step*track.bassEvery*.82,'triangle',.28);
   if(n%track.echoEvery===0)this.tone((track.melody[n]??72)-12,this.next,step*.26,'square',.035);
   if(track.drums){
    const beat=track.division;
    if(n%beat===0)this.tone(n%(beat*4)===beat*2?43:31,this.next,.075,'triangle',.23);
    if(n%2===1)this.tone(n%8===7?102:96,this.next,.025,'square',.018);
   }
   this.next+=step;this.step++;
  }
 }
 async start(){if(!this.enabled||!this.playing||this.timer)return;const ctx=this.ensure();await ctx.resume();if(!this.enabled||!this.playing||this.timer)return;this.master.gain.setTargetAtTime(this.volume,ctx.currentTime,.04);this.next=ctx.currentTime+.04;this.schedule();this.timer=setInterval(()=>this.schedule(),80);}
 stop(){clearInterval(this.timer);this.timer=0;if(this.ctx){this.master.gain.cancelScheduledValues(this.ctx.currentTime);this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.02);for(const voice of [...this.voices]){try{voice.stop();}catch(error){}}this.voices.clear();}}
 setVolume(value){this.volume=Math.max(0,Math.min(1,Number(value)||0));if(this.ctx)this.master.gain.setTargetAtTime(this.enabled&&this.playing?this.volume:0,this.ctx.currentTime,.03);}
 setPlaying(value){this.playing=!!value;if(this.playing&&this.enabled)return this.start().catch(()=>{this.enabled=false;this.stop();});else this.stop();}
}
if(typeof module!=='undefined'&&module.exports)module.exports={Chiptune,TRACKS,MELODY,BASS,STEP};
if(typeof document==='undefined')return;
const controls=document.getElementById('game-audio'),toggle=document.getElementById('music-toggle'),volume=document.getElementById('music-volume'),output=document.getElementById('music-volume-value');
const trackLabel=document.createElement('span');trackLabel.id='music-track';trackLabel.style.cssText='flex-basis:100%;font-size:6px;color:#cfa3ff';controls.append(trackLabel);
const Context=window.AudioContext||window.webkitAudioContext;const tune=new Chiptune(()=>new Context());
function update(){trackLabel.textContent=tune.track.name+' / '+tune.track.bpm+' BPM';controls.dataset.track=tune.track.name;toggle.textContent=tune.enabled?'MUSIC ON':'MUSIC OFF';toggle.setAttribute('aria-pressed',String(tune.enabled));toggle.setAttribute('aria-label',tune.enabled?'Turn music off':'Turn music on');controls.dataset.playback=tune.enabled?(tune.playing&&!document.hidden?'playing':'paused'):'off';}
if(!Context){toggle.disabled=true;toggle.title='Audio is unavailable in this browser.';}
toggle.addEventListener('click',async()=>{tune.enabled=!tune.enabled;try{if(tune.enabled&&tune.playing&&!document.hidden)await tune.start();else tune.stop();}catch(error){tune.enabled=false;tune.stop();toggle.title='Tap again to enable audio.';}update();});
volume.addEventListener('input',()=>{tune.setVolume(Number(volume.value)/100);output.value=volume.value+'%';});
window.TeraMusic={setLevel(level,mode){const before=tune.track;const result=tune.setLevel(level,mode);if(before!==tune.track){update();Promise.resolve(result).then(update);}},setPlaying(value){const result=tune.setPlaying(!!value&&!document.hidden);update();Promise.resolve(result).then(update);}};
document.addEventListener('visibilitychange',()=>{if(document.hidden){tune.setPlaying(false);update();}});window.addEventListener('pagehide',()=>tune.stop());update();
})();
