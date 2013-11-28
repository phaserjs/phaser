PIXI.HueRotationFilter = function(width, height, texture)
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

	//	Shader by Daniil (https://www.shadertoy.com/view/4sl3DH)
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

		"/* Simple hue rotation filter based on article:",
		"http://beesbuzz.biz/code/hsv_color_transforms.php",
		"*/",

		"#define SPEED 1.0",

		"void main(void)",
		"{",
			"vec2 uv = gl_FragCoord.xy / iResolution.xy;",

			"float c = cos(iGlobalTime*SPEED);",
			"float s = sin(iGlobalTime*SPEED);",

			"mat4 hueRotation =",
			"mat4( 	 0.299,  0.587,  0.114, 0.0,",
			"0.299,  0.587,  0.114, 0.0,",
			"0.299,  0.587,  0.114, 0.0,",
			"0.000,  0.000,  0.000, 1.0) +",

			"mat4(	 0.701, -0.587, -0.114, 0.0,",
			"-0.299,  0.413, -0.114, 0.0,",
			"-0.300, -0.588,  0.886, 0.0,",
			"0.000,  0.000,  0.000, 0.0) * c +",

			"mat4(	 0.168,  0.330, -0.497, 0.0,",
			"-0.328,  0.035,  0.292, 0.0,",
			"1.250, -1.050, -0.203, 0.0,",
			"0.000,  0.000,  0.000, 0.0) * s;",

			"vec4 pixel = texture2D(iChannel0, uv);",

			"gl_FragColor = pixel * hueRotation;",

		"}"];



}

PIXI.HueRotationFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.HueRotationFilter.prototype.constructor = PIXI.HueRotationFilter;

Object.defineProperty(PIXI.HueRotationFilter.prototype, 'iGlobalTime', {
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
    // game.load.image('texture', 'wip/64x64.png');
    game.load.image('texture', 'assets/pics/ra_einstein.png');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	// sprite.width = 800;
	// sprite.height = 600;

	filter = new PIXI.HueRotationFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
