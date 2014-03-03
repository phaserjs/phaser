
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

}

var text;
var key1;
var key2;

function create() {

	game.stage.setBackgroundColor(0x0b7276);

    game.add.text(32, 16, "SPACE");
    game.add.text(32, 170, "A");

    key1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key2 = game.input.keyboard.addKey(Phaser.Keyboard.A);

}

function update() {

}

function render() {

    game.debug.key(key1, 32, 64);
    game.debug.key(key2, 32, 220);

}
