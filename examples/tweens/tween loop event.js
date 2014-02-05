
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

var ball;
var tween;
var bounces = 10;

function create() {

    ball = game.add.sprite(400, 0, 'balls', 0);

    tween = game.add.tween(ball).to( { y: game.world.height - ball.height }, 1500, Phaser.Easing.Bounce.Out, true, 2500, 10);

    //	There is a 2.5 second delay at the start, then it calls this function
    tween.onStart.add(onStart, this);

    //	This tween will loop 10 times, calling this function every time it loops
    tween.onLoop.add(onLoop, this);

    //	When it completes it will call this function
    tween.onComplete.add(onComplete, this);

}

function onStart() {

	//	Turn off the delay, so it loops seamlessly from here on
	tween.delay(0);

}

function onLoop() {

	bounces--;

	if (ball.frame === 5)
	{
		ball.frame = 0;
	}
	else
	{
		ball.frame++;
	}

}

function onComplete() {

    tween = game.add.tween(ball).to( { x: 800 - ball.width }, 2000, Phaser.Easing.Exponential.Out, true);

}

function render() {

	game.debug.renderText('Bounces: ' + bounces, 32, 32);

}