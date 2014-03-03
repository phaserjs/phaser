
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

	game.load.image('phaser', 'assets/sprites/phaser1.png');
	game.load.spritesheet('arrows', 'assets/sprites/arrows.png', 23, 31);

}

var arrowStart;
var arrowEnd;
var sprite;

function create() {

	game.stage.backgroundColor = '#2384e7';

	// game.physics.setBoundsToWorld(true, true, false, false);

	// arrowStart = game.add.sprite(100, 100, 'arrows', 0);
	// arrowEnd = game.add.sprite(400, 100, 'arrows', 1);

	// sprite = game.add.sprite(100, 164, 'phaser');
	sprite = game.add.sprite(300, 364, 'phaser');
	// sprite.anchor.setTo(0.5, 0.5);
	sprite.inputEnabled = true;
	sprite.body.collideWorldBounds = true;
	sprite.body.bounce.setTo(1, 1);
	sprite.alpha = 0.2;

	// sprite.body.allowRotation = true;
	// sprite.body.polygon.translate(100, 0);


	// sprite.body.setPolygon([new SAT.Vector(0,0), new SAT.Vector(60, 0), new SAT.Vector(100, 40), new SAT.Vector(60, 80), new SAT.Vector(0, 80)], -50, -40);

	sprite.body.setPolygon([new SAT.Vector(0,50), new SAT.Vector(100, 50), new SAT.Vector(100, 0), new SAT.Vector(150, 0), new SAT.Vector(150, 150), new SAT.Vector(100, 150), new SAT.Vector(100, 100), new SAT.Vector(0, 100), new SAT.Vector(0, 50)], -100, -100);


	// sprite.body.setCircle(50);
	// sprite.body.offset.setTo(50, 50);

	// console.log(sprite.body.x, sprite.body.y, sprite.body.shape.radius);

	sprite.events.onInputDown.add(move, this);

	// sprite.body.polygons.rotate(0.4);
	// sprite.rotation = 0.4;

	// console.log(sprite.body.polygons);

}

function move() {

	console.log('move');

	sprite.body.velocity.x = 200;
	sprite.body.velocity.y = -200;
	// sprite.body.angularVelocity = 2;

	// sprite.rotation = 0.4;

	// console.log(sprite.body.polygon.points);

    // to: function (properties, duration, ease, autoStart, delay, repeat, yoyo) {

	// game.add.tween(sprite).to( { angle: 359 }, 8000, Phaser.Easing.Linear.None, true, 0, 1000, false);

	// sprite.scale.setTo(2, 2);

	if (sprite.x === 100)
	{
		//	Here you'll notice we are using a relative value for the tween.
		//	You can specify a number as a string with either + or - at the start of it.
		//	When the tween starts it will take the sprites current X value and add +300 to it.

		// game.add.tween(sprite).to( { x: '+300' }, 2000, Phaser.Easing.Linear.None, true);
	}
	else if (sprite.x === 400)
	{
		// game.add.tween(sprite).to( { x: '-300' }, 2000, Phaser.Easing.Linear.None, true);
	}

}

function render() {

	if (sprite.x === 100 || sprite.x === 400)
	{
		// game.debug.text('Click sprite to tween', 32, 32);
	}

	// game.debug.text('x: ' + arrowStart.x, arrowStart.x, arrowStart.y - 4);
	// game.debug.text('x: ' + arrowEnd.x, arrowEnd.x, arrowEnd.y - 4);

	game.debug.text('sprite.x: ' + sprite.x + ' deltaX: ' + sprite.deltaX, 32, 32);
	game.debug.text('sprite.y: ' + sprite.y + ' deltaY: ' + sprite.deltaY, 32, 48);

	game.debug.physicsBody(sprite.body);

	game.debug.point(sprite.center);

}
