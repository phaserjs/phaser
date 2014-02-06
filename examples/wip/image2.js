
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('pic', 'assets/pics/backscroll.png');

}

var image;
var image2;

function create() {

	image = game.add.image(32, 50, 'pic');

	image2 = game.add.image(32, 250, 'pic');

	game.input.onDown.add(tint, this);

}

function tint() {

	image.tint = Math.random() * 0xFFFFFF;

}

function update() {

	// image.angle += 1;

}

function render() {

	// game.debug.renderText(sprite.position.y, 32, 32);

}
