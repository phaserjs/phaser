/*
  amiga protracker module player for web audio api
  (c) 2012-2013 firehawk/tda  (firehawk@haxor.fi)
  
  originally hacked together in a weekend, so please excuse
  me for the spaghetti code. :)

  AMIGAAAAAAAAH!!
  
  kinda sorta changelog:
  (apr 2013)
  - changed the logic for pattern break/jump. mod.pattern_skank now
    plays correctly.
  (feb 2013)
  - fixed NaN samples with mod.fractured and mod.multicolour (thanks Aegis!)
  (jan 2013)
  - fixed vibrato amplitude (was half of what it should be, apparently)
  - fixed to work on safari again (thanks Matt Diamond @ stackoverflow.com)
  (dec 2012)
  - replaced effect switch-statement with jumptables
  - fixed clicks (bad loops, empty samples)
  - fixed playback bug with sample-only rows
  - added amiga 500 lowpass filters (not 100% authentic, though)
  - added compressor to output
  - latest safari has broken web audio so chrome-only for now
  (aug 2012)
  - first version written from scratch

  todo:
  - safari on ipad is broken again, it seems
  - fix more playback bugs
    * mod.black_queen (pattern loop has glitches)
  - properly test EEx delay pattern
  - implement the rest of the effects
  - optimize for more speed!! SPEEEED!!
    * switch to fixed point sample pointers, Math.floor() is _slow_ on iOS
*/

// constructor for protracker player object
function Protracker()
{
  var i, t;

  this.initialize();
  this.clearsong();

  this.url="";
  this.loading=false;
  this.ready=false;
  this.playing=false;
  this.buffer=0;
  this.mixerNode=0;
  this.paused=false;
  this.repeat=false;
  this.separation=true;

  this.palclock=true;
  
  this.autostart=false;

  this.onReady=function(){};
  this.onPlay=function(){};
  this.onStop=function(){};

  // paula period values
  this.baseperiodtable=new Array(
    856,808,762,720,678,640,604,570,538,508,480,453,
    428,404,381,360,339,320,302,285,269,254,240,226,
    214,202,190,180,170,160,151,143,135,127,120,113);

  // finetune multipliers
  this.finetunetable=new Array();
  for(t=0;t<16;t++) this.finetunetable[t]=Math.pow(2, (t-8)/12/8);
  
  // calc tables for vibrato waveforms
  this.vibratotable=new Array();
  for(t=0;t<4;t++) {
    this.vibratotable[t]=new Array();
    for(i=0;i<64;i++) {
      switch(t) {
        case 0:
          this.vibratotable[t][i]=127*Math.sin(Math.PI*2*(i/64));
          break;
        case 1:
          this.vibratotable[t][i]=127-4*i;
          break;
        case 2:
          this.vibratotable[t][i]=(i<32)?127:-127;
          break;
        case 3:
          this.vibratotable[t][i]=(1-2*Math.random())*127;
          break;
      }
    }
  }

  // effect jumptables
  this.effects_t0 = new Array(
    this.effect_t0_0, this.effect_t0_1, this.effect_t0_2, this.effect_t0_3, this.effect_t0_4, this.effect_t0_5, this.effect_t0_6, this.effect_t0_7,
    this.effect_t0_8, this.effect_t0_9, this.effect_t0_a, this.effect_t0_b, this.effect_t0_c, this.effect_t0_d, this.effect_t0_e, this.effect_t0_f);
  this.effects_t0_e = new Array(
    this.effect_t0_e0, this.effect_t0_e1, this.effect_t0_e2, this.effect_t0_e3, this.effect_t0_e4, this.effect_t0_e5, this.effect_t0_e6, this.effect_t0_e7,
    this.effect_t0_e8, this.effect_t0_e9, this.effect_t0_ea, this.effect_t0_eb, this.effect_t0_ec, this.effect_t0_ed, this.effect_t0_ee, this.effect_t0_ef);
  this.effects_t1 = new Array(
    this.effect_t1_0, this.effect_t1_1, this.effect_t1_2, this.effect_t1_3, this.effect_t1_4, this.effect_t1_5, this.effect_t1_6, this.effect_t1_7,
    this.effect_t1_8, this.effect_t1_9, this.effect_t1_a, this.effect_t1_b, this.effect_t1_c, this.effect_t1_d, this.effect_t1_e, this.effect_t1_f);
  this.effects_t1_e = new Array(
    this.effect_t1_e0, this.effect_t1_e1, this.effect_t1_e2, this.effect_t1_e3, this.effect_t1_e4, this.effect_t1_e5, this.effect_t1_e6, this.effect_t1_e7,
    this.effect_t1_e8, this.effect_t1_e9, this.effect_t1_ea, this.effect_t1_eb, this.effect_t1_ec, this.effect_t1_ed, this.effect_t1_ee, this.effect_t1_ef);

  this.context = null;
  this.samplerate=44100;
  this.bufferlen=2048;
}



