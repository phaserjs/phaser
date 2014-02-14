
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');
    game.load.bitmapFont('carrier', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');

}

var text;
var text2;

function create() {

    text = game.add.bitmapText(200, 100, 'carrier', 'Phaser & Pixi\nrocking!', 32);
    text2 = game.add.bitmapText(200, 300, 'desyrel', 'Phaser & Pixi\nrocking!', 32);

    // text.tint = Math.random() * 0xFFFFFF;
    game.input.onDown.add(change, this);

}

function change() {

	text.fontSize++;

}

function update() {

    // text.text = 'Phaser & Pixi\nrocking!\n' + Math.round(game.time.now);

}
