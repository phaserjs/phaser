PIXI.RayTracedBallsFilter = function(width, height, texture)
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

	//	Shader by benito_luna (https://www.shadertoy.com/view/MdX3Ws)
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

		"precision highp float;",
		"precision highp int;",

		"const float PI = 3.14159265359;",

		"int T(vec3 o,vec3 d, out float t, out vec3 n){",

		"t=10000.;",
		"int m=0;",
		"float p=-o.z/d.z;",
		"if(.01<p)",
		"{",
			"t=p;",
			"n=vec3(0,0,1);",
			"m=1;",
		"}",

		"//The world is encoded in G, with 9 lines and 19 columns",

		"//     for(i k=19;k--;)  //For each columns of objects",
		"//   for(i j=9;j--;)   //For each line on that columns",

		"// if(G[j]&1<<k){ //For this line j, is there a sphere at column i ?",

		"// There is a sphere but does the ray hits it ?",



		"const int numSpheres = 3;",
		"vec2 spheres[numSpheres];",
		"for (int i = 0; i<numSpheres; i++)",
		"{",
			"spheres[i].x = 8.*float(i);",
			"spheres[i].y = 3.*sin(iGlobalTime+float(i)*PI/3.);",
		"}",

		"for (int i = 0;i<numSpheres; i++)",
		"{",
			"vec3 p2=o+vec3(-spheres[i].x,0.,-spheres[i].y-4.);",
			"float b=dot(p2,d);",
			"float c= dot(p2,p2) - 1.;",
			"float q = b*b-c;",

			"//Does the ray hit the sphere ?",
			"if(q>0.){",
			"//It does, compute the distance camera-sphere",
			"float s=-b-sqrt(q);",

			"if(s<t && s>.01)",
			"{",
				"// So far this is the minimum distance, save it. And also",
				"// compute the bouncing ray vector into 'n'",
				"t=s,",
				"n=normalize(p2+d*t),",
				"m=2;",
			"}",
		"}",
	"}",
	"return m;",
	"}",

	"const float PI_2_DIV_3 = 1.0471975512;",

	"vec3 S(in vec3 o,in vec3 d, vec2 uv)",
	"{",
	"float t;",
	"vec3 n;",

	"vec3 cumulated_color = vec3(0.);",

	"//Search for an intersection ray Vs World.",
	"int m=T(o,d,t,n);",
	"float attenuationFactor = 1.0;",

	"float f = 0.;",
	"for(int i = 0; i<3; i++) //Max recursivity - 3 bounces",
	"{",
		"if(0==m) // m==0",
		"{",
			"return ( cumulated_color + attenuationFactor * vec3(.7,.6,1)*pow(1.-d.z,4.));",
		"}",

		"vec3 h = o+d*t;                    // h = intersection coordinate",
		"vec3 l = normalize(vec3(9.,9.,16.)+h*-1.);  // 'l' = direction to light (with random delta for soft-shadows).",
		"vec3 r = d+n*(dot(n,d)*-2.);               // r = The half-vector",

		"//Calculated the lambertian factor",
		"float b=dot(l,n);",

		"//Calculate illumination factor (lambertian coefficient > 0 or in shadow)?",
		"if(b<0.||T(h,l,t,n) !=0)",
		"b=0.;",

		"// Calculate the color 'p' with diffuse and specular component",
		"float p= 0.;",
		"if (b!=0.)",
		"{",
			"p = pow(dot(l,r),99.);",
		"}",

		"if(m==1){",

		"h=h*.2; //No sphere was hit and the ray was going downward: Generate a floor color",
		"float cond =  (float(ceil(h.x + iGlobalTime)+ceil(h.y+iGlobalTime)));",
		"//if odd",
		"if (fract(cond/2.) == 0.)",
		"return (cumulated_color+attenuationFactor *vec3(3.,1.,1.)*(b*0.2+0.1));",
		"else",
		"return (cumulated_color+attenuationFactor*vec3(3.,3.,3.)*(b*0.2+0.1));",
	"}",
	"cumulated_color += attenuationFactor*vec3(p);",
	"attenuationFactor *= 0.5;",
	"o = h;",
	"d = r;",
	"m=T(h,r,t,n);",
	"f++;",
	"}",
	"return vec3(0.0);",
	"}",

	"const float inv_256 = 0.00390625;",


	"void main(void)",
	"{",
	"vec2 uv = gl_FragCoord.xy / iResolution.xy; //some optimization here to do",
	"vec3 g=normalize(vec3(-6.,-16.,0.));       // Camera direction",
	"vec3  a=normalize(cross(g,vec3(0.,0.,1.)))*.002; // Camera up vector...Seem Z is pointing up :/ WTF !",
	"vec3  b=normalize(cross(a,g))*.002;        // The right vector, obtained via traditional cross-product",
	"vec3  c=(a+b)*-256.+g;",
	"vec3 p= vec3(13,13,13);     // Default pixel color is almost pitch black",
	"highp vec3 t=a*0.5*99.+b*0.5*99.;",
	"p=64.*S(vec3(17.,16.,8.)+t,normalize(t*-1.+(a*(gl_FragCoord.x)+b*(gl_FragCoord.y)+c)*16.), uv)*3.5+p; // +p for color accumulation",
	"gl_FragColor = vec4(p * inv_256,1.0);",

	"}"];	


}

PIXI.RayTracedBallsFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.RayTracedBallsFilter.prototype.constructor = PIXI.RayTracedBallsFilter;

Object.defineProperty(PIXI.RayTracedBallsFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.RayTracedBallsFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
