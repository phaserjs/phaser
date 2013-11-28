PIXI.TRSIPlasmaFilter = function(width, height)
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

	//	Shader by Rebb / TRSI (https://www.shadertoy.com/view/XdX3Wn)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"// add any extra uniforms here",

		"// Rebb/TRSi^Paradise",

		"float an= sin(iGlobalTime)/3.14157;",
		"float as= sin(an);",
		"float zoo = .23232+.38*sin(.7*iGlobalTime);",
		"void main(void)",
		"{",
			"vec2 position = ( gl_FragCoord.xy / iResolution.xy *3.3 );",

			"float color = 0.0;",
			"color += sin(position.x - position.y) ;",
			"color += sin(iGlobalTime)* cos(sin(iGlobalTime)*position.y*position.x*sin(position.x))+.008;",
			"color += sin(iGlobalTime)+position.x*sin(position.y*sin(sin(tan(cos (iGlobalTime)))));",
			"gl_FragColor = vec4( vec3(sin(color*color)*4.0, sin(color*color) , color )*sin(iGlobalTime+position.x/(iGlobalTime*3.14)),iGlobalTime/10.828 );",

		"}"];

}

PIXI.TRSIPlasmaFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.TRSIPlasmaFilter.prototype.constructor = PIXI.TRSIPlasmaFilter;

Object.defineProperty(PIXI.TRSIPlasmaFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.TRSIPlasmaFilter(sprite.width, sprite.height);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
