
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('knightHawks', 'assets/fonts/retroFonts/KNIGHT3.png');

}

var font;

function create() {

    font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
    font.text = 'phaser was here';

    for (var c = 0; c < 19; c++)
    {
        var i = game.add.image(game.world.centerX, c * 32, font);
        i.tint = Math.random() * 0xFFFFFF;
        i.anchor.set(0.5, 1);
    }

}

function update() {

	font.text = "phaser x: " + game.input.x + " y: " + game.input.y;

}
