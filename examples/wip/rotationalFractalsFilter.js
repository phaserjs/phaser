PIXI.RotationalFractalsFilter = function(width, height, texture)
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
		iMouse: { type: '3f', value: { x: 0, y: 0, z: 0 }},
		iGlobalTime: { type: '1f', value: 1 },
		iDate: { type: '4fv', value: dates },
		iChannel0: { type: 'sampler2D', value: texture, wrap: 'repeat' }
	};

	//	Shader by gleurop (https://www.shadertoy.com/view/MsXGRS)
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

		"vec3 hsv(in float h, in float s, in float v) {",
		"return mix(vec3(1.0), clamp((abs(fract(h + vec3(3, 2, 1) / 3.0) * 6.0 - 3.0) - 1.0), 0.0 , 1.0), s) * v;",
	"}",

	"void main() {",
	"vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / iResolution.xy;",
	"p.x *= iResolution.x / iResolution.y;",
	"vec2 c = vec2(-iGlobalTime*0.154, iGlobalTime*0.2485);",
	"float d = 1.0;",
	"vec3 col = vec3(0);",
	"float t = iGlobalTime;",
	"for (int i = 0; i < 20; i++) {",
	"float r = length(p);",
	"p /= r;",
	"p = asin(sin(p/r + c));",
	"col += hsv(r, max(1.0-dot(p,p), 0.0), 1.0);",
	"}",
	"gl_FragColor = vec4(sin(col)*0.5+0.5,",
	"1.0);",
	"}"];


}

PIXI.RotationalFractalsFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.RotationalFractalsFilter.prototype.constructor = PIXI.RotationalFractalsFilter;

Object.defineProperty(PIXI.RotationalFractalsFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/tex07.jpg');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.RotationalFractalsFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
