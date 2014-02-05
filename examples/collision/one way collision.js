
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);
	game.load.image('atari', 'assets/sprites/atari130xe.png');

}

var sprite;
var sprite2;
var sprite3;

function create() {

	game.stage.backgroundColor = '#124184';

	//	In this example the little Gameboy sprite can pass through the top/bottom of the Atari sprite
	//	Because it's set to ignore collisions on its top/bottom faces.

	sprite = game.add.sprite(300, 200, 'atari');
	sprite.name = 'atari';
	sprite.body.collideWorldBounds = true;
	sprite.body.checkCollision.up = false;
	sprite.body.checkCollision.down = false;
	sprite.body.immovable = true;

	sprite2 = game.add.sprite(350, 400, 'gameboy', 2);
	sprite2.name = 'gameboy';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(1, 1);

	sprite3 = game.add.sprite(0, 210, 'gameboy', 4);
	sprite3.name = 'gameboy2';
	sprite3.body.collideWorldBounds = true;
	sprite3.body.bounce.setTo(1, 1);

	sprite2.body.velocity.y = -200;
	sprite3.body.velocity.x = 200;

}

function update() {

	game.physics.collide(sprite, sprite2);
	game.physics.collide(sprite, sprite3);

}

function render() {

	// game.debug.renderBodyInfo(sprite, 16, 24);

	game.debug.renderPhysicsBody(sprite.body);
	game.debug.renderPhysicsBody(sprite2.body);

}
