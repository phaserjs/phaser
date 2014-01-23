
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);

}

var sprite;
var sprite2;

var land;

function create() {

	game.stage.backgroundColor = '#124184';

	// game.physics.gravity.y = 100;

	sprite = game.add.sprite(0, 300, 'gameboy', 0);
	sprite.name = 'red';
	sprite.body.collideWorldBounds = true;
	// sprite.body.checkCollision.right = false;
	sprite.body.bounce.setTo(0.9, 0.9);
	// sprite.body.bounce.setTo(1, 1);
	// sprite.body.friction = 0;
	// sprite.scale.setTo(2, 2);

	// sprite2 = game.add.sprite(500, 300, 'gameboy', 2);
	sprite2 = game.add.sprite(500, 300, 'gameboy', 2);
	sprite2.name = 'green';
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(0.9, 0.9);
	// sprite2.body.bounce.setTo(1, 1);
	// sprite2.body.friction = 0;

	land = new SAT.Polygon(new SAT.Vector(), [
		new SAT.Vector(),
		new SAT.Vector(100,0),
		new SAT.Vector(50,75),
	]);

	land.pos.x = 300;
	land.pos.y = 500;

	// sprite2.x = sprite.body.right + 10;
	// sprite2.y = sprite.body.bottom + 10;

	// sprite.x = 300;
	// sprite.y = 100;
	// sprite2.x = 300;
	// sprite2.y = 300;

	// sprite2.body.velocity.y = -100;
	sprite2.body.velocity.x = -300;

	// game.add.tween(sprite.scale).to({x: 3, y: 3}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    // to: function (properties, duration, ease, autoStart, delay, repeat, yoyo) {

	game.input.onDown.add(launch, this);

}

function launch() {

	// sprite.body.velocity.x = 150;
	// sprite.body.velocity.x = -400;
	// sprite.body.velocity.y = -400;
	sprite2.body.velocity.x = -100;
	sprite2.body.velocity.y = -100;

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

	game.physics.collide(sprite, sprite2);

}

function render() {

	game.debug.renderPolygon(land);


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


}
