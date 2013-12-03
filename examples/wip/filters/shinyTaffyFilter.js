PIXI.ShinyTaffyFilter = function(width, height, texture)
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

	//	Shader by huttarl (https://www.shadertoy.com/view/4dXGWr)
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

		"/* What I'd like to do next is treat the color values from the texture",
		"as surface normals, and do diffuse shading accordingly.",
		"Maybe also keep the colors as colors.",
		"To do:",
		"- apply simple averaging or gaussian filter to smooth out the normals",
		"- apply specular reflection */",

		"vec3  s = normalize(vec3(5.0, -1.0, 5.0)); // light direction",
		"float texelSize = 1.0 / 1024.0;",

		"vec3 blur(vec2 uv) {",
		"vec2 x = vec2(texelSize, 0.0);",
		"vec2 y = vec2(0.0, texelSize);",
		"return (texture2D(iChannel0, uv).xyz * 2.0 +",
		"texture2D(iChannel0, uv + x).xyz +",
		"texture2D(iChannel0, uv - x).xyz +",
		"texture2D(iChannel0, uv + y).xyz +",
		"texture2D(iChannel0, uv - y).xyz) * (1.0 / 6.0);",
	"}",

	"void main(void)",
	"{",
		"vec2 uv = gl_FragCoord.xy / iResolution.xx;",
		"vec2 uv2 = uv + vec2(sin(iGlobalTime + uv.y * 10.0) * 0.2,",
		"cos(iGlobalTime + uv.x * 10.0) * 0.2);",

		"vec3 col = texture2D(iChannel0, uv2).xyz;",
		"vec3 n = normalize(blur(uv2) - 0.5);",

		"float dot1 = dot(s, n);",
		"vec3 r = -s + 2.0 * dot1 * n;",
		"float diffuse = max(dot1, 0.0);",

		"vec3 v = normalize(vec3(-uv.x, -uv.y, 2.0)); // viewer angle",
		"float spec = pow(dot(r, v), 16.0);",

		"gl_FragColor = vec4(vec3(0.1 +",
		"col * 0.4 +",
		"diffuse * 0.4 +",
		"spec * 3.0), 1.0);",
	"}"];


}

PIXI.ShinyTaffyFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.ShinyTaffyFilter.prototype.constructor = PIXI.ShinyTaffyFilter;

Object.defineProperty(PIXI.ShinyTaffyFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.ShinyTaffyFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
