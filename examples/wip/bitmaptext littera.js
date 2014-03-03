
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.bitmapFont('shortStack', 'assets/fonts/bitmapFonts/shortStack.png', 'assets/fonts/bitmapFonts/shortStack.fnt');

}

var text;

function create() {

    text = game.add.bitmapText(100, 100, 'shortStack', 'Bitmap Fonts\nfrom Littera', 64);

}

function update() {

}
