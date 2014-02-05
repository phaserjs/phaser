PIXI.WobbleFilter = function(width, height, texture0, texture1)
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
		iChannel0: { type: 'sampler2D', value: texture0, textureData: { repeat: true } },
		iChannel1: { type: 'sampler2D', value: texture1, textureData: { repeat: true } }
	};

	//	Shader by deps (https://www.shadertoy.com/view/MssGDM)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"uniform sampler2D iChannel0;",
		"uniform sampler2D iChannel1;",
		"// add any extra uniforms here",

		"void main(void)",
		"{",
			"vec2 uv = (gl_FragCoord.xy / iResolution.xy);",
			"uv.y = 1.0-uv.y;",

			"float time = iGlobalTime * 0.75;",

			"vec4 pixel2 = texture2D(iChannel1, (uv+vec2(sin(time),cos(time))) * 0.15  );",

			"float xDiff = pixel2.r * 0.02;",
			"float yDiff = 0.0;",

			"vec2 diffVec = vec2( xDiff, yDiff );",

			"vec4 pixel = texture2D(iChannel0, uv + diffVec);",

			"gl_FragColor = pixel;",
		"}"];

}

PIXI.WobbleFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.WobbleFilter.prototype.constructor = PIXI.WobbleFilter;

Object.defineProperty(PIXI.WobbleFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture0', 'wip/tex04.jpg');
    game.load.image('texture1', 'wip/tex10.png');

}

var filter;
var sprite;

function create() {

	noise = game.add.sprite(0, 0, 'texture1');

	sprite = game.add.sprite(0, 0, 'texture0');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.WobbleFilter(sprite.width, sprite.height, sprite.texture, noise.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
