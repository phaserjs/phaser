
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);

}

var sprite;
var sprite2;

function create() {

	game.stage.backgroundColor = '#124184';

	test5();

}

function test5() {

	//	Offset Down Collision false

	sprite = game.add.sprite(438, 400, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.9, 0.9);
	sprite.body.checkCollision.up = false;

	sprite2 = game.add.sprite(400, 200, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	// sprite2.body.checkCollision.down = false;
	// sprite2.body.mass = 1;
	// sprite2.body.bounce.setTo(1, 1);
	// sprite2.body.friction = 0;

	game.input.onDown.add(launch5, this);

}

function launch5() {

	// sprite.body.velocity.x = 200;
	// sprite.body.velocity.y = -300;
	// sprite2.body.velocity.x = -200;
	sprite2.body.velocity.y = 200;

}

function test4() {

	//	Down Collision false

	sprite = game.add.sprite(400, 400, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.9, 0.9);

	sprite2 = game.add.sprite(400, 200, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.checkCollision.down = false;
	// sprite2.body.mass = 1;
	// sprite2.body.bounce.setTo(1, 1);
	// sprite2.body.friction = 0;

	game.input.onDown.add(launch4, this);

}

function launch4() {

	// sprite.body.velocity.x = 200;
	sprite.body.velocity.y = -300;
	// sprite2.body.velocity.x = -200;
	// sprite2.body.velocity.y = -200;

}

function test3() {

	//	Top Collision false

	sprite = game.add.sprite(400, 400, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.checkCollision.up = false;

	sprite2 = game.add.sprite(400, 200, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	// sprite2.body.checkCollision.left = false;
	sprite2.body.bounce.setTo(0.9, 0.9);
	// sprite2.body.mass = 1;
	// sprite2.body.bounce.setTo(1, 1);
	// sprite2.body.friction = 0;

	game.input.onDown.add(launch3, this);

}

function launch3() {

	// sprite.body.velocity.x = 200;
	// sprite.body.velocity.y = -300;
	// sprite2.body.velocity.x = -200;
	sprite2.body.velocity.y = 200;

}

function test2() {

	//	Left Collision false

	sprite = game.add.sprite(200, 300, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	// sprite.body.checkCollision.right = false;
	sprite.body.bounce.setTo(0.9, 0.9);
	// sprite.body.friction = 0;
	// sprite.scale.setTo(2, 2);
	// sprite.body.mass = 2;

	sprite2 = game.add.sprite(500, 300, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.checkCollision.left = false;
	// sprite2.body.bounce.setTo(0.9, 0.9);
	// sprite2.body.mass = 1;
	// sprite2.body.bounce.setTo(1, 1);
	// sprite2.body.friction = 0;

	game.input.onDown.add(launch2, this);

}

function launch2() {

	sprite.body.velocity.x = 200;
	// sprite.body.velocity.y = -300;
	// sprite2.body.velocity.x = -200;
	// sprite2.body.velocity.y = -200;

}


function test1() {

	//	Right Collision false

	sprite = game.add.sprite(200, 300, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.checkCollision.right = false;
	// sprite.body.bounce.setTo(0.9, 0.9);
	// sprite.body.bounce.setTo(1, 1);
	// sprite.body.friction = 0;
	// sprite.scale.setTo(2, 2);
	// sprite.body.mass = 2;

	sprite2 = game.add.sprite(500, 300, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.9, 0.9);
	// sprite2.body.mass = 1;
	// sprite2.body.bounce.setTo(1, 1);
	// sprite2.body.friction = 0;

	game.input.onDown.add(launch1, this);

}

function launch1() {

	sprite2.body.velocity.x = -200;

}

function update() {

	game.physics.collide(sprite, sprite2);

}

function render() {

	if (sprite)
	{
		game.debug.renderBodyInfo(sprite, 16, 24);
	}

	if (sprite)
	{
		game.debug.renderPhysicsBody(sprite.body);
	}

	if (sprite2)
	{
		game.debug.renderPhysicsBody(sprite2.body);
	}

}
