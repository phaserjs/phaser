
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

	sprite = game.add.sprite(32, 450, 'arrow');
	sprite.anchor.setTo(0.5, 0.5);

	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.8, 0.8);

	sprite.body.linearDamping = 0.1;

	game.input.onDown.add(launch, this);

}

function launch() {

	if (game.input.x < 400)
	{
		sprite.body.velocity.setTo(-200, -200);
	}
	else
	{
		sprite.body.velocity.setTo(200, -200);
	}

}

function update() {

	sprite.rotation = sprite.body.angle;

	bmd.fillStyle('#ffff00');
	bmd.fillRect(sprite.x, sprite.y, 2, 2);

}

function render() {

	game.debug.bodyInfo(sprite, 16, 24);

}
