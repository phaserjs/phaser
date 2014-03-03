
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

	game.stage.backgroundColor = '#124184';

	test1();

	bmd = game.add.bitmapData(800, 600);
	var bg = game.add.sprite(0, 0, bmd);
	bg.body.moves = false;

	bmd.clear();
	bmd.context.lineWidth = 1;

}

function test1() {

	sprite = game.add.sprite(500, 400, 'gameboy', 0);
	// sprite = game.add.sprite(0, 0, 'gameboy', 0);
	sprite.name = 'red';
	// sprite.pivot.x = 20;
	// sprite.pivot.y = 30;
	// sprite.anchor.setTo(0.5, 0.5);

	// sprite.body.polygon.translate(20, 20);

	// sprite.body.polygon.rotate(game.math.degToRad(45));
	// sprite.angle = 45;

	// sprite.scale.setTo(2, 2);
	// sprite.body.polygon.scale(2, 2);

	sprite.body.bounce.x = 0.8;

	sprite2 = game.add.sprite(0, 400, 'gameboy', 2);
	sprite2.name = 'green';
	// sprite2.body = null;

	sprite3 = game.add.sprite(700, 400, 'gameboy', 3);
	sprite3.name = 'yellow';
	// sprite3.body = null;

	// b1 = new SAT.Box(new SAT.Vector(sprite.x, sprite.y), sprite.width, sprite.height);
	// b2 = new SAT.Box(new SAT.Vector(sprite2.x, sprite2.y), sprite2.width, sprite2.height);
	// b3 = new SAT.Box(new SAT.Vector(sprite3.x, sprite3.y), sprite3.width, sprite3.height);

	// r = new SAT.Response();

	// console.log(b2);

	game.input.onDown.add(launch1, this);

}

function launch1() {


	// console.log(b1);

	sprite.body.velocity.x = -100;
	// sprite2.body.velocity.x = -225;

}


function update() {

	// sprite.angle += 0.5;
	// sprite.body.polygon.rotate(game.math.degToRad(0.5));

	/*
	b1.pos.x = sprite.x;
	b1.pos.y = sprite.y;

	b2.pos.x = sprite2.x;
	b2.pos.y = sprite2.y;

	b3.pos.x = sprite3.x;
	b3.pos.y = sprite3.y;

	r.clear();

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
	*/

	sprite.body.collide(sprite2.body);

	bmd.clear();

	if (sprite)
	{
		renderPolygon(sprite.body.polygon);
		// bmd.fillStyle('rgba(255,0,0,0.8');
		// bmd.fillRect(sprite.body.polygon.pos.x, sprite.body.polygon.pos.y, sprite.body.shape.w, sprite.body.shape.h);
	}

	if (sprite2)
	{
		renderPolygon(sprite2.body.polygon);
		// bmd.fillStyle('rgba(0,255,0,0.8');
		// bmd.fillRect(sprite2.body.polygon.pos.x, sprite2.body.polygon.pos.y, sprite2.body.shape.w, sprite2.body.shape.h);
	}

	if (sprite3)
	{
		renderPolygon(sprite3.body.polygon);
		// bmd.fillStyle('rgba(0,0,255,0.8');
		// bmd.fillRect(sprite3.body.polygon.pos.x, sprite3.body.polygon.pos.y, sprite3.body.shape.w, sprite3.body.shape.h);
	}

}

function renderPolygon (polygon, color) {

// console.log(polygon);
    // this.start(0, 0, color);

    bmd.context.beginPath();
    bmd.context.moveTo(polygon.pos.x + polygon.points[0].x, polygon.pos.y + polygon.points[0].y);

    for (var i = 1; i < polygon.points.length; i++)
    {
        bmd.context.lineTo(polygon.pos.x + polygon.points[i].x, polygon.pos.y + polygon.points[i].y);
    }

    bmd.context.closePath();
    bmd.context.strokeStyle = 'rgba(255, 255, 255, 1)';
    // bmd.context.strokeStyle = color;
    bmd.context.stroke();

}


function render() {

	if (sprite)
	{
		// game.debug.bodyInfo(sprite, 16, 24);
		game.debug.text(sprite.name + ' x: ' + sprite.x, 16, 500);
		game.debug.text(sprite.name + ' world x: ' + sprite.world.x, 16, 520);
	}

	if (sprite2)
	{
		// game.debug.bodyInfo(sprite2, 16, 190);
		game.debug.text(sprite2.name + ' x: ' + sprite2.x, 400, 500);
	}

}
