PIXI.TrippyLinesFilter = function(width, height)
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

	//	Shader by aji (https://www.shadertoy.com/view/lslGRj)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"// add any extra uniforms here",



		"int schedule = 0;",

		"vec4 hue(float rad)",
		"{",
			"rad /= 2.0;",
			"return vec4(abs(cos(rad)), abs(cos(rad+1.05)),",
			"abs(cos(rad+2.09)), 1.0);",
		"}",

		"vec4 gradient(float f)",
		"{",
			"f = mod(f, 1.0) * 3.14;",
			"if (schedule == 0) {",
			"return vec4(sin(f) * sin(f));",
			"} else if (schedule == 1) {",
			"float r = pow(.5 + .5 * sin(2.0 * (f + 0.00)), 20.0);",
			"float g = pow(.5 + .5 * sin(2.0 * (f + 1.05)), 20.0);",
			"float b = pow(.5 + .5 * sin(2.0 * (f + 2.09)), 20.0);",
			"return vec4(r, g, b, 1.0);",
			"} else if (schedule == 2) {",
			"return vec4(0.0, .5+.5*sin(f), 0.0, 1.0);",
		"}",
		"return vec4(0.0);",
	"}",

	"float offset(float th)",
	"{",
		"float mt = mod(iGlobalTime, 4.0);",
		"float x = sin(iGlobalTime + th) + sin(iGlobalTime + 2.0 * th)",
		"+ .3 * cos(iGlobalTime + 8.0 * th);",
		"if (schedule == 0) {",
		"return x + .2 * sin(10.0 * iGlobalTime + 20.0 * th);",
		"} else if (schedule == 1) {",
		"return x + floor(iGlobalTime * 3.0) * .333;",
		"} else if (schedule == 2) {",
		"return x + .1 * sin(60.0 * th);",
	"}",
	"return 0.0;",
	"}",

	"vec4 tunnel(float th, float radius)",
	"{",
	"return gradient(offset(th) + log(6.0 * radius));",
	"}",

	"void main()",
	"{",
	"vec2 uv = gl_FragCoord.xy / iResolution.x +",
	"vec2(-.5, -.5 * iResolution.y / iResolution.x);",
	"schedule = int(mod(iGlobalTime + 2.0, 6.0) / 2.0);",
	"gl_FragColor = tunnel(atan(uv.y, uv.x), 2.0 * length(uv));",
	"}"];

}

PIXI.TrippyLinesFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.TrippyLinesFilter.prototype.constructor = PIXI.TrippyLinesFilter;

Object.defineProperty(PIXI.TrippyLinesFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.TrippyLinesFilter(sprite.width, sprite.height);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
