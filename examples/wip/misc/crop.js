
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');

}

var atari;

function create() {

	atari = game.add.sprite(300, 300, 'atari1');

	// atari.crop = new Phaser.Rectangle(0, 0, 10, atari.height);

}

function update() {

	atari.crop.width -= 1;

}
