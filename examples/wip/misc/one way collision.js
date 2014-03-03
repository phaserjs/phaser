
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);
	game.load.image('atari', 'assets/sprites/atari130xe.png');

}

var sprite;
var sprite2;
var sprite3;
var reverse = false;

function onBeginContact(a, b) {
	console.log('Begin Contact between', a.name, 'and', b.name);
}

function onEndContact(a, b) {
	console.log('End Contact between', a.name, 'and', b.name);
}

function create() {

	game.stage.backgroundColor = '#124184';

	test8();

}

function test8() {

	//	A up into B

	sprite = game.add.sprite(300, 200, 'atari');
	sprite.name = 'atari';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(1, 1);
	sprite.body.checkCollision.up = false;
	sprite.body.checkCollision.down = false;

	sprite2 = game.add.sprite(350, 400, 'gameboy', 2);
	sprite2.name = 'gameboy';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(1, 1);

	sprite2.events.onBeginContact.add(onBeginContact, this);
	sprite2.events.onEndContact.add(onEndContact, this);

	reverse = true;

	game.input.onDown.add(launch8, this);

}

function launch8() {

	sprite2.body.velocity.x = -100;
	sprite2.body.velocity.y = -200;

}

function test7() {

	//	A down into B

	sprite = game.add.sprite(300, 400, 'atari');
	sprite.name = 'atari';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(1, 1);
	sprite.body.checkCollision.up = false;

	sprite2 = game.add.sprite(350, 100, 'gameboy', 2);
	sprite2.name = 'gameboy';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(1, 1);

	// reverse = true;

	game.input.onDown.add(launch7, this);

}

function launch7() {

	sprite2.body.velocity.y = 100;

}

function test6() {

	//	Offset Down Collision false

	sprite = game.add.sprite(100, 300, 'atari');
	sprite.name = 'atari';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(1, 1);
	sprite.body.checkCollision.left = false;
	sprite.body.checkCollision.right = false;

	sprite2 = game.add.sprite(500, 330, 'gameboy', 2);
	// sprite2 = game.add.sprite(500, 530, 'gameboy', 2);
	sprite2.name = 'gameboy';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(1, 1);

	sprite3 = game.add.sprite(400, 100, 'gameboy', 0);
	sprite3.name = 'gameboy2';
	sprite3.body.collideWorldBounds = true;
	sprite3.body.bounce.setTo(1, 1);

	game.input.onDown.add(launch6, this);

}

function launch6() {

	sprite.body.velocity.x = 100;
	sprite2.body.velocity.x = -100;
	sprite3.body.velocity.y = 100;

}

function test5() {

	//	Offset Down Collision false

	sprite = game.add.sprite(360, 400, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	// sprite.body.bounce.setTo(0.9, 0.9);
	sprite.body.checkCollision.up = false;

	sprite2 = game.add.sprite(400, 200, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	// sprite2.body.checkCollision.down = false;
	// sprite2.body.mass = 1;
	sprite2.body.bounce.setTo(1, 1);
	// sprite2.body.linearDamping = 0;

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
	// sprite2.body.linearDamping = 0;

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
	// sprite2.body.linearDamping = 0;

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
	// sprite.body.linearDamping = 0;
	// sprite.scale.setTo(2, 2);
	// sprite.body.mass = 2;

	sprite2 = game.add.sprite(500, 300, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.checkCollision.left = false;
	// sprite2.body.bounce.setTo(0.9, 0.9);
	// sprite2.body.mass = 1;
	// sprite2.body.bounce.setTo(1, 1);
	// sprite2.body.linearDamping = 0;

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
	// sprite.body.linearDamping = 0;
	// sprite.scale.setTo(2, 2);
	// sprite.body.mass = 2;

	sprite2 = game.add.sprite(500, 300, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.9, 0.9);
	// sprite2.body.mass = 1;
	// sprite2.body.bounce.setTo(1, 1);
	// sprite2.body.linearDamping = 0;

	game.input.onDown.add(launch1, this);

}

function launch1() {

	sprite2.body.velocity.x = -200;

}

function update() {

	if (reverse)
	{
		game.physics.collide(sprite2, sprite);
	}
	else
	{
		game.physics.collide(sprite, sprite2);
	}

	if (sprite3)
	{
		game.physics.collide(sprite, sprite3);
	}

}

function render() {

	if (sprite)
	{
		game.debug.bodyInfo(sprite, 16, 24);
	}

	if (sprite)
	{
		game.debug.physicsBody(sprite.body);
	}

	if (sprite2)
	{
		game.debug.physicsBody(sprite2.body);
	}

	if (sprite3)
	{
		game.debug.physicsBody(sprite3.body);
	}

}
