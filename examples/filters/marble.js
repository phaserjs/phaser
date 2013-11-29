
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

var background;
var filter;

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser2.png');
    game.load.script('filter', '../filters/Marble.js');

}

function create() {

	var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
	logo.anchor.setTo(0.5, 0.5);

	background = game.add.sprite(0, 0);
	background.width = 800;
	background.height = 600;

	filter = game.add.filter('Marble', 800, 600);
	filter.alpha = 0.2;

	//	The following properties are available (shown at default values)

	//	filter.speed = 10.0;
	//	filter.intensity = 0.30;

	background.filters = [filter];

}

function update() {

	filter.update();

}
