PIXI.RetroPlasmaFilter = function(width, height)
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

	// Oldskool plasm shader. (c) Victor Korsun, bitekas@gmail.com; 1996-2013.
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"// add any extra uniforms here",

		"// Oldskool plasm shader. (c) Victor Korsun, bitekas@gmail.com; 1996-2013.",
		"//",
		"// Attribution-ShareAlike CC License.",

		"//----------------",
		"const int ps = 10; // use values > 1..10 for oldskool",
		"//----------------",


		"void main(void)",
		"{",
			"float x = gl_FragCoord.x / iResolution.x * 640.;",
			"float y = gl_FragCoord.y / iResolution.y * 480.;",

			"if (ps > 0)",
			"{",
				"x = float(int(x / float(ps)) * ps);",
				"y = float(int(y / float(ps)) * ps);",
			"}",

			"float mov0 = x+y+sin(iGlobalTime)*10.+sin(x/90.)*70.+iGlobalTime*2.;",
			"float mov1 = (mov0 / 5. + sin(mov0 / 30.))/ 10. + iGlobalTime * 3.;",
			"float mov2 = mov1 + sin(mov1)*5. + iGlobalTime*1.0;",
			"float cl1 = sin(sin(mov1/4. + iGlobalTime)+mov1);",
			"float c1 = cl1 +mov2/2.-mov1-mov2+iGlobalTime;",
			"float c2 = sin(c1+sin(mov0/100.+iGlobalTime)+sin(y/57.+iGlobalTime/50.)+sin((x+y)/200.)*2.);",
			"float c3 = abs(sin(c2+cos((mov1+mov2+c2) / 10.)+cos((mov2) / 10.)+sin(x/80.)));",

			"float dc = float(16-ps);",

			"if (ps > 0)",
			"{",
				"cl1 = float(int(cl1*dc))/dc;",
				"c2 = float(int(c2*dc))/dc;",
				"c3 = float(int(c3*dc))/dc;",
			"}",

			"gl_FragColor = vec4( cl1,c2,c3,1.0);",
		"}"];

}

PIXI.RetroPlasmaFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.RetroPlasmaFilter.prototype.constructor = PIXI.RetroPlasmaFilter;

Object.defineProperty(PIXI.RetroPlasmaFilter.prototype, 'iGlobalTime', {
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

	filter = new PIXI.RetroPlasmaFilter(sprite.width, sprite.height);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
