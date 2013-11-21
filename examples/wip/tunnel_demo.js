
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var background;
var filter;

function preload() {

    game.load.image('texture', 'wip/tex00.jpg');
    game.load.image('sea', 'assets/pics/undersea.jpg');

}

function create() {

	game.add.sprite(0, 0, 'sea');

	background = game.add.sprite(0, 0, 'texture');
	background.width = 800;
	background.height = 600;

	filter = game.add.filter('Tunnel', 800, 600, background.texture);

	// filter.alpha = 0.5;
	// filter.origin = 0.5;

	background.filters = [filter];

}

function update() {

	filter.update();

}
