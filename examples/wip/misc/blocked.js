
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('chunk', 'assets/sprites/chunk.png');
	game.load.image('arrow', 'assets/sprites/asteroids_ship.png');
	game.load.image('p', 'assets/sprites/mushroom2.png');
	game.load.image('ball', 'assets/sprites/shinyball.png');

}

var sprite;
var sprite2;

var track;
var bmd;

function create() {

	game.stage.backgroundColor = '#124184';

	bmd = game.add.bitmapData(800, 600);
	bmd.fillStyle('#ffffff');
	var bg = game.add.sprite(0, 0, bmd);
	bg.body.moves = false;

	test9();

}

//	stacked
function test9() {

	game.physics.gravity.y = 500;

	sprite = game.add.sprite(400, 100, 'ball');
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.8, 0.8);
	sprite.body.minBounceVelocity = 0.8;

	sprite2 = game.add.sprite(400, 300, 'ball');
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.5, 0.5);
	sprite2.body.minBounceVelocity = 0.8;

	// game.input.onDown.add(launch8, this);

}

//	gravity into floor jiggle
function test8() {

	game.physics.gravity.y = 1000;

	sprite = game.add.sprite(400, 100, 'ball');
	sprite.body.collideWorldBounds = true;
	//	it's all about tweaking these values
	sprite.body.bounce.setTo(0.8, 0.8);
	sprite.body.minBounceVelocity = 1.2;
	sprite.body.velocity.x = -400;
	sprite.body.linearDamping = 1.2;

	sprite2 = game.add.sprite(500, 100, 'ball');
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.5, 0.5);
	sprite2.body.minBounceVelocity = 0.8;
	sprite2.body.linearDamping = 0.5;

	game.input.onDown.add(launch8, this);

}

function launch8() {

	// sprite.body.velocity.x = -200;
	sprite2.body.velocity.x = 200;

}

//	both sprites are shot into each other vertically
function test7() {

	// game.physics.gravity.y = 50;

	sprite = game.add.sprite(400, 600, 'ball');
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.8, 0.8);

	sprite2 = game.add.sprite(400, 100, 'ball');
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.8, 0.8);

	track = sprite2;

	game.input.onDown.add(launch7, this);

}

function launch7() {

	sprite.body.velocity.y = -200;
	// sprite2.body.velocity.y = 200;

}


//	sprite is on the bottom, blocked by the world bounds, sprite2 falls onto it via gravity only
function test6() {

	game.physics.gravity.y = 100;

	sprite = game.add.sprite(380, 600, 'p');
	sprite.body.collideWorldBounds = true;

	sprite2 = game.add.sprite(400, 100, 'ball');
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.8, 0.8);

	track = sprite2;

}

//	sprite is on the bottom, blocked by the world bounds, sprite2 falls onto it
function test5() {

	game.physics.gravity.y = 50;

	sprite = game.add.sprite(400, 600, 'ball');
	sprite.body.collideWorldBounds = true;

	sprite2 = game.add.sprite(400, 100, 'ball');
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.8, 0.8);

	track = sprite2;

	game.input.onDown.add(launch5, this);

}

function launch5() {

	sprite2.body.velocity.y = 200;

}


//	bounce both sprites into each other, one with lots less velocity - checking newtons craddle approach
function test4() {

	game.physics.gravity.y = 100;

	sprite = game.add.sprite(780, 400, 'ball');
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.8, 0.8);

	sprite2 = game.add.sprite(0, 400, 'ball');
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.8, 0.8);

	track = sprite2;

	game.input.onDown.add(launch4, this);

}

function launch4() {

	sprite.body.velocity.x = 70;
	sprite2.body.velocity.x = -250;

}

//	bounce both sprites into each other, identical bounce + velocity
function test3() {

	game.physics.gravity.y = 100;

	sprite = game.add.sprite(780, 400, 'p');
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.8, 0.8);

	sprite2 = game.add.sprite(0, 400, 'p');
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.8, 0.8);

	track = sprite2;

	game.input.onDown.add(launch3, this);

}

function launch3() {

	sprite.body.velocity.x = 225;
	sprite2.body.velocity.x = -225;

}

//	sprite is on the right, blocked by the world bounds, sprite2 bounces into it
function test2() {

	game.physics.gravity.y = 100;

	sprite = game.add.sprite(780, 400, 'p');
	sprite.body.collideWorldBounds = true;

	sprite2 = game.add.sprite(0, 400, 'p');
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.8, 0.8);

	track = sprite2;

	game.input.onDown.add(launch2, this);

}

function launch2() {

	sprite2.body.velocity.x = -225;

}

//	sprite is on the left, blocked by the world bounds, sprite2 bounces into it
function test1() {

	game.physics.gravity.y = 100;

	sprite = game.add.sprite(0, 400, 'p');
	sprite.body.collideWorldBounds = true;

	sprite2 = game.add.sprite(700, 400, 'p');
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.8, 0.8);

	track = sprite2;

	game.input.onDown.add(launch1, this);

}

function launch1() {

	sprite2.body.velocity.x = -225;

}

function update() {

	game.physics.collide(sprite, sprite2);

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
		game.debug.bodyInfo(sprite, 16, 24);
	}

	if (sprite2)
	{
		game.debug.bodyInfo(sprite2, 16, 190);
	}

}
