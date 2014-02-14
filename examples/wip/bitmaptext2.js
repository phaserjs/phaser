
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('goldFont', 'assets/fonts/gold_font.png');
    game.load.image('bluePink', 'assets/fonts/bluepink_font.png');

}

var font1;
var font2;

function create() {

    font1 = game.add.bitmapFont(game.world.centerX, 96, 'goldFont', 16, 16, "!     :() ,?." + Phaser.BitmapFont.TEXT_SET10, 20, 0, 0);
    font1.text = "phaser brings you retro style bitmap fonts";
    font1.anchor.set(0.5);

    font2 = game.add.bitmapFont(game.world.centerX, 300, 'bluePink', 32, 32, Phaser.BitmapFont.TEXT_SET2, 10);
    font2.setText("phaser is\nrocking :)", true, 0, 8, Phaser.BitmapFont.ALIGN_CENTER);
    font2.anchor.set(0.5);

    game.input.onDown.add(change, this);

}

function change() {

    font2.tint = Math.random() * 0xFFFFFF;

}

function update() {

	font2.rotation += 0.03;

}