// create the web audio context
Protracker.prototype.createContext = function()
{
  this.context = new webkitAudioContext();
  this.samplerate=this.context.sampleRate;
  this.bufferlen=(this.samplerate > 44100) ? 4096 : 2048; 

  // fixed filter at 6kHz
  this.filterNode=this.context.createBiquadFilter();
  this.filterNode.frequency.value=6000

  // "LED filter" at 3.5kHz - off by default
  this.lowpassNode=this.context.createBiquadFilter();
  this.lowpassNode.frequency.value=28867;

  // mixer
  this.mixerNode=this.context.createJavaScriptNode(this.bufferlen, 1, 2);
  this.mixerNode.module=this;
  this.mixerNode.onaudioprocess=Protracker.prototype.mix;

  // compressor for a bit of volume boost
  this.compressorNode=this.context.createDynamicsCompressor();

  // patch up some cables :)  
  this.mixerNode.connect(this.filterNode);
  this.filterNode.connect(this.lowpassNode);
  this.lowpassNode.connect(this.compressorNode);
  this.compressorNode.connect(this.context.destination);
}



// play loaded and parsed module with webaudio context
Protracker.prototype.play = function()
{
  if (this.context==null) this.createContext();
  
  if (!this.ready) return false;
  if (this.paused) {
    this.paused=false;
    return true;
  }
  this.paused=false;
  this.initialize();
  this.flags=1+2;
  this.playing=true;
  this.onPlay();
  return true;
}



// pause playback
Protracker.prototype.pause = function()
{
  if (!this.paused) {
    this.paused=true;
  } else {
    this.paused=false;
  }
}



// stop playback and release webaudio node
Protracker.prototype.stop = function()
{
  this.playing=false;
  this.onStop();
}



// jump positions forward/back
Protracker.prototype.jump = function(step)
{
  this.tick=0;
  this.row=0;
  this.position+=step;
  this.flags=1+2;  
  if (this.position<0) this.position=0;
  if (this.position >= this.songlen) this.stop();
}



// set whether module repeats after songlen
Protracker.prototype.setrepeat = function(rep)
{
  this.repeat=rep;
}



// set stereo separation mode (false=paula, true=betterpaula)
Protracker.prototype.setseparation = function(sep)
{
  this.separation=sep;
}



// set amiga video standard (false=NTSC, true=PAL)
Protracker.prototype.setamigatype = function(clock)
{
  this.palclock=clock;
}



// set autostart to play immediately after loading
Protracker.prototype.setautostart = function(st)
{
  this.autostart=st;
}



// clear song data
Protracker.prototype.clearsong = function()
{  
  this.title="";
  this.signature="";
  this.songlen=1;
  this.repeatpos=0;
  this.patterntable=new ArrayBuffer(128);
  for(i=0;i<128;i++) this.patterntable[i]=0;

  this.channels=4;

  this.sample=new Array();
  this.samples=31;
  for(i=0;i<31;i++) {
    this.sample[i]=new Object();
    this.sample[i].name="";
    this.sample[i].length=0;
    this.sample[i].finetune=0;
    this.sample[i].volume=64;
    this.sample[i].loopstart=0;
    this.sample[i].looplength=0;
    this.sample[i].data=0;
  }

  this.patterns=0;
  this.pattern=new Array();
  this.note=new Array();
  
  this.looprow=0;
  this.loopstart=0;
  this.loopcount=0;
  
  this.patterndelay=0;
  this.patternwait=0;
}


