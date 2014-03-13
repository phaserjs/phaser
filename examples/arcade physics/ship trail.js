
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('chunk', 'assets/sprites/chunk.png');
	game.load.image('arrow', 'assets/sprites/asteroids_ship.png');

}

var sprite;
var bmd;

function create() {

	//	Click on the left or right of the game to shoot the space ship in that direction

	game.stage.backgroundColor = '#124184';

	bmd = game.add.bitmapData(800, 600);
	bmd.context.fillStyle = '#ffffff';

	var bg = game.add.sprite(0, 0, bmd);

	game.physics.arcade.gravity.y = 100;

	sprite = game.add.sprite(32, 450, 'arrow');
	sprite.anchor.set(0.5);

	game.physics.enable(sprite, Phaser.Physics.ARCADE);

	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.set(0.8);

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

	bmd.context.fillStyle = '#ffff00';
	bmd.context.fillRect(sprite.x, sprite.y, 2, 2);

}

function render() {

	game.debug.bodyInfo(sprite, 32, 32);

}
