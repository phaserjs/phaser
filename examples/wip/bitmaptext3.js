
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('knightHawks', 'assets/fonts/KNIGHT3.png');

}

var font;
var i;

function create() {

    font = game.add.bitmapFont('knightHawks', 31, 25, Phaser.BitmapFont.TEXT_SET6, 10, 1, 1);
    font.text = 'phaser was here';

    for (var c = 0; c < 10; c++)
    {
        var i = game.add.image(0, c * 32, font);
        i.tint = Math.random() * 0xFFFFFF;
    }

    // i.scale.set(2);

    // font.anchor.set(0.5);
    // font.text = 'phaser';

    game.input.onDown.add(change, this);

}

function change() {

    font.text = 'rocking the house';

}

function update() {

	// font.text = "phaser\n\nx: " + game.input.x + "\ny: " + game.input.y;
	// font.text = "phaser x: " + game.input.x + " y: " + game.input.y;

}

function render() {

	// game.debug.renderText("x: " + game.input.x + "\ny: " + game.input.y, 32, 32);
	// game.debug.renderText(font.bmd.width + " x " + font.bmd.height, 32, 64);
	// game.debug.renderText(font.width + " x " + font.height, 32, 96);

}
