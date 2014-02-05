PIXI.ColorWaveFilter = function(width, height, texture)
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
		resolution: { type: 'f2', value: { x: width, y: height }},
		mouse: { type: 'f2', value: { x: 0, y: 0 }},
		time: { type: 'f', value: 1 }
	};

	//	http://glsl.heroku.com/e#12257.0
	
	//	Heroku shader conversion

	this.fragmentSrc = [
		"precision mediump float;",

		"// bars - thygate@gmail.com",
		"// rotation and color mix modifications by malc (mlashley@gmail.com)",
		"// modified by @hintz 2013-04-30",
		"#ifdef GL_ES",
		"precision mediump float;",
		"#endif",
		"uniform float time;",
		"uniform vec2 mouse;",
		"uniform vec2 resolution;",
		"vec2 position;",
		"float c = cos(time*0.0);",
		"float s = sin(time*0.0);",
		"mat2 R = mat2(c,-s,s,c);",
		"float barsize = 0.15;",
		"float barsangle = 1.0*sin(0.05);",
		"vec4 bar(float pos, float r, float g, float b)",
		"{",
			"return max(0.0, 1.0 - abs(pos - position.y + 0.1*sin(2.0*time+sin(1.0-pos*2.0)*4.0*position.x)) / barsize) * vec4(r, g, b, 1.0);",
		"}",
		"void main(void)",
		"{",
			"position = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.xx;",
			"position = 4.0*position * R;",
			"float t = time*0.0;",
			"vec4 color = bar(sin(t), 1.0, 0.0, 0.0);",
			"color += bar(sin(t+barsangle*2.), 1.0, 0.5, 0.0);",
			"color += bar(sin(t+barsangle*4.), 1.0, 1.0, 0.0);",
			"color += bar(sin(t+barsangle*6.), 0.0, 1.0, 0.0);",
			"color += bar(sin(t+barsangle*8.), 0.0, 1.0, 1.0);",
			"color += bar(sin(t+barsangle*10.), 0.0, 0.0, 1.0);",
			"color += bar(sin(t+barsangle*12.), 0.5, 0.0, 1.0);",
			"color += bar(sin(t+barsangle*14.), 1.0, 0.0, 1.0);",
			"gl_FragColor = color;",
			"gl_FragColor.a = 1.0;",
		"}"];



}

PIXI.ColorWaveFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.ColorWaveFilter.prototype.constructor = PIXI.ColorWaveFilter;

Object.defineProperty(PIXI.ColorWaveFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.time.value;
    },
    set: function(value) {
    	this.uniforms.time.value = value;
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

	filter = new PIXI.ColorWaveFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.mouse.value.x = game.input.x;
	filter.uniforms.mouse.value.y = game.input.y;

}

function render() {
}
