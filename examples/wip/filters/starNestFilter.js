PIXI.StarNestFilter = function(width, height, texture)
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

	//	Shader by Kali (https://www.shadertoy.com/view/4dfGDM)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"// add any extra uniforms here",

		"// Star Nest by Pablo Román Andrioli",

		"// This content is under the MIT License.",

		"#define iterations 17",
		"#define formuparam 0.530",

		"#define volsteps 18",
		"#define stepsize 0.100",

		"#define zoom   0.800",
		"#define tile   0.850",
		"#define speed  0.010",

		"#define brightness 0.0015",
		"#define darkmatter 0.300",
		"#define distfading 0.760",
		"#define saturation 0.800",


		"void main(void)",
		"{",
			"//get coords and direction",
			"vec2 uv=gl_FragCoord.xy/iResolution.xy-.5;",
			"uv.y*=iResolution.y/iResolution.x;",
			"vec3 dir=vec3(uv*zoom,1.);",
			"float time=iGlobalTime*speed+.25;",

			"//mouse rotation",
			"float a1=.5+iMouse.x/iResolution.x*2.;",
			"float a2=.8+iMouse.y/iResolution.y*2.;",
			"mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));",
			"mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));",
			"dir.xz*=rot1;",
			"dir.xy*=rot2;",
			"vec3 from=vec3(1.,.5,0.5);",
			"from+=vec3(time*2.,time,-2.);",
			"from.xz*=rot1;",
			"from.xy*=rot2;",

			"//volumetric rendering",
			"float s=0.1,fade=1.;",
			"vec3 v=vec3(0.);",
			"for (int r=0; r<volsteps; r++) {",
			"vec3 p=from+s*dir*.5;",
			"p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold",
			"float pa,a=pa=0.;",
			"for (int i=0; i<iterations; i++) {",
			"p=abs(p)/dot(p,p)-formuparam; // the magic formula",
			"a+=abs(length(p)-pa); // absolute sum of average change",
			"pa=length(p);",
		"}",
		"float dm=max(0.,darkmatter-a*a*.001); //dark matter",
		"a*=a*a; // add contrast",
		"if (r>3) fade*=1.-dm; // dark matter, don't render near",
		"//v+=vec3(dm,dm*.5,0.);",
		"v+=fade;",
		"v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance",
		"fade*=distfading; // distance fading",
		"s+=stepsize;",
	"}",
	"v=mix(vec3(length(v)),v,saturation); //color adjust",
	"gl_FragColor = vec4(v*.01,1.);",

	"}"];

}

PIXI.StarNestFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.StarNestFilter.prototype.constructor = PIXI.StarNestFilter;

Object.defineProperty(PIXI.StarNestFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.StarNestFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
