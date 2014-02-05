PIXI.FlameFilter = function(width, height)
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
		iGlobalTime: { type: 'f', value: 1 },
		iDate: { type: 'f4', value: dates }
	};

	//	This shader by XT95 (https://www.shadertoy.com/view/MdX3zr)
	this.fragmentSrc = [

		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"// add any extra uniforms here",

		"float noise(vec3 p) //Thx to Las^Mercury",
		"{",
			"vec3 i = floor(p);",
			"vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);",
			"vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;",
			"a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);",
			"a.xy = mix(a.xz, a.yw, f.y);",
			"return mix(a.x, a.y, f.z);",
		"}",

		"//-----------------------------------------------------------------------------",
		"// Scene/Objects",
		"//-----------------------------------------------------------------------------",
		"float sphere(vec3 p, vec4 spr)",
		"{",
			"return length(spr.xyz-p) - spr.w;",
		"}",

		"float fire(vec3 p)",
		"{",
			"float d= sphere(p*vec3(1.,.5,1.), vec4(.0,-1.,.0,1.));",
			"return d+(noise(p+vec3(.0,iGlobalTime*2.,.0))+noise(p*3.)*.5)*.25*(p.y) ;",
		"}",
		"//-----------------------------------------------------------------------------",
		"// Raymarching tools",
		"//-----------------------------------------------------------------------------",
		"float scene(vec3 p)",
		"{",
			"return min(100.-length(p) , abs(fire(p)) );",
		"}",

		"vec4 Raymarche(vec3 org, vec3 dir)",
		"{",
			"float d=0.0;",
			"vec3  p=org;",
			"float glow = 0.0;",
			"float eps = 0.02;",
			"bool glowed=false;",
			"for(int i=0; i<64; i++)",
			"{",
				"d = scene(p) + eps;",
				"p += d * dir;",
				"if( d>eps )",
				"{",
					"if( fire(p) < .0)",
					"glowed=true;",
					"if(glowed)",
					"glow = float(i)/64.;",
				"}",
			"}",
			"return vec4(p,glow);",
		"}",

		"//-----------------------------------------------------------------------------",
		"// Main functions",
		"//-----------------------------------------------------------------------------",

		"void main()",
		"{",
			"vec2 v = -1.0 + 2.0 * gl_FragCoord.xy / iResolution.xy;",
			"v.x *= iResolution.x/iResolution.y;",
			"vec3 org = vec3(0.,-2.,4.);",
			"vec3 dir   = normalize(vec3(v.x*1.6,-v.y,-1.5));",
			"vec4 p = Raymarche(org,dir);",
			"float glow = p.w;",
			"gl_FragColor = mix(vec4(0.), mix(vec4(1.,.5,.1,1.),vec4(0.1,.5,1.,1.),p.y*.02+.4), pow(glow*2.,4.));",
			"//gl_FragColor = mix(vec4(1.), mix(vec4(1.,.5,.1,1.),vec4(0.1,.5,1.,1.),p.y*.02+.4), pow(glow*2.,4.));",

		"}"

	];

}

PIXI.FlameFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.FlameFilter.prototype.constructor = PIXI.FlameFilter;

Object.defineProperty(PIXI.FlameFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('texture', 'wip/64x64.png');

}

var stars;
var flame;

function create() {

	flame = game.add.sprite(0, 0, 'texture');
	flame.scale.setTo(10, 10);

	stars = new PIXI.FlameFilter(flame.width, flame.height);

	flame.filters = [stars];

}

function update() {

	stars.iGlobalTime = game.time.totalElapsedSeconds();

}
