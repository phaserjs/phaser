PIXI.CheckerWaveFilter = function(width, height, texture)
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
		resolution: { type: '2f', value: { x: width, y: height }},
		mouse: { type: '2f', value: { x: 0, y: 0 }},
		time: { type: '1f', value: 1 }
	};

	//	http://glsl.heroku.com/e#12260.0
	
	//	Heroku shader conversion

	this.fragmentSrc = [
		"precision mediump float;",

		"#ifdef GL_ES",
		"precision highp float;",
		"#endif",

		"uniform vec2 resolution;",
		"uniform float time;",

		"//Scene Start",

		"//Floor",
		"vec2 obj0(in vec3 p){",
		"//obj deformation",
		"p.y=p.y+sin(sqrt(p.x*p.x+p.z*p.z)-time*4.0)*0.5;",
		"//plane",
		"return vec2(p.y+3.0,0);",
	"}",
	"//Floor Color (checkerboard)",
	"vec3 obj0_c(in vec3 p){",
	"if (fract(p.x*.5)>.5)",
	"if (fract(p.z*.5)>.5)",
	"return vec3(0,1,1);",
	"else",
	"return vec3(1,1,1);",
	"else",
	"if (fract(p.z*.5)>.5)",
	"return vec3(1,1,1);",
	"else",
	"return vec3(0,1,1);",
	"}",

	"//Scene End",

	"void main(void){",
	"vec2 vPos=-1.0+2.0*gl_FragCoord.xy/resolution.xy;",

	"//Camera animation",
	"vec3 vuv=vec3(0,2,sin(time*0.1));//Change camere up vector here",
	"vec3 prp=vec3(-sin(time*0.6)*8.0,0,cos(time*0.4)*8.0); //Change camera path position here",
	"vec3 vrp=vec3(0,-5,0); //Change camere view here",


	"//Camera setup",
	"vec3 vpn=normalize(vrp-prp);",
	"vec3 u=normalize(cross(vuv,vpn));",
	"vec3 v=cross(vpn,u);",
	"vec3 vcv=(prp+vpn);",
	"vec3 scrCoord=vcv+vPos.x*u*resolution.x/resolution.y+vPos.y*v;",
	"vec3 scp=normalize(scrCoord-prp);",

	"//Raymarching",
	"const vec3 e=vec3(0.1,0,0);",
	"const float maxd=80.0; //Max depth",

	"vec2 s=vec2(0.1,0.0);",
	"vec3 c,p,n;",

	"float f=1.0;",
	"for(int i=0;i<156;i++){",
	"if (abs(s.x)<.01||f>maxd) break;",
	"f+=s.x;",
	"p=prp+scp*f;",
	"s=obj0(p);",
	"}",

	"if (f<maxd){",
	"if (s.y==0.0)",
	"c=obj0_c(p);",
	"n=normalize(",
	"vec3(s.x-obj0(p-e.xyy).x,",
	"s.x-obj0(p-e.yxy).x,",
	"s.x-obj0(p-e.yyx).x));",
	"float b=dot(n,normalize(prp-p));",
	"gl_FragColor=vec4((b*c+pow(b,8.0))*(1.0-f*.02),1.0);//simple phong LightPosition=CameraPosition",
	"}",
	"else gl_FragColor=vec4(0,0,0.1,1); //background color",
	"}"];



}

PIXI.CheckerWaveFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.CheckerWaveFilter.prototype.constructor = PIXI.CheckerWaveFilter;

Object.defineProperty(PIXI.CheckerWaveFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.time.value;
    },
    set: function(value) {
    	this.uniforms.time.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/tex01.jpg');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.CheckerWaveFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.mouse.value.x = game.input.x;
	filter.uniforms.mouse.value.y = game.input.y;

}

function render() {
}
