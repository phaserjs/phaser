
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.bitmapFont('shortStack', 'assets/fonts/bitmapFonts/shortStack.png', 'assets/fonts/bitmapFonts/shortStack.fnt');

}

function create() {

    game.add.bitmapText(32, 32, 'shortStack', 'This font was generated using the\nfree Littera web site\n\nhttp://kvazars.com/littera/', 32);

}
