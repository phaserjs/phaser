
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('knightHawks', 'assets/fonts/KNIGHT3.png');

}

var font;

function create() {

    font = game.add.bitmapFont(game.world.centerX, 300, 'knightHawks', 31, 25, Phaser.BitmapFont.TEXT_SET6, 10, 1, 1);
    font.anchor.set(0.5);

    // font.text = 'phaser';

    game.input.onDown.add(change, this);

}

function change() {

    font.tint = Math.random() * 0xFFFFFF;

}

function update() {

	// font.text = "phaser\n\nx: " + game.input.x + "\ny: " + game.input.y;
	font.text = "phaser x: " + game.input.x + " y: " + game.input.y;

}

function render() {

	game.debug.renderText("x: " + game.input.x + "\ny: " + game.input.y, 32, 32);
	game.debug.renderText(font.bmd.width + " x " + font.bmd.height, 32, 64);
	game.debug.renderText(font.width + " x " + font.height, 32, 96);

}
