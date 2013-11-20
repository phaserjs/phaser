PIXI.RotoZoomerFilter = function(width, height, texture)
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
		iChannel0: { type: 'sampler2D', value: texture, wrap: 'nearest-repeat' }
	};

	//	Shader by triggerHLM (https://www.shadertoy.com/view/lsfGDH)
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

		"float     time=iGlobalTime*0.2;",


		"float pi = 3.14159265;",


		"void main( void )",
		"{",

			"vec2 position = vec2(640.0/2.0+640.0/2.0*sin(time*2.0), 360.0/2.0+360.0/2.0*cos(time*3.0));",
			"vec2 position2 = vec2(640.0/2.0+640.0/2.0*sin((time+2000.0)*2.0), 360.0/2.0+360.0/2.0*cos((time+2000.0)*3.0));",


			"vec2 offset = vec2(640.0/2.0, 360.0/2.0) ;",
			"vec2 offset2 = vec2(6.0*sin(time*1.1), 3.0*cos(time*1.1));",

			"vec2 oldPos = (gl_FragCoord.xy-offset);",

			"float angle = time*2.0;",

			"vec2 newPos = vec2(oldPos.x *cos(angle) - oldPos.y *sin(angle),",
			"oldPos.y *cos(angle) + oldPos.x *sin(angle));",


			"newPos = (newPos)*(0.0044+0.004*sin(time*3.0))-offset2;",
			"vec2 temp = newPos;",
			"newPos.x = temp.x + 0.4*sin(temp.y*2.0+time*8.0);",
			"newPos.y = (-temp.y + 0.4*sin(temp.x*2.0+time*8.0));",
			"vec4 final = texture2D(iChannel0,newPos);",
			"//final = texture2D(texCol,gl_FragCoord.xy*vec2(1.0/640, -1.0/360));",
			"gl_FragColor = vec4(final.xyz, 1.0);",

		"}"];


}

PIXI.RotoZoomerFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.RotoZoomerFilter.prototype.constructor = PIXI.RotoZoomerFilter;

Object.defineProperty(PIXI.RotoZoomerFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/tex15.png');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.RotoZoomerFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();
	filter.uniforms.iMouse.value.x = game.input.x;
	filter.uniforms.iMouse.value.y = game.input.y;

}

function render() {
}
