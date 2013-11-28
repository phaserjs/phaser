PIXI.VortexFilter = function(width, height, texture)
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

	//	Shader by GhettoWolf (https://www.shadertoy.com/view/Xdl3WH)
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

		"#define PI 3.1416",

		"void main(void)",
		"{",
			"//map the xy pixel co-ordinates to be between -1.0 to +1.0 on x and y axes",
			"//and alter the x value according to the aspect ratio so it isn't 'stretched'",
			"vec2 p = (2.0 * gl_FragCoord.xy / iResolution.xy - 1.0)",
			"* vec2(iResolution.x / iResolution.y, 1.0);",

			"//now, this is the usual part that uses the formula for texture mapping a ray-",
			"//traced cylinder using the vector p that describes the position of the pixel",
			"//from the centre.",
			"vec2 uv = vec2(atan(p.y, p.x) * 1.0/PI, 1.0 / sqrt(dot(p, p))) * vec2(2.0, 1.0);",


			"//now this just 'warps' the texture read by altering the u coordinate depending on",
			"//the val of the v coordinate and the current time",
			"uv.x += sin(2.0 * uv.y + iGlobalTime * 0.5);",

			"vec3 c = texture2D(iChannel0, uv).xyz",

			"//this divison makes the color value 'darker' into the distance, otherwise",
			"//everything will be a uniform brightness and no sense of depth will be present.",
			"/ (uv.y * 0.5 + 1.0);",

			"gl_FragColor = vec4(c, 1.0);",
		"}"];

}

PIXI.VortexFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.VortexFilter.prototype.constructor = PIXI.VortexFilter;

Object.defineProperty(PIXI.VortexFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.VortexFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
