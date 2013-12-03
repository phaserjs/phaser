PIXI.StarFieldFilter = function(width, height, texture)
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

	//	Shader by Rebb / TRSI (https://www.shadertoy.com/view/XdX3Wn)
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

		"const float tau = 6.28318530717958647692;",

		"// Gamma correction",
		"#define GAMMA (2.2)",

		"vec3 ToLinear( in vec3 col )",
		"{",
			"// simulate a monitor, converting colour values into light values",
			"return pow( col, vec3(GAMMA) );",
		"}",

		"vec3 ToGamma( in vec3 col )",
		"{",
			"// convert back into colour values, so the correct light will come out of the monitor",
			"return pow( col, vec3(1.0/GAMMA) );",
		"}",

		"vec4 Noise( in ivec2 x )",
		"{",
			"return texture2D( iChannel0, (vec2(x)+0.5)/256.0, -100.0 );",
		"}",

		"vec4 Rand( in int x )",
		"{",
			"vec2 uv;",
			"uv.x = (float(x)+0.5)/256.0;",
			"uv.y = (floor(uv.x)+0.5)/256.0;",
			"return texture2D( iChannel0, uv, -100.0 );",
		"}",


		"void main(void)",
		"{",
			"vec3 ray;",
			"ray.xy = 2.0*(gl_FragCoord.xy-iResolution.xy*.5)/iResolution.x;",
			"ray.z = 1.0;",

			"float offset = iGlobalTime*.5;",
			"float speed2 = (cos(offset)+1.0)*2.0;",
			"float speed = speed2+.1;",
			"offset += sin(offset)*.96;",
			"offset *= 2.0;",


			"vec3 col = vec3(0);",

			"vec3 stp = ray/max(abs(ray.x),abs(ray.y));",

			"vec3 pos = 2.0*stp+.5;",
			"for ( int i=0; i < 20; i++ )",
			"{",
				"float z = Noise(ivec2(pos.xy)).x;",
				"z = fract(z-offset);",
				"float d = 50.0*z-pos.z;",
				"float w = pow(max(0.0,1.0-8.0*length(fract(pos.xy)-.5)),2.0);",
				"vec3 c = max(vec3(0),vec3(1.0-abs(d+speed2*.5)/speed,1.0-abs(d)/speed,1.0-abs(d-speed2*.5)/speed));",
				"col += 1.5*(1.0-z)*c*w;",
				"pos += stp;",
			"}",

			"gl_FragColor = vec4(ToGamma(col),1.0);",
		"}"];

}

PIXI.StarFieldFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.StarFieldFilter.prototype.constructor = PIXI.StarFieldFilter;

Object.defineProperty(PIXI.StarFieldFilter.prototype, 'iGlobalTime', {
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
    game.load.image('texture', 'wip/tex16.png');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.StarFieldFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
