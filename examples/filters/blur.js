
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser2.png');
    game.load.script('filterX', '../filters/BlurX.js');
    game.load.script('filterY', '../filters/BlurY.js');

}

function create() {

	var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
	logo.anchor.setTo(0.5, 0.5);

	var blurX = game.add.filter('BlurX');
	var blurY = game.add.filter('BlurY');

	logo.filters = [blurX, blurY];

}
