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

	//	Shader by Trisomie21 (https://www.shadertoy.com/view/MslGRH)
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

		"// With tweaks by PauloFalcao",

		"float Texture3D(vec3 n, float res){",
		"n = floor(n*res+.5);",
		"return fract(sin((n.x+n.y*1e5+n.z*1e7)*1e-4)*1e5);",
	"}",

	"float map( vec3 p ){",
	"p.x+=sin(p.z*4.0+iGlobalTime*4.0)*0.1*cos(iGlobalTime*0.1);",
	"p = mod(p,vec3(1.0, 1.0, 1.0))-0.5;",
	"return length(p.xy)-.1;",
	"}",

	"void main( void )",
	"{",
	"vec2 pos = (gl_FragCoord.xy*2.0 - iResolution.xy) / iResolution.y;",
	"vec3 camPos = vec3(cos(iGlobalTime*0.3), sin(iGlobalTime*0.3), 1.5);",
	"vec3 camTarget = vec3(0.0, 0.0, 0.0);",

	"vec3 camDir = normalize(camTarget-camPos);",
	"vec3 camUp  = normalize(vec3(0.0, 1.0, 0.0));",
	"vec3 camSide = cross(camDir, camUp);",
	"float focus = 2.0;",

	"vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);",
	"vec3 ray = camPos;",
	"float d = 0.0, total_d = 0.0;",
	"const int MAX_MARCH = 100;",
	"const float MAX_DISTANCE = 5.0;",
	"float c = 1.0;",
	"for(int i=0; i<MAX_MARCH; ++i) {",
	"d = map(ray);",
	"total_d += d;",
	"ray += rayDir * d;",
	"if(abs(d)<0.001) { break; }",
	"if(total_d>MAX_DISTANCE) { c = 0.; total_d=MAX_DISTANCE; break; }",
	"}",

	"float fog = 5.0;",
	"vec4 result = vec4( vec3(c*.4 , c*.6, c) * (fog - total_d) / fog, 1.0 );",

	"ray.z -= 5.+iGlobalTime*.5;",
	"float r = Texture3D(ray, 33.);",
	"gl_FragColor = result*(step(r,.3)+r*.2+.1);",
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
