PIXI.FractalRayMarchFilter = function(width, height, texture)
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
		iChannel0: { type: 'sampler2D', value: texture, wrap: 'repeat' }
	};

	//	Shader by liamboone (https://www.shadertoy.com/view/4sfGDS)
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

		"const float PI = 3.14159;",
		"const float EPS = 0.01;",

		"//Thanks to Inigo Quilez for the wonderful distance functions",
		"//[http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm]",
		"float sphere(vec3 pos, float rad)",
		"{",
			"return length(pos)-rad;",
		"}",

		"float torus(vec3 pos, vec2 rad)",
		"{",
			"vec2 q = vec2(length(pos.xz)-rad.x,pos.y);",
			"return length(q)-rad.y;",
		"}",

		"vec2 cmpSqr(vec2 a)",
		"{",
			"return vec2(a.x*a.x - a.y*a.y, 2.0*a.x*a.y);",
		"}",

		"vec2 cmpMul(vec2 a, vec2 b)",
		"{",
			"return vec2(a.x*b.x - a.y*b.y, a.x*b.y + b.x*a.y);",
		"}",

		"vec3 repeat(vec3 pos, vec3 c)",
		"{",
			"return mod(pos, c)-0.5*c;",
		"}",

		"float map(vec3 pos, out int material)",
		"{",
			"material = 0;",
			"vec3 q = repeat(pos, vec3(10.0));",
			"return min(sphere(pos, 2.0), min(max(sphere(q, 1.0),-torus(q,vec2(1.5, 1.0))),torus(q,vec2(1.5, 0.25))));",
		"}",

		"vec3 getNormal(vec3 p) {",
		"int m;",
		"return normalize(vec3(",
		"map(p + vec3(EPS, 0, 0), m) - map(p - vec3(EPS, 0, 0), m),",
		"map(p + vec3(0, EPS, 0), m) - map(p - vec3(0, EPS, 0), m),",
		"map(p + vec3(0, 0, EPS), m) - map(p - vec3(0, 0, EPS), m)));",
	"}",

	"void main(void)",
	"{",
		"float fovy = (70.0+sin(iGlobalTime*0.3)*50.0) / 2.0;",
		"float fovy_rad = fovy * PI / 180.0;",
		"//Define camera position and view",
		"vec3 eye   = vec3(-10.0 + 5.0*cos(iGlobalTime), 10.0 + 5.0*sin(iGlobalTime*0.5), 2.0*sin(iGlobalTime*0.1));",
		"vec3 view  = normalize(vec3(0.0) - eye);",
		"vec3 up    = normalize(vec3(0.0, 1.0,  0.0));",
		"vec3 right = normalize(cross(view, up));",
		"up = normalize(cross(right, view));",

		"//Dolly zoom equation from wikipedia.org/wiki/Dolly_zoom",
		"float distFromTarget = 10.0;",
		"float scale = iResolution.x / iResolution.y / (2.0 * tan(fovy_rad));",
		"eye = vec3(0) - view*distFromTarget*scale;",


		"//Figure out where the ray should point",
		"vec2 uv = gl_FragCoord.xy / iResolution.xy;",
		"vec2 real_uv = (uv - 0.5) * 2.0;",
		"real_uv *= (iResolution.xy / iResolution.y);",

		"//Then point it there",
		"vec3 ray = (view * cos(fovy_rad)) +",
		"(up * real_uv.y * sin(fovy_rad)) +",
		"(right * real_uv.x * sin(fovy_rad));",

		"ray = normalize(ray);",

		"//Everything starts somewhere",
		"vec3 pos = eye;",
		"float dist = 999.0;",
		"float travel = 0.0;",
		"int material;",

		"//Engage!",
		"for(int i = 0; i < 100; i ++)",
		"{",
			"dist = map(pos, material);",
			"pos += ray * dist;// * 0.9;",
			"travel += dist;// * 0.9;",
		"}",

		"vec3 norm = getNormal(pos);",
		"gl_FragColor = vec4(mix(vec3(0.0), abs(norm), exp(-0.01*travel)), 1.0);",
	"}"];

}

PIXI.FractalRayMarchFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.FractalRayMarchFilter.prototype.constructor = PIXI.FractalRayMarchFilter;

Object.defineProperty(PIXI.FractalRayMarchFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.FractalRayMarchFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
