PIXI.MetaBallsFilter = function(width, height, texture)
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

	//	Shader by triggerHLM (https://www.shadertoy.com/view/lsfGDH)
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

		"#define stiffness 10.0 // Blobbiness factor (higher = stiffer balls)",
		"#define cfalloff 20.0 // Glow factor (higher = sharper, shorter glow)",

		"void main(void)",
		"{",
			"vec2 uv = gl_FragCoord.xy / iResolution.xy;",

			"// calculate some ball positions (sin is nice for animating)",
			"vec2 ballA = vec2(0.5+0.5*sin(iGlobalTime),0.5+0.5*cos(iGlobalTime));",
			"vec2 ballB = vec2(0.5+0.4*sin(iGlobalTime),0.5+0.4*cos(iGlobalTime*1.3));",
			"vec2 ballC = vec2(0.5+0.4*sin(iGlobalTime*2.0),0.5+0.4*cos(iGlobalTime*1.7));",

			"// calc range-based per-pixel values",
			"// subtract from length to make the ball bigger (every pixel closer)",
			"// clamp to avoid negative distances and fucky values",
			"// invert it so it's closeness to the ball",
			"// raise to power to sharpen the edge of the ball (more sudden falloff from 1.0)",
			"float r1 = pow(1.0-clamp(length(uv-ballA)-0.1,0.0,1.0),stiffness);",
			"float r2 = pow(1.0-clamp(length(uv-ballB)-0.05,0.0,1.0),stiffness);",
			"float r3 = pow(1.0-clamp(length(uv-ballC)-0.025,0.0,1.0),stiffness);",

			"// sum for blobbage!",
			"float v = r1+r2+r3;",

			"// calculate colour",
			"vec3 final = vec3(v,v,v);",
			"final.x = pow(v,cfalloff);",
			"final.y = pow(v,cfalloff);",
			"final.z = pow(v,cfalloff*0.4); // sharpen blue less, for a blue glow",

			"// gimme some pixels baby!",
			"gl_FragColor = vec4(final,1.0);",
		"}"];

}

PIXI.MetaBallsFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.MetaBallsFilter.prototype.constructor = PIXI.MetaBallsFilter;

Object.defineProperty(PIXI.MetaBallsFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.MetaBallsFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
