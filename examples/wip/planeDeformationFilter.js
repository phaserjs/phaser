PIXI.PlaneDeformationFilter = function(width, height, texture)
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
		iChannel0: { type: 'sampler2D', value: texture, textureData: { repeat: true } }
	};

	//	Shader by cce (https://www.shadertoy.com/view/XsXGWM)

// "vec4 blips = texture2D(iChannel1, maa);",
// "vec4 mixer = texture2D(iChannel1, maa2);",

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

		"void main(void)",
		"{",
			"float t = iGlobalTime;",

			"/*",
			"float ang = t;",
			"mat2 rotation = mat2(cos(ang), sin(ang),",
			"-sin(ang), cos(ang));",
			"*/",

			"vec2 uv = gl_FragCoord.xy / iResolution.xy;",
			"vec2 texcoord = gl_FragCoord.xy / vec2(iResolution.y);",

			"texcoord.y -= t*0.2;",

			"float zz = 1.0/(1.0-uv.y*1.7);",
			"texcoord.y -= zz * sign(zz);",

			"vec2 maa = texcoord.xy * vec2(zz, 1.0) - vec2(zz, 0.0) ;",
			"vec2 maa2 = (texcoord.xy * vec2(zz, 1.0) - vec2(zz, 0.0))*0.3 ;",
			"vec4 stone = texture2D(iChannel0, maa);",
			"vec4 blips = texture2D(iChannel0, maa);",
			"vec4 mixer = texture2D(iChannel0, maa2);",

			"float shade = abs(1.0/zz);",

			"vec3 outp = mix(shade*stone.rgb, mix(1.0, shade, abs(sin(t+maa.y-sin(maa.x))))*blips.rgb, min(1.0, pow(mixer.g*2.1, 2.0)));",
			"gl_FragColor = vec4(outp,1.0);",
		"}"];

}

PIXI.PlaneDeformationFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.PlaneDeformationFilter.prototype.constructor = PIXI.PlaneDeformationFilter;

Object.defineProperty(PIXI.PlaneDeformationFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/tex03.jpg');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.PlaneDeformationFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
