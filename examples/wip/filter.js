PIXI.GreyFilter = function()
{
	PIXI.AbstractFilter.call( this );
	
	this.passes = [this];
	
	// set the uniforms
	this.uniforms = {
		grey: {type: 'f', value: 1},
	};
	
	this.OLDfragmentSrc = [
	  "precision mediump float;",
	  "varying vec2 vTextureCoord;",
	  "varying float vColor;",
	  "uniform sampler2D uSampler;",
	  "uniform float grey;",
	  "void main(void) {",
	    "gl_FragColor = texture2D(uSampler, vTextureCoord);",
		"gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), grey);",
	    "gl_FragColor = gl_FragColor * vColor;",
	  "}"
	];





}

PIXI.GreyFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.GreyFilter.prototype.constructor = PIXI.GreyFilter;

/**
The strength of the grey. 1 will make the object black and white, 0 will make the object its normal color
@property grey
*/
Object.defineProperty(PIXI.GreyFilter.prototype, 'grey', {
    get: function() {
        return this.uniforms.grey.value;
    },
    set: function(value) {
    	this.uniforms.grey.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('coke', 'assets/sprites/cokecan.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

function create() {

	game.add.sprite(60, 100, 'atari1');
	game.add.sprite(360, 200, 'coke');

}

function update() {
}

function render() {
}