// initialize all player variables
Protracker.prototype.initialize = function()
{
  this.tick=0;
  this.position=0;
  this.row=0;
  this.offset=0;
  this.flags=0;

  this.speed=6;
  this.bpm=125;
  this.breakrow=0;
  this.patternjump=0;
  this.patterndelay=0;
  this.patternwait=0;
  
  this.channel=new Array();
  for(i=0;i<this.channels;i++) {
    this.channel[i]=new Object();
    this.channel[i].sample=0;
    this.channel[i].period=214;
    this.channel[i].voiceperiod=214;
    this.channel[i].note=24;    
    this.channel[i].volume=64;
    this.channel[i].command=0;
    this.channel[i].data=0;
    this.channel[i].samplepos=0;
    this.channel[i].samplespeed=0;
    this.channel[i].flags=0;
    this.channel[i].noteon=0;
    this.channel[i].slidespeed=0;
    this.channel[i].slideto=214;
    this.channel[i].slidetospeed=0;
    this.channel[i].arpeggio=0;

    this.channel[i].semitone=12;
    this.channel[i].vibratospeed=0
    this.channel[i].vibratodepth=0
    this.channel[i].vibratopos=0;
    this.channel[i].vibratowave=0;
  }
  this.vu=new Array();
}



// load module from url into local buffer
Protracker.prototype.load = function(url)
{
    this.url=url;
    this.clearsong();
    
    var request = new XMLHttpRequest();
    request.open("GET", this.url, true);
    request.responseType = "arraybuffer";
    this.request = request;
    this.loading=true;
    var asset = this;
    request.onload = function() {
        asset.buffer=new Uint8Array(request.response);
        asset.parse();
        if (asset.autostart) asset.play();
    }
    request.send();  
}



// parse the module from local buffer
Protracker.prototype.parse = function()
{
  var i,j,c;
  
  if (!this.buffer) return false;
  
  for(i=0;i<4;i++) this.signature+=String.fromCharCode(this.buffer[1080+i]);
  switch (this.signature) {
    case "M.K.":
    case "M!K!":
    case "4CHN":
    case "FLT4":
      break;

    case "6CHN":
      this.channels=6;
      break;
      
    case "8CHN":
    case "FLT8":
      this.channels=8;
      break;

    case "28CH":
      this.channels=28;
      break;
    
    default:
      return false;
  }
  this.vu=new Array();
  for(i=0;i<this.channels;i++) this.vu[i]=0.0;
  
  i=0;
  while(this.buffer[i] && i<20)
    this.title=this.title+String.fromCharCode(this.buffer[i++]);

  for(i=0;i<this.samples;i++) {
    var st=20+i*30;
    j=0;
    while(this.buffer[st+j] && j<22) { 
      this.sample[i].name+=
        ((this.buffer[st+j]>0x1f) && (this.buffer[st+j]<0x7f)) ? 
        (String.fromCharCode(this.buffer[st+j])) :
        (" ");
      j++;
    }
    this.sample[i].length=2*(this.buffer[st+22]*256 + this.buffer[st+23]);
    this.sample[i].finetune=this.buffer[st+24];
    if (this.sample[i].finetune > 7) this.sample[i].finetune=this.sample[i].finetune-16;
    this.sample[i].volume=this.buffer[st+25];
    this.sample[i].loopstart=2*(this.buffer[st+26]*256 + this.buffer[st+27]);
    this.sample[i].looplength=2*(this.buffer[st+28]*256 + this.buffer[st+29]);
    if (this.sample[i].looplength==2) this.sample[i].looplength=0;
    if (this.sample[i].loopstart>this.sample[i].length) {
      this.sample[i].loopstart=0;
      this.sample[i].looplength=0;
    }
  }

  this.songlen=this.buffer[950];
  if (this.buffer[951] != 127) this.repeatpos=this.buffer[951];
  for(i=0;i<128;i++) {
    this.patterntable[i]=this.buffer[952+i];
    if (this.patterntable[i] > this.patterns) this.patterns=this.patterntable[i];
  }
  this.patterns+=1;
  var patlen=4*64*this.channels;

  this.pattern=new Array();
  this.note=new Array();
  for(i=0;i<this.patterns;i++) {
    this.pattern[i]=new Uint8Array(patlen);
    this.note[i]=new Uint8Array(this.channels*64);
    for(j=0;j<patlen;j++) this.pattern[i][j]=this.buffer[1084+i*patlen+j];
    for(j=0;j<64;j++) for(c=0;c<this.channels;c++) {
      this.note[i][j*this.channels+c]=0;
      var n=(this.pattern[i][j*4*this.channels+c*4]&0x0f)<<8 | this.pattern[i][j*4*this.channels+c*4+1];
      for(var np=0; np<this.baseperiodtable.length; np++)
        if (n==this.baseperiodtable[np]) this.note[i][j*this.channels+c]=np;
    }        
  }
  
  var sst=1084+this.patterns*patlen;
  for(i=0;i<this.samples;i++) {
    this.sample[i].data=new Float32Array(this.sample[i].length);
    for(j=0;j<this.sample[i].length;j++) {
      var q=this.buffer[sst+j];
      if (q<128) {
        q=q/128.0;
      } else {
        q=((q-128)/128.0)-1.0;
      }
      
      this.sample[i].data[j]=q;
    }
    sst+=this.sample[i].length;
  }

  this.ready=true;
  this.loading=false;
  this.buffer=0;

  if (this.context) this.lowpassNode.frequency.value=28867;

  this.onReady();
  return true;
}



