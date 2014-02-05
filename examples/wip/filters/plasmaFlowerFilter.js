PIXI.PlasmaFlowerFilter = function(width, height)
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

	//	Shader by epsilum (https://www.shadertoy.com/view/Xdf3zH)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"// add any extra uniforms here",

		"float addFlower(float x, float y, float ax, float ay, float fx, float fy)",
		"{",
			"float xx=(x+sin(iGlobalTime*fx)*ax)*8.0;",
			"float yy=(y+cos(iGlobalTime*fy)*ay)*8.0;",
			"float angle = atan(yy,xx);",
			"float zz = 1.5*(cos(18.0*angle)*0.5+0.5) / (0.7 * 3.141592) + 1.2*(sin(15.0*angle)*0.5+0.5)/ (0.7 * 3.141592);",

			"return zz;",
		"}",

		"void main(void)",
		"{",
			"vec2 xy=(gl_FragCoord.xy/iResolution.x)*2.0-vec2(1.0,iResolution.y/iResolution.x);",

			"float x=xy.x;",
			"float y=xy.y;",

			"float p1 = addFlower(x, y, 0.8, 0.9, 0.95, 0.85);",
			"float p2 = addFlower(x, y, 0.7, 0.9, 0.42, 0.71);",
			"float p3 = addFlower(x, y, 0.5, 1.0, 0.23, 0.97);",
			"float p4 = addFlower(x, y, 0.8, 0.5, 0.81, 1.91);",

			"float p=clamp((p1+p2+p3+p4)*0.25, 0.0, 1.0);",

			"vec4 col;",
			"if (p < 0.5)",
			"col=vec4(mix(0.0,1.0,p*2.0), mix(0.0,0.63,p*2.0), 0.0, 1.0);",
			"else if (p >= 0.5 && p <= 0.75)",
			"col=vec4(mix(1.0, 1.0-0.32, (p-0.5)*4.0), mix(0.63, 0.0, (p-0.5)*4.0), mix(0.0,0.24,(p-0.5)*4.0), 1.0);",
			"else",
			"col=vec4(mix(0.68, 0.0, (p-0.75)*4.0), 0.0, mix(0.24, 0.0, (p-0.75)*4.0), 1.0);",

			"gl_FragColor = col;",
		"}"];

}

PIXI.PlasmaFlowerFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.PlasmaFlowerFilter.prototype.constructor = PIXI.PlasmaFlowerFilter;

Object.defineProperty(PIXI.PlasmaFlowerFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.PlasmaFlowerFilter(sprite.width, sprite.height);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
