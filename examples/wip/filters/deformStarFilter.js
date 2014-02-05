PIXI.DeformStarFilter = function(width, height, texture)
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

	//	Shader by iq (https://www.shadertoy.com/view/4dXGRn)
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

		"// Created by inigo quilez - iq/2013",
		"// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.",

		"vec3 sqr( vec3 x ) { return x*x; }",
		"void main(void)",
		"{",
			"vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / iResolution.xy;",
			"float a = atan(p.y,p.x);",
			"float r = sqrt(dot(p,p));",
			"float s = r * (1.0+0.5*cos(iGlobalTime*0.5));",

			"vec2 uv = 0.02*p;",
			"uv.x +=                  .03*cos(-iGlobalTime+a*4.0)/s;",
			"uv.y += .02*iGlobalTime +.03*sin(-iGlobalTime+a*4.0)/s;",
			"uv.y += r*r*0.025*sin(2.0*r);",

			"vec3 col = texture2D( iChannel0, 0.5*uv).xyz  * vec3(1.0,0.8,0.6);",
			"col += sqr(texture2D( iChannel0, 1.0*uv).xxx) * vec3(0.7,1.0,1.0);",

			"float w = 2.0*r;",
			"w *= 0.5 + 0.5*pow(clamp(1.0-0.75*r,0.0,1.0),0.5);",

			"gl_FragColor = vec4(col*w,1.0);",
		"}"];



}

PIXI.DeformStarFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.DeformStarFilter.prototype.constructor = PIXI.DeformStarFilter;

Object.defineProperty(PIXI.DeformStarFilter.prototype, 'iGlobalTime', {
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
    game.load.image('texture', 'wip/tex08.jpg');
    game.load.image('texture2', 'assets/textures/alice.jpg');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.DeformStarFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
