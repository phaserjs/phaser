PIXI.Plasma3DFilter = function(width, height)
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
		iDate: { type: '4fv', value: dates }
	};

	//	Shader by Optimus (https://www.shadertoy.com/view/Mss3zn)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"// add any extra uniforms here",

		"// Dark Chocolate Cave Plasma by Optimus",

		"#ifdef GL_ES",
		"precision mediump float;",
		"#endif",

		"float time;",
		"vec2 mouse;",
		"vec2 resolution;",

		"const int iters = 256;",

		"const float origin_z = 0.0;",
		"const float plane_z = 4.0;",
		"const float far_z = 64.0;",

		"const float step = (far_z - plane_z) / float(iters) * 0.025;",

		"const float color_bound = 0.0;",
		"const float upper_bound = 1.0;",

		"const float scale = 32.0;",

		"const float disp = 0.25;",

		"float calc_this(vec3 p, float disx, float disy, float disz)",
		"{",
			"float c = sin(sin((p.x + disx) * sin(sin(p.z + disz)) + time) + sin((p.y + disy) * cos(p.z + disz) + 2.0 * time) + sin(3.0*p.z + disz + 3.5 * time) + sin((p.x + disx) + sin(p.y + disy + 2.5 * (p.z + disz - time) + 1.75 * time) - 0.5 * time));",
			"return c;",
		"}",

		"vec3 get_intersection()",
		"{",
			"vec2 position = (gl_FragCoord.xy / resolution.xy - 0.5) * scale;",

			"vec3 pos = vec3(position.x, position.y, plane_z);",
			"vec3 origin = vec3(0.0, 0.0, origin_z);",

			"vec3 dir = pos - origin;",
			"vec3 dirstep = normalize(dir) * step;",

			"dir = normalize(dir) * plane_z;",


			"float c;",

			"for (int i=0; i<iters; i++)",
			"{",
				"c = calc_this(dir, 0.0, 0.0, 0.0);",

				"if (c > color_bound)",
				"{",
					"break;",
				"}",

				"dir = dir + dirstep;",
			"}",

			"return dir;",
		"}",


		"void main()",
		"{",
			"time = iGlobalTime;",
			"mouse = vec2(iMouse);",
			"resolution = vec2(iResolution);",

			"vec3 p = get_intersection();",
			"float dx = color_bound - calc_this(p, disp, 0.0, 0.0);",
			"float dy = color_bound - calc_this(p, 0.0, disp, 0.0);",

			"vec3 du = vec3(disp, 0.0, dx);",
			"vec3 dv = vec3(0.0, disp, dy);",
			"vec3 normal = normalize(cross(du, dv));",

			"vec3 light = normalize(vec3(0.0, 0.0, 1.0));",
			"float l = dot(normal, light);",

			"float cc = pow(l, 2.0);",
			"gl_FragColor = vec4(cc*0.8, cc*0.5, cc*0.8, cc);",
		"}"];

}

PIXI.Plasma3DFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.Plasma3DFilter.prototype.constructor = PIXI.Plasma3DFilter;

Object.defineProperty(PIXI.Plasma3DFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/64x64.png');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.Plasma3DFilter(sprite.width, sprite.height);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
