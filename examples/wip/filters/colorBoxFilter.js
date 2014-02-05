
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { create: create, update: update });

var background;
var filter;

function create() {

	//	Because we don't specify a texture it will revert to using __default, a 64x64 transparent PNG - ideal for applying a filter to
	background = game.add.sprite(0, 0);
	background.width = 800;
	background.height = 600;

	// filter = game.add.filter('SampleFilter', 800, 600, 0.5);
	filter = game.add.filter('BinarySerpents', 800, 600, 100, 5.0);

	background.filters = [filter];

}

function update() {

	filter.update();

}
