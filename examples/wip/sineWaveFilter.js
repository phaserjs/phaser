PIXI.SineWaveFilter = function(width, height, texture)
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
		iChannel0: { type: 'sampler2D', value: texture, textureData: { repeat: true } }
	};

	//	Shader by Kali (https://www.shadertoy.com/view/4dfGDM)
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

		"void main(void)",
		"{",
			"vec2 uv = gl_FragCoord.xy / iResolution.xy;",
			"uv.y += (sin((uv.x + (iGlobalTime * 0.5)) * 10.0) * 0.1) +",
			"(sin((uv.x + (iGlobalTime * 0.2)) * 32.0) * 0.01);",
			"vec4 texColor = texture2D(iChannel0, uv);",
			"gl_FragColor = texColor;",
		"}"];

}

PIXI.SineWaveFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.SineWaveFilter.prototype.constructor = PIXI.SineWaveFilter;

Object.defineProperty(PIXI.SineWaveFilter.prototype, 'iGlobalTime', {
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
    game.load.image('texture', 'wip/tex07.jpg');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.SineWaveFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
