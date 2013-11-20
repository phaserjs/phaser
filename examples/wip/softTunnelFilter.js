PIXI.SoftTunnelFilter = function(width, height, texture)
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
		iGlobalTime: { type: 'f', value: 1 },
		iDate: { type: 'f4', value: dates },
		iChannel0: { type: 'sampler2D', value: texture, wrap: 'repeat' }
	};

	//	Shader by HeGu (https://www.shadertoy.com/view/XdXGD4)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"uniform sampler2D iChannel0;",
		"// add any extra uniforms here",

		"uniform sampler2D Texture0;",

		"uniform float Time;",

		"uniform vec2 Mcoord;",
		"uniform vec2 Vcoord;",

		"varying vec2 texCoord;",

		"vec2 mod289(vec2 x) {",
		"return x - floor(x * (1.0 / 289.0)) * 289.0;",
	"}",

	"vec3 mod289(vec3 x) {",
	"return x - floor(x * (1.0 / 289.0)) * 289.0;",
	"}",

	"vec3 permute(vec3 x) {",
	"return mod289(((x*34.0)+1.0)*x);",
	"}",

	"float snoise(vec2 v)",
	"{",
	"const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);",
	"vec2 i  = floor(v + dot(v, C.yy) );",
	"vec2 x0 = v -   i + dot(i, C.xx);",

	"vec2 i1;",
	"i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);",
	"vec4 x12 = x0.xyxy + C.xxzz;",
	"x12.xy -= i1;",

	"i = mod289(i); // Avoid truncation effects in permutation",
	"vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))",
	"+ i.x + vec3(0.0, i1.x, 1.0 ));",

	"vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);",
	"m = m*m ;",
	"m = m*m ;",

	"vec3 x = 2.0 * fract(p * C.www) - 1.0;",
	"vec3 h = abs(x) - 0.5;",
	"vec3 ox = floor(x + 0.5);",
	"vec3 a0 = x - ox;",

	"m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );",

	"vec3 g;",
	"g.x  = a0.x  * x0.x  + h.x  * x0.y;",
	"g.yz = a0.yz * x12.xz + h.yz * x12.yw;",

	"return 130.0 * dot(m, g);",
	"}",

	"float fbm(vec2 p) {",
	"float f = 0.0;",
	"float w = 0.5;",
	"for (int i = 0; i < 5; i ++) {",
	"f += w * snoise(p);",
	"p *= 2.;",
	"w *= 0.5;",
	"}",
	"return f;",
	"}",


	"vec4 tunneliter(vec2 texCoord,vec4 incol,float cx,float cy,float limita,float limitb,vec4 coloz,float tadd)",
	"{",
	"vec2 texc;",
	"vec2 tex;",
	"vec4 outCol;",
	"float disty;",

	"texc=(texCoord-vec2(cx,cy));",
	"disty=distance(texc,vec2(0.0,0.0));",
	"tex.x=(abs(atan(texc.x,texc.y)))/6.2830;",
	"tex.y=0.5/disty;",
	"tex.y+=(iGlobalTime*0.9)+tadd;",

	"float fbmval=abs(fbm(tex));",

	"float bex=mix(fbmval,1.0,smoothstep(limitb,limita,disty))*smoothstep(limitb,limita,disty);",
	"outCol=mix(incol,coloz*(1.0-fbmval),bex);",

	"return outCol;",
	"}",

	"void main(void)",
	"{",
	"vec2 uv = gl_FragCoord.xy / iResolution.xy;",
	"gl_FragColor = vec4(uv,0.5+0.5*sin(iGlobalTime),1.0);",

	"vec4 finalCol;",

	"float xa=(sin(iGlobalTime)*0.4)+(sin((iGlobalTime*1.3)+0.5)*0.24);",
	"float ya=(cos(iGlobalTime)*0.45)+(cos((iGlobalTime*0.6)-0.7)*0.3);",

	"finalCol=vec4(1.0,0.0,1.0,1.0);",

	"finalCol=tunneliter(uv,vec4(1.0,1.0,1.0,1.0),0.5+(xa*0.80),0.5+(ya*0.80),0.04,0.01,vec4(0.9,0.9,1.0,1.0),3.1);",
	"finalCol=tunneliter(uv,finalCol,0.5+(xa*0.90),0.5+(ya*0.70),0.08,0.03,vec4(0.7,0.7,0.8,1.0),7.2);",
	"finalCol=tunneliter(uv,finalCol,0.5+(xa*0.70),0.5+(ya*0.70),0.14,0.05,vec4(0.6,0.6,0.7,1.0),9.3);",
	"finalCol=tunneliter(uv,finalCol,0.5+(xa*0.58),0.5+(ya*0.58),0.18,0.10,vec4(0.5,0.5,0.6,1.0),4.4);",
	"finalCol=tunneliter(uv,finalCol,0.5+(xa*0.35),0.5+(ya*0.35),0.24,0.15,vec4(0.4,0.4,0.5,1.0),2.5);",
	"finalCol=tunneliter(uv,finalCol,0.5+(xa*0.22),0.5+(ya*0.22),0.30,0.20,vec4(0.4,0.4,0.5,1.0),9.6);",
	"finalCol=tunneliter(uv,finalCol,0.5+(xa*0.15),0.5+(ya*0.15),0.40,0.25,vec4(0.3,0.3,0.4,1.0),6.7);",
	"finalCol=tunneliter(uv,finalCol,0.5+(xa*0.12),0.5+(ya*0.12),0.50,0.35,vec4(0.3,0.3,0.4,1.0),3.8);",
	"finalCol=tunneliter(uv,finalCol,0.5+(xa*0.10),0.5+(ya*0.10),0.60,0.40,vec4(0.3,0.3,0.4,1.0),7.9);",

	"gl_FragColor = vec4(vec3(finalCol.xyz),1.0);",

	"}"];

}

PIXI.SoftTunnelFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.SoftTunnelFilter.prototype.constructor = PIXI.SoftTunnelFilter;

Object.defineProperty(PIXI.SoftTunnelFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/tex15.png');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.SoftTunnelFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
