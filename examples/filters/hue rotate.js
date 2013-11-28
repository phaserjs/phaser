
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

var background;
var filter;

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser2.png');
    game.load.script('filter', '../filters/HueRotate.js');
    // game.load.image('texture', 'assets/textures/ooze.png');
    game.load.image('texture', 'assets/pics/ra_einstein.png');

}

function create() {

	var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'texture');
	logo.anchor.setTo(0.5, 0.5);
	logo.texture.baseTexture._powerOf2 = true;


	background = game.add.sprite(0, 0);
	background.width = logo.width;
	background.height = logo.height;

	filter = game.add.filter('HueRotate', logo.width, logo.height, logo.texture);
	// filter.alpha = 0.0;

	background.filters = [filter];

}

function update() {

	filter.update();

}
