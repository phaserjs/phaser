
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

	game.load.image('test', 'assets/pics/nanoha_taiken_blue.png');

}

function create() {

	game.stage.backgroundColor = 'rgba(0,0,0,0.3)';

	game.add.sprite(0, 0, 'test');

}
