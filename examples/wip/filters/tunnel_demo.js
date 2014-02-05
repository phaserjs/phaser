
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

var background;
var filter;

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser.png');
    game.load.image('texture2', 'wip/tex00.jpg');
    game.load.image('texture', 'assets/textures/ooze.png');
    game.load.script('tunnel', '../filters/Tunnel.js');

}

function create() {

	background = game.add.sprite(0, 0, 'texture');
	background.width = 800;
	background.height = 600;

	filter = game.add.filter('Tunnel', 800, 600, background.texture);

	//	You have the following value to play with (default value is 2.0):
	filter.origin = 1.0;

	background.filters = [filter];

	var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
	logo.anchor.setTo(0.5, 0.5);

}

function update() {

	filter.update();

	//	Uncomment for coolness :)
	filter.origin = filter.origin + 0.001;

}
