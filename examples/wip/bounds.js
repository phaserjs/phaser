
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('pic', 'assets/sprites/exocet_spaceman.png');

}

var sprite;

function create() {

	game.stage.backgroundColor = '#997683';

	sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'pic');
	sprite.anchor.setTo(0.5);

}


function update() {

	sprite.rotation += 0.01;

}

function render() {

	game.debug.geom(sprite.getLocalBounds(), 'rgb(255, 255, 255)', false);

}
