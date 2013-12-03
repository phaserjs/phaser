PIXI.StarsBackgroundFilter = function(width, height, texture)
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
		iChannel0: { type: 'sampler2D', value: texture }
	};

	//	Shader by urraka (https://www.shadertoy.com/view/lsfGWH)
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

		"#define M_PI 3.1415926535897932384626433832795",

		"float rand(vec2 co)",
		"{",
			"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
		"}",

		"void main(void)",
		"{",
			"float size = 30.0;",
			"float prob = 0.95;",

			"vec2 pos = floor(1.0 / size * gl_FragCoord.xy);",

			"float color = 0.0;",
			"float starValue = rand(pos);",

			"if (starValue > prob)",
			"{",
				"vec2 center = size * pos + vec2(size, size) * 0.5;",

				"float t = 0.9 + 0.2 * sin(iGlobalTime + (starValue - prob) / (1.0 - prob) * 45.0);",

				"color = 1.0 - distance(gl_FragCoord.xy, center) / (0.5 * size);",
				"color = color * t / (abs(gl_FragCoord.y - center.y)) * t / (abs(gl_FragCoord.x - center.x));",
			"}",
			"else if (rand(gl_FragCoord.xy / iResolution.xy) > 0.996)",
			"{",
				"float r = rand(gl_FragCoord.xy);",
				"color = r * (0.25 * sin(iGlobalTime * (r * 5.0) + 720.0 * r) + 0.75);",
			"}",

			"gl_FragColor = vec4(vec3(color), 1.0);",
		"}"];



}

PIXI.StarsBackgroundFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.StarsBackgroundFilter.prototype.constructor = PIXI.StarsBackgroundFilter;

Object.defineProperty(PIXI.StarsBackgroundFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    // game.load.image('texture', 'wip/64x64.png');
    game.load.image('texture', 'wip/tex08.jpg');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.StarsBackgroundFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
