PIXI.TunnelFilter = function(width, height, texture)
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

	//	Shader by 4rknova (https://www.shadertoy.com/view/lssGDn)
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

		"#ifdef GL_ES",
		"precision highp float;",
		"#endif",

		"#define S 0.79577471545 // Precalculated 2.5 / PI",
		"#define E 0.0001",

		"void main(void)",
		"{",
			"vec2 p = (2.0 * gl_FragCoord.xy / iResolution.xy - 1.0)",
			"* vec2(iResolution.x / iResolution.y, 1.0);",
			"vec2 t = vec2(S * atan(p.x, p.y), 1.0 / max(length(p), E));",
			"vec3 c = texture2D(iChannel0, t + vec2(iGlobalTime * 0.1, iGlobalTime)).xyz;",
			"gl_FragColor = vec4(c / (t.y + 0.5), 1.0);",
		"}"
	];

}

PIXI.TunnelFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.TunnelFilter.prototype.constructor = PIXI.TunnelFilter;

Object.defineProperty(PIXI.TunnelFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.TunnelFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
