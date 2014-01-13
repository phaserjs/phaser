
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('chunk', 'assets/sprites/chunk.png');
	game.load.image('arrow', 'assets/sprites/asteroids_ship.png');

}

var sprite;
var bmd;

function create() {

	game.stage.backgroundColor = '#124184';

	bmd = game.add.bitmapData(800, 600);
	bmd.fillStyle('#ffffff');
	var bg = game.add.sprite(0, 0, bmd);
	bg.body.moves = false;

	game.physics.gravity.y = 100;

	// sprite = game.add.sprite(732, 0, 'chunk');

	// sprite = game.add.sprite(32, 450, 'chunk');
	sprite = game.add.sprite(32, 450, 'arrow');
	sprite.anchor.setTo(0.5, 0.5);

	sprite.body.collideWorldBounds = true;
	// sprite.body.bounce.setTo(0.5, 0.5);
	sprite.body.bounce.setTo(0.8, 0.8);

	//sprite.body.drag.setTo(0, -20);
	// sprite.body.drag.setTo(10, 10);
	sprite.body.friction = 0.1;

	// sprite.body.sleepMin.setTo(-50, -20);
	// sprite.body.sleepMax.setTo(50, 20);
	// sprite.body.sleepDuration = 1000;

	sprite.body.sleepMin.setTo(-5, -5);
	sprite.body.sleepMax.setTo(5, 5);
	sprite.body.sleepDuration = 500;
	// sprite.body.canSleep = false;

	game.input.onDown.add(launch, this);

}

function launch() {

	//	up and to the right
	sprite.body.velocity.setTo(200, -300);

	// sprite.body.velocity.setTo(-100, 300);
	// sprite.body.gravity.setTo(0, -100);

	// sprite.body.gravity.setTo(0, -100);

}

function update() {

	sprite.rotation = sprite.body.angle;

	// console.log(sprite.body.velocity.x);

	bmd.fillStyle('#ffffff');
	bmd.fillRect(sprite.x, sprite.y, 2, 2);

	// bmd.fillStyle('#ff0000');
	// bmd.fillRect(sprite.body.x, sprite.body.y, 2, 2);

}

function render() {

	game.debug.renderBodyInfo(sprite, 16, 24);

}
