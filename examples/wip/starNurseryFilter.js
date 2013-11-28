PIXI.StarNurseryFilter = function(width, height, texture)
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

	//	Shader by Dave Hoskins (https://www.shadertoy.com/view/XsfGzH)
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

		"// Built from the basics of'Clouds' Created by inigo quilez - iq/2013",
		"// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.",

		"// Edited by Dave Hoskins into Star Nursery",
		"// V.1.1 Some speed up in the ray-marching loop.",
		"// V.1.2 Added Shadertoy's fast 3D noise for better, smaller step size.",

		"mat3 m = mat3( 0.00,  0.90,  0.60,",
		"-0.90,  0.36, -0.48,",
		"-0.60, -0.48,  0.34 );",
		"float time = iGlobalTime+46.0;",

		"//----------------------------------------------------------------------",
		"float hash( float n )",
		"{",
			"return fract(sin(n)*43758.5453123);",
		"}",

		"//----------------------------------------------------------------------",
		"float noise( in vec2 x )",
		"{",
			"vec2 p = floor(x);",
			"vec2 f = fract(x);",

			"f = f*f*(3.0-2.0*f);",

			"float n = p.x + p.y*57.0;",

			"float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),",
			"mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);",

			"return res;",
		"}",

		"//----------------------------------------------------------------------",
		"float noise( in vec3 x )",
		"{",
			"vec3 p = floor(x);",
			"vec3 f = fract(x);",
			"f = f*f*(3.0-2.0*f);",

			"vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;",
			"vec2 rg = texture2D( iChannel0, (uv+ 0.5)/256.0, -100.0 ).yx;",
			"return mix( rg.x, rg.y, f.z );",
		"}",

		"//----------------------------------------------------------------------",
		"float fbm( vec3 p )",
		"{",
			"float f;",
			"f  = 1.600*noise( p ); p = m*p*2.02;",
			"f += 0.3500*noise( p ); p = m*p*2.33;",
			"f += 0.2250*noise( p ); p = m*p*2.01;",
			"f += 0.0825*noise( p ); p = m*p*2.01;",
			"return f;",
		"}",

		"//----------------------------------------------------------------------",
		"vec4 map( in vec3 p )",
		"{",
			"float d = 0.01- p.y;",

			"float f= fbm( p*1.0 - vec3(.4,0.3,-0.3)*time);",
			"d += 4.0 * f;",

			"d = clamp( d, 0.0, 1.0 );",

			"vec4 res = vec4( d );",
			"res.w = pow(res.y, .1);",

			"res.xyz = mix( .7*vec3(1.0,0.4,0.2), vec3(0.2,0.0,0.2), res.y * 1.);",
			"res.xyz = res.xyz + pow(abs(.95-f), 26.0) * 1.85;",
			"return res;",
		"}",


		"//----------------------------------------------------------------------",
		"vec3 sundir = vec3(1.0,0.4,0.0);",
		"vec4 raymarch( in vec3 ro, in vec3 rd )",
		"{",
			"vec4 sum = vec4(0, 0, 0, 0);",

			"float t = 0.0;",
			"vec3 pos = vec3(0.0, 0.0, 0.0);",
			"for(int i=0; i<100; i++)",
			"{",
				"if (sum.a > 0.8 || pos.y > 9.0 || pos.y < -2.0) continue;",
				"pos = ro + t*rd;",

				"vec4 col = map( pos );",

				"// Accumulate the alpha with the colour...",
				"col.a *= 0.08;",
				"col.rgb *= col.a;",

				"sum = sum + col*(1.0 - sum.a);",
				"t += max(0.1,0.04*t);",
			"}",
			"sum.xyz /= (0.003+sum.w);",

			"return clamp( sum, 0.0, 1.0 );",
		"}",

		"//----------------------------------------------------------------------",
		"void main(void)",
		"{",
			"vec2 q = gl_FragCoord.xy / iResolution.xy;",
			"vec2 p = -1.0 + 2.0*q;",
			"p.x *= iResolution.x/ iResolution.y;",
			"vec2 mo = (-1.0 + 2.0 + iMouse.xy) / iResolution.xy;",

			"// Camera code...",
			"vec3 ro = 5.6*normalize(vec3(cos(2.75-3.0*mo.x), .4-1.3*(mo.y-2.4), sin(2.75-2.0*mo.x)));",
			"vec3 ta = vec3(.0, 5.6, 2.4);",
			"vec3 ww = normalize( ta - ro);",
			"vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));",
			"vec3 vv = normalize(cross(ww,uu));",
			"vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );",

			"// Ray march into the clouds adding up colour...",
			"vec4 res = raymarch( ro, rd );",


			"float sun = clamp( dot(sundir,rd), 0.0, 2.0 );",
			"vec3 col = mix(vec3(.3,0.0,0.05), vec3(0.2,0.2,0.3), sqrt(max(rd.y, 0.001)));",
			"col += .4*vec3(.4,.2,0.67)*sun;",
			"col = clamp(col, 0.0, 1.0);",
			"col += 0.43*vec3(.4,0.4,0.2)*pow( sun, 21.0 );",

			"// Do the stars...",
			"float v = 1.0/( 2. * ( 1. + rd.z ) );",
			"vec2 xy = vec2(rd.y * v, rd.x * v);",
			"float s = noise(rd.xz*134.);",
			"s += noise(rd.xz*370.);",
			"s += noise(rd.xz*870.);",
			"s = pow(s,19.0) * 0.00000001 * max(rd.y, 0.0);",
			"if (s > 0.0)",
			"{",
				"vec3 backStars = vec3((1.0-sin(xy.x*20.0+time*13.0*rd.x+xy.y*30.0))*.5*s,s, s);",
				"col += backStars;",
			"}",

			"// Mix in the clouds...",
			"col = mix( col, res.xyz, res.w*1.3);",

			"#define CONTRAST 1.1",
			"#define SATURATION 1.15",
			"#define BRIGHTNESS 1.03",
			"col = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), col*BRIGHTNESS)), col*BRIGHTNESS, SATURATION), CONTRAST);",

			"gl_FragColor = vec4( col, 1.0 );",
		"}"];



}

PIXI.StarNurseryFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.StarNurseryFilter.prototype.constructor = PIXI.StarNurseryFilter;

Object.defineProperty(PIXI.StarNurseryFilter.prototype, 'iGlobalTime', {
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
    game.load.image('texture', 'wip/tex12.png');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.StarNurseryFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