// advance player
Protracker.prototype.advance=function(mod) {
  var spd=(((mod.samplerate*60)/mod.bpm)/4)/6;
  // advance player
  if (mod.offset>spd) { mod.tick++; mod.offset=0; mod.flags|=1; }
  if (mod.tick>=mod.speed) {

    if (mod.patterndelay) { // delay pattern
      if (mod.tick < ((mod.patternwait+1)*mod.speed)) {
        mod.patternwait++;
      } else {
        mod.row++; mod.tick=0; mod.flags|=2; mod.patterndelay=0;
		
      }
    }
    else {

      if (mod.flags&(16+32+64)) {
        if (mod.flags&64) { // loop pattern?
          mod.row=mod.looprow;
          mod.flags&=0xa1;
          mod.flags|=2;
        }
        else {
          if (mod.flags&16) { // pattern jump/break?
            //console.log("break to pattern " + mod.patternjump + " row "+mod.breakrow);
            mod.position=mod.patternjump;
            mod.row=mod.breakrow;
            mod.patternjump=0;
            mod.breakrow=0;
            mod.flags&=0xe1;
            mod.flags|=2;
          }
        }
        mod.tick=0;
      } else {
        mod.row++; mod.tick=0; mod.flags|=2;
      }
    }
  }
  
  if (mod.row>=64) { mod.position++; mod.row=0; mod.flags|=4; } 
  if (mod.position>=mod.songlen) {
    if (mod.repeat) {
      mod.position=0;
    } else {
      mod.stop();
    }
    return;
  }
}



