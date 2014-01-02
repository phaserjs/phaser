
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('chunk', 'assets/sprites/chunk.png');

}

var sprite;
var bmd;

function create() {

	game.stage.backgroundColor = '#2384e7';

	bmd = game.add.bitmapData(800, 600);
	bmd.fillStyle('#ffffff');
	game.add.sprite(0, 0, bmd);

	sprite = game.add.sprite(32, 600, 'chunk');

	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.5, 0.5);
	sprite.body.drag.setTo(0, -20);
	// sprite.body.drag.setTo(2, 0);
	// sprite.body.sleepMin.setTo(-50, -20);
	// sprite.body.sleepMax.setTo(50, 20);
	// sprite.body.sleepDuration = 1000;

	sprite.body.sleepMin.setTo(0, -5);
	sprite.body.sleepMax.setTo(0, 5);
	sprite.body.sleepDuration = 1000;

	game.input.onDown.add(launch, this);

}

function launch() {

	sprite.body.velocity.setTo(0, -300);

	// sprite.body.gravity.setTo(0, 200);

}

function update() {

	bmd.fillRect(sprite.x, sprite.y, 2, 2);

}

function render() {

	game.debug.renderBodyInfo(sprite, 16, 16);

}
