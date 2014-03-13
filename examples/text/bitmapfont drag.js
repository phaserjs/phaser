
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.bitmapFont('carrier_command', 'assets/fonts/bitmapFonts/carrier_command.png', 'assets/fonts/bitmapFonts/carrier_command.xml');

}

var bpmText;

function create() {

    bmpText = game.add.bitmapText(10, 100, 'carrier_command','Drag me around !',34);

    bmpText.inputEnabled = true;

    bmpText.input.enableDrag();

}

