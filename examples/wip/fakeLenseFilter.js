PIXI.FakeLenseFilter = function(width, height, texture)
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

	//	Shader by deps (https://www.shadertoy.com/view/MslGDM)
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

		"#define INTENSITY 5.5",
		"#define GLOW 2.0",

		"vec2 blob(vec2 uv, vec2 speed, vec2 size, float time) {",
		"vec2 point = vec2(",
		"(sin(speed.x * time) * size.x),",
		"(cos(speed.y * time) * size.y)",
		");",

		"float d = 1.0 / distance(uv, point);",
		"d = pow(d / INTENSITY, GLOW);",

		"//if( d < 0.1 )",
		"//	return uv;",

		"vec2 v2 = normalize(uv - point) * clamp(d,0.1,0.7);",

		"return uv - v2;",
	"}",

	"void main(void)",
	"{",
		"vec2 uv = -1.0 + 2.0 * (gl_FragCoord.xy / iResolution.xy);",

		"float time = iGlobalTime * 0.75;",

		"vec2 read = blob(uv, vec2(3.7, 5.2), vec2(0.2, 0.2), time);",

		"vec4 pixel = texture2D(iChannel0, read);",

		"//if( blob < 0.1 ) pixel = vec4(pixel.r*0.5,pixel.g*0.5,pixel.b*0.5,1);",

		"gl_FragColor = pixel;",
	"}"];

}

PIXI.FakeLenseFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.FakeLenseFilter.prototype.constructor = PIXI.FakeLenseFilter;

Object.defineProperty(PIXI.FakeLenseFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/tex07.jpg');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.FakeLenseFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
