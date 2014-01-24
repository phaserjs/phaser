
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);

}

var sprite;
var sprite2;
var land;

function create() {

	game.stage.backgroundColor = '#124184';

	game.physics.gravity.y = 100;

	sprite = game.add.sprite(200, 300, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	// sprite.body.bounce.setTo(0.9, 0.9);

	// sprite2 = game.add.sprite(500, 200, 'gameboy', 2);
	// sprite2.name = 'green';
	// sprite2.body.collideWorldBounds = true;
	// sprite2.body.bounce.setTo(0.9, 0.9);

	land = game.add.sprite(10, 490);
	land.name = 'land';
	land.body.immovable = true;
	land.body.allowGravity = false;
	land.body.setSize(780, 100, 0, 0);
	land.body.polygons = new SAT.Polygon(new SAT.Vector(10, 490), [
		new SAT.Vector(0,50),
		new SAT.Vector(300,0),
		new SAT.Vector(780,50),
		new SAT.Vector(780,100),
		new SAT.Vector(0,100),
	]);
	console.log(land);
	sprite.body.velocity.x = 100;

	game.input.onDown.add(launch, this);

}

function launch() {

	sprite.body.velocity.x = 100;
	sprite.body.velocity.y = -300;
	sprite2.body.velocity.x = 200;
	sprite2.body.velocity.y = -200;

}

/*
	Tweening body scale test!

	sprite = game.add.sprite(300, 300, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	// sprite.body.checkCollision.right = false;
	sprite.body.bounce.setTo(1, 1);
	sprite.body.friction = 0;
	// sprite.scale.setTo(2, 2);

	sprite2 = game.add.sprite(500, 300, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(1, 1);
	sprite2.body.friction = 0;

	game.add.tween(sprite.scale).to({x: 3, y: 3}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    // to: function (properties, duration, ease, autoStart, delay, repeat, yoyo) {


*/

function update() {

	// game.physics.collide(sprite, land);

	if (sprite.body.overlap(land.body))
	{
		console.log('o', sprite.body.response);
		sprite.body.separate(land.body);
	}


	// game.physics.collide(sprite, sprite2);
	// game.physics.collide(sprite2, land);

}

function render() {

	game.debug.renderPolygon(land.body.polygons);

	if (sprite)
	{
		game.debug.renderBodyInfo(sprite, 16, 24);
	}

	if (sprite)
	{
		game.debug.renderPolygon(sprite.body.polygons);
	}

	if (sprite2)
	{
		game.debug.renderPolygon(sprite2.body.polygons);
	}

	game.debug.renderRectangle(land.body);


}