// mix an audio buffer with data
Protracker.prototype.mix = function(ape) {
  var f;
  var p, pp, n, nn;
  var mod=ape.srcElement.module;
  outp=new Array();

  var bufs=new Array(ape.outputBuffer.getChannelData(0), ape.outputBuffer.getChannelData(1));
  var buflen=ape.outputBuffer.length;
  for(var s=0;s<buflen;s++)
  {
    outp[0]=0.0;
    outp[1]=0.0;

    if (!mod.paused && mod.playing)
    {
      mod.advance(mod);

      var och=0;
      for(var ch=0;ch<mod.channels;ch++)
      {
        // calculate playback position
        p=mod.patterntable[mod.position];
        pp=mod.row*4*mod.channels + ch*4;
        if (mod.flags&2) { // new row
			modrow = mod.row; // here
          mod.channel[ch].command=mod.pattern[p][pp+2]&0x0f;
          mod.channel[ch].data=mod.pattern[p][pp+3];

          if (!(mod.channel[ch].command==0x0e && (mod.channel[ch].data&0xf0)==0xd0)) {
            n=(mod.pattern[p][pp]&0x0f)<<8 | mod.pattern[p][pp+1];
            if (n) {
              // noteon, except if command=3 (porta to note)

              if ((mod.channel[ch].command != 0x03) && (mod.channel[ch].command != 0x05)) {
                mod.channel[ch].period=n;
                mod.channel[ch].samplepos=0;
                if (mod.channel[ch].vibratowave>3) mod.channel[ch].vibratopos=0;				
                mod.channel[ch].flags|=3; // recalc speed
                mod.channel[ch].noteon=1;
              } else {
                mod.channel[ch].slideto=n;
			
              }
            }
            nn=mod.pattern[p][pp+0]&0xf0 | mod.pattern[p][pp+2]>>4;
            if (nn) {
              mod.channel[ch].sample=nn-1;
	  		 			  
              mod.channel[ch].volume=mod.sample[nn-1].volume;
              if (!n && (mod.channel[ch].samplepos > mod.sample[nn-1].length)) mod.channel[ch].samplepos=0;
            }
          }
        }
        mod.channel[ch].voiceperiod=mod.channel[ch].period;
		if (mod.channel[ch].samplepos==0) modsample[ch]=mod.channel[ch].sample;
		
		
        // kill empty samples
        if (!mod.sample[mod.channel[ch].sample].length) mod.channel[ch].noteon=0;

        // effects        
        if (mod.flags&1) {
          if (!mod.tick) {
            // process only on tick 0
            mod.effects_t0[mod.channel[ch].command](mod, ch);
          } else {
            mod.effects_t1[mod.channel[ch].command](mod, ch);    
          }
        }

        // recalc note number from period
        if (mod.channel[ch].flags&2) {
          for(var np=0; np<mod.baseperiodtable.length; np++)
            if (mod.baseperiodtable[np]>=mod.channel[ch].period) mod.channel[ch].note=np;
          mod.channel[ch].semitone=7;
          if (mod.channel[ch].period>=120)
            mod.channel[ch].semitone=mod.baseperiodtable[mod.channel[ch].note]-mod.baseperiodtable[mod.channel[ch].note+1];
        }

        // recalc sample speed and apply finetune
        if ((mod.channel[ch].flags&1 || mod.flags&2) && mod.channel[ch].voiceperiod)
          mod.channel[ch].samplespeed=
            (mod.palclock ? 7093789.2 : 7159090.5)/(mod.channel[ch].voiceperiod*2) * mod.finetunetable[mod.sample[mod.channel[ch].sample].finetune+8] / mod.samplerate;
        
        // advance vibrato on each new tick
        if (mod.flags&1) {
          mod.channel[ch].vibratopos+=mod.channel[ch].vibratospeed;
          mod.channel[ch].vibratopos&=0x3f;
        }

        // mix channel to output        
        och=och^(ch&1);
        f=0.0;
        if (mod.channel[ch].noteon) {
          if (mod.sample[mod.channel[ch].sample].length > mod.channel[ch].samplepos)
            f=(1.0/mod.channels) *
              (mod.sample[mod.channel[ch].sample].data[Math.floor(mod.channel[ch].samplepos)]*mod.channel[ch].volume)/64.0;
          outp[och]+=f;
          mod.channel[ch].samplepos+=mod.channel[ch].samplespeed;
        }
        if (s==0) mod.vu[ch]=Math.abs(f);

        // loop or end samples
        if (mod.channel[ch].noteon) {
          if (mod.sample[mod.channel[ch].sample].loopstart || mod.sample[mod.channel[ch].sample].looplength) {
            if (mod.channel[ch].samplepos >= (mod.sample[mod.channel[ch].sample].loopstart+mod.sample[mod.channel[ch].sample].looplength)) {
              mod.channel[ch].samplepos=mod.sample[mod.channel[ch].sample].loopstart;
            }
          } else {
            if (mod.channel[ch].samplepos >= mod.sample[mod.channel[ch].sample].length) {
              mod.channel[ch].noteon=0;
            }
          }
        }

        // clear channel flags
        mod.channel[ch].flags=0;
      } 
      mod.offset++;
      mod.flags&=0x70;      
    }
    
    // a more headphone-friendly stereo separation (aka. betterpaula)
    if (mod.separation) {
      t=outp[0];
      outp[0]=outp[0]*0.6 + outp[1]*0.4;
      outp[1]=outp[1]*0.6 + t*0.4;
    }
    bufs[0][s]=outp[0];
    bufs[1][s]=outp[1];
  }
}



