PIXI.MengerTunnelFilter = function(width, height, texture)
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
		iResolution: { type: '3f', value: { x: width, y: height, z: 0 }},
		iGlobalTime: { type: '1f', value: 1 },
		iDate: { type: '4fv', value: dates },
		iChannel0: { type: 'sampler2D', value: texture, wrap: 'repeat' }
	};

	//	Shader by fb39ca4 (https://www.shadertoy.com/view/XslGzl)
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

		"const int MAX_RAY_STEPS = 64;",
		"const float RAY_STOP_TRESHOLD = 0.0001;",
		"const int MENGER_ITERATIONS = 5;",

		"float maxcomp(vec2 v) { return max(v.x, v.y); }",

		"float sdCross(vec3 p) {",
		"p = abs(p);",
		"vec3 d = vec3(max(p.x, p.y),",
		"max(p.y, p.z),",
		"max(p.z, p.x));",
		"return min(d.x, min(d.y, d.z)) - (1.0 / 3.0);",
	"}",

	"float sdCrossRep(vec3 p) {",
	"vec3 q = mod(p + 1.0, 2.0) - 1.0;",
	"return sdCross(q);",
	"}",

	"float sdCrossRepScale(vec3 p, float s) {",
	"return sdCrossRep(p * s) / s;",
	"}",

	"float scene(vec3 p) {",
	"float scale = 1.0;",
	"float dist = 0.0;",
	"for (int i = 0; i < MENGER_ITERATIONS; i++) {",
	"dist = max(dist, -sdCrossRepScale(p, scale));",
	"scale *= 3.0;",
	"}",
	"return dist;",
	"}",

	"vec3 hsv2rgb(vec3 c)",
	"{",
	"vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
	"vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
	"return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
	"}",

	"vec4 colorize(float c) {",

	"float hue = mix(0.6, 1.15, min(c * 1.2 - 0.05, 1.0));",
	"float sat = 1.0 - pow(c, 4.0);",
	"float lum = c;",
	"vec3 hsv = vec3(hue, sat, lum);",
	"vec3 rgb = hsv2rgb(hsv);",
	"return vec4(rgb, 1.0);",
	"}",


	"void main(void)",
	"{",
	"vec2 screenPos = gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0;",
	"vec2 mousePos = iMouse.xy / iResolution.xy * 2.0 - 1.0;",

	"vec3 cameraPos = vec3(0.16 * sin(iGlobalTime), 0.16 * cos(iGlobalTime), iGlobalTime);",
	"//vec3 cameraPos = vec3(0.0);",
	"vec3 cameraDir = vec3(0.0, 0.0, 1.0);",
	"vec3 cameraPlaneU = vec3(1.0, 0.0, 0.0);",
	"vec3 cameraPlaneV = vec3(0.0, 1.0, 0.0) * (iResolution.y / iResolution.x);",

	"vec3 rayPos = cameraPos;",
	"vec3 rayDir = cameraDir + screenPos.x * cameraPlaneU + screenPos.y * cameraPlaneV;",

	"rayDir = normalize(rayDir);",

	"float dist = scene(rayPos);",
	"int stepsTaken;",
	"for (int i = 0; i < MAX_RAY_STEPS; i++) {",
	"if (dist < RAY_STOP_TRESHOLD) {",
	"continue;",
	"}",
	"rayPos += rayDir * dist;",
	"dist = scene(rayPos);",
	"stepsTaken = i;",
	"}",

	"vec4 color = colorize(pow(float(stepsTaken) / float(MAX_RAY_STEPS), 0.9));",

	"gl_FragColor = color;",
	"}"];


}

PIXI.MengerTunnelFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.MengerTunnelFilter.prototype.constructor = PIXI.MengerTunnelFilter;

Object.defineProperty(PIXI.MengerTunnelFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.MengerTunnelFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
