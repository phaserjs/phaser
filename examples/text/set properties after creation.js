
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml');

}

var bpmText;
var count = 0;

function create() {

    bmpText = game.add.bitmapText(0, 100, 'desyrel',"I'm growing",64);

}

function update() {

	count++;

	if(bmpText.fontSize < 250){
		bmpText.fontSize += 1;
	}

	

}
