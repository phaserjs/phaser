PIXI.PlasmaBeamFilter = function(width, height)
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
		iDate: { type: '4fv', value: dates }
	};

	//	Shader by 4rknova (https://www.shadertoy.com/view/Xsl3WH)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"// add any extra uniforms here",

		"#ifdef GL_ES",
		"precision highp float;",
		"#endif",

		"#define AMPLITUDE  0.19",
		"#define WVELOCITY  1.0",
		"#define WAVEWIDTH  2.0",
		"#define THICKNESS  0.5",

		"void main(void)",
		"{",
			"vec2 uv = gl_FragCoord.xy / iResolution.xy;",

			"float h = sin((uv.x * WAVEWIDTH + iGlobalTime * WVELOCITY) * 2.5) * AMPLITUDE;",
			"float f = pow(THICKNESS * abs(0.1 / (uv.y * 2.0 - 1.0 + h)), 2.0);",

			"gl_FragColor = vec4(0.0, 0.0, f, 1.0);",
		"}"];

}

PIXI.PlasmaBeamFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.PlasmaBeamFilter.prototype.constructor = PIXI.PlasmaBeamFilter;

Object.defineProperty(PIXI.PlasmaBeamFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/64x64.png');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.PlasmaBeamFilter(sprite.width, sprite.height);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
