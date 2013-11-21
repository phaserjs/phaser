
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var background;
var filter;

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser2.png');

}

function create() {

	var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
	logo.anchor.setTo(0.5, 0.5);

	background = game.add.sprite(0, 0);
	background.width = 800;
	background.height = 600;

	filter = game.add.filter('ColorBars', 800, 600);

	filter.alpha = 0.0;

	background.filters = [filter];


}

function update() {

	filter.update();

}
