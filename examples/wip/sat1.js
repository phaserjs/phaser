
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);

}

var sprite;
var sprite2;
var sprite3;

var bmd;

var b1;
var b2;
var b3;

var r;

function create() {

	// game.stage.backgroundColor = '#124184';
	game.stage.backgroundColor = '#000';

	test1();

	bmd = game.add.bitmapData(800, 600);
	var bg = game.add.sprite(0, 0, bmd);
	bg.body.moves = false;

	bmd.clear();
	bmd.context.lineWidth = 1;

}

function test1() {

	sprite = game.add.sprite(500, 400, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.bounce.x = 0.8;
	// sprite.body = null;

	sprite2 = game.add.sprite(0, 400, 'gameboy', 2);
	sprite2.name = 'green';
	// sprite2.body = null;

	sprite3 = game.add.sprite(700, 400, 'gameboy', 3);
	sprite3.name = 'yellow';
	// sprite3.body = null;

	b1 = new SAT.Box(new SAT.Vector(sprite.x, sprite.y), sprite.width, sprite.height);
	b2 = new SAT.Box(new SAT.Vector(sprite2.x, sprite2.y), sprite2.width, sprite2.height);
	b3 = new SAT.Box(new SAT.Vector(sprite3.x, sprite3.y), sprite3.width, sprite3.height);

	r = new SAT.Response();

	console.log(b2);

	game.input.onDown.add(launch1, this);

}

function launch1() {

	// console.log(b1);

	sprite.body.velocity.x = -200;
	// sprite2.body.velocity.x = -225;

}


function update() {

	b1.pos.x = sprite.x;
	b1.pos.y = sprite.y;

	b2.pos.x = sprite2.x;
	b2.pos.y = sprite2.y;

	b3.pos.x = sprite3.x;
	b3.pos.y = sprite3.y;

	if (SAT.testPolygonPolygon(b1.toPolygon(), b2.toPolygon(), r))
	{
		console.log(r, b1.pos, b2.pos);

		// b1.pos.sub(r.overlapV);
		// sprite.body.velocity.x *= -sprite.body.bounce.x;

		sprite.body.velocity.x = 0;

		sprite.x += Math.abs(r.overlapV.x) + 1;
		console.log('sprite moved to', sprite.x);
		// sprite.x = b1.pos.x;
		// sprite.y = b1.pos.y;
	}

	bmd.clear();

	if (sprite)
	{
		bmd.fillStyle('rgba(255,0,0,0.8');
		bmd.fillRect(b1.pos.x, b1.pos.y, b1.w, b1.h);
	}

	if (sprite2)
	{
		bmd.fillStyle('rgba(0,255,0,0.8');
		bmd.fillRect(b2.pos.x, b2.pos.y, b2.w, b2.h);
	}

	if (sprite3)
	{
		bmd.fillStyle('rgba(0,0,255,0.8');
		bmd.fillRect(b3.pos.x, b3.pos.y, b3.w, b3.h);
	}

}

function render() {

	if (sprite)
	{
		// game.debug.renderBodyInfo(sprite, 16, 24);
		game.debug.renderText(sprite.name + ' x: ' + sprite.x, 16, 500);
	}

	if (sprite2)
	{
		// game.debug.renderBodyInfo(sprite2, 16, 190);
		game.debug.renderText(sprite2.name + ' x: ' + sprite2.x, 400, 500);
	}

}
