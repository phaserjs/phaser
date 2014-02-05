PIXI.MysteryVortexFilter = function(width, height, texture)
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
		iChannel1: { type: 'sampler2D', value: texture, wrap: 'repeat' }
	};

	//	Shader by xeron_iris (https://www.shadertoy.com/view/XdXGz7)
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
			"vec2 uv = (gl_FragCoord.xy - (iResolution.xy/2.0)) / iResolution.xy;",

			"float dist = sqrt(uv.x*uv.x+uv.y*uv.y);",

			"float distr = ((sin(iGlobalTime)+1.0)-dist) * sin(atan(uv.x, uv.y)*7.0+iGlobalTime*4.01+sin(dist*(cos(iGlobalTime*0.3)+0.25)*40.0));",
			"float distg = ((sin(iGlobalTime*0.9)+1.0)-dist) * sin(atan(uv.x, uv.y)*8.0+iGlobalTime*3.41+sin(dist*(cos(iGlobalTime*0.25)+0.25)*40.0));",
			"float distb = ((sin(iGlobalTime*1.15)+1.0)-dist) * sin(atan(uv.x, uv.y)*9.0+iGlobalTime*4.36+sin(dist*(cos(iGlobalTime*0.33)+0.25)*40.0));",

			"gl_FragColor = vec4(distr+distg-distb, distg+distb-distr, distb+distr-distg, 1.0);",
		"}"];

}

PIXI.MysteryVortexFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.MysteryVortexFilter.prototype.constructor = PIXI.MysteryVortexFilter;

Object.defineProperty(PIXI.MysteryVortexFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.MysteryVortexFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
