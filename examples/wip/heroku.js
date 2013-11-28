PIXI.RayTracedBallsFilter = function(width, height, texture)
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

	//	http://glsl.heroku.com/e#12288.0
	
	//	Heroku shader conversion

	this.fragmentSrc = [
		"precision mediump float;",

		"// CBS",
		"// ported from https://www.shadertoy.com/view/lslGWr",
		"// Added some stars: Thanks to http://glsl.heroku.com/e#6904.0",
		"// Modified for use",

		"uniform float time;",
		"uniform vec2 mouse;",
		"uniform vec2 resolution;",

		"// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/",
		"float field(in vec3 p) {",
		"float strength = 7. + .03 * log(1.e-6 + fract(sin(time*0.001) * 4373.11));",
		"float accum = 0.;",
		"float prev = 0.;",
		"float tw = 0.;",
		"for (int i = 0; i < 24; ++i) {",
		"float mag = dot(p, p);",
		"p = abs(p) / mag + vec3(-.51, -.4, -1.3);",
		"float w = exp(-float(i) / 7.);",
		"accum += w * exp(-strength * pow(abs(mag - prev), 2.3));",
		"tw += w;",
		"prev = mag;",
	"}",
	"return max(0., 5. * accum / tw - .7);",
	"}",

	"float rand(vec2 co) {",
	"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
	"}",

	"float stars(float slow_time, vec2 position) {",

	"float brightness = 0.;",

	"for (int i = 0; i < 100; i++) {",

	"vec2 rand_pos = vec2(rand(vec2(i)),rand(vec2(i+1)))*2.;",
	"float scale = pow(rand(vec2(i+2)),2.);",

	"vec2 l_pos = rand_pos - .15*vec2(sin(slow_time/16.), sin(slow_time/12.))*scale;",

	"l_pos = mod(l_pos,2.)-1.;",
	"l_pos *= 1.03;",

	"vec2 dist = abs(l_pos - position);",
	"dist.x = min(dist.x,.1);",
	"dist.y = min(dist.y,.1);",

	"//float intensity = 1. - (pow(dist.x, .5*scale) + pow(dist.y, .1-.05*scale));",
	"float intensity = .0005*scale/sqrt(pow(dist.x,2.)+pow(dist.y,2.));",
	"intensity = clamp(intensity * 1., 0., 1.);",

	"brightness = brightness + pow(4. * intensity, 2.);",
	"}",
	"return brightness;",
	"}",

	"vec3 nrand3( vec2 co )",
	"{",
	"vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );",
	"vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );",
	"vec3 c = mix(a, b, 1111110.5);",
	"return c;",
	"}",


	"void main() {",
	"vec2 uv = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;",
	"vec2 uvs = uv * resolution.xy / max(resolution.x, resolution.y);",
	"float realtime = time*000.1;",

	"vec3 p = vec3(uvs / 4., 0) + vec3(2., -1.3, -1.);",
	"p += 0.15 * vec3(sin(realtime / 16.), sin(realtime / 12.),  sin(realtime / 128.));",

	"vec3 p2 = vec3(uvs / (4.+sin(realtime*0.11)*0.2+0.2+sin(realtime*0.15)*0.3+0.4), 1.5) + vec3(2., -1.3, -1.);",
	"p2 += 0.15 * vec3(sin(realtime / 16.), sin(realtime / 12.),  sin(realtime / 128.));",

	"float t = field(p);",
	"float t2 = field(p2);",
	"float v = (1. - exp((abs(uv.x) - 10.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));",

	"vec4 c1 = mix(.4, 1., v) * vec4(1.8 * t * t * t, 1.4 * t * t, t, 1.0);",
	"vec4 c2 = mix(.4, 1., v) * vec4((sin(realtime/7.)+1.+uvs.x/16.+uvs.y/32.) * t2 * t2 * t2 * (t+9.)/10., (sin(realtime/11.)+1.-uvs.x/16.-uvs.y/32.) * t2 * t2, t2, sin(realtime/19.)/2.+.5);",
	"//c1.b *= mod(gl_FragCoord.y+1.0, 2.0)*1.4;",
	"c2.r *= mod(gl_FragCoord.y, 1.0)*7.4;",
	"gl_FragColor = (c1 + c2)*.8-.3;//+stars(realtime,uvs);",
	"gl_FragColor += vec4(vec3(stars(realtime,uvs)),1.0);",

	"}"];



}

PIXI.RayTracedBallsFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.RayTracedBallsFilter.prototype.constructor = PIXI.RayTracedBallsFilter;

Object.defineProperty(PIXI.RayTracedBallsFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.RayTracedBallsFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.mouse.value.x = game.input.x;
	filter.uniforms.mouse.value.y = game.input.y;

}

function render() {
}
