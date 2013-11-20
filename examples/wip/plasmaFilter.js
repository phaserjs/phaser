PIXI.PlasmaFilter = function(width, height)
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
		iGlobalTime: { type: 'f', value: 1 },
		iDate: { type: 'f4', value: dates }
	};

	//	Shader by TriggerHLM (https://www.shadertoy.com/view/MdXGDH)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"// add any extra uniforms here",

		"const float PI = 3.14159265;",

		"float time = iGlobalTime *0.2;",

		"void main(void ) {",

		"float color1, color2, color;",

		"color1 = (sin(dot(gl_FragCoord.xy,vec2(sin(time*3.0),cos(time*3.0)))*0.02+time*3.0)+1.0)/2.0;",

		"vec2 center = vec2(640.0/2.0, 360.0/2.0) + vec2(640.0/2.0*sin(-time*3.0),360.0/2.0*cos(-time*3.0));",

		"color2 = (cos(length(gl_FragCoord.xy - center)*0.03)+1.0)/2.0;",

		"color = (color1+ color2)/2.0;",

		"float red	= (cos(PI*color/0.5+time*3.0)+1.0)/2.0;",
		"float green	= (sin(PI*color/0.5+time*3.0)+1.0)/2.0;",
		"float blue	= (sin(+time*3.0)+1.0)/2.0;",

		"gl_FragColor = vec4(red, green, blue, 1.0);",
		"}"
	];

}

PIXI.PlasmaFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.PlasmaFilter.prototype.constructor = PIXI.PlasmaFilter;

Object.defineProperty(PIXI.PlasmaFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('texture', 'wip/64x64.png');

}

var plasma;
var container;

function create() {

	game.stage.backgroundColor = '#000000';

	container = game.add.sprite(0, 0, 'texture');
	container.width = 800;
	container.height = 600;

	plasma = new PIXI.PlasmaFilter(container.width, container.height);

	container.filters = [plasma];

}

function update() {

	plasma.iGlobalTime = game.time.totalElapsedSeconds();

}
