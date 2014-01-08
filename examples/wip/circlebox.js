
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
	ball = game.add.sprite(420, 100, 'wizball');
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
	game.physics.overlap(ball, platform, null, processCallback, this);

}

function processCallback(a, b) {

	// console.log('p', a.y, b.y);

	if (Phaser.Circle.intersectsRectangle(circle, platform.body))
	{
		console.log('boom', ball.body.overlapX, ball.body.overlapY);
        // ball.body.x = ball.body.x - ball.body.overlapX;
        // ball.body.velocity.x = platform.body.velocity.x - ball.body.velocity.x * ball.body.bounce.x;

        ball.body.y -= 10;
        ball.body.velocity.y *= -1 * ball.body.bounce.y;
	}

	return true;

}

function render() {

	game.debug.renderText(Phaser.Circle.intersectsRectangle(circle, platform.body), 32, 32);
	game.debug.renderText(ball.body.velocity.y, 32, 64);
	// game.debug.renderText(ball.body.overlapY, 64, 64);
	game.debug.renderCircle(circle);
	game.debug.renderRectangle(platform.body);

}
