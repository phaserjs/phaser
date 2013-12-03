PIXI.BinarySerpentsFilter = function(width, height, texture)
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

this.fragmentSrc = [
	"#ifdef GL_ES",
	"precision mediump float;",
	"#endif",
	"//Ashok Gowtham M",
	"//UnderWater Caustic lights",
	"uniform float time;",
	"uniform vec2 mouse;",
	"uniform vec2 resolution;",
	"//normalized sin",
	"float sinn(float x)",
	"{",
		"return sin(x)/2.+.001;",
	"}",

	"float CausticPatternFn(vec2 pos)",
	"{",
		"return (sin(pos.x*40.+time)",
		"+pow(sin(-pos.x*130.+time),1.)",
		"+pow(sin(pos.x*30.+time),2.)",
		"+pow(sin(pos.x*50.+time),2.)",
		"+pow(sin(pos.x*80.+time),2.)",
		"+pow(sin(pos.x*90.+time),2.)",
		"+pow(sin(pos.x*12.+time),2.)",
		"+pow(sin(pos.x*6.+time),2.)",
		"+pow(sin(-pos.x*13.+time),5.))/2.;",
	"}",

	"vec2 CausticDistortDomainFn(vec2 pos)",
	"{",
		"pos.x*=(pos.y*0.60+1.);",
		"pos.x*=1.+sin(time/2.)/10.;",
		"return pos;",
	"}",

	"void main( void )",
	"{",
		"vec2 pos = gl_FragCoord.xy/resolution;",
		"pos-=.5;",
		"vec2  CausticDistortedDomain = CausticDistortDomainFn(pos);",
		"float CausticShape = clamp(7.-length(CausticDistortedDomain.x*20.),0.,1.);",
		"float CausticPattern = CausticPatternFn(CausticDistortedDomain);",
		"float CausticOnFloor = CausticPatternFn(pos)+sin(pos.y*100.)*clamp(2.-length(pos*2.),0.,1.);",
		"float Caustic;",
		"Caustic += CausticShape*CausticPattern;",
		"Caustic *= (pos.y+.5)/4.;",
		"//Caustic += CausticOnFloor;",
		"float f = length(pos+vec2(-.5,.5))*length(pos+vec2(.5,.5))*(1.+Caustic)/1.;",


		"gl_FragColor = vec4(.1,.5,.6,1)*(f);",

	"}"];


}

PIXI.BinarySerpentsFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.BinarySerpentsFilter.prototype.constructor = PIXI.BinarySerpentsFilter;

Object.defineProperty(PIXI.BinarySerpentsFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.BinarySerpentsFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
