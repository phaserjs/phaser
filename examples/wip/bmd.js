
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('pic', 'assets/pics/backscroll.png');

}

var image;
var bmd;

function create() {

	bmd = game.add.bitmapData(800, 600);
	bmd.fillStyle('rgba(255,0,0,0.2)');
	// bmd.fillRect(0, 0, 300, 100);
	// bmd.fillRect(0, 200, 300, 100);

	image = game.add.image(0, 0, bmd);
	// image.anchor.set(0.5);

	game.input.onDown.add(tint, this);

}

function tint() {

	image.tint = Math.random() * 0xFFFFFF;

}

function update() {

	bmd.fillStyle('rgba(255,0,0,0.2)');
	bmd.fillRect(game.input.x, game.input.y, 6, 6);

}

function render() {

	game.debug.renderText(game.input.x, 32, 32);

}
