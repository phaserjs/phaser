PIXI.C64PlasmaFilter = function(width, height)
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

	//	Shader by ssdsa (https://www.shadertoy.com/view/MslGzN)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"// add any extra uniforms here",

		"// 2D plasma in C64 graphics style",
		"//",
		"// Version 1.0 (2013-03-31)",
		"// Simon Stelling-de San Antonio",

		"float camtime = 1.23*iGlobalTime;",

		"void main(void)",
		"{",
			"vec2 p = gl_FragCoord.xy / iResolution.xy;",
			"p.y = 1.0 - p.y;",
			"p *= 200.0;",
			"p.x *= (iResolution.x / iResolution.y);",
			"p.x /= 2.0;",
			"p = floor(p);",
			"p.x *= 2.0;",
			"float a = p.x+30.0*sin(p.x/21.0 + 0.3*sin(0.4*camtime))+20.0*cos(p.y/19.0 + 0.2*cos(0.6*camtime))-160.0;",
			"float b = p.y+30.0*cos(p.y/18.0 + 0.4*sin(0.7*camtime))+20.0*sin(p.x/16.0 + 0.5*cos(0.7*camtime))- 97.0;",
			"float e = floor((length(vec2(a,b))",
			"+4.0*mod(floor((p.x+p.y+p.y)/2.0),2.0))/13.0);",
			"float c;",
			"if        (e ==  0.0) { c =  9.0;",
			"} else if (e ==  1.0) { c =  2.0;",
			"} else if (e ==  2.0) { c =  8.0;",
			"} else if (e ==  3.0) { c = 10.0;",
			"} else if (e ==  4.0) { c = 15.0;",
			"} else if (e ==  5.0) { c =  7.0;",
			"} else if (e ==  6.0) { c =  1.0;",
			"} else if (e ==  7.0) { c = 13.0;",
			"} else if (e ==  8.0) { c =  3.0;",
			"} else if (e ==  9.0) { c = 14.0;",
			"} else if (e == 10.0) { c =  4.0;",
			"} else if (e == 11.0) { c =  6.0;",
			"} else if (e == 12.0) { c =  0.0;",
			"} else if (e == 13.0) { c = 11.0;",
			"} else if (e == 14.0) { c =  5.0;",
			"} else                { c = 12.0;",
		"}",
		"vec3 col;",
		"if        (c ==  0.0) { col = vec3(0.0);",
		"} else if (c ==  1.0) { col = vec3(1.0);",
		"} else if (c ==  2.0) { col = vec3(137.0,  64.0,  54.0)/256.0;",
		"} else if (c ==  3.0) { col = vec3(122.0, 191.0, 199.0)/256.0;",
		"} else if (c ==  4.0) { col = vec3(138.0,  70.0, 174.0)/256.0;",
		"} else if (c ==  5.0) { col = vec3(104.0, 169.0,  65.0)/256.0;",
		"} else if (c ==  6.0) { col = vec3( 62.0,  49.0, 162.0)/256.0;",
		"} else if (c ==  7.0) { col = vec3(208.0, 220.0, 113.0)/256.0;",
		"} else if (c ==  8.0) { col = vec3(144.0,  95.0,  37.0)/256.0;",
		"} else if (c ==  9.0) { col = vec3( 92.0,  71.0,   0.0)/256.0;",
		"} else if (c == 10.0) { col = vec3(187.0, 119.0, 109.0)/256.0;",
		"} else if (c == 11.0) { col = vec3( 85.0,  85.0,  85.0)/256.0;",
		"} else if (c == 12.0) { col = vec3(128.0, 128.0, 128.0)/256.0;",
		"} else if (c == 13.0) { col = vec3(172.0, 234.0, 136.0)/256.0;",
		"} else if (c == 14.0) { col = vec3(124.0, 112.0, 218.0)/256.0;",
		"} else                { col = vec3(171.0, 171.0, 171.0)/256.0;",
	"}",
	"gl_FragColor = vec4(col,1.0);",
	"}"];

}

PIXI.C64PlasmaFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.C64PlasmaFilter.prototype.constructor = PIXI.C64PlasmaFilter;

Object.defineProperty(PIXI.C64PlasmaFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.C64PlasmaFilter(sprite.width, sprite.height);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
