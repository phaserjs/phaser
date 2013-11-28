
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var background;
var filter;

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser2.png');
    game.load.script('fire', '../filters/Plasma.js');

}

function create() {

	background = game.add.sprite(0, 0);
	background.width = 800;
	background.height = 600;

	filter = game.add.filter('Plasma', 800, 600);

	//	You have the following values to play with (defaults shown below):

	// filter.size = 0.03;
	// filter.redShift = 0.5;
	// filter.greenShift = 0.5;
	// filter.blueShift = 0.9;

	background.filters = [filter];

	var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
	logo.anchor.setTo(0.5, 0.5);

}

function update() {

	filter.update();

	//	Uncomment for coolness :)
	// filter.blueShift -= 0.001;

}
