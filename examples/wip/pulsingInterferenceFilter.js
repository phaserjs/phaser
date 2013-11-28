PIXI.PulsingInterferenceFilter = function(width, height, texture)
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

	//	Shader by knatten (https://www.shadertoy.com/view/lssGR8)
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

		"float PI = 3.14159265358979323846264;",

		"vec2 warp(in vec2 xy)",
		"{",
			"float amount = 0.3*pow(sin(iGlobalTime*2.0), 20.0);",
			"return vec2(xy.x + sin(xy.x*10.0)*amount*sin(iGlobalTime),",
			"xy.y + cos(xy.y*10.0)*amount*sin(iGlobalTime));",
		"}",

		"float distance(in vec2 uv, in float x, in float y)",
		"{",
			"return sqrt(pow(abs(uv.x - x), 2.0) + pow(abs(uv.y - y), 2.0));",
		"}",

		"void main(void)",
		"{",
			"vec2 uv = gl_FragCoord.xy / iResolution.xy;",
			"uv = warp(uv);",

			"float x_1 = sin(iGlobalTime*1.5);",
			"float y_1 = cos(iGlobalTime);",
			"float x_2 = cos(iGlobalTime);",
			"float y_2 = sin(iGlobalTime);",

			"float dist_1 = distance(uv, x_1, y_1);",
			"float dist_2 = distance(uv, x_2, y_2);",

			"float t = sin(iGlobalTime);//mod(iGlobalTime*100.0, 100.0)/100.0;",
			"float c1 = sin(dist_1*50.0) * sin(dist_2*50.0);",
			"float red = c1*t;",
			"float blue = sin(dist_1*50.0) * sin(dist_1*150.0);",
			"float green = c1*(1.0-t);",
			"vec3 color = vec3(red, green, blue);",

			"vec3 flash = vec3(pow(sin(iGlobalTime*2.0),20.0));",
			"color += flash;",
			"gl_FragColor = vec4(color, 1.0);",
		"}"];	



}

PIXI.PulsingInterferenceFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.PulsingInterferenceFilter.prototype.constructor = PIXI.PulsingInterferenceFilter;

Object.defineProperty(PIXI.PulsingInterferenceFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/tex01.jpg');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.PulsingInterferenceFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