//
// tick 0 effect functions
//
Protracker.prototype.effect_t0_0=function(mod, ch) { // 0 arpeggio
  mod.channel[ch].arpeggio=mod.channel[ch].data;
}
Protracker.prototype.effect_t0_1=function(mod, ch) { // 1 slide up
  if (mod.channel[ch].data) mod.channel[ch].slidespeed=mod.channel[ch].data;
}
Protracker.prototype.effect_t0_2=function(mod, ch) { // 2 slide down
  if (mod.channel[ch].data) mod.channel[ch].slidespeed=mod.channel[ch].data;
}
Protracker.prototype.effect_t0_3=function(mod, ch) { // 3 slide to note
  if (mod.channel[ch].data) mod.channel[ch].slidetospeed=mod.channel[ch].data;
}
Protracker.prototype.effect_t0_4=function(mod, ch) { // 4 vibrato
  if (mod.channel[ch].data&0x0f && mod.channel[ch].data&0xf0) {
    mod.channel[ch].vibratodepth=(mod.channel[ch].data&0x0f);
    mod.channel[ch].vibratospeed=(mod.channel[ch].data&0xf0)>>4;
  }
  mod.channel[ch].voiceperiod+=
    (mod.channel[ch].vibratodepth/32)*mod.channel[ch].semitone*(mod.vibratotable[mod.channel[ch].vibratowave&3][mod.channel[ch].vibratopos]/127);        
  mod.channel[ch].flags|=1;
}
Protracker.prototype.effect_t0_5=function(mod, ch) { // 5
}
Protracker.prototype.effect_t0_6=function(mod, ch) { // 6
}
Protracker.prototype.effect_t0_7=function(mod, ch) { // 7
}
Protracker.prototype.effect_t0_8=function(mod, ch) { // 8
}
Protracker.prototype.effect_t0_9=function(mod, ch) { // 9 set sample offset
  mod.channel[ch].samplepos=mod.channel[ch].data*256;
}
Protracker.prototype.effect_t0_a=function(mod, ch) { // a
}
Protracker.prototype.effect_t0_b=function(mod, ch) { // b pattern jump
  mod.breakrow=0;
  mod.patternjump=mod.channel[ch].data;
  mod.flags|=16;
}
Protracker.prototype.effect_t0_c=function(mod, ch) { // c set volume
  mod.channel[ch].volume=mod.channel[ch].data;
}
Protracker.prototype.effect_t0_d=function(mod, ch) { // d pattern break
  mod.breakrow=((mod.channel[ch].data&0xf0)>>4)*10 + (mod.channel[ch].data&0x0f);
  if (!(mod.flags&16)) mod.patternjump=mod.position+1;
  mod.flags|=16;  
}
Protracker.prototype.effect_t0_e=function(mod, ch) { // e
  var i=(mod.channel[ch].data&0xf0)>>4;
  mod.effects_t0_e[i](mod, ch);
}
Protracker.prototype.effect_t0_f=function(mod, ch) { // f set speed
  if (mod.channel[ch].data > 32) {
    mod.bpm=mod.channel[ch].data;
  } else {
    if (mod.channel[ch].data) mod.speed=mod.channel[ch].data;
  }
}



