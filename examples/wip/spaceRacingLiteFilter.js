PIXI.SpaceRacingLiteFilter = function(width, height, texture)
{
	PIXI.AbstractFilter.call( this );
	
	this.passes = [this];

	var d = new Date();

	var dates = [
		d.getFullYear(), // the year (four digits)
		d.getMonth(),	   // the month (from 0-11)
		d.getDate(),     // the day of the month (from 1-31)
		d.getHours()*60.0*60 + d.getMinutes()*60 + d.getSeconds()
	];

	this.uniforms = {
		iResolution: { type: 'f3', value: { x: width, y: height, z: 0 }},
		iMouse: { type: 'f3', value: { x: 0, y: 0, z: 0 }},
		iGlobalTime: { type: 'f', value: 1 },
		iDate: { type: 'f4', value: dates },
		iChannel1: { type: 'sampler2D', value: texture, wrap: 'repeat' }
	};

	//	Shader by Kali (https://www.shadertoy.com/view/XsBGzw)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"uniform sampler2D iChannel1;",
		"// add any extra uniforms here",

		"// Space Racing Lite",

		"// Distance function and initial design for space car is by eiffie:",
		"// https://www.shadertoy.com/view/ldjGRh",
		"// the rest is by me but he also helped to optimize the code.",

		"// I removed some features by default because the original was crashing the Shadertoy browser",
		"// for win7 users - try commenting this lines to see if the full version compiles for you:",

		"#define LOW_QUALITY // No reflections, no shadows, no planet, reduced ray steps & detail",
		"#define NO_HUD",

		"//#define LOOP_BREAKS // Could speed up, speed down, or just make your browser crash!",



		"#ifdef LOW_QUALITY",
		"#define RAY_STEPS 65",
		"#define SHADOW_STEPS 0",
		"#define ITERATIONS 5",
		"#define MAX_DIST 30.",
		"#else",
		"#define RAY_STEPS 75",
		"#define SHADOW_STEPS 40",
		"#define ITERATIONS 6",
		"#define MAX_DIST 35.",
		"#endif",
		"#define LIGHT_COLOR vec3(1.,.85,.6)",
		"#define AMBIENT_COLOR vec3(.7,.85,1.)",
		"#define SUN_COLOR vec3(1.,.8,.5)",
		"#define TUBE_COLOR vec3(1.,.6,.25)*1.2",
		"#define CAR_COLOR vec3(.4,.7,1.)",
		"#define TURBINES_COLOR vec3(.6,.75,1.)",
		"#define HUD_COLOR vec3(0.6,1.,0.3)",
		"#define PLANET_COLOR vec3(101., 153., 189.)/256.",

		"#define CAR_SCALE 4.",
		"#define SPECULAR 0.4",
		"#define DIFFUSE  2.0",
		"#define AMBIENT  0.4",

		"#define BRIGHTNESS .9",
		"#define GAMMA 1.1",
		"#define SATURATION .85",


		"#define DETAIL .004",
		"#define SPEED 8.",
		"#define t (mod(iGlobalTime,500.)+10.)*SPEED",

		"#define LIGHTDIR normalize(vec3(0.6,-0.2,-1.))",

		"// ------------------------------------------------------------------",
		"//    Global Variables",
		"// ------------------------------------------------------------------",

		"float FOLD=2.; // controls fractal fold and track width",
		"const vec3 planetpos=vec3(-3.5,1.,-5.); // planet position",
		"const vec2 tubepos=vec2(0.35,0.); // light tubes pos relative to FOLD",
		"mat2 trmx;//the turbine spinner",
		"float det=0.; // detail level (varies with distance)",
		"float backcam; // back cam flag",
		"vec3 carpos; // car position",
		"vec3 carvec; // car pointing vector",
		"mat3 carrot; // car rotation",
		"float hitcar; // ray-car hit flag",
		"mat2 fractrot; // rot mat for fractal (set in main)",
		"mat2 cartilt; // secondary car rotation",
		"float minT, minL; // min distance traps for glows of tube and turbines",
		"float ref; // reflection flag",
		"float tubeinterval; // tube tiling (for glow and lighting)",


		"// ------------------------------------------------------------------",
		"//    General functions",
		"// ------------------------------------------------------------------",

		"mat2 rot(float a) {",
		"return mat2(cos(a),sin(a),-sin(a),cos(a));",
	"}",

	"mat3 lookat(vec3 fw,vec3 up){",
	"fw=normalize(fw);vec3 rt=normalize(cross(fw,normalize(up)));return mat3(rt,cross(rt,fw),fw);",
	"}",

	"float smin(float a,float b,float k){return -log(exp(-k*a)+exp(-k*b))/k;}//from iq",

	"float Sphere(vec3 p, vec3 rd, float r){",
	"float b = dot( -p, rd );",
	"float inner = b * b - dot( p, p ) + r * r;",
	"if( inner < 0.0 ) return -1.0;",
	"return b - sqrt( abs(inner) );",
	"}",


	"// ------------------------------------------------------------------",
	"//    Track",
	"// ------------------------------------------------------------------",

	"// the track function, just some curves",
	"vec3 path(float ti) {",
	"float freq=.5, amp=1.; // for trying different settings",
	"ti*=freq;",
	"float x=cos(cos(ti*.35682)+ti*.2823)*cos(ti*.1322)*1.5;",
	"float y=sin(ti*.166453)*4.+cos(cos(ti*.125465)+ti*.17354)*cos(ti*.05123)*2.;",
	"vec3  p=vec3(x,y,ti/freq);",
	"return p;",
	"}",

	"// see if we are in the tunnel, and used also by distance function",
	"float tunnel(float z) {",
	"return abs(100.-mod(z+15.,200.))-30.;",
	"}",


	"// ------------------------------------------------------------------",
	"//    DE functions",
	"// ------------------------------------------------------------------",


	"// carcarspacecar by eiffie // (with some mods by Kali)",
	"// a reconfig of the carcar's tires (someday I will have to do an animation from the original to this)",
	"//the DE looks a bit long but there are actually fewer instructions than the car",

	"float carcarDE(in vec3 p0){",
	"p0.xy*=cartilt;",
	"p0*=CAR_SCALE;",
	"vec3 p=p0;",
	"p.y+=1.24;",
	"float r=length(p.yz);",
	"float d=length(max(vec3(abs(p.x)-0.35,r-1.92,-p.y+1.4),0.0))-0.05;",
	"d=max(d,p.z-1.05);",
	"p=p0+vec3(0.0,-0.22,0.39);",
	"p.xz=abs(p.xz);",
	"p.xyz-=vec3(0.72,0.0,1.06);",
	"float w1=0.23,w2=0.24;",
	"if(p0.z<0.0){//this is discontinuous yet works unless you stand in front of the rear turbines",
	"w1=0.23,w2=0.05; //where you would get sucked into the blades anyways",
	"p=p.xzy; //so i'm comfortable with it :)",
	"}",
	"r=length(p.xy);",
	"d=smin(d,length(vec2(max(abs(p.z)-w2,0.0),r-w1))-0.02,8.0);//done with the car shape, the rest is just turbines and could be replaced with lights or something",
	"d=min(d,(length(p*vec3(1.,1.,.6))-.08-p0.z*.03));",
	"p.xy=trmx*p.xy;//spin",
	"float d2=min(abs(p.x),abs(p.y))*.15;//4 blades",
	"//p.xy=mat2(0.707,-0.707,0.707,0.707)*p.xy;//45 degree turn",
	"//d2=min(d2,min(abs(p.x),abs(p.y))*.2);//8 blades",
	"d2=max(r-w1-.05,max(d2-0.005,abs(p.z)-w2+0.04));",
	"d2=min(d2,(length(p)-.05-p0.z*.035)*.07);",
	"d2=min(d2,max(d+.02,max(abs(p0.y-.07),abs(p0.x)-.4+min(0.,p0.z)))*.18);",
	"minL=min(minL,d2);//catch the minimum distance to the glowing parts",
	"// I used d2 only for glows (Kali)",
	"return d/CAR_SCALE;// *carScale",
	"}",


	"vec3 carcarCE(in vec3 p0){//coloring",
	"p0*=CAR_SCALE;",
	"vec4 trpc=vec4(0.);//color trap (taking samples when finding the norm)// not for now (Kali)",

	"//right here you should inv-transform p0 as it gets used later",
	"//p0=(p0-carPos)*carRot/carScale;//or something like that??",
	"p0.xy*=cartilt;",
	"vec3 p=p0;",
	"p.y+=1.24;",
	"float r=length(p.yz);",
	"float d=length(max(vec3(abs(p.x)-0.35,r-1.92,-p.y+1.4),0.0))-0.05;",
	"d=max(d,p.z-1.0);",
	"p=p0+vec3(0.0,-0.22,0.39);",
	"p.xz=abs(p.xz);",
	"p.xyz-=vec3(0.72,0.0,1.06);",
	"float w1=0.2,w2=0.24;",
	"if(p0.z<0.0){//this is discontinuous yet works unless you stand in front of the rear turbines",
	"w1=0.23,w2=0.05; //where you would get sucked into the blades anyways",
	"p=p.xzy; //so i'm comfortable with it :)",
	"}",
	"r=length(p.xy);",
	"d=smin(d,length(vec2(max(abs(p.z)-w2,0.0),r-w1))-0.02,8.0);//done with the car shape, the rest is just turbines and could be replaced with lights or something",
	"p.xy=trmx*p.xy;",
	"float d2=min(abs(p.x),abs(p.y));//4 blades",
	"p.xy=mat2(0.707,-0.707,0.707,0.707)*p.xy;//45 degrees",
	"d2=min(d2,min(abs(p.x),abs(p.y)));//8 blades",
	"d2=max(r-w1+0.02,max(d2-0.005,abs(p.z)-w2+0.04));",
	"//up to here it is the same as DE, now accumulate colors",
	"if(d2<d){d=d2;trpc+=vec4(1.,0.6,0.3,256.0);}//turbines",
	"else {//the car's body",
	"p0.x=abs(p0.x);",
	"if((abs(p0.y-0.58)>0.05-p0.z*0.09 || p0.z>0.25) &&",
	"length(max(abs(p0.xz+vec2(-p0.z*.03,-0.5))-vec2(0.15+p0.z*.03,0.4),0.0))>0.1)",
	"trpc+=vec4(CAR_COLOR,16.0);",
	"else trpc+=vec4(CAR_COLOR*.4,2.0);//the windsheild",
	"}",
	"return trpc.xyz; // *carScale",
	"}",

	"//-------------------------------------------",

	"// DE for tubes",
	"float tubes(vec3 pos) {",
	"pos.x=abs(pos.x)-tubepos.x-FOLD;",
	"pos.y+=tubepos.y;",
	"return (length(pos.xy)-.05);",
	"}",

	"// ------------------------------------------------------------------",
	"//    SCENE DE",
	"// ------------------------------------------------------------------",

	"float de(vec3 pos) {",
	"vec3 carp=pos-carpos; // scale car coordinates",
	"carp=carrot*carp; // rotate car",
	"pos.xy-=path(pos.z).xy; // transform coordinates to follow track",
	"FOLD=1.7+pow(abs(100.-mod(pos.z,200.))/100.,2.)*2.; //varies fractal fold & track width",
	"pos.x-=FOLD;",
	"float hid=0.;",
	"vec3 tpos=pos;",
	"tpos.z=abs(2.-mod(tpos.z,4.));",
	"vec4 p=vec4(tpos,1.);",
	"for (int i=0; i<ITERATIONS; i++) { // calculate fractal",
	"p.xz=clamp(p.xz,-vec2(FOLD,2.),vec2(FOLD,2.))*2.0-p.xz;",
	"p=p*2.5/clamp(dot(p.xyz,p.xyz),.5,1.)-vec4(1.2,0.5,0.,-0.5);",
	"p.xy*=fractrot;",
	"}",
	"pos.x+=FOLD;",
	"float fr=min(max(pos.y+.4,abs(pos.x)-.15*FOLD),(max(p.x,p.y)-1.)/p.w); // fractal+pit",
	"float tub=tubes(pos);",
	"minT=min(minT,tub*.5); // trap min distance to tubes",
	"float car=carcarDE(carp);",
	"float d=tub;",
	"d=min(fr,d);",
	"d=min(d,max(abs(pos.y-1.35+cos(3.1416+pos.x*.8)*.5)-.1,tunnel(pos.z))); // tunnel DE",
	"if (ref<1.) d=min(d,car);",
	"d=max(d,abs(pos.x)-FOLD*2.);",
	"if (car<det) hitcar=1.; // ray hits the car!",
	"return d;",
	"}",


	"// ------------------------------------------------------------------",
	"//    General Shading Functions",
	"// ------------------------------------------------------------------",


	"vec3 normal(vec3 p) {",
	"vec3 e = vec3(0.0,det,0.0);",

	"return normalize(vec3(",
	"de(p+e.yxx)-de(p-e.yxx),",
	"de(p+e.xyx)-de(p-e.xyx),",
	"de(p+e.xxy)-de(p-e.xxy)",
	")",
	");",
	"}",

	"#ifndef LOW_QUALITY",

	"float shadow(vec3 pos, vec3 sdir) {",
	"float sh=1.0;",
	"float totdist = DETAIL*10.;",
	"float dist=1000.;",
	"for (int steps=0; steps<SHADOW_STEPS; steps++) {",
	"if (totdist<MAX_DIST && dist>DETAIL) {",
	"vec3 p = pos - totdist * sdir;",
	"dist = de(p);",
	"sh = min(sh, 10.*max(0.0,dist)/totdist);",
	"sh*= sign(max(0.,dist-DETAIL));",
	"totdist += max(0.02,dist);",
	"}",
	"#ifdef LOOP_BREAKS",
	"else break;",
	"#endif",
	"}",

	"return clamp(sh,0.,1.0);",
	"}",

	"#endif",

	"float calcAO(vec3 pos, vec3 nor) {",
	"float hr,dd,aoi=0.,sca=1.,totao=0.;",
	"hr = .075*aoi*aoi;dd = de(nor * hr + pos);totao += (hr-dd)*sca;sca*=.6;aoi++;",
	"hr = .075*aoi*aoi;dd = de(nor * hr + pos);totao += (hr-dd)*sca;sca*=.55;aoi++;",
	"hr = .075*aoi*aoi;dd = de(nor * hr + pos);totao += (hr-dd)*sca;sca*=.55;aoi++;",
	"hr = .075*aoi*aoi;dd = de(nor * hr + pos);totao += (hr-dd)*sca;sca*=.55;aoi++;",
	"return clamp( 1.0 - 4.*totao, 0., 1.0 );",
	"}",


	"// ------------------------------------------------------------------",
	"//    Light and Coloring",
	"// ------------------------------------------------------------------",



	"vec3 shade(in vec3 p, in vec3 dir, in vec3 n) {",

	"float savehitcar=hitcar;",

	"vec3 trackoffset=-vec3(path(p.z).xy,0.);",
	"vec3 pos=p;",
	"vec3 col=vec3(.5); // main color",
	"vec3 carp=pos-carpos; //scaled coordinates for the car",
	"carp=carrot*carp; // rotate car",
	"pos+=trackoffset; // apply track transformation to the coordinates",
	"// track lines",
	"if (pos.y<.5) col+=pow(max(0.,.2-abs(pos.x))/.2*abs(sin(pos.z*2.)),8.)*TUBE_COLOR*2.;",
	"pos.x=abs(pos.x);",
	"// fake AO for the tunnel's upper corners",
	"if(tunnel(pos.z)<0.)",
	"col*=1.-pow(max(0.5,1.-length(pos.xy+vec2(-FOLD*1.5,-.85))),5.)*max(0.,1.+pos.y);",
	"if (tubes(pos)<det) col=TUBE_COLOR; // hit tubes",
	"if (carcarDE(carp)<det) col=carcarCE(carp); // hit car, get coloring",

	"float ao=calcAO(p,n); // calc AO",
	"float camlight=max(0.,dot(dir,-n)); // camlight used for ambient",

	"// --- Tube lights ---",

	"vec3 tpos1=vec3((tubepos+vec2(FOLD,0.)),0.)+trackoffset; // get tube positions",
	"vec3 tpos2=tpos1-vec3((tubepos.x+FOLD)*2.,0.,0.);",
	"// light direction",
	"vec3 tube1lightdir=normalize(vec3(p.xy,0.)+vec3(tpos1.xy,0.));",
	"vec3 tube2lightdir=normalize(vec3(p.xy,0.)+vec3(tpos2.xy,0.));",
	"// light falloffs",
	"float falloff1,falloff2;",
	"if (savehitcar>0.) {",
	"falloff1=pow(max(0.,1.-.15*distance(vec3(p.xy,0.),vec3(-tpos1.xy,0.))),4.);",
	"falloff2=pow(max(0.,1.-.15*distance(vec3(p.xy,0.),vec3(-tpos2.xy,0.))),4.);",
	"} else {",
	"falloff1=pow(max(0.,1.-.2*distance(vec3(p.xy,0.),vec3(-tpos1.xy,0.))),4.);",
	"falloff2=pow(max(0.,1.-.2*distance(vec3(p.xy,0.),vec3(-tpos2.xy,0.))),4.);",
	"}",

	"float diff, spec;",

	"vec3 r=reflect(LIGHTDIR,n);",

	"// tube1 calcs",
	"diff=max(0.,dot(tube1lightdir,-n));",
	"diff+=max(0.,dot(normalize(tube1lightdir+vec3(0.,0.,.2)),-n))*.5; // add 2 more",
	"diff+=max(0.,dot(normalize(tube1lightdir-vec3(0.,0.,.2)),-n))*.5; // with Z shifted",
	"spec=pow(max(0.,dot(tube1lightdir+vec3(0.,0.,.4),r)),15.)*.7;",
	"spec+=pow(max(0.,dot(tube1lightdir-vec3(0.,0.,.4),r)),15.)*.7;",
	"float tl1=(falloff1*ao+diff+spec)*falloff1;",

	"// tube2 calcs",
	"diff=max(0.,dot(tube2lightdir,-n));",
	"diff+=max(0.,dot(normalize(tube2lightdir+vec3(0.,0.,.2)),-n))*.5;",
	"diff+=max(0.,dot(normalize(tube2lightdir-vec3(0.,0.,.2)),-n))*.5;",
	"spec=pow(max(0.,dot(tube2lightdir+vec3(0.,0.,.4),r)),15.)*.7;",
	"spec+=pow(max(0.,dot(tube2lightdir-vec3(0.,0.,.4),r)),15.)*.7;",
	"float tl2=(falloff2*ao+diff+spec)*falloff2;",

	"// sum tube lights - add ambient - apply tube intervall",
	"vec3 tl=((tl1+tl2)*(.5+tubeinterval*.5))*TUBE_COLOR;//*(1.+tun*.5);",


	"// --- Car lights ---",

	"// get the car turbines direction (aproximate)",
	"vec3 carlightdir1=normalize(p-carpos+vec3(.2,0.06,.15));",
	"vec3 carlightdir2=normalize(p-carpos+vec3(-.2,0.06,.15));",
	"vec3 carlightdir3=normalize(p-carpos+vec3(.2,0.06,-.35));",
	"vec3 carlightdir4=normalize(p-carpos+vec3(-.2,0.06,-.35));",

	"float cfalloff=pow(max(0.,1.-.1*distance(p,carpos)),13.); // car light falloff",

	"// accumulate diffuse",
	"diff=max(0.,dot(carlightdir1,-n))*.5;",
	"diff+=max(0.,dot(carlightdir2,-n))*.5;",
	"diff+=max(0.,dot(carlightdir3,-n))*.5;",
	"diff+=max(0.,dot(carlightdir4,-n))*.5;",

	"if (savehitcar<1.) diff*=clamp(1.-carlightdir1.y,0.,1.);",

	"// add ambient and save car lighting",
	"vec3 cl=TURBINES_COLOR*((diff+spec*.0)*cfalloff+cfalloff*.3)*1.2;",

	"// --- Main light ---",

	"#ifdef LOW_QUALITY",
	"float sh=ao;",
	"#else",
	"float sh=shadow(p, LIGHTDIR); // get shadow",
	"#endif",

	"diff=max(0.,dot(LIGHTDIR,-n))*sh*1.3; // diffuse",
	"float amb=(.4+.6*camlight)*.6; // ambient+camlight",
	"spec=pow(max(0.,dot(dir,-r))*sh,20.)*SPECULAR; //specular",
	"if (savehitcar>0.) {diff*=.8;amb*=.3;}",
	"vec3 l=(amb*ao*AMBIENT_COLOR+diff*LIGHT_COLOR)+spec*LIGHT_COLOR;",

	"if (col==TUBE_COLOR) l=.3+vec3(camlight)*.7; // special lighting for tubes",

	"return col*(l+cl+tl); // apply all lights to the color",
	"}",

	"// the planet shading...",
	"// very simple and fast made, but for low res windowed mode it does the job :)",
	"vec3 shadeplanet(vec3 pos, vec3 k) {",

	"vec3 n=normalize(planetpos+pos+.2); // tweaked sphere normal",
	"float c=max(0.,dot(LIGHTDIR,normalize(k-n))); // surface value",
	"vec3 col=PLANET_COLOR+vec3(c,c*c,c*c*c)*.7; // surface coloring",
	"// add some noise",
	"float noi=max(0.,texture2D(iChannel1,n.yz*.5).x-.6);",
	"noi+=max(0.,texture2D(iChannel1,n.yz).x-.6);",
	"noi+=max(0.,texture2D(iChannel1,n.yz*2.).x-.6);",
	"col+=noi*(1.5-c)*.7;",
	"return col*max(0.,dot(LIGHTDIR,-n)); // diff light",
	"}",

	"// ------------------------------------------------------------------",
	"//    Raymarching + FX rendering",
	"// ------------------------------------------------------------------",


	"vec3 raymarch(in vec3 from, in vec3 dir)",

	"{",
	"hitcar=0.;",
	"ref=0.;",
	"float totdist=0.;",
	"float glow=0.;",
	"float d=1000.;",
	"vec3 p=from, col=vec3(0.5);",

	"float deta=DETAIL*(1.+backcam); // lower detail for HUD cam",
	"vec3 carp=vec3(0.); // coordinates for car hit",
	"vec3 carn=vec3(0.); // normal for car",
	"float cardist=0.; // ray length for car",
	"vec3 odir=dir; // save original ray direction",

	"for (int i=0; i<RAY_STEPS; i++) {",
	"if (d>det && totdist<MAX_DIST) {",
	"d=de(p);",
	"p+=d*dir;",
	"det=max(deta,deta*totdist*.5*(1.+ref)); // scale detail with distance or reflect",
	"totdist+=d;",
	"float gldist=det*8.; // background glow distance",
	"if(d<gldist&&totdist<20.) glow+=max(0.,gldist-d)/gldist*exp(-.1*totdist); //accum glow",
	"#ifndef LOW_QUALITY",
	"if (hitcar>0. && ref<1.) { // hit car, bounce ray (only once)",
	"p=p-abs(d-det)*dir; // backstep",
	"carn=normal(p); // save car normal",
	"carp=p; // save car hit pos",
	"dir=reflect(dir,carn); // reflect ray",
	"p+=det*dir*10.; // advance ray",
	"d=10.; cardist=totdist;",
	"ref=1.;",
	"}",
	"#endif",
	"}",
	"#ifdef LOOP_BREAKS",
	"else break;",
	"#endif",
	"}",

	"tubeinterval=abs(1.+cos(p.z*3.14159*.5))*.5; // set light tubes interval",
	"float cglow=1./(1.0+minL*minL*5000.0); // car glow",
	"float tglow=1./(1.0+minT*minT*5000.0); // tubes glow",
	"float l=max(0.,dot(normalize(-dir),normalize(LIGHTDIR))); // lightdir gradient",
	"vec3 backg=AMBIENT_COLOR*.4*max(0.1,pow(l,5.)); // background",
	"float lglow=pow(l,50.)*.5+pow(l,200.)*.5; // sun glow",

	"if (d<.5) { // hit surface",
	"vec3 norm=normal(p); // get normal",
	"p=p-abs(d-det)*dir; // backstep",
	"col=shade(p, dir, norm); // get shading",
	"col+=tglow*TUBE_COLOR*pow(tubeinterval,1.5)*2.; // add tube glow",
	"col = mix(backg, col, exp(-.015*pow(abs(totdist),1.5))); // distance fading",

	"} else { // hit background",
	"col=backg; // set color to background",
	"col+=lglow*SUN_COLOR; // add sun glow",
	"col+=glow*pow(l,5.)*.035*LIGHT_COLOR; // borders glow",

	"#ifdef LOW_QUALITY",
	"vec3 st = (dir * 3.+ vec3(1.3,2.5,1.25)) * .3;",
	"for (int i = 0; i < 14; i++) st = abs(st) / dot(st,st) - .9;",

	"col+= min( 1., pow( min( 5., length(st) ), 3. ) * .0025 ); // add stars",
	"#else",
	"float planet=Sphere(planetpos,dir, 2.); // raytrace planet",

	"// kaliset formula - used for stars and planet surface",
	"float c;",
	"if (planet>0.) c=1.; else c=.9; // different params for planet and stars",
	"vec3 st = (dir * 3.+ vec3(1.3,2.5,1.25)) * .3;",
	"for (int i = 0; i < 14; i++) st = abs(st) / dot(st,st) - c;",

	"col+= min( 1., pow( min( 5., length(st) ), 3. ) * .0025 ); // add stars",

	"// planet atmosphere",
	"col+=PLANET_COLOR*pow(max(0.,dot(dir,normalize(-planetpos))),100.)*150.*(1.-dir.x);",
	"// planet shading",
	"if (planet>0.) col=shadeplanet(planet*dir,st);",
	"#endif",

	"}",
	"// car shading",

	"// add turbine glows",

	"#ifdef LOW_QUALITY",
	"cglow*=1.15;",
	"#else",
	"if (ref>0.) {",
	"ref=0.;",
	"col=shade(carp,odir,carn)+col*.3; // car shade + reflection",
	"// I wanted a lighter background for backward reflection",
	"l=max(0.,dot(normalize(-odir),normalize(LIGHTDIR)));",
	"backg=AMBIENT_COLOR*.4*max(0.1,pow(l,5.));",
	"col = mix(backg, col,exp(-.015*pow(abs(cardist),1.5))); // distance fading",
	"}",
	"#endif",


	"col+=TURBINES_COLOR*pow(abs(cglow),2.)*.4;",
	"col+=TURBINES_COLOR*cglow*.15;",


	"return col;",
	"}",

	"// simple HUD track graph with transparency",
	"vec4 showtrack(vec2 p) {",
	"p.x+=.25;",
	"vec2 uv=p;",
	"float uvpos=uv.x+1.5;",
	"vec3 pth=path((uvpos-1.5)*30.+t)*.05;",
	"float curpos=path(t).x*.05;",
	"float curs=pow(max(0.,1.-length(uv+vec2(0.,curpos))*2.),10.)*max(0.5,sin(iGlobalTime*10.))*2.;",
	"uv.xy=uv.xy-(vec2(uvpos,0.))*rot(pth.x/uvpos);",
	"float dotline=pow(max(0.,1.-abs(uv.y)*5.),30.);",
	"float graph=(curs+dotline);",
	"return vec4((graph+.4)*HUD_COLOR,1.-.5*pow(abs(.025-mod(p.y*2.,.05))/.025,2.));",
	"}",


	"// ------------------------------------------------------------------",
	"//    Main code - Camera - HUD",
	"// ------------------------------------------------------------------",


	"void main(void)",
	"{",
	"minL=minT=1000.; // initialize min distance glows",
	"fractrot=rot(.5); // mat2D for the fractal formula",
	"vec3 carpos0=vec3(0.,-0.2,.0); // set relative car pos (unused now, only sets height)",
	"carpos=vec3(carpos0+vec3(0.,0.,t)); // real car pos",
	"vec3 carmove=path(carpos.z); carmove.x*=1.+FOLD*.1; // get pos, exagerate x pos based on track width.",
	"carvec=normalize((path(carpos.z+2.)-carmove)*vec3(FOLD*.25,1.,1.)); // car fwd vector",
	"carrot=lookat(-carvec,vec3(0.,1.,0.)); // car rotation",
	"cartilt=rot(-carvec.x*2.); // xy rotation based on distance from center",
	"carpos.xy+=carmove.xy-vec2(carvec.x,0.)*FOLD*.5; // move away from center when turning",
	"float tim=iGlobalTime*12.0;",
	"trmx=mat2(cos(tim),-sin(tim),sin(tim),cos(tim));//the turbine spinner",

	"// --- camera & mouse ---",

	"vec2 uv = gl_FragCoord.xy / iResolution.xy*2.-1.;",
	"uv.y*=iResolution.y/iResolution.x;",
	"vec2 mouse=(iMouse.xy/iResolution.xy-.5)*vec2(7.,1.5);",
	"if (iMouse.z<1.) { // if no mouse, alternate rear and back cam",
	"mouse=vec2(sin(iGlobalTime)*.7,2.+sin(iGlobalTime*.2)*.22)",
	"*min(0.,sign(10.-mod(iGlobalTime,20.)));",
	"}",
	"vec3 dir=normalize(vec3(uv*.8,1.));",

	"vec3 campos=vec3(0.,0.2,-.6); // original relative camera position",
	"//rotate camera with mouse",
	"campos.yz=(campos.yz-carpos0.yz)*rot(mouse.y)+carpos0.yz;",
	"campos.xz=(campos.xz-carpos0.xz)*rot(mouse.x)+carpos0.xz;",
	"campos.x-=carvec.x*FOLD; // follow car x pos a bit when turning",

	"vec3 from;",

	"float fixcam=5.;",
	"float mt=mod(t/SPEED,fixcam*2.);",
	"//fixed cam every 15 seconds, random position, point at car position",
	"if ((mod(iGlobalTime,20.)>15. && iMouse.z<1.)) {",
	"fixcam*=SPEED;",
	"from=path(floor(t/fixcam)*fixcam+fixcam*.5);",
	"//from.x+=1.; from.y+=.5;",
	"vec2 fixpos=(texture2D(iChannel1,vec2(from.z*.21325)).xy-.5)*vec2(FOLD*2.-.3,1.);",
	"fixpos.x+=sign(fixpos.x)*.3; fixpos.y+=.2;",
	"from.xy+=fixpos;",
	"dir=lookat(normalize(carpos-from),vec3(0.,1.,0.))*normalize(dir+vec3(0.,0.,0.5));",

	"} else { //normal cam",
	"from=path(t+campos.z)+campos;",
	"dir.y-=.3*campos.z;",
	"dir=lookat(normalize(carpos-from),vec3(0.,1.,0.))*normalize(dir);",
	"}",

	"vec4 hud=vec4(0.);",

	"#ifndef NO_HUD",
	"//HUD (hud camera was going to be transparent but won't compile)",
	"backcam=0.;",
	"vec2 huv=uv+vec2(.75,.44);",
	"if (length(huv*huv*huv*vec2(5.,50.))<.05) hud=showtrack(huv*2.); // track HUD",
	"uv+=vec2(-.75,.44);",
	"if (length(uv*uv*uv*vec2(5.,50.))<.05) { //set ray data for HUD cam",
	"backcam=1.;",
	"uv*=6.;",
	"dir=normalize(vec3(uv.xy*.6,-1.));",
	"from=vec3(carvec.x*.5,0.1,0.)+path(t-campos.z*1.7);",
	"dir=lookat(-normalize(carpos-from),normalize(vec3(0.,1.,0.)))*dir;",
	"//color+=HUD_COLOR*(vec3(HUDraymarch(from,dir))+.1);",
	"}",

	"#endif",

	"vec3 color=raymarch(from,dir); 	// Raymarch scene",
	"color=clamp(color,vec3(.0),vec3(1.));",
	"if (backcam>0.) { //if HUD cam, apply post effect",
	"color=(.2+pow(length(color),1.7)*.5)*HUD_COLOR",
	"*(1.-.5*pow(abs(.025-mod(uv.y*.9,.05))/.025,2.))*.9;",
	"}",

	"color=hud.rgb*hud.a+color*(1.-hud.a);//HUD transparency",

	"//color adjustments",
	"color=pow(abs(color),vec3(GAMMA))*BRIGHTNESS;",
	"color=mix(vec3(length(color)),color,SATURATION);",
	"gl_FragColor = vec4(color,1.);",
	"}"];	


}

PIXI.SpaceRacingLiteFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.SpaceRacingLiteFilter.prototype.constructor = PIXI.SpaceRacingLiteFilter;

Object.defineProperty(PIXI.SpaceRacingLiteFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/tex00.jpg');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.SpaceRacingLiteFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
