
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml');

}

var bmpText;

function create() {

    bmpText = game.add.bitmapText(200, 100, 'desyrel', 'Phaser & Pixi\nrocking!', 64);

}

function update() {

    bmpText.text = 'Phaser & Pixi\nrocking!\n' + Math.round(game.time.now);

}