//
// tick 0 effect e functions
//
Protracker.prototype.effect_t0_e0=function(mod, ch) { // e0 filter on/off
  if (mod.channel[ch].data&0x0f) {
    mod.lowpassNode.frequency.value=4280; //3500;
  } else {
    mod.lowpassNode.frequency.value=28867;
  }
}
Protracker.prototype.effect_t0_e1=function(mod, ch) { // e1 fine slide up
  mod.channel[ch].period-=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].period < 113) mod.channel[ch].period=113;
}
Protracker.prototype.effect_t0_e2=function(mod, ch) { // e2 fine slide down
  mod.channel[ch].period+=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].period > 856) mod.channel[ch].period=856;
  mod.channel[ch].flags|=1;
}
Protracker.prototype.effect_t0_e3=function(mod, ch) { // e3 set glissando
}
Protracker.prototype.effect_t0_e4=function(mod, ch) { // e4 set vibrato waveform
  mod.channel[ch].vibratowave=mod.channel[ch].data&0x07;
}
Protracker.prototype.effect_t0_e5=function(mod, ch) { // e5 set finetune
}
Protracker.prototype.effect_t0_e6=function(mod, ch) { // e6 loop pattern
  if (mod.channel[ch].data&0x0f) {
    if (mod.loopcount) {
      mod.loopcount--;
    } else {
      mod.loopcount=mod.channel[ch].data&0x0f;
    }
    if (mod.loopcount) mod.flags|=64;
  } else {
    mod.looprow=mod.row;
  }
}
Protracker.prototype.effect_t0_e7=function(mod, ch) { // e7
}
Protracker.prototype.effect_t0_e8=function(mod, ch) { // e8
}
Protracker.prototype.effect_t0_e9=function(mod, ch) { // e9
}
Protracker.prototype.effect_t0_ea=function(mod, ch) { // ea fine volslide up
  mod.channel[ch].volume+=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].volume > 64) mod.channel[ch].volume=64;
}
Protracker.prototype.effect_t0_eb=function(mod, ch) { // eb fine volslide down
  mod.channel[ch].volume-=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].volume < 0) mod.channel[ch].volume=0;
}
Protracker.prototype.effect_t0_ec=function(mod, ch) { // ec
}
Protracker.prototype.effect_t0_ed=function(mod, ch) { // ed delay sample
  if (mod.tick==(mod.channel[ch].data&0x0f)) {
    // start note
    var p=mod.patterntable[mod.position];
    var pp=mod.row*4*mod.channels + ch*4;            
    n=(mod.pattern[p][pp]&0x0f)<<8 | mod.pattern[p][pp+1];
    if (n) {
      mod.channel[ch].period=n;
      mod.channel[ch].voiceperiod=mod.channel[ch].period;      
      mod.channel[ch].samplepos=0;
      if (mod.channel[ch].vibratowave>3) mod.channel[ch].vibratopos=0;
      mod.channel[ch].flags|=3; // recalc speed
      mod.channel[ch].noteon=1;
    }
    n=mod.pattern[p][pp+0]&0xf0 | mod.pattern[p][pp+2]>>4;
    if (n) {
      mod.channel[ch].sample=n-1;
      mod.channel[ch].volume=mod.sample[n-1].volume;
    }
  }
}
Protracker.prototype.effect_t0_ee=function(mod, ch) { // ee delay pattern
  mod.patterndelay=mod.channel[ch].data&0x0f;
  mod.patternwait=0;
}
Protracker.prototype.effect_t0_ef=function(mod, ch) { // ef
}



