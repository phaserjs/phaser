
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/desyrel.xml', null, 0, -32);
    game.load.bitmapFont('carrier', 'assets/fonts/bitmapFonts/carrier_command.png', 'assets/fonts/carrier_command.xml', null, 0, 24);

}

var text;
var text2;

function create() {

    text = game.add.bitmapText(100, 100, 'carrier', 'Phaser and Pixi\nrocking!', 32);

    text2 = game.add.bitmapText(100, 300, 'desyrel', 'Phaser & Pixi\nrocking!', 64);

    game.input.onDown.add(change, this);

}

function change() {

	text.align = 'center';
    text2.tint = Math.random() * 0xFFFFFF;

}

function update() {

    // text.text = 'Phaser & Pixi\nrocking!\n' + Math.round(game.time.now);

}
