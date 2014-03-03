
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('wizball', 'assets/sprites/wizball.png');
	game.load.image('platform', 'assets/sprites/interference_tunnel.png');

}

var ball;
var circle;
var platform;

function create() {

	//	Our ball sprite
	ball = game.add.sprite(440, 100, 'wizball');
	ball.anchor.setTo(0.5, 0.5);

	ball.body.customSeparateX = true;
	ball.body.customSeparateY = true;

	ball.body.velocity.y = 150;
	ball.body.bounce.y = 0.9;

	//	Our collision circle
	circle = new Phaser.Circle(200, 100, 188);

	//	Our platform
	platform = game.add.sprite(200, 450, 'platform');
	platform.body.immovable = true;

}

function update() {

	// ball.x = game.input.x;
	// ball.y = game.input.y;

	circle.x = ball.x;
	circle.y = ball.y;

	//	This is a rect vs. rect collision. The callback will check the circle.
	game.physics.overlap(ball, platform, collisionCallback, processCallback, this);

}

function collisionCallback(a, b) {

    ball.body.y -= 10;
    ball.body.velocity.y *= -1 * ball.body.bounce.y;

}

function processCallback(a, b) {

	return (Phaser.Circle.intersectsRectangle(circle, platform.body));

}

function render() {

	game.debug.text(Phaser.Circle.intersectsRectangle(circle, platform.body), 32, 32);
	game.debug.text(ball.body.velocity.y, 32, 64);
	// game.debug.text(ball.body.overlapY, 64, 64);
	game.debug.circle(circle);
	game.debug.geom(platform.body);

}