//
// tick 1+ effect functions
//
Protracker.prototype.effect_t1_0=function(mod, ch) { // 0 arpeggio
  if (mod.channel[ch].data) {
    var apn=mod.channel[ch].note;
    if ((mod.tick%3)==1) apn+=mod.channel[ch].arpeggio>>4;
    if ((mod.tick%3)==2) apn+=mod.channel[ch].arpeggio&0x0f;
    if (apn>=0 && apn <= mod.baseperiodtable.length)
      mod.channel[ch].voiceperiod = mod.baseperiodtable[apn];
    mod.channel[ch].flags|=1;
  }
}
Protracker.prototype.effect_t1_1=function(mod, ch) { // 1 slide up
  mod.channel[ch].period-=mod.channel[ch].slidespeed;
  if (mod.channel[ch].period<113) mod.channel[ch].period=113;
  mod.channel[ch].flags|=3; // recalc speed
}
Protracker.prototype.effect_t1_2=function(mod, ch) { // 2 slide down
  mod.channel[ch].period+=mod.channel[ch].slidespeed;
  if (mod.channel[ch].period>856) mod.channel[ch].period=856;
  mod.channel[ch].flags|=3; // recalc speed                
}
Protracker.prototype.effect_t1_3=function(mod, ch) { // 3 slide to note
  if (mod.channel[ch].period < mod.channel[ch].slideto) {
    mod.channel[ch].period+=mod.channel[ch].slidetospeed;
    if (mod.channel[ch].period > mod.channel[ch].slideto)
      mod.channel[ch].period=mod.channel[ch].slideto;
  }
  if (mod.channel[ch].period > mod.channel[ch].slideto) {
    mod.channel[ch].period-=mod.channel[ch].slidetospeed;
    if (mod.channel[ch].period<mod.channel[ch].slideto)
      mod.channel[ch].period=mod.channel[ch].slideto;
  }
  mod.channel[ch].flags|=3; // recalc speed
}
Protracker.prototype.effect_t1_4=function(mod, ch) { // 4 vibrato
  mod.channel[ch].voiceperiod+=
    (mod.channel[ch].vibratodepth/16)*mod.channel[ch].semitone*(mod.vibratotable[mod.channel[ch].vibratowave&3][mod.channel[ch].vibratopos]/127);
  mod.channel[ch].flags|=1;
}
Protracker.prototype.effect_t1_5=function(mod, ch) { // 5 volslide + slide to note
  mod.effect_t1_3(mod, ch); // slide to note
  mod.effect_t1_a(mod, ch); // volslide
}
Protracker.prototype.effect_t1_6=function(mod, ch) { // 6 volslide + vibrato
  mod.effect_t1_4(mod, ch); // vibrato
  mod.effect_t1_a(mod, ch); // volslide
}
Protracker.prototype.effect_t1_7=function(mod, ch) { // 7
}
Protracker.prototype.effect_t1_8=function(mod, ch) { // 8
}
Protracker.prototype.effect_t1_9=function(mod, ch) { // 9 set sample offset
}
Protracker.prototype.effect_t1_a=function(mod, ch) { // a volume slide
  if (!(mod.channel[ch].data&0x0f)) {
    // y is zero, slide up
    mod.channel[ch].volume+=(mod.channel[ch].data>>4);
    if (mod.channel[ch].volume>64) mod.channel[ch].volume=64;
  }
  if (!(mod.channel[ch].data&0xf0)) {
    // x is zero, slide down
    mod.channel[ch].volume-=(mod.channel[ch].data&0x0f);
    if (mod.channel[ch].volume<0) mod.channel[ch].volume=0;                  
  }
}
Protracker.prototype.effect_t1_b=function(mod, ch) { // b pattern jump
}
Protracker.prototype.effect_t1_c=function(mod, ch) { // c set volume
}
Protracker.prototype.effect_t1_d=function(mod, ch) { // d pattern break
}
Protracker.prototype.effect_t1_e=function(mod, ch) { // e
  var i=(mod.channel[ch].data&0xf0)>>4;
  mod.effects_t1_e[i](mod, ch);
}
Protracker.prototype.effect_t1_f=function(mod, ch) { // f
}



//
// tick 1+ effect e functions
//
Protracker.prototype.effect_t1_e0=function(mod, ch) { // e0
}
Protracker.prototype.effect_t1_e1=function(mod, ch) { // e1
}
Protracker.prototype.effect_t1_e2=function(mod, ch) { // e2
}
Protracker.prototype.effect_t1_e3=function(mod, ch) { // e3
}
Protracker.prototype.effect_t1_e4=function(mod, ch) { // e4
}
Protracker.prototype.effect_t1_e5=function(mod, ch) { // e5
}
Protracker.prototype.effect_t1_e6=function(mod, ch) { // e6
}
Protracker.prototype.effect_t1_e7=function(mod, ch) { // e7
}
Protracker.prototype.effect_t1_e8=function(mod, ch) { // e8
}
Protracker.prototype.effect_t1_e9=function(mod, ch) { // e9 retrig sample
  if (mod.tick%(mod.channel[ch].data&0x0f)==0)
    mod.channel[ch].samplepos=0;
}
Protracker.prototype.effect_t1_ea=function(mod, ch) { // ea
}
Protracker.prototype.effect_t1_eb=function(mod, ch) { // eb
}
Protracker.prototype.effect_t1_ec=function(mod, ch) { // ec cut sample
  if (mod.tick==(mod.channel[ch].data&0x0f))
    mod.channel[ch].volume=0;
}
Protracker.prototype.effect_t1_ed=function(mod, ch) { // ed delay sample
  mod.effect_t0_ed(mod, ch);
}
Protracker.prototype.effect_t1_ee=function(mod, ch) { // ee
}
Protracker.prototype.effect_t1_ef=function(mod, ch) { // ef
}
