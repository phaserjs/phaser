PIXI.ColorBoxFilter = function()
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
		iResolution: { type: 'f3', value: { x: 800, y: 600, z: 0 }},
		iGlobalTime: { type: 'f', value: 1 },
		iDate: { type: 'f4', value: dates }
	};

	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",

		"void main(void) {",
			"vec2 uv = gl_FragCoord.xy / iResolution.xy;",
			"gl_FragColor = vec4(uv, 0.5 * sin(iGlobalTime), 0.0);",
		"}"
	];

}

PIXI.ColorBoxFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.ColorBoxFilter.prototype.constructor = PIXI.ColorBoxFilter;

Object.defineProperty(PIXI.ColorBoxFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('tex', 'wip/tex16.png');
    game.load.image('sea', 'assets/pics/undersea.jpg');

}

var stars;

function create() {

	stars = new PIXI.ColorBoxFilter();

	var a = game.add.sprite(0, 0, 'sea');
	a.filters = [stars];

}

function update() {

	stars.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
