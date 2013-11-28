
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

var background;
var filter;

function preload() {

    game.load.image('s', 'assets/pics/undersea.jpg');
    game.load.image('phaser', 'assets/sprites/phaser.png');
    game.load.script('filter', '../filters/CheckerWave.js');

}

function create() {

	game.add.sprite(0, 0, 's');

	background = game.add.sprite(0, 0);
	background.width = 800;
	background.height = 600;

	filter = game.add.filter('CheckerWave', 800, 600);
	filter.alpha = 0.2;

	background.filters = [filter];

	var logo = game.add.sprite(game.world.centerX, 100, 'phaser');
	logo.anchor.setTo(0.5, 0.5);

}

function update() {

	filter.update();

}
