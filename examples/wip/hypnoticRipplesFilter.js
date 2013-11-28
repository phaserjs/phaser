PIXI.HypnoticRipplesFilter = function(width, height, texture)
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
		iChannel0: { type: 'sampler2D', value: texture }
	};

	//	Shader by Cha (https://www.shadertoy.com/view/ldX3zr)
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


		"vec2 center = vec2(0.5,0.5);",
		"float speed = 0.035;",
		"float invAr = iResolution.y / iResolution.x;",

		"void main(void)",
		"{",
			"vec2 uv = gl_FragCoord.xy / iResolution.xy;",

			"vec3 col = vec4(uv,0.5+0.5*sin(iGlobalTime),1.0).xyz;",

			"vec3 texcol;",

			"float x = (center.x-uv.x);",
			"float y = (center.y-uv.y) *invAr;",

			"//float r = -sqrt(x*x + y*y); //uncoment this line to symmetric ripples",
			"float r = -(x*x + y*y);",
			"float z = 1.0 + 0.5*sin((r+iGlobalTime*speed)/0.013);",

			"texcol.x = z;",
			"texcol.y = z;",
			"texcol.z = z;",

			"gl_FragColor = vec4(col*texcol,1.0);",
			"//gl_FragColor = vec4(texcol,1.0);",
		"}"];



}

PIXI.HypnoticRipplesFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.HypnoticRipplesFilter.prototype.constructor = PIXI.HypnoticRipplesFilter;

Object.defineProperty(PIXI.HypnoticRipplesFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.HypnoticRipplesFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
