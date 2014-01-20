
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('chunk', 'assets/sprites/chunk.png');
	game.load.image('arrow', 'assets/sprites/asteroids_ship.png');
	game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	game.load.image('ball', 'assets/sprites/shinyball.png');
	game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);

}

var sprite;
var sprite2;
var sprite3;

var bmd;

function create() {

	game.stage.backgroundColor = '#124184';

	bmd = game.add.bitmapData(800, 600);
	bmd.fillStyle('#ffffff');
	var bg = game.add.sprite(0, 0, bmd);
	bg.body.moves = false;

	test3();

}

function test3() {

	// game.physics.gravity.y = 100;

	sprite = game.add.sprite(500, 400, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.5, 0.5);

	sprite2 = game.add.sprite(0, 400, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;

	sprite3 = game.add.sprite(700, 400, 'gameboy', 3);
	sprite3.name = 'yellow';
	sprite3.body.collideWorldBounds = true;

	sprite.body.velocity.x = -300;

	game.input.onDown.add(launch3, this);

}

function launch3() {

	sprite.body.velocity.x *= 10;

}

function test2() {

	// game.physics.gravity.y = 100;

	sprite = game.add.sprite(700, 400, 'ball');
	sprite.name = 'sprite1';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.8, 0.8);

	sprite2 = game.add.sprite(100, 400, 'ball');
	sprite2.name = 'sprite2';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.8, 0.8);
	sprite2.body.immovable = true;

	// sprite.body.velocity.x = -225;
	// sprite2.body.velocity.x = 225;


	game.input.onDown.addOnce(launch2, this);

}

function launch2() {

	sprite.body.velocity.x = -225;
	sprite2.body.velocity.x = 225;

}

function test1() {

	// game.physics.gravity.y = 100;

	sprite = game.add.sprite(100, 400, 'ball');
	sprite.name = 'sprite1';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.8, 0.8);

	sprite2 = game.add.sprite(700, 400, 'ball');
	sprite2.name = 'sprite2';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.8, 0.8);

	game.input.onDown.add(launch1, this);

}

function launch1() {

	sprite.body.velocity.x = 225;
	// sprite2.body.velocity.x = -225;

}

function update() {

	// game.physics.collide(sprite, sprite2);
	// game.physics.collide(sprite2, sprite3);
	game.physics.collideArray(sprite, [sprite2, sprite3]);

	// sprite.rotation = sprite.body.angle;

	if (sprite)
	{
		bmd.fillStyle('#ffff00');
		bmd.fillRect(sprite.body.center.x, sprite.body.center.y, 2, 2);
	}

	if (sprite2)
	{
		bmd.fillStyle('#ff00ff');
		bmd.fillRect(sprite2.body.center.x, sprite2.body.center.y, 2, 2);
	}

}

function render() {

	if (sprite)
	{
		game.debug.renderBodyInfo(sprite, 16, 24);
		game.debug.renderText(sprite.name + ' x: ' + sprite.x, 16, 500);
	}

	if (sprite2)
	{
		game.debug.renderBodyInfo(sprite2, 16, 190);
		game.debug.renderText(sprite2.name + ' x: ' + sprite2.x, 400, 500);
	}

}
