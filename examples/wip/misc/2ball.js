
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
var group;
var flag = false;

var bmd;

function create() {

	game.stage.backgroundColor = '#124184';

	bmd = game.add.bitmapData(800, 600);
	bmd.fillStyle('#ffffff');
	var bg = game.add.sprite(0, 0, bmd);
	bg.body.moves = false;

	test12();

}

function test12() {

	// game.physics.gravity.y = 150;

	sprite = game.add.sprite(200, 300, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.checkCollision.right = false;
	// sprite.body.checkCollision.up = false;
	// sprite.body.immovable = true;

	sprite2 = game.add.sprite(400, 358, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.9, 0.9);

	game.input.onDown.add(launch12, this);

}

function launch12() {

	sprite2.body.velocity.x = -200;
	// sprite2.body.velocity.y = -60;

}

function test11() {

	// game.physics.gravity.y = 150;

	sprite = game.add.sprite(300, 200, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	// sprite.body.checkCollision.down = false;
	// sprite.body.checkCollision.up = false;
	sprite.body.checkCollision.right = false;
	// sprite.body.immovable = true;

	sprite2 = game.add.sprite(290, 400, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.9, 0.9);

	game.input.onDown.add(launch11, this);

}

function launch11() {

	sprite2.body.velocity.y = -200;

}

function test10() {

	// game.physics.gravity.y = 150;

	sprite = game.add.sprite(300, 200, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.checkCollision.down = false;

	sprite2 = game.add.sprite(330, 400, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.9, 0.9);

	game.input.onDown.add(launch10, this);

}

function launch10() {

	sprite2.body.velocity.y = -100;

}

function test9() {

	// game.physics.gravity.y = 150;

	sprite = game.add.sprite(300, 400, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.checkCollision.up = false;
	// sprite.body.checkCollision.right = false;

	sprite2 = game.add.sprite(330, 100, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.9, 0.9);

	game.input.onDown.add(launch9, this);

}

function launch9() {

	sprite2.body.velocity.y = 100;

}

function test8() {

	game.physics.gravity.y = 150;

	sprite = game.add.sprite(300, 400, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.checkCollision.left = false;
	sprite.body.checkCollision.right = false;

	sprite2 = game.add.sprite(500, 400, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.9, 0.9);

	game.input.onDown.add(launch8, this);

}

function launch8() {

	sprite.body.velocity.x = -50;
	sprite2.body.velocity.x = -200;

}



function test7() {

	game.physics.gravity.y = 200;

	sprite = game.add.sprite(0, 300, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.8, 0.8);

	// sprite.body.velocity.y = 100;

	// sprite.body.gravity.y = 200;

	// sprite.body.linearDamping = 0.2;

	game.input.onDown.add(launch7, this);

}

function launch7() {

	sprite.body.velocity.x = -200;
	sprite.body.velocity.y = 200;

}




function test6() {

	game.physics.gravity.y = 100;

	sprite = game.add.sprite(300, 200, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.5, 0.5);

	game.input.onDown.add(launch6, this);

}

function launch6() {

	sprite.body.velocity.x = 200;
	sprite.body.velocity.y = -200;

}




function test5() {

	sprite = game.add.sprite(0, 600, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	// sprite.body.bounce.setTo(0.9, 0.9);

	game.input.onDown.add(launch5, this);

}

function launch5() {

	sprite.body.velocity.x = 100;
	sprite.body.velocity.y = -100;
    game.time.events.add(Phaser.Timer.SECOND * 4, stop5, this);

}

function stop5() {

	sprite.body.velocity.x = -100;
	// sprite.body.velocity.y = 100;
	console.log(sprite.x, sprite.body.x);

}







function test4() {

	game.physics.gravity.y = 150;

	sprite = game.add.sprite(300, 0, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.9, 0.9);

	sprite2 = game.add.sprite(310, 500, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	// sprite2.body.bounce.setTo(0.9, 0.9);

	game.input.onDown.add(launch4, this);

}

function launch4() {

	sprite.body.velocity.y = 200;

}

function test3() {

	game.physics.gravity.y = 50;

	// group = game.add.group();

	sprite = game.add.sprite(500, 400, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(0.9, 0.9);

	sprite2 = game.add.sprite(100, 400, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.9, 0.9);

	// sprite2.body.immovable = true;
	// sprite2.body.bounce.setTo(0.5, 0.5);

	sprite3 = game.add.sprite(700, 400, 'gameboy', 3);
	sprite3.name = 'yellow';
	sprite3.body.collideWorldBounds = true;
	sprite3.body.bounce.setTo(0.5, 0.5);

	// sprite.body.velocity.x = -300;
	// sprite.body.velocity.y = -200;

	// group.add(sprite);
	// group.add(sprite2);
	// group.add(sprite3);

	game.input.onDown.add(launch3, this);

}

function launch3() {

	sprite.body.velocity.x = -200;
	sprite.body.velocity.y = -200;

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

	// game.physics.collide(group, group);

	if (sprite3)
	{
		game.physics.collide(sprite, [sprite2, sprite3]);
		game.physics.collide(sprite2, sprite3);
	}
	else
	{
		game.physics.collide(sprite, sprite2);
	}


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

	if (sprite3)
	{
		bmd.fillStyle('#0000ff');
		bmd.fillRect(sprite3.body.center.x, sprite3.body.center.y, 2, 2);
	}

}

function render() {

	if (sprite)
	{
		game.debug.bodyInfo(sprite2, 16, 24);
		// game.debug.text(sprite.name + ' x: ' + sprite.x.toFixed(2) + '  dx: ' + sprite.body._dx.toFixed(2), 16, 500);
		// game.debug.text(sprite.name + ' y: ' + sprite.y.toFixed(2) + '  dy: ' + sprite.body._dy.toFixed(2), 16, 520);
	}

	if (sprite2)
	{
		// game.debug.bodyInfo(sprite2, 16, 190);
		// game.debug.text(sprite2.name + ' x: ' + sprite2.x, 400, 500);
	}

}
