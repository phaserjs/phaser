
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('font', 'assets/fonts/gold_font.png');

}

var font;

function create() {

    // text = game.add.bitmapText(100, 100, 'carrier', 'Phaser and Pixi\nrocking!', 32);

    font = new Phaser.BitmapFont(game, 'font', 16, 16, "!     :() ,?." + Phaser.BitmapFont.TEXT_SET10, 20, 0, 0);

    font.text = "using bitmap fonts rocks";

    game.world.add(font);

			// font = new FlxBitmapFont(AssetsRegistry.goldFontPNG, 16, 16, "!     :() ,?." + FlxBitmapFont.TEXT_SET10, 20, 0, 0);
			// font.setText("using bitmap fonts\nin flixel is", true, 0, 8, FlxBitmapFont.ALIGN_CENTER, false);


    // game.input.onDown.add(change, this);

}

function change() {

	// text.align = 'center';
 //    text2.tint = Math.random() * 0xFFFFFF;

}

function update() {

    // text.text = 'Phaser & Pixi\nrocking!\n' + Math.round(game.time.now);

}
