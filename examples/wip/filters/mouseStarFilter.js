PIXI.MouseStarFilter = function(width, height, texture)
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
		iMouse: { type: 'f3', value: { x: 0, y: 0, z: 0 }},
		iGlobalTime: { type: 'f', value: 1 },
		iDate: { type: 'f4', value: dates },
		iChannel0: { type: 'sampler2D', value: texture, wrap: 'repeat' }
	};

	//	Shader by Danguafer (https://www.shadertoy.com/view/XdB3zw)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec3      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"uniform sampler2D iChannel0;",
		"// add any extra uniforms here",

		"#define t iGlobalTime/4.0",

		"void main(void) {",
		"vec2 p = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;",
		"vec2 mp = iMouse.xy/iResolution.xy*0.5+0.5;",

		"float s = 1.0;",
		"for (int i=0; i < 7; i++) {",
		"s = max(s,abs(p.x)-0.375);",
		"p = abs(p*2.25)-mp*1.25;",
		"p *= mat2(cos(t),-sin(t),sin(t),cos(t));",
	"}",

	"vec3 col = vec3(4.0,2.0,1.0)/abs(atan(p.y,p.x))/s;",

	"gl_FragColor = vec4(col,1.0);",
	"}"];	

}

PIXI.MouseStarFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.MouseStarFilter.prototype.constructor = PIXI.MouseStarFilter;

Object.defineProperty(PIXI.MouseStarFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.MouseStarFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
