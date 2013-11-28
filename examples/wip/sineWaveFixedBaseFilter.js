PIXI.SineWaveFixedBaseFilter = function(width, height, texture)
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
		iMouse: { type: '3f', value: { x: 0, y: 0, z: 0 }},
		iResolution: { type: '3f', value: { x: width, y: height, z: 0 }},
		iGlobalTime: { type: '1f', value: 1 },
		iDate: { type: '4fv', value: dates },
		iChannel0: { type: 'sampler2D', value: texture, textureData: { repeat: true } }
	};

	//	Shader by BrokenBit (https://www.shadertoy.com/view/MsXGzX)
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

			"// Flip-a-roo.",
			"uv.y *= -1.0;",

			"// Represents the v/y coord(0 to 1) that will not sway.",
			"float fixedBasePosY = 0.0;",

			"// Configs for you to get the sway just right.",
			"float speed = 3.0;",
			"float verticleDensity = 6.0;",
			"float swayIntensity = 0.2;",

			"// Putting it all together.",
			"float offsetX = sin(uv.y * verticleDensity + iGlobalTime * speed) * swayIntensity;",

			"// Offsettin the u/x coord.",
			"uv.x += offsetX * (uv.y - fixedBasePosY);",

			"gl_FragColor = texture2D(iChannel0, uv);",
		"}"];

}

PIXI.SineWaveFixedBaseFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.SineWaveFixedBaseFilter.prototype.constructor = PIXI.SineWaveFixedBaseFilter;

Object.defineProperty(PIXI.SineWaveFixedBaseFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.SineWaveFixedBaseFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
